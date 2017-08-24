(function(win, docEl) {
  'use strict';
  var timer;
  function calcRem() {
    docEl.style.fontSize = Math.min(docEl.getBoundingClientRect().width, 640) / 320 * 16 + 'px';
  }
  function delay() {
    if (timer) {
      win.clearTimeout(timer);
    }
    timer = win.setTimeout(calcRem, 300);
  }
  calcRem();
  win.addEventListener('resize', delay, false);
  win.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      delay();
    }
  }, false);
})(window, document.documentElement);
