define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'girlstatus',
    action: 'doFollow'
  });
  return new Model;
});