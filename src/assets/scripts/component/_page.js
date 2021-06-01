/* eslint-disable strict */
/* global $: true */

$(function () {
  $('.page__header, .page__footer').each(function () {
    var el = $(this)
    if (el.css('position') === 'fixed') {
      el.wrap(
        $('<div class="page__fixed-dummy">').css({
          height: el.outerHeight(),
          zIndex: el.css('zIndex')
        })
      )
    }
  })
})
