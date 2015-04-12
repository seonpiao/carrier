define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "i_ucnav",
    init: function() {
      var pathname = location.pathname;
      curId = pathname.replace('/', 'nav-');
      $('#' + curId).addClass('on');
    }
  });
  return View;
});