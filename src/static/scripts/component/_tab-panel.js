  var TAB_PANEL_SELECTOR = '.u-tab-panel';
  var TAB_PANEL_CURRENT_CLASS = 'u-tab-panel__tab_current';
  var TAB_PANEL_TAB_SELECTOR = '.u-tab-panel__tab';

  function initTabPanel() {
    var container = $(this);
    container.on('click', TAB_PANEL_TAB_SELECTOR, function() {
      $(this).addClass(TAB_PANEL_CURRENT_CLASS)
        .siblings().removeClass(TAB_PANEL_CURRENT_CLASS);
    });
    var tabs = $(TAB_PANEL_TAB_SELECTOR, this);
    var initialTab = tabs.filter('.' + TAB_PANEL_CURRENT_CLASS);
    if (!initialTab.length) {
      tabs.eq(0).addClass(TAB_PANEL_CURRENT_CLASS);
    }
  }

  $(function() {
    $(TAB_PANEL_SELECTOR).each(initTabPanel);
  });
