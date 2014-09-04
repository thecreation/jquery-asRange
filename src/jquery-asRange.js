/*
 * range
 * https://github.com/amazingSurge/jquery-range
 *
 * Copyright (c) 2013 amazingSurge
 * Licensed under the GPL license.
 */

(function($) {
    var pluginName = 'asRange',
        defaults = {
            namespace: 'asRange',
            skin: null,
            max: 100,
            min: 0,
            value: null,
            step: 10,
            limit: true,
            range: false,
            direction: 'h', // 'v' or 'h'
            keyboard: true,
            replaceFirst: 'default',

            // components
            tip: true,
            scale: true,
            format: function(value) {
                return value;
            },
            onChange: function() {},
            // on mouse up 
            callback: function() {}
        };

    var getEventObject = function(e) {
        if (e.touches) e = e.touches[0];
        return e;
    };

    // main constructor
    var Plugin = $[pluginName] = function(element, options) {
        var metas = {};
        this.element = element;
        this.$element = $(element);

        if (this.$element.is('input')) {
            var value = this.$element.val();

            if (typeof value === 'string') {
                metas.value = value.split(',');
            }
            
            var self = this;
            $.each(['min', 'max', 'step'], function(index, key) {
                var val = parseFloat(self.$element.attr(key));
                if (!isNaN(val)) {
                    metas[key] = val;
                }
            });

            this.$element.css({
                display: 'none'
            });
            this.$wrap = $("<div></div>");
            this.$element.after(this.$wrap);
        } else {
            this.$wrap = this.$element;
        }

        this.options = $.extend({}, defaults, options, this.$element.data(), metas);
        this.namespace = this.options.namespace;
        this.components = $.extend(true, {}, this.components);

        // public properties
        this.value = this.options.value;
        if (this.value === null) {
            this.value = this.options.min;
        }

        if (!this.options.range) {
            if ($.isArray(this.value)) {
                this.value = this.value[0];
            }
        } else {
            
            if (!$.isArray(this.value)) {
                this.value = [this.value, this.value];
            } else if (this.value.length === 1) {
                this.value[1] = this.value[0];
            }
        }

        this.min = this.options.min;
        this.max = this.options.max;
        this.step = this.options.step;
        this.interval = this.max - this.min;

        // flag
        this.initialized = false;
        this.updating = false;
        this.disabled = false;

        if(this.options.direction === 'v') {
            this.direction = {
                axis: 'pageY',
                position: 'top'
            };
        } else {
            this.direction = {
                axis: 'pageX',
                position: 'left'
            };
        }
        
        this.$wrap.addClass(this.namespace);

        if (this.options.skin) {
            this.$wrap.addClass(this.namespace + '_' + this.options.skin);
        }

        if (this.max < this.min || this.step >= this.interval) {
            throw new Error('error options about max min step');
        }

        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,
        components: {},

        init: function() {
            this.$wrap.append('<div class="' + this.namespace + '-bar" />');

            // build pointers
            this.buildPointers();

            // initial components
            this.components.selected.init(this);

            if (this.options.tip !== false) {
                this.components.tip.init(this);
            }
            if (this.options.scale !== false) {
                this.components.scale.init(this);
            }

            // initial pointer value
            this.set(this.value);

            // Bind events
            this.bindEvents();

            this.$element.trigger('asRange::ready', this);
            this.initialized = true;
        },
        buildPointers: function() {
            this.pointer = [];
            var pointer_count = 1;
            if (this.options.range) {
                pointer_count = 2;
            }
            for (var i = 1; i <= pointer_count; i++) {
                var $pointer = $('<div class="' + this.namespace + '-pointer ' + this.namespace + '-pointer-' + i + '"></div>').appendTo(this.$wrap);
                var p = new Pointer($pointer, i, this);
                this.pointer.push(p);
            }

            // alias of pointer
            this.p1 = this.pointer[0];

            if (this.options.range) {
                this.p2 = this.pointer[1];
            }
        },
        bindEvents: function() {
            var self = this;
            this.$wrap.on('touchstart.asRange mousedown.asRange', function(event) {
                if (self.disabled === true) {
                    return;
                }
                event = getEventObject(event);
                var rightclick = (event.which) ? (event.which === 3) : (event.button === 2);
                if (rightclick && !Touch) {
                    return false;
                }

                var offset = self.$wrap.offset(),
                    start = event[self.direction.axis] - offset[self.direction.position],
                    p = self.getAdjacentPointer.call(self, start);

                p.mousedown.call(p, event);
                return false;
            });

            if (this.$element.is('input')) {
                this.$element.on('asRange::change', function() {
                    var value = self.get();
                    self.$element.val(value);
                });
            }

            $.each(this.pointer, function(i, p) {
                p.$element.on('asRange::pointer::change', function() {
                    self.value = self.get();
                    if (!self.initialized || self.updating) {
                        return false;
                    }
                    if (typeof self.options.onChange === 'function') {
                        self.options.onChange.call(self, self.value, p.uid);
                    }
                    self.$element.trigger('asRange::change', [self.value, self.options.name, pluginName, self]);
                    return false;
                });
            });
        },
        getValueFromPosition: function(px){
            if(px > 0){
                return this.min + (px / this.getLength()) * this.interval;
            } else {
                return 0;
            }
        },
        getAdjacentPointer: function(start) {
            var value = this.getValueFromPosition(start);
            if (this.options.range) {
                var p1 = this.p1.value,
                    p2 = this.p2.value,
                    diff = Math.abs(p1 - p2);
                if (p1 <= p2) {
                    if (value > p1 + diff / 2) {
                        return this.p2;
                    } else {
                        return this.p1;
                    }
                } else {
                    if (value > p2 + diff / 2) {
                        return this.p1;
                    } else {
                        return this.p2;
                    }
                }
            } else {
                return this.p1;
            }
        },
        getLength: function() {
            if (this.options.direction === 'v') {
                return this.$wrap.height();
            } else {
                return this.$wrap.width();
            }
        },
        update: function(options) {
            var self = this;
            this.updating = true;
            $.each(['max', 'min', 'step', 'limit', 'value'], function(key, value) {
                if (options[value]) {
                    self[value] = options[value];
                }
            });
            if (options.max || options.min) {
                this.setInterval(options.min, options.max);
            }

            if (!options.value) {
                this.value = options.min;
            }

            $.each(this.components, function(key, value) {
                if (typeof value.update === "function") {
                    value.update(self);
                }
            });

            this.set(this.value);

            if (typeof self.options.onUpdate === 'function') {
                self.options.onUpdate.call(self);
            }
            self.$element.trigger('asRange::update', self);

            this.updating = false;
        },
        get: function() {
            var self = this,
                value = [];

            $.each(this.pointer, function(i, p) {
                value[i] = p.get();
            });

            if (self.options.range) {
                return value;
            } else {
                return value[0];
            }

        },
        set: function(value) {
            if (this.options.range) {
                if (typeof value === 'number') {
                    value = [value];
                }
                if (!$.isArray(value)) {
                    return;
                }
                $.each(this.pointer, function(i, p) {
                    p.set(value[i]);
                });
            } else {
                this.p1.set(value);
            }

            this.value = value;
        },
        val: function(value) {
            if (value) {
                this.set(value);
                return this;
            } else {
                return this.get();
            }
        },
        setInterval: function(start, end) {
            this.min = start;
            this.max = end;
            this.interval = end - start;
        },
        enable: function() {
            this.disabled = false;
            this.$wrap.removeClass(this.namespace + '_disabled');
            return this;
        },
        disable: function() {
            this.disabled = true;
            this.$wrap.addClass(this.namespace + '_disabled');
            return this;
        },
        destroy: function() {
            $.each(this.pointer, function(i, p) {
                p.destroy();
            });
            this.$wrap.destroy();
        }
    };

    Plugin.defaults = defaults;

    Plugin.registerComponent = function(component, methods) {
        Plugin.prototype.components[component] = methods;
    };

    // Pointer constuctor
    function Pointer($element, id, parent) {
        this.$element = $element;
        this.uid = id;
        this.parent = parent;
        this.options = $.extend(true, {}, this.parent.options);
        this.direction = this.options.direction;
        this.value = null;
        this.classes = {
            active: this.parent.namespace + '-pointer_active'
        };
    }

    Pointer.prototype = {
        constructor: Pointer,
        mousedown: function(event) {
            var axis =this.parent.direction.axis,
                position = this.parent.direction.position, 
                offset = this.parent.$wrap.offset();

            this.$element.trigger('asRange::pointer::start', this);

            this.data = {};
            this.data.start = event[axis];
            this.data.position = event[axis] - offset[position];

            var value = this.parent.getValueFromPosition(this.data.position);
            this.set(value);

            $.each(this.parent.pointer, function(i, p) {
                p.deactive();
            });

            this.active();

            this.mousemove = function(event) {
                var eventObj = getEventObject(event),
                    value = this.parent.getValueFromPosition( this.data.position + (eventObj[axis] || this.data.start) - this.data.start );
                this.set(value);
                
                event.preventDefault();
                return false;
            };
            this.mouseup = function() {
                $(document).off('.asRange mousemove.asRange touchend.asRange mouseup.asRange');
                this.$element.trigger('asRange::pointer::end', this);
                return false;
            };

            $(document).on('touchmove.asRange mousemove.asRange', $.proxy(this.mousemove, this))
                .on('touchend.asRange mouseup.asRange', $.proxy(this.mouseup, this));
            return false;
        },
        active: function() {
            this.$element.addClass(this.classes.active);
        },
        deactive: function() {
            this.$element.removeClass(this.classes.active);
        },
        set: function(value) {
            if (this.value === value) {
                return;
            }

            if (this.parent.step) {
                value = this.matchStep(value);
            }
            if (this.options.limit === true) {
                value = this.matchLimit(value);
            } else {
                if (value <= this.parent.min) {
                    value = this.parent.min;
                }
                if (value >= this.parent.max) {
                    value = this.parent.max;
                }
            }
            this.value = value;

            this.updatePosition();
            this.$element.focus();

            this.$element.trigger('asRange::pointer::change', this);
        },
        updatePosition: function(){
            var position = {};

            position[this.parent.direction.position] = this.getPercent() + '%';
            this.$element.css(position);
        },
        getPercent: function(){
            return ((this.value - this.parent.min) / this.parent.interval) * 100;
        },
        get: function() {
            return this.value;
        },
        matchStep: function(value) {
            var step = this.parent.step,
                decimal = step.toString().split('.')[1];

            value = Math.round(value / step) * step;

            if(decimal){
                value = value.toFixed(decimal.length);
            }
            
            return parseFloat(value);
        },
        matchLimit: function(value) {
            var left, right, pointer = this.parent.pointer;

            if (this.uid === 1) {
                left = this.parent.min;
            } else {
                left = pointer[this.uid - 2].value;
            }

            if (pointer[this.uid] && pointer[this.uid].value !== null) {
                right = pointer[this.uid].value;
            } else {
                right = this.parent.max;
            }

            if (value <= left) {
                value = left;
            }
            if (value >= right) {
                value = right;
            }
            return value;
        },
        destroy: function() {
            this.$element.off('.asRange');
            this.$element.remove();
        }
    };

    $.fn.asRange = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)$/.test(method)) || (method === 'val' && method_arguments === [])) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };

}(jQuery));