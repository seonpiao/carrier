define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "activity",
    events: {
      'click #ConstellAtion': 'ConstellAItem'
    },
    init: function() {
      this.d = dialog({
        skin: 'dialogGames',
        title: ' '
      });
      this.d.addEventListener('close', this.remove.bind(this));
      //让view来管理dialog的元素
      this.setElement(this.d.__popup);
      // this.listenTo(this.model, 'change', this.render.bind(this));
    },
    render: function(name) {
      var self = this;
      this.loadTemplate(function(template) {
        var html = template(self.model.toJSON());
        self.d.content(html);
      });
      return this;
    },
    ConstellAItem: function() {
      (new ConstellAtionView({
        model: this.model
      })).render().show();
    },
    initDialog: function() { //星座弹层
      var ladyGames = dialog({
        title: ' ',
        content: $('#Constellate_dialogInner').html(),
        quickClose: false, //点击空白处快速关闭
        skin: 'dialognonebgGame constell-dialog'
      });
      ladyGames.show();
      $('.dialognonebgGame .ui-dialog-title').html('');
      $('.dialognonebgGame .ui-dialog-close').text('');
      constellUtil.getDegree();
      constellUtil.getDegreeDeital();
      constellUtil.getGirlAstro();
    }
  });
  return View;
});