/* eslint-disable strict */
/* global $: true */

function initExpandable() {
  var el = $(this)
  var trigger = el.data('trigger')
  var toggleClass = 'expandable--collapsed' // 'expandable--expanded';
  var toggleEventType = el.data('event') || 'click'
  el.on(toggleEventType, trigger, function () {
    el.toggleClass(toggleClass)
  })
}

$(function () {
  $('expandable').each(initExpandable)
})
