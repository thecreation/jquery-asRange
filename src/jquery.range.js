/*
 * range
 * https://github.com/amazingSurge/jquery-range
 *
 * Copyright (c) 2013 joeylin
 * Licensed under the MIT license.
 */

(function($) {

    var Pointer = function(instance,tip) {
        var $element = instance.$element;
        this.parent = instance;
        this.$handle = $('<span class="range-handle"><a href="#" class="handle-tip" ></a></span>').appendTo($element);
        this.$tip = this.$handle.find('a');


        if (this.parent.options.tip === false) {
            this.$tip.css({display: 'none'});
        }

        this.value = '';
        this.timer = null;

        var self = this;

        this.$handle.on('mousedown',function(e) {
            var startX = e.pageX; 
            var left = parseInt(self.$handle.position().left);
            var distance;   

            this.mousemove = function(e) {
                distance = e.pageX - startX;
                self.set( distance + left );
                return false;
            };
            this.mouseup = function() {
                $(document).off({
                    mousemove: this.mousemove,
                    mouseup: this.mouseup
                });
                return false;
            };

            $(document).on({
                mousemove: this.mousemove,
                mouseup: this.mouseup
            });

            return false;
        });

    };

    Pointer.prototype.set = function(value) {
        this.value = value;
        this.$handle.css({'left': value});
        this.parent.$element.trigger('slide',this.parent);

        if (this.parent.options.tip === true) {
            this.$handle.find('a').text(this.value);
        }
    }

    var Range = $.range = function(element, options) {

        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Range.defaults, options);
        this.namespace = this.options.namespace;

        this.$element.addClass(this.namespace).addClass(this.namespace + '-' + this.options.skin);

        this.init();
    };

    Range.prototype = {
        constructor: Range,

        init: function() {
            
            if(this.options.handle === 1) {
                this.handle = new Picker(this);
            }

            if (this.options.handle === 2) {
                this.handle = new Picker(this);
                this.handleTwo = new Picker(this);
            }
        },
        get: function(value) {
            
            return this[value].value;
        },

        set: function(name,value) {

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

        handle:1,

        tip: true,
        scale: true,

        orientation: 'vertical',

        //callback
        slide: function() {},

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
    }

}(jQuery));
