define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "numtip",
    init: function() {},
    show: function(options) {
      var elem = options.elem,
        num = options.num;
      var skin = options.skin || 'numtip';
      var align = options.align || 'top';
      if (this.d) {
        this.hide();
      }
      this.d = dialog({
        content: (num >= 0 ? '+' : '') + num,
        quickClose: true,
        align: align,
        autofocus: false,
        skin: skin
      });
      var self = this;
      this.d.show(elem);
      this._timer = setTimeout(function() {
        self.hide();
      }, 1000);
    },
    hide: function() {
      if (this.d) {
        this.d.close().remove();
        this.d = null;
      }
    }
  });
  return View;
});