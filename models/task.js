define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    idAttribute: 'taskid',
    module: 'task',
    parse: function(resp) {
      var self = this;
      if (resp.finalreward) {
        resp.finalreward = JSON.parse(resp.finalreward.replace(/\\/g, ''));
        _.each(resp.finalreward, function(value, key) {
          if (isNaN(value) && !_.isObject(value)) {
            resp.finalreward[key] = 0;
          }
        });
      }
      return resp;
    },
    getReward: function(callback) {
      this.fetch({
        action: 'getTaskReward',
        data: {
          taskid: this.id
        },
        success: function(model, resp) {
          if (resp.success === 200) {
            callback();
          } else {
            callback(resp)
          }
        }
      });
    }
  });
  return Model;
});