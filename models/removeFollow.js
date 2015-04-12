define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'girlstatus',
    action: 'removeFollow'
  });
  return new Model;
});