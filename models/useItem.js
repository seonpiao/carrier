define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'item',
    action: 'useItem'
  });
  return Model;
});