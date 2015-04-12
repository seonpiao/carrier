define(["libs/client/collections/base", "models/girlItem"], function(Base, Model) {
  var Collections = Base.extend({
    module: 'now',
    model: Model,
    action: 'getNowGirlItemList',
    parse: function(resp) {
      if (resp.success == 200) {
        this.now = resp.now;
        var items = resp.result;
        items.forEach(function(item, index) {
          if (resp.now) {
            item.card = resp.now.card;
            item.subtype = resp.now.subtype;
          }
          item.index = index;
        });
        return items;
      }
      return [];
    },
    fetch: function(options) {
      options = options || {};
      options.data = {
        girlid: window.girlid,
        type: '1'
      };
      if (this.xhr) {
        this.xhr.abort();
      }
      this.xhr = Base.prototype.fetch.call(this, options);
    }
  });
  return new Collections;
});