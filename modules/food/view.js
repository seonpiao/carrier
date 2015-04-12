define(["libs/client/views/base", "models/food", "models/girl", "modules/food/foodItemView"], function(Base, food, girl, FoodItemView) {
  var View = Base.extend({
    moduleName: "food",
    template: 'index',
    progressTemplate: 'progress',
    events: {
      'click .give_foodbox .btn_4y': 'raiseFood'
    },
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
            now: food.now,
            girl: girl.toJSON()
          }));
          self.updateProgress();
          self.renderItems();
        });
      });
    },
    renderItems: function() {
      var self = this;
      this.collection.forEach(function(model) {
        self.renderItem(model);
      });
    },
    renderItem: function(model) {
      var self = this;
      this.module('raise', 'food', function(module) {
        if (module) {
          var view = new FoodItemView({
            model: model,
            collection: self.collection,
            raise: module,
            foodView: self,
            el: $('<li data-itemid="' + model.get('id') + '" class="' + (model.get('classval') == '1' ? 'firstimg_small' : 'firstimg_big') + '" data-baidu data-baidu-category="food" data-baidu-action="click_item" data-baidu-label="' + model.get('id') + '"/>')
          });
          self.$('.food_list').append(view.render().$el);
        }
      });
    },
    getProgress: function(item) {
      if (item.classval == '1') {
        return 1;
      } else {
        if (item.curfunds && item.targetfunds) {
          var curfunds = item.curfunds.replace(/,/g, '') * 1;
          var targetfunds = item.targetfunds.replace(/,/g, '') * 1;
          return Math.min(parseFloat(curfunds / targetfunds), 1);
        } else {
          return 0;
        }
      }
    },
    updateProgress: function($el, list) {
      var self = this;
      this.loadTemplate(this.progressTemplate, function(template) {
        var progresses = [];
        var itemList = (list || self.collection).toJSON();
        itemList.forEach(function(item, index) {
          progresses.push(self.getProgress(item));
        });
        self.$('.progress_bar_panel').html(template({
          progresses: progresses
        }));
      });
    },
    raiseFood: function(e) {
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            var query = {
              isIngItem: true
            };
            var nowItem = food.findWhere(query);
            if (!nowItem) {
              delete query.status;
              nowItem = food.findWhere(query);
            }
            if (nowItem) {
              var itemid = nowItem.get('id');
              var $item = self.$('li[data-itemid="' + itemid + '"]');
              var view = $item.data('view');
              view.openRaise();
            } else {
              self.module('errmsg', function(module) {
                if (module) {
                  module.show('集资还没有开始呢');
                }
              });
            }
          });
        }
      });
    }
  });
  return View;
});