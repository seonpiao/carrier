define(["libs/client/views/base", "models/pkg.js", "models/userVitality", "models/userIntimacy", "models/userInfo", "models/userFund", "models/girl", "models/girlList", "models/useItem"], function(Base, pkg, userVitality, userIntimacy, userInfo, userFund, girl, girlList, UseItem) {
  var View = Base.extend({
    moduleName: "pkg",
    events: {
      'mouseleave .pkg-dialog-inner': 'clearDialog',
      'click .pkg-item-list .pkg-item img': 'itemHandle',
      'mouseenter .pkg-item-list .pkg-item img': 'itemInfo',
      'mouseleave .pkg-item-list .pkg-item img': 'hideAll',
      'click .pkg-girl-list .pkg-girl': 'selectGirl',
      'click .pkg-girl-gift-list a': 'selectGirlGift',
      'click .multisendBtn': 'showMultiSendDialog',
      'click .sendBtn': 'showSendDialog',
      'click .useBtn': 'doUse',
      'click .useallBtn': 'doUse',
      'click .pkg_btn_1y': 'doSend'
    },
    init: function() {
      var self = this;
      $(window).on('quicklink.openUsrPack_1000000454', function() {
        self.initPkg();
      });
      this.listenTo(userInfo, 'change:username', function() {
        if (self.d && !userInfo.get('username')) {
          self.d.close().remove();
        }
      });
    },
    render: function() {
      this.loadTemplate('index', function(template) {
        var data = pkg.toJSON();
        self.$('.overview').html(template(data));
      });
    },
    initPkg: function() {
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            var currDialog = dialog.getCurrent();
            if (currDialog) {
              //此处为临时方案，后续还是需要为对话框做统一包装
              currDialog.close().remove();
            }
            self.listenTo(pkg, 'sync', self.refreshItemList.bind(self));
            self.d = dialog({
              id: 'pkg-dialog-on',
              title: ' ',
              content: '',
              quickClose: false, //点击空白处快速关闭
              width: 262,
              padding: 0,
              autofocus: true,
              skin: 'pkg-dialog'
            });
            self.d.addEventListener('close', self.remove.bind(self));
            //让view来管理dialog的元素
            self.setElement(self.d.__popup);
            self.show();
            pkg.fetch();
          });
        }
      });
    },
    show: function() {
      this.d.show();
      // this.refreshItemList();
      globalUtil.stopBling($('#unpack'), globalUtil.pkgNewTimer);
      $('.pkg-dialog .ui-dialog-title').html('<span class="pkg-tit-icon"></span>');
      $('.pkg-dialog .ui-dialog-close').html('');
      return this;
    },
    clearDialog: function() {
      $('.pkg-item-btns').remove();
      $('.pkg-item-detail').remove();
      this.detailTimer = null;
    },
    clearAll: function() {
      this.clearDialog();
      if (this.sendDialog) {
        this.sendDialog.close().remove();
      }
    },
    detailTimer: null,
    showGirlList: function() {
      var list = girlList.toJSON();
      var sendStr = '<h3>要送给哪位选手？</h3>' + '<div class="pkg-girl-list cl ' + (girlid && girlid != 0 ? 'linebtm' : '') + '">';
      for (var i = 0, l = list.length; i < l; i++) {
        var item = list[i];
        sendStr += '<div class="pkg-girl" girlid="' + item.id + '"><img src="' + window.resUrl + 'girl/' +
          item.id + '/50" style="width: 55px;"><div class="pkg-girl-name">' + item.name + '</div></div>';
      }
      sendStr += '</div>';
      return sendStr;
    },
    selectGirl: function(e) {
      var obj = $(e.target);
      if (!obj.hasClass('curr')) {
        obj.addClass('curr').siblings('.pkg-girl').removeClass('curr');
      }
    },
    selectGirlGift: function(e) {
      var tdiv = $(e.target);
      if (!tdiv.hasClass('hover')) {
        tdiv.addClass('hover').siblings('a').removeClass('hover');
        var dd = tdiv.parent().find('.giftText');
        dd.html(tdiv.attr('desc'));
      }
    },
    sendDialog: null,
    showItemNumList: function(itemid) {
      var tObj = this.itemList2[itemid];
      var numStr = '';
      if (tObj.num >= 24) {
        numStr += '<div class="pkg-girl-gift-list cl" style="padding-bottom:0;padding-top:5px;">' + '<a href="javascript:;" class="girlGift1 hover" desc="送24个：每分每秒" num="24"><span class="giftIcon"><i></i></span></a>'
        if (tObj.num >= 99) {
          numStr += '<a href="javascript:;" class="girlGift2" desc="送99个：长长久久" num="99"><span class="giftIcon"><i></i></span></a>'
        }
        if (tObj.num >= 365) {
          numStr += '<a href="javascript:;" class="girlGift3" desc="送365个：陪你每一天" num="365"><span class="giftIcon"><i></i></span></a>'
        }
        if (tObj.num >= 520) {
          numStr += '<a href="javascript:;" class="girlGift4" desc="送520个：我爱你" num="520"><span class="giftIcon"><i></i></span></a>'
        }
        if (tObj.num >= 1314) {
          numStr += '<a href="javascript:;" class="girlGift5" desc="送1314个：一生一世" num="1314"><span class="giftIcon"><i></i></span></a>'
        }
        numStr += '<p style="text-align:left;line-height:16px; text-align:center"><span class="giftText" style="">送24个：每分每秒</span></p>'
        numStr += '</div>'
      }
      return numStr;
    },
    showSendDialog: function(e) { //赠送
      var self = this;
      var tdiv = $('.pkg-item.currentItem');
      var itemid = tdiv.attr('itemid');
      var tObj = self.itemList2[itemid];

      if (girlid == 0 && $('.pkg-multisend').length == 0 && $('.pkg-send').length == 0) {
        var sendStr = '<div class="itemsend multisend cl">';
        sendStr += self.showGirlList();
        sendStr += '<div class="pgk-btns cl"></div>'
        sendStr += '</div>';
        self.sendDialog = dialog({
          id: 'pkg-send',
          title: ' ',
          content: sendStr,
          quickClose: false, //点击空白处快速关闭
          width: 300,
          padding: 0,
          parent: self.d.id,
          skin: 'pkg-dialog pkg-send'
        });
        self.sendDialog.show();
        self.clearDialog();
        $('<button>', {
          'class': 'w80 pkg_btn_1y',
          'itemid': itemid,
          'text': '赠  送',
          click: function(e) {
            self.doSend(e);
          }
        }).appendTo('.pkg-multisend .pgk-btns');



        $('.pkg-send').parent().css({
          'left': tdiv.offset().left + 35 + 'px',
          'top': tdiv.offset().top + 35 + 'px'
        });
        $('.pkg-send .ui-dialog-title').html('<span class="pkg-tit-icon"></span>');
        $('.pkg-send .ui-dialog-close').html('');

        $('.pkg-girl-list .pkg-girl').click(function() {
          if (!$(this).hasClass('curr')) {
            $(this).addClass('curr').siblings('.pkg-girl').removeClass('curr');
          }
        });
        $('.pkg-girl-gift-list a').click(function() {
          var tdiv = $(this);
          if (!tdiv.hasClass('hover')) {
            $(this).addClass('hover').siblings('a').removeClass('hover');
            var dd = tdiv.parent().find('.giftText');
            dd.html(tdiv.attr('desc'));
          }
        });
        $('.pkg-girl-list .pkg-girl').click(function(e) {
          var girlid = e.currentTarget.getAttribute('girlid');
          self.doUse(e, itemid, 'send', girlid, 1);
        });
      } else {
        self.doUse(e, itemid, 'send', girlid, 1);
      }
    },
    doSend: function(e, curGirlid) { //赠送
      var self = this;
      var odiv = $(e.target);
      var tdiv = $('.pkg-item.currentItem');
      var itemid = odiv.attr('itemid');
      var useType = odiv.attr('action');
      var thisGirlid = curGirlid || girlid;
      if (girlid && girlid == 0) { //square
        thisGirlid = $('.curr').attr('girlid');
      }
      var num = $('.pkg-girl-gift-list a.hover').attr('num');
      self.doUse(e, itemid, useType, thisGirlid, num);

    },
    showMultiSendDialog: function(e) { //批量赠送
      var curGirlid; // 用于保存广场页批量赠送的girlid
      var self = this;
      var odiv = $(e.target);
      var tdiv = $('.pkg-item.currentItem');
      var itemid = tdiv.attr('itemid');
      var useType = odiv.attr('action');
      var tObj = self.itemList2[itemid];
      var multiSendStr = '<div class="itemsend send cl">';
      if (girlid == 0) {
        multiSendStr += self.showGirlList(itemid);
      }
      multiSendStr += self.showItemNumList(itemid);
      multiSendStr += '<div class="pgk-btns cl" style="padding-top:0;"></div>'
      multiSendStr += '</div>'
      self.sendDialog = dialog({
        id: 'pkg-multisend',
        title: ' ',
        content: multiSendStr,
        quickClose: false, //点击空白处快速关闭
        width: 300,
        parent: self.d.id,
        padding: 0,
        skin: 'pkg-dialog pkg-multisend'
      });
      self.sendDialog.show();
      self.clearDialog();
      $('<button>', {
        'class': 'w80 pkg_btn_1y',
        'itemid': itemid,
        'text': '赠  送',
        click: function(e) {
          if (girlid == 0 && !curGirlid) {
            alert('请选择女神');
          } else {
            self.doSend(e, curGirlid);
          }
        }
      }).appendTo('.pkg-multisend .pgk-btns');
      if (!girlid) {
        // for 广场页，赠送默认按钮不可用
        $('.pgk-btns button').attr('disabled', 'disabled');
      }
      $('.pkg-dialog .ui-dialog-title').html('<span class="pkg-tit-icon"></span>');
      $('.pkg-dialog .ui-dialog-close').html('');
      $('.pkg-multisend').parent().css({
        'left': tdiv.offset().left + 35 + 'px',
        'top': tdiv.offset().top + 35 + 'px'
      });
      $('.pkg-girl-list .pkg-girl').click(function(e) {
        curGirlid = e.currentTarget.getAttribute('girlid');
        $('.pgk-btns button').removeAttr('disabled');
        if (!$(this).hasClass('curr')) {
          $(this).addClass('curr').siblings('.pkg-girl').removeClass('curr');
        }
      });
      $('.pkg-girl-gift-list a').click(function() {
        var tdiv = $(this);
        if (!tdiv.hasClass('hover')) {
          $(this).addClass('hover').siblings('a').removeClass('hover');
          var dd = tdiv.parent().find('.giftText');
          dd.html(tdiv.attr('desc'));
        }
      });
    },
    showUseDialog: function() { //使用
      var self = this;
      self.sendDialog = dialog({
        id: 'pkg-dialog-multisend',
        title: ' ',
        content: $('#pkg-dialog-multisend').html(),
        quickClose: false, //点击空白处快速关闭
        width: 298,
        padding: 0,
        parent: self.d.id,
        skin: 'pkg-dialog pkg-send'
      });
      self.sendDialog.show();
      self.clearDialog();
      $('.pkg-dialog .ui-dialog-title').html('<span class="pkg-tit-icon"></span>');
      $('.pkg-dialog .ui-dialog-close').html('');
    },
    doUse: function(e, itemid, useType, girlid, num) {
      //var tdiv = $(obj);
      var self = this;
      var odiv = $(e.target);
      num = num || odiv.attr('data-num');
      var tdiv = this.$currItem;
      var itemid = tdiv.attr('itemid');
      var useType = odiv.attr('action');
      var tObj = self.itemList2[itemid];
      var itemData = _.filter(pkg.toJSON().result || [], function(item) {
        return item.itemid === itemid;
      })[0];
      var useItem = new UseItem(itemData);
      useItem.set({
        actionType: 'buy'
      })
      useItem.once('error', function() {
        self.showErrorDialog('服务器打瞌睡了，请稍后重试～');
      });
      useItem.once('sync', function(model) {
        var data = model.toJSON();
        if (data.success == 200) {
          if (self.sendDialog) {
            self.sendDialog.close().remove();
          }
          pkg.fetch();
          userFund.fetch();
          userInfo.fetch();
          girl.fetch();
          var crit = model.get('result').crit * 1;
          if (crit > 1) {
            self.showCrit(model);
          } else {
            self.showUseDialog('pkg-success-' + useType);
          }
        }
        if (data.error_code == 2008012) {
          self.showErrorDialog('还没关注任何女神，先关注女神才能成为她的天使');
        }
        if (data.error_code == 2008001) {
          self.showErrorDialog('缺少女神id参数');
        }
        if (data.error_code == 2008002) {
          self.showErrorDialog('缺少物品id');
        }
        if (data.error_code == 2008004) {
          self.showErrorDialog('没有那么多道具啦');
        }
      });
      useItem.fetch({
        data: {
          itemid: itemid,
          girlid: girlid ? girlid : window.girlid,
          num: num ? num : 1
        }
      });
      self.clearDialog();
    },
    showCrit: function(model) {
      this.module('crit', 'pkg', function(crit) {
        if (crit) {
          crit.setModel(model);
          crit.show();
        }
      });
    },
    showErrorDialog: function(msg) {
      this.module('errmsg', function(module) {
        if (module) {
          module.show(msg);
        }
      });
      // $('.pkg-msg').css({
      //  'background': 'none',
      //  'border': 'none'
      // });
      this.clearDialog();
    },
    showUseDialog: function(style) {
      var self = this;
      var d = dialog({
        content: '<span class="' + style + '"></span>',
        parent: self.d.id,
        skin: 'pkg-msg'
      });
      d.show();
      $('.pkg-msg').css({
        'background': 'none',
        'border': 'none'
      });
      d._$('dialog').on('click', function() {
        d.close().remove();
      });
      setTimeout(function() {
        d.close().remove();
      }, 2000);
      self.clearDialog();
    },

    detailDialog: null,
    showItemDetail: function(i, obj) { //鼠标停留显示详细信息
      var self = this;
      var tid = obj.attr('itemid');
      //$('.pkg-item-btns').remove();
      if (self.currentItemIndex == i && $('.pkg-item-btns[itemid=' + tid + ']').length == 0 &&
        $('.pkg-multisend').length == 0 && $('.pkg-send').length == 0 &&
        $('.pkg-msg').length == 0) {
        var tObj = self.itemList2[tid];
        var left = obj.position().left + 55;
        var top = obj.position().top;
        var scroll = $('#itemListBar .overview').css('top');
        scrollTop = parseInt(scroll.substring(0, scroll.length - 2));
        var top0 = top + (scrollTop && scrollTop < 0 ? scrollTop : 0);
        self.clearDialog();
        userVitality.cache(function() {
          var str = '<div class="pkg-item-detail" style="top:' + top0 + 'px;left:' + left + 'px" itemid="' + tid + '"><div class="pkg-item-detail-inner"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div>' + '<p class="fb f14 itemlevel' + tObj.quality + '">' + tObj.name + '</p><p class="whiteText">' + (tObj.description || '') + '</p>' + (tObj.happybuf && tObj.happybuf > 0 ? '<p class="greenText">幸福度：<span class="iconHappbuf happybuf' + tObj.happybuf + '" title=""></span></p><br>' : '') + (tObj.lovebuf && tObj.lovebuf > 0 ? '<p class="greenText">亲密度：' + tObj.lovebuf + '</p>' : '') + (tObj.popbuf && tObj.popbuf > 0 ? '<p class="greenText">人气值：' + tObj.popbuf + '</p>' : '')
            //+'<span class="whiteText">总价值：<a href="javascript:;" class="itemMoneyIcon '+ (tObj.bidtype && tObj.bidtype == 1 ? 'itemMoneyIcon_coin' :'itemMoneyIcon_diamond') +'"></a>'+tObj.price+'</span>'
            + (obj.hasClass('pkg-gray') ? '<p class="redText2" style="padding-top:5px">需要等级' + userVitality.get('vitalitylevel') + '（未解锁）</p>' : '') + '</div></div>';
          $('.pkg-dialog-inner').append(str);
        });
      }
      clearTimeout(self.detailTimer);
    },
    currentItemIndex: null,
    detailTimer: null,
    itemList: [],
    itemList2: [],
    itemHandle: function(e) {
      e.preventDefault();
      var self = this;
      var tdiv = $(e.target);
      var pdiv = tdiv.parent();
      var tid = pdiv.attr('itemid');
      var thisObj = self.itemList2[tid];
      var canUse = !(thisObj.type == 7 && (thisObj['class'] == 2 || thisObj['class'] == 3));
      if (canUse && !pdiv.hasClass('pkg-gray') && $('.pkg-send').length == 0 && $('.pkg-multisend').length == 0 && $('.pkg-msg').length == 0) {
        self.clearDialog();
        this.$currItem = tdiv;
        var left = pdiv.position().left + 32;
        var top = pdiv.position().top + 32; //tdiv.addClass('pr').siblings('.pkg-item').removeClass('pr').find('.pkg-item-btns').remove();
        var scroll = $('#itemListBar .overview').css('top');
        scrollTop = parseInt(scroll.substring(0, scroll.length - 2));
        var top0 = top + (scrollTop && scrollTop < 0 ? scrollTop : 0);
        var str = '<span class="pkg-item-btns" style="top:' + top0 + 'px;left:' + left + 'px;" itemid="' + tid + '">';
        var isPi = (thisObj.type == 3 && thisObj.family > 1 && thisObj.itemnum == 1 && thisObj.num >= 24);
        var useAll = '';
        if (thisObj.id == '1000000452' || thisObj.id == '1000000453') {
          useAll = '<a href="javascript:;" class="useallBtn" data-num="' + thisObj.num + '" action="use">使用全部</a>';
        }
        str += (thisObj.isforgirl && thisObj.isforgirl == 1 ? '<a href="javascript:;" action="send" class="sendBtn">赠  送</a>' +
          (isPi ? '<a href="javascript:;" action="send" class="multisendBtn">批量赠送</a>' : '') :
          '<a href="javascript:;" class="useBtn" action="use">使  用</a>' + useAll);
        str += '</span>';
        $('.pkg-dialog-inner').append(str);
      }
    },
    itemInfo: function(e) {
      e.preventDefault();
      var self = this;
      var t = $(e.target);
      var p = t.parent();
      var i = p.index();
      p.addClass('currentItem').siblings('.pkg-item').removeClass('currentItem');
      self.currentItemIndex = i;
      self.detailTimer = setTimeout(function() {
        self.showItemDetail(i, p);
      }, 200);
    },
    hideAll: function(e) {
      e.preventDefault();
      $('.pkg-item-detail').remove();
    },
    refreshItemList: function() {
      var self = this;
      this.loadTemplate('index', function(template) {
        var data = pkg.toJSON();
        // self.d.content(template(data));
        var $content = self.d._$('content');
        $content.html(template(data));
        $('#itemListBar').tinyscrollbar({
          trackSize: 317,
          ucallback: globalUtil.clearAll
        });
        self.itemList2 = [];
        $.each(pkg.toJSON().result, function(i, o) {
          self.itemList2[o.itemid] = o;
          // 前端暂时不判断是否可用
          // var vitalitylevel = globalUtil.userInfo.vitalitylevel; //活跃度
          // var intimacylevel = globalUtil.userInfo.intimacylevel; //亲密度
          // var islock = ((girlid == 0 || (o.livecond <   && o.lovecond < intimacylevel)) ? '' : 'pkg-gray');
          var islock = '';
          $('.pkg-item[itemid=' + o.itemid + ']').addClass(islock);
        });
      });

    }

  });
  return View;
});