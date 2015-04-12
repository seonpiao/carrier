define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "task",
    template: 'detail',
    events: {
      'click .btn-confirm': 'closeDialog'
    },
    init: function() {
      this.d = dialog({
        skin: 'dialogGames',
        title: ' '
      });
      this.d.addEventListener('close', this.remove.bind(this));
      //让view来管理dialog的元素
      this.setElement(this.d.__popup);
      this.listenTo(this.model, 'change', this.render.bind(this));
    },
    render: function(name) {
      var self = this;
      this.loadTemplate(function(template) {
        var html = template(self.model.toJSON());
        self.d.content(html);
      });
      return this;
    },
    show: function() {
      this.d.show();
      $('.dialogGames .ui-dialog-close').text('');
      return this;
    },
    closeDialog: function() {
      this.d.close().remove();
    }
  });
  return View;
});