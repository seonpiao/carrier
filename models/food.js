define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'now',
    action: 'getNowFoodList',
    parse: function(resp) {
      if (resp.success == 200) {
        return resp.result;
      }
      return {};
    }
  });
  return new Model;
});