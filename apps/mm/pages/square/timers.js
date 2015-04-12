define(["libs/client/timerManager", "timers/PopularTop", "timers/girlschedule", "timers/newemailflicker"], function(TimerManager, popularTop, girlschedule, newemailflicker) {
  var timers = {
    popularTop: popularTop,
    girlschedule: girlschedule,
    newemailflicker: newemailflicker
  };
  TimerManager.start(timers);
});