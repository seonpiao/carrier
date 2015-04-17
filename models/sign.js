define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'user',
    action: 'Login',
    baseUrl: window.proxyAccountUrl + '/',
    signIn: function() {
      this.fetch({
        action: 'Login'
      });
    },
    signOut: function() {
      this.fetch({
        action: 'Logout'
      });
    }
  });
  return new Model;
});