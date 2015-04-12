define(["libs/client/views/base", 'models/girlItemList', "models/playGame", "modules/game/buySuccess", "models/userFund"], function(Base, girlItemList, PlayGame, BuySuccess, userFund) {
  var View = Base.extend({
    moduleName: "game",
    template: 'gameItemRaise',
    raise: function(e) {
      var self = this;
      var $target = $(e.target);
      if ($target.hasClass('disabled')) {
        return;
      }
      $target.addClass('disabled');
      var playGame = new PlayGame();
      playGame.$btn = $target;
      playGame.once('sync', self.success.bind(self));
      playGame.once('error', self.success.bind(self));
      var $input = this.$('.bid_pricek');
      var params = {
        eventid: self.model.get('eventid'),
        subtype: self.model.get('subtype'),
        girlid: window.girlid,
        subgameid: self.model.get('subgameid'),
        optionid: self.model.get('optionid'),
        bid: $input.val(),
        bidtype: self.model.get('bidtype')
      };
      playGame.fetch({
        data: params
      });
    },
    success: function(model, resp) {
      var self = this;
      if (resp.success === 200) {
        userFund.fetch();
        this.collection.fetch();
        new BuySuccess().show();
        this.hide();
      } else {
        this.module('insufficient', function(module) {
          if (module) {
            module.show({
              bidtype: self.model.get('bidtype'),
              price: self.model.get('bid'),
              name: self.model.get('name'),
              quality: self.model.get('quality')
            });
          }
        });
        model.$btn.removeClass('disabled');
      }
    }
  });
  return View;
});