define(["libs/client/views/base", "models/userInfo", "models/girlIncome"], function(Base, userInfo, girlIncome) {
  var View = Base.extend({
    moduleName: "paybalance",
    init: function() {
      var self = this;
      this.listenTo(userInfo, 'change:username', function() {
        if (window.talkname == userInfo.toJSON().username || userInfo.toJSON().username == window.girlname + '的小管家') {
          self.listenTo(girlIncome, 'change', self.render.bind(self));
          girlIncome.fetch();
        }
      });
    },
    render: function() {
      var self = this;
      this.loadTemplate('index', function(template) {
        var data = girlIncome.toJSON();
        var item = template(data);
        self.$body.find('.paybalance').append(item);
      });
    }
  });
  return View;
});