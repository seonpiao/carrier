define(["libs/client/views/base", "models/userInfo", "models/userFund"], function(Base, userInfo, userFund) {
	var View = Base.extend({
		moduleName: "golden",
		template: "index",
		events: {
			'click .goldendialog .gbuy_btn': 'GbuyShow'
		},
		d: null,
		init: function() {
			//this.listenTo(golden,'change',this.initGoldenD.bind(this));
			var self = this;
			this.loadTemplate('coin', function(template) {
				self.model.cache(function() {
					var html = template(self.model.toJSON());
					self.$el.html(html);
				});
			});
		},
		coinChanged: function() {
			var data = this.model.toJSON();
			this.$('.balance').html(data.coin);
		},
		show: function() {
			var self = this;
			var errMsgTip = $('.RechangeRec_error');
			this.module('sign', function(module) {
				if (module) {
					module.showSignModel('login', function() {
						$.ajax({
							url: accountUrl + "pay/GetCoinList",
							dataType: "jsonp",
							jsonp: "jsonpCallback",
							success: function(data) {
								if (data.code === 1) {
									var goldenCstr = "",
										goldenLstr = " ";
									//console.log(data);
									var goldenCstr = '<div class="goldbg_boxIn cl" id="GoldbgboxIn">' + '<div class="golden_Content  cl">' + '<div class="goldengirls fl"><img src="' + window.resUrl + 'orig/images/prop_icon/golden_npcimg.png"/></div>' + '<div class="goldenmain fl">' + '<div class="golden_title"><span></span></div>' + '<ul class="goldencon mt_15"  id="goldenconL">' + '</ul>' + '</div>' + '</div>' + '</div>'
									var Gdata = data.data;
									//console.log(Gdata)

									if (Gdata != null) {
										goldenLstr = " ";
										$(".goldendialog #goldenconL").html(" ");
										$.each(Gdata, function(i, v) {
											var gi = i + 1;
											goldenLstr += '<li id="g' + v.id + '" gid="' + v.id + '"><div class="fl golden_imgL"><img src="' + window.resUrl + 'orig/images/prop_icon/gold_' + gi + '.png" /><span>x<i class="coinNum">' + v.coin_amount + '</i></span></div><div class="fr buy_btn gbuy_btn w60"><p>购&nbsp;&nbsp;买</p><p class="blue_drill diamondNum">' + v.diamond_amount + '</p></div></li>'
										})
									}
									self.d = dialog({
										id: 'golden-dialog-on',
										title: ' ',
										content: goldenCstr,
										padding: 0,
										autofocus: true,
										skin: 'dialogGames goldendialog',
										onclose: function() {
											self.d.close();
										}
									});
									self.d.show();
									$(".goldendialog #goldenconL").html(goldenLstr);
									self.GbuyShow();
									$('.goldendialog .ui-dialog-title').html('');
									$('.goldendialog .ui-dialog-close').text('');
								} else {
									data.msg
								}
							}
						})
					});
				}
			});
		},
		GbuyShow: function() {
			var self = this;
			$(".goldendialog .gbuy_btn").click(function() {
				var userIfdata = userInfo.toJSON();
				var diamondNum = $(this).children('.diamondNum').text(),
					goldenid = $(this).parent().attr('gid'),
					coinNum = $(this).siblings().children().find('.coinNum').text();
				if (userIfdata.isLogin) {
					$.ajax({
						url: window.accountUrl + "pay/DiamondCoin",
						dataType: "jsonp",
						data: {
							action: '7',
							diamond_amout: diamondNum,
							amout: coinNum,
							type: '5',
							desc: 'alipay',
							remark: '2'
						},
						jsonp: "jsonpCallback",
						success: function(data) {
							//console.log(data)
							if (data.code == 1) {
								self.showUseDialog();
								userFund.fetch();
							} else {
								var userdata = userFund.toJSON();
								var diamond1 = userdata.diamond,
									diamond2 = userdata.bind_diamond;
								if (diamond1 != null && diamond2 != null) {
									var nowuserdiamond = diamond1 + diamond2;
									self.buyTipsShow(coinNum, diamondNum, nowuserdiamond);
								}
							}
						}

					})
				} else {
					this.module('sign', function(module) {
						if (module) {
							module.showSignModel('login', function() {});
						}
					});
				}
			})
		},
		buyTipsShow: function(coinNum, diamondNum, nowuserdiamond) {
			var self = this;
			this.loadTemplate('buytips', function(template) {
				self.d = dialog({
					title: ' ',
					content: '',
					quickClose: false, //点击空白处快速关闭
					skin: 'bottleGames gbuytips_box'
				});
				self.d.content(template({}));
				self.d.show();
				var buystr = " ";
				$(".gbuytips_box .buytips_words").html(' ');
				var chadiamondNum = diamondNum - nowuserdiamond;
				buystr = '<p class="cl yellow_2 mt_15">' + '您购买<span class="white"><img src="' + window.resUrl + 'orig/images/prop_icon/now1.png" />x' + coinNum + '<i class="yellow_2">还差：</i ></span></br>' + '<span class="red ml_35 mt_5"><img src="' + window.resUrl + 'orig/images/prop_icon/blue_drill.png" />' + chadiamondNum + '</span>' + '</p>'
				$(".gbuytips_box .buytips_words").html(buystr);
				$('.gbuytips_box .ui-dialog-title').html('');
				$('.gbuytips_box .ui-dialog-close').text('');
			})

		},
		showUseDialog: function() {
			var self = this;
			var d = dialog({
				id: 'golden-msg-box',
				content: '<div class="buy_linghtsshow"><span></span></div>',
				skin: 'golden-msg'
			});
			$('.golden-msg').css({
				'background': 'none',
				'border': 'none'
			});
			d.show();
			setTimeout(function() {
				d.close().remove();
			}, 500);
		}
	});
	return View;
});