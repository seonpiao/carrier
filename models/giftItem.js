define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    idAttribute: 'id',
    module: 'item',
    action: 'getGirlItemDetail',
    parse: function(resp) {
      if (resp.success === 200) {
        return resp.result;
      }
      return resp;
    },
    fetch: function(options) {
      options = options || {};
      options.data = options.data || {};
      if (!('girlid' in options.data)) {
        options.data.girlid = window.girlid;
      }
      options.data.id = this.id;
      Base.prototype.fetch.call(this, options);
    }
  });
  return Model;
});