define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'timeline',
    action: 'GetActiveInfo'
  });
  return new Model;
});