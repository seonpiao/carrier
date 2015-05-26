define([ "libs/client/views/base",'models/vippackage' ], function(Base,vippackage) {
	var d;
  var View = Base.extend({
    moduleName: "activitygb",
    events: {},
    init: function() {},
    show: function() {
      var self = this;
      this.loadTemplate('index', function(template) {
        self.d = dialog({
          title: ' ',
          content: template({}),
          skin: 'dialogGames acitive_dialogbg',
          onclose: function() {
            self.d.close().remove();
          }
        });
        self.setElement(self.d._popup);
        self.open_popExchangecode();
        self.d.show();
        globalUtil.resetScrollbar('icon_img_bar', 317);
        $('#icon_img_bar li').click(function(e) {
	        e.preventDefault();
	        var item = $(this).attr('item');
	        if (item) {
	          $(this).attr("item", item).addClass('act');
	          $(this).siblings().removeClass('act');
	        }
	        eval('self.open_' + item + '(this)');
      	});
      	
      });
    },
    // 兑换码内容加载
    // 数据加载
    open_popExchangecode: function() {
      var self = this;
      this.loadTemplate('popExchangecode', function(template) {
      		var excodehtml = template({});
      		$("#popIncIconBody").html(excodehtml);
      		self.init_popExchangecode();
      })
    },
    init_popExchangecode: function() {
      var self = this;
      $("#exchange-code-input").focus(function() {
        $(this).attr('placeholder', ' ');
      }).blur(function() {
        $(this).attr('placeholder', "请输入您的兑换码...");
      });
    },
    open_popVippackage: function() {
      var self = this;
      vippackage.fetch();
      vippackage.on('sync', function() {
	      self.loadTemplate('vippackage', function(template) {
	      	  var data = vippackage.toJSON();
	      		var Vippackagehtml = template(data);
	      		$("#popIncIconBody").html(Vippackagehtml);
	      		self.init_popVippackage(data);
	      })
	    })
    },
    init_popVippackage: function(data) {
      var self = this;
      self.drawPackage();
      if (data.success == 200) {
        var result = data.result;
        // 3:可领取, 2:不符合条件, 1:已领取
        if (result.gold.status == 1) {
          $("#gold").text("已领取").attr('disabled', 'disabled').removeClass('btn_1y').addClass("btn_grayh25");
        } else if (result.gold.status == 2) {
          $("#gold").addClass("btn_grayh25").text("不可领").removeClass('btn_1y').attr('disabled', 'disables');
        } else {
          $("#gold").removeClass("btn_grayh25");
        }
        if (result.silver.status == 1) {
          $("#silver").text("已领取").attr('disabled', 'disabled').removeClass('btn_1y').addClass("btn_grayh25");
        } else if (result.silver.status == 2) {
          $("#silver").addClass("btn_grayh25").text("不可领").removeClass('btn_1y').attr('disabled', 'disables');
        } else {
          $("#silver").removeClass("btn_grayh25");
        }
        if (result.vip.status == 1) {
          $("#vip").text("已领取").attr('disabled', 'disabled').removeClass('btn_1y').addClass("btn_grayh25");
        } else if (result.vip.status == 2) {
          $("#vip").addClass("btn_grayh25").text("不可领").removeClass('btn_1y').attr('disabled', 'disables');
        } else {
          $("#vip").removeClass("btn_grayh25");
        }
      }
    },
    drawPackage: function() {
      var self = this;
      $('.draw-package-btn').click(function(e) {
        var type = e.currentTarget.id;
        // http://api.mm.wanleyun.cn/promotion/AngelGold 黄金
        // http://api.mm.wanleyun.cn/promotion/AngelSilver 白银
        // http://api.mm.wanleyun.cn/promotion/DayVip
        var path;
        if (type == 'vip') {
          path = "promotion/DayVip";
        } else if (type == 'silver') {
          path = "promotion/AngelSilver";
        } else {
          path = "promotion/AngelGold";
        }
        $.ajax({
          type: "GET",
          url: apiUrl + path,
          //固定格式
          dataType: "jsonp",
          cache: false,
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              var result = data.result;
              if (result.status) {
                $("#" + type).text("已领取").attr('disabled', 'disabled').removeClass('btn_1y').addClass("btn_grayh25");
                globalUtil.pkgNew();
                globalUtil.lightpkgNew();
                self.showBuyDialog();
              }
            } else {
              self.showErrorDialog(result.error_code + result.error_msg);
            }
          }
        });
      });
    },
    showBuyDialog: function() {
      var self = this;
      var d = dialog({
        id: 'golden-msg-box',
        content: '<div class="get_success_word"><div class="buy_lingtsshow"><span></span></div></div>',
        skin: 'golden-msg'
      });
      $('.golden-msg').css({
        'background': 'none',
        'border': 'none'
      });
      d.show();
      setTimeout(function() {
        d.close().remove();
      }, 2000);
    },
    showErrorDialog: function(msg) {
      this.module('errmsg', function(module) {
        if (module) {
          module.show(msg);
        }
      });
    }
  });
  return View;
});