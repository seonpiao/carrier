define(["libs/client/views/base", "libs/client/scrollbar/jquery.tinyscrollbar", 'models/userInfo'], function(Base, SCROLLBAR, userInfo) {
  var View = Base.extend({
    moduleName: "activity",
    events: {
      'click #firstRechange': 'handleActivity',
      'click #dayRechange': 'handleActivity',
      'click #vipBuy': 'handleActivity',
      'click #actionShow': 'handleActivity',
      'click #MysteriousTrader': 'handleActivity',
      'click #DailySign': 'handleActivity',
      'click #ConstellAtion': 'openConstellAtion',
      'click #specialMerchants': 'openpersiashop',
      'click .BottleShow': 'openBottle',
      'click #ladyNotice': 'openLadyNotice',
      'click #RankingList': 'openRankingList'
    },
    init: function() {
      $('input').placeholder();
    },
    render: function() {

    },
    handleActivity: function(e) {
      e.preventDefault();
      var o = $(e.target);
      var id = o.attr('id');
      this.check_login('open_' + id);
    },
    //校验登录状态，后续统一实现
    check_login: function(func_name) {
      if (dialog.getCurrent()) {
        dialog.getCurrent().remove();
      }
      this[func_name]();
    },
    // 弹框显示
    dialog_Box: function(dialog_name, callback) {
      var ladyGames = dialog({
        id: 'popup-activity',
        title: ' ',
        content: $('#' + dialog_name).html(),
        quickClose: false, //点击空白处快速关闭
        skin: 'dialogGames acitive_dialogbg'
      });
      ladyGames.show();
      $('.dialogGames .ui-dialog-title').html(' ');
      $('.dialogGames .ui-dialog-close').text('');
      $("#popWindow").empty();
      if (callback) {
        callback();
      }
    },
    // 数据加载
    open_actionShow: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popIncIcon").length > 0) {
        //修改为统一浮层显示方法
        self.dialog_Box("popIncIcon", function() {
          self.init_popIncIcon();
          $('.activity-package-list li')[0].click();
        });
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/incIcon", {}, function(data) {
          $("#popWindow").append(data)
          self.dialog_Box("popIncIcon", function() {
            self.init_popIncIcon();
            $('.activity-package-list li')[0].click();
          });
        });
      }

    },
    init_popIncIcon: function() {
      var self = this;
      globalUtil.resetScrollbar('icon_img_bar', 317);
      //$('#icon_img_bar li').eq(0).addClass('act');
      //self.open_buyAsendB();
      $('#icon_img_bar li').click(function(e) {
        e.preventDefault();
        var item = $(this).attr('item');
        if (item) {
          $(this).attr("item", item).addClass('act');
          $(this).siblings().removeClass('act');
        }
        eval('self.open_' + item + '(this)');
      });
    },
    open_firstRechange: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popFirstRechange").length > 0) {
        //修改为统一浮层显示方法
        self.init_firstRechange();
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/firstRechange/", {}, function(data) {
          $("#popWindow").append(data)
          self.init_firstRechange();
        });
      }
    },
    init_firstRechange: function() {
      var self = this;
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/GetFirstCondition",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          //alert(data.error_code);
          if (data.success == 200) {
            var result = data.result;
            if (result.status == 1) {
              $("#btnGetPackage").text("已领取").addClass("btn_grayh30");
            } else if (result.status == 2) {
              $("#btnGetPackage").addClass("btn_grayh30");
            } else {
              $("#btnGetPackage").removeClass("btn_grayh30");
            }
            self.dialog_Box("popFirstRechange", function(e) {
              self.getPackageFirstRechange(e.target);
            });
          }
        }
      });
    },
    /* 备注：1.已领取，2.未充值，3.已充值
    // 点击蓝色按钮按钮变已领取
    */
    getPackageFirstRechange: function(obj) {
      if ($(obj).hasClass("btn_grayh30")) {
        return;
      } else {
        $.ajax({
          type: "GET",
          url: apiUrl + "promotion/FirstRecharge",
          //固定格式
          dataType: "jsonp",
          cache: false,
          jsonp: "jsonpCallback",
          success: function(data) {
            //alert(data.error_code);
            if (data.success == 200) {
              var result = data.result;
              if (result.status) {
                $("#btnGetPackage").text("已领取").addClass("btn_grayh30");
              }
            }
          }
        });
      }
    },
    // 数据加载
    open_dayRechange: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popDayRechange").length > 0) {
        //修改为统一浮层显示方法
        self.init_dayRechange();
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/dayRechange/", {}, function(data) {
          $("#popWindow").append(data)
          self.init_dayRechange();
        });
      }
    },
    init_dayRechange: function() {
      var self = this;
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/GetEveryCondition",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            var result = data.result;
            if (result.status == 1) {
              $("#daybtnGetPackage").text("已领取").addClass("btn_grayh30");
            } else if (result.status == 2) {
              $("#daybtnGetPackage").addClass("btn_5b");
            } else {
              $("#daybtnGetPackage").removeClass("btn_grayh30");
            }
            self.dialog_Box("popDayRechange", function(e) {
              self.getPackageDayRechange(e.target);
            });
          }
        }
      });
    },
    // 备注：1.已领取，2.未充值，3.已充值
    // 点击蓝色按钮按钮变已领取
    getPackageDayRechange: function(obj) {
      if ($(obj).hasClass("btn_grayh30")) {
        return;
      } else {
        $.ajax({
          type: "GET",
          url: apiUrl + "promotion/EveryRecharge",
          //固定格式
          dataType: "jsonp",
          cache: false,
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              var result = data.result;
              if (result.status) { //true 已领取 false 未领取
                $("#daybtnGetPackage").text("已领取").addClass("btn_grayh30");
              }
            }
          }
        });
      }
    },
    // 数据加载
    open_vipBuy: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popVipBuy").length > 0) {
        //修改为统一浮层显示方法
        self.init_vipBuy();
      } else {
        //调用浮层html
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
          $.get("/activity/vipBuy", data, function(data) {
            $("#popWindow").append(data);
            var callback = function() {
              var vipCallExchangeBtn = $('.vip-call-exchange-btn');
              if (usrvip != 1) {
                vipCallExchangeBtn.html('购买VIP');
              }
              vipCallExchangeBtn.click(function() {
                self.callExchange();
              });
            };
            self.init_vipBuy(callback);
          });
        };
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
      }
    },

    init_vipBuy: function(callback) {
      var self = this;
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/GetVipCondition",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          //alert(data.error_code);
          if (data.success == 200) {
            var result = data.result;
            if (result.status == 1) {
              $("#vipbtnGetPackage").text("已领取").addClass("btn_grayh30").removeClass('btn_5b');
            } else if (result.status == 2) {
              $("#vipbtnGetPackage").addClass("btn_grayh30").removeClass('btn_5b');
            } else {
              $("#vipbtnGetPackage").removeClass("btn_grayh30");
            }
            self.dialog_Box("popVipBuy", function(e) {
              $('#vipbtnGetPackage').click(function() {
                self.getPackageVip(this);
              });
              if (callback) {
                callback();
              }
            });
          }
        }
      });
    },
    // 备注：1.已领取，2.未充值，3.已充值
    //点击蓝色按钮按钮变已领取
    getPackageVip: function(obj) {
      if ($(obj).hasClass("btn2_gray")) {
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
    total: 0,
    open_popDailySign: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popDailySign").length > 0) {
        //修改为统一浮层显示方法
        self.init_popDailySign();
      } else {

        //调用浮层html
        $.get(mmUrl + "activity/dailysign", {}, function(data) {
          $("#popIncIconBody").html(data)
          self.init_popDailySign();
        });
      }
    },
    init_popDailySign: function() {
      var self = this;
      $('.sign_iconlistli li a').click(function(e) {
        e.preventDefault();
        var sid = $(this).parent().attr('signid');
        self.Check(this, sid);
      });
      $.ajax({
        type: "GET",
        url: self + "promotion/getUserCheck",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            var result = data.result;
            var aCount = 0;
            self.total = result.count;
            $.each(result.result, function(i, value) {
              if (value.check == 0) {
                $(".ok_tips", $(".sign_" + (aCount + 1))).addClass('hide');
              }
              if (value.ddouble == 1) {
                $(".ddouble", $(".sign_" + (aCount + 1))).addClass('vip_purpleimg');
              }
              if (value.ddouble == 2) {
                $(".ddouble", $(".sign_" + (aCount + 1))).addClass('vip_yellowimg');
              }
              if (value.ddouble == 3) {
                $(".ddouble", $(".sign_" + (aCount + 1))).addClass('vip_grayimg');
              }
              aCount++;

            });
          }
        }
      });
    },
    open_DailySign: function() {
      var self = this;
      self.open_actionShow();
      $('#icon_img_bar li').eq(5).addClass('act');
      self.open_popDailySign();
    },
    //点击亮色按钮进行点击
    Check: function(obj, num) {
      var self = this;
      if (num == self.total + 1 || num == 0) {
        $.ajax({
          type: "GET",
          url: apiUrl + "promotion/Check",
          //固定格式
          dataType: "jsonp",
          cache: false,
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              var result = data.result;
              if (result.status) {
                $(".ok_tips", $(".sign_" + (self.total + 1))).removeClass('hide');
              }
            }
          }
        });
      } else {
        return;
      }
    },
    // 买满就送内容加载
    // 数据加载
    open_popBuyFullcon: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popBuyFullcon").length > 0) {
        //修改为统一浮层显示方法
        self.init_popBuyFullcon();
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/buyFull", {}, function(data) {
          $("#popIncIconBody").html(data)
          self.init_popBuyFullcon();
        });
      }
    },
    init_popBuyFullcon: function() {
      var self = this;
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/GetFullCondition",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            var result = data.result;
            if (result.status == 1) {
              $("#fullbtnGet").text("已领取").addClass("btn_grayh25");
            } else if (result.status == 2) {
              $("#fullbtnGet").addClass("btn_grayh25");
            } else {
              $("#fullbtnGet").addClass("btn_1y").click(function() {
                self.fullbtnGet();
              });

            }
          }
        }
      });
    },
    // 点击亮色按钮进行点击
    fullbtnGet: function(obj) {
      if ($(obj).hasClass('btn_grayh30')) {
        return;
      } else {
        $.ajax({
          type: "GET",
          url: apiUrl + "promotion/BuyFull",
          //固定格式
          dataType: "jsonp",
          cache: false,
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              var result = data.result;
              if (result.status) {
                $("#fullbtnGet").text("已领取").addClass("btn_grayh25");
              }
            }
          }
        });
      }
    },
    // 买A就送B内容加载
    // 数据加载
    open_buyAsendB: function() {
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popBuyAsendBcon").length > 0) {
        //修改为统一浮层显示;
        $('.btn_onceBuy').click(function() {
          self.onceBuy();
        });
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/buyaSendb", {}, function(data) {
          $("#popIncIconBody").html(data);
          $('.btn_onceBuy').click(function() {
            self.onceBuy();
          });
        });
      }
    },
    // 点击亮色按钮进行点击
    onceBuy: function(obj) {
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/HalfOff",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            var result = data.result;
            if (result.status) {
              alert("购买成功！");
            } else {
              alert("购买失败！")
            }
          }
        }
      });
    },
    // 回归活动内容加载
    // 数据加载
    open_popRepackagecon: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popRepackageCon").length > 0) {
        //修改为统一浮层显示方法
        self.init_popRepackageCon();
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/rePackage", {}, function(data) {
          $("#popIncIconBody").html(data)
          self.init_popRepackageCon();
        });
      }
    },
    init_popRepackageCon: function() {
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/GetComeBackCondition",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            var result = data.result;
            if (result.status == 1) {
              $("#repackageGet").text("已领取").addClass("btn_grayh25");
            } else if (result.status == 2) {
              $("#repackageGet").addClass("btn_grayh25");
            } else {
              $("#repackageGet").addClass("btn_5y");
            }
          }
        }
      });
    },
    // 兑换码内容加载
    // 数据加载
    open_popExchangecode: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popExchangecode").length > 0) {
        //修改为统一浮层显示方法
        // self.init_popExchangecode();
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/exchangeCode", {}, function(data) {
          $("#popIncIconBody").html(data)
            // self.init_popExchangecode();
        });
      }
    },
    init_popExchangecode: function() {
      var self = this;
      $('.btnExchangeCode').click(function() {
        self.onceCodebtn();
      });
      $("#exchangeCode").focus(function() {
        $(this).attr('placeholder', ' ');
      }).blur(function() {
        $(this).attr('placeholder', "请输入您的兑换码...");
      });
    },
    // 点击亮色按钮进行点击
    onceCodebtn: function() {
      var excode = $("#exchangeCode").val();
      var placevalue = $("#exchangeCode").attr('placeholder');


      alert(excode);
      if (excode == "" || excode == "请输入您的兑换码...") {
        alert("兑换码不能为空！");
      } else {
        $.ajax({
          type: "GET",
          url: apiUrl + "promotion/ExchangeCode",
          data: {
            code: excode
          },
          cache: false,
          //固定格式
          dataType: "jsonp",
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              var result = data.result;
              if (result.status) {
                alert("兑换成功！");
              } else {
                alert("兑换失败，请重试！");
              }
            }
          }
        });
      }
    },
    // 回归活动内容加载
    // 数据加载

    open_popOnline: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      //iCount = setTimeout(init_popOnline, 3000);
      if ($("#popOnline").length > 0) {
        //修改为统一浮层显示方法
        self.init_popOnline();
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/onLine", {}, function(data) {
          $("#popIncIconBody").html(data)
          self.init_popOnline();
        });
      }
    },
    init_popOnline: function() {
      var self = this;
      $('.online_chest li .chest').click(function(e) {
        self.Online(this, $(this).parent().attr('cid'));
      });
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/GetOnline",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            var result = data.result;
            var aCount = 0;
            $.each(result, function(i, value) {
              if (value.condition == 3) {
                $(".chest", $(".chest_" + (aCount + 1))).addClass('lights_chest_' + (aCount + 1));
                $(".chest_time", $(".chest_" + (aCount + 1))).addClass('hide');
                $(".received_chest", $(".chest_" + (aCount + 1))).addClass('hide');
                $(".chest", $(".chest_" + (aCount + 1))).val(i);
              } else if (value.condition == 1) {
                $(".chest", $(".chest_" + (aCount + 1))).addClass('gray_chest_' + (aCount + 1));
                $(".chest_time", $(".chest_" + (aCount + 1))).addClass('hide');
                $(".received_chest", $(".chest_" + (aCount + 1))).removeClass('hide');

              } else if (value.condition == 2) {
                $(".chest", $(".chest_" + (aCount + 1))).addClass('close_chest_' + (aCount + 1));
                $(".chest_time", $(".chest_" + (aCount + 1))).removeClass('hide');
                $(".received_chest", $(".chest_" + (aCount + 1))).addClass('hide');
                $(".chest_time").text(value.time);
              } else {
                $(".chest", $(".chest_" + (aCount + 1))).addClass('close_chest_' + (aCount + 1));
                $(".chest_time", $(".chest_" + (aCount + 1))).addClass('hide');
                $(".received_chest", $(".chest_" + (aCount + 1))).addClass('hide');
              }
              aCount++;

            });
            if ($(".chest_time:visible").length > 0) {
              setTimeout(self.init_popOnline, 60000);
            }
            /*
                      for(var i=0; i<5; i++){
                    if(result.status == 1){
                      $("#repackageGet").text("已领取").addClass("close_chest_1");
                    }else if(result.status == 2){
                          $("#repackageGet").addClass("close_chest_1"); 
                    }else{
                      $("#repackageGet").removeClass("btn2_gray"); 
                    }*/
          }
        }
      });
    },
    //点击亮色按钮进行点击
    Online: function(obj, num) {
      if ($(obj).hasClass('lights_chest_' + num)) {
        $.ajax({
          type: "GET",
          url: apiUrl + "promotion/Online",
          //固定格式
          dataType: "jsonp",
          cache: false,
          data: "onlinetime=" + $(obj).val(),
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              var result = data.result;
              if (result.status) {
                $(".chest", $(".chest_" + num)).addClass('gray_chest_' + num);
                $(".chest_time", $(".chest_" + num)).addClass('hide');
                $(".received_chest", $(".chest_" + num)).removeClass('hide');
                $(".chest", $(".chest_" + num)).removeClass('lights_chest_' + num);
              }
            }
          }
        });
      } else {
        return;
      }

    },
    // 回归活动内容加载
    // 数据加载
    open_popHalfprice: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#pophalfpriceCon").length > 0) {
        //修改为统一浮层显示方法
        self.init_pophalfpriceCon();
      } else {

        //调用浮层html
        $.get(mmUrl + "activity/halfPrice", {}, function(data) {
          $("#popIncIconBody").html(data)
          self.init_pophalfpriceCon();
        });
      }
    },
    init_pophalfpriceCon: function() {
      var self = this;
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/GetOnlineCondition",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            var result = data.result;
            if (result.status == 1) {
              $("#repackageGet").text("已领取").addClass("btn_grayh25");
            } else if (result.status == 2) {
              $("#repackageGet").addClass("btn_grayh25");
            } else {
              $("#repackageGet").addClass("btn_1y").click(function(e) {
                self.RepackageCon(this);
              });
            }
          }
        }
      });
    },
    // 点击亮色按钮进行点击
    RepackageCon: function(obj) {
      if ($(obj).hasClass('btn_grayh25')) {
        return;
      } else {
        $.ajax({
          type: "GET",
          url: apiUrl + "promotion/ComeBack",
          //固定格式
          dataType: "jsonp",
          cache: false,
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              var result = data.result;
              if (result.status) {
                $("#repackageGet").text("已领取").addClass("btn_grayh25");
              }
            }
          }
        });
      }
    },
    // 回归活动内容加载
    // 数据加载
    open_totalConsume: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popTotalconsume").length > 0) {
        //修改为统一浮层显示方法
        self.init_popTotalconsume();
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/totalConsume", {}, function(data) {
          $("#popIncIconBody").html(data)
          self.init_popTotalconsume();
        });
      }
    },
    init_popTotalconsume: function() {
      var self = this;
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/GetTotalPay",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            var result = data.result;
            var aCount = 0;
            $.each(result, function(i, value) {
              if (value.condition == 1) {
                $(".btn_2", $(".consume_" + (aCount + 1))).addClass('btn2_gray');
                $(".btn_2", $(".consume_" + (aCount + 1))).text('已领取');
              } else if (value.condition == 2) {
                $(".btn_2", $(".consume_" + (aCount + 1))).addClass('btn2_gray');
                $(".btn_2", $(".consume_" + (aCount + 1))).text('不可领');
              } else {
                $(".consume_" + (aCount + 1)).val(i);
              }
              aCount++;
            });
            $('.btn_consume').click(function(e) {
              self.Consume(this, $(this).attr('cid'));
            });
          }
        }
      });
    },
    //点击亮色按钮进行点击
    Consume: function(obj, num) {
      if ($(".btn_2", $(".consume_" + num)).hasClass('btn2_gray')) {
        return;
      } else {
        $.ajax({
          type: "GET",
          url: apiUrl + "promotion/TotalPay",
          //固定格式
          dataType: "jsonp",
          cache: false,
          data: "pay=" + $(obj).val(),
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              var result = data.result;
              if (result.status) {
                $(".btn_2", $(".consume_" + num)).addClass('btn2_gray');
                $(".btn_2", $(".consume_" + num)).text('已领取');
              }
            }
          }
        });
      }
    },
    // 回归活动内容加载
    // 数据加载
    open_totalRechange: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#totalRechange").length > 0) {
        //修改为统一浮层显示方法
        self.init_totalRechange();
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/TotalRechange", {}, function(data) {
          $("#popIncIconBody").html(data)
          self.init_totalRechange();
        });
      }
    },
    init_totalRechange: function() {
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/GetTotalRecharge",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            var result = data.result;
            var aCount = 0;
            $.each(result, function(i, value) {
              if (value.condition == 1) {
                $(".btn_2", $(".recharge_" + (aCount + 1))).addClass('btn_grayh25');
                $(".btn_2", $(".recharge_" + (aCount + 1))).text('已领取');
              } else if (value.condition == 2) {
                $(".btn_2", $(".recharge_" + (aCount + 1))).addClass('btn_grayh25');
                $(".btn_2", $(".recharge_" + (aCount + 1))).text('不可领');
              } else {
                $(".recharge_" + (aCount + 1)).val(i);
              }
              aCount++;

            });
          }
        }
      });
    },
    //点击亮色按钮进行点击
    Recharge: function(obj, num) {
      if ($(".btn_2", $(".recharge_" + num)).hasClass('btn2_gray')) {
        return;
      } else {
        $.ajax({
          type: "GET",
          url: apiUrl + "promotion/TotalRecharge",
          //固定格式
          dataType: "jsonp",
          cache: false,
          data: "recharge=" + $(obj).val(),
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              var result = data.result;
              if (result.status) {
                $(".btn_1y", $(".recharge_" + num)).addClass('btn_grayh25');
                $(".btn_1y", $(".recharge_" + num)).text('已领取');
              }
            }
          }
        });
      }
    },
    open_popVippackage: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      if ($("#popVippackage").length > 0) {
        //修改为统一浮层显示方法
        self.init_popVippackage();
      } else {
        //调用浮层html
        $.get(mmUrl + "activity/vipPackage", {}, function(data) {
          $("#popIncIconBody").html(data)
          self.init_popVippackage();
        });
      }
    },
    init_popVippackage: function() {
      var self = this;
      self.drawPackage();
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/GetVipPackage",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
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
        }
      });
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
              alert(result.error_code + result.error_msg);
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
      }, 1500);
    },
    // //点击亮色按钮进行点击
    // gold: function(obj) {
    //   if ($(obj).hasClass('btn2_gray')) {
    //     return;
    //   } else {
    //     $.ajax({
    //       type: "GET",
    //       url: apiUrl + "promotion/AngelGold",
    //       //固定格式
    //       dataType: "jsonp",
    //       cache: false,
    //       jsonp: "jsonpCallback",
    //       success: function(data) {
    //         if (data.success == 200) {
    //           var result = data.result;
    //           if (result.status) {
    //             $("#gold").text("已领取").addClass("btn_grayh25");
    //           }
    //         }
    //       }
    //     });
    //   }
    // },
    // silver: function(obj) {
    //   if ($(obj).hasClass('btn2_gray')) {
    //     return;
    //   } else {
    //     $.ajax({
    //       type: "GET",
    //       url: apiUrl + "promotion/AngelSilver",
    //       //固定格式
    //       dataType: "jsonp",
    //       cache: false,
    //       jsonp: "jsonpCallback",
    //       success: function(data) {
    //         if (data.success == 200) {
    //           var result = data.result;
    //           if (result.status) {
    //             $("#silver").text("已领取").addClass("btn_grayh25");
    //           }
    //         }
    //       }
    //     });
    //   }
    // },
    // 数据加载 特殊商人
    open_specialMerchants: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      //调用浮层html
      $.get(mmUrl + "activity/SpecialMerchants/", {}, function(data) {
        $("#popWindow").append(data)
        self.dialog_Box("popspecialMerchants");
        $("li", $("#pagination")).click(function(e) {
          $(this).addClass("on").siblings().removeClass("on");
          var pageno = $(this).index() + 1;
          self.turnPage(1, pageno);
        });
        $("#pagination_preview").click(function(e) {
          var cur_page = $("li.on", $("#pagination")).index();
          if (cur_page == 0) return;
          var pageno = cur_page;
          $("li", $("#pagination")).eq(cur_page).removeClass("on")
          $("li", $("#pagination")).eq(cur_page - 1).addClass("on");
          self.turnPage(1, pageno);
        });
        $("#pagination_next").click(function(e) {
          var cur_page = $("li.on", $("#pagination")).index();
          if (cur_page == $("li", $("#pagination")).length - 1) return;
          var pageno = cur_page + 2;
          $("li", $("#pagination")).eq(cur_page).removeClass("on")
          $("li", $("#pagination")).eq(cur_page + 1).addClass("on");
          self.turnPage(1, pageno);
        });
        //self.init_specialMerchants();
      });
    },
    turnPage: function(type, page) {
      var self = this;
      $.ajax({
        type: "GET",
        url: mmUrl + "activity/SpecialMerchants/",
        //固定格式
        dataType: "html",
        cache: false,
        data: {
          pageNo: page,
          type: type
        },
        success: function(data) {
          $('#maincontent').html(data);
        }
      });
      $('.btn_moreDiscount').click(function(e) {
        self.moreDiscount($(this).attr('cid'));
      });
      $('.btn_info').click(function(e) {
        self.indo($(this).attr('cid'));
      });
    },
    closewin: function(id) {
      $("#" + id).remove()
    },
    info: function(id) {
      $.get(mmUrl + "activity/GetItemDetail?id=" + id, {}, function(data) {
        $("#info").remove();
        $("#innerwin").append(data)
      });
    },
    moreDiscount: function(id) {
      $.get(mmUrl + "activity/GetMoreDiscount?id=" + id, {}, function(data) {
        var moreinfo = dialog({
          id: 'popup-moreinfo',
          title: ' ',
          content: data,
          quickClose: false, //点击空白处快速关闭
          skin: 'dialogGames'
        });
        moreinfo.show();
        $('.dialogGames .ui-dialog-title').html('');
        $('.dialogGames .ui-dialog-close').text('');
      });
    },
    buy: function(id) {
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/BuyItem",
        //固定格式
        dataType: "jsonp",
        cache: false,
        data: "id=" + id,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            $('#buysuccess').show();
            setTimeout(function() {
              $('#buysuccess').hide();
            }, 6000);
          } else if (data.success == -1) {
            $('#entitled').html('已超出您可购买的数量！');
            var wishSuccess = dialog({
              title: ' ',
              content: $('#buytipsStatusInner').html(),
              quickClose: false, //点击空白处快速关闭
              skin: 'dialogBluebgGames'
            });
            wishSuccess.show();
            $('.dialogBluebgGames .ui-dialog-title').html('');
            $('.dialogBluebgGames .ui-dialog-close').text('');
          } else {
            $('#difference').text(data.result.difference);
            if (data.result.bidtype == 1) {
              $('#difference').addClass('red yellow_gold');
            } else {
              $('#difference').addClass('red blue_drill');
            }
            var wishSuccess = dialog({
              title: ' ',
              content: $('#buytipsStatusInner').html(),
              quickClose: false, //点击空白处快速关闭
              skin: 'dialogBluebgGames'
            });
            wishSuccess.show();
            $('.dialogBluebgGames .ui-dialog-title').html('');
            $('.dialogBluebgGames .ui-dialog-close').text('');
          }
        }
      });
    },
    i: 0,
    // 数据加载
    open_MysteriousTrader: function() {
      var self = this;
      //页面打开状态不加载浮层，此处动态加载
      //调用浮层html
      self.i = 0;
      $.get(mmUrl + "activity/GetMyMysterious/", {}, function(data) {
        $("#popWindow").append(data);
        self.dialog_Box("MysteriousStatusInner");
      });
      self.refresh();
    },
    refresh: function() {
      var self = this;
      $.get(mmUrl + "activity/MysteriousTrader/", {}, function(data) {
        $('#trader').html(data);
        self.dialog_Box("popMysteriousTrader");
        $('#trader .btn_bid').click(function() {
          self.bid();
        });
      });
      if (self.i == 0) {
        setTimeout(self.refresh, 1000);
      }
      if ($('#trader').html() != null) {
        setTimeout(self.refresh, 1000);
      }
      self.i = self.i + 1;
    },
    bid: function() {
      var self = this;
      $.ajax({
        type: "GET",
        url: apiUrl + "promotion/Bid",
        //固定格式
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.success == 200) {
            $('#buysuccess').show();
            setTimeout(function() {
              $('#buysuccess').hide();
            }, 6000);
          } else if (data.success == -3) {
            $('#entitled').html('您没有购买资格!');
            var wishSuccess = dialog({
              title: ' ',
              content: $('#buytipsStatusInner').html(),
              quickClose: false, //点击空白处快速关闭
              skin: 'dialogBluebgGames'
            });
            wishSuccess.show();
            $('.dialogBluebgGames .ui-dialog-title').html('');
            $('.dialogBluebgGames .ui-dialog-close').text('');
          } else if (data.success == -1) {
            $('#difference').text(data.result.difference);
            var wishSuccess = dialog({
              title: ' ',
              content: $('#buytipsStatusInner').html(),
              quickClose: false, //点击空白处快速关闭
              skin: 'dialogBluebgGames'
            });
            wishSuccess.show();
            $('.dialogBluebgGames .ui-dialog-title').html('');
            $('.dialogBluebgGames .ui-dialog-close').text('');
          }
          self.refresh();
        }
      });
    },
    // 星座
    openConstellAtion: function(e) {
      e.preventDefault();
      this.module('constellation', function(constellation) {
        if (constellation) {
          constellation.show();
        }
      });
    },
    //许愿瓶
    openBottle: function(e) {
      e.preventDefault();
      var self = this;
      var handler = function() {
        self.module('bottle', function(bottle) {
          if (bottle) {
            bottle.show();
          }
        });
      };
      if (userInfo.get('isLogin')) {
        handler();
      } else {
        this.module('sign', function(module) {
          module.showSignModel('sign', function() {
            handler();
          });
        });
      }

    },
    openpersiashop: function(e) {
      e.preventDefault();
      this.module('persiashop', function(persiashop) {
        if (persiashop) {
          persiashop.show();
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
    openLadyNotice: function() {
      this.module('squarenotice', function(squarenotice) {
        if (squarenotice) {
          squarenotice.ReportContShow();
        }
      });
    },
    openRankingList: function() {
      this.module('rank', function(rank) {
        if (rank) {
          rank.show();
        }
      });
    }

  });
  return View;
});