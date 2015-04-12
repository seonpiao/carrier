define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "baidu",
    init: function() {
      $(document).delegate('[data-baidu]', 'click', function(e) {
        var $target = $(this);
        var category = ($target.attr('data-baidu-category')) || '';
        var action = ($target.attr('data-baidu-action')) || '';
        var label = ($target.attr('data-baidu-label')) || '';
        var val = ($target.attr('data-baidu-value')) || '';
        _hmt.push(['_trackEvent', category, action, label, val]);
      });
    }
  });
  return View;
});