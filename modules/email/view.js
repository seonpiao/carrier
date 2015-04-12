define(["libs/client/views/base", 'models/email', 'models/emailContent', 'models/userFund', 'models/newemailflicker'], function(Base, email, emailContent, userFund, newemailflicker) {
  var View = Base.extend({
    moduleName: "email",
    events: {},
    d: null,
    init: function() {
      var self = this;
      this.listenTo(email, 'change', this.showMaillist.bind(this));
      self.newemailF();
    },
    showMaillist: function(mailid) {
      var self = this,
        data = email.toJSON();
      this.module('sign', function(module) {
        self.loadTemplate('index', function(template) {
          var item = template(data);
          self.d.content(item);
          $('.email-dialog-on #itemListBar').tinyscrollbar({
            trackSize: 300
          });
          self.showContent();
        });
      });
      return this;
    },
    show: function() {
      var self = this;
      email.fetch();
      this.d = dialog({
        id: 'email-dialog-on',
        title: ' ',
        content: '',
        padding: 0,
        autofocus: true,
        skin: 'email-dialog-on',
        onclose: function() {
          self.d.close();
        }
      });
      this.d.show();
      globalUtil.stopBling($('#unmail'), globalUtil.emailNewTimer);
      $('.email-dialog-on .ui-dialog-close').html('');
      return this;
    },
    //显示邮件详情
    showContent: function() {
      //console.log($('.email-dialog-on .emailList li').html())
      var self = this;
      $('.email-dialog-on .emailList li').click(function(e) {
        e.preventDefault();
        var obj = $(this),
          emailid = obj.attr('emailid');
        if (obj.hasClass('noat_nr')) {
          obj.addClass('hr_noat').removeClass('noat_nr');
          obj.removeClass('on');
        }
        emailContent.once('sync', function() {
          var data = emailContent.toJSON()
            //console.log(data)
          self.loadTemplate('email', function(template) {
            var item = template(data);
            self.d = dialog({
              id: 'email-edialog-on',
              title: ' ',
              content: ' ',
              padding: 0,
              autofocus: true,
              skin: 'email-dialog-on email-edialog-on',
              onclose: function() {
                self.d.close();
              }
            });
            self.d.content(item);
            self.getAttachment();
            self.emailEtialC();
            self.d.show();
            $('.email-edialog-on #itemListBar').tinyscrollbar({});
            $('.email-edialog-on').parent().css({
              'left': '790px'
            });
            $('.email-dialog-on .ui-dialog-close').html('');
          });
        });
        emailContent.fetch({
          data: {
            mailid: emailid
          }
        });
      })

    },
    //全部领取
    getAttachment: function() {
      var self = this;
      $('.email-edialog-on #AllGet').click(function(e) {
        var emailid = $(e.target).attr('emailid');
        e.preventDefault();
        var url = apiUrl + "mail/GetAttachment";
        $.ajax({
          url: url,
          dataType: "jsonp",
          jsonp: "jsonpCallback",
          cache: false,
          data: {
            mailid: emailid
          },
          success: function(data) {
            if (data.success === 200) {
              $.each(data.pageevent.event, function(i, prize) {
                if (prize == 'UsrAccountRefresh') {
                  userFund.fetch();
                }
                if (prize == 'userPackNewItem') {
                  globalUtil.pkgNew();
                  globalUtil.lightpkgNew();
                }
                $("#i" + emailid).remove();
                //email.fetch();
                self.d.close().remove();
              });
            } else {
              alert('领取失败！');
            }
          }
        });
      })
    },
    newemailF: function() {
      newemailflicker.once('sync', function() {
        var data = newemailflicker.toJSON();
        if (data.success == 200) {
          var newemailnum = data.result.inboxNum;
          if (newemailnum > 0) {
            //console.log(newemailnum)
            globalUtil.emailNew();
            globalUtil.lightemailNew();
          }
        }

      });
      newemailflicker.fetch({
        data: {
          girlid: girlid
        }
      });
    },
    emailEtialC: function() {
      var self = this;
      $('.email-edialog-on #AllClose').click(function(e) {
        self.d.close().remove();
      })
    }
  });
  return View;
});