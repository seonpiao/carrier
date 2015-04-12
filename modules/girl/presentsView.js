define(["libs/client/views/base", "models/giftBoardForGirl"], function(Base, giftBoard) {
  var View = Base.extend({
    moduleName: "girl",
    events: {
      'click .toggle_btn': 'toggleExpand'
    },
    init: function() {
      giftBoard.fetch({
        girlid: girlid
      });
      this.collection = giftBoard;
      this.listenTo(giftBoard, 'add', this.render.bind(this));
      this.$scrollbar = $('#preListBar');
      this.$scrollbar.tinyscrollbar();
    },
    render: function(model, collection) {
      var data = giftBoard.toJSON();
      this.loadTemplate('presents', function(template) {
        self.$('.overview').html(template(data));
        globalUtil.resetScrollbar('preListBar', 128, '');
      });
    },
    toggleExpand: function(e) {
      e.preventDefault();
      var $target = $(e.target);
      var taskid = $target.parent().attr('data-taskid');
      var model = this.collection.get(taskid);
      model.set('expand', !model.get('expand'));
    }
  });
  return View;
});