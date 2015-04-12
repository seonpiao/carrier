define(["libs/client/views/base", 'models/exchange', 'models/userInfo', 'models/angelList'], function(Base, exchange, userInfo, angelList) {
  var View = Base.extend({
    moduleName: "exchange",
    template: 'index',
    events: {},
    init: function() {
      // this.render();
      $('input, textarea').placeholder();
      this.exchange = exchange;
    },
    checkExchange: function() {
      var errMsgTip = $('.RechangeRec_error');
      var handler = function(data, resp) {
        if (resp['success'] && resp['success'] == 200) {
          this.showSuccessDialog(resp['result']);
        } else {
          var errorCode = resp['error_code'];
          if (errorCode == 2008031) {
            errMsgTip.html('兑换码错误，请重试');
            $('.exchange-code').select();
          } else if (errorCode == 2008033) {
            errMsgTip.html('兑换码已使用，请重试');
            $('.exchange-code').select();
          } else if (errorCode == 2008035) {
            errMsgTip.html('兑换码已过期，请重试');
            $('.exchange-code').select();
          } else if (errorCode == 2009001) {
            errMsgTip.html(' ');
            // 赶紧去拉起登陆框
            this.module('sign', function(module) {
              if (module) {
                module.showSignModel('login', function() {});
              }
            });
          }
        }
      };
      this.listenToOnce(exchange, 'sync', handler);
      var code = $('.exchange-code').val();
      if (code && code.length > 0) {
        exchange.fetch({
          data: {
            code: code
          }
        });
      } else {
        errMsgTip.html('请输入您的兑换码...');
      }
    },
    showExchangeDialog: function() {
      // 当点击充值等一大批按钮的时候出现，由充值模块自己调用
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            self.loadTemplate('index', function(tempalte) {
              var html = tempalte();
              if (dialog.getCurrent()) {
                dialog.getCurrent().remove();
              }
              var exchangeDialog = dialog({
                title: ' ',
                content: html,
                height: 340,
                quickClose: false, //点击空白处快速关闭
                skin: 'dialogGames exchange_dialog'
              });
              exchangeDialog.show();
              $('.dialogGames .ui-dialog-title').html('');
              $('.dialogGames .ui-dialog-close').text('');
              var exchangeBtn = $('.exchange-btn');
              exchangeBtn.on('click', function() {
                self.checkExchange();
              });
            });
          });
        }
      });
    },
    showSuccessDialog: function(result) {
      var self = this;
      // 如果是兑换码类型为背包，所以背包需要闪一闪
      if (result.type == 'usrpack') {
        globalUtil.pkgNew();
        globalUtil.lightpkgNew();
      }
      var getGiftInfo = function(type, value, name) {
        var config = {
          diamond: {
            type: '',
            value: value
          },
          usrvip: { // 开通
            type: 'VIP',
            value: ''
          },
          usrangel: { // 开通
            type: '天使',
            value: {
              1: '白银',
              2: '黄金'
            }
          },
          usrpack: {
            type: '',
            value: value
          }
        };

        var tip;
        if (type == 'usrpack') {
          tip = name;
        } else {
          if (typeof config[type]['value'] == 'object') {
            tip = config[type]['value'][value] + config[type]['type'];
          } else {
            tip = config[type]['value'] + config[type]['type'];
          }
        }
        var preTip = '您获得了';
        if (type == 'usrvip' || type == 'usrangel') {
          preTip = '您开通了';
        }
        return {
          klass: (type == 'diamond' || type == 'usrvip') ? type : type + value,
          preTip: preTip,
          tip: tip
        };
      };
      this.loadTemplate('exchange-suc', function(tempalte) {
        var html = tempalte();
        if (dialog.getCurrent()) {
          dialog.getCurrent().remove();
        }
        var successDialog = dialog({
          title: ' ',
          content: html,
          width: 270,
          height: 180,
          quickClose: false, //点击空白处快速关闭
          skin: 'dialogBluebgGames'
        });
        successDialog.show();
        $('.dialogBluebgGames .ui-dialog-title').html('');
        $('.dialogBluebgGames .ui-dialog-close').text('');
        var giftInfo = getGiftInfo(result.type, result.value, result.name);
        var giftResult = $('.gift_result');
        giftResult.html(giftInfo.tip);
        giftResult.addClass(giftInfo.klass)
        giftResult.prev().html(giftInfo.preTip);

        $('.conform-btn').click(function() {
          successDialog.remove();
        });
        self.follow();
      });
    },
    follow: function() {
      userInfo.fetch();
      angelList.fetch();
    }
  });
  return View;
});