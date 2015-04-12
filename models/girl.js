define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'girlstatus',
    action: 'getGirlStatus',
    parse: function(resp) {
      return resp.result;
    },
    fetch: function(options) {
      options = options || {};
      options.data = options.data || {};
      if (!('girlid' in options.data)) {
        options.data.girlid = window.girlid;
      }
      Base.prototype.fetch.call(this, options);
    }
  });
  return new Model;
});