define(["libs/client/views/base", "models/clothes", "modules/clothes/clothesItemView", "models/girl"], function(Base, clothes, ClothesItemView, girl) {
  var View = Base.extend({
    moduleName: "clothes",
    init: function() {
      this.listenTo(clothes, 'sync', this.render.bind(this));
      clothes.fetch();
      this.collection = clothes;
      this._timer = setInterval(clothes.fetch.bind(clothes), 60000);
    },
    destroy: function() {
      clearInterval(this._timer);
    },
    render: function() {
      var self = this;
      this.loadTemplate('index', function(template) {
        var data = clothes.toJSON();
        self.$el.html(template({
          result: data,
          now: clothes.now
        }));
        self.renderItems();
      });
    },
    renderItems: function() {
      var self = this;
      this.collection.forEach(function(model) {
        self.renderItem(model);
        self.initCarousel();
        self.showGirlName();
      });
    },
    showGirlName: function() {
      girl.cache(function() {
        self.$('.game_listbox_clothes .name_color').html(girl.get('name'))
      });
    },
    renderItem: function(model) {
      var self = this;
      this.module('raise', 'clothes', function(module) {
        if (module) {
          var view = new ClothesItemView({
            model: model,
            collection: self.collection,
            raise: module,
            clothesView: self,
            el: $('<li data-itemid="' + model.get('id') + '" data-baidu data-baidu-category="clothes" data-baidu-action="click_item" data-baidu-label="' + model.get('id') + '"/>')
          });
          self.$('.clothes_list').append(view.render().$el);
        }
      });
    },
    initCarousel: function() {
      var carousel = this.$('.shop_item_list').tinycarousel({
        step: 5,
        infinite: false
      });
      this.carousel = carousel.data('plugin_tinycarousel');
      this.carousel.update();
      this.carousel.move(0);
    }
  });
  return View;
});