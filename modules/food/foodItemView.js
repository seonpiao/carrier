define(["libs/client/views/base", "modules/food/foodDetailView"], function(Base, FoodDetailView) {
  var View = Base.extend({
    moduleName: "food",
    template: 'foodItem',
    events: {
      'click': 'openRaise'
        // 'mouseenter': 'showDetail',
        // 'mouseleave': 'hideDetail'
    },
    init: function(options) {
      options = options || {};
      this.listenTo(this.model, 'change', this.render.bind(this));
      this.raise = options.raise;
      this.foodView = options.foodView;
    },
    openRaise: function() {
      if (this.model.get('isIngItem') !== true || (this.collection.now && this.collection.now.israise == false)) {
        return;
      }
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            self.loadTemplate('foodRaise', function(template) {
              self.raise.setModel(self.model);
              self.raise.setTemplate('raise', template);
              self.raise.show();
              self.raise.once('success', function(model) {
                self.collection.fetch();
                var $pointer = self.foodView.$('.arrow_rightpointer');
                if ($pointer.length > 0) {
                  self.module('numtip', 'food', function(numtip) {
                    if (numtip) {
                      numtip.show({
                        elem: $pointer[0],
                        num: model.get('result').bid * model.get('result').crit,
                        align: 'right'
                      });
                    }
                  });
                }
              });
            });
          });
        }
      });
    },
    showDetail: function() {
      var offset = this.$el.offset();
      if (!this.detailView) {
        this.detailView = new FoodDetailView({
          model: this.model
        });
        var self = this;
        this.$body.append(this.detailView.$el);
        this.detailView.once('afterrender', function() {
          self.detailView.show({
            top: offset.top - self.detailView.$el.height() + self.$el.height(),
            left: offset.left + self.$el.width() + 10
          });
        });
        this.detailView.render();
      } else {
        this.detailView.show({
          top: offset.top - this.detailView.$el.height() + this.$el.height(),
          left: offset.left + this.$el.width() + 10
        });
      }
    },
    hideDetail: function() {
      this.detailView.hide();
    }
  });
  return View;
});