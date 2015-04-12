define(["libs/client/collections/base", "models/gameItem"], function(Base, Model) {
  var Collection = Base.extend({
    module: 'now',
    action: 'getNowGameList',
    model: Model
  });
  return new Collection;
});