define(["libs/client/views/base"], function(Base) {
  var d;
  var View = Base.extend({
    moduleName: "raise",
    template: 'crit',
    events: {
      'click .btn_2b': 'hide'
    },
    init: function() {

    },
    show: function() {
      var self = this;
      this.loadTemplate('crit', function(template) {
        if (d) {
          d.close().remove();
        }
        d = dialog({
          skin: 'dialogBluebgGames gamefresh_dialog',
          title: ' ',
          width: 270,
          height: 180
        });
        self.setElement(d._popup);
        var html = template(self.model.toJSON());
        d.content(html);
        d.show();
      })
    },
    hide: function() {
      if (d) {
        d.close().remove();
        d = null;
      }
    }
  });
  return View;
});