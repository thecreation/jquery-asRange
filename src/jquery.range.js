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
        this.$element = $(element).css({postion: 'relative'});

        this.options = $.extend({}, Range.defaults, options);
        this.namespace = this.options.namespace;

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

            this.$bar = $('<span class="range-bar"></span>').appendTo(this.$element);

            for (var i = 1; i <= this.options.pointer; i++) {
                var $pointer = $('<span class="' + this.namespace +'-pointer"></span>').appendTo(this.$element);
                var p = new Pointer($pointer, i, this);

                this.pointer.push(p);
            }

            this.$bar.css({
                postion: 'absolute'
            });

            // alias of every pointer
            this.p1 = this.pointer[0];
            this.p2 = this.pointer[1];

            // initial components

            if (this.options.tip === true) {
                this.components.tip.init(this);
            }
            if (this.options.arrow === true) {
                this.components.arrow.init(this);
            }
            if (this.options.scale === true) {
                this.components.scale.init(this);
            }

            // initial pointer value
            this.setValue(this.value);
            this.$element.on('click', function(event) {
                // todo
            }); 
        },

        getValue: function() {
            var value;

            // 

            return value;  
        },

        // @value Aarry  the actual value
        setValue: function(value) {
            $.each(this.pointer, function(i, p) {
                console.log(value[i]);
                p.set(value[i]);
            });

            this.value = value;
        },

        setInterval: function(start, end) {
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
        value: [0,20],
        step: 10,

        pointer: 2,
        limit: true,
        orientation: 'v', // 'v' or 'h'

        // components
        tip: true,
        scale: false,
        arrow: false,

        // custom value format
        // @value number  origin value
        // return a formatted value
        format: function(value) {

            // to do

            return value;
        },

        // on state change
        onChange: function() {},

        // on mouse up 
        callback: function() {}
    };

    Range.registerComponent = function (component, methods) {
        Range.prototype.components[component] = methods;
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

    // Pointer constuctor
    function Pointer($element, id, parent) {
        this.$element = $element;
        this.uid = id;
        this.parent = parent;
        this.options = this.parent.options;
        this.value = null;
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
            var limit = {},
                offset = this.parent.$element.offset();    

            this.data = {};
            this.data.start = event[this.mouse];
            this.data[this.direction] = event[this.mouse] - offset[this.direction];

            this.mousemove = function(event) {
                var value = this.data[this.direction] + ( event[this.mouse] || this.data.start ) - this.data.start;

                if (this.parent.options.limit === true) {

                    limit = this.limit();

                    if (value < limit.left) {
                        value = limit.left;
                    }
                    if (value > limit.right) {
                        value = limit.right;
                    }

                } 

                this._set(value);
                return false;
            };

            this.mouseup = function(event) {

                $(document).off({
                    mousemove: this.mousemove,
                    mouseup: this.mouseup
                });

                if (typeof this.parent.options.callback === 'function') {
                    this.parent.options.callback(this);
                }

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

            if (this.parent.options.step > 0) {
                actualValue = this.getActualValue(value);
                posValue = this.step(actualValue);
            } else {
                console.log(value)
                posValue = value;
            }

            

            // make sure to redraw only when value changed 
            if (posValue !== this.value) {

                position[this.direction] = posValue;
                this.$element.css(position);
                this.value = posValue;

                if (typeof this.parent.options.onChange === 'function') {
                    this.parent.options.onChange(this);
                }

                this.$element.trigger('change', this);
            }
        },

        // get postion value
        // @param value number the actual value
        getPosValue: function(value) {

            // here value = 0  change to false
            if (value !== undefined) {
                return value / this.parent.interval * this.max;
            } else {
                return this.value;
            }
            
        },

        // get actual value
        // @value number the position value
        getActualValue: function(value) {
            return value / this.max * this.parent.interval + this.parent.start;
        },

        // step control
        // @value number the position value
        // return position value
        step: function(value) {
            var value,
                step = parseInt(this.options.step);

            if (step > 0) { 
                value =  Math.round( value / step ) * step;
            } 

            return this.getPosValue(value);
            
        }, 

        // limit pointer move range
        limit: function() {
            var left,right;

            if (this.uid === 1) {
                lfet = 0;
            } else {
                left = this.parent.pointer[this.uid - 2].getPosValue();
            }

            if (this.parent.pointer[this.uid]) {
                right = this.parent.pointer[this.uid].getPosValue();
            } else {
                right = this.max;
            }

            return {
                left: left,
                right: right
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
            var value = this.getActualValue(this.value);
            return this.options.format(value);
        }
    };      

    Range.registerComponent('tip', {
        defaults: {
            active: 'hover',
        },
        init: function(instance) {
            var self = this,
                opts = $.extend({},this.defaults,instance.options.tip);

            this.opt = opts;

            this.tip = [];
            $.each(instance.pointer, function(i,p) {
                var $tip = $('<span class="range-tip"></span>').appendTo(instance.pointer[i].$element);
                
                instance.pointer[i].$element.on('change', function(e, pointer) {
                    $tip.text(pointer.get());
                });

                self.tip.push($tip);
            });

        },
        show: function() {
            $.each(self.tip, function(i,$tip) {
                $tip.show();
            });
        },
        hide: function() {
            $.each(self.tip, function(i,$tip) {
                $tip.hide();
            });
        }
    });
    Range.registerComponent('arrow', {
        defaults: {},
        init: function(instance) {
            this.$arrow = $('<span class="range-arrow"></span>').appendTo(instance.$element);
        },
    });
    Range.registerComponent('scale', {
        defaults: {},
        init: function(instance) {},
    });

}(jQuery));
