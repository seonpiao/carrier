define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'ucenter',
    action: 'GetUserGirl',
    baseUrl: 'http://account.' + window.domain + '/',
    fetch: function(options) {
      options = options || {};
      Base.prototype.fetch.apply(this, arguments);
    },
    parse: function(resp) {
      if (resp.code === 1) {
        return resp.data;
      }
      return {};
    }
  });
  return new Model;
});