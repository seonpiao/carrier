define(["libs/client/models/base", "models/gameList"], function(Base, gameList) {
  var Model = Base.extend({
    module: 'now',
    action: 'getNowGameList',
    parse: function(resp) {
      if (resp.result && resp.result.result) {
        gameList.set(resp.result.result);
      }
      return resp;
    },
    fetch: function(options) {
      options = options || {};
      options.data = {
        girlid: window.girlid
      };
      if (this.xhr) {
        this.xhr.abort();
      }
      this.xhr = Base.prototype.fetch.call(this, options);
    }
  });
  return new Model;
});