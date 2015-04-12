define(["libs/client/views/base", "modules/task/taskDetailView", "modules/task/taskRewardView"], function(Base, TaskDetailView, TaskRewardView) {
  var View = Base.extend({
    moduleName: "task",
    template: 'index',
    events: {
      'click .task-name': 'openDetail',
      'click .task-reward': 'openReward',
      'click .toggle_btn': 'toggleExpand'
    },
    init: function(options) {
      options = options || {};
      this.listenTo(this.model, 'change:status', this.render.bind(this));
      this.scrollbar = options.scrollbar;
      this.on('remove', this.scrollbar.update.bind(this.scrollbar));
      this.on('afterrender', this.scrollbar.update.bind(this.scrollbar));
    },
    openDetail: function() {
      (new TaskDetailView({
        model: this.model
      })).render().show();
    },
    openReward: function() {
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            (new TaskRewardView({
              model: self.model,
              item: self
            })).render().show();
          });
        }
      });
    },
    toggleExpand: function(e) {
      e.preventDefault();
      var $target = $(e.target);
      var taskid = $target.parent().attr('data-taskid');
      this.model.set('expand', !this.model.get('expand'));
    },
    expandChanged: function(key, value) {
      var $btn = this.$('.toggle_btn');
      if ($btn.hasClass('minus_btn')) {
        $btn.removeClass('minus_btn');
      } else {
        $btn.addClass('minus_btn');
      }
      if (value) {
        this.$('.open_box').show();
      } else {
        this.$('.open_box').hide();
      }
      var scrollbar = this.scrollbar;
      scrollbar.update('relative');
    }
  });
  return View;
});