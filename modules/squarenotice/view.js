define(["libs/client/views/base", 'models/squarenotice'], function(Base, squarenotice) {
  var d;

  function getCookie(c_name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=")
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1
        c_end = document.cookie.indexOf(";", c_start)
        if (c_end == -1) c_end = document.cookie.length
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return ""
  }

  function setCookie(c_name, value, hours) {
    var exdate = new Date().getTime() + hours * 60 * 60 * 1000;
    document.cookie = c_name + "=" + escape(value) +
      ((hours == null) ? "" : ";expires=" + new Date(exdate).toGMTString())
  }
  var View = Base.extend({
    moduleName: "squarenotice",
    init: function() {
      var self = this;
      var noticeFlag = getCookie('notice-flag');
      var initShow = this.$el.attr('data-show') === 'init';
      if (!noticeFlag && initShow) {
        this.listenTo(squarenotice, 'sync', this.ReportContShow.bind(this));
      }
      squarenotice.fetch();
    },
    ReportContShow: function(noticeinit) {
      var self = this;
      var data = squarenotice.toJSON();
      if (noticeinit && data.result.length == 0) {
        return;
      }
      this.loadTemplate('index', function(template) {
        var item = template(data);
        d = dialog({
          id: 'noticeShow-dialog-on',
          title: ' ',
          content: item,
          padding: 0,
          autofocus: true,
          skin: 'dialogGames noticeShow-dialog-on',
          onclose: function() {
            d.close();
          }
        });
        d.show();
        var $scollbar = $('.noticeShow-dialog-on #itemListBar');
        $scollbar.tinyscrollbar({
          trackSize: 280
        });
        var datanotie = data.result;
        $.each(datanotie, function(i, v) {
          noticeid = v.seq;
          setCookie('notice-flag', noticeid, 0.5);
        })

        $('#notice_btn').on('click', self.CloseNticeShow.bind(self));
        $('.noticeShow-dialog-on .ui-dialog-close').html('');
      })
    },
    CloseNticeShow: function() {
      if (d) {
        d.close().remove();
        d = null;
      }
    }
  });
  return View;
});