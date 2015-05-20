define(["libs/client/views/base", "models/playGame", "models/userFund", "modules/game/buySuccess"], function(Base, PlayGame, userFund, BuySuccess) {
  var View = Base.extend({
    moduleName: "game",
    template: 'gameVote',
    events: {
      'click .option': 'change',
      'click .btn_raise': 'raise'
    },
    init: function() {
      this._currOption = '1';
      this.on('afterrender', function(e) {
        this.$scrollbar = $('.vote_scroll');
        this.$scrollbar.tinyscrollbar({
          trackSize: 110
        });
      });
    },
    change: function(e) {
      var $target = $(e.currentTarget);
      var optionId = $target.attr('data-optionid');
      this.$('.the_odds').addClass('hide');
      this.$('.option').removeClass('on');
      $target.find('.the_odds').removeClass('hide');
      $target.addClass('on');
      this._currOption = optionId;
    },
    raise: function(e) {
      var self = this;
      var $target = $(e.target);
      if ($target.hasClass('disabled')) {
        return;
      }
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            $target.addClass('disabled');
            var playGame = new PlayGame();
            playGame.$btn = $target;
            playGame.once('sync', self.success.bind(self));
            var params = {
              eventid: self.model.get('eventid'),
              subtype: self.model.get('subtype'),
              girlid: window.girlid,
              subgameid: self.model.get('subgameid'),
              optionid: self._currOption,
              bid: self.model.get('bid'),
              bidtype: self.model.get('bidtype')
            }
            playGame.fetch({
              data: params
            });
          });
        }
      });
    },
    success: function(model, resp) {
      var self = this;
      if (resp.success === 200) {
        userFund.fetch();
        this.collection.fetch();
        new BuySuccess().show();
      } else {
        this.module('insufficient', function(module) {
          if (module) {
            module.show({
              bidtype: self.model.get('bidtype'),
              price: self.model.get('bid'),
              name: '投票'
            });
          }
        });
        model.$btn.removeClass('disabled');
      }
    }
  });
  return View;
});