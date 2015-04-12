define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "girl",
    template: 'unFollow',
    events: {
      'click .btn_1y': 'closeDialog',
      'click .btn_2b': 'unFollow'
    },
    init: function() {
      this.d = dialog({
        id: 'unFollowdialog',
        title: ' ',
        content: '  ',
        quickClose: false, //点击空白处快速关闭
        skin: 'dialogGames'

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
    },
    unFollow: function(e) {
      var self = this,
        tdiv = $('.myLady .followers'),
        girl = globalUtil.userInfo.angelgirl,
        pdiv = $('#followBtn');
      var disabled = pdiv.hasClass('disabled');
      var numberCurr = parseInt(globalUtil.delcommafy($('#countFollow').text()));
      $.ajax({
        url: apiUrl + 'girlstatus/removeFollow',
        data: {
          girlid: girlid
        },
        cache: false,
        dataType: 'jsonp',
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200 && data.result.status) {
            self.showFollowMsg('-1');
            $('#countFollow').text(globalUtil.commafy(numberCurr - 1));
            pdiv.removeClass('disabled');
            $('.followBtn .popup-msg-blue-text').remove();
            globalUtil.userInfo.angels = '0'
            self.hideFollow();
          }
        }
      });
    }
  });
  return View;
});