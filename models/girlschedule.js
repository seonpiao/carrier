define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'timeline',
    action: 'GetAllTask'
  });
  return new Model;
});