define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'girlstatus',
    action: 'GetGirlStatusByIds'
  });
  return new Model;
});