define(["libs/client/views/base", "models/nowGame", "models/gameList", "modules/game/gameRatingView", "modules/game/gameSingleRaiseView", "modules/game/gameRaiseView", "modules/game/gameClueView", "modules/game/gameBetView", "modules/game/gameVoteView", "modules/game/gameRoomRaiseView", "modules/game/gameHopeView"], function(Base, nowGame, gameList, GameRatingView, GameSingleRaiseView, GameRaiseView, GameClueView, GameBetView, GameVoteView, GameRoomRaiseView, GameHopeView) {
  var View = Base.extend({
    moduleName: "game",
    events: {
      'click [data-game-tab]': 'switchGameTab'
    },
    init: function() {
      this.listenTo(nowGame, 'sync', this.setGameInfo.bind(this));
      nowGame.fetch();
      this._timer = setInterval(nowGame.fetch.bind(nowGame), 60000);
    },
    destroy: function() {
      clearInterval(this._timer);
    },
    switchGameTab: function(e) {
      var $target = $(e.target);
      var $tabs = this.$('[data-game-tab]');
      var templateName = $target.attr('data-tmpl');
      var GameBlocks = {
        'gameClue': GameClueView,
        'gameRating': GameRatingView,
        'gameRaise': GameRaiseView,
        'gameSingleRaise': GameSingleRaiseView,
        'gameBet': GameBetView,
        'gameVote': GameVoteView,
        'gameRoomRaise': GameRoomRaiseView,
        'gameHope': GameHopeView
      };
      $tabs.removeClass('on');
      $target.addClass('on');
      this.$('.games_start_main').html('');
      var self = this;
      var atomid = $target.attr('data-game-tab');
      if (this._currGame) {
        this._currGame.set('focus', false);
      }
      var self = this;
      this.loadTemplate(templateName, function(template) {
        var model = gameList.get(atomid);
        var gameBlock = new GameBlocks[templateName]({
          model: model,
          collection: nowGame
        });
        model.set('focus', true);
        self._currGame = model;
        self.$('.games_start_main').append(gameBlock.$el);
        gameBlock.render();
      });
    },
    setGameInfo: function(model, resp) {
      var self = this;
      this.loadTemplate('index', function(template) {
        var focus = gameList.findWhere({
          focus: true
        });
        if (focus) {
          self._currGame = focus;
        }
        var list = gameList.toJSON();
        self.$el.html(template({
          list: list
        }));
        if (list.length > 0) {
          self.$('.games_panel').removeClass('hide');
          self.$('.noplayname_bg').hide();
          if (!focus) {
            self.$('[data-game-tab]').eq(0).click();
          } else {
            self.$('[data-game-tab=' + focus.get('atomid') + ']').eq(0).click();
          }
        } else {
          self.$('.games_panel').addClass('hide');
          self.$('.noplayname_bg').show();
        }
      });
    }
  });
  return View;
});