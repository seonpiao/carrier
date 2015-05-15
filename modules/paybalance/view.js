define(["libs/client/views/base", "models/userInfo", "models/girlList", "models/girlIncome"], function(Base, userInfo, girlList, girlIncome) {
  var View = Base.extend({
    moduleName: "paybalance",
    init: function() {
      var self = this;
      this.listenTo(userInfo, 'change:username', function() {
        girlList.cache(null, function() {
          var girls = girlList.toJSON();
          var username = userInfo.toJSON().username;
          var girlFlag;
          for (var i = 0, l = girls.length; i < l; i++) {
            if (username == girls[i].name) {
              girlFlag = true;
            }
          }
          if (girlFlag) {
            self.listenTo(girlIncome, 'change', self.render.bind(self));
            girlIncome.fetch();
          }
        });
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
