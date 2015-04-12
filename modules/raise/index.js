define(["modules/raise/view", "modules/raise/gameView"], function(View, GameView) {
  return {
    init: function(el) {
      if (el.attr('data-raise-type') === 'game') {
        var view = new GameView({
          el: el
        });
      } else {
        var view = new View({
          el: el
        });
      }
    }
  };
});