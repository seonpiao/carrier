define(["libs/client/views/base", "models/userFund"], function(Base, userFund) {
  var View = Base.extend({
    moduleName: "task",
    template: 'reward',
    events: {
      'click .btn-confirm': 'confirm'
    },
    init: function(options) {
      this.d = dialog({
        skin: 'dialogGames',
        title: ' '
      });
      this.item = options.item;
      this.d.addEventListener('close', this.remove.bind(this));
      //让view来管理dialog的元
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
    confirm: function() {
      var self = this;
      this.model.getReward(function(err) {
        self.item.remove();
        self.d.close().remove();
        self.item.collection.fetch();
        userFund.fetch();
        globalUtil.pkgNew();
        globalUtil.lightpkgNew();
      });
    }
  });
  return View;
});