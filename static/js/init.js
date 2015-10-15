manotype.init = function() {
  manotype.currentTracker = new manotype.tracker(
      'typer',
      manotype.pages.whitman);
  manotype.currentTracker.render();
};

manotype.init();
