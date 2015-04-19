define(["modules/mm_chat/view"], function(Base) {
  var View = Base.extend({
    moduleName: "mm_chat",
    template: 'index',
    init: function() {
      Base.prototype.init.apply(this, arguments);
    },
    send_chat: function(e) { // 发送消息,送由服务器过滤
      var self = this;
      if (e) {
        e.preventDefault();
      }
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            var t = $('#chat_text');
            var content = $.trim(t.val());
            content = self.htmlEntities(content);
            if (typeof(comet) == 'undefined') {
              self.chatMsg('请登录后再发布消息');
              return false;
            }
            if (content.length == 0) {
              self.chatMsg('消息内容不能为空');
              return false;
            }
            if (self.getCharLen(content) > 180) {
              self.chatMsg('内容不能超过90个字');
              return false;
            }
            if (!self.chatTimer()) {
              self.chatMsg('您发送消息太频繁，请稍后再发');
              return false;
            }
            $('#chat_error_msg').remove();
            //self.addmsg(uid, nickname, content, true);
            self.msg = {
              'uid': globalUtil.userInfo ? globalUtil.userInfo.ssoid : '',
              'nickname': globalUtil.userInfo ? globalUtil.userInfo.usrnick : '',
              'content': content
            };
            comet.pub(self.msg.content);
            if (self.contentList.length > 9) {
              self.contentList.pop();
            }
            self.contentList.push(self.msg.content);
            self.contentPoint = self.contentList.length;
          });
        }
      });
    }
  });
  return View;
});
