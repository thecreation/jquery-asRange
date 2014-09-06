(function($) {

    $.asRange.registerComponent('tip', {
        defaults: {
            active: 'always' // 'always' 'onMove'
        },
        init: function(instance) {
            var self = this,
                opts = $.extend({}, this.defaults, instance.options.tip);

            this.opts = opts;
            this.classes = {
                tip: instance.namespace + '-tip',
                show: instance.namespace + '-tip-show'
            };
            $.each(instance.pointer, function(i, p) {
                var $tip = $('<span></span>').appendTo(instance.pointer[i].$element);

                $tip.addClass(self.classes.tip);
                if (self.opts.active === 'onMove') {
                    $tip.css({
                        display: 'none'
                    });
                    p.$element.on('asRange::pointer::end', function() {
                        self.hide($tip);
                        return false;
                    }).on('asRange::pointer::start', function() {
                        self.show($tip);
                        return false;
                    });
                }
                p.$element.on('asRange::pointer::change', function() {
                    var value;
                    if (instance.options.range) {
                        value = instance.get()[i];
                    } else {
                        value = instance.get();
                    }
                    if (typeof instance.options.format === 'function') {
                        value = instance.options.format(value);
                    }
                    $tip.text(value);
                    return false;
                });
            });
        },
        show: function($tip) {
            $tip.addClass(this.classes.show);
            $tip.css({
                display: 'block'
            });
        },
        hide: function($tip) {
            $tip.removeClass(this.classes.show);
            $tip.css({
                display: 'none'
            });
        }
    });
}(jQuery));
