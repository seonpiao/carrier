define(["libs/client/models/data"], function(Base) {
  var Model = Base.extend({
    module: 'ucenter',
    action: 'GetUserFund',
    baseUrl: 'http://account.' + window.domain + '/',
    parse: function(resp) {
      resp = Base.prototype.parse.apply(this, arguments);
      if (resp.error_code) {
        resp = {
          coin: 0,
          diamond: 0,
          bind_diamond: 0
        };
      }
      return resp;
    }
  });
  return new Model;
});