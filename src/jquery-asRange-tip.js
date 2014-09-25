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
                    p.$element.on(instance.pluginName + '::moveEnd', function() {
                        self.hide($tip);
                        return false;
                    }).on(instance.pluginName + '::moveStart', function() {
                        self.show($tip);
                        return false;
                    });
                }
                p.$element.on(instance.pluginName + '::move', function() {
                    var value;
                    if (instance.options.range) {
                        value = instance.get()[i];
                    } else {
                        value = instance.get();
                    }
                    if (typeof instance.options.format === 'function') {
                        if (instance.options.replaceFirst && value === instance.options.replace) {
                            value = instance.options.replace;
                        } else {
                            value = instance.options.format(value);
                        }
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
