define(["libs/client/collections/base"], function(Base) {
  var Model = Base.extend({
    module: 'girlstatus',
    action: 'GetgirlNameList',
    parse: function(resp) {
      return resp.result;
    }
  });
  return new Model;
});