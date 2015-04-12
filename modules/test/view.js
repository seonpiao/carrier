define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "test",
    template: 'index',
    events: {
      'click span a': 'onaclick'
    },
    init: function() {
      this.render();
    },
    onaclick: function() {
      var self = this;
      this.loadTemplate('content', function(template) {
        // var data = self.model.toJSON();
        var html = template({
          a: '11'
        });
        self.$el.html(html);
      });
    }
  });
  return View;
});