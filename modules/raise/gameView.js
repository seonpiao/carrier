define(["modules/raise/view", "models/playGame"], function(Base, PlayGame) {
  var View = Base.extend({
    moduleName: "raise",
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
    }
  });
  return View;
});