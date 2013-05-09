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

        // public properties
        this.value = this.options.value;
        this.start = this.options.range[0];
        this.end = this.options.range[1];
        this.interval = this.end - this.start;

        this.$element.addClass(this.namespace).addClass(this.namespace + '-' + this.options.skin);

        this.init();
    };

    Range.prototype = {
        constructor: Range,
        components: {},

        init: function() {
            var self = this;

            this.pointer = [];
            this.width = this.$element.width();
            this.height = this.$element.height();

            for (var i = 1; i <= this.options.pointer; i++) {
                var $pointer = $('<span class="' + this.namespace +'-pointer"></span>').appendTo(this.$element);
                var p = new Pointer($pointer, i, this);

                this.pointer.push(p);
            }

            // alias of every pointer
            this.p1 = this.pointer[0];
            this.p2 = this.pointer[1];

            // initial pointer value
            this.setValue(this.value);

            this.$element.on('click', function(event) {
                // todo
            });            
        },

        getValue: function() {
            return this.value;  
        },

        // @value Aarry  the actual value
        setValue: function(value) {
            $.each(this.pointer, function(i, p) {
                p.set(value[i]);
            });

            this.value = value;
        },

        setInterval: function(start,end) {
            this.start = start;
            this.end = end;
            this.interval = end - start;
        },

        enable: function() {},
        disable: function() {}
    };

    Range.defaults = {
        namespace: 'range',
        skin: 'simple',

        range: [0,100],
        value: [10],
        step: 7,

        pointer: 1,

        // components
        components: {
            tip: false,
            scale: false,
            arrow: false
        },

        orientation: 'vertical',

        // on pointer move
        slide: function(value) {

            // to do
            return value;
        },

        // on state change
        onChange: function() {},

        // on mouse up 
        callback: function() {}
    };

    // Pointer constuctor
    
    function Pointer($element, id, parent) {
        this.$element = $element;
        this.uid = id;
        this.parent = parent;
        this.options = this.parent.options;
        this.value = '';
        this.direction = '';

        this.init();
    }
    Pointer.prototype = {
        constructor: Pointer,
        init: function() {

            if (this.options.vertical === 'v') {
                this.direction = 'top';
                this.mouse = 'pageY';
                this.max = this.parent.height;
            } else {
                this.direction = 'left';
                this.mouse = 'pageX';
                this.max = this.parent.width;
            }

            this.$element.on('mousedown', $.proxy(this.mousedown, this));
        },

        mousedown: function(event) {
            var offset = this.parent.$element.offset();    

            this.data = {};
            this.data.start = event[this.mouse];
            this.data[this.direction] = event[this.mouse] - offset[this.direction];

            this.mousemove = function(event) {
                var value = this.data[this.direction] + ( event[this.mouse] || this.data.start ) - this.data.start;
                this._set(value);
                return false;
            };

            this.mouseup = function(event) {

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

        // @value number the position value
        _set: function(value) {

            var actualValue,
                posValue,
                position = {};

            if (value < 0 ) {
                value = 0;
            }

            if (value > this.max) {
                value = this.max;
            }

            actualValue = this.getActualValue(value);

            posValue = this.step(actualValue);

            if (posValue != true) {

                position[this.direction] = posValue;
                this.$element.css(position);
                this.value = posValue;
            }
        },

        // get postion value
        // @value number the actual value
        getPosValue: function(value) {
            return value / this.parent.interval * this.max;
        },

        // get actual value
        // @value number the position value
        getActualValue: function(value) {
            return value / this.max * this.parent.interval + this.parent.start;
        },

        // @value number the position value
        // return position value
        step: function(value) {
            var value,
                step = parseInt(this.options.step);

            if (step > 0) {

                value =  Math.round( value / step ) * step; 

                if (value % step === 0) {
                    return this.getPosValue(value);
                } else {
                    return false;
                }

            } else {
                return false;
            }   
        }, 

        // public method     
        
        // @value number the actual value
        set: function(value) {
            value = this.getPosValue(value);
            this._set(value);
        },

        // reutrn actual value
        get: function() {
            return this.getActualValue(this.value);
        }
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
                    $.data(this, 'range', new Range(this, options));
                }
            });
        }
    };

}(jQuery));
