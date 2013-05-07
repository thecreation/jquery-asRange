/*
 * range
 * https://github.com/amazingSurge/jquery-range
 *
 * Copyright (c) 2013 joeylin
 * Licensed under the MIT license.
 */

(function($) {

    var Range = $.range = function(element, options) {

        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Range.defaults, options);
        this.namespace = this.options.namespace;
        this.components = $.extend(true,{},this.components);

        this.pointerValue = this.options.start;
        this.$pointer = $('<span class="' + this.namespace + '-p"></span>');
        this.$pointer.appendTo(this.$element);

        this.$element.addClass(this.namespace).addClass(this.namespace + '-' + this.options.skin);

        this.init();
    };

    Range.prototype = {
        constructor: Range,
        components: {},
        pid: 1,

        init: function() {
             
            this.$pointer.on('mousedown',function(e){
                var me = this,
                    rightclick = (e.which) ? (e.which == 3) : (e.button == 2);

                if (rightclick) {
                    return false;
                }  

                $.proxy(self.mousedown,self)(e);
            });
        },

        mousedown: function(e) {

            var offset = this.$hue.offset();

            this.data.startY = e.pageY;
            this.data.top = e.pageY - offset.top;

            this.move(this.data.top);

            this.mousemove = function(e) {

                var position = this.data.top + (e.pageY || this.data.startY) - this.data.startY;

                this.move(position);
                return false;
            };

            this.mouseup = function(e) {

                $(document).off({
                    mousemove: this.mousemove,
                    mouseup: this.mouseup
                });
                return false;
            };

            $(document).on({
                mousemove: $.proxy(this.mousemove, this),
                mouseup: $.proxy(this.mouseup, this)
            });

            return false;
        },

        move: function(position) {
            
        },

        calculate: function(value,range) {

        },

        get: function() {
            return this.value;        },

        set: function(value) {

        },

        enable: function() {},
        disable: function() {}
    };

    Range.defaults = {
        namespace: 'range',
        skin: 'simple',

        range: [0,100],
        start: 50,
        step: 1,

        // components
        components: {
            tip: false,
            scale: false,
            arrow: false
        },

        orientation: 'vertical',

        // on pointer move
        slide: function(value) {


            return value;
        },

        // on state change
        onChange: function() {},

        // on mouse up 
        callback: function() {}
    };
    

    $.fn.range = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            return this.each(function() {
                var api = $.data(this, 'range');
                if (typeof api[method] === 'function') {
                    api[method].apply(api, method_arguments);
                }
            });
        } else {

            return this.each(function() {
                if (!$.data(this, 'range')) {
                    $.data(this, 'range', new Range(this, opts));
                }
            });
        }
    };

}(jQuery));
