define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'wish',
    action: 'getWishBottle'
  });
  return new Model;
});