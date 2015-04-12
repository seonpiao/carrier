define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'timeline',
    action: 'GetGirlTask'
  });
  return new Model;
});