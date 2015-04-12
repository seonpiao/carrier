define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'mail',
    action: 'GetMailList'
  });
  return new Model;
});