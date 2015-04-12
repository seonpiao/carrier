define(["libs/client/views/base", "modules/clothes/clothesDetailView"], function(Base, ClothesDetailView) {
  var View = Base.extend({
    moduleName: "clothes",
    template: 'clothesItem',
    events: {
      'click': 'openRaise',
      'mouseenter': 'showDetail',
      'mouseleave': 'hideDetail'
    },
    init: function(options) {
      options = options || {};
      this.raise = options.raise;
      this.clothesView = options.clothesView;
      // this.listenTo(this.model, 'change', this.refresh.bind(this));
    },
    openRaise: function() {
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            self.loadTemplate('clothesRaise', function(template) {
              self.raise.setModel(self.model);
              self.raise.setTemplate('raise', template);
              self.raise.show();
              self.raise.once('success', function(model) {
                self.collection.fetch({
                  reset: true
                });
              });
            });
          });
        }
      });
    },
    showDetail: function() {
      if (!this.detailView) {
        this.detailView = new ClothesDetailView({
          model: this.model
        });
        this.$body.append(this.detailView.render().$el);
      }
      var offset = this.$el.offset();
      this.detailView.show({
        top: offset.top,
        left: offset.left + this.$el.width() + 10
      });
    },
    hideDetail: function() {
      this.detailView.hide();
    }
  });
  return View;
});