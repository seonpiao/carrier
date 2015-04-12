define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'code',
    action: 'giveMeGift'
  });
  return new Model;
});