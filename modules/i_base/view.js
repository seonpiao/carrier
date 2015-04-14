define(["libs/client/views/base", "models/userInfo"], function(Base, userInfo) {
  var View = Base.extend({
    moduleName: "i_base",
    init: function() {
      this.listenTo(userInfo, 'change:isLogin', function() {
        console.log(userInfo.toJSON());
        var isLogin = userInfo.toJSON().isLogin;
        if (!isLogin) {
          location.href = '//account.wanleyun.com/login';
        }
      });
    }
  });
  return View;
});
