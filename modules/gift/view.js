define(["libs/client/views/base", "models/gift", "modules/gift/giftItemView", "models/userInfo"], function(Base, gift, GiftItemView, userInfo) {
  var d;
  var View = Base.extend({
    moduleName: "gift",
    events: {
      'click [data-gift-tab]': 'switchGiftTab'
        //'mouseenter .UserhDetils': 'UserhDetilsD',
        //'mouseleave .UserhDetils': 'UserhDetilsH'
    },
    init: function() {
      var self = this;
      this.collection = gift;
      this.listenTo(gift, 'sync', this.initCarousel.bind(this));
      this.listenTo(gift, 'add', this.renderItem.bind(this));
      this.listenTo(userInfo, 'change:username', this.render.bind(this));
      userInfo.cache(function() {
        self.render();
      });
    },
    render: function() {
      var self = this;
      this.loadTemplate('index', function(template) {
        var data = gift.toJSON();
        self.$el.html(template({
          result: data,
          userInfo: userInfo.toJSON(),
          now: gift.now
        }));
        self.renderItems();
      });
    },
    initCarousel: function() {
      var carousel = this.$('.gift_con_listL').tinycarousel({
        step: 5,
        infinite: false
      });
      this.carousel = carousel.data('plugin_tinycarousel');
      this.carousel.update();
      this.carousel.move(0);
    },
    renderItems: function() {
      var params = {
        data: {}
      };
      params.data['class'] = '1';
      gift.remove(gift.models);
      gift.fetch(params);
    },
    renderItem: function(model) {
      var self = this;
      var view = new GiftItemView({
        model: model,
        collection: self.collection,
        giftView: self,
        el: $('<li data-itemid="' + model.get('id') + '" class="' + (model.get('children') ? 'has_child' : '') + '" data-baidu data-baidu-category="gift" data-baidu-action="buy_item" data-baidu-label="' + model.get('id') + '" data-baidu-value="' + model.get('bid') + '"/>')
      });
      view.on('afterrender', function() {
        if (self.carousel) {
          setTimeout(self.carousel.update.bind(self.carousel));
        }
      });
      self.$('.gift_show_list').append(view.render().$el);
      self.UserhDetilsD();
    },
    switchGiftTab: function(e) {
      var $target = $(e.target);
      var $tabs = this.$('[data-gift-tab]');
      $tabs.removeClass('on');
      $target.addClass('on');
      var params = {
        data: {}
      };
      params.data['class'] = $target.attr('data-gift-tab');
      gift.fetch(params, {
        reset: true
      });
      this.$('.gift_show_list').html('');
    },
    UserhDetilsD: function() {
      var self = this;
      var helpnum = $('#helpDetis');
      this.loadTemplate('critprobability', function(template) {
        d = dialog({
          skin: 'dialogBluebgGames gamefresh_dialog',
          title: ' ',
          // follow: document.getElementById('helpDetis'),
          width: 270,
          height: 180,
          drag: true
        });
        self.setElement(d._popup);
        if (helpnum) {
          helpnum.on('mouseenter', function() {
            var html = template({});
            d.content(html);
            d.show();
          })
        }
      })
    },
    UserhDetilsH: function() {
      alert(123)
      if (d) {
        this._hideChildTimer = setTimeout(function() {
          d.hide();
          d = null;
        }, 200);
      }
    }
  });
  return View;
});