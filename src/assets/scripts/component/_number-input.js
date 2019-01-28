/* eslint-disable strict */
/* global $: true */
var NUMBER_INPUT_SELECTOR = '.u-number-input'

function initNumberInput() {
  var container = $(this)
  if (container.hasClass('.u-number-input_inited')) {
    return
  }

  container.addClass('u-number-input_inited')

  var input = $('input', container[0])
  var btnDecrease = $(
    '<button class="u-number-input__button u-number-input__button_decrease" type="button">-</button>'
  ).appendTo(container)
  var btnIncrease = $(
    '<button class="u-number-input__button u-number-input__button_increase" type="button">+</button>'
  ).appendTo(container)

  function getFloatProperty(prop, defalutValue) {
    var value = parseFloat(input.attr(prop))
    return isFinite(value) ? value : defalutValue
  }

  var min = getFloatProperty('min', -Infinity)
  var max = getFloatProperty('max', Infinity)
  var step = getFloatProperty('step', 1)
  var isMuted = input.prop('disabled') || input.prop('readonly')

  function increaseValue(valueIncrese, noTrigger) {
    valueIncrese = valueIncrese || 0
    var textValue = input.val()
    var currentValue = parseFloat(textValue)

    if (isNaN(currentValue)) {
      currentValue = ''
    } else {
      currentValue += valueIncrese

      if (currentValue % step) {
        currentValue = Math.floor(currentValue / step) * step
      }

      if (currentValue < min) {
        currentValue = min
      }
      if (currentValue > max) {
        currentValue = max
      }
    }

    var changed = String(currentValue) !== textValue

    if (changed) {
      input.val(currentValue)
    }

    setButton(currentValue)
    return changed
  }

  function setButton(currentValue) {
    btnDecrease.prop('disabled', isMuted || currentValue <= min)
    btnIncrease.prop('disabled', isMuted || currentValue >= max)
  }

  btnDecrease.on('click', function() {
    if (increaseValue(-step)) {
      input.trigger('change')
    }
  })

  btnIncrease.on('click', function() {
    if (increaseValue(step)) {
      input.trigger('change')
    }
  })

  input
    .on('change', function() {
      increaseValue()
    })
    .trigger('change')
}

$(function() {
  $(NUMBER_INPUT_SELECTOR).each(initNumberInput)
})
