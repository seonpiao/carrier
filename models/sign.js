define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'user',
    action: 'Login',
    baseUrl: 'http://account.' + window.domain + '/',
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