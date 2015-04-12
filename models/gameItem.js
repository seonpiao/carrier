define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'now',
    action: 'getNowGameList',
    idAttribute: 'atomid'
  });
  return Model;
});