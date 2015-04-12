define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'girlstatus',
    action: 'GetGreeButton'
  });
  return new Model;
});