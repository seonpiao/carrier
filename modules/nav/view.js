define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "nav",
    template: 'index',
    init: function() {
      this.listenTo(this.model, 'change', this.render.bind(this));
      this.model.cache(this.render.bind(this));
    }
  });
  return View;
});