import $ from 'jquery';
import asRange from './asRange';
import info from './info';

const NAMESPACE = 'asRange';
const OtherAsRange = $.fn.asRange;

function jQueryAsRange(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if (/^(get)$/.test(method) || method === 'val' && args.length === 0) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function () {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function () {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new asRange(this, options));
    }
  });
}

$.fn.asRange = jQueryAsRange;

$.asRange = $.extend({
  setDefaults: asRange.setDefaults,
  noConflict() {
    $.fn.asRange = OtherAsRange;
    return jQueryAsRange;
  }
}, info);
