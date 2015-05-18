define(["libs/client/views/base", "models/userInfo", "models/userNews"], function(Base, userInfo, userNews) {
  var View = Base.extend({
    moduleName: "userfeed",
    init: function() {
      var self = this;
      self.listenTo(userNews, 'sync', self.render.bind(self));
      this.listenTo(userInfo, 'change:username', function() {
        if (window.talkname == userInfo.toJSON().username) {
          userNews.fetch();
          setInterval(function() {
            userNews.fetch();
          }, 60 * 1000);
        }
      });
    },
    render: function(data) {
      var self = this;
      console.log(data);
      this.loadTemplate('index', function(template) {
        var str = template({});
        self.$body.find('.userfeed').html(str);
        var userNewList = userNews.toJSON().result;
        for (var i = 0, l = userNewList.length; i < l; i++) {
          self.module('feed', function(feed) {
            if (feed) {
              self.$body.find('.userfeed ul').append(feed.transformStr({
                content: userNewList[i]
              }));
            }
          });
        }
      });
    }
  });
  return View;
});
