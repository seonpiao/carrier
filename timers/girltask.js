define(["models/girlTask"], function(model) {
  return {
    run: function(done) {
      model.once('sync', done);

      model.once('error', done);
      model.fetch({
        data: {
          girlid: girlid
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