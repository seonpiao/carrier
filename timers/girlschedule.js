define(["models/girlschedule"], function(model) {
  return {
    run: function(done) {
      model.once('sync', done);

      model.once('error', done);
      model.fetch({
        action: 'GetAllTask'
      });
    },
    init: function(options) {
      return {
        interval: 60000
      }
    }
  };
});