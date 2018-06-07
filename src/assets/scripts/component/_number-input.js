  var NUMBER_INPUT_SELECTOR = '.u-number-input';

  function initNumberInput() {
    var container = $(this);
    if (container.hasClass('.u-number-input_inited')) {
      return;
    }

    container.addClass('u-number-input_inited');

    var input = $('input', container[0]);
    var btnDecrease = $('<button class="u-number-input__button u-number-input__button_decrease" type="button">-</button>').appendTo(container);
    var btnIncrease = $('<button class="u-number-input__button u-number-input__button_increase" type="button">+</button>').appendTo(container);

    function getFloatProperty(prop, defalutValue) {
      var value = parseFloat(input.attr(prop));
      return isFinite(value) ? value : defalutValue;
    }

    var min = getFloatProperty('min', -Infinity);
    var max = getFloatProperty('max', Infinity);
    var step = getFloatProperty('step', 1);
    var isMuted = input.prop('disabled') || input.prop('readonly');

    function increaseValue(valueIncrese) {
      valueIncrese = valueIncrese || 0;
      var currentValue = +input.val() || 0;
      var newValue = currentValue + valueIncrese;
      if (newValue < min) {
        newValue = min;
      } else if (newValue > max) {
        newValue = max;
      }

      if (newValue !== currentValue) {
        input.val(newValue);
        input.trigger('change');
      }
    }

    btnDecrease.on('click', function() {
      increaseValue(- step);
    });

    btnIncrease.on('click', function() {
      increaseValue(step);
    });

    input.on('change', function(){
      var currentValue = +input.val() || 0;
      btnDecrease.prop('disabled', isMuted || currentValue <= min);
      btnIncrease.prop('disabled', isMuted || currentValue >= max);
    }).trigger('change');

    // increaseValue();
  }

  $(function() {
    $(NUMBER_INPUT_SELECTOR).each(initNumberInput);
  });
