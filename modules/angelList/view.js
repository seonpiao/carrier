define(["libs/client/views/base", "models/angelList", "models/userInfo"], function(Base, angelList, userInfo) {
  var View = Base.extend({
    moduleName: "angelList",
    template: 'index',
    events: {
      'click #angelBuying': 'showAngelBuying', //天使购买
      'click #angelBe': 'showAngelBuying', //天使购买
      'mouseenter li': 'showFullnameTip',
      'mouseleave li': 'hideFullnameTip'
    },
    init: function() {
      this.listenTo(angelList, 'sync', this.render.bind(this));
      this.listenTo(userInfo, 'change:username', this.render.bind(this));
      angelList.fetch();
    },
    render: function() {
      var self = this;
      var data = angelList.toJSON();
      this.loadTemplate('index', function(template) {
        $('.angel-list').html(template(data));
        globalUtil.resetScrollbar('scrollbar1', 128, '');
        $('#angelBuying .angelTotal').text(data.result.allcount);
        if (userInfo.get('usrangel') == 0 || !userInfo.get('usrangel')) {
          $('#angelBe').css('display', 'inline-block');
        }
      });
    },
    showFullnameTip: function(e) {
      var target = e.currentTarget;
      this.hideFullnameTip();
      this.d = dialog({
        skin: 'tipGames',
        content: $(target).attr('data-name'),
        coexist: true
      });
      this.d.show(target);
      var self = this;
      clearTimeout(this._closeTimer);
      this._closeTimer = setTimeout(function() {
        self.hideFullnameTip();
      }, 3000);
    },
    hideFullnameTip: function() {
      if (this.d) {
        this.d.close().remove();
        this.d = null;
      }
    },
    showAngelBuying: function(e) {
      e.preventDefault();
      var self = this;
      var usrinfo = globalUtil.userInfo
      if (usrinfo && usrinfo.usrnick) {
        self.doAngelBuying();
      } else {
        this.module('sign', function(module) {
          if (module) {
            module.showSignModel('login', self.doAngelBuying.bind(self));
          }
        });
      }

    },
    doAngelBuying: function() {
      var self = this;
      self.loadTemplate('angel-pop', function(template) {
        $.ajax({
          type: "GET",
          url: apiUrl + "activity/vipBuy/",
          //固定格式
          dataType: "jsonp",
          cache: false,
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              var result = data.result;
              html = template(result);
              var angelPop = dialog({
                id: 'angelBuying',
                title: '天使购买',
                content: html,
                quickClose: false, // 点击空白处快速关闭
                skin: 'angelPop',
                width: 765,
                height: 338
              });
              angelPop.show();

              var exchangeBtn = $('.exchange-btn');
              exchangeBtn.on('click', function() {
                self.callExchange();
              });
              var cancelBtn = $('.cancel-btn');
              cancelBtn.on('click', function() {
                angelPop.close().remove();
              });
              $('.angelSilver,.angelGold').mouseenter(function() {
                $(this).addClass('hover');
              }).mouseleave(function() {
                $(this).removeClass('hover');
              });
              $('.angelPop .ui-dialog-title').html('<span class=""></span>');
              $('#angelPopInner').attr('data-module', 'angel');
            }
          }
        });
      });
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