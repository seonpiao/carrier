define(["libs/client/views/base", "models/playGame", "models/userFund", "modules/game/buySuccess", "modules/game/gameItemRaiseView", "models/girlItem"], function(Base, PlayGame, userFund, BuySuccess, GameItemRaiseView, GirlItem) {
  var View = Base.extend({
    moduleName: "game",
    template: 'gameRoomRaise',
    events: {
      'click .btn_raise': 'raise'
    },
    init: function() {},
    raise: function(e) {
      var self = this;
      var $target = $(e.target);
      var targetfunds = (this.model.get('targetfunds') || 0) * 1;
      var curfunds = this.model.get('curfunds') * 1;
      if ((curfunds) >= targetfunds || targetfunds == 0) {
        return;
      }
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            var model = new GirlItem(self.model.get('roomitem'));
            model.set({
              bid: self.model.get('bid'),
              bidtype: self.model.get('bidtype'),
              eventid: self.model.get('eventid'),
              subtype: self.model.get('subtype'),
              subgameid: self.model.get('subgameid'),
              optionid: self.model.get('roomitem').id,
              targetfunds: targetfunds,
              curfunds: curfunds,
              girlid: window.girlid,
            });
            self.module('raise', 'game', function(raise) {
              self.loadTemplate('gameItemRaise', function(template) {
                raise.setModel(model);
                raise.setCollection(self.collection);
                raise.setTemplate('raise', template);
                raise.show();
                raise.once('success', function(model) {
                  self.collection.fetch();
                  var $pointer = self.$('.arrow_rightpointer');
                  if ($pointer.length > 0) {
                    self.module('numtip', 'roomRaise', function(numtip) {
                      if (numtip) {
                        numtip.show({
                          elem: $pointer[0],
                          num: model.filter.bid,
                          align: 'right'
                        });
                      }
                    });
                  }
                });
              });
            });
            // self.raiseView = new GameItemRaiseView({
            //   model: model,
            //   collection: self.collection
            // });
            // self.raiseView.show();
          });
        }
      });
    }
  });
  return View;
});