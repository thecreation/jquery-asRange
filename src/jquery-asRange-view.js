// jqueyr range veiw

$.asRange.registerComponent('view', {
    defaults: {},
    init: function(instance) {
        var self = this;

        this.$arrow = $('<span></span>').appendTo(instance.$element);
        this.$arrow.addClass(instance.namespace + '-view');

        if (instance.pointer.length === 1) {
            instance.pointer[0].$element.on('asRange::pointer::change', function(e, pointer) {
                var left = 0,
                    right = pointer.get();

                self.$arrow.css({
                    left: 0,
                    width: (right - left) * 100 + '%'
                });
            });
        }

        if (instance.pointer.length === 2) {
            instance.pointer[0].$element.on('asRange::pointer::change', function(e, pointer) {
                var left = pointer.get(),
                    right = instance.pointer[1].get();

                self.$arrow.css({
                    left: Math.min(left, right) * 100 + '%',
                    width: Math.abs(right - left) * 100 + '%'
                });
            });
            instance.pointer[1].$element.on('asRange::pointer::change', function(e, pointer) {
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