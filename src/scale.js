import $ from 'jquery';

export default {
  defaults: {
    scale: {
      valuesNumber: 3,
      gap: 1,
      grid: 5
    }
  },
  init(instance) {
    const opts = $.extend({}, this.defaults, instance.options.scale);
    const scale = opts.scale;
    scale.values = [];
    scale.values.push(instance.min);
    const part = (instance.max - instance.min) / (scale.valuesNumber - 1);
    for (let j = 1; j <= scale.valuesNumber - 2; j++) {
      scale.values.push(part * j);
    }
    scale.values.push(instance.max);
    const classes = {
      scale: `${instance.namespace}-scale`,
      lines: `${instance.namespace}-scale-lines`,
      grid: `${instance.namespace}-scale-grid`,
      inlineGrid: `${instance.namespace}-scale-inlineGrid`,
      values: `${instance.namespace}-scale-values`
    };

    const len = scale.values.length;
    const num = ((scale.grid - 1) * (scale.gap + 1) + scale.gap) * (len - 1) + len;
    const perOfGrid = 100 / (num - 1);
    const perOfValue = 100 / (len - 1);

    this.$scale = $('<div></div>').addClass(classes.scale);
    this.$lines = $('<ul></ul>').addClass(classes.lines);
    this.$values = $('<ul></ul>').addClass(classes.values);

    for (let i = 0; i < num; i++) {
      let $list;
      if (i === 0 || i === num || i % ((num - 1) / (len - 1)) === 0) {
        $list = $(`<li class="${classes.grid}"></li>`);
      } else if (i % scale.grid === 0) {
        $list = $(`<li class="${classes.inlineGrid}"></li>`);
      } else {
        $list = $('<li></li>');
      }

      // position scale
      $list.css({
        left: `${perOfGrid * i}%`
      }).appendTo(this.$lines);
    }

    for (let v = 0; v < len; v++) {
      // position value
      $(`<li><span>${scale.values[v]}</span></li>`).css({
        left: `${perOfValue * v}%`
      }).appendTo(this.$values);
    }

    this.$lines.add(this.$values).appendTo(this.$scale);
    this.$scale.appendTo(instance.$wrap);
  },
  update(instance) {
    this.$scale.remove();
    this.init(instance);
  }
};
