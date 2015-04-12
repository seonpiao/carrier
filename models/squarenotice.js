define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'now',
    action: 'whatShallIKnow'

  });
  return new Model;
});