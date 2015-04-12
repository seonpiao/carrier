define(["libs/client/views/base", "libs/client/models/base", "modules/game/gameItemRaiseView", "models/girlItem"], function(Base, Model, GameItemRaiseView, GirlItem) {
  var View = Base.extend({
    moduleName: "game",
    template: 'gameHope',
    events: {
      'click .btn_buy': 'raise'
    },
    init: function() {},
    raise: function(e) {
      var self = this;
      var $target = $(e.target);
      if ($target.hasClass('disabled')) {
        return;
      }
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            var index = $target.attr('data-itemid') * 1 - 1;
            var model = new GirlItem(self.model.get('wish')[index]);
            model.set({
              bid: self.model.get('bid'),
              bidtype: self.model.get('bidtype'),
              eventid: self.model.get('eventid'),
              subtype: self.model.get('subtype'),
              subgameid: self.model.get('subgameid'),
              optionid: $target.attr('data-itemid')
            });
            self.module('raise', 'game', function(raise) {
              self.loadTemplate('gameItemRaise', function(template) {
                raise.setModel(model);
                raise.setCollection(self.collection);
                raise.setTemplate('raise', template);
                raise.show();
                raise.once('success', function(model) {
                  self.collection.fetch();
                });
              });
            });
          });
        }
      });
    }
  });
  return View;
});