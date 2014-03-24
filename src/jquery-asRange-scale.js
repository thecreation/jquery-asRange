// scale
// 
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
            scaleGrid: instance.namespace + '-scaleGrid',
            scaleValue: instance.namespace + '-scaleValue',
            grid: instance.namespace + '-scale-grid',
            inlineGrid: instance.namespace + '-scale-inlineGrid'
        };

        var len = scale.values.length;
        var num = ((scale.grid - 1) * (scale.gap + 1) + scale.gap) * (len - 1) + len;
        var perOfGrid = 100 / (num - 1);
        var perOfValue = 100 / (len - 1);

        this.$scale = $('<div></div>').addClass(classes.scale);
        this.$grid = $('<ul></ul>').addClass(classes.scaleGrid);
        this.$value = $('<ul></ul>').addClass(classes.scaleValue);

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
            }).appendTo(this.$grid);
        }

        for (var j = 0; j < len; j++) {
            // position value
            $('<li><span>' + scale.values[j] + '</span></li>').css({
                left: perOfValue * j + '%'
            }).appendTo(this.$value);
        }

        this.$grid.add(this.$value).appendTo(this.$scale);
        this.$scale.appendTo(instance.$element);
    },
    update: function(instance) {
        this.$scale.remove();
        this.init(instance);
    }
});