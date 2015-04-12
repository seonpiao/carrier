define(["libs/client/views/base", "models/taskList", "modules/task/taskItemView", "models/userInfo"], function(Base, taskList, TaskItemView, userInfo) {
  var View = Base.extend({
    moduleName: "task",
    init: function() {
      this.collection = taskList;
      this.listenTo(taskList, 'add', this.render.bind(this));
      this.listenTo(taskList, 'remove', this.remove.bind(this));
      this.$scrollbar = $('.task_scroll');
      this.$scrollbar.tinyscrollbar();
      this.items = {};
      taskList.fetch();
    },
    render: function(model, collection) {
      var taskid = model.get('taskid');
      this.items[taskid] = new TaskItemView({
        model: model,
        collection: this.collection,
        scrollbar: this.$scrollbar.data("plugin_tinyscrollbar")
      });
      this.append(this.items[taskid]);
      this.$scrollbar.find('.scrollbar').removeClass('hide');
    },
    remove: function(model) {
      var taskid = model.get('taskid');
      this.items[taskid].remove();
    }
  });
  return View;
});