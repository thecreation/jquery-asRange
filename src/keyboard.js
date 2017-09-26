import $ from 'jquery';

export default function () {
  const $doc = $(document);

  $doc.on('asRange::ready', (event, instance) => {
    let step;

    const keyboard = {
      keys: {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        RETURN: 13,
        ESCAPE: 27,
        BACKSPACE: 8,
        SPACE: 32
      },
      map: {},
      bound: false,
      press(e) {
        /* eslint consistent-return: "off"*/
        const key = e.keyCode || e.which;
        if (key in keyboard.map && typeof keyboard.map[key] === 'function') {
          keyboard.map[key](e);
          return false;
        }
      },
      attach(map) {
        let key;
        let up;
        for (key in map) {
          if (map.hasOwnProperty(key)) {
            up = key.toUpperCase();
            if (up in keyboard.keys) {
              keyboard.map[keyboard.keys[up]] = map[key];
            } else {
              keyboard.map[up] = map[key];
            }
          }
        }
        if (!keyboard.bound) {
          keyboard.bound = true;
          $doc.bind('keydown', keyboard.press);
        }
      },
      detach() {
        keyboard.bound = false;
        keyboard.map = {};
        $doc.unbind('keydown', keyboard.press);
      }
    };

    if (instance.options.keyboard === true) {
      $.each(instance.pointer, (i, p) => {
        if (instance.options.step) {
          step = instance.options.step;
        } else {
          step = 1;
        }
        const left = () => {
          const value = p.value;
          p.set(value - step);
        };
        const right = () => {
          const value = p.value;
          p.set(value + step);
        };
        p.$element.attr('tabindex', '0').on('focus', () => {
          keyboard.attach({
            left,
            right
          });
          return false;
        }).on('blur', () => {
          keyboard.detach();
          return false;
        });
      });
    }
  });
}
