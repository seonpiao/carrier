define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'item',
    action: 'GetUserNews',
    fetch: function(options) {
      options = options || {};
      options.data = options.data || {};
      _.extend(options.data, {
        girlid: window.girlid
      });
      if (this.xhr) {
        this.xhr.abort();
      }
      this.xhr = Base.prototype.fetch.call(this, options);
    }
  });
  return new Model;
});