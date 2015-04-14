define(["models/newemailflicker"], function(model) {
  return {
    run: function(done) {
      model.once('sync', done);
      model.once('error', done);
      model.fetch({
        action: 'getMailTotal'
      });
    },
    init: function(options) {
      return {
        interval: 60000
      }
    }
  };
});