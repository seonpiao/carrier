define(["libs/client/collections/base", "models/girlItem"], function(Base, Model) {
  var Collections = Base.extend({
    module: 'now',
    model: Model,
    action: 'getNowGirlItemList',
    parse: function(resp) {
      if (resp.success == 200) {
        this.now = resp.now;
        var items = resp.result[0].items;
        items.forEach(function(item, index) {
          if (resp.now) {
            item.card = resp.now.card;
            item.subtype = resp.now.subtype;
          }
        });
        return resp.result[0].items;
      }
      return [];
    },
    fetch: function(options) {
      options = options || {};
      options.data = options.data || this.filter;
      _.extend(options.data, {
        girlid: window.girlid,
        type: '8'
      });
      if (this.xhr) {
        this.xhr.abort();
      }
      this.xhr = Base.prototype.fetch.call(this, options);
    }
  });
  return new Collections;
});