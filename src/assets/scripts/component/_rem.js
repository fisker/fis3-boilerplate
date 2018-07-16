/* globals window: true, document: true */
;(function(win, root) {
  'use strict'
  var timer
  var clearTimeout = win.clearTimeout
  var setTimeout = win.setTimeout

  function calcRem() {
    root.style.fontSize =
      (Math.min(root.getBoundingClientRect().width, 640) / 320) * 16 + 'px'
  }

  function delay() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(calcRem, 300)
  }
  calcRem()
  win.addEventListener('resize', delay, false)
  win.addEventListener(
    'pageshow',
    function(e) {
      if (e.persisted) {
        delay()
      }
    },
    false
  )
})(window, document.documentElement)
