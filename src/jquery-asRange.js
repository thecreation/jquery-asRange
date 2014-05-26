/*
 * range
 * https://github.com/amazingSurge/jquery-range
 *
 * Copyright (c) 2013 amazingSurge
 * Licensed under the GPL license.
 */

(function($) {
    function isTouchDevice() {
        var el = document.createElement('div');
        el.setAttribute('ongesturestart', 'return;');
        if (typeof el.ongesturestart === "function") {
            return true;
        } else {
            return false;
        }
    }

    var Touch = isTouchDevice(),
        downEvent,
        upEvent,
        moveEvent;

    if (Touch) {
        downEvent = 'touchstart.asRange';
        upEvent = 'touchend.asRange';
        moveEvent = 'touchmove.asRange';
    } else {
        downEvent = 'mousedown.asRange';
        upEvent = 'mouseup.asRange';
        moveEvent = 'mousemove.asRange';
    }
    var getEventObject = function(event) {
        var a = event.originalEvent;
        if (Touch) {
            a = a.touches[0];
        }
        return a;
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
            var self = this,
                page, position, offset = this.parent.$element.offset();

            if (this.parent.enabled === false) {
                return;
            }

            this.$element.trigger('asRange::pointer::start', this);

            page = this.parent.page;
            position = this.parent.position;

            this.data = {};
            this.data.start = event[page];
            this.data[position] = event[page] - offset[position];

            this.set('px', this.data[position]);

            $.each(this.parent.pointer, function(i, p) {
                p.$element.removeClass(self.classes.active);
            });

            this.$element.addClass(self.classes.active);

            this.mousemove = function(event) {
                var origin = event,
                    eventObj = getEventObject(event),
                    value = this.data[position] + (eventObj[page] || this.data.start) - this.data.start;
                this.set('px', value);
                origin.preventDefault();
                return false;
            };
            this.mouseup = function() {
                $(document).off(moveEvent).off(upEvent);
                this.$element.trigger('asRange::pointer::end', this);
                return false;
            };

            // $(document).on({
            //     mousemove: $.proxy(this.mousemove, this),
            //     mouseup: $.proxy(this.mouseup, this)
            // });

            $(document).on(moveEvent, $.proxy(this.mousemove, this)).on(upEvent, $.proxy(this.mouseup, this));
            return false;
        },
        set: function(from, value) {
            if (from === 'px') {
                value = value / this.parent.getLength();
            }
            if (from === 'actual') {
                value = (value - this.parent.min) / this.parent.interval;
            }
            if (from === 'percent') {
                value = value;
            }
            this._set(value);
        },
        _set: function(value) {
            if (this.value === value) {
                return;
            }
            var position = {};

            value = Math.round(value * 1000) / 1000;
            if (this.parent.step > 0) {
                value = this.setStep(value);
            }
            if (this.options.limit === true) {
                value = this.setLimit(value);
            } else {
                if (value <= 0) {
                    value = 0;
                }
                if (value >= 1) {
                    value = 1;
                }
            }
            value = Math.round(value * 1000) / 1000;
            this.value = value;

            position[this.parent.position] = value * 100 + '%';
            this.$element.css(position);
            this.$element.focus();

            this.$element.trigger('asRange::pointer::change', this);
        },
        get: function() {
            return this.value;
        },
        setStep: function(value) {
            var value = value * this.parent.interval + this.parent.min,
                step = this.parent.step;
            value = Math.round(value / step) * step;
            return (value - this.parent.min) / this.parent.interval;
        },
        setLimit: function(value) {
            var left, right, pointer = this.parent.pointer;

            if (this.uid === 1) {
                left = 0;
            } else {
                left = pointer[this.uid - 2]['value'];
            }

            if (pointer[this.uid]) {
                right = pointer[this.uid]['value'];
            } else {
                right = 1;
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
            this.$element.off(downEvent);
            this.$element.remove();
        }
    };

    // main constructor
    var AsRange = $.asRange = function(range, options) {
        var metas = {},
            direction = {
                v: {
                    page: 'pageY',
                    position: 'top'
                },
                h: {
                    page: 'pageX',
                    position: 'left'
                }
            };

        this.range = range;
        this.$range = $(range);
        this.$element = null;

        $.each(this.$range.data(), function(k, v) {
            var re = new RegExp("^range", "i");
            if (re.test(k)) {
                metas[k.toLowerCase().replace(re, '')] = v;
            }
        });

        if (this.$range.is('input')) {
            var inputValue = this.$range.attr('value');
            if (inputValue) {
                // array format
                metas.value = inputValue.split(',');
            }

            var self = this;
            $.each(['min', 'max', 'step'], function(key, value) {
                var val = parseFloat(self.$range.attr(value));
                if (!isNaN(val)) {
                    metas[value] = val;
                }
            });

            this.$range.css({
                display: 'none'
            });
            this.$element = $("<div></div>");
            this.$range.after(this.$element);

            // attach value change to input element
            this.$element.on('asRange::pointer::change', function(event, instance) {
                self.$range.attr('value', instance.value);
            });
        } else {
            this.$element = this.$range;
        }

        this.$element.css({
            position: 'relative'
        });

        this.options = $.extend({}, AsRange.defaults, options, metas);
        this.namespace = this.options.namespace;
        this.components = $.extend(true, {}, this.components);

        // public properties
        this.value = this.options.value;
        this.min = this.options.min;
        this.max = this.options.max;
        this.step = this.options.step;
        this.interval = this.max - this.min;

        // flag
        this.initialized = false;
        this.updating = false;
        this.disabled = false;
        this.page = direction[this.options.direction]['page'];
        this.position = direction[this.options.direction]['position'];

        this.$element.addClass(this.namespace);

        if (this.options.skin) {
            this.$element.addClass(this.namespace + '_' + this.options.skin);
        }

        if (this.max < this.min || this.step >= this.interval) {
            throw new Error('error options about max min step');
        }

        this.init();
    };

    AsRange.prototype = {
        constructor: AsRange,
        components: {},

        init: function() {
            var self = this;
            this.pointer = [];

            //this.$bar = $('<span class="range-bar"></span>').appendTo(this.$element);
            for (var i = 1; i <= this.options.pointer; i++) {
                var $pointer = $('<div class="' + this.namespace + '-pointer pointer-' + i + '"></div>').appendTo(this.$element);
                var p = new Pointer($pointer, i, this);
                this.pointer.push(p);
            }

            // alias of pointer
            this.p1 = this.pointer[0];
            this.p2 = this.pointer[1];
            this.p3 = this.pointer[2];

            // initial components
            this.components.view.init(this);
            if (this.options.tip !== false) {
                this.components.tip.init(this);
            }
            if (this.options.scale !== false) {
                this.components.scale.init(this);
            }

            // initial pointer value
            this.set(this.value);
            this.$element.on(downEvent, function(event) {
                var event = getEventObject(event),
                    rightclick = (event.which) ? (event.which === 3) : (event.button === 2);
                if (rightclick && !Touch) {
                    return false;
                }

                var offset = self.$element.offset(),
                    start = event[self.page] - offset[self.position],
                    p = self.stickTo.call(self, start);

                p.mousedown.call(p, event);
                return false;
            });

            if (this.$range.is('input')) {
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
                    self.$element.trigger('asRange::change', self);
                    return false;
                });
            });

            this.$element.trigger('asRange::ready', this);
            this.initialized = true;
        },
        stickTo: function(start) {
            var value = start / this.getLength();

            if (this.options.pointer === 1) {
                return this.p1;
            }
            if (this.options.pointer === 2) {
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
            }
        },
        getLength: function() {
            if (this.direction === 'v') {
                return this.$element.height();
            } else {
                return this.$element.width();
            }
        },

        /*
            Public Method
         */
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
                value = [],
                step = self.step;
            var length = step.toString().split('.')[1] ? step.toString().split('.')[1].length : 0;
            $.each(this.pointer, function(i, p) {
                var pointerValue = p.get() * self.interval + self.min;
                pointerValue = Math.round(pointerValue / self.step) * self.step;
                if (length > 0) {
                    pointerValue = parseFloat(pointerValue.toFixed(length));
                }
                value[i] = pointerValue;
            });
            return value;
        },
        set: function(value) {
            if (typeof value === 'number') {
                value = [value];
            }
            if (!$.isArray(value)) {
                return;
            }
            $.each(this.pointer, function(i, p) {
                p.set('actual', value[i]);
            });
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
            this.$element.removeClass(this.namespace + 'disabled');
            return this;
        },
        disable: function() {
            this.disabled = true;
            this.$element.addClass(this.namespace + 'disabled');
            return this;
        },
        destroy: function() {
            $.each(this.pointer, function(i, p) {
                p.destroy();
            });
            this.$element.destroy();
        }
    };

    AsRange.defaults = {
        namespace: 'asRange',
        skin: null,

        max: 100,
        min: 0,
        value: [0, 20],
        step: 10,
        limit: true,
        pointer: 2,
        direction: 'h', // 'v' or 'h'
        keyboard: true,
        replaceFirst: 'default',

        // components
        tip: true,
        scale: true,

        format: function(value) {
            // to do
            return value;
        },
        onChange: function() {},
        // on mouse up 
        callback: function() {}
    };

    AsRange.registerComponent = function(component, methods) {
        AsRange.prototype.components[component] = methods;
    };

    $.fn.asRange = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            return this.each(function() {
                var api = $.data(this, 'asRange');
                if (typeof api[method] === 'function') {
                    api[method].apply(api, method_arguments);
                }
            });
        } else {
            return this.each(function() {
                if (!$.data(this, 'asRange')) {
                    $.data(this, 'asRange', new AsRange(this, options));
                }
            });
        }
    };

}(jQuery));
