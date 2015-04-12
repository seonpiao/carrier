define(["libs/client/collections/base", "models/girlItem"], function(Base, Model) {
  var Collections = Base.extend({
    module: 'now',
    model: Model,
    action: 'getNowGirlItemList',
    parse: function(resp) {
      if (resp.success == 200) {
        this.now = resp.now;
        return resp.result[0].items;
      }
      return [];
    },
    fetch: function(options) {
      options = options || {};
      _.extend(options.data, {
        girlid: window.girlid,
        type: '3'
      });
      if (this.xhr) {
        this.xhr.abort();
      }
      this.xhr = Base.prototype.fetch.call(this, options);
    }
  });
  return new Collections;
});