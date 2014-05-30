(function($) {
    $.asRange.registerComponent('selected', {
        defaults: {},
        init: function(instance) {
            var self = this;

            this.$arrow = $('<span></span>').appendTo(instance.$wrap);
            this.$arrow.addClass(instance.namespace + '-selected');

            if (instance.options.range === false) {
                instance.p1.$element.on('asRange::pointer::change', function(e, pointer) {
                    self.$arrow.css({
                        left: 0,
                        width: pointer.getPercent() + '%'
                    });
                });
            }

            if (instance.options.range === true) {
                var onUpdate = function(e, pointer){
                    self.$arrow.css({
                        left: instance.p1.getPercent() + '%',
                        width: (instance.p2.getPercent() - instance.p1.getPercent()) + '%'
                    });
                };
                instance.p1.$element.on('asRange::pointer::change', onUpdate);
                instance.p2.$element.on('asRange::pointer::change', onUpdate);
            }
        }
    });
}(jQuery));