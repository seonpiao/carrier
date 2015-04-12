define(["libs/client/collections/base", "models/task", "models/userInfo"], function(Base, Model, userInfo) {
  var Collection = Base.extend({
    module: 'task',
    action: 'getUsrTaskList',
    model: Model,
    parse: function(resp) {
      var arr = [];
      var result = resp.result;
      for (var i = 0, l = result.length; i < l; i++) {
        if (result[i].name) {
          arr.push(result[i]);
        }
      }
      return arr;
    },
    init: function() {
      var self = this;
      this.listenTo(userInfo, 'change:username', function() {
        self.fetch();
      });
    }
  });
  return new Collection;
});