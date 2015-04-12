define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "food",
    template: 'foodDetail',
    events: {
      'mouseleave': 'hide'
    },
    init: function(options) {
      options = options || {};
      this.listenTo(this.model, 'change', this.render.bind(this));
      this.$el.css({
        position: 'absolute',
        zIndex: '5'
      })
      this.hide();
    },
    show: function(pos) {
      this.$el.show();
      this.$el.css(pos);
    },
    hide: function() {
      this.$el.hide();
    }
  });
  return View;
});