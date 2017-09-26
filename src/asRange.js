import $ from 'jquery';
import DEFAULTS from './defaults';
import Pointer from './pointer';
import scale from './scale';
import selected from './selected';
import tip from './tip';
import keyboard from './keyboard';
import * as util from './util';

const components = {};

/**
 * Plugin constructor
 **/
class asRange {
  constructor(element, options) {
    const metas = {};
    this.element = element;
    this.$element = $(element);

    if (this.$element.is('input')) {
      const value = this.$element.val();

      if (typeof value === 'string') {
        metas.value = value.split(',');
      }

      $.each(['min', 'max', 'step'], (index, key) => {
        const val = parseFloat(this.$element.attr(key));
        if (!isNaN(val)) {
          metas[key] = val;
        }
      });

      this.$element.css({
        display: 'none'
      });
      this.$wrap = $('<div></div>');
      this.$element.after(this.$wrap);
    } else {
      this.$wrap = this.$element;
    }

    this.options = $.extend({}, DEFAULTS, options, this.$element.data(), metas);
    this.namespace = this.options.namespace;
    this.components = $.extend(true, {}, components);
    if (this.options.range) {
      this.options.replaceFirst = false;
    }

    // public properties
    this.value = this.options.value;
    if (this.value === null) {
      this.value = this.options.min;
    }

    if (!this.options.range) {
      if ($.isArray(this.value)) {
        this.value = this.value[0];
      }
    } else if (!$.isArray(this.value)) {
      this.value = [this.value, this.value];
    } else if (this.value.length === 1) {
      this.value[1] = this.value[0];
    }

    this.min = this.options.min;
    this.max = this.options.max;
    this.step = this.options.step;
    this.interval = this.max - this.min;

    // flag
    this.initialized = false;
    this.updating = false;
    this.disabled = false;

    if (this.options.direction === 'v') {
      this.direction = {
        axis: 'pageY',
        position: 'top'
      };
    } else {
      this.direction = {
        axis: 'pageX',
        position: 'left'
      };
    }

    this.$wrap.addClass(this.namespace);

    if (this.options.skin) {
      this.$wrap.addClass(`${this.namespace}_${this.options.skin}`);
    }

    if (this.max < this.min || this.step >= this.interval) {
      throw new Error('error options about max min step');
    }

    this.init();
  }

  init() {
    this.$wrap.append(`<div class="${this.namespace}-bar" />`);

    // build pointers
    this.buildPointers();

    // initial components
    this.components.selected.init(this);

    if (this.options.tip !== false) {
      this.components.tip.init(this);
    }
    if (this.options.scale !== false) {
      this.components.scale.init(this);
    }

    // initial pointer value
    this.set(this.value);

    // Bind events
    this.bindEvents();

    this._trigger('ready');
    this.initialized = true;
  }

  _trigger(eventType, ...params) {
    const data = [this].concat(params);

    // event
    this.$element.trigger(`${this.namespace}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    const onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, params);
    }
  }

  buildPointers() {
    this.pointer = [];
    let pointerCount = 1;
    if (this.options.range) {
      pointerCount = 2;
    }
    for (let i = 1; i <= pointerCount; i++) {
      const $pointer = $(`<div class="${this.namespace}-pointer ${this.namespace}-pointer-${i}"></div>`).appendTo(this.$wrap);
      const p = new Pointer($pointer, i, this);
      this.pointer.push(p);
    }

    // alias of pointer
    this.p1 = this.pointer[0];

    if (this.options.range) {
      this.p2 = this.pointer[1];
    }
  }

  bindEvents() {
    const that = this;
    this.$wrap.on('touchstart.asRange mousedown.asRange', (event) => {
      /* eslint consistent-return: "off"*/
      if (that.disabled === true) {
        return;
      }
      event = util.getEventObject(event);
      const rightclick = event.which ? event.which === 3 : event.button === 2;
      if (rightclick) {
        return false;
      }

      const offset = that.$wrap.offset();
      const start = event[that.direction.axis] - offset[that.direction.position];
      const p = that.getAdjacentPointer(start);

      p.mousedown(event);
      return false;
    });

    if (this.$element.is('input')) {
      this.$element.on(`${this.namespace}::change`, () => {
        const value = this.get();
        this.$element.val(value);
      });
    }

    $.each(this.pointer, (i, p) => {
      p.$element.on(`${this.namespace}::move`, () => {
        that.value = that.get();
        if (!that.initialized || that.updating) {
          return false;
        }
        that._trigger('change', that.value);
        return false;
      });
    });
  }

  getValueFromPosition(px) {
    if (px > 0) {
      return this.min + px / this.getLength() * this.interval;
    }
    return 0;
  }

  getAdjacentPointer(start) {
    const value = this.getValueFromPosition(start);
    if (this.options.range) {
      const p1 = this.p1.value;
      const p2 = this.p2.value;
      const diff = Math.abs(p1 - p2);
      if (p1 <= p2) {
        if (value > p1 + diff / 2) {
          return this.p2;
        }
        return this.p1;
      }

      if (value > p2 + diff / 2) {
        return this.p1;
      }

      return this.p2;
    }
    return this.p1;
  }

  getLength() {
    if (this.options.direction === 'v') {
      return this.$wrap.height();
    }
    return this.$wrap.width();
  }

  update(options) {
    this.updating = true;
    $.each(['max', 'min', 'step', 'limit', 'value'], (key, value) => {
      if (options[value]) {
        this[value] = options[value];
      }
    });
    if (options.max || options.min) {
      this.setInterval(options.min, options.max);
    }

    if (!options.value) {
      this.value = options.min;
    }

    $.each(this.components, (key, value) => {
      if (typeof value.update === 'function') {
        value.update(this);
      }
    });

    this.set(this.value);

    this._trigger('update');

    this.updating = false;
  }

  get() {
    const value = [];

    $.each(this.pointer, (i, p) => {
      value[i] = p.get();
    });

    if (this.options.range) {
      return value;
    }

    if (value[0] === this.options.min) {
      if (typeof this.options.replaceFirst === 'string') {
        value[0] = this.options.replaceFirst;
      }
      if (typeof this.options.replaceFirst === 'object') {
        for (const key in this.options.replaceFirst) {
          if (Object.hasOwnProperty(this.options.replaceFirst, key)) {
            value[0] = key;
          }
        }
      }
    }

    return value[0];
  }

  set(value) {
    if (this.options.range) {
      if (typeof value === 'number') {
        value = [value];
      }
      if (!$.isArray(value)) {
        return;
      }
      $.each(this.pointer, (i, p) => {
        p.set(value[i]);
      });
    } else {
      this.p1.set(value);
    }

    this.value = value;
  }

  val(value) {
    if (value) {
      this.set(value);
      return this;
    }
    return this.get();
  }

  setInterval(start, end) {
    this.min = start;
    this.max = end;
    this.interval = end - start;
  }

  enable() {
    this.disabled = false;
    this.$wrap.removeClass(`${this.namespace}_disabled`);

    this._trigger('enable');
    return this;
  }

  disable() {
    this.disabled = true;
    this.$wrap.addClass(`${this.namespace}_disabled`);

    this._trigger('disable');
    return this;
  }

  destroy() {
    $.each(this.pointer, (i, p) => {
      p.destroy();
    });
    this.$wrap.destroy();

    this._trigger('destroy');
  }

  static registerComponent(component, methods) {
    components[component] = methods;
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

asRange.registerComponent('scale', scale);
asRange.registerComponent('selected', selected);
asRange.registerComponent('tip', tip);
keyboard();

export default asRange;
