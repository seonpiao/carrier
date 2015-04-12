define(["libs/client/models/data"], function(Base) {
  var Model = Base.extend({
    module: 'now',
    action: 'getOldFeedTalk',
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