define(["libs/client/views/base", "models/userInfo"], function(Base, userInfo) {
  var View = Base.extend({
    moduleName: "i_base",
    init: function() {
      this.listenTo(userInfo, 'change:username', function() {
        var username = userInfo.toJSON().username;
        if (!username) {
          location.href = __global.base.i + '/login';
        }
      });
    }
  });
  return View;
});
