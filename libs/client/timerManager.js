define(function() {

  var runningTimers = {};

  return {
    start: function(timers) {
      _.each(timers, function(timer, name) {
        var self = this;
        var config = timer.init();
        if (!config.interval) {
          config.interval = 1000;
        }
        config._count = 0;
        clearTimeout(runningTimers[name]);
        runningTimers[name] = setTimeout(function runTimer() {
          config._count++;
          timer.run(function() {
            if (!config.max || config._count < config.max) {
              clearTimeout(runningTimers[name]);
              runningTimers[name] = setTimeout(runTimer, config.interval);
            }
          });
        }, 0);
      })
    },
    stop: function() {

    }
  }
});