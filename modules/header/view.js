define(["libs/client/views/base", "libs/client/global", "models/userInfo", "libs/client/queue", "models/sign", "models/exchange", "models/girl"], function(Base, GLOBAL, userInfo, queue, sign, exchange, girl) {
  var View = Base.extend({
    moduleName: "header",
    template: 'index',
    events: {
      'mouseenter #usernick_slide': 'usrinfoDown',
      'mouseleave #usernick_slide': 'usrinfoUp',
      'click #unmail': 'showMails',
      'click #unpack': 'showPkg',
      'click #uncoin': 'showGolden',
      'mouseenter #tbar .share': 'showShare',
      'mouseleave #tbar .share_hover': 'hideShare',
      'click .signout_login': 'signOut',
      'click #recharge': 'callExchange',
      'click #undiamond': 'callExchange'
        // 'mouseenter #tbar #qq_Qbg': "qq_Qshow",
        // 'mouseleave #tbar #qq_Qbg': 'qq_QHide'
    },
    init: function() {
      // this.listenTo(userInfo, 'change', this.render.bind(this));
      userInfo.cache({
        data: {
          girlid: window.girlid
        }
      }, this.render.bind(this));
      globalUtil.queuePao = queue(3);
      globalUtil.queueNbd = queue(1);
      globalUtil.queueAni = queue(1);
      globalUtil.queueScn = queue(1);
    },
    signOut: function(e) {
      sign.once('sync', function() {
        setTimeout(function() {
          userInfo.fetch();
        })
      });
      sign.signOut();
      this.usrinfoUp();
    },
    getDomain: function() {
      var siteDomain = (function(w) {
        var domainLevel = 2;
        var domains = w.location.hostname.split(".");
        domains = domains.slice(domains.length - domainLevel);
        return domains.join(".");
      })(window);
      return siteDomain;
    },
    render: function() {
      var self = this;
      var data = userInfo.toJSON();
      globalUtil.userInfo = data;
      this.loadTemplate('index', function(template) {
        if (window.girlid > 0) {
          girl.cache(function() {
            data.girl = girl.toJSON();
            var html = template(data);
            self.$el.html(html);
            self.qq_Qshow();
          });
        } else {
          var html = template(data);
          self.$el.html(html);
          self.qq_Qshow();
        }
      });
    },
    usrinfoDown: function(e) {
      if (userInfo.get('isLogin')) {
        this.$('.username_box').addClass('hover');
        this.$('.username_box ul').show();
        this.$('.up_pointer').removeClass('up_pointer').addClass('down_pointer');
      }
    },
    usrinfoUp: function() {
      this.$('.username_box').removeClass('hover');
      this.$('.username_box ul').hide();
      this.$('.down_pointer').removeClass('down_pointer').addClass('up_pointer');
    },
    showShare: function() {
      self.$('#tbar .share').parent().addClass('share_hover');
    },
    hideShare: function() {
      self.$('#tbar .share').parent().removeClass('share_hover');
    },
    showPkg: function(e) {
      e.preventDefault();
      this.module('pkg', function(pkg) {
        if (pkg) {
          pkg.initPkg();
        }
      });
    },
    showMails: function(e) {
      e.preventDefault();
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            self.module('email', function(email) {
              if (email) {
                email.show();
              }
            });
          });
        }
      });
    },
    showGolden: function(e) {
      e.preventDefault();
      this.module('golden', function(golden) {
        if (golden) {
          golden.show();
        }
      });
    },
    callExchange: function() {
      this.module('exchange', function(exchange) {
        if (exchange) {
          exchange.showExchangeDialog();
        }
      });
    },
    qq_Qshow: function() {
      $("#qq_Qbg").mouseenter(function() {
        $("#weibo_Con").html('')
        $("#weibo_Con").append($("#wb_attbtn").html())
        if ($(this).hasClass('qq_Qshow')) {
          $(this).addClass('currentbg');
        }
        $(this).children('.qq_Qshowwdcon').show();
      }).mouseleave(function() {
        if ($(this).hasClass('qq_Qshow')) {
          $(this).removeClass('currentbg');
        }
        $(this).children('.qq_Qshowwdcon').hide();
      });
    }
  });
  return View;
});