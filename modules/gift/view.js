define(["libs/client/views/base", "models/gift", "modules/gift/giftItemView"], function(Base, gift, GiftItemView) {
  var View = Base.extend({
    moduleName: "gift",
    events: {
      'click [data-gift-tab]': 'switchGiftTab',
    },
    init: function() {
      this.render();
      this.collection = gift;
      this.listenTo(gift, 'sync', this.initCarousel.bind(this));
      this.listenTo(gift, 'add', this.renderItem.bind(this));
    },
    render: function() {
      var self = this;
      this.loadTemplate('index', function(template) {
        var data = gift.toJSON();
        self.$el.html(template({
          result: data,
          now: gift.now
        }));
        self.renderItems();
      });
    },
    initCarousel: function() {
      var carousel = this.$('.gift_con_right').tinycarousel({
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
    }
  });
  return View;
});