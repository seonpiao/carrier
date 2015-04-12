define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'online',
    action: 'getUserlist'
  });
  return new Model;
});