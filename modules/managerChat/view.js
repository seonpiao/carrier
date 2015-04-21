define(["libs/client/views/base", "libs/client/global", 'libs/client/chalUtil'], function(Base, GLOBAL, chalUtil) {
  var View = Base.extend({
    moduleName: "managerChat",
    events: {
      'click .add': 'render',
      'click .submit': 'login'
    },
    init: function() {
      this.roomMap = JSON.parse(localStorage.roomMap || "{}");
      console.log(this.roomMap);
      for (var key in this.roomMap) {
        var roomInfo = this.roomMap[key];
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
      var girlid = form.attr('data-girlid');
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
      var form = $('form[data-girlid="' + girlid + '"]');
      $.ajax({
        url: '/api/userLogin',
        data: {
          username: data.username,
          password: shalUtil.hex_sha1(data.password)
        },
        success: function(resp) {
          console.log(resp);
          form.after(data.username + '成功登录' + data.girlid);
          form.remove();
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
        },
        error: function(data) {
          console.log(data);
        }
      })
    }
  });
  return View;
});
