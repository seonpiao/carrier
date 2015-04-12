define(["libs/client/models/data", "models/userFund"], function(Base, userFund) {
  var Model = Base.extend({
    module: 'ucenter',
    action: 'GetUserBaseInfo',
    baseUrl: 'http://account.' + window.domain + '/',
    init: function() {
      var self = this;
      this.listenTo(userFund, 'change', function() {
        var changed = userFund.changedAttributes();
        if (changed) {
          _.each(changed, function(val, key) {
            self.set(key, val);
          });
        }
      });
    },
    fetch: function() {
      var self = this;
      var args = arguments;
      this.once('sync', function() {
        userFund.fetch();
      });
      Base.prototype.fetch.apply(self, args);
    },
    parse: function(resp) {
      resp = Base.prototype.parse.apply(this, arguments);
      if (resp.error_code) {
        resp = {
          isLogin: false
        }
      } else {
        resp.isLogin = true;
      }
      return resp;
    }
  });
  return new Model;
});