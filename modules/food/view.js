define(["libs/client/views/base", "models/food", "models/girl", "modules/food/foodItemView"], function(Base, food, girl, FoodItemView) {
  var View = Base.extend({
    moduleName: "food",
    template: 'index',
    init: function() {
      this.listenTo(food, 'sync', this.render.bind(this));
      food.fetch();
      this.collection = food;
      this._timer = setInterval(food.fetch.bind(food), 60000);
    },
    destroy: function() {
      clearInterval(this._timer);
    },
    render: function() {
      var self = this;
      this.loadTemplate('index', function(template) {
        var data = food.toJSON();
        girl.cache(function() {
          self.$el.html(template({
            result: data,
            girl: girl.toJSON()
          }));
        });
      });
    }
  });
  return View;
});