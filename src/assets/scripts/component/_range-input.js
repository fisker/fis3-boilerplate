/* eslint-disable strict */
/* global $: true */

function initRangeInput() {
  var container = $(this).addClass('u-range-input_inited')

  if (window.navigator.userAgent.indexOf('AppleWebKit') === -1) {
    return
  }
  var input = $('input', container[0])
  var track = $('<span class="u-range-input__track">').appendTo(container)
  var indicate = $(
    '<span class="u-range-input__indicate" style="width: 0">'
  ).appendTo(track)
  var min = +input.attr('min') || 0
  var max = +input.attr('max') || 1
  input
    .on('input', function() {
      var percentage = ((min + input.val()) / (max - min)) * 100
      indicate.css({
        width: percentage + '%',
      })
    })
    .trigger('input')
}

$(function() {
  $('.u-range-input').each(initRangeInput)
})
