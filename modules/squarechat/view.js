define(["libs/client/views/base", "libs/client/chat/icomet", "libs/client/chat/json2", "libs/client/scrollbar/jquery.tinyscrollbar"], function(Base, ICOMET, JSON2, SCROLLBAR) {
	var View = Base.extend({
		moduleName: "chat",
		template: 'index',
		events: {},
		init: function() {
			var self = this;
			self.join();
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
		getMeta: function(meta) {
			var ii = meta.indexOf('||');
			return ii > -1 ? meta.substring(0, ii) : meta
		},
		activeTextAreaId: '',
		insertSmiley: function(smiley) {
			$("#emoticonDropDown").fadeOut();
			var x = $("#" + this.activeTextAreaId);
			x.val(x.val() + " " + smiley + " ").focus();
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
			strNew = strNew.replace('<angel>', '<img src="' + window.resUrl + 'orig/images/flying1.png" style="height:15px;"') //白银天使
			strNew = strNew.replace('<angel1>', '<img src="' + window.resUrl + 'orig/images/flying1.png" style="height:15px;"') //白银天使
			strNew = strNew.replace('<angel2>', '<img src="' + window.resUrl + 'orig/images/flying2.png" style="height:15px;">') //黄金天使
				//strNew = strNew.replace('进入女神房间','<span class="grayText">进入女神房间</span>')
			return strNew;
		},
		transformChat: function(chat) { //转换消息内容
			var self = this;
			var chat_word = JSON.parse(chat);
			var contentStr = '';
			contentStr += '<span class="uname chat_nickname chat_icons" onclick="self.showSingle(this)">' + self.transformStr(chat_word.nickname) + '</span>：' + '<span class="chat_word">' + chat_word.content + '</span>'
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
					if (name.indexOf('&lt;angel1&gt;')) {
						angelid = 1
					}
					if (name.indexOf('&lt;angel2&gt;')) {
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
					$("#" + self.msgs[content]).removeClass("sent");
				}

				$('#sqchat_box').append(html);
				var ii = $('#sqchat_box p').length - 3000
				if (ii > 0) {
					$('#sqchat_box p:lt(' + ii + ')').remove();
				}
				self.chat_box_scrollbar_update('bottom');
			} catch (e) {

			}

			//$('#recv_chat_window').scrollTop($('#recv_chat_window')[0].scrollHeight);
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
				var msg1 = typeof(msg);

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
			sub_url: 'http://ic.mm.' + window.domain + ':8100' + '/sub',
			w: window,
			x: window.innerWidth,
			y: window.innerHeight
		},
		join: function() {
			var self = this;
			var channel = 'girl_' + girlid;
			comet = new iComet({
				channel: channel,
				signUrl: self.base.sign_url,
				subUrl: self.base.sub_url,
				callback: function(content) {
					//console.log(content);
					self.msgCb(content);
				}
			});
		},
		chat_box_scrollbar: null,
		chat_box_scrollbar_update: function(pos) { //手动更新滚动条位置
			//if(!this.chat_box_scrollbar){
			this.chat_box_scrollbar = $('#sqchat_box_scrollbar').tinyscrollbar()
				//}
				//if(!$('#chat_box_scrollbar .scrollbar').hasClass('disable')){
			var scrollbar = this.chat_box_scrollbar.data("plugin_tinyscrollbar");
			scrollbar.update(pos);
			//}

		},

		showSingle: function(obj) {
			var self = this;
			var tdiv = $(obj);
			var pdiv = tdiv.parent().parent();
			var data = pdiv.attr('data')
			$('.saySingle').remove();
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
						//$('.chat_wiew :visible').append(saystr);
					$('#sqchat').append(saystr);
				}

			}
		},
		showSingle2: function(obj) {
			var self = this;
			var tdiv = $(obj);
			var pdiv = tdiv.parent();
			var data = pdiv.attr('data')
			$('.saySingle').remove();
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
						//$('.chat_view :visible').append(saystr);
					$('#chat').append(saystr);
				}

			}
		},
		sayTo: function(name) {
			var self = this;
			if (name && name != '') {
				var tdiv = $('#sqchat_text');
				tdiv.val('@' + name + ' ' + tdiv.val());
				$('.chat_viewer_tab li').eq(0).click();
				$('.chat_holder').hide();
				$('.saySingle').remove();
			}

		},
		roomUsersTimer: 60000,
		userInfo: {},
		chatMsg: function(msg) {
			if (msg != '') {
				$('#sqchat_error_msg').remove();
				var tdiv = $('#sqchat_text');
				var pos = tdiv.offset();
				var str = '<div tabindex="-1" id="sqchat_error_msg" class="ui-popup ui-popup-show ui-popup-focus ui-popup-top" role="dialog" style="dusplay:none;position: absolute; bottom: auto; right: auto; margin: 0px; padding: 0px; outline: 0px; border: 0px none; z-index: 1025; background: transparent;"  aria-labelledby="title:1417056093284" aria-describedby="content:1417056093284">' + '<div i="dialog" class="ui-dialog pop-msg-blue"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div>' + '<table class="ui-dialog-grid"><tbody>' + '<tr><td i="header" class="ui-dialog-header" style="display: none;"><button i="close" class="ui-dialog-close" title="cancel">×<tton><div i="title" class="ui-dialog-title" id="title:1417056093284"></div></td></tr>' + '<tr><td i="body" class="ui-dialog-body"><div i="content" class="ui-dialog-content" id="content:1417056093284">' + msg + '</div></td></tr>' + '<tr><td i="footer" class="ui-dialog-footer" style="display: none;"><div i="statusbar" class="ui-dialog-statusbar" style="display: none;"></div><div i="button" class="ui-dialog-button"></div></td></tr>' + '</tbody></table>' + '</div></div>'
				$('#sqchat').append(str);
				var mdiv = $('#sqchat_error_msg');
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
		}
	});
	return View;
});