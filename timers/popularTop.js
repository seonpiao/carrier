define(["models/PopularTop"], function(model) {
  return {
    run: function(done) {
      model.once('sync', done);
      model.once('error', done);
      model.fetch({
        data: {
          top: 10
        }
      });
    },
    init: function(options) {
      return {
        interval: 60000
      }
    }
  };
});