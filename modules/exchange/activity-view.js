define(["modules/exchange/view"], function(Base) {
  var View = Base.extend({
    moduleName: "exchange",
    template: 'index',
    init: function() {
      Base.prototype.init.apply(this, arguments);
      var self = this;
      $('.btnExchangeCode').click(function() {
        self.checkExchange();
      });
    },
    checkExchange: function() {
      var self = this;
      var errMsgTip = $('.RechangeRec_error');
      var exchangeCode = $('#exchange-code-input');
      var handler = function(data, resp) {
        if (resp['success'] && resp['success'] == 200) {
          self.showSuccessDialog(resp['result']);
        } else {
          var errorCode = resp['error_code'];
          if (errorCode == 2008031) {
            errMsgTip.html('兑换码错误，请重试');
            exchangeCode.select();
          } else if (errorCode == 2008033) {
            errMsgTip.html('兑换码已使用，请重试');
            exchangeCode.select();
          } else if (errorCode == 2008035) {
            errMsgTip.html('兑换码已过期，请重试');
            exchangeCode.select();
          } else if (errorCode == 2009001) {
            errMsgTip.html(' ');
            // 赶紧去拉起登陆框
            self.module('sign', function(module) {
              if (module) {
                module.showSignModel('login', function() {});
              }
            });
          }
        }
      };
      self.listenToOnce(self.exchange, 'sync', handler);
      var code = exchangeCode.val();
      if (code && code.length > 0) {
        self.exchange.fetch({
          data: {
            code: code
          }
        });
      } else {
        errMsgTip.html('请输入您的兑换码...');
      }
    }
  });
  return View;
});