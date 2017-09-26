import $ from 'jquery';
import * as util from './util';

class Pointer {
  constructor($element, id, parent) {
    this.$element = $element;
    this.uid = id;
    this.parent = parent;
    this.options = $.extend(true, {}, this.parent.options);
    this.direction = this.options.direction;
    this.value = null;
    this.classes = {
      active: `${this.parent.namespace}-pointer_active`
    };
  }

  mousedown(event) {
    const axis = this.parent.direction.axis;
    const position = this.parent.direction.position;
    const offset = this.parent.$wrap.offset();

    this.$element.trigger(`${this.parent.namespace}::moveStart`, this);

    this.data = {};
    this.data.start = event[axis];
    this.data.position = event[axis] - offset[position];

    const value = this.parent.getValueFromPosition(this.data.position);
    this.set(value);

    $.each(this.parent.pointer, (i, p) => {
      p.deactive();
    });

    this.active();

    this.mousemove = function (event) {
      const eventObj = util.getEventObject(event);
      const value = this.parent.getValueFromPosition(this.data.position + (eventObj[axis] || this.data.start) - this.data.start);
      this.set(value);

      event.preventDefault();
      return false;
    };
    this.mouseup = function () {
      $(document).off('.asRange mousemove.asRange touchend.asRange mouseup.asRange touchcancel.asRange');
      this.$element.trigger(`${this.parent.namespace}::moveEnd`, this);
      return false;
    };

    $(document).on('touchmove.asRange mousemove.asRange', $.proxy(this.mousemove, this))
      .on('touchend.asRange mouseup.asRange', $.proxy(this.mouseup, this));
    return false;
  }

  active() {
    this.$element.addClass(this.classes.active);
  }

  deactive() {
    this.$element.removeClass(this.classes.active);
  }

  set(value) {
    if (this.value === value) {
      return;
    }

    if (this.parent.step) {
      value = this.matchStep(value);
    }
    if (this.options.limit === true) {
      value = this.matchLimit(value);
    } else {
      if (value <= this.parent.min) {
        value = this.parent.min;
      }
      if (value >= this.parent.max) {
        value = this.parent.max;
      }
    }
    this.value = value;

    this.updatePosition();
    this.$element.focus();

    this.$element.trigger(`${this.parent.namespace}::move`, this);
  }

  updatePosition() {
    const position = {};

    position[this.parent.direction.position] = `${this.getPercent()}%`;
    this.$element.css(position);
  }

  getPercent() {
    return (this.value - this.parent.min) / this.parent.interval * 100;
  }

  get() {
    return this.value;
  }

  matchStep(value) {
    const step = this.parent.step;
    const decimal = step.toString().split('.')[1];

    value = Math.round(value / step) * step;

    if (decimal) {
      value = value.toFixed(decimal.length);
    }

    return parseFloat(value);
  }

  matchLimit(value) {
    let left;
    let right;
    const pointer = this.parent.pointer;

    if (this.uid === 1) {
      left = this.parent.min;
    } else {
      left = pointer[this.uid - 2].value;
    }

    if (pointer[this.uid] && pointer[this.uid].value !== null) {
      right = pointer[this.uid].value;
    } else {
      right = this.parent.max;
    }

    if (value <= left) {
      value = left;
    }
    if (value >= right) {
      value = right;
    }
    return value;
  }

  destroy() {
    this.$element.off('.asRange');
    this.$element.remove();
  }
}

export default Pointer;
