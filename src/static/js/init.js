omtype.init = function() {
  omtype.currentTracker = new omtype.tracker(
      'typer',
      omtype.pages.whitman);
  omtype.currentTracker.render();
};

omtype.init();
