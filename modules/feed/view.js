define(["libs/client/views/base", "libs/client/scrollbar/jquery.tinyscrollbar", "libs/client/queue", "models/feedHistory"], function(Base, SCROLLBAR, queue, feedHistory) {
  var View = Base.extend({
    moduleName: "feed",
    template: 'index',
    events: {
      'click .goddess_house': 'houseTab'
    },
    render: function() {

    },
    initFeed: function() {
      var self = this;
      feedHistory.cache(function() {
        var data = feedHistory.toJSON();
        var feed = data.feed;
        var talk = data.talk;
        _.each(feed, function(item) {
          try {
            var msg = (decodeURIComponent(item));
            self.icommet_show_feed({
              content: msg
            });
          } catch (e) {}
        });
      });
    },
    init: function() {
      // this.initMap();
      this.initFeed();
    },
    initMap: function() {
      var self = this;
      window.showUserInfo = function(uid) {
        alert(uid)
      };
      window.showRoomInfo = function(roomid, cameraid) {
        alert(roomid)
      };
      this.module('flash', function(module) {
        if (module) {
          self.show();
          module.on('flashready.map', function() {
            self._flashReady = true;
          });
        }
      });
    },
    show: function(tl) {
      //girlinfo.fetch();
      var self = this;
      if (self.aniVars.currentLevel == tl) return;
      self.aniVars.flashvars.tarLevel = tl;
      self.aniVars.targetLevel = tl;
      $('.goddess_room_con').fadeOut('fast', function() {
        $(this).append("<div id='map_flash'></div>").show();
        swfobject.embedSWF(resUrl + "flash/main.swf?" + (new Date()).getTime(), "map_flash", "250", "325", "10.0.0", "", self.aniVars.flashvars, self.aniVars.params, self.aniVars.attributes);
        self.aniVars.currentLevel = tl;
        self.aniVars.flashvars.curLevel = tl;
        $.ajax({
          url: window.apiUrl + 'flashMap/getMapData',
          dataType: 'jsonp',
          jsonp: 'jsonpCallback',
          success: function(data) {
            var map = $('#map_flash')[0];
            self.module('flash', function(module) {
              if (module) {
                if (self._flashReady) {
                  try {
                    map.sendRoomListData(data);
                  } catch (e) {}
                }
                module.on('flashready.map', function() {
                  try {
                    map.sendRoomListData(data);
                  } catch (e) {}
                });
              }
            });
          }
        });
      })
    },
    aniVars: {
      params: {
        quality: "high",
        scale: "noscale",
        wmode: "transparent",
        allowscriptaccess: "always"
      },
      attributes: {
        id: "map_flash",
        name: "map_flash"
      },
      flashvars: {
        curLevel: 1,
        tarLevel: 1,
        callback: 'view_room'
      },
      currentLevel: 1,
      targetLevel: 1
    },
    houseTab: function(e) {
      e.preventDefault();
      var self = this,
        oDiv = $(e.target),
        chatDiv = $('.notice.pr'),
        taskDiv = $('.mytask.pr'),
        houseDiv = $('.goddess_room.pr');
      if (houseDiv.css('display') == 'none') {
        chatDiv.hide();
        taskDiv.hide();
        houseDiv.show();
      } else {
        chatDiv.show();
        taskDiv.show();
        houseDiv.hide();
      }


    },
    resetFeedBar: function() { //reset feed scrollbar size
      var self = this;
      var d1 = $('.notice_firstbg');
      var d2 = $('#feeds');
      var scrollHeight = 172;
      if (d2.attr('data-height')) {
        scrollHeight = d2.attr('data-height') * 1;
      }
      var h1 = 0,
        h2 = scrollHeight,
        h0 = scrollHeight;
      if ($('.notice_firstbg:visible').length == 0) {
        h0 = scrollHeight;
      } else {
        h0 = h2 - d1.outerHeight();
      }
      $('.noticeBoard').css('height', h0 + 7 + 'px');
      d2.css('padding', '0').find('.viewport').css('height', h0 + 'px');
      d2.find('.scrollbar').css('height', h0 - 2 + 'px');
      d2.find('.track').css('height', h0 - 28 + 'px');
      return $('#feeds').tinyscrollbar();
    },
    feed_scrollbar_update: function(pos) { //手动更新滚动条位置
      var self = this;
      var bar = self.resetFeedBar();
      var scrollbar = bar.data("plugin_tinyscrollbar");
      scrollbar.update(pos);
    },
    showInVideo: function(str) { //视频里显示

    },
    popupArray: [],
    showInPop: function(str, userid, angel, count, skinid, itemid, callback) { //弹出框 字符串 userID 是否是天使 0、1、2  count为显示的次数 
      var self = this;
      // var top = $('#player').offset().top + 5 + $('.ui-popup .paoMsg').length * 80 - 40;
      // var left = $('#player').offset().left + 20;
      skinid = skinid ? skinid : 1;
      str = str.replace(/<uicon.*?>/, '');
      var itemSkin = {
        "1": ["paoSkin1", "paoSkin2", "paoSkin3"],
        "2": ["paoSkin1", "paoSkin2", "paoSkin3"],
        "3": ["paoSkin2", "paoSkin3"],
        "4": ["paoSkin1", "paoSkin2", "paoSkin3"],
        "5": ["paoSkin1"],
        "6": ["paoSkin1"]
      }
      var paoSkin = itemSkin[skinid];
      var paoSkinR = paoSkin[Math.round(Math.random() * paoSkin.length)];
      $('#paoPopup .paoMsg div').html(str + '<span style="display:inline-block; margin:0 140px; height:22px;">&nbsp;&nbsp;</span>' + str);
      var $img = $('#paoPopup .paoBg img.item');
      if ($img.length === 0) {
        $img = $('<img>').addClass('item');
        $('#paoPopup .paoBg').append($img);
      }
      $img.attr('src', window.resUrl + 'item/' + itemid + '/40?png');
      $('.followerImg').attr('src', window.resUrl + 'head/' + userid + '/40');
      angel && angel != 0 ? $('.followerImg').addClass('followerPicBg' + angel) : $('.followerImg').removeClass('followerPicBg1').removeClass('followerPicBg2');

      if (itemid == '1000000432') {
        this.module('flash', function(module) {
          if (module) {
            module.show('环游世界');
          }
        });
      }

      if (itemid == '1000000434') {
        this.module('flash', function(module) {
          if (module) {
            module.show('私人海岛');
          }
        });
      }

      if (itemid == '1000000436') {
        this.module('flash', function(module) {
          if (module) {
            module.show('海洋之心');
          }
        });
      }

      if (count && count > 0) {
        var paoPop = dialog({
          content: $('#paoPopup').html(),
          quickClose: false, // 点击空白处快速关闭
          skin: 'paoSkinss ' + paoSkinR
        });
        paoPop.show();
        count--;
        var thisDiv = $('.ui-popup .paoSkinss').last();
        var thisPdiv = thisDiv.parent();
        thisDiv.css({
          'background': 'none',
          'border': 'none'
        });
        var top = $('#player').offset().top - 35;
        var left = $('#player').offset().left + 20;
        thisPdiv.css({
          'top': top + 'px',
          'left': left + 'px'
        });
        var list = $('.ui-popup .paoSkinss').toArray();
        list.pop();
        for (var i = 0, len = list.length; i < len; i++) {
          $(list[i]).parent().css({
            'top': $(list[i]).parent().addClass('transtion-top').offset().top + 80
          });
        }
        setTimeout(function() {
          if (count > 0) {
            paoPop.close();
            self.showPaoAgain(paoPop, angel, count, thisPdiv, callback);
          } else {
            paoPop.close().remove();
            $('.followerImg').addClass('followerPicBg' + angel);
            if (callback) {
              callback();
            }

          }

        }, 8000);

      }

    },
    showPaoAgain: function(obj, angel, count, pdiv, callback) { //show this popup again, the previous position is needed
      var self = this;
      if (obj) {
        setTimeout(function() {
          var l = pdiv.css('left'),
            t = pdiv.css('top');
          obj.show();
          count--;
          pdiv.css({
            'top': t,
            'left': l
          });
          setTimeout(function() {
            if (count > 0) {
              obj.close();
              self.showPaoAgain(obj, angel, count, pdiv, callback);
            } else {
              obj.close().remove();
              $('.followerImg').addClass('followerPicBg' + angel);
              if (callback) {
                callback();
              }
            }
          }, 8000);
        }, 1000);
      }
    },
    showAni: function(str) {

    },
    showInChat: function(strTime, strNew, userid) {
      var tdiv = $('#chat_box');
      var entering = strNew.indexOf('进入女神房间') > -1
      var isNotice = strNew.indexOf('【系统通告】') > -1


      var timestr = (isNotice ? ' noticeRed">' : '"><em>' + strTime + '</em>');
      if (entering) {
        timestr = ' grayText2">';
        // 以下是临时支持天使进场动画
        if (strNew.indexOf('flying1.png') !== -1) {
          this.module('flash', function(module) {
            if (module) {
              module.show('angel_silver', null, userid);
            }
          });
        }
        if (strNew.indexOf('flying2.png') !== -1) {
          this.module('flash', function(module) {
            if (module) {
              module.show('angel', null, userid);
            }
          });
        }
      }
      tdiv.append('<p class="fromNotice' + timestr + strNew + '</p>');
      var maxMsgs = 100;
      var msgs = tdiv.find('p');
      if (msgs.length > maxMsgs) {
        msgs.slice(0, msgs.length - maxMsgs).remove();
      }
      this.module('chat', function(chat) {
        if (chat) {
          chat.chat_box_scrollbar_update('bottom');
        }
      });
    },
    flashPlayer: {
      params: {
        quality: "high",
        scale: "noscale",
        wmode: "transparent",
        allowscriptaccess: "always"
      },
      attributes: {
        id: "movie_flash",
        name: "movie_flash"
      },
      closemovie: function() {
        $("#close_movie").empty();
        $("#close_movie").html("<div id=\"movie_flash\"></div>");
      },
      flash: function(obj) {
        var flashvars = {
          obj_name: obj
        };
        swfobject.embedSWF(eventflash, "movie_flash", "800", "800", "10.0.0", "", flashvars, this.params, this.attributes);
      },
      flashplay: function(eventflash, obj, callback) {
        if ($('#close_movie').length == 0) {
          $('body').append('<div id="close_movie"><div id="movie_flash"></div></div>');
        }
        var flashvars = {
          obj_name: obj
        };
        swfobject.embedSWF(resUrl + "flash/swf/24-1.swf?", "movie_flash", "800", "800", "10.0.0", "", flashvars, this.params, this.attributes);
        setTimeout(function() {
          callback();
        }, 5000);
      }

    },
    showFixedTop: function(strTime, strMsg) {
      var self = this;
      globalUtil.queueNbd.defer(function(callback) {
        $('.notice_firstbg').html('<em>' + strTime + '</em><div class="notice_first">' + strMsg + '</div>').show(0, function() {
          self.resetFeedBar();
          setTimeout(function() {
            $('.notice_firstbg').html('').hide(0, function() {
              self.resetFeedBar();
            });
            self.resetFeedBar();
            callback(null, 1);
          }, 5000);
        });
        $('.notice_firstbg').find('span[class*=rank1]').addClass('crown_yellow');
        $('.notice_firstbg').find('span[class*=rank2]').addClass('crown_gray');
        $('.notice_firstbg').find('span[class*=rank3]').addClass('crown_orange');
        self.resetFeedBar();
      });
    },
    //show feed msg
    icommet_show_feed: function(msg) {
      var self = this;
      var output = $('#output');
      var showMsg = self.transformStr(msg);
      this.$('.scrollbar').removeClass('hide');
      if (showMsg) {
        if (showMsg.indexOf('##') > 0) {
          msgArr = showMsg.split('##');
          msgArr.pop();
          for (var i = 0, len = msgArr.length; i < len; i++) {
            (function(i) {
              setTimeout(function() {
                output.append(msgArr[i]);
                var ii = $('#output li').length - 300;
                if (ii > 0) {
                  $('#output li:lt(' + ii + ')').remove();
                }
                self.resetFeedBar();
                self.feed_scrollbar_update('bottom');
              }, i * 100);
            }(i));
          }
        } else {
          output.append(showMsg);
          var ii = $('#output li').length - 300;
          if (ii > 0) {
            $('#output li:lt(' + ii + ')').remove();
          }
          self.resetFeedBar();
          self.feed_scrollbar_update('bottom');
        }
      }
    },
    transformStr: function(msg) {
      // str = "&lt;angel2&gt;&lt;vip&gt;&lt;u&gt;yf12345&lt;/u&gt;送&lt;iicon1000000259&gt;&lt;num&gt;24&lt;/num&gt;&lt;w::flashid&gt;0&lt;/w&gt;||002010000000000500||100000035701||2015-03-21 11:04:41"
      var self = this;
      var str = msg.content;
      var strArr = str.split('||');
      var strNew = strArr[0].replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      var strLast = strNew;
      var itid;
      if (strNew != '') {

        var position = strArr[1];
        var uid = strArr[2];
        var strArray = ['<u>', '<uicon', '<g>', '<gicon', '<iicon', '<q>', '<i', '<num>', '<a>', '<rank'];
        var classArray = {
          '<u>': 'uname', //用户昵称
          '<uicon': 'uuicon', //用户头像
          '<g>': 'pinkText', //女神名称
          '<gicon': 'ugicon', //女神头像
          '<iicon': 'uicon', //道具图标（包括天使恶魔）
          '<q>': 'uq', //道具品质
          '<i': 'itemlevel', //道具名称
          '<num>': 'unum', //道具数量
          '<a>': 'uactive', //活动名称
          '<rank': 'urank'
        }; //冠亚军排名

        var strTime = strArr[3] ? strArr[3].substring(11, 16) : '00:00';
        strNew = strNew.replace('<mc>', '<span class="mcname">').replace('</mc>', '</span>');
        strNew = strNew.replace('<re>', '<span class="rename">').replace('</re>', '</span>'); //成就名称
        strNew = strNew.replace('<t>', '<span class="taskname">').replace('</t>', '</span>'); //任务名称
        strNew = strNew.replace('<vip>', '<img width="18" src="' + window.resUrl + 'orig/images/vip.png">') //显示vip
        strNew = strNew.replace('<angel1>', '<img src="' + window.resUrl + 'orig/images/flying1.png" style="height:15px;">') //白银天使
        strNew = strNew.replace('<angel2>', '<img src="' + window.resUrl + 'orig/images/flying2.png" style="height:15px;">') //黄金天使
        strNew = strNew.replace('<rank1>', '<span class="rank1">').replace('</rank1>', '</span>').replace('<rank2>', '<span class="rank2">').replace('</rank2>', '</span>').replace('<rank3>', '<span class="rank3">').replace('</rank3>', '</span>');
        strNew = strNew.replace('<grank1>', '<span class="grank1 pinkText">').replace('</grank1>', '</span>').replace('<grank2>', '<span class="grank2 pinkText">').replace('</grank2>', '</span>').replace('<grank3>', '<span class="grank3 pinkText">').replace('</grank3>', '</span>');

        //console.log(strNew);
        $.each(strArray, function(i, o) {
          var isIn = strNew.indexOf(o);
          if (o == '<i') {
            for (var ii = 6 - 1; ii >= 0; ii--) {
              if (strNew.indexOf(o + ii) > 0) {
                isIn = strNew.indexOf(o + ii)
              }
            }
          }
          if (isIn > -1) {
            if (i == 0 || i == 2 || i == 5 || i == 7 || i == 8) {
              var tarName = o.substring(1, o.length - 1);
              var regex1 = new RegExp("<" + tarName + ">", "g");
              var regex2 = new RegExp("</" + tarName + ">", "g");
              //var preT = ['<u>':'/<u>/g','<g>':'/<g>/g','<q>':'/<q>/g','<num>':'/<num>/g','<a>':'/<a>/g'];
              //var nexT = ['</u>':/<u>/g,'</g>':/<\/g>/g,'</q>':/<\/q>/g,'</num>':'<\/num>/g,'</a>':/<\/a>/g];
              //strNew = strNew.replace(regex,'<span class='+classArray[o]+'>').replace('</'+tarName+'>','</span>');
              if (tarName == 'num') {
                strNew = strNew.replace(regex1, '<span class=' + classArray[o] + '>x').replace(regex2, '</span>');
              } else {
                strNew = strNew.replace(regex1, '<span class=' + classArray[o] + '>').replace(regex2, '</span>');
              }
            }
            if (i == 1 || i == 3 || i == 9) {
              var nnstr = strNew.substring(isIn, strNew.length);
              var tnextid = nnstr.indexOf('>');
              var tid = strNew.substring(isIn, tnextid);
              var tarName = o.substring(1, o.length - 1);
              strNew = strNew.replace('&lt;' + tarName + tid + '&lt;',
                '<span class="' + classArray[tarName] + ' ' + classArray[tarName] + tid + tarName + tid + '"">');
              strNew = strNew.replace('&lt;/' + tarName + '&gt;', '</span>');
            }
            if (i == 6) {
              var regexp = new RegExp(/<i([0-9]{1})>/);
              var icp = regexp.exec(strNew);
              if (icp) {
                var level = icp[1]
              }
              strNew = strNew.replace('<i' + level + '>', '<span itemlevel="' + level + '" class=itemlevel' + level + '>');
              //strNew = strNew.replace('&lt;/i&ht;',"</span>");
              strNew = strNew.replace('</i>', "</span>");
            }

            if (i == 4) { //将道具替换为图片
              var regexp = new RegExp(/(iicon)[0-9]+/);
              var regexp2 = new RegExp(/(<iicon)[0-9]+(>)/);
              var icp = regexp.exec(strNew);
              if (icp) {
                itid = icp[0].replace("iicon", "");
              }
              strNew = strNew.replace(regexp2, '<img itemid=' + itid + ' src=' + window.resUrl + 'item/' + itid + '/50?png>');
            }
          }
        });
        var flashId = strNew.match(/<w::flashid>(\d+?)<\/w>/);
        if (flashId) {
          flashId = flashId[1] * 1;
          if (flashId > 0) {
            this.module('flash', function(module) {
              if (module) {
                module.show(flashId, itid);
              }
            });
          }
        }
        //所有<w::这种标签全部都不显示
        strNew = strNew.replace(/<w::.*?\/w>/g, '');
        strLast = strNew;
        var isScreen = position ? position.substring(2, 3) : 0; //刷屏？置顶？
        if (isScreen > 2) { //置顶
          //var strNew2 = strNew.substring(strNew.indexOf('X')+1,strNew.length);
          self.showFixedTop(strTime, strNew);
        }
        if (position && position.substring(3, 4) > 0) { //跑马灯展示
          paomadeng = position.substring(3, 4);
          var userid = '1'; //需要用户id来显示头像
          var regexp1 = new RegExp(/(uicon)[0-9]+/);
          var regexp2 = new RegExp(/(<uicon)[0-9]+(>)/);
          var itemlevel = 1;
          var icp = regexp1.exec(strLast);
          if (icp) {
            userid = icp[0].replace("uicon", "");
          }
          var angel = 0;
          if (strArr[0].indexOf('<angel1>') > -1) {
            angel = 1;
          }
          if (strArr[0].indexOf('<angel2>') > -1) {
            angel = 2;
          }
          itemlevel = parseInt(strNew.substring(strNew.indexOf('<span itemlevel="') + 17, strNew.indexOf('" class=itemlevel')));
          itemid = itemlevel ? itemlevel : 1;
          //self.showInPop(strLast,userid,angel,paomadeng,itemid);
          globalUtil.queuePao.defer(function(callback) {
            self.showInPop(strLast, userid, angel, paomadeng, itemid, itid, function() {
              callback(null, 1);
            });
          });

        }
        if (position && position.substring(4, 5) > 0) { //动画展示
          var ani = position && position.substring(4, 5);
          globalUtil.queueAni.defer(function(callback) {
            callback(null, 1);
          });
        }
        if (position && position.substring(5, 6) != 0) { //显示在聊天室中
          var regexp1 = new RegExp(/(uicon)[0-9]+/);
          var icp = regexp1.exec(strNew);
          var userid = '1000000277';
          if (icp) {
            userid = icp[0].replace("uicon", "");
            strNew = strNew.replace(/<uicon\d+?>/, '');
          }
          self.showInChat(strTime, strNew, userid);
        }

        if (isScreen && (isScreen == 2 || isScreen == 5)) { //刷屏
          var strScreen = strArr[0].replace(/&lt;/g, '<').replace(/&gt;/g, '>');

          var sindex = strNew.indexOf('<span class=unum>'); //道具图片数量
          var strNew1 = strNew.substring(0, sindex); //刷屏文字前半截
          var times = parseInt(strScreen.substring(strScreen.indexOf('<num>') + 5, strScreen.indexOf('</num>'))); //显示次数

          if (times && times > 0) {
            var strRefreshScreen = '';
            for (var qc = 1; qc <= times; qc++) {
              strRefreshScreen += '<li><em>' + strTime + '</em>' + strNew1 + 'x' + qc + (qc == times ? '(共' + times + '个)' : '') + '</li>##';
              // strNew += strNew1 + 'x' + qc
              // if (qc == 1) {
              //   strNew += '(共' + times + '个)';
              // }
              // strNew += '</li>';
            }
            return strRefreshScreen;
          }
        }
      }
      if (position && ((position.substring(2, 3) == 1) || (isScreen == 2 || isScreen == 5)) && strNew) {
        return '<li><em>' + strTime + '</em>' + strNew + '</li>';
      } else {
        return '';
      }
    }
  });
  return View;
});