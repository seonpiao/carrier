define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'persia',
    action: 'getUsrPersiaList'
  });
  return new Model;
});