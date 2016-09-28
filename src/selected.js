import $ from 'jquery';


export default {
  defaults: {},
  init(instance) {
    this.$arrow = $('<span></span>').appendTo(instance.$wrap);
    this.$arrow.addClass(`${instance.namespace}-selected`);

    if (instance.options.range === false) {
      instance.p1.$element.on(`${instance.namespace}::move`, (e, pointer) => {
        this.$arrow.css({
          left: 0,
          width: `${pointer.getPercent()}%`
        });
      });
    }

    if (instance.options.range === true) {
      const onUpdate = () => {
        let width = instance.p2.getPercent() - instance.p1.getPercent();
        let left;
        if (width >= 0) {
          left = instance.p1.getPercent();
        } else {
          width = -width;
          left = instance.p2.getPercent();
        }
        this.$arrow.css({
          left: `${left}%`,
          width: `${width}%`
        });
      };
      instance.p1.$element.on(`${instance.namespace}::move`, onUpdate);
      instance.p2.$element.on(`${instance.namespace}::move`, onUpdate);
    }
  }
};
