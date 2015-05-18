define(["libs/client/global", "libs/client/views/base", "models/girl", "models/girlActive", "models/girlActiveInfo", "models/giftBoardForGirl",
    "libs/client/dialog/dialog-plus-plus", "libs/client/scrollbar/jquery.tinyscrollbar", "libs/client/validate/jquery.validator", "libs/client/tinycarousel/jquery.tinycarousel", "models/userInfo", "models/angelList", "models/userGirl", "models/lovetransfer"
  ],
  function(GLOBAL, Base, girl, activeList, activeInfo, giftBoard, DIALOG, SCROLLBAR, VALIDATOR, TINYCAROUSEL, userInfo, angelList, userGirl, lovetransfer) {
    var View = Base.extend({
      moduleName: "girl",
      events: {
        'mouseenter #girlCurrentPoplular': 'showPopular', //显示人气值
        'mouseout #girlCurrentPoplular': 'hidePopular', //显示人气值
        'mouseenter .ladyNameAndLevel .ladyLevel': 'showIntimacyMsg', //显示亲密度详情
        'mouseleave .ladyNameAndLevel .ladyLevel': 'hideHandleMsg', //隐藏亲密度详情
        'click #ladyPhoto': 'showLadyStatus', //女神详细
        'click #ladyName': 'showLadyStatus', //女神详细
        // 'click .followInfo a.diary': 'showGirlDiaries', // 日记薄浮层
        // 'click #emotionsDetail': 'showHappyDetail', //幸福度弹窗
        // 'mouseenter #emotionsDetail': 'showHappyMsg', //幸福度说明浮层
        // 'mouseleave #emotionsDetail': 'hideHandleMsg', //隐藏说明浮层
        'click .currentPercent ': 'showCurrentData', //显示升级状态
        'mouseover #followBtn': 'showFollow',
        'mouseover .diary': 'showDiaryTips',
        'click #followBtn.disabled': 'showUnFollow',
        'mouseleave .followers': 'hideFollow',
        'mouseleave .followers .popup-msg-blue-text': 'hideFollow',
        'mouseleave .diary': 'hideDiaryTips',
        'mouseleave .diary .popup-msg-blue-text': 'hideDiaryTips',
        'click #followBtn': 'followHandle' //点击关注或取消关注
      },
      init: function() {
        var self = this;
        this.listenTo(girl, 'change', this.render.bind(this));
        this.listenTo(userInfo, 'change:girlid', function() {
          girl.fetch();
        });
        this.listenTo(userInfo, 'change:username', function() {
          girl.fetch();
        });
        $(window).on('quicklink.followBtnPosTip', function() {
          self.followBtnLightening();
        });
      },
      ha: {
        '1': '不幸福',
        '2': '还不错',
        '3': '开心了',
        '4': '小幸福',
        '5': '超幸福'
      },
      showUserAngel: function() {
        var res = globalUtil.userInfo,
          tdiv = $('.myLady .followers .followBtn');
        if (!res) {
          account.showSignModel();
        }
        res && res.angelgirl && res.angelgirl != '0' && res.angelgirl + '' == girlid + '' ? tdiv.addClass('disabled') : tdiv.removeClass('disabled');
      },
      girlStatus: null,
      activeList: null,
      render: function() {
        var self = this;
        var res = girl.toJSON();
        userInfo.cache(function() {
          lovetransfer.cache(function() {
            self.loadTemplate('index', function(template) {
              res.userInfo = userInfo.toJSON();
              res.isout = lovetransfer.get('result').isout;
              var html = template(res);
              self.$el.html(html);
              var w0 = self.$('.progress').width() - self.$('.currentPercent').width();
              var lew = w0 < 15 ? '-15px' : (self.$('.progress').width() < 15 ? (-30 + self.$('.currentPercent').width() + 'px') : '-20px');
              self.$('.basicInfo .currentPercent .currentData').css('right', lew);
              self.$('.ladyNameAndLevel .ladyLevel').attr('desc', '亲密度等级：' + res.intimacylevel).html(self.showLevel(res.intimacylevel)); //亲密度
              if (self.girlStatus && self.girlStatus.happiness != res.happiness) {
                //幸福度动画
                self.module('happy', function(happy) {
                  if (happy) {
                    happy.animate(self.girlStatus.happiness, res.happiness);
                  }
                });
              }
              self.girlStatus = res;
            });
          });
        });
      },
      showNum: function(num) { //convert string into img number
        var n = num + '';
        var nstr = '';
        for (var i = 0; i < n.length; i++) {
          nstr += '<i class="num' + n.substring(i, i + 1) + '"></i>';
        }

        return nstr;
      },
      showLevel: function(num0) { //亲密度等级
        var num = (num0 ? num0 : 1);
        var level = 1;
        var clevel = 1;
        if (num <= 20) {
          level = 1
          clevel = num
        } else if (num <= 40) {
          level = 2
          clevel = num - 20
        } else if (num <= 60) {
          level = 3
          clevel = num - 40
        } else if (num <= 80) {
          level = 4
          clevel = num - 60
        } else if (num <= 100) {
          level = 5
          clevel = num - 80
        }
        return num0 ? '<span class="levelIcon level' + level + '"></span><span class="levelCount">' + globalUtil.showImgNum(clevel) + '</span>' : '';
      },
      handleMsg: function(id, msg) {
        var str = '<div tabindex="-1" id="' + id + '" class="ui-popup ui-popup-show ui-popup-focus popup-handleMsg ui-popup-right" role="dialog" style="position: absolute; top:0px;left:0px; margin: 0px; padding: 0px; outline: 0px; border: 0px none; z-index: 1025; background: transparent;display:none;"  aria-labelledby="title:1417056093284" aria-describedby="content:1417056093284">' + '<div i="dialog" class="ui-dialog pop-msg-blue2"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div>' + '<table class="ui-dialog-grid"><tbody>' + '<tr><td i="body" class="ui-dialog-body" style="padding:2px 4px;line-height:16px"><div i="content" class="ui-dialog-content">' + msg + '</div></td></tr>' + '</tbody></table>' + '</div></div>'
        return str;
      },
      hideHandleMsg: function(e) {
        e.preventDefault();
        $('.popup-handleMsg').remove();
      },
      showIntimacyMsg: function(e) {
        var self = this;
        e.preventDefault();
        if ($('#intimacy_msg').length == 0) {
          var o = $('.ladyNameAndLevel .ladyLevel'),
            msg = '<span class="preNow wordkeep" style="color:#fff">' + o.attr('desc') + '</span>';
          var top = o.offset().top,
            left = o.offset().left + o.width() - 4;
          $('body').append(self.handleMsg('intimacy_msg', msg));
          $('#intimacy_msg').css({
            'top': top + 'px',
            'left': left + 'px'
          }).show();
        }
      },
      followBtnLightening: function() {
        var $btn = $('#followBtn');
        var times = 0;
        var timer = setInterval(function() {
          times++;
          if (times > 20) {
            clearInterval(timer);
          }
          if ($btn.hasClass('already')) {
            $btn.removeClass('already');
          } else {
            $btn.addClass('already');
          }
        }, 500);
      },
      showHappyMsg: function(e) {
        var self = this;
        e.preventDefault();
        var girlData = self.girlStatus ? self.girlStatus : girl.toJSON();
        if ($('#happy_desc_msg').length == 0) {
          var o = $('#emotionsDetail'),
            msg = '<span class="wordkeep" style="color:#fff">当前女神幸福度：' + self.ha[girlData.happiness] + '</span>';
          var top = o.offset().top + 40,
            left = o.offset().left + o.width() - 4;
          $('body').append(self.handleMsg('happy_desc_msg', msg));
          $('#happy_desc_msg').css({
            'top': top + 'px',
            'left': left + 'px'
          }).show();
        }

      },
      showLadyStatus: function() { //点击女神头像、名称显示女神状态详细
        var self = this;
        var res = self.girlStatus ? self.girlStatus : girl.toJSON();
        var per = parseInt((parseInt(res.popular) - res.popularlevelmin) / (res.popularlevelmax - res.popularlevelmin) * 100) + '%' //当前人气值和下个人气值等级百分比
        var str = '<div class="ladyStatusInner"><div class="ladyTab cl">' + '        <div class="ladyOptions">' + '            <div class="ladyOptionsWrap"><button class="ladyOption curr" item="details"><i class="iconDetails"></i></button><button class="ladyOption disable" disabled="disabled" item="diaries"><i class="iconDiaries"></i></button><button class="ladyOption disable" disabled="disabled" item="presents"><i class="iconPresents"></i></button></div>' + '        </div>' + '    </div>' + '    <div class="ladyContent cl ladyContentCurr" item="details" style="display: block;">' + '    <span class="tip" style="top:22px;left:113px;display:none;">' + globalUtil.userInfo.usrnick + ',不是说好做彼此的天使么~!<span class="iconHeart"></span></span>' + '        <div class="ladyPhoto2">' + '            <div class="name"><img src="' + resUrl + 'orig/images/girlName_' + res.girlid + '.png"/></div><div class="photo"><img src="' + resUrl + 'girl/' + window.girlid + '/100x310"/></div>' + '        </div>' + '        <div class="ladyDetailInfo">' + '            <div class="pointCount"><span class="currentCount" style="padding-top:0px;">' + globalUtil.showImgNum(res.dream_money) + '</span></div>' + '            <ul class="text cl">' + '                <li>人气值：<span class="progressBar clearfix"><span class="star">' + res.popularlevel + '</span><span class="progress pr" id="girlCurrentPoplular2" popular="' + res.popular + '"><span class="currentPercent" style="width:' + per + '"></span><span class="currentData wordkeep">' + per + '</span></span></span></li>' + '                <li>生日：' + res.birthday + '</li><li>星座：' + res.astro_name + '</li><li>三围：' + res.vital + '</li><li style="height:44px;">个人宣言：' + res.manifesto + '</li></ul>' + '        </div>' + '        <div class="otherItems scrollbars" id="girlStatusItemsBar">' + '            <div class="scrollbar"><div class="scroll_up"></div><div class="track"><div class="thumb"><div class="thumb_end"></div></div></div><div class="scroll_down"></div></div>' + '            <div class="viewport"><div class="overview">' + '            </div></div>' + '       </div>' + '   </div>' + '   <div class="ladyContent cl" item="diaries" style="display: none;" isload="0"></div>' + '   <div class="ladyContent cl" item="presents" style="display: none;" isload="0"></div>' + '</div>'
        var ladyStatus = dialog({
          id: 'ladyStatus',
          title: ' ',
          content: str,
          //width:684,
          quickClose: false, // 点击空白处快速关闭
          skin: 'ladyStatus'
        });
        ladyStatus.show();
        self.getGirlNow();
        $('.ladyStatus .ui-dialog-title').html('<span class="">女神详细</span>');
        $('.ladyStatus .ui-dialog-close').html('  ');
        // var w0 = $('.ladyStatusInner .progress').width() - $('.ladyStatusInner .currentPercent').width();
        // var lew = w0 < 15 ? '-15px' : ($('.ladyStatusInner .progress').width() < 15 ? (-30 + $('.ladyStatusInner .currentPercent').width() + 'px') : '-20px');
        // $('.ladyStatusInner .currentData').css('right', lew);
        $('.ladyStatus .ladyOption').click(function() {
          var o = $(this);
          if (!o.hasClass('curr')) {
            var item = o.attr('item');
            o.addClass('curr').siblings('.ladyOption').removeClass('curr').show();
            var tdiv = $('.ladyContent[item=' + item + ']');
            if (tdiv.attr('isload') == '0') {
              self.loadLadyStatus(item);
            }
            tdiv.show().siblings('.ladyContent').hide();
            tdiv.find('.scrollbars .scroll_up').click();
          }
        });
        $('.ladyPhoto2 .photo').mouseenter(function() {
          //$('.ladyContent[item=details] .tip').show();
        }).mouseleave(function() {
          //$('.ladyContent[item=details] .tip').hide()
        });
        //self.resetScrollbar('achievementsBar',140,'');

        $('#girlCurrentPoplular2').mouseenter(function() {
          self.showPopular('girlCurrentPoplular2');
        }).mouseleave(function() {
          self.hidePopular();
        });

      },
      showGirlDiaries: function() {
        this.showLadyStatus();
        $('.ladyTab .ladyOption[item=diaries]').click();
      },
      loadLadyStatus: function(item) {
        if (item == 'diaries') {
          this.showDiary();
        }
        if (item == 'presents') {
          if (giftBoard.get('result')) {
            this.showPresents();
          } else {
            giftBoard.fetch({
              data: {
                girlid: girlid
              }
            });
            this.listenTo(giftBoard, 'change', this.showPresents.bind(this));
          }

        }
      },
      showDiary: function() { //女神日记簿
        var self = this;
        var str = '<div class="dateArea">' + '    <div class="dateDetail scrollbars" id="dateDetailBar">' + '        <div class="scrollbar"><div class="scroll_up"></div><div class="track"><div class="thumb"><div class="thumb_end"></div></div></div><div class="scroll_down"></div></div>' + '        <div class="viewport"><div class="overview">' + '        </div></div>' + '   </div>' + '</div><div class="playList"></div>';
        $('.ladyContent[item=diaries]').html(str).attr('isload', '1');
        self.getTaskList();
        self.resetScrollbar('dateDetailBar', 311, '');

      },
      showPresents: function() { //礼物成就
        var self = this;
        var data = giftBoard.toJSON();
        var str = '<div class="preList cl scrollbars" id="preListBar">' + '  <div class="scrollbar"><div class="scroll_up"></div><div class="track"><div class="thumb"><div class="thumb_end"></div></div></div><div class="scroll_down"></div></div>' + '  <div class="viewport"><div class="overview">' + '<ul>'
        $.each(data.result, function(i, o) {
          if (o.usr) {
            str += '<li id="preList_pre_' + o.itemid + '" class="filled textoverflow" desc="' + o.usr.usrnick + '"><img class="itemPic" title="' + o.name + '" src="' + resUrl + 'item/' + o.itemid + '/50" /><div class="rText">' + o.name + '</div><div class="yText">' + globalUtil.convertUsr(o.usr) + '</div></li>'
          } else {
            str += '<li id="preList_pre_' + o.itemid + '" class="textoverflow" desc=""><img class="itemPic pkg-gray" title="' + o.name + '" src="' + resUrl + 'item/' + o.itemid + '/50" /><div class="rText">' + o.name + '</div><div class="yText"></div></li>'
          }
        });
        str += '    </ul>' + '  </div></div>' + '</div>';
        $('.ladyContent[item=presents]').html(str).attr('isload', '1');
        self.resetScrollbar('preListBar', 324, '', function() {
          $('#preList_error_msg').remove();
        });
        $('#preListBar li').mouseenter(function() {
          var o = $(this);
          var pos = ((o.index() + 1) % 3 == 0 ? 'left' : 'right');
          if (o.hasClass('filled')) {
            o.addClass('lighted');
          }

          var desc = o.attr('desc');
          desc = (desc && desc != '' ? '<span class="preNow wordkeep" style="color:#fff">由 <span class="mcname">' + desc + '</span> 第一个赠予</span>' : '<span class="preNo wordkeep" style="color:#ff4023">还没有人赠送过这个礼物</span>');
          var str = '<div tabindex="-1" id="preList_error_msg" class="ui-popup ui-popup-show ui-popup-focus ui-popup-' + pos + '" role="dialog" style="position: absolute; top:' + top + 'px;left:' + left + 'px; margin: 0px; padding: 0px; outline: 0px; border: 0px none; z-index: 1025; background: transparent;"  aria-labelledby="title:1417056093284" aria-describedby="content:1417056093284">' + '<div i="dialog" class="ui-dialog pop-msg-blue2"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div>' + '<table class="ui-dialog-grid"><tbody>' + '<tr><td i="body" class="ui-dialog-body"><div i="content" class="ui-dialog-content" id="content:1417056093284">' + desc + '</div></td></tr>' + '</tbody></table>' + '</div></div>';
          $('#preList_error_msg').remove();
          $('.ladyStatusInner').append(str);
          if (pos == 'right') {
            $('#preList_error_msg').removeClass('ui-popup-left').addClass('ui-popup-right');
          } else {
            $('#preList_error_msg').removeClass('ui-popup-right').addClass('ui-popup-left');
          }
          var left = (pos == 'right' ? o.position().left + 204 : o.position().left - $('#preList_error_msg').width() + 40);
          var top = o.position().top + 22 + parseInt($('#preListBar .overview').css('top'));
          $('#preList_error_msg').css({
            'top': top + 'px',
            'left': left + 'px'
          });

        }).mouseleave(function() {
          $(this).removeClass('lighted');
          $('#preList_error_msg').remove();
        });
      },

      girlNow: null,
      getGirlNow: function() {
        var self = this;
        if (self.girlNow) {
          self.showGirlNow(this.girlNow);
        } else {
          $.ajax({
            url: apiUrl + 'timeline/GetGirlNow',
            data: {
              girlid: girlid
            },
            cache: false,
            dataType: 'jsonp',
            jsonp: 'jsonpCallback',
            success: function(data) {
              if (data.success == 200 && data.result) {
                self.girlNow = data.result;
                $.ajax({
                  url: apiUrl + 'item/getSeaHeartList',
                  data: {
                    girlid: girlid
                  },
                  cache: false,
                  dataType: 'jsonp',
                  jsonp: 'jsonpCallback',
                  success: function(data) {
                    if (data.success == 200 && data.result) {
                      var rankList = {};
                      _.forEach(data.result, function(player, i) {
                        rankList['rank' + (i + 1)] = {
                          'usrnick': player.name
                        }
                      });
                      self.girlNow.seaHeart = {
                        id: '1000000436',
                        name: '海洋之心',
                        quality: '6',
                        title: false,
                        patronslist: rankList
                      }
                      self.showGirlNow(self.girlNow, self.seaHeart);
                    }
                  }
                });
              }
            }
          });
        }
      },
      showGirlNow: function(gn) {
        var self = this;
        var str = '';
        // if (gn.cloth) {
        //   str = '<div class="otherItem">' + '                <div class="item"><div class="itemPic"><img src="' + resUrl + 'item/' + gn.cloth.id + '/76" /> </div><div class="itemInfo"><span class="itemlevel' + gn.cloth.quality + '">' + gn.cloth.name + '</span></div></div>' + '                <div class="itemList">' + '                    <div class="itemListT"><img src="' + resUrl + 'orig/images/t1.png" /></div>' + '                    <ul class="itemListC">';
        // }
        // var hasSelf1 = false;
        // if (gn.cloth && gn.cloth.patronslist) {
        //   for (oo in gn.cloth.patronslist) {
        //     var o = gn.cloth.patronslist[oo];
        //     var i = parseInt(oo.substring(4, oo.length));
        //     if (globalUtil.userInfo != null && typeof(globalUtil.userInfo.ssoid) == 'string' && typeof(o.ssoid) != 'undefined' && o.ssoid != null && o.ssoid == globalUtil.userInfo.ssoid && hasSelf3 == false) {
        //       hasSelf1 = true;
        //     }
        //     str += '<li class="line' + (i) + '">' + '<a href="javascript:;" class="' + (i < 4 ? 'yText' : 'wText') + '" title="' + o.usrnick + '"><i>' + (i < 4 ? '' : i) + '</i>' + globalUtil.convertUsr(o) + '</a></li>'
        //   }
        // }
        // if (gn.cloth) {
        //   str += (!hasSelf1 ? (gn.cloth.myrank && gn.cloth.myrank != 0 ? '<li class="line' + gn.cloth.myrank + '"><a href="javascript:;" class="yText"><i>' + gn.cloth.myrank + '</i>' + globalUtil.convertUsr(globalUtil.userInfo) + '</li>' : '<li style="text-align:center;"><span class="redText" style="float:none;">您今日尚未参与集资</span></li>') : '')
        //   str += '                </ul>' + '                </div>' + '            </div>';
        // }
        // if (gn.food) {
        //   str += '            <div class="otherItem">' + '                <div class="item"><div class="itemPic"><img src="' + resUrl + 'item/' + gn.food.id + '/90" /> </div><div class="itemInfo"><span class="itemlevel' + gn.food.quality + '">' + gn.food.name + '</span></div></div>' + '                <div class="itemList">' + '                    <div class="itemListT"><img src="' + resUrl + 'orig/images/t2.png" /></div>' + '                    <ul class="itemListC">';
        // }
        // var hasSelf2 = false;
        // if (gn.food && gn.food.patronslist) {
        //   for (oo in gn.food.patronslist) {
        //     var o = gn.food.patronslist[oo];
        //     var i = parseInt(oo.substring(4, oo.length));
        //     if (globalUtil.userInfo != null && typeof(globalUtil.userInfo.ssoid) == 'string' &&
        //      typeof(o.ssoid) != 'undefined' && o.ssoid != null &&
        //       o.ssoid == globalUtil.userInfo.ssoid && hasSelf3 == false) {
        //       hasSelf2 = true;
        //     }
        //     str += '<li class="line' + (i) + '"><a href="javascript:;" class="' + (i < 4 ? 'yText' : 'wText') + '" title="' + o.username + '"><i>' + (i < 4 ? '' : i) + '</i>' + globalUtil.convertUsr(o) + '</a></li>'
        //   }
        // }
        // if (gn.food) {
        //   str += (!hasSelf2 ? (gn.food.myrank && gn.food.myrank != 0 ? '<li class="line' + gn.food.myrank + '"><a href="javascript:;" class="yText"><i>' + gn.food.myrank + '</i>' + globalUtil.convertUsr(globalUtil.userInfo) + '</a></li>' : '<li style="text-align:center;"><span class="redText" style="float:none;">您今日尚未参与集资</span></li>') : '')
        //   str += '                    </ul>' + '                </div>' + '            </div>'
        // }
        // if (gn.live) {
        //   str += '            <div class="otherItem">' + '                <div class="item"><div class="itemPic"><img src="' + resUrl + 'item/' + gn.live.id + '/90" /> </div><div class="itemInfo"><span class="itemlevel' + gn.live.quality + '">' + gn.live.name + '</span></div></div>' + '                <div class="itemList">' + '                    <div class="itemListT"><img src="' + resUrl + 'orig/images/t3.png" /></div>' + '                    <ul class="itemListC">';
        // }
        // var hasSelf3 = false;
        // if (gn.live && gn.live.patronslist) {
        //   for (oo in gn.live.patronslist) {
        //     var o = gn.live.patronslist[oo];
        //     var i = parseInt(oo.substring(4, oo.length));
        //     if (globalUtil.userInfo != null && typeof(globalUtil.userInfo.ssoid) == 'string' && typeof(o.ssoid) != 'undefined' && o.ssoid != null && o.ssoid == globalUtil.userInfo.ssoid && hasSelf3 == false) {
        //       hasSelf3 = true;
        //     }
        //     str += '<li class="line' + (i) + '"><a href="javascript:;" class="' + (i < 4 ? 'yText' : 'wText') + '" title="' + o.usrnick + '"><i>' + (i < 4 ? '' : i) + '</i>' + globalUtil.convertUsr(o) + '</a></li>'
        //   }
        // }
        // if (gn.live) {
        //   str += (!hasSelf3 ? (gn.live.myrank && gn.live.myrank != 0 ? '<li class="line' + gn.live.myrank + '"><a href="javascript:;" class="yText"><i>' + gn.live.myrank + '</i>' + globalUtil.convertUsr(globalUtil.userInfo) + '</a></li>' : '<li style="text-align:center;"><span class="redText" style="float:none;">您今日尚未参与集资</span></li>') : '')
        //   str += '                    </ul>' + '               </div>' + '           </div>'
        // }
        // $('#girlStatusItemsBar .overview').html(str);
        // self.resetScrollbar('girlStatusItemsBar', 331, '');
        this.loadTemplate('sponsor', function(template) {
          var str = template({
            result: gn
          });
          $('#girlStatusItemsBar .overview').html(str);
          self.resetScrollbar('girlStatusItemsBar', 331, '');
        });
      },
      showHappyDetail: function(e) {
        e.preventDefault();
        var self = this;
        self.hideHandleMsg(e);
        this.module('happy', function(happy) {
          if (happy) {
            happy.show(girl.toJSON());
          }
        });
      },
      showFollow: function() {
        if (userInfo.get('isLogin')) {
          var self = this,
            tdiv = $('.myLady .followers'),
            girl = userInfo.get('girlid');
          tdiv.find('.popup-msg-blue-text').remove();
          if (girl != '0' && $('#followBtn').hasClass('already')) {
            //关注了，却不是当前女神
            userGirl.cache(function() {
              $('<span>', {
                'class': 'popup-msg-blue-text wordkeep',
                'style': 'cursor:pointer;left:40px',
                text: '您已选择支持' + userGirl.get('name') + '选手，同时只能关注支持一位选手'
              }).appendTo(tdiv);
            });
          }
        }
      },
      showDiaryTips: function() {
        $('<span>', {
          'class': 'popup-msg-blue-text wordkeep',
          'style': 'cursor:pointer;left:120px',
          text: '神秘日记簿，敬请期待'
        }).appendTo($('.diary'));
      },
      showUnFollow: function(e) {
        var self = this;
        var str = '<div class="attention_tips_con ">' + '<div class="attention_tips_tit"><span></span></div>' + '<div class="attention_tips_main dialogLightbgGame">' + '    <p class="yellow_4 mt_20 attention_word">取消关注则同时会失去和女神关联的星座，以及无法对女神进行节目中的游戏支持</p>' + '    <p class=" tc mt_30">是否取消关注？</p>' + '    <div class="cl mt_10">' + '      <a class="w90 btn_2b ml_20 fl" href="javascript:void(0);">取消关注</a><a class="w90 btn_1y fl ml_15" href="javascript:void(0);">继续关注</a>' + '    </div>' + '</div>' + '</div>';
        var wishSuccess = dialog({
          id: 'unFollowDialog',
          title: ' ',
          content: str,
          quickClose: false, //点击空白处快速关闭
          skin: 'dialogGames attentionFollw_dialog'
        });
        wishSuccess.show();
        $('.dialogGames .ui-dialog-title').html('');
        $('.dialogGames .ui-dialog-close').text('');
        $('.dialogGames .btn_1y').click(function() {
          wishSuccess.close().remove();
        });
        $('.dialogGames .btn_2b').click(function() {
          self.unFollow(function() {
            wishSuccess.close().remove();
          });
        });
      },
      hideFollow: function() {
        $('.followers .popup-msg-blue-text').remove();
      },
      hideDiaryTips: function() {
        $('.diary .popup-msg-blue-text').remove();
      },
      unFollow: function(callback) {
        var self = this,
          tdiv = $('.myLady .followers'),
          girl = globalUtil.userInfo.angelgirl,
          pdiv = $('#followBtn');
        var disabled = pdiv.hasClass('disabled');
        var numberCurr = parseInt(globalUtil.delcommafy($('#countFollow').text()));
        $.ajax({
          url: apiUrl + 'girlstatus/removeFollow',
          data: {
            girlid: girlid
          },
          cache: false,
          dataType: 'jsonp',
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200 && data.result.status) {
              self.showFollowMsg(-1);
              $('#countFollow').text(globalUtil.commafy(numberCurr - 1));
              pdiv.removeClass('disabled');
              $('.followBtn .popup-msg-blue-text').remove();
              globalUtil.userInfo.angels = '0'
              self.hideFollow();
              angelList.fetch();
              userInfo.fetch();
              callback();
            }
          }
        });
      },
      followHandle: function() {
        //点击关注
        var self = this;
        var pdiv = $('#followBtn');
        var disabled = pdiv.hasClass('disabled');
        var numberCurr = parseInt(globalUtil.delcommafy($('#countFollow').text()));
        if (!disabled) {
          this.module('sign', function(module) {
            if (module) {
              module.showSignModel('login', function() {
                lovetransfer.cache(function() {
                  var isout = lovetransfer.get('result').isout;
                  if (isout == '1') {
                    self.module('lovetransfer', function(lovetransfer) {
                      if (lovetransfer) {
                        lovetransfer.loveTShow();
                      }
                    });
                  } else {
                    //添加关注
                    $.ajax({
                      url: apiUrl + 'girlstatus/doFollow',
                      data: {
                        girlid: girlid
                      },
                      dataType: 'jsonp',
                      cache: false,
                      jsonp: "jsonpCallback",
                      success: function(data) {
                        if (data.success == 200 && data.result.status) {
                          self.showFollowMsg(1);
                          $('#countFollow').text(globalUtil.commafy(numberCurr + 1));
                          pdiv.addClass('disabled');
                          angelList.fetch();
                          userInfo.fetch();
                        }
                      }
                    });
                  }
                });

              });
            }
          });
        }

      },
      popularDialog: null,
      showPopular: function(obj) {
        var popular = globalUtil.commafy(this.girlStatus.popular);
        var tdiv = (obj && obj == 'girlCurrentPoplular2' ? $('#girlCurrentPoplular2 .currentData') : $('#girlCurrentPoplular .currentData'));
        if ($('.ui-popup[aria-labelledby="title:girlPopular"]').length == 0) {
          var str = '<div tabindex="-1" id="girlPopular" aria-labelledby="title:girlPopular" aria-describedby="content:girlPopular" class="ui-popup ui-popup-modal ui-popup-show ui-popup-top-left ui-popup-follow ui-popup-focus" role="alertdialog" style="position: absolute; outline: 0px; left: 0px; top: 0px; z-index: 1024;display:none;">' + '<div i="dialog" class="ui-dialog popup-msg-blue"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div>' + '<table class="ui-dialog-grid"><tbody>' + '<tr><td i="body" class="ui-dialog-body"><div i="content" class="ui-dialog-content" id="content:girlPopular">人气值： ' + popular + '</div></td></tr>' + '</tbody></table></div></div>'
          $('body').append(str);
          var ofs = tdiv.offset();
          var top = tdiv.offset().top - $('#girlPopular').height() - 2,
            left = tdiv.offset().left;
          $('#girlPopular').css({
            'top': top + 'px',
            'left': left + 'px'
          }).show();
          //$('#ladyCurrentProgress').click(function(){
          /**var d = dialog({
              id : 'girlPopular'
              ,content: '人气值： -' + popular
              ,quickClose: true// 点击空白处快速关闭
              ,align:'top left'
              ,skin:'popup-msg-blue'
          });     
          d.show(tdiv[0]);
          $('.ui-popup-backdrop').remove();
          this.popularDialog = d;*/
          //setTimeout(function(){d.close().remove()},1000);
          //});
        }
      },
      hidePopular: function() {
        $('#girlPopular').remove();
        if (this.popularDialog) {
          this.popularDialog.close().remove();
        }
      },
      showFollowMsg: function(num) {
        var self = this;
        self.module('numtip', 'girl', function(numtip) {
          if (numtip) {
            numtip.show({
              elem: self.$('.followIcon')[0],
              num: num
            });
          }
        });
      },
      resetScrollbar: function(oid, size, pos, callback) {
        var scrollbar = $('#' + oid).tinyscrollbar({
          trackSize: size,
          ucallback: callback
        });
        var thisBar = scrollbar.data("plugin_tinyscrollbar");
        thisBar.update(pos);
        $('#' + oid).find('.scroll_up').click();
      },
      getTaskList: function() { //请求活动列表 日记薄显示
        var self = this;　
        $.ajax({
          url: apiUrl + 'timeline/GetGirlActiveList',
          data: {
            girlid: girlid
          },
          cache: false,
          dataType: 'jsonp',
          jsonp: "jsonpCallback",
          success: function(data) {
            if (data.success == 200) {
              self.activeList = data.result;
              self.showTaskList(data.result);
            }
          }
        });
      },
      taskFocus: function() {
        //var today = globalUtil.dateUtil();
        //$('#dateDetailBar .overview li[cgdate='+today+']').not('.pkg-gray').last().find('a img').click();
        var aa = $('#dateDetailBar .overview .dateOn:last li').not('.pkg-gray').last().find('a img');
        aa.click();
        this.resetScrollbar('dateDetailBar', '311', aa.position().top, function() {

        });
      },
      taskList: [],
      taskListMain: [],
      showTaskList: function(data) { //显示日记列表 日记簿
        var self = this;
        var tdiv = $('#dateDetailBar .overview');
        var dstr = '';
        $.each(data, function(i, o) {
          var tday = o.day + '';
          var date0 = o.day;
          var date = (date0 < 10 ? '' + date0 : '' + date0);
          dstr += '<ul class="dates clearfix dateOn" date="' + o.day + '" dateNum="' + date + '"><li class="dateT dateNum"><a href="javascript:;" class="' + (i == 0 ? 'hover' : '') + '"><i class="di"></i><i class="num' + date.substring(0, 1) + '"></i>' + (date.length == 2 ? '<i class="num' + date.substring(1, 2) + '"></i>' : '') + '<i class="tian"></i></a><i></i></li>';
          var alist = o.cginfo;
          $.each(alist, function(j, m) {
            self.taskListMain[m.id] = m;
            dstr += '<li cgtype="' + (m.cglist ? m.cglist[0].type : '') + '" type="' + m.type + '" cgdate="' + m.cgdate + '" class="dateC ' + (m.havecg == '1' ? '' : 'pkg-gray') + '" aid="' + m.id + '"><a href="javascript:;" title="' + m.title + '"><img src="' + resUrl + 'resource/active/icon/' + m.type + '.png"/></a><i></i></li>'
          });
          dstr += '</ul>';
        });
        if (data.length < 24) {
          for (var k = data.length + 1; k <= 24; k++) {
            var tday = (k < 10 ? '' + k : '' + k);
            dstr += '<ul class="dates clearfix dateOff" date="' + k + '" dateNum="' + tday + '">' + '   <li class="dateT dateNum" ><a href="javascript:;"><i class="di"></i><i class="num' + tday.substring(0, 1) + '"></i>' + (tday.length == 2 ? '<i class="num' + tday.substring(1, 2) + '"></i>' : '') + '<i class="tian"></i></a><i></i></li>' + '   <li class="dateC"><a href="javascript:;"></a><i></i></li><li class="dateC"><a href="#"></a><i></i></li><li class="dateC"><a href="#"></a><i></i></li><li class="dateC"><a href="#"></a><i></i></li><li class="dateC"><a href="#"></a><i></i></li>' + '</ul>';
          };
        }
        tdiv.html(dstr);
        self.resetScrollbar('dateDetailBar', 311, '');
        $('#dateDetailBar .overview li').not('.pkg-gray').find('a img').click(function(e) {
          e.preventDefault();
          if (!$(this).parent().parent().hasClass('pkg-gray')) {
            self.getActiveInfo(this);
            var da = $(this).parent().parent().parent().find('.dateNum a');
            da.addClass('hover');
            $('#dateDetailBar .overview .dateNum a').not(da).removeClass('hover');
          }

        });
        self.taskFocus();

      },
      getActiveInfo: function(obj) {
        var self = this;
        var cgid = $(obj).parent().parent().attr('aid');
        var cg = self.taskList[cgid];
        if (cg) {
          self.showActiveInfo(cg, obj);
        } else {
          $.ajax({
            url: apiUrl + 'timeline/getActiveInfo',
            data: {
              activeid: cgid
            },
            cache: false,
            dataType: 'JSONP',
            jsonp: 'jsonpCallback',
            success: function(data) {
              if (data.success == 200) {
                self.showActiveInfo(data.result, obj);
              }
            },
            error: function(data) {
              $('.ladyContent[item=diaries] .playList').html('');
            }
          });
        }
      },
      showActiveInfo: function(cg0, obj) {
        var self = this;
        var cg = typeof(cg0) != 'undefined' && cg0 != null ? cg0 : activeInfo.toJSON().result;
        var plat = {
          '0': 'iqiyi',
          '1': 'letv'
        };
        if (typeof(cg) != 'undefined' && cg != null) {
          self.taskList[cg.id] = cg;
          var odiv = $(obj),
            pdiv = odiv.parent().parent(),
            aid = pdiv.attr('aid'),
            ppdiv = pdiv.parent(),
            date = ppdiv.attr('date'),
            cgm = self.taskListMain[aid];

          var imgBg = {
            'silver': 'followerPicBg1',
            'gold': 'followerPicBg2',
            'default': 'followerPic'
          }
          var pstr = '<div class="playOperation clearfix">' + '       <span class="fr"><a href="#" target="_blank" class="playBack"><span class="icons iconPlaySmall"></span>回看点播</a></span>' + '       <span class="fl">第' + ppdiv.attr('date') + '天 ' + cgm.cgtime.substring(0, 5) + '   <span class="blueText">' + cgm.title + '</span></span>' + '  </div>';
          pstr += '<div class="playArea clearfix"><div class="play" id="cgPreread"><a href="javascript:;" class="icons iconShare"></a><div class="viewport"><ul class="overview">'
          if (cg.cglist) {
            $.each(cg.cglist, function(i, o) {
              if (o.type == 0) {
                var pl = o[plat[o.type]];
                pstr += '<li><img src="' + (pl.videothumb ? pl.videothumb : '') + '"  url="' + pl.url + '"/></li>';
              }
              if (o.type == 1) {
                pstr += '<li><img src="' + (o.picthumb ? o.picthumb : '') + '" url="' + o.url + '" /></li>'
              }
            });
          }
          pstr += '</ul></div><a href="javascript:;" class="icons iconPrev prev"></a><a href="javascript:;" class="icons iconNext next"></a><a href="javascript:;" class="icons iconPlay"></a></div></div>'
          pstr += '<div class="playInfo clearfix"><div class="pInfo">';

          this.loadTemplate('cgresult', function(template) {
            pstr += template(cg);
          });
          pstr += '</div>'
          pstr += '<ol class="allFollowers">'
          var rank = cg.usercountrib;
          if (rank) {
            $.each(rank, function(i, o) {
              pstr += '<li><span class="icons icon' + i + '"></span><img src="' + resUrl + 'head/' + o.ssoid + '/40" class="followerPicBg' + o.usrangel + '"><i class="iconVip"></i><span class="followerText textoverflow" title="' + o.usrnick + '">' + o.usrnick + '</span></li>'
            });
          }
          pstr += (cg.myrank && cg.myrank > 0 ? '<li style="float:right;"><span class="icons iconRenk0">' + cg.myrank + '名</span><img src="' + resUrl + 'orig/images/photo.png"><span class="followerPic"></span><span class="followerText textoverflow">' + globalUtil.userInfo.usrnick + '</span></li>' : '<li style="padding-top:5px"><span class="redText" style="display:inline-block;margin-top:5px; line-height:14px; font-size:12px;float:right;">您没有参与此次活动</span>') + '</ol>';
          pstr += '    </div>';
          $('.ladyContent[item=diaries] .playList').html(pstr);
          $('#dateDetailBar .overview .dateC').removeClass('hover');
          pdiv.addClass('hover');
          $('#cgPreread').tinycarousel({
            infinite: false
          });
          $('#cgPreread').find('.overview img').click(function(e) {
            //self.openVideo(e);
          });
          $('#cgPreread .iconPlay').click(function(e) {
            self.openVideo(e);
          });

        } else {
          $('.ladyContent[item=diaries] .playList').html('');
        }
      },
      openVideo: function(e) {
        e.preventDefault();
        var index = parseInt(parseInt($('#cgPreread .overview').css('left')) / 156)
        var tdiv = $('#cgPreread .overview li img').eq(index),
          wdiv = $('.ui-popup .ladyStatus').parent();
        var top = wdiv.position().top,
          left = wdiv.position().left + wdiv.width() + 10;
        var url = tdiv.attr('url');
        //window.open(url,'newwindow','height=400,width=400,top='+top+',left='+left+',toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
        window.open(url);
        e.preventDefault();
      }
    });
    return View;
  });