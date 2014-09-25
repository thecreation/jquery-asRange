(function($) {
    $.asRange.registerComponent('selected', {
        defaults: {},
        init: function(instance) {
            var self = this;

            this.$arrow = $('<span></span>').appendTo(instance.$wrap);
            this.$arrow.addClass(instance.namespace + '-selected');

            if (instance.options.range === false) {
                instance.p1.$element.on(instance.pluginName + '::move', function(e, pointer) {
                    self.$arrow.css({
                        left: 0,
                        width: pointer.getPercent() + '%'
                    });
                });
            }

            if (instance.options.range === true) {
                var onUpdate = function() {
                    var width = instance.p2.getPercent() - instance.p1.getPercent(),
                        left;
                    if (width >= 0) {
                        left = instance.p1.getPercent();
                    } else {
                        width = -width;
                        left = instance.p2.getPercent();
                    }
                    self.$arrow.css({
                        left: left + '%',
                        width: width + '%'
                    });
                };
                instance.p1.$element.on(instance.pluginName + '::move', onUpdate);
                instance.p2.$element.on(instance.pluginName + '::move', onUpdate);
            }
        }
    });
}(jQuery));
