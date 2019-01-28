/* eslint-disable strict */
/* global $: true */

var ratio = (function() {
  var devicePixelRatio = window.devicePixelRatio || 1
  var context = document.createElement('canvas').getContext('2d')
  var backingStoreRatio =
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1

  return devicePixelRatio / backingStoreRatio
})()
