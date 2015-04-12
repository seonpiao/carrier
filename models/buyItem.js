define(["libs/client/models/base", "models/userFund"], function(Base, userFund) {
  var Model = Base.extend({
    module: 'item',
    action: 'buyItem',
    init: function() {
      this.on('sync', function() {
        userFund.fetch();
      });
    }
  });
  return Model;
});