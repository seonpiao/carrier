define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "raise",
    show: function() {
      var $success = $('.buy_success_word');
      if (!$success.length) {
        $success = $('<div class="success_box buy_success_word hide"><div class="buy_lingtsshow"><span></span></div></div>');
        this.$body.append($success);
      }
      $success.removeClass('hide');
      var timer = $success.data('hide_timer');
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        $success.addClass('hide');
      }, 3000);
      $success.data('hide_timer', timer);
    }
  });
  return View;
});