define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'activity',
    action: 'VipBuy'
  });
  return new Model;
});