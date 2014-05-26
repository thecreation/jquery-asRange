(function($) {
    $.asRange.registerComponent('selected', {
        defaults: {},
        init: function(instance) {
            var self = this;

            this.$arrow = $('<span></span>').appendTo(instance.$wrap);
            this.$arrow.addClass(instance.namespace + '-selected');

            if (instance.options.range === false) {
                instance.pointer[0].$wrap.on('asRange::pointer::change', function(e, pointer) {
                    var left = 0,
                        right = pointer.get();

                    self.$arrow.css({
                        left: 0,
                        width: (right - left) * 100 + '%'
                    });
                });
            }

            if (instance.options.range === true) {
                instance.pointer[0].$wrap.on('asRange::pointer::change', function(e, pointer) {
                    var left = pointer.get(),
                        right = instance.pointer[1].get();

                    self.$arrow.css({
                        left: Math.min(left, right) * 100 + '%',
                        width: Math.abs(right - left) * 100 + '%'
                    });
                });
                instance.pointer[1].$wrap.on('asRange::pointer::change', function(e, pointer) {
                    var right = pointer.get(),
                        left = instance.pointer[0].get();

                    self.$arrow.css({
                        left: Math.min(left, right) * 100 + '%',
                        width: Math.abs(right - left) * 100 + '%'
                    });
                });
            }
        }
    });
}(jQuery));
