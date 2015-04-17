define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "i_ucnav",
    init: function() {
      var page = __global.page;
      curId = 'nav-' + page;
      $('#' + curId).addClass('on');
    }
  });
  return View;
});
