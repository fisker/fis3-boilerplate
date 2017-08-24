  // checked
  function supportChecked() {
    var el = $(this);
    el.on('change', function() {
      var isChecked = el.prop('checked');
      el[isChecked ? 'addClass' : 'removeClass']('pseudo-checked');
      $('~ *', this).css({zoom: 1}).css({zoom: ''});
    }).trigger('change');
  }

  function detectChecked() {
    var id = 'test-obj-input-radio';
    var testWidth = 101;
    var input = $('<input id="' + id + '" type="radio" checked>').appendTo('body');
    var style = $('<style>#' + id + ':checked{width:' + testWidth + 'px;}</style>').appendTo('head');
    var width = input.outerWidth();
    input.remove();
    style.remove();
    return width >= testWidth;
  }

  $(function() {
    if (!detectChecked()) {
      $('input[type="checkbox"], input[type="radio"]').each(supportChecked);
    }
  });
