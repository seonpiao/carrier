define([ "libs/client/views/base",'models/vipbuy','models/userInfo' ], function(Base,vipbuy,userInfo) {
  var View = Base.extend({
    moduleName: "vipbuy",
    show: function() {
      var self = this;
      var userIfdata = userInfo.toJSON();
      var usrvip = userIfdata.usrvip;
      var handler = function() {
	      var data = {
	        uservip: usrvip,
	        username: userIfdata.username
	      };
	      if (girlid != 0) {
	        data.girlid = girlid;
	      }
	      vipbuy.fetch();
	      vipbuy.on('sync', function() {
	      	var datavipb = vipbuy.toJSON();
		      self.loadTemplate('index', function(template) {
		        self.d = dialog({
		          title: ' ',
		          content: template(datavipb),
		          skin: 'dialogGames acitive_dialogbg',
		        });
		        self.setElement(self.d._popup);
		        self.d.show();
		        var callback = function() {
			        var vipCallExchangeBtn = $('.vip-call-exchange-btn');
				        vipCallExchangeBtn.click(function() {
				          self.callExchange();
				        });
			      };
					  self.init_vipBuy(callback);
		      });
			  })
			}
		  if (userIfdata.isLogin) {
          handler();
        } else {
          this.module('sign', function(module) {
            if (module) {
              module.showSignModel('login', function() {
                handler();
              });
            }
          });
      }
    },
    init_vipBuy: function(callback) {
    	var self = this;
      $('#vipbtnGetPackage').click(function() {
          self.getPackageVip(this);
      });
      if (callback) {
        callback();
      }
    },
    // 备注：1.已领取，2.未充值，3.已充值
    //点击蓝色按钮按钮变已领取
    getPackageVip: function(obj) {
      if ($(obj).hasClass("btn_grayh30")) {
        return;
      } else {
        $.ajax({
          type: "GET",
          url: apiUrl + "promotion/Vip",
          //固定格式
          dataType: "jsonp",
          cache: false,
          jsonp: "jsonpCallback",
          success: function(data) {
            //alert(data.error_code);
            if (data.success == 200) {
              var result = data.result;
              if (result.status) {
                $("#vipbtnGetPackage").text("已领取").addClass("btn_grayh30");
                globalUtil.pkgNew();
                globalUtil.lightpkgNew();
              }
            }
          }
        });
      }
    },
    callExchange: function() {
      this.module('exchange', function(exchange) {
        if (exchange) {
          exchange.showExchangeDialog();
        }
      });
    }
  });
  return View;
});