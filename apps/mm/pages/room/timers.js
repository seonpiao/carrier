define(["libs/client/timerManager", "timers/girl", "timers/girltask", "timers/newemailflicker"], function(TimerManager, girl, girltask, newemailflicker) {
  var timers = {
    girl: girl,
    girltask: girltask,
    newemailflicker: newemailflicker
  };
  TimerManager.start(timers);
});