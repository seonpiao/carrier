define(["libs/client/views/base", "libs/client/chat/icomet", "libs/client/chat/json2", "libs/client/scrollbar/jquery.tinyscrollbar", "models/girlList", "models/userInfo", "models/girls", "models/feedHistory"], function(Base, ICOMET, JSON2, SCROLLBAR, girlList, userInfo, girls, feedHistory) {
  var comet;
  var View = Base.extend({
    moduleName: "chat",
    template: 'index',
    events: {
      // 'click .chat_viewer_tab li': 'chatTab',
      'focus #recv_chat_window': '',
      'blur #recv_chat_window': '',
      'click #post': 'post_chat',
      'submit .chat_form': 'send_chat',
      'keydown #chat_text': 'writeInputText',
      'click #btnlol.emoticon': 'showDropDown',
      'click .chat_viewer_tab li': 'switchChannel'
    },
    init: function() {
      var self = this;
      self.girlid = this.$el.parent().attr('data-girlid') || window.girlid;
      this.channelid = self.girlid;
      this.contentPoint = 0;
      this.contentList = this.contentList || [];
      girlList.cache(function() {
        self.girlList = _.map(girlList.toJSON(), function(item) {
          return item.name;
        });
        var ids = _.map(girlList.toJSON(), function(item) {
          return item.id;
        });
        girls.cache({
          data: {
            girlid: ids
          }
        }, function() {
          self.girlNameList = _.map(girls.toJSON(), function(item) {
            return item.talkname;
          });
          self.initChat();
          self.loadHistory(function() {
            self.join();
          });
        });
      });
      this.listenTo(feedHistory, 'sync', this.showHistory.bind(this));
    },
    switchChannel: function(e) {
      var $target = $(e.currentTarget);
      $target.siblings().removeClass('on');
      $target.addClass('on');
      if (comet) {
        comet.stop();
      }
      var signUrl;
      if (this.$el.attr('data-sign') != '0') {
        signUrl = this.base.sign_url;
      }
      this.channelid = ($target.attr('data-channel') === 'world' ? '0' : this.girlid);
      var self = this;
      comet = new iComet({
        channel: 'girl_' + this.channelid,
        signUrl: signUrl,
        subUrl: this.base.sub_url,
        pubUrl: this.base.pub_url,
        callback: function(content) {
          self.msgCb(content)
        }
      });
      this.$('.overview').html('');
      feedHistory.fetch({
        data: {
          girlid: this.channelid
        }
      });
    },
    render: function() {

    },
    showHistory: function(model) {
      var data = model.toJSON();
      var talk = data.talk;
      var self = this;
      _.each(talk, function(item) {
        try {
          item = decodeURIComponent(item);
          var msg = JSON.parse(item);
          self.addmsg(msg.uid ? msg.uid : '', msg.nickname, item, true);
        } catch (e) {}
      });
    },
    loadHistory: function(callback) {
      var self = this;
      feedHistory.cache(function() {
        self.showHistory(feedHistory);
        if (callback) {
          callback();
        }
      });
    },
    initChat: function() {
      var self = this;
      // $('.chat_viewer_tab li').click(function(e) {
      //   self.chatTab(e);
      // });
      //bind mouse out event to automatically close the menu
      if (this.$('.chat_bottom').length > 0) {
        this.$("#emoticonDropDown").bind("mouseleave", function() {
          self.hideDropDown();
        });
        this.$("#emoticonDropDown *").click(function(event) {
          event.stopPropagation(); //this is needed to prevent the reply area to collapse on click outside it
        });

        this.$('.chat_wiew .chat_text,.chat_wiew .chatText,.chat_wiew .chat_holder').click(function(e) {
          self.$('.chat_wiew .chat_holder').hide();
          self.$('.chat_wiew .chatText').focus();
          e.stopPropagation();
        });
        this.$('#recv_chat_window').focus(function(e) {

        }).blur(function(e) {
          if ($.trim($(this).text()) == '') {
            $(this).val('')
            self.$('.chat_wiew .chat_holder').show();
          }
        });
        this.chat_box_scrollbar = this.$('#chat_box_scrollbar').tinyscrollbar({
          trackSize: parseInt(this.$('#chat_box_scrollbar .viewport').attr('sh')) - 4
        });
      } else {
        this.chat_box_scrollbar = this.$('#chat_box_scrollbar').tinyscrollbar({
          trackSize: parseInt(this.$('#chat_box_scrollbar .viewport').attr('sh')) - 4
        });
      }

    },
    chatTab: function(e) {
      if (!$(e.target).hasClass('on')) {
        $(e.target).addClass('on').siblings('li').removeClass('on');
        this.$('.chat_wiew.hide').removeClass('hide').siblings('.chat_wiew').addClass('hide');
        this.$('.chat_wiew:visible .scroll_up').click();
        this.$('.saySingle').remove();
      }
    },
    getCharLen: function(str) {
      var str_temp = str.replace(/[\u4e00-\u9fa5]/g, 'aa') //将汉字替换为aa  
      return str_temp.length;
    },
    htmlEntities: function(str) { // misc func
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
    sleep: function(time, el) {
      setTimeout(el, time);
    },
    insertString: function(tbid, str) {
      var tb = document.getElementById(tbid);
      tb.focus();
      if (document.all) {
        var r = document.selection.createRange();
        document.selection.empty();
        r.text = str;
        r.collapse();
        r.select();
      } else {
        var newstart = tb.selectionStart + str.length;
        tb.value = tb.value.substr(0, tb.selectionStart) + str + tb.value.substring(tb.selectionEnd);
        tb.selectionStart = newstart;
        tb.selectionEnd = newstart;
      }
    },
    emoticonBaseUrl: resUrl + 'orig/images/emotions/',
    emoticonsUrl: function(item, size, imgName) {
      var imgUrl = apiUrl + 'orig/images/emotions/' + item + '/' + size + '/' + imgName + '.png';
      return imgUrl;
    },
    emoticonsArr: function() {
      var arr = [];
      var emotions = this.emoticons.vip.concat(this.emoticons.angel.concat(this.emoticons.defaults));
      $.each(emotions, function(p, q) {
        arr[q.meta] = q;
      });
      return arr;
    },
    emoticons: {
      'vip': [{
        "id": "emoji331",
        "meta": "+.+||vip",
        "src": "vip/40/emoji331.png"
      }, {
        "id": "emoji302",
        "meta": "2333||vip",
        "src": "vip/40/emoji302.png"
      }, {
        "id": "emoji303",
        "meta": "2B美男",
        "src": "vip/40/emoji303.png"
      }, {
        "id": "emoji305",
        "meta": "xd||vip",
        "src": "vip/40/emoji305.png"
      }, {
        "id": "emoji306",
        "meta": "亲亲",
        "src": "vip/40/emoji306.png"
      }, {
        "id": "emoji307",
        "meta": "傻笑||vip",
        "src": "vip/40/emoji307.png"
      }, {
        "id": "emoji308",
        "meta": "冷笑||vip",
        "src": "vip/40/emoji308.png"
      }, {
        "id": "emoji309",
        "meta": "吹泡泡||vip",
        "src": "vip/40/emoji309.png"
      }, {
        "id": "emoji310",
        "meta": "呕||vip",
        "src": "vip/40/emoji310.png"
      }, {
        "id": "emoji311",
        "meta": "啊||vip",
        "src": "vip/40/emoji311.png"
      }, {
        "id": "emoji312",
        "meta": "啊美女||vip",
        "src": "vip/40/emoji312.png"
      }, {
        "id": "emoji313",
        "meta": "喵喵||vip",
        "src": "vip/40/emoji313.png"
      }, {
        "id": "emoji314",
        "meta": "嘻嘻||vip",
        "src": "vip/40/emoji314.png"
      }, {
        "id": "emoji315",
        "meta": "小样||vip",
        "src": "vip/40/emoji315.png"
      }, {
        "id": "emoji316",
        "meta": "小跑||vip",
        "src": "vip/40/emoji316.png"
      }, {
        "id": "emoji317",
        "meta": "心塞||vip",
        "src": "vip/40/emoji317.png"
      }, {
        "id": "emoji318",
        "meta": "惊讶||vip",
        "src": "vip/40/emoji318.png"
      }, {
        "id": "emoji319",
        "meta": "想一想||vip",
        "src": "vip/40/emoji319.png"
      }, {
        "id": "emoji320",
        "meta": "憨笑||vip",
        "src": "vip/40/emoji320.png"
      }, {
        "id": "emoji321",
        "meta": "文艺美男||vip",
        "src": "vip/40/emoji321.png"
      }, {
        "id": "emoji322",
        "meta": "春风满面||vip",
        "src": "vip/40/emoji322.png"
      }, {
        "id": "emoji323",
        "meta": "泪流满面||vip",
        "src": "vip/40/emoji323.png"
      }, {
        "id": "emoji324",
        "meta": "白日梦||vip",
        "src": "vip/40/emoji324.png"
      }, {
        "id": "emoji325",
        "meta": "目瞪口呆||vip",
        "src": "vip/40/emoji325.png"
      }, {
        "id": "emoji326",
        "meta": "美男子||vip",
        "src": "vip/40/emoji326.png"
      }, {
        "id": "emoji327",
        "meta": "脸红||vip",
        "src": "vip/40/emoji327.png"
      }, {
        "id": "emoji328",
        "meta": "衰||vip",
        "src": "vip/40/emoji328.png"
      }, {
        "id": "emoji329",
        "meta": "要死啊||vip",
        "src": "vip/40/emoji329.png"
      }, {
        "id": "emoji330",
        "meta": "认真的||vip",
        "src": "vip/40/emoji330.png"
      }],
      'angel': [{
        "id": "emoji501",
        "meta": "不屑||angel",
        "src": "angel/40/emoji501.png"
      }, {
        "id": "emoji502",
        "meta": "不差钱||angel",
        "src": "angel/40/emoji502.png"
      }, {
        "id": "emoji503",
        "meta": "不服来战||angel",
        "src": "angel/40/emoji503.png"
      }, {
        "id": "emoji504",
        "meta": "不爽||angel",
        "src": "angel/40/emoji504.png"
      }, {
        "id": "emoji505",
        "meta": "不错哟||angel",
        "src": "angel/40/emoji505.png"
      }, {
        "id": "emoji506",
        "meta": "中枪||angel",
        "src": "angel/40/emoji506.png"
      }, {
        "id": "emoji507",
        "meta": "买不起么||angel",
        "src": "angel/40/emoji507.png"
      }, {
        "id": "emoji508",
        "meta": "任性||angel",
        "src": "angel/40/emoji508.png"
      }, {
        "id": "emoji509",
        "meta": "你妹||angel",
        "src": "angel/40/emoji509.png"
      }, {
        "id": "emoji510",
        "meta": "僵尸||angel",
        "src": "angel/40/emoji510.png"
      }, {
        "id": "emoji511",
        "meta": "卖萌||angel",
        "src": "angel/40/emoji511.png"
      }, {
        "id": "emoji512",
        "meta": "发呆||angel",
        "src": "angel/40/emoji512.png"
      }, {
        "id": "emoji513",
        "meta": "吐||angel",
        "src": "angel/40/emoji513.png"
      }, {
        "id": "emoji514",
        "meta": "吼吼||angel",
        "src": "angel/40/emoji514.png"
      }, {
        "id": "emoji515",
        "meta": "呃||angel",
        "src": "angel/40/emoji515.png"
      }, {
        "id": "emoji516",
        "meta": "呲牙||angel",
        "src": "angel/40/emoji516.png"
      }, {
        "id": "emoji517",
        "meta": "哼||angel",
        "src": "angel/40/emoji517.png"
      }, {
        "id": "emoji518",
        "meta": "啵||angel",
        "src": "angel/40/emoji518.png"
      }, {
        "id": "emoji519",
        "meta": "喜极而泣||angel",
        "src": "angel/40/emoji519.png"
      }, {
        "id": "emoji520",
        "meta": "喵喵喵||angel",
        "src": "angel/40/emoji520.png"
      }, {
        "id": "emoji521",
        "meta": "嗯||angel",
        "src": "angel/40/emoji521.png"
      }, {
        "id": "emoji522",
        "meta": "囧2||angel",
        "src": "angel/40/emoji522.png"
      }, {
        "id": "emoji523",
        "meta": "困||angel",
        "src": "angel/40/emoji523.png"
      }, {
        "id": "emoji524",
        "meta": "坑爹啊||angel",
        "src": "angel/40/emoji524.png"
      }, {
        "id": "emoji525",
        "meta": "大叔||angel",
        "src": "angel/40/emoji525.png"
      }, {
        "id": "emoji526",
        "meta": "大哭||angel",
        "src": "angel/40/emoji525.png"
      }, {
        "id": "emoji527",
        "meta": "大怒||angel",
        "src": "angel/40/emoji527.png"
      }, {
        "id": "emoji528",
        "meta": "大笑||angel",
        "src": "angel/40/emoji528.png"
      }, {
        "id": "emoji529",
        "meta": "好棒||angel",
        "src": "angel/40/emoji529.png"
      }, {
        "id": "emoji530",
        "meta": "娇羞||angel",
        "src": "angel/40/emoji530.png"
      }, {
        "id": "emoji531",
        "meta": "孤独一生||angel",
        "src": "angel/40/emoji531.png"
      }, {
        "id": "emoji532",
        "meta": "小得意||angel",
        "src": "angel/40/emoji532.png"
      }, {
        "id": "emoji533",
        "meta": "小跑||angel",
        "src": "angel/40/emoji533.png"
      }, {
        "id": "emoji534",
        "meta": "小鸡冻||angel",
        "src": "angel/40/emoji534.png"
      }, {
        "id": "emoji535",
        "meta": "尼玛||angel",
        "src": "angel/40/emoji535.png"
      }, {
        "id": "emoji536",
        "meta": "开心||angel",
        "src": "angel/40/emoji536.png"
      }, {
        "id": "emoji537",
        "meta": "得意||angel",
        "src": "angel/40/emoji537.png"
      }, {
        "id": "emoji538",
        "meta": "您说的对||angel",
        "src": "angel/40/emoji538.png"
      }, {
        "id": "emoji539",
        "meta": "惊了||angel",
        "src": "angel/40/emoji539.png"
      }, {
        "id": "emoji540",
        "meta": "我愿意||angel",
        "src": "angel/40/emoji540.png"
      }, {
        "id": "emoji541",
        "meta": "我擦嘞||angel",
        "src": "angel/40/emoji541.png"
      }, {
        "id": "emoji542",
        "meta": "手舞足蹈||angel",
        "src": "angel/40/emoji542.png"
      }, {
        "id": "emoji543",
        "meta": "抓狂||angel",
        "src": "angel/40/emoji543.png"
      }, {
        "id": "emoji544",
        "meta": "敞亮人||angel",
        "src": "angel/40/emoji544.png"
      }, {
        "id": "emoji545",
        "meta": "无神||angel",
        "src": "angel/40/emoji545.png"
      }, {
        "id": "emoji546",
        "meta": "无聊||angel",
        "src": "angel/40/emoji546.png"
      }, {
        "id": "emoji547",
        "meta": "无语||angel",
        "src": "angel/40/emoji547.png"
      }, {
        "id": "emoji548",
        "meta": "晕||angel",
        "src": "angel/40/emoji548.png"
      }, {
        "id": "emoji549",
        "meta": "晕了||angel",
        "src": "angel/40/emoji549.png"
      }, {
        "id": "emoji550",
        "meta": "木偶||angel",
        "src": "angel/40/emoji550.png"
      }, {
        "id": "emoji551",
        "meta": "棒棒糖||angel",
        "src": "angel/40/emoji551.png"
      }, {
        "id": "emoji552",
        "meta": "泪眼汪汪||angel",
        "src": "angel/40/emoji552.png"
      }, {
        "id": "emoji553",
        "meta": "洗澡澡||angel",
        "src": "angel/40/emoji553.png"
      }, {
        "id": "emoji554",
        "meta": "流鼻血||angel",
        "src": "angel/40/emoji554.png"
      }, {
        "id": "emoji555",
        "meta": "目瞪口呆||angel",
        "src": "angel/40/emoji555.png"
      }, {
        "id": "emoji556",
        "meta": "睡觉||angel",
        "src": "angel/40/emoji556.png"
      }, {
        "id": "emoji557",
        "meta": "笑||angel",
        "src": "angel/40/emoji557.png"
      }, {
        "id": "emoji558",
        "meta": "纳尼||angel",
        "src": "angel/40/emoji558.png"
      }, {
        "id": "emoji559",
        "meta": "美滋滋||angel",
        "src": "angel/40/emoji559.png"
      }, {
        "id": "emoji560",
        "meta": "色眯眯||angel",
        "src": "angel/40/emoji560.png"
      }, {
        "id": "emoji561",
        "meta": "色眯眯2||angel",
        "src": "angel/40/emoji561.png"
      }, {
        "id": "emoji562",
        "meta": "荷包蛋||angel",
        "src": "angel/40/emoji562.png"
      }, {
        "id": "emoji563",
        "meta": "萌萌哒||angel",
        "src": "angel/40/emoji563.png"
      }, {
        "id": "emoji564",
        "meta": "蛇精病||angel",
        "src": "angel/40/emoji564.png"
      }, {
        "id": "emoji565",
        "meta": "裸奔||angel",
        "src": "angel/40/emoji565.png"
      }, {
        "id": "emoji566",
        "meta": "跪了||angel",
        "src": "angel/40/emoji566.png"
      }, {
        "id": "emoji567",
        "meta": "邪恶||angel",
        "src": "angel/40/emoji567.png"
      }, {
        "id": "emoji568",
        "meta": "酷||angel",
        "src": "angel/40/emoji568.png"
      }, {
        "id": "emoji569",
        "meta": "闭嘴||angel",
        "src": "angel/40/emoji569.png"
      }, {
        "id": "emoji570",
        "meta": "震惊||angel",
        "src": "angel/40/emoji570.png"
      }, {
        "id": "emoji571",
        "meta": "靠||angel",
        "src": "angel/40/emoji571.png"
      }],
      'defaults': [{
        "id": "emoji11.gif",
        "meta": "惊呆",
        "src": "defaults/28/emoji11.gif"
      }, {
        "id": "emoji12.gif",
        "meta": "嘻嘻",
        "src": "defaults/28/emoji12.gif"
      }, {
        "id": "emoji13.gif",
        "meta": "呜呜",
        "src": "defaults/28/emoji13.gif"
      }, {
        "id": "emoji14.gif",
        "meta": "流泪",
        "src": "defaults/28/emoji14.gif"
      }, {
        "id": "emoji15.gif",
        "meta": "瞪眼",
        "src": "defaults/28/emoji15.gif"
      }, {
        "id": "emoji16.gif",
        "meta": "囧",
        "src": "defaults/28/emoji16.gif"
      }, {
        "id": "emoji17.gif",
        "meta": "发呆",
        "src": "defaults/28/emoji17.gif"
      }, {
        "id": "emoji18.gif",
        "meta": "震惊",
        "src": "defaults/28/emoji18.gif"
      }, {
        "id": "emoji19.gif",
        "meta": "得意",
        "src": "defaults/28/emoji19.gif"
      }, {
        "id": "emoji110.gif",
        "meta": "开心",
        "src": "defaults/28/emoji110.gif"
      }, {
        "id": "emoji111.gif",
        "meta": "微笑",
        "src": "defaults/28/emoji111.gif"
      }, {
        "id": "emoji112.gif",
        "meta": "X_X",
        "src": "defaults/28/emoji112.gif"
      }, {
        "id": "emoji113.gif",
        "meta": "竖线",
        "src": "defaults/28/emoji113.gif"
      }, {
        "id": "emoji114.gif",
        "meta": "晕",
        "src": "defaults/28/emoji114.gif"
      }, {
        "id": "emoji115.gif",
        "meta": "=_=",
        "src": "defaults/28/emoji115.gif"
      }, {
        "id": "emoji116.gif",
        "meta": "惊吓",
        "src": "defaults/28/emoji116.gif"
      }, {
        "id": "emoji117.gif",
        "meta": "生气",
        "src": "defaults/28/emoji117.gif"
      }, {
        "id": "emoji118.gif",
        "meta": "汗",
        "src": "defaults/28/emoji118.gif"
      }, {
        "id": "emoji119.gif",
        "meta": "XD",
        "src": "defaults/28/emoji119.gif"
      }, {
        "id": "emoji120.gif",
        "meta": "兴奋",
        "src": "defaults/28/emoji120.gif"
      }, {
        "id": "emoji121.gif",
        "meta": "鼻血",
        "src": "defaults/28/emoji121.gif"
      }, {
        "id": "emoji122.gif",
        "meta": "脸红",
        "src": "defaults/28/emoji122.gif"
      }, {
        "id": "emoji123.gif",
        "meta": "不甘心",
        "src": "defaults/28/emoji123.gif"
      }, {
        "id": "emoji124.gif",
        "meta": "高冷",
        "src": "defaults/28/emoji124.gif"
      }, {
        "id": "emoji125.gif",
        "meta": "小拽",
        "src": "defaults/28/emoji125.gif"
      }, {
        "id": "emoji126.gif",
        "meta": "难过",
        "src": "defaults/28/emoji126.gif"
      }, {
        "id": "emoji127.gif",
        "meta": "撇嘴",
        "src": "defaults/28/emoji127.gif"
      }, {
        "id": "emoji128.gif",
        "meta": "白日梦",
        "src": "defaults/28/emoji128.gif"
      }, {
        "id": "emoji129.gif",
        "meta": "坑爹",
        "src": "defaults/28/emoji129.gif"
      }, {
        "id": "emoji130.gif",
        "meta": "疑问",
        "src": "defaults/28/emoji130.gif"
      }, {
        "id": "emoji131.gif",
        "meta": "天使同学",
        "src": "defaults/28/emoji131.gif"
      }]
    },
    getMeta: function(meta) {
      var ii = meta.indexOf('||');
      return ii > -1 ? meta.substring(0, ii) : meta
    },
    createChatDiv: function(btn) {
      var self = this;
      var tdiv = this.$('#emoticonDropDown');
      var str = '<div class="emotionDropDownInner cl">' + '<div class="emoticonsArea scrollbars" item="defaults" style="display:block" id="emotionBarsDefaults">' + '<div class="scrollbar"><div class="scroll_up"></div><div class="track"><div class="thumb"><div class="thumb_end"></div></div></div><div class="scroll_down"></div></div>' + '<div class="viewport cl"><div class="overview">' + '</div></div></div>' + '<div class="emoticonsArea scrollbars emoticonsArea40" item="vip" style="display:none" id="emotionBarsVip">' + '<div class="scrollbar"><div class="scroll_up"></div><div class="track"><div class="thumb"><div class="thumb_end"></div></div></div><div class="scroll_down"></div></div>' + '<div class="viewport cl"><div class="overview">' + '</div></div></div>' + '<div class="emoticonsArea scrollbars emoticonsArea40" item="angel" style="display:none" id="emotionBarsAngel">' + '<div class="scrollbar"><div class="scroll_up"></div><div class="track"><div class="thumb"><div class="thumb_end"></div></div></div><div class="scroll_down"></div></div>' + '<div class="viewport cl"><div class="overview">' + '</div></div></div>' + '<div class="emoticonsTab cl"><a href="javascript:;" class="hover" item="defaults">默认表情</a><a href="javascript:;" item="vip">vip表情</a><a href="javascript:;" item="angel">天使表情</a></div>'
      str += '</div>'
      tdiv.append(str);
      var usrInfo = globalUtil.userInfo;
      $.each(self.emoticons.defaults, function(i, o) {
        var meta = self.getMeta(o.meta);
        var aa = $('<a>', {
          'href': 'javascript:;',
          'title': meta
        }).appendTo($('.emoticonsArea[item=defaults] .overview'));
        var img = $('<img>', {
          'txt': o.meta,
          'src': self.emoticonBaseUrl + o.src,
          'alt': meta,
          'title': meta,
          click: function(e) {
            e.preventDefault();
            self.chooseEmo(this);
          }
        }).appendTo(aa);
      });
      $.each(self.emoticons.vip, function(i, o) {
        var meta = self.getMeta(o.meta);
        var aa = $('<a>', {
          'href': 'javascript:;',
          'title': meta
        }).appendTo($('.emoticonsArea[item=vip] .overview'));
        var img = $('<img>', {
          'txt': o.meta,
          'src': self.emoticonBaseUrl + o.src,
          'alt': meta,
          'title': meta,
          click: function(e) {
            e.preventDefault();
            var _self = this;
            var uu = globalUtil.userInfo;
            if (uu) {
              self.sendEmo(_self, 'vip');
            } else {
              self.module('sign', function(sign) {
                if (sign) {
                  sign.showSignModel('login', function() {
                    self.sendEmo(_self, 'vip');
                  });
                }
              });
            }
          }
        }).appendTo(aa);
      });
      $.each(self.emoticons.angel, function(i, o) {
        var meta = self.getMeta(o.meta);
        var aa = $('<a>', {
          'href': 'javascript:;',
          'title': meta
        }).appendTo($('.emoticonsArea[item=angel] .overview'));
        var img = $('<img>', {
          'txt': o.meta,
          'src': self.emoticonBaseUrl + o.src,
          'alt': meta,
          'title': meta,
          click: function(e) {
            e.preventDefault();
            var _self = this;
            var uu = globalUtil.userInfo;
            if (uu) {
              self.sendEmo(_self, 'angel');
            } else {
              self.module('sign', function(sign) {
                if (sign) {
                  sign.showSignModel('login', function() {
                    self.sendEmo(_self, 'angel');
                  });
                }
              });
            }
          }
        }).appendTo(aa);
      });
      btn.addClass('isload');
    },
    chooseEmo: function(obj, item) {
      var self = this;
      var uu = globalUtil.userInfo;
      if (uu) {

      }
      self.insertString('chat_text', '[' + $(obj).attr('alt') + ']');
      this.$('.chat_text .chat_holder').hide();
      this.$('#chat_text').focus();
    },
    sendEmo: function(obj, item) { //直接发送表情到服务器
      var self = this;
      var meta = $(obj).attr('txt');
      var uu = globalUtil.userInfo;
      if ((uu && item == 'angel' && uu.usrangel != '0') || (uu && item == 'vip' && uu.usrvip == '1')) {
        self.msg = {
          'uid': uu.ssoid,
          'nickname': uu.usrnick,
          'content': '[' + meta + ']'
        };
        comet.pub(self.msg.content);
        self.hideDropDown();
      } else {
        item == 'angel' ? self.showBuyAngel() : self.showBuyVip();

      }
    },
    activeTextAreaId: '',
    showDropDown: function() {
      var self = this;
      this.$('.emoticon').addClass('hover');
      self.activeTextAreaId = 'text';
      var thisBtn = this.$("#btnlol");
      var buttonPosition = thisBtn.position();
      if (!thisBtn.hasClass('isload')) {
        self.createChatDiv(thisBtn);
      }
      this.$("#emoticonDropDown").css({
        left: buttonPosition.left,
        top: buttonPosition.top - this.$("#emoticonDropDown").outerHeight() - 12
      });
      this.$("#emoticonDropDown").find('.emoticonsTab a').click(function() {
        var item = $(this).attr('item');
        if (!$(this).hasClass('hover')) {
          $(this).addClass('hover').siblings('a').removeClass('hover');
          var $area = self.$('#emoticonDropDown .emoticonsArea[item=' + item + ']');
          $area.show().siblings('.emoticonsArea').hide();
          $area.data('plugin_tinyscrollbar').update('top');
        }
      });
      this.$("#emoticonDropDown").fadeIn();
      this.$('#emotionBarsDefaults').tinyscrollbar({
        trackSize: 136
      });
      this.$('#emotionBarsVip').tinyscrollbar({
        trackSize: 136
      });
      this.$('#emotionBarsAngel').tinyscrollbar({
        trackSize: 136
      });
    },
    hideDropDown: function() {
      this.$('.emoticon').removeClass('hover');
      this.$("#emoticonDropDown").fadeOut();
    },
    insertSmiley: function(smiley) {
      this.$("#emoticonDropDown").fadeOut();
      var x = $("#" + this.activeTextAreaId);
      x.val(x.val() + " " + smiley + " ").focus();
    },
    toemote: function(content, format) {
      for (var i = 0; i < self.emoticons.length; i++) {
        for (var p = 0; p < self.emoticons[i].pattern.length; p++) {
          content = content.replace(new RegExp(self.emoticons[i].pattern[p].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "g"), format.replace("$$EMOTE$$", self.emoticons[i].css));
        }
      }

      return content
    },
    convertToLinks: function(text) {
      var replaceText,
        replacePattern1;

      //URLs starting with http://, https://
      replacePattern1 = /(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig;
      replacedText = text.replace(replacePattern1, '<a class="colored-link-1" title="$1" href="$1" target="_blank">$1</a>');

      //URLs starting with "www."
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a class="colored-link-1" href="http://$2" target="_blank">$2</a>');

      //returns the text result
      return replacedText;
    },
    flashTitle: function(initial, to) {
      var self = this;
      if (document.title == initial)
        document.title = to;
      else
        document.title = initial;

      if (self.isTabOpen == 1) {
        document.title = initial;
        return 0;
      }
      self.sleep(800, function() {
        self.flashTitle(initial, to)
      });
    },
    random_str: function(size) {
      size = size || 20;
      var time = (new Date().getTime() + '').substr(3);
      var channel = time + Math.random() + '';
      return channel.replace('.', '').substr(0, size);
    },
    msgs: [],
    isTabOpen: 0,
    timer: 0,
    getTimeCurr: function() {
      var d = new Date();
      var h = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();
      var m = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
      return h + ':' + m
    },
    transformStr: function(str) { //转换消息
      var strNew = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>') //.substring(8,str.length);
      strNew = strNew.replace('<mc>', '<span class="mcname">').replace('</mc>', '</span>');
      strNew = strNew.replace('<re>', '<span class="rename">').replace('</re>', '</span>'); //成就名称
      strNew = strNew.replace('<t>', '<span class="taskname">').replace('</t>', '</span>'); //任务名称
      strNew = strNew.replace('<vip>', '<img width="18" src="' + window.resUrl + 'orig/images/vip.png">') //显示vip
      strNew = strNew.replace('<girl>', '<img width="18" src="' + window.resUrl + 'orig/images/girl.png">') //显示女神
      strNew = strNew.replace('<assist>', '<img width="18" src="' + window.resUrl + 'orig/images/assist.png">') //显示小管家
      strNew = strNew.replace('<angel>', '<img src="' + window.resUrl + 'orig/images/flying1.png" style="height:15px;">') //白银天使
      strNew = strNew.replace('<angel1>', '<img src="' + window.resUrl + 'orig/images/flying1.png" style="height:15px;">') //白银天使
      strNew = strNew.replace('<angel2>', '<img src="' + window.resUrl + 'orig/images/flying2.png" style="height:15px;">') //黄金天使
        //strNew = strNew.replace('进入女神房间','<span class="grayText">进入女神房间</span>')
      return strNew;
    },
    transformChat: function(chat) { //转换消息内容
      var self = this;
      var chat_word = JSON.parse(chat);
      var contentStr = '';
      var unameClass = 'uname';
      var realName = chat_word.nickname.replace(/&lt;.*?&gt;/g, '');
      var girlNameList = this.girlNameList;
      if ((girlNameList.indexOf(realName) != -1)) {
        unameClass = 'pinkText';
        chat_word.nickname = chat_word.nickname.replace(/&lt;vip&gt;/, '&lt;girl&gt;');
      }
      if ((this.girlList.indexOf(realName.replace('的小管家', '')) != -1)) {
        unameClass = 'pinkText';
        chat_word.nickname = chat_word.nickname.replace(/&lt;vip&gt;/, '&lt;assist&gt;');
      }
      contentStr += '<span class="' + unameClass + ' chat_nickname chat_icons" onclick="self.showSingle(this)">' + self.transformStr(chat_word.nickname) + '</span>：' + '<span class="chat_word">' + chat_word.content + '</span>'
      return self.chatformEmotions(contentStr)
    },
    chatformEmotions: function(str) {
      var self = this;
      var emoArr = [];
      var strNew = str;
      var iflat = 0;
      var strleft = '';

      for (var i = 0; i < str.length; i++) {
        if (str[i] == '[') {
          iflat = i;
          strleft = str.substring(i, str.length);
          emoArr.push(strleft.substring(1, strleft.indexOf(']')));
        }
      };
      if (emoArr.length > 0) {
        var emotions = this.emoticons.vip.concat(this.emoticons.angel.concat(this.emoticons.defaults));
        var emotionsArr = []
        $.each(emotions, function(p, q) {
          emotionsArr[q.meta] = q;
        });
        $.each(emoArr, function(m, n) {
          var thisEmo = emotionsArr[n]
          var style = (thisEmo.meta.indexOf('||') > -1 ? ' style="height:40px;width:40px;max-height:40px;"' : ' style="height:28px;width:28px;max-height:28px;"')
          strNew = strNew.replace('[' + n + ']', '<img ' + style + ' src="' + self.emoticonBaseUrl + thisEmo.src + '" alt="' + self.getMeta(thisEmo.meta) + '" title="' + self.getMeta(thisEmo.meta) + '"/>')
        });
      }

      return strNew;
    },
    addmsg: function(euid, name, content, is) {
      var self = this;
      is = is || false
      var l = 'm' + (Math.random() + '').replace('.', '').substr(1, 6);
      try {
        var msg = JSON.parse(content);
        var html = '';
        var uid = (globalUtil.userInfo ? globalUtil.userInfo.ssoid : '')
          //if(globalUtil.userInfo){
        if (euid != uid || is) {
          if (euid == uid) {
            self.msgs[content] = l;
          }
          var angelid = 0
          if (name.indexOf('&lt;angel1&gt;') != -1) {
            angelid = 1
          }
          if (name.indexOf('&lt;angel2&gt;') != -1) {
            angelid = 2
          }
          var vipid = (name.indexOf('vip') > -1 ? 1 : 0)
          var udata = '{"ssoid":' + msg.uid + ',"usrnick":' + name.replace("&lt;angel1&gt;", "").replace("&lt;angel2&gt;", "").replace("&lt;vip&gt;", "") + ',"vip":' + vipid + ',"angel":' + angelid + '}'
          html += '<p data="' + udata + '"><em>' + msg.time.substring(0, 5) + '</em>';
          if ($.trim(content).split(" ")[0] == "/me") {
            html += '<span class="chat_names chat_icons">*</span>';
            html += '<span class="chat_content"><span class="chat_names">' + self.transformStr(name) + '</span> ' + self.transformChat(content) + '</span>';
          } else {
            html += '<span class="chat_content">' + self.transformChat(content) + '</span>'
          }
          html += "</p>";

          // self.flashTitle('您有新消息', '* 说 *');
          //}
        } else {
          this.$("#" + self.msgs[content]).removeClass("sent");
        }

        this.$('#chat_box').append(html);
        var ii = this.$('#chat_box p').length - 3000
        if (ii > 0) {
          this.$('#chat_box p:lt(' + ii + ')').remove();
        }
        self.chat_box_scrollbar_update('bottom');
      } catch (e) {

      }

      //this.$('#recv_chat_window').scrollTop(this.$('#recv_chat_window')[0].scrollHeight);
    },
    msgCb: function(msg_data) {
      var self = this;
      //解析获得的数据信息
      if (msg_data instanceof Array) {
        //
      } else {
        msg_data = [msg_data];
      }
      for (var k in msg_data) {
        var msg = msg_data[k];
        if (msg.type && msg.type == 'noop') { //noop时没有消息
          //self.addmsg(msg)
          return;
        }

        try { //如果是json格式，则加入聊天室信息
          var msg0 = JSON.parse(msg.content);
          self.addmsg(msg0.uid ? msg0.uid : '', msg0.nickname, msg.content, true);
        } catch (e) {
          self.module('feed', function(feed) {
            if (feed) {
              feed.icommet_show_feed(msg);
              feed.feed_scrollbar_update('bottom');
            }
          });
        }
        next_seq = parseInt(msg.seq) + 1;
        count++;
      }
      self.chat_box_scrollbar_update('bottom'); //update the chat_box scrollbar
    },
    base: {
      uid: 'u' + (Math.random() + '').replace('.', '').substr(1, 6),
      nickname: '',
      comet: null,
      app_host: 'ic.mm.' + window.domain,
      admin_host: 'ic.mm.' + window.domain,

      sign_url: 'http://ic.mm.' + window.domain + '/demo/web/php/sign.php',
      pub_url: 'http://ic.mm.' + window.domain + '/demo/web/php/push.php?cb=?',
      sub_url: 'http://ic.mm.' + window.domain + ':8100' + '/sub',
      roomid: '1',
      w: window,
      x: window.innerWidth,
      y: window.innerHeight
    },
    join: function() {
      var self = this;
      var channel = 'girl_' + this.channelid;
      var signUrl;
      if (this.$el.attr('data-sign') != '0') {
        signUrl = self.base.sign_url;
      }
      comet = new iComet({
        channel: channel,
        signUrl: signUrl,
        subUrl: self.base.sub_url,
        pubUrl: self.base.pub_url,
        callback: function(content) {
          self.msgCb(content)
        }
      });
      if (userInfo.get('username')) {
        this.sign();
      }
      self.stopListening(userInfo, 'change:username');
      self.listenTo(userInfo, 'change:username', function() {
        if (userInfo.get('username')) {
          self.sign();
        }
      });
    },
    sign: function() {
      var self = this;
      if (this.$el.attr('data-sign') != '0') {
        content = "100100100000";
        setTimeout(function() {
          comet.pub(content, self.msgCb);
        }, 1000);
      }
    },
    post_chat: function() {
      this.send_chat();
    },
    send_chat: function(e) { // 发送消息,送由服务器过滤
      var self = this;
      if (e) {
        e.preventDefault();
      }


      var t = this.$('#chat_text');
      var content = $.trim(t.val());
      content = self.htmlEntities(content);
      
      if (content.length == 0) {
        self.chatMsg('消息内容不能为空');
        return false;
      }
      if (self.getCharLen(content) > 180) {
        self.chatMsg('内容不能超过90个字');
        return false;
      }
      if (!self.chatTimer()) {
        self.chatMsg('您发送消息太频繁，请稍后再发');
        return false;
      }
      this.$('#chat_error_msg').remove();

      $.ajax({
        url: '/api/push',
        data: {
          cname: 'girl_' + this.channelid,
          content: content,
          username: JSON.parse(localStorage.roomMap)[this.girlid].username
        }
      });
      t.val('');
      if (self.contentList.length > 9) {
        self.contentList.pop();
      }
      self.contentList.push(content);
      self.contentPoint = self.contentList.length;

    },

    chat_box_scrollbar: null,
    chat_box_scrollbar_update: function(pos) { //手动更新滚动条位置
      //if(!this.chat_box_scrollbar){
      this.chat_box_scrollbar = this.$('#chat_box_scrollbar').tinyscrollbar()
        //}
        //if(!this.$('#chat_box_scrollbar .scrollbar').hasClass('disable')){
      var scrollbar = this.chat_box_scrollbar.data("plugin_tinyscrollbar");
      scrollbar.update(pos);
      //}

    },

    showSingle: function(obj) {
      var self = this;
      var tdiv = this.$(obj);
      var pdiv = tdiv.parent().parent();
      var data = pdiv.attr('data')
      this.$('.saySingle').remove();
      if (data) {
        data = JSON.parse(data);
        if (data.uid != uid) {
          var icons = pdiv.find('.chat_icons');
          var pos = tdiv.offset();
          var top = pos.top + 20,
            left = pos.left + 20;
          var skin = 'sayToNormal'
          if (icons.find('img[src*=flying1]')) {
            skin = 'sayToSilver'
          }
          if (icons.find('img[src*=flying2]')) {
            skin = 'sayToGolden'
          }
          var saystr = '<div class="saySingle ' + skin + '" style="top:' + top + 'px; left:' + left + 'px">' + '<span class="sayPhoto"><img src="' + window.resUrl + 'head/' + data.uid + '/40" /></span>' + '<span class="sayInfo"><span class="uname">' + data.nickname + '</span>' + icons.html() + '</span>' + '<a href="javascript:;" class="btn_chat" onclick="self.sayTo(\'' + data.nickname + '\')">与Ta私聊</a></div>'
            //this.$('.chat_wiew :visible').append(saystr);
          this.$('#chat').append(saystr);
        }

      }
    },
    showSingle2: function(obj) {
      var self = this;
      var tdiv = this.$(obj);
      var pdiv = tdiv.parent();
      var data = pdiv.attr('data')
      this.$('.saySingle').remove();
      if (data) {
        data = JSON.parse(data);
        if (data.uid != uid) {
          var icons = pdiv.find('.chat_icons');
          var pos = tdiv.offset();
          var top = pos.top + 20,
            left = pos.left + 20;
          var skin = 'sayToNormal'
          if (data.angel == 1) {
            skin = 'sayToSilver'
          }
          if (data.angel == 2) {
            skin = 'sayToGolden'
          }
          var saystr = '<div class="saySingle ' + skin + '" style="top:' + top + 'px; left:' + left + 'px">' + '<span class="sayPhoto"><img src="' + window.resUrl + 'head/' + data.ssoid + '/40" /></span>' + '<span class="sayInfo"><span class="uname">' + data.usrnick + '</span>' + icons.html() + '</span>' + '<a href="javascript:;" class="btn_chat" onclick="self.sayTo(\'' + data.usrnick + '\')">与Ta私聊</a></div>'
            //this.$('.chat_view :visible').append(saystr);
          this.$('#chat').append(saystr);
        }

      }
    },
    sayTo: function(name) {
      var self = this;
      if (name && name != '') {
        var tdiv = this.$('#chat_text');
        tdiv.val('@' + name + ' ' + tdiv.val());
        this.$('.chat_viewer_tab li').eq(0).click();
        this.$('.chat_holder').hide();
        this.$('.saySingle').remove();
      }

    },
    roomUsersTimer: 60000,
    showAudience: function() {
      var self = this;
      setInterval($.getJSON(apiUrl + 'online/getUserlist', {
        room: roomid
      }, function(res) {
        var tdiv = this.$('#audienceList');
        var str = '';
        $.each(res.result.userlist, function(i, o) {
          var skin = (o.angel == 0 ? 'link' : 'lights' + o.angel)
          str += '<li data=' + JSON.stringify(o) + '>' + '<img class="photobg ' + skin + '" src="' + window.resUrl + 'head/' + o.ssoid + '/40" style="width:18px;height:18px;max-height:18px;">' + (o.angel != 0 ? '<img src="' + window.resUrl + 'orig/images/flying' + o.angel + '.png" style="height:15px">' : '') + '<span class="chat_icons">' + (o.vip == 1 ? '<img width="18" src="' + window.resUrl + 'orig/images/vip.png">' : '') + '</span><span class="uname" onclick="self.showSingle2(this)">' + o.usrnick + '</span>' + '</li>'
        });
        tdiv.html(str);
        this.$('#userListScrollbar').tinyscrollbar({
          trackSize: 214
        })
      }), 60000);
    },
    userInfo: {},
    chatMsg: function(msg) {
      if (msg != '') {
        this.$('#chat_error_msg').remove();
        var tdiv = this.$('#chat_text');
        var pos = tdiv.offset();

        var str = '<div tabindex="-1" id="chat_error_msg" class="ui-popup ui-popup-show ui-popup-focus ui-popup-top" role="dialog" style="dusplay:none;position: absolute; bottom: auto; right: auto; margin: 0px; padding: 0px; outline: 0px; border: 0px none; z-index: 1025; background: transparent;"  aria-labelledby="title:1417056093284" aria-describedby="content:1417056093284">' + '<div i="dialog" class="ui-dialog pop-msg-blue"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div>' + '<table class="ui-dialog-grid"><tbody>' + '<tr><td i="header" class="ui-dialog-header" style="display: none;"><button i="close" class="ui-dialog-close" title="cancel">×<tton><div i="title" class="ui-dialog-title" id="title:1417056093284"></div></td></tr>' + '<tr><td i="body" class="ui-dialog-body"><div i="content" class="ui-dialog-content" id="content:1417056093284">' + msg + '</div></td></tr>' + '<tr><td i="footer" class="ui-dialog-footer" style="display: none;"><div i="statusbar" class="ui-dialog-statusbar" style="display: none;"></div><div i="button" class="ui-dialog-button"></div></td></tr>' + '</tbody></table>' + '</div></div>'
        this.$('#chat').append(str);
        var mdiv = this.$('#chat_error_msg');
        var left = pos.left + (tdiv.width() - mdiv.width()) / 2;
        var top = pos.top - mdiv.height();
        mdiv.css({
          left: left + 'px',
          top: top + 'px'
        }).show();
        setTimeout(function() {
          mdiv.fadeOut().remove();
        }, 3000);
      }
    },
    showBuyVip: function() {
      var str = '<div id="pop-msg-emoVip" style="">' + '<img src="' + window.resUrl + 'orig/images/tips_grils.png" class="tip-msg-gril">' + '<div class="msg-text"><span class="yellowText">本表情为vip会员专享，开通VIP会员即可拥有更多会员专享表情！</span></div>' + '</div>'
      this.$('.ui-popup').remove();
      var emoTips1 = dialog({
        //id:'pop-msg-emos',
        title: ' ',
        content: str,
        quickClose: false, //点击空白处快速关闭
        padding: 0,
        skin: 'pop-msg-emos',
        width: 280,
        //height:200,
        okValue: '开通VIP',
        ok: function() {
          window.location.href = '/'
            //return false;
        },
        cancelValue: '取  消',
        cancel: function() {

        }
      });
      emoTips1.show();
      this.$('.pop-msg-emos .ui-dialog-close').text('');

    },
    showBuyAngel: function() {
      var str = '<div id="pop-msg-emoAngel" style="">' + '<img src="' + window.resUrl + 'orig/images/tips_grils.png" class="tip-msg-gril">' + '<div class="msg-text">' + '<span class="yellowText">本表情为天使专享，开通天使特权即可拥有更多天使专享表情！</span>' + '</div>' + '</div>'
      this.$('.ui-popup').remove();
      var emoTips2 = dialog({
        //id:'pop-msg-emos',
        title: ' ',
        content: str,
        quickClose: false, //点击空白处快速关闭
        padding: 0,
        skin: 'pop-msg-emos pop-msg-emos-angel',
        width: 280,
        //height:200,
        okValue: '开通天使',
        ok: function() {
          window.location.href = '/'
            //return false;
        },
        cancelValue: '取  消',
        cancel: function() {

        }
      });
      emoTips2.show();
      this.$('.pop-msg-emos .ui-dialog-close').text('');
    },
    chatLog: Array(),
    dtime: 0,
    chatTimer: function() {
      var self = this;
      var secLen = 10;
      var wLimit = 5;
      var ctime = $.now();

      if (self.chatLog.length < wLimit) {
        self.chatLog[self.chatLog.length] = ctime;
        return true;
      } else {
        if (ctime - self.chatLog[0] < secLen * 1000) {
          return false;
        }
        for (i = 0; i < wLimit - 1; i++) {
          self.chatLog[i] = self.chatLog[i + 1];
        }
        self.chatLog[wLimit - 1] = ctime;
        return true;
      }
    },
    writeInputText: function(e) {
      if (e.keyCode == 38) { // up
        if (this.contentList.length && this.contentPoint >= 0) {
          if (this.contentPoint != 0) {
            this.contentPoint -= 1;
          }
          e.currentTarget.value = this.contentList[this.contentPoint];
        }
      } else if (e.keyCode == 40) { //down
        if (this.contentList.length) {
          if (this.contentPoint < this.contentList.length - 1) {
            this.contentPoint = this.contentPoint + 1;
          }
          e.currentTarget.value = this.contentList[this.contentPoint];
        }
      }
    }
  });
  return View;
});
