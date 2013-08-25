// jquery range tip

$.range.registerComponent('tip', {
    defaults: {
        active: 'always' // 'always' 'onmove'
    },
    init: function(instance) {
        var self = this,
            opts = $.extend({}, this.defaults, instance.options.tip);

        this.opts = opts;

        this.tip = [];
        $.each(instance.pointer, function(i, p) {
            var $tip = $('<span class="' + instance.namespace + '-range-tip"></span>').appendTo(instance.pointer[i].$element);

            if (self.opts.active === 'onmove') {
                $tip.css({
                    display: 'none'
                });
                p.$element.on('change', function(e, pointer) {
                    $tip.text(pointer.get());

                    if (instance.initial === true) {
                        self.show();
                    }
                });

                p.$element.on('end', function(e, pointer) {
                    self.hide();
                });

            } else {
                p.$element.on('change', function(e, pointer) {
                    $tip.text(pointer.get());
                });
            }

            self.tip.push($tip);
        });
    },
    show: function() {
        $.each(this.tip, function(i, $tip) {
            $tip.fadeIn('slow');
        });
    },
    hide: function() {
        $.each(this.tip, function(i, $tip) {
            $tip.fadeOut('slow');
        });
    }
});