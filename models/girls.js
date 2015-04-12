define(["libs/client/models/data"], function(Base) {
  var Model = Base.extend({
    module: 'girlstatus',
    action: 'getgirlstatusbyids'
  });
  return new Model;
});