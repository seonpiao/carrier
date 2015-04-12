define(["libs/client/views/base", 'models/userFund'], function(Base, userFund) {
  var View = Base.extend({
    moduleName: "insufficient",
    show: function(options) {
      var self = this;
      this.loadTemplate('index', function(template) {
        userFund.cache(function() {

        });
        var currDialog = dialog.getCurrent();
        if (currDialog) {
          currDialog.remove();
        }
        self.d = dialog({
          title: ' ',
          content: '',
          quickClose: false, //点击空白处快速关闭
          skin: 'bottleGames gbuytips_box'
        });
        var has = options.bidtype == '1' ? (userFund.get('coin') * 1) : ((userFund.get('diamond') * 1 + userFund.get('bind_diamond') * 1));
        var price = options.price;
        var name = options.name;
        var quality = options.quality || '1';
        var diff = price - has;
        self.d.content(template({
          bidtype: options.bidtype,
          id: options.id,
          diff: diff,
          name: name,
          quality: quality
        }));
        self.d.show();
        self.d.addEventListener('close', self.d.remove.bind(self.d));
        self.d._popup.find('.ui-dialog-close').html('');
        // var buystr = "";
        // var chadiamondNum = diamondNum - nowuserdiamond;
        // buystr = '<p class="cl yellow_2 mt_15">' + '您购买<span class="white"><img src="' + window.resUrl + 'orig/images/prop_icon/now1.png" />x' + coinNum + '<i class="yellow_2">还差：</i ></span></br>' + '<span class="red ml_35 mt_5"><img src="' + window.resUrl + 'orig/images/prop_icon/blue_drill.png" />' + chadiamondNum + '</span>' + '</p>'
        // $(".gbuytips_box .buytips_words").append(buystr);
        $('.gbuytips_box .ui-dialog-title').html('');
        $('.gbuytips_box .ui-dialog-close').text('');
        $('#ecchange-now').click(function() {
          self.callExchange();
        });
      })
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