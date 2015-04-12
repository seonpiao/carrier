define(["models/angel"], function(model) {
  return {
    run: function(done) {
      model.once('sync', done);
      model.once('error', done);
      model.fetch({
        action: 'getGirlStatus'
      });
    },
    init: function(options) {
      return {
        interval: 10000
      }
    }
  };
});