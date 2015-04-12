define(["libs/client/collections/base", "models/girlItem"], function(Base, Model) {
  var Collections = Base.extend({
    module: 'now',
    model: Model,
    action: 'getNowGirlItemList',
    parse: function(resp) {
      if (resp.success == 200) {
        this.now = resp.now;
        return resp.result;
      }
      return [];
    },
    fetch: function(options) {
      options = options || {};
      options.data = {
        girlid: window.girlid,
        type: '2'
      };
      if (this.xhr) {
        this.xhr.abort();
      }
      this.xhr = Base.prototype.fetch.call(this, options);
    }
  });
  return new Collections;
});