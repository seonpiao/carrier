define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "itemdetail",
    template: 'index',
    events: {
      'mouseleave': 'hide'
    },
    init: function(options) {
      options = options || {};
      this.$el.css({
        position: 'absolute'
      })
      this.hide();
      this.$el.appendTo(this.$body);
    },
    setModel: function() {
      Base.prototype.setModel.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render.bind(this));
    },
    show: function(pos) {
      var self = this;
      this.once('afterrender', function() {
        self.$el.show();
        self.$el.css(pos);
      })
      this.render();
    },
    hide: function() {
      this.$el.hide();
    }
  });
  return View;
});