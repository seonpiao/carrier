define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "game",
    template: 'gameRating',
    events: {
      'click .userphoto_bg': 'showDetail'
    },
    init: function() {
      var self = this;
      this.on('afterrender', function() {
        self.$scrollbar = self.$('.program_list');
        self.$scrollbar.tinyscrollbar();
      });
    },
    showDetail: function(e) {
      var $target = $(e.currentTarget);
      $target.parent().find('.user_detail').addClass('hide');
      $target.next().removeClass('hide');
    }
  });
  return View;
});