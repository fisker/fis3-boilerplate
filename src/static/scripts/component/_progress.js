  var supportProgress = document.createElement('progress').max === 1;

  function initProgress() {
    if (supportProgress) {
      return;
    }
    var progress = $(this);
    var progressBar = progress.find('.progress-bar');
    if (!progressBar.length) {
      $('<div class="progress-bar">').appendTo(progress);
    }
    var value = +progress.val() || +progress.attr('value');
    setProgressValue(progress, value);
  }

  function setProgressValue(progress, value) {
    progress = $(progress).val(value);
    if (supportMeter) {
      return;
    }
    var max = +progress.attr('max') || 1;
    var progressBar = progress.find('.progress-bar');
    if (value > max) {
      value = max;
    }
    progressBar.css('width', value / max * 100 + '%');
  }

  $.fn.progressValue = $.fn.progressVal = function(value) {
    return $(this).each(function() {
      setProgressValue(this, value);
    });
  };

  $(function() {
    $('progress').each(initProgress);
  });
