(function($) {
    $.asRange.registerComponent('scale', {
        defaults: {
            scale: {
                values: [0, 50, 100],
                gap: 1,
                grid: 5
            }
        },
        init: function(instance) {
            var opts = $.extend({}, this.defaults, instance.options.scale),
                scale = opts.scale;

            var classes = {
                scale: instance.namespace + '-scale',
                lines: instance.namespace + '-scale-lines',
                grid: instance.namespace + '-scale-grid',
                inlineGrid: instance.namespace + '-scale-inlineGrid',
                values: instance.namespace + '-scale-values'
            };

            var len = scale.values.length;
            var num = ((scale.grid - 1) * (scale.gap + 1) + scale.gap) * (len - 1) + len;
            var perOfGrid = 100 / (num - 1);
            var perOfValue = 100 / (len - 1);

            this.$scale = $('<div></div>').addClass(classes.scale);
            this.$lines = $('<ul></ul>').addClass(classes.lines);
            this.$values = $('<ul></ul>').addClass(classes.values);

            for (var i = 0; i < num; i++) {
                var $list;
                if (i === 0 || i === num || i % ((num - 1) / (len - 1)) === 0) {
                    $list = $('<li class="' + classes.grid + '"></li>');
                } else if (i % scale.grid === 0) {
                    $list = $('<li class="' + classes.inlineGrid + '"></li>');
                } else {
                    $list = $('<li></li>');
                }

                // position scale 
                $list.css({
                    left: perOfGrid * i + '%'
                }).appendTo(this.$lines);
            }

            for (var j = 0; j < len; j++) {
                // position value
                $('<li><span>' + scale.values[j] + '</span></li>').css({
                    left: perOfValue * j + '%'
                }).appendTo(this.$values);
            }

            this.$lines.add(this.$values).appendTo(this.$scale);
            this.$scale.appendTo(instance.$element);
        },
        update: function(instance) {
            this.$scale.remove();
            this.init(instance);
        }
    });
}(jQuery));