define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "clothes",
    template: 'clothesDetail',
    events: {
      'mouseleave': 'hide'
    },
    init: function(options) {
      options = options || {};
      this.listenTo(this.model, 'change', this.render.bind(this));
      this.$el.css({
        position: 'absolute'
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