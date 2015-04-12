define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "quicklink",
    events: {
      'click': 'trigger'
    },
    trigger: function(e) {
      var $target = $(e.target);
      var effect = $target.attr('data-effect');
      $(window).trigger('quicklink.' + effect);
    }
  });
  return View;
});