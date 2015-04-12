define(["libs/client/views/base", "models/raise", "modules/game/buySuccess", "models/userFund"], function(Base, RaiseModel, BuySuccess, userFund) {
  var View = Base.extend({
    moduleName: "raise",
    template: 'index',
    events: {
      'click .not_use_sale': 'useCard',
      'click .use_sale': 'notUseCard',
      'click .btn_1y': 'raise',
      'click .btn_buy': 'raise',
      'mouseenter .goods_help_show': 'showHelp',
      'mouseleave .goods_help_show': 'hideHelp',
      'input .bid_pricek': 'bidChange',
      'change .bid_pricek': 'bidChange'
    },
    errmsgs: {
      2008034: '当前道具已集资完成'
    },
    init: function(options) {
      options = options || {};
      this.instanceName = this.$el.attr('data-module-raise');
      if ($('[data-module-crit="' + this.instanceName + '"]').length === 0) {
        this.$body.append($('<div data-module="crit" data-module-crit="' + this.instanceName + '"/>'));
      }
    },
    setModel: function(model) {
      this.model = model;
      var card = Math.min((this.model.get('card') || 0) * 1, 10);
      this.model.set('usingCard', card);
    },
    useCard: function(e) {
      var $target = $(e.currentTarget);
      $target.removeClass('not_use_sale');
      $target.addClass('use_sale');
      this.model.set('useCard', true);
      var card = Math.min(10, this.model.get('card'));
      this.$('.total_cost').html(Math.max(10 - card, 0));
    },
    notUseCard: function(e) {
      var $target = $(e.currentTarget);
      $target.removeClass('use_sale');
      $target.addClass('not_use_sale');
      this.model.set('useCard', false);
      this.$('.total_cost').html(10);
    },
    update: function() {
      // this.collection.fetch({
      //   data: this.collection.filter
      // });
    },
    bidChange: function(e) {
      var $target = $(e.target);
      var bid = $target.val() * 1;
      var card = Math.min((this.model.get('card') || 0) * 1, bid);
      this.model.set('usingCard', card);
      this.$('.use_card').html(card);
      var cost = Math.max(bid - card, 0);
      this.$('.total_cost').html(cost);
    },
    render: function(name) {
      var self = this;
      this.loadTemplate(function(template) {
        var html = template(self.model.toJSON());
        self.d.content(html);
        self.trigger('afterrender');
      });
      return this;
    },
    raise: function() {
      this.$bid = this.$('.bid_pricek');
      var raiseParams = {
        itemid: this.model.get('id'),
        girlid: window.girlid,
        bidtype: this.model.get('bidtype'),
        bid: this.$bid.val()
      };
      if (this.model.get('useCard') !== false) {
        raiseParams.card = this.model.get('usingCard') || 0;
      }
      var raiseModel = new RaiseModel({
        actionType: 'raise'
      });
      // this.listenTo(this.model, 'change', this.render.bind(this));
      raiseModel.set({
        quality: this.model.get('quality'),
        name: this.model.get('name')
      });
      this.listenTo(raiseModel, 'sync', this.success.bind(this));
      raiseModel.fetch({
        data: raiseParams
      });

    },
    success: function(model) {
      var self = this;
      if (model.get('success') !== 200) {
        var errcode = model.get('error_code');
        if (errcode == '2008011') {
          var item = self.model;
          this.module('insufficient', function(module) {
            if (module) {
              module.show({
                id: model.filter.itemid,
                bidtype: model.filter.bidtype,
                price: model.filter.bid,
                name: item.get('name'),
                quality: item.get('quality')
              });
              self.d.close();
            }
          });
        } else {
          this.module('errmsg', function(module) {
            if (module) {
              module.show(self.errmsgs[model.get('error_code')] || model.get('error_msg'));
            }
          });
        }
      } else {
        var newfunds;
        var crit = model.get('result').crit * 1;
        model.get('result').bid = model.filter.bid;
        model.get('result').bidtype = model.filter.bidtype;
        userFund.fetch();
        this.hide();
        this.trigger('success', model);
        if (crit > 1) {
          this.showCrit(model);
        } else {
          this.showSuccess(model);
        }
      }
    },
    showSuccess: function(model) {
      new BuySuccess().show();
    },
    showCrit: function(model) {
      this.module('crit', this.instanceName, function(crit) {
        if (crit) {
          crit.setModel(model);
          crit.show();
        }
      });
    },
    show: function(pos) {
      if (this.d) {
        this.hide();
      }
      this.d = dialog({
        skin: 'dialogBluebgGames playgame_dialog',
        title: ' '
      });
      this.d.addEventListener('close', this.remove.bind(this));
      //让view来管理dialog的元
      this.setElement(this.d.__popup);
      this.d.show();
      this.render();
      $('.dialogBluebgGames .ui-dialog-close').text('');
      return this;
    },
    hide: function() {
      this.d.close();
      this.d = null;
    },
    getHelp: function() {
      this.$help = this.$('#Help_goods_showbox');
      return this.$help;
    },
    showHelp: function() {
      var $help = this.getHelp();
      $help.removeClass('hide');
    },
    hideHelp: function() {
      var $help = this.getHelp();
      $help.addClass('hide');
    }
  });
  return View;
});