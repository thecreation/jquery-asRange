import $ from 'jquery';

export default {
  defaults: {
    active: 'always' // 'always' 'onMove'
  },
  init(instance) {
    const that = this;
    const opts = $.extend({}, this.defaults, instance.options.tip);

    this.opts = opts;
    this.classes = {
      tip: `${instance.namespace}-tip`,
      show: `${instance.namespace}-tip-show`
    };
    $.each(instance.pointer, (i, p) => {
      const $tip = $('<span></span>').appendTo(instance.pointer[i].$element);

      $tip.addClass(that.classes.tip);
      if (that.opts.active === 'onMove') {
        $tip.css({
          display: 'none'
        });
        p.$element.on(`${instance.namespace}::moveEnd`, () => {
          that.hide($tip);
          return false;
        }).on(`${instance.namespace}::moveStart`, () => {
          that.show($tip);
          return false;
        });
      }
      p.$element.on(`${instance.namespace}::move`, () => {
        let value;
        if (instance.options.range) {
          value = instance.get()[i];
        } else {
          value = instance.get();
        }
        if (typeof instance.options.format === 'function') {
          if (instance.options.replaceFirst && typeof value !== 'number') {
            if (typeof instance.options.replaceFirst === 'string') {
              value = instance.options.replaceFirst;
            }
            if (typeof instance.options.replaceFirst === 'object') {
              for (const key in instance.options.replaceFirst) {
                if (Object.hasOwnProperty(instance.options.replaceFirst, key)) {
                  value = instance.options.replaceFirst[key];
                }
              }
            }
          } else {
            value = instance.options.format(value);
          }
        }
        $tip.text(value);
        return false;
      });
    });
  },
  show($tip) {
    $tip.addClass(this.classes.show);
    $tip.css({
      display: 'block'
    });
  },
  hide($tip) {
    $tip.removeClass(this.classes.show);
    $tip.css({
      display: 'none'
    });
  }
};
