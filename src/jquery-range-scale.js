
// scale

$.range.registerComponent('scale', {
    defaults: {
        scale: [0, 50, 100]
    },
    init: function(instance) {
        var self = this,
            opts = $.extend({}, this.defaults, instance.options.tip),
            len = opts.scale.length;

        this.$scale = $('<ul class="' + instance.namespace + '-range-scale"></ul>');
        $.each(opts.scale, function(i, v) {
            var $li = $('<li>' + v + '</li>');

            $li.css({
                left: i / (len - 1) * 100 + '%'
            });

            $li.appendTo(self.$scale);

        });
        this.$scale.appendTo(instance.$element);
    }
});