define(["libs/client/collections/base", "models/girlItem"], function(Base, Model) {
  var Collection = Base.extend({
    module: 'now',
    action: 'getNowGirlItemList',
    model: Model,
    fetch: function() {
      if (this.xhr) {
        this.xhr.abort();
      }
      this.xhr = Base.prototype.fetch.apply(this, arguments);
    },
    parse: function(resp) {
      var items = [];
      if (resp.success === 200) {
        items = resp.result[0].items ? resp.result[0].items : resp.result;
        items.forEach(function(item, index) {
          if (resp.now) {
            item.card = resp.now.card;
            item.subtype = resp.now.subtype;
          }
          item.index = index;
        });
        this.now = resp.now;
      }
      return items;
    }
  });
  return new Collection;
});