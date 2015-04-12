define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'rank',
    action: 'PopularTop'
  });
  return new Model;
});