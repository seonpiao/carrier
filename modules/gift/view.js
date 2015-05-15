define(["libs/client/views/base", "models/gift", "modules/gift/giftItemView", "models/userInfo"], function(Base, gift, GiftItemView, userInfo) {
  var d;
  var View = Base.extend({
    moduleName: "gift",
    events: {
      'click [data-gift-tab]': 'switchGiftTab'
    },
    init: function() {
      var self = this;
      this.collection = gift;
      this.listenToOnce(gift, 'sync', this.initCarousel.bind(this));
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
        var helpnum = $('#helpDetis');
        if (helpnum) {
          helpnum.on('mouseenter', function() {
            self.showUserhDetilsD();
          });
          helpnum.on('mouseleave', function() {
            clearTimeout(self._detailTimer);
          });
        }
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
      gift.remove(gift.models);
      gift.fetch(params);
    },
    renderItem: function(model) {
      var self = this;
      var view = new GiftItemView({
        model: model,
        collection: self.collection,
        giftView: self,
        el: $('<li data-itemid="' + model.get('id') + '" data-baidu data-baidu-category="gift" data-baidu-action="buy_item" data-baidu-label="' + model.get('id') + '" data-baidu-value="' + model.get('bid') + '"/>')
      });
      view.on('afterrender', function() {
        if (self.carousel) {
          setTimeout(self.carousel.update.bind(self.carousel));
        }
      });
      self.$('.gift_show_list').append(view.render().$el);
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
    showUserhDetilsD: function() {
      var self = this;
      if (!d) {
        this._detailTimer = setTimeout(function() {
          if (d) {
            d.close();
          }
          self.loadTemplate('critprobability', function(template) {
            d = dialog({
              skin: 'dialogBluebgGames gamefresh_dialog',
              title: ' ',
              // follow: document.getElementById('helpDetis'),
              width: 270,
              height: 180,
              drag: true,
              onclose: function() {
                d.remove();
                d = null;
              }
            });
            var html = template({});
            d.content(html);
            d.show();
            d._popup.find('.btn_2b').on('click', d.close.bind(d));
          });
        }, 500);
      }
    }
  });
  return View;
});