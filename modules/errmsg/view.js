define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "errmsg",
    init: function() {
      this.d = dialog({
        skin: 'pop-msg-blue '
      });
      $('.pop-msg-blue').find('div[class*=ui-dialog-arrow]').hide();
    },
    show: function(msg) {
      var self = this;
      this.d.show();
      this.d.content(msg);
      clearTimeout(this._timer);
      this._timer = setTimeout(function() {
        self.d.close();
      }, 3000);
    }
  });
  return View;
});