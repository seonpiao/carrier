define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'promotion',
    action: 'GetVipPackage'
  });
  return new Model;
});