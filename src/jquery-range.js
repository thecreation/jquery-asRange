/*
 * range
 * https://github.com/amazingSurge/jquery-range
 *
 * Copyright (c) 2013 amazingSurge
 * Licensed under the GPL license.
 */

(function($) {

    // Pointer constuctor
    function Pointer($element, id, parent) {
        this.$element = $element;
        this.uid = id;
        this.parent = parent;
        this.options = $.extend(true, {}, this.parent.options);
        this.interval = this.parent.interval;
        this.value = null;

        this.direction = parent.direction;
        this.mouse = parent.mouse;
        this.maxDimesion = parent.maxDimesion;

        this.init();
    }

    Pointer.prototype = {
        constructor: Pointer,
        init: function() {
            this.$element.on('mousedown', $.proxy(this.mousedown, this));
        },

        mousedown: function(event) {
            var limit = {},
                self = this,
                offset = this.parent.$element.offset();

            if (this.parent.enabled === false) {
                return;
            }

            this.data = {};
            this.data.start = event[this.mouse];
            this.data[this.direction] = event[this.mouse] - offset[this.direction];

            this._set(this.data[this.direction]);

            $.each(this.parent.pointer, function(i, p) {
                p.$element.removeClass(self.namespace + '-pointer_active');
            });

            if (this.parent.namespace !== null) {
                this.$element.addClass(this.parent.namespace + '-pointer_active');
            }
            
            this.mousemove = function(event) {
                var value = this.data[this.direction] + (event[this.mouse] || this.data.start) - this.data.start;

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

            this.mouseup = function() {

                $(document).off({
                    mousemove: this.mousemove,
                    mouseup: this.mouseup
                });


                if (typeof this.parent.options.callback === 'function') {
                    this.parent.options.callback(this);
                }

                this.$element.trigger('end', this);

                return false;
            };

            $(document).on({
                mousemove: $.proxy(this.mousemove, this),
                mouseup: $.proxy(this.mouseup, this)
            });

            return false;
        },

        /**
         * [ set value]
         * @param  {[number]} value [he position value]
         * @return {[type]}       [none]
         */
        _set: function(value) {
            var actualValue,
                posValue,
                position = {};

            if (value < 0) {
                value = 0;
            }

            if (value > this.maxDimesion) {
                value = this.maxDimesion;
            }

            if (this.options.step > 0) {
                actualValue = this.getActualValue(value);
                posValue = this.step(actualValue);
            } else {
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

        /**
         * [ get postion value]
         * @param  {[number]} value [the actual value]
         * @return {[number]}       [the position value]
         */
        getPosValue: function(value) {

            // here value = 0  change to false
            if (value !== undefined) {
                return value / this.parent.interval * this.maxDimesion;
            } else {
                return this.value;
            }
        },

        /**
         * [ get actual value]
         * @param  {[number]} value [the position value]
         * @return {[number]}       [the actual value]
         */
        getActualValue: function(value) {
            var actualValue = value / this.maxDimesion * this.parent.interval + this.parent.min;
            return actualValue;
        },

        /**
         * [ step control]
         * @param  {[number]} value [the position value]
         * @return {[number]}       [the position value]
         */
        step: function(value) {
            var convert_value,
                step = this.options.step;

            if (step > 0) {
                convert_value = Math.round(value / step) * step;
            }

            return this.getPosValue(convert_value);
        },

        /**
         * [ limit pointer move range]
         * @return {[object]} [if the pointer is limited to its left or right]
         */
        limit: function() {
            var left, right;

            if (this.uid === 1) {
                left = 0;
            } else {
                left = this.parent.pointer[this.uid - 2].getPosValue();
            }

            if (this.parent.pointer[this.uid]) {
                right = this.parent.pointer[this.uid].getPosValue();
            } else {
                right = this.maxDimesion;
            }

            return {
                left: left,
                right: right
            };
        },
        
        /**
         * Public Method
         */
            

        /**
         * [ set value]
         * @param  {[Number]} value [the actual value]
         * @return {[type]}       [none]
         */
        set: function(value) {
            value = this.getPosValue(value);
            this._set(value);
        },

        /**
         * [ get value]
         * @return {[number]} [actual value]
         */
        get: function() {
            var value = this.getActualValue(this.value);
            return this.options.format(Math.round(value * 100) / 100);
        },

        /**
         * [ destroy the plugin]
         * @return {[type]} [none]
         */
        destroy: function() {
            this.$element.off('mousedown');
        }
    };

    // main constructor
    var Range = $.range = function(range, options) {
        var metas = {};

        this.range = range;
        this.$range = $(range);
        this.$element = null;

        if (this.$range.is('input')) {
            var inputValue = this.$range.attr('value');

            metas.min = parseFloat(this.$range.attr('min'));
            metas.max = parseFloat(this.$range.attr('max'));
            metas.step = parseFloat(this.$range.attr('step'));
            
            if (inputValue) {
                metas.value = [];
                metas.value.push(inputValue);
            }

            this.$range.css({
                display: 'none'
            });

            this.$element = $("<div></div>");
            this.$range.after(this.$element);
        } else {
            this.$element = this.$range;
        }

        this.$element.css({
            position: 'relative'
        });

        this.options = $.extend({}, Range.defaults, options, metas);
        this.namespace = this.options.namespace;
        this.components = $.extend(true, {}, this.components);

        // public properties
        this.value = this.options.value;
        this.min = this.options.min;
        this.max = this.options.max;
        this.interval = this.max - this.min;

        // flag
        this.initial = false;
        this.enabled = true;

        this.$element.addClass(this.namespace);

        if (this.options.skin !== null) {
            this.$element.addClass(this.namespace + '_' + this.options.skin);
        }

        if (this.max < this.min || this.step >= this.interval) {
            throw new Error('error options about max min step');
        }

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

            if (this.options.vertical === 'v') {
                this.direction = 'top';
                this.mouse = 'pageY';
                this.maxDimesion = this.height;
            } else {
                this.direction = 'left';
                this.mouse = 'pageX';
                this.maxDimesion = this.width;
            }

            //this.$bar = $('<span class="range-bar"></span>').appendTo(this.$element);
            for (var i = 1; i <= this.options.pointer; i++) {
                var $pointer = $('<span class="' + this.namespace + '-pointer"></span>').appendTo(this.$element);
                var p = new Pointer($pointer, i, this);

                this.pointer.push(p);
            }

            // alias of every pointer
            this.p1 = this.pointer[0];
            this.p2 = this.pointer[1];

            // initial components
            this.components.view.init(this);

            if (this.options.tip !== false) {
                this.components.tip.init(this);
            }
            if (this.options.scale === false) {
                this.components.scale.init(this);
            }

            // initial pointer value
            this.setValue(this.value);
            this.$element.on('mousedown', function(event) {
                var offset = self.$element.offset(),
                    start = event[self.mouse] - offset[self.direction],
                    p = self.stickTo.call(self, start);

                p.mousedown.call(p, event);
                return false;
            });

            if (this.$range.is('input')) {
                this.p1.$element.on('change', function(event,instance) {
                    var value = instance.get();
                    self.$element.val(value);
                });
            }

            this.initial = true;
        },
        stickTo: function(start) {
            if (this.options.pointer === 1) {
                return this.p1;
            }

            if (this.options.pointer === 2) {
                var p1 = this.p1.getPosValue(),
                    p2 = this.p2.getPosValue(),
                    diff = Math.abs(p1 - p2);
                if (p1 <= p2) {
                    if (start > p1 + diff / 2) {
                        return this.p2;
                    } else {
                        return this.p1;
                    }
                } else {
                    if (start > p2 + diff / 2) {
                        return this.p1;
                    } else {
                        return this.p2;
                    }
                }
            }
        },

        /*
            Public Method
         */
        
        getValue: function() {
            var value = [];

            $.each(this.pointer, function(i, p) {
                value[i] = p.get();
            });

            return value;
        },
        setValue: function(value) {
            $.each(this.pointer, function(i, p) {
                p.set(value[i]);
            });

            this.value = value;
        },
        setInterval: function(start, end) {
            this.min = start;
            this.max = end;
            this.interval = end - start;
        },
        enable: function() {
            this.enabled = true;
            this.$element.addClass(this.namespace + 'enabled');
            return this;
        },
        disable: function() {
            this.enabled = false;
            this.$element.removeClass(this.namespace + 'enabled');
            return this;
        },
        destroy: function() {
            $.each(this.pointer, function(i, p) {
                p.destroy();
            });
        }
    };

    Range.defaults = {
        namespace: 'range',
        skin: null,

        max: 100,
        min: 0,
        value: [0, 20],
        step: 10,

        pointer: 2,
        limit: true,
        orientation: 'v', // 'v' or 'h'

        // components
        tip: true,
        scale: false,

        /**
         * [ callback: custom value format]
         * @param  {[Number]} value [origin value]
         * @return {[Number]}       [a formatted value]
         */
        format: function(value) {
            // to do
            return value;
        },

        /**
         * [ callback: on state change]
         * @param  {[Object]} instance [a Range instance]
         * @return {[type]}          [none]
         */
        onChange: function(instance) {         
        },

        // on mouse up 
        callback: function() {}
    };

    Range.registerComponent = function(component, methods) {
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

}(jQuery));