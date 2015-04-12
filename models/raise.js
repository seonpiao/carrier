define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    idAttribute: 'itemid',
    module: 'item',
    action: 'raiseItem'
  });
  return Model;
});