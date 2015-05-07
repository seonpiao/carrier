define(["libs/client/views/base", "libs/client/global", 'libs/client/chalUtil'], function(Base, GLOBAL, chalUtil) {
  var View = Base.extend({
    moduleName: "managerChat",
    events: {
      'click .add': 'render',
      'click .submit': 'login',
      'click .logout': 'logout'
    },
    init: function() {
      this.roomMap = JSON.parse(localStorage.roomMap || "{}");
      console.log(this.roomMap);
      var form = $('.login-form').toArray();
      var i = 0;
      for (var key in this.roomMap) {
        var roomInfo = this.roomMap[key];
        $(form[i++]).parent().attr('data-girlid', key);
        this.doLogin(roomInfo);
      }
    },
    render: function() {
      this.loadTemplate('index', function(template) {
        var res = {};
        var html = template(res);
        $('.add').before(html);
      });
    },
    login: function(e) {
      e.preventDefault();
      var form = $(e.currentTarget).parent();
      // var girlid = form.parent().attr('data-girlid');
      var girlid = form.find('.room').val();
      form.parent().attr('data-girlid', girlid);
      var username = form.find('.username').val();
      var password = form.find('.password').val();
      this.doLogin({
        girlid: girlid,
        username: username,
        password: password
      });
    },
    doLogin: function(data) {
      var self = this;
      var girlid = data.girlid;
      var form = $('.item[data-girlid="' + girlid + '"] .login-form');
      $.ajax({
        url: '/api/userLogin',
        data: {
          username: data.username,
          password: shalUtil.hex_sha1(data.password)
        },
        success: function(resp) {
          if (resp.code == 1) {
            $(form.siblings()[0]).removeClass('hide').prepend(data.username + '成功登录' + data.girlid + '号房间');
            self.loadTemplate('multi', function(template) {
              var html = template();
              $(form.siblings()[1]).append(html);
              form.remove();
            })
            for (var key in this.roomMap) {
              var roomInfo = this.roomMap[key];
              this.doLogin(roomInfo);
            }
            self.roomMap[girlid] = {
              girlid: girlid,
              username: data.username,
              password: data.password
            };
            localStorage.roomMap = JSON.stringify(self.roomMap);
            $('.chat-wraper').removeClass('hide');
          } else {
            alert(resp.msg);
          }
        },
        error: function(data) {
          alert(data.msg);
        }
      });
    },
    logout: function(e) {
      var roomMap = JSON.parse(localStorage.roomMap || "{}");
      var chatItem = $(e.currentTarget.parentElement.parentElement);
      var girlid = chatItem.attr('data-girlid');
      delete roomMap[girlid];
      localStorage.roomMap = JSON.stringify(roomMap);
      chatItem.find('.login-success').addClass('hide');
      chatItem.find('#chat').remove();
      this.loadTemplate('form', function(template) {
        var html = template();
        chatItem.prepend(html);
      });
    }
  });
  return View;
});
