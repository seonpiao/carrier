define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "diamond",
    init: function() {
      var self = this;
      this.loadTemplate('index', function(template) {
        self.model.cache(function() {
          var html = template(self.model.toJSON());
          self.$el.html(html);
        });
      });
    },
    diamondChanged: function() {
      var data = this.model.toJSON();
      this.$('.balance').html((data.diamond || 0) * 1 + (data.bind_diamond || 0) * 1)
    },
    bind_diamondChanged: function() {
      var data = this.model.toJSON();
      this.$('.balance').html((data.diamond || 0) * 1 + (data.bind_diamond || 0) * 1)
    }
  });
  return View;
});