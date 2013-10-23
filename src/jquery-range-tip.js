// jquery range tip

$.range.registerComponent('tip', {
    defaults: {
        active: 'always' // 'always' 'onmove'
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
                $tip.css({ display: 'none'});
                p.$element.on('range::pointer::end', function() {
                    self.hide($tip);
                    return false;
                }).on('range::pointer::start', function() {
                    self.show($tip);
                    return false;
                });
            } 
            p.$element.on('range::pointer::change', function() {
                var value;
                if (typeof instance.options.format === 'function') {
                    value = instance.options.format(instance.get()[i]);
                } else {
                    value = instance.get()[i];
                }
                $tip.text(value);
                return false;
            });
        });
    },
    show: function($tip) {
        $tip.addClass(this.classes.show);
        $tip.css({display: 'block'});
    },
    hide: function($tip) {
        $tip.removeClass(this.classes.show);
        $tip.css({display: 'none'});
    }
});