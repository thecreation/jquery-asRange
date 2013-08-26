
// jqueyr range veiw

$.range.registerComponent('view', {
    defaults: {},
    init: function(instance) {
        var self = this;
        this.$arrow = $('<span></span>').appendTo(instance.$element);

        if (instance.namespace !== null) {
            this.$arrow.addClass(instance.namespace + '-view');
        }

        if (instance.pointer.length === 1) {
            instance.pointer[0].$element.on('change', function(e, pointer) {
                var left = 0,
                    right = pointer.getPosValue();

                self.$arrow.css({
                    left: 0,
                    width: right - left
                });
            });
        }

        if (instance.pointer.length === 2) {
            instance.pointer[0].$element.on('change', function(e, pointer) {
                var left = pointer.getPosValue(),
                    right = instance.pointer[1].getPosValue();

                self.$arrow.css({
                    left: Math.min(left, right),
                    width: Math.abs(right - left)
                });
            });
            instance.pointer[1].$element.on('change', function(e, pointer) {
                var right = pointer.getPosValue(),
                    left = instance.pointer[0].getPosValue();

                self.$arrow.css({
                    left: Math.min(left, right),
                    width: Math.abs(right - left)
                });
            });
        }
    }
});