define(["libs/client/views/base", "models/bottle", "models/taskList", "models/userFund", "libs/client/moment", "libs/client/countdown"], function(Base, bottle, taskList, userFund, MOMENT, countdown) {
  var View = Base.extend({
    moduleName: "bottle",
    events: {
      'click #oneCoidWish': 'popWish',
      'click #tenCoinWish': 'popWish',
      'click #oneDimWish': 'popWish',
      'click #tenDimWish': 'popWish'
    },
    init: function() {
      $(window).on('quicklink.wishbottlePopwin', this.show.bind(this));
    },
    wishListId: new Array(),
    wishListContent: new Array(),
    show: function() {
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            self.initBottleD();
            bottle.fetch();
          });
        }
      });
      return this;
    },
    d: null,
    initBottleD: function(model, resp) { //one显示
      if (dialog.getCurrent()) {
        dialog.getCurrent().remove();
      }
      this.d = dialog({
        id: 'bottle-dialog',
        title: ' ',
        content: '',
        width: 386,
        height: 328,
        quickClose: false, //点击空白处快速关闭
        skin: 'bottleGames bottleGames_big'
      });
      //this.d.get('bottle-dialog');
      this.d.addEventListener('close', this.remove.bind(this));
      //让view来管理dialog的元素
      this.setElement(this.d.__popup);
      this.listenTo(bottle, 'sync', this.init_getWishBottleInfo.bind(this));
      // $('#popWindow').css({
      //   top: '300px',
      //   left: '300px',
      //   position: 'fixed'
      // });
      // this.d.show(document.getElementById('popWindow'));
      this.d.show();
      $('.bottleGames .ui-dialog-title').html('');
      $('.bottleGames .ui-dialog-close').text('');
    },
    init_getWishBottleInfo: function() { //出题瓶基础信息显示
      var self = this;
      this.loadTemplate('index', function(template) {
        var data = bottle.toJSON();
        self.d.content(template(data));
        if (data.success == 200) {

          // wishCd => ’’, 出题开启倒计时 countdown
          // wishCdType => ’’, 倒计时类型 1:秒2:分钟3:小时（暂定）
          // coinCd => ’’, 金币出题免费倒计时（hh:ii:ss）
          // diamondCd => ’’, 钻石出题免费倒计时（hh:ii:ss）
          // oneWishCoin => ’’, 一次金币出题价格
          // tenWishCoin => ’’, 十次金币出题价格
          // oneWishDia => ’’, 一次钻石出题价格
          // tenWishDia => ’’ 十次钻石出题价格

          var result = data.result;
          var wishCd = result.wishCd;
          // var wishCd = 3 * 60 * 60;
          var wishCdType = result.wishCdType;
          var coinCd = result.coinCd;
          // var coinCd = 5;
          var diamondCd = result.diamondCd;
          // var diamondCd = 3;
          var oneWishCoin = result.oneWishCoin;
          var tenWishCoin = result.tenWishCoin;
          var oneWishDia = result.oneWishDia;
          var tenWishDia = result.tenWishDia;

          if (oneWishCoin == 0) {
            $("#goldPrice").html("免费");
            $("#goldPrice").removeClass('gold_img');
          } else {
            $("#goldPrice").html(oneWishCoin);
          }
          if (oneWishDia == 0) {
            $("#diaPrice").html("免费");
            $("#diaPrice").removeClass("diamond_img");
          } else {
            $("#diaPrice").html(oneWishDia);
          }
          if (tenWishCoin == 0) {
            $("#TgoldPrice").html("免费");
            $("#TgoldPrice").removeClass('gold_img');
          } else {
            $("#TgoldPrice").html(tenWishCoin);
          }
          if (tenWishDia == 0) {
            $("#TdiaPrice").html("免费");
            $("#diaPrice").removeClass("diamond_img");
          } else {
            $("#TdiaPrice").html(tenWishDia);
          }
          // $("#wishCd").html(wishCd);
          // $("#coinCd").html(coinCd);
          // $("#diamondCd").html(diamondCd);
          // days: 0
          // hours: 3
          // millisec: 51.99999999967986
          // min: 57
          // sec: 56
          // years: 0
          self.startCountdown($('#wishCd'), wishCd, function() {
              $('#with-price-value').attr('data-value', 0);
            })
            //, function(data) {
            //var hours = data.hours;
            // if (hours <= 2) {
            //   $(".bottleimg").removeClass().addClass("bottle_b_4");
            //   $(".bottle-simg").removeClass().addClass("bottle_s_4");
            // } else if (hours <= 8) {
            //   $(".bottleimg").removeClass().addClass("bottle_b_3");
            //   $(".bottle-simg").removeClass().addClass("bottle_s_3");
            // } else if (hours <= 16) {
            //   $(".bottleimg").removeClass().addClass("bottle_b_2");
            //   $(".bottle-simg").removeClass().addClass("bottle_s_2");
            // } else {
            //   $(".bottleimg").removeClass().addClass("bottle_b_1");
            //   $(".bottle-simg").removeClass().addClass("bottle_s_1");
            // }
            //});
          self.startCountdown($('#coinCd'), coinCd, function() {
            $('.gold_wish .wish-time-tip').css('visibility', 'hidden');
            $("#goldPrice").html("免费");
            self.coinFinished = true;
          }, function() {});
          self.startCountdown($('#diamondCd'), diamondCd, function() {
            $('.diamond_wish .wish-time-tip').css('visibility', 'hidden');
            $("#diaPrice").html("免费");
            self.diamondFinished = true;
          }, function() {});
          $.each(result.wishes, function(n, value) {
            self.wishListId[n] = value.wishId;
            self.wishListContent[n] = value.content;
          });
        } else {
          var errCode = data.error_code;
          if (errCode == '2009001') { // have not login
            self.module('sign', function(module) {
              if (module) {
                module.showSignModel('login', function() {

                });
              }
            });
          }
        }
      });

    },
    wishBottle_timerTotal: function(timeLast, timerType) { //定时器
      var self = this;
      if ($("#" + timerType + ":visible").length < 1) {
        return;
      };
      if (timeLast == null || timerType == null)
        return;
      if (timeLast > 0) {

        $("#" + timerType).html(parseInt(timeLast / 3600) + ":" + parseInt((timeLast - (parseInt(timeLast / 3600) * 3600)) / 60) + ":" + Number(parseInt(timeLast % 60 / 10)).toString() + (timeLast % 10));
        --timeLast;

        setTimeout("self.wishBottle_timerTotal(" + timeLast + ",'" + timerType + "')", 1000);


      } else if (timeLast == 0) {

      } else {
        timeLast = 0;
      }

    },
    startCountdown: function($el, countdown, callback, progress) {
      var endTime = moment().add(countdown, 'seconds');
      $el.countdown({
        date: endTime.toDate(),
        onEnd: callback,
        render: function(data) {
          var html = '';
          if (data.hours > 0) {
            if (countdown > 86400 && countdown < 172800) {
              data.hours += parseInt(countdown / 86400, 10) * 24;
            }
            html += data.hours + ':';
          }
          html += this.leadingZeros(data.min, 2)
          html += ':' + this.leadingZeros(data.sec, 2)
          $el.html(html);
          if (progress) {
            progress(data);
          }
        }
      });
    },
    wishBottle_timer: function(timeLast, timerType) {
      var self = this;
      if ($("#" + timerType + ":visible").length < 1) {
        return;
      };
      if (timeLast == null || timerType == null)
        return;
      if (timeLast > 0) {

        $("#" + timerType).html(parseInt(timeLast / 3600) + ":" + parseInt((timeLast - (parseInt(timeLast / 3600) * 3600)) / 60) + ":" + Number(parseInt(timeLast % 60 / 10)).toString() + (timeLast % 10));
        --timeLast;
        setTimeout("self.wishBottle_timer(" + timeLast + ",'" + timerType + "')", 1000);


      } else if (timeLast == 0) {

      } else {
        timeLast = 0;
      }
    },
    popWish: function(e, type) { //点击出题按钮弹出相关信息
      this.d.close().remove();
      var typeS = $(e.target).attr("id");
      var self = this;
      if (typeS == "oneCoidWish" || typeS == "tenCoinWish") {
        //金币出题
        this.loadTemplate('coidwish', function(template) {
          if (dialog.getCurrent()) {
            dialog.getCurrent().remove();
          }
          this.d = dialog({
            title: ' ',
            content: '',
            quickClose: false, //点击空白处快速关闭
            skin: 'bottleGames Coidwish_Dialog'
          });
          var data = bottle.toJSON();
          this.d.content(template(data));
          d.show();
          self.init_wishPop(e, type, data);
          $('.bottleGames .ui-dialog-title').html('');
          $('.bottleGames .ui-dialog-close').text('');
        })
      } else if (typeS == "oneDimWish" || typeS == "tenDimWish") {
        this.loadTemplate('DiwWish', function(template) {
          if (dialog.getCurrent()) {
            dialog.getCurrent().remove();
          }
          this.d = dialog({
            title: ' ',
            content: '',
            quickClose: false, //点击空白处快速关闭
            skin: 'bottleGames Dimwish_Dialog'
          });
          var data = bottle.toJSON();

          this.d.content(template(data));
          d.show();
          self.init_wishDimPop(e, type, data);
          $('.bottleGames .ui-dialog-title').html('');
          $('.bottleGames .ui-dialog-close').text('');
        })
      }
    },
    init_wishPop: function(e, type, data) { //金币相关信息
      var type = $(e.target).attr("id");
      var self = this;
      // self.coinFinished = false;
      $("#gwContent1").html(self.wishListContent[0]);
      $("#gwContent2").html(self.wishListContent[1]);
      $("#gwContent3").html(self.wishListContent[2]);
      $("#gwContent4").html(self.wishListContent[3]);
      $("#wishId").val(this.wishListId[0]);
      $("#wishId").attr('data-content', this.wishListContent[0]);
      $('.gwradio').click(function() {
        $(this).addClass("on").siblings().removeClass("on");
        var wishIndex = $(this).index();
        $("#wishId").val(self.wishListId[wishIndex]);
        $("#wishId").attr('data-content', self.wishListContent[wishIndex]);
      });

      var oneWishCoin = data.result.oneWishCoin;
      var tenWishCoin = data.result.tenWishCoin;
      var priceValue;
      var priceValueText;
      var gwbtnstr;
      if (type == "oneCoidWish") {
        if (oneWishCoin == 0 || self.coinFinished) {
          priceValueText = "免费";
          priceValue = 0;
        } else {
          priceValueText = oneWishCoin;
          priceValue = oneWishCoin;
        }
        var gwbtnstr = '<a href="javascript:;" class="btn_1y w160" id="oneCoinWish">' + '出题1次：<img src="' + window.resUrl + 'orig/images/bottle/gold_img.png" id="coinPrice"/><span id="with-price-value" data-value="' + priceValue + '">' + priceValueText + '</span></a>'
        $("#gwButton").html(gwbtnstr);
        $('#gwButton a').click(function(e) {
          self.initWish(e);
        });
      } else if (type == "tenCoinWish") {
        priceValue = tenWishCoin;
        var gwbtnstr = '<a href="javascript:;" class="btn_1y w160" id="tenCoinWish">' + '出题1次：<img src="' + window.resUrl + 'orig/images/bottle/gold_img.png" id="coinPrice"/><span id="with-price-value" data-value="' + priceValue + '">' + priceValue + '</span></a>'
        $("#gwButton").html(gwbtnstr);
        $('#gwButton a').click(function(e) {
          self.initWish(e);
        })
      }

    },
    init_wishDimPop: function(e, type, data) { //钻石相关信息
      var type = $(e.target).attr("id");
      var self = this;
      // self.diamondFinished = false;
      $("#dwContent1").html(self.wishListContent[0]);
      $("#dwContent2").html(self.wishListContent[1]);
      $("#dwContent3").html(self.wishListContent[2]);
      $("#dwContent4").html(self.wishListContent[3]);
      $("#wishId").val(self.wishListId[0]);
      $('#wishId').attr('data-content', self.wishListContent[0]);

      //增加输入框处理
      $("#inputwish").bind({
        focus: function() {
          $(this).addClass("on").siblings().removeClass("on");
          if (this.value == this.defaultValue) {
            this.value = "";
          }
        },
        blur: function() {
          if (this.value == "") {
            this.value = this.defaultValue;

          }
        }
      });

      //处理假video
      $('.dwradio').click(function(e) {
        $(this).addClass("on").siblings().removeClass("on");
        var wishIndex = $(this).index();
        $("#wishId").val(self.wishListId[wishIndex]);
        $('#wishId').attr('data-content', self.wishListContent[wishIndex]);
      });
      var priceValueText;
      var priceValue;
      var oneWishDia = data.result.oneWishDia;
      var tenWishDia = data.result.tenWishDia;
      var gwdiastr;
      if (type == "oneDimWish") {

        if (oneWishDia == 0 || self.diamondFinished) {
          priceValueText = "免费";
          priceValue = 0;
        } else {
          priceValueText = oneWishDia;
          priceValue = oneWishDia;
        }
        var gwdiastr = '<a href="javascript:;" class="btn_1y w160" id="oneDimWish">' + '出题1次：<img src="' + window.resUrl + 'orig/images/bottle/blue_drill.png" id="dimPrice"/><span id="with-price-value" data-value="' + priceValue + '">' + priceValueText + '</span></a>'
        $("#dwButton").html(gwdiastr);
        $('#dwButton a').click(function(e) {
          self.initWish(e);
        });

      } else if (type == "tenDimWish") {
        priceValue = tenWishDia;
        var gwdiastr = '<a href="javascript:;" class="btn_1y w160" id="tenDimWish">' + '出题1次：<img src="' + window.resUrl + 'orig/images/bottle/blue_drill.png" id="dimPrice"/><span id="with-price-value" data-value="' + priceValue + '">' + priceValue + '</span></a>'
        $("#dwButton").html(gwdiastr);
        $('#dwButton a').click(function(e) {
          self.initWish(e);
        });
      }

    },
    initWish: function(e, wishType, data) {
      var self = this;
      var errorCode1 = "您还没有出题";
      var errorCode2 = "穷逼，你钱不够";
      var errorCode3 = "现在不是免费了";
      var typeS = $(e.currentTarget).attr("id");
      var wish = $("#wishId").val();
      //提取愿望并验证
      var inputWish = $("#wishId").attr('data-content');
      //金币出题
      if (typeS.indexOf("Coin") >= 0) {
        if (wish == null) {
          $("#error").html(errorCode1);
          return;
        } else {
          var wishType;
          if (typeS.indexOf("one") >= 0) {
            wishType = 1;
          } else {
            wishType = 2;
          }
        }

      } else {
        //钻石出题
        if (wish == null && (inputWish == null || inputWish == "" || inputWish == "请出题^-^")) {
          $("#error").html(errorCode1);
          return;
        } else {
          if (wish == null) {
            wish = "";
            inputWish = $("#inputwish").val();
          }
          if (inputWish == null) {
            inputWish = "";
          }

          var wishType;
          if (typeS.indexOf("one") >= 0) {
            wishType = 3;
          } else {
            wishType = 4;
          }
        }
      }
      $.ajax({
        type: "GET",
        url: apiUrl + "wish/makeaWish",
        data: {
          wishId: wish,
          girlId: window.girlid,
          wishType: wishType,
          selfWish: inputWish
        },
        cache: false,
        dataType: "jsonp",
        jsonp: "jsonpCallback",
        success: function(data) {
          var bidtype = typeS.indexOf("Coin") >= 0 ? 1 : 2;
          if (data.status == 200) {
            self.popLuckWindow(data, wishType);
            if (bidtype == 1) {
              self.coinFinished = false;
            } else if (bidtype == 2) {
              self.diamondFinished = false;
            }
            taskList.fetch();
            userFund.fetch();
          } else {
            var errCode = data.error_code;
            if (errCode == '2008011') {
              self.module('insufficient', function(module) {
                if (module) {
                  module.show({
                    bidtype: bidtype,
                    price: $('#with-price-value').attr('data-value'),
                    name: '出题',
                    quality: 1
                  });
                  self.d.close();
                }
              });
            }
          }
        }
      });
    },
    popLuckWindow: function(data, luckType) {
      var self = this;
      $(".bottleGames").parent().remove();
      var self = this;
      var result = data.result;
      if (result.length <= 0) {
        //sb没抽到东西
        if ($("#lucktitle").length > 0) {

        } else {
          //调用浮层html
          this.loadTemplate('wishbottlefail', function(template) {
            this.d = dialog({
              title: ' ',
              content: '',
              quickClose: false, //点击空白处快速关闭
              skin: 'dialogGames getaward_dialog'
            });
            this.d.content(template);
            this.d.show();
            $('.bottleGames .ui-dialog-title').html('');
            $('.bottleGames .ui-dialog-close').text('');

          });

        }
        //调用层结束 

      } else {
        //有所斩获
        //调用层开始
        if ($("#lucktitle").length > 0) {

        } else {
          //调用浮层html
          this.loadTemplate('wishbottlesuccess', function(template) {
            this.d = dialog({
              title: ' ',
              content: '',
              quickClose: false, //点击空白处快速关闭
              skin: 'dialogGames getaward_dialog'
            });
            this.d.content(template(data));
            var htmlTag;
            htmlTag == "";
            for (var i = 0; i < result.length; i++) {
              htmlTag = "<li><img src=\"" +
                resUrl + '/item/' +
                result[i].itemid +
                "/50\"  alt=\"" +
                result[i].name +
                "\" title=\"" +
                result[i].name +
                "  " +
                result[i].num +
                "个\" />";
              //alert(htmlTag);
              $("#luckresult9999").append(htmlTag);


              if (i == 4) {
                $("#luckresult").append("</br>");
              }
            }
            var htmlButton;

            if (luckType == 1) {
              htmlButton = "<a class=\"fl ml_15  w90 btn_1y\" href=\"#\" id=\"" +
                "oneCoidWish" +
                "\">再来一次</a>";

              //金币单次

            } else if (luckType == 2) {
              //金币十次
              htmlButton = "<a class=\"fl ml_15  w90 btn_1y\" href=\"#\" id=\"" +
                "tenCoinWish" +
                "\">再来十次</a>";
            } else if (luckType == 3) {
              //钻石一次

              htmlButton = "<a class=\"fl ml_15  w90 btn_1y\" href=\"#\"  id=\"" +
                "oneDimWish" +
                "\">再来一次</a>";
            } else if (luckType == 4) {
              //钻石十次

              htmlButton = "<a class=\"fl ml_15  w90 btn_1y\" href=\"#\"  id=\"" +
                "tenDimWish" +
                "\">再来十次</a>";

            }
            $("#againButton").html(htmlButton);
            $("#againButton a").click(function(e, type) {
              self.popWish(e, type);
            });
            //调用层结束
            this.d.show();
            $("#againokbtn").click(function() {
              self.closepop();
            });
            $('.bottleGames .ui-dialog-title').html('');
            $('.bottleGames .ui-dialog-close').text('');

          });
        }

      }
    },
    closepop: function() {
      $(".dialogGames").remove();
    }

  });
  return View;
});