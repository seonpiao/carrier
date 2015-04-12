define(["models/nowGame"], function(model) {
  return {
    run: function(done) {
      model.once('sync', done);

      model.once('error', done);
      model.fetch();
    },
    init: function(options) {
      return {
        interval: 60000
      }
    }
  };
});