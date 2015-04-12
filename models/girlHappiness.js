define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'timeline',
    action: 'GetGirlHappiness',
    fetch: function(options) {
      options = options || {};
      options.data = {
        girlid: window.girlid
      };
      Base.prototype.fetch.call(this, options);
    }
  });
  return new Model;
});