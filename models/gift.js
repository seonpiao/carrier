define(["libs/client/collections/base", "models/giftItem"], function(Base, Model) {
  var Collections = Base.extend({
    module: 'now',
    model: Model,
    action: 'getNowGirlItemList',
    parse: function(resp) {
      var items = [];
      if (resp.success == 200) {
        this.now = resp.now;
        _.forEach(resp.result, function(item) {
          items = items.concat(item.items);
        });
        return items;
      }
      return items;
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