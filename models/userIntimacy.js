define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'ucenter',
    action: 'GetUserIntimacy',
    baseUrl: 'http://account.' + window.domain + '/',
    parse: function(resp) {
      if (resp.code === 1) {
        return resp.data;
      }
      return resp;
    }
  });
  return new Model;
});