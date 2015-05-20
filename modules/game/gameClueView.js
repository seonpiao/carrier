define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "game",
    template: 'gameClue',
    init: function() {
      var self = this;
      this.on('afterrender', function(e) {
        self.$scrollbar = $('.clue_scroll');
        self.$scrollbar.tinyscrollbar({
          trackSize: 115
        });
      });

    }
  });
  return View;
});