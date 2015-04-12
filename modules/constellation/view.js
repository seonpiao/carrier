define(["libs/client/views/base", 'libs/client/raphael', 'models/constellAtion'], function(Base, Raphael, constellAtion) {
	var View = Base.extend({
		moduleName: "constellation",
		template: 'index',
		events: {
			//'mouseenter .today_tasklist li .day_tasklist': 'dayTaskShow',
			//'mouseleave .today_tasklist li .day_tasklist': 'dayTaskHide',
			//'mouseenter .constell-dialog #constellate_ListsShow li i': 'getStarHoverS',
			//'mouseleave .constell-dialog #constellate_ListsShow li i': 'getStarHoverH',
			'click .constell-dialog #constellate_ListsShow li i': 'initAwardDialog'
		},
		init: function() {},
		show: function() {
			constellAtion.fetch();
			this.d = dialog({
				id: 'constellation-dialog',
				title: ' ',
				content: '',
				quickClose: false, //点击空白处快速关闭
				skin: 'dialognonebgGame constell-dialog'
			});
			//让view来管理dialog的元素
			this.listenTo(constellAtion, 'sync', this.constellAItemList.bind(this));
			$('.dialognonebgGame .ui-dialog-title').html('');
			$('.dialognonebgGame .ui-dialog-close').text('');
			return this;
		},
		constellAItemList: function() { //弹层刚开始的数据加载～
			var self = this;
			this.loadTemplate('index', function(template) {
				var data = constellAtion.toJSON();
				if (data.success == 200) {
					self.d.content(template({}));
					self.getDegreeDeital(data);
					var usernow = data.result.userTodayActNow;
					var usertotal = data.result.userTodayActToday;
					var nextlevel = data.result.userNextLevelAct;
					var girlConstellid = data.result.girlAstroId;
					var girlName = data.result.girlName;
					if (usernow != null && usertotal != null && nextlevel != null && girlConstellid != null && girlName != null) {
						$(".constell-dialog .activedegree_num #Today_degree").html(self.showImgnum(usernow));
						$(".constell-dialog .activedegree_num #Total_degree").html(self.showImgnum(usertotal));
						$(".constell-dialog #nextlevel_act").html('距下一星点开启需活跃度：' + nextlevel + '');
						var cdiv = $(".constell-dialog #constellate_List");
						cdiv.children("div#constellateName").html('您的女神<span class="name_color">' + girlName + '</span> 为：<i class="cname_' + girlConstellid + '"></i>');
						cdiv.find('#constellateImgcon').html('<div id="astro_svg" class="cimgbg_' + girlConstellid + '"></div><ul class="starbg_' + girlConstellid + ' pr" id="constellate_ListsShow"></ul>')
						self.getGirlAstro(data);
					}
					self.d.show();
				} else {
					self.showattentionDialog();
					self.showErrorDialog(data.error_msg)
				}

			})

		},
		getDegreeDeital: function(data) { //每日任务信息
			var degreeStr = '<div class="scrollbars" id="itemListBar">' + '<div class="scrollbar"><div class="scroll_up"></div><div class="track"><div class="thumb"><div class="thumb_end"></div></div></div><div class="scroll_down"></div></div>' + '<div class="viewport"><ul  class="constellate-d-w-list cl overview today_tasklist" ></ul></div>' + '</div>'
			$(".constell-dialog .degree_waylist").append(degreeStr);
			var str = '';
			var self = this;
			var userActTaskd = data.result.userActTask;
			if (userActTaskd != null) {
				$.each(userActTaskd, function(i, o) {
					str += '<li taskid="' + o.taskid + '" Flag="' + o.status + '" finalreward=\'' + o.finalreward.replace(/\\/g, "") + '\'  ><div class="day_tasklist cl" taskid="' + o.taskid + '"><span class="fl">' + o.name + '</span><i class="fr">' + o.curnum + '/' + o.achievecond + '</i></div></li>';
					self.GirlList2[o.taskid] = o;

				});
				$(".constell-dialog #itemListBar .today_tasklist").html(str);
				self.dayTaskShow();
				//self.dayTaskHide();
				// 奖励循环
				var taskli = $(".constell-dialog .today_tasklist li");
				taskli.each(function(k, v) {
					var Flagd = $(v).attr('Flag');
					if (Flagd == 1) {
						$(v).removeClass("on");
					} else if (Flagd == 2) {
						$(v).addClass("on");
					}
					if (Flagd == 0 || Flagd == 3 || Flagd == 4 || Flagd == 5) {
						$(v).hide();
					}
				})
				$('.constell-dialog #itemListBar').tinyscrollbar({
					trackSize: 260
				});
			}
		},
		dayTaskShow: function() {
			$('.today_tasklist li .day_tasklist').mouseenter(function(e) {
				e.preventDefault();
				var self = this;
				var t = $(e.target);
				var p = t.parent().parent();
				var tid = p.attr('taskid');
				var Flag = p.attr('Flag');
				var finalrewardnum = p.attr('finalreward');
				//console.log(finalrewardnum);
				var livedeg = eval('(' + finalrewardnum + ')');
				var left = p.position().left + 166;
				var top = p.position().top + 15;
				var scroll = $('#itemListBar .overview').css('top');
				var scrollTop = parseInt(scroll.substring(0, scroll.length - 2));
				var top0 = top + (scrollTop && scrollTop < 0 ? scrollTop : 0);
				var str = "";
				if (!p.hasClass('on')) {
					str = '<div id="get-actdegree-dialog" style="left:' + left + 'px;top:' + top0 + 'px;" taskid="' + tid + '" >' + '<div class="hover_boxbg get_active_degree"><div class="arrow_icon"></div><div id="getdegree_num" class="cl">可获得<span class="green">' + livedeg.live + '</span>活跃度</div></div>' + '</div>'
					$(".constell-dialog .degree_waylist").append(str);
				} else {
					str = '<div id="get-actdegree-dialog" style="left:' + left + 'px;top:' + top0 + 'px;" taskid="' + tid + '" >' + '<div class="hover_boxbg get_active_degree"><div class="arrow_icon"></div><div id="getdegree_num" class="cl">已获得<span class="green">' + livedeg.live + '</span>活跃度</div></div>' + '</div>'
					$(".constell-dialog .degree_waylist").append(str);
				}
			}).mouseleave(function() {
				$("#get-actdegree-dialog").remove();
			})

		},
		// //1.射手 2.白羊 3.金牛 4.双子 5.巨蟹 6.狮子 7.处女 8.天枰 9.天蝎 10.摩羯 11.水瓶 12.双鱼
		getGirlAstro: function(data) { //十二星座显示
			var star = "";
			var self = this;
			var astrodata = data.result.astro;
			if (astrodata != null) {
				$.each(astrodata, function(i, o) {
					star += '<li class="star_' + (o.starid) % 20 + ' star_on" starid="' + o.starid + '" startype="' + o.startype + '" status="' + o.starStatus + '" starrequire="' + o.starActRequire + '" goldAward="' + o.goldAward + '" dimoandAward="' + o.dimoandAward + '" poularAward="' + o.poularAward + '" loveAward="' + o.loveAward + '" iconimg=\'' + o.itemAward.replace(/\\/g, "") + '\'><span class=""></span><i id="i' + o.starid + '" class="star star_off"></i></li>'
				})
				$(".constell-dialog #constellate_ListsShow").append(star);
				var constellateLi = $(".constell-dialog #constellate_ListsShow li");
				constellateLi.each(function(k, v) {
					var startype = $(v).attr('startype'),
						starStatus = $(v).attr('status');
					// 类型
					if (startype == 0) {
						if (starStatus == 0) {
							$(v).children('i').addClass('gray_star').css({
								'cursor': 'default'
							});
						} else if (starStatus == 1) {
							$(v).children('i').addClass('lingts_blue');
							$(v).children('span').addClass("lights_bg")
						} else if (starStatus == 2) {
							$(v).children('i').addClass('lingts_blue').css({
								'cursor': 'default'
							});

						}
					} else {
						if (starStatus == 0) {
							$(v).children('i').addClass('gray_yellow').css({
								'cursor': 'default'
							});
						} else if (starStatus == 1) {
							$(v).children('i').addClass('lingts_yellow');
							$(v).children('span').addClass("lights_bg")
						} else if (starStatus == 2) {
							$(v).children('i').addClass('lingts_yellow').css({
								'cursor': 'default'
							});
						}
					}

				})
				setTimeout(function() {
					self.getStarLine(constellateLi);
				})
				self.getStarHoverS();
				self.initAwardDialog();
			}
		},
		getStarLine: function(constellateLi) {
			var paper = Raphael(document.getElementById("astro_svg"), 447, 378);
			constellateLi.each(function(index, element) {
					if (index == 0) {
						return;
					}
					var cur_x = $(element).position().left + 20;
					var cur_y = $(element).position().top + 20;
					//console.log(cur_x,cur_y)
					var parcd = $(element).prev('li');
					var istatusli = $(element).children('i');
					var istatusprev = parcd.children('i');
					var lights = $(element).children('span');
					var lightsprev = parcd.children('span');
					var prev_x = parcd.position().left + 20;
					var prev_y = parcd.position().top + 20;
					var c = paper.path("M" + prev_x + " " + prev_y + "L" + cur_x + " " + cur_y);
					if (lights.hasClass('lights_bg') || lightsprev.hasClass('lights_blue') || istatusli.hasClass("gray_star") || istatusprev.hasClass("gray_star") || istatusprev.hasClass("gray_yellow")) {
						c.attr({
							fill: "#999",
							stroke: "#999"
						});
					} else {
						c.attr("stroke", "#03d0c9");
					}

				})
				// constellateLi.click(function(index, e) {
				// 	var this_index = $(this).index();
				// 	if ($(this).index() == 0) {
				// 		return;
				// 	}
				// 	var cur_x = $(this).position().left + 20;
				// 	var cur_y = $(this).position().top + 20;
				// 	var parcd = $(this).prev('li');
				// 	var prev_x = parcd.position().left + 20;
				// 	var prev_y = parcd.position().top + 20;
				// 	var c = paper.path("M" + prev_x + " " + prev_y + "L" + cur_x + " " + cur_y);
				// 	var istatusli = $(this).children('i');
				// 	var istatusprev = parcd.children('i');
				// 	c.attr({
				// 		fill: "#03d0c9",
				// 		stroke: "#03d0c9"
				// 	});
				// })

		},
		// 星球hover状态
		getStarHoverS: function() {
			$(".constell-dialog #constellate_ListsShow li i").mouseenter(function(e) {
				var iconimglist = "";
				// 星球hover状态
				var i = $(e.target);
				var self = i.parent();
				var lights_bg = i.siblings('span').hasClass('lights_bg'); //亮光
				var gstar = i.hasClass('gray_star'); //不发光的灰星
				var gystar = i.hasClass('gray_yellow'); //不发光的暗黄星星
				var bstar = i.hasClass('lingts_blue'); //不发光的蓝星星
				var ystar = i.hasClass('lingts_yellow'); //不发光的黄星星
				var starid = self.attr('starid');
				var stardegree = self.attr('starrequire');
				var poularaward = self.attr('poularaward');
				var loveaward = self.attr('loveAward');
				var dimoandaward = self.attr('loveaward');
				var goldaward = self.attr('goldaward');
				var iconimg = self.attr('iconimg');
				var iconlist = eval('(' + iconimg + ')');
				var divdialog = self.children('.constell-dialog #constellate_hoverDialog');

				if (iconimg == undefined) {
					$(".constell-dialog #constellate_ListsShow .receive_goods").remove();
				}
				var top = i.position().top - 5;
				var left = i.position().left + 35;
				var leftdiv = i.position().left + 166;
				if (gstar && !lights_bg && divdialog.length == 0) { //不发光蓝星
					iconimglist = "";
					$.each(iconlist, function(k, v) {
						iconimglist += '<li><img src="' + window.resUrl + 'item/' + k + '/40/' + v + '"></li>'
					})
					var stardialog = '<div class="hover_boxbg constellate_vip_hover cl" starid="' + starid + '" id="constellate_hoverDialog" style="left:' + left + 'px;top:' + top + 'px;">' + '<div class="arrow_icon"></div>' + '<div class="active_typebox"><p class="yellow_4">需要活跃度：' + stardegree + '</p>' + '<div class="receive_wards_rightcon mt_10"><p class="tl ml_5">星座奖励：</p>' + '<div class="tl gold_heartnumber cl mt_2"><span class="five_star">' + poularaward + '</span><span class="blue_drill">' + dimoandaward + '</span><span class="gold_img mt_5">' + goldaward + '</span><span class="heart_4 mt_5">' + loveaward + '</span></div>' + '<div class="receive_goods cl" ><p class="ml_5">您可以领取以下物品：</p><ul class="cl ml_5 mt_5" id="">' + iconimglist + '</ul></div>' + '</div>' + '</div>' + '</div>'
					self.append(stardialog);
				}
				if (gystar && !lights_bg && divdialog.length == 0) { //不发光黄星
					iconimglist = "";
					$.each(iconlist, function(k, v) {
						iconimglist += '<li><img src="' + window.resUrl + 'item/' + k + '/40/' + v + '"></li>'
					})
					var stardialog = '<div class="hover_boxbg constellate_vip_hover cl" starid="' + starid + '" id="constellate_hoverDialog" style="left:' + left + 'px;top:' + top + 'px;">' + '<div class="arrow_icon"></div>' + '<div class="active_typebox"><p class="yellow_4">需要活跃度：' + stardegree + '</p>' + '<div class="receive_wards_rightcon mt_10"><p class="tl ml_5">星座奖励：</p>' + '<div class="tl gold_heartnumber cl mt_2"><span class="five_star">' + poularaward + '</span><span class="blue_drill">' + dimoandaward + '</span><span class="gold_img mt_5">' + goldaward + '</span><span class="heart_4 mt_5">' + loveaward + '</span></div>' + '<div class="receive_goods cl" ><p class="ml_5">您可以领取以下物品：</p><ul class="cl ml_5 mt_5" id="">' + iconimglist + '</ul></div>' + '</div>' + '</div>' + '</div>'
					self.append(stardialog);
				}
				if ((bstar && !lights_bg && divdialog.length == 0) || (ystar && !lights_bg && divdialog.length == 0)) {
					var stardialog = '<div class="hover_boxbg constellate_vip_hover cl" starid="' + starid + '" id="constellate_hoverDialog" style="left:' + left + 'px;top:' + top + 'px;width:40px;">' + '<div class="arrow_icon"></div>' + '<div class="active_typebox">已领取</div>' + '</div>'
					self.append(stardialog);
				}
			}).parent().mouseleave(function() {
				$('#constellate_hoverDialog').remove();
			})
		},
		initAwardDialog: function(e, starid) { //领取奖励层
			$('.constell-dialog #constellate_ListsShow li i').click(function(e, starid) {
				var getImglist = "";
				var i = $(e.target);
				var self = i.parent();
				var spanstatus = i.attr('class');
				var starid = self.attr('starid');
				var id = i.attr("id")
				var stardegree = self.attr('starrequire');
				var poularaward = self.attr('poularaward');
				var loveaward = self.attr('loveAward');
				var dimoandaward = self.attr('loveaward');
				var goldaward = self.attr('goldaward');
				var lights_bg = i.siblings('span').hasClass('lights_bg'); //亮光
				var bstar = i.hasClass('lingts_blue'); //不发光的蓝星星
				var ystar = i.hasClass('lingts_yellow'); //不发光的黄星星
				var iconimg = self.attr('iconimg');
				var iconlist = eval('(' + iconimg + ')');
				getImglist = "";
				$.each(iconlist, function(k, v) {
					//console.log(iconlist)
					getImglist += '<li><img src="' + window.resUrl + 'item/' + k + '/40/' + v + '"></li>'
				})
				if (bstar && lights_bg) { //发光蓝星
					var awardStr = '<div class="task_complete pr" id="ReceiveConawardsInner" starid = "' + starid + '">' + '<div class="receiveConawards_con">' + '<div class="receivewards_girls_img"><img src="http://static.mm.' + window.domain + '/images/prop_icon/receive_tips_npc.png" /></div>' + '<div class="receive_wardsrightmain">' + '<div class="receive_wards_title"><div class="lights_show"><span></span></div></div>' + '<div class="receive_wards_rightcon mt_20"><p class="tl ml_5 mt_25">星座奖励：</p>' + '<div class="tl gold_heartnumber cl mt_2"><span class="five_star">' + poularaward + '</span><span class="blue_drill">' + dimoandaward + '</span><span class="gold_img">' + goldaward + '</span><span class="heart_4">' + loveaward + '</span></div>' + '<div class="receive_goods cl mt_20"><p class="ml_5">您可以领取以下物品：</p>' + '<ul class="cl ml_5 mt_5" id="iconimglistGet">' + getImglist + '</ul>' + '</div>' + '<div class="tc mt_30 ml_70"><a class="w90 btn_2b ml_5 consprop_Icon" href="javascript:void(0);" starid = "' + starid + '" >联收了</a></div>' + '</div>' + '</div>' + '</div>'
						// 获取弹层显示
					this.AwardDialog = dialog({
						title: ' ',
						content: awardStr,
						quickClose: true, //点击空白处快速关闭
						autofocus: true,
						skin: 'dialogGames award-dialog'
					});
					this.AwardDialog.show();
					$('.dialogGames .ui-dialog-title').html('');
					$('.dialogGames .ui-dialog-close').text('');
				}
				if (ystar && lights_bg) { //发光黄星
					var awardStr = '<div class="task_complete pr" id="ReceiveConawardsInner" starid = "' + starid + '">' + '<div class="receiveConawards_con">' + '<div class="receivewards_girls_img"><img src="http://static.mm.' + window.domain + '/images/prop_icon/receive_tips_npc.png" /></div>' + '<div class="receive_wardsrightmain">' + '<div class="receive_wards_title"><div class="lights_show"><span></span></div></div>' + '<div class="receive_wards_rightcon mt_20"><p class="tl ml_5 mt_25">星座奖励：</p>' + '<div class="tl gold_heartnumber cl mt_2"><span class="five_star">' + poularaward + '</span><span class="blue_drill">' + dimoandaward + '</span><span class="gold_img">' + goldaward + '</span><span class="heart_4">' + loveaward + '</span></div>' + '<div class="receive_goods cl mt_20"><p class="ml_5">您可以领取以下物品：</p>' + '<ul class="cl ml_5 mt_5" id="iconimglistGet">' + getImglist + '</ul>' + '</div>' + '<div class="tc mt_30 ml_70"><a class="w90 btn_2b ml_5 consprop_Icon" href="javascript:void(0);" starid = "' + starid + '">联收了</a></div>' + '</div>' + '</div>' + '</div>'
						// 获取弹层显示
					this.AwardDialog = dialog({
						title: ' ',
						content: awardStr,
						quickClose: true, //点击空白处快速关闭
						autofocus: true,
						skin: 'dialogGames award-dialog'
					});
					this.AwardDialog.show();
					$('.dialogGames .ui-dialog-title').html('');
					$('.dialogGames .ui-dialog-close').text('');
				}
				this.getAwardSub();
			})
		},
		getAwardSub: function(e, starid) { //获取当前星辰奖励
			$('.award-dialog .task_complete .consprop_Icon').click(function(e) {
				var starid = $(e.target).attr('starid');
				$.ajax({
					url: apiUrl + 'astro/getStarAward',
					dataType: "json",
					data: {
						starid: starid
					},
					jsonp: "jsonpcallback",
					success: function(data) {
						if (data.success == 200) {
							if ($('.award-dialog').length > 0) {
								$("#i" + starid).siblings('span').removeClass("lights_bg");
								$('.award-dialog').parent('.ui-popup').remove();
							}
						}
						if (data.error_code == 2009001) {
							//console.log(data.error_code)
							this.showErrorDialog('已经领过了');
						}
						if (data.error_code == 2009002) {
							//console.log(data.error_code)
							this.showErrorDialog('还不能领！');
						}
						if (data.error_code == 2009101) {
							//console.log(data.error_code)
							this.showErrorDialog('valid girl id is missing');
						}
						if (data.error_code == 2009003) {
							//console.log(data.error_code)
							this.showErrorDialog('valid star of the girl astro missing');
						}
					},
					error: function() {
						this.showErrorDialog('服务器打瞌睡了，请稍后重试～');
					}
				});
			})
		},
		getdDialog: null,
		GirlList: [],
		GirlList2: [],
		taskFlag: [],
		detailTimer: null,
		getdDialog: null,
		showErrorDialog: function(msg) {
			var d = dialog({
				content: msg,
				skin: 'pop-msg-blue '
			});
			$('.pkg-msg').css({
				'background': 'none',
				'border': 'none'
			});
			$('.pop-msg-blue').find('div[class*=ui-dialog-arrow]').hide();
			d.show();
			setTimeout(function() {
				d.close().remove();
			}, 3000);
		},
		showattentionDialog: function(e) {
			var showattentstr = '';
			showattentstr == "";
			showattentstr = '<div class="hover_boxbg attente_tbg" id="attenteTbg">' + '<div class="active_typebox"><span class="yellow_4">星座在关注一位女神后开启</span><div class="arrow_icon_right"></div></div>' + '</div>'
			$('.constellation_6').parent().parent().append(showattentstr);
			setTimeout(function() {
				$('.active_box_right #attenteTbg').remove();
			}, 3000);
		},
		showImgnum: function(num) { //今日活跃度数字
			var n = num + '',
				nstr = '';
			for (var i = 0; i < n.length; i++) {
				nstr += '<i class="num_' + n.substring(i, i + 1) + '"></i>';
			}

			return nstr;
		}
	});
	return View;
});