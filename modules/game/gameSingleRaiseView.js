define(["libs/client/views/base", "models/playGame", "models/userFund", "modules/game/buySuccess", "modules/game/gameItemRaiseView", "models/girlItem"], function(Base, PlayGame, userFund, BuySuccess, GameItemRaiseView, GirlItem) {
  var View = Base.extend({
    moduleName: "game",
    template: 'gameSingleRaise',
    events: {
      'click .btn_raise': 'customRaise',
      'mouseenter .player_1': 'showLeft',
      'mouseleave .player_1': 'hideLeft',
      'click .financing_props_img': 'customRaise'
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
            $target.addClass('disabled');
            var playGame = new PlayGame();
            playGame.$btn = $target;
            playGame.once('sync', self.success.bind(self));
            var params = {
              eventid: self.model.get('eventid'),
              subtype: self.model.get('subtype'),
              girlid: window.girlid,
              subgameid: self.model.get('subgameid'),
              optionid: self.model.get('field1').id,
              bid: self.model.get('bid'),
              bidtype: self.model.get('bidtype')
            }
            playGame.fetch({
              data: params
            })
          });
        }
      });
    },
    customRaise: function() {
      var self = this;
      var targetfunds = (this.model.get('targetfunds') || 0) * 1;
      var curfunds = this.model.get('curfunds') * 1;
      var firstfunds = this.model.get('firstfunds') * 1;

      if (curfunds >= targetfunds || targetfunds == 0) {
        return;
      }
      self.module('sign', function(sign) {
        if (sign) {
          sign.showSignModel('login', function() {
            var model = new GirlItem(self.model.get('field1'));
            model.set({
              bid: self.model.get('bid'),
              bidtype: self.model.get('bidtype'),
              eventid: self.model.get('eventid'),
              subtype: self.model.get('subtype'),
              subgameid: self.model.get('subgameid'),
              optionid: self.model.get('field1').id,
              targetfunds: targetfunds,
              curfunds: curfunds
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
      // this.raiseView = new GameItemRaiseView({
      //   model: model,
      //   collection: this.collection
      // });
      // this.raiseView.show();
    },
    showLeft: function(e) {
      this.$('.Progress_number').show();
    },
    hideLeft: function(e) {
      this.$('.Progress_number').hide();
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
              name: self.model.get('field1').name,
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