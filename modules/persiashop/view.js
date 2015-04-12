define(["libs/client/views/base", "models/persiashop"], function(Base, persiashop) {
	var View = Base.extend({
		moduleName: "persiashop",
		events: {
			'click #item0refresh': 'priceRefresh',
			'click #item1refresh': 'priceRefresh',
			'click #item2refresh': 'priceRefresh',
			'click #item3refresh': 'priceRefresh',
			'click #item4refresh': 'priceRefresh',
			'click #item5refresh': 'priceRefresh',
			'click #item0buy': 'persiaBuy',
			'click #item1buy': 'persiaBuy',
			'click #item2buy': 'persiaBuy',
			'click #item3buy': 'persiaBuy',
			'click #item4buy': 'persiaBuy',
			'click #item5buy': 'persiaBuy',
			'click #psrButton': 'persiaShopRefreshPopUp',
			'click #psrButtonSelf': 'persiaShopRefreshSelf',
			'click #DiscountRefresh': 'priceRefreshBuy'
				//'click #buyDoned': "buyDoneBack"
				//'click #cancel_Refresh': 'persiasReshow'
		},
		init: function() {
			this.persiaShopRefreshPrice = 1;
			this.persiaShopRefreshPriceType = 1;
			this.persiaShopDiscountPrice = 1;
			this.persiaShopDiscountPriceType = 1;
			this.persiaShopRefreshInfo = 1;
		},

		render: function() {

		},
		show: function() {
			persiashop.fetch();
			this.initpersinshopD();
			return;
		},
		initpersinshopD: function() {
			this.d = dialog({
				id: 'persiashop-dialog',
				title: ' ',
				content: '',
				quickClose: false, //点击空白处快速关闭
				skin: 'bottleGames persiashopd-dialog'
			});
			this.d.addEventListener('close', this.remove.bind(this));
			//让view来管理dialog的元素
			this.setElement(this.d.__popup);
			this.listenTo(persiashop, 'sync', this.persiashopItemList.bind(this));
			this.d.show();
			$('.bottleGames .ui-dialog-title').html('');
			$('.bottleGames .ui-dialog-close').text('');
		},
		persiashopItemList: function() {
			var self = this;
			this.loadTemplate('index', function(template) {
				var data = persiashop.toJSON();
				self.d.content(template(data));
				if (data.success == 200) {
					var result = data.result;
					var items = result.items;
					for (var i = 0; i < items.length; i++) {
						var itn = "#item" + i;
						$(itn + "img").attr('src', window.resUrl + "item/" + items[i].id + "/80");
						$(itn + "img").attr('title', items[i].description);
						// $(itn+"discount").html(items[i].discount);
						$(itn + "name").html(items[i].name);
						$(itn + "oldprice").html(items[i].bid);
						$(itn + "newprice").html(items[i].nowbid);
						$(itn + "pricetype").attr('src', window.resUrl + "orig/images/prop_icon/dis" + items[i].bidtype + ".png");
						$(itn + "pricetype1").attr('src', window.resUrl + "orig/images/prop_icon/now" + items[i].bidtype + ".png");
						$(itn + "limitme").html(items[i].limit + "/" + items[i].totallimit);

						$(itn + "id").val(items[i].id);
						if (items[i].limit == 0) {
							$(itn + "buy").removeAttr("onclick");
							$(itn + "buy").addClass("btn_grayh20").removeClass("btn_4y");

						}
						if (result.discurref == 0) {
							$(itn + "refresh").removeAttr("onclick");
							$(itn + "refresh").addClass("btn_grayh20").removeClass("btn_3b");
						}
						var discount = parseInt(items[i].discount);
						if (discount) {
							$(itn + "discountone").html(self.showImgnum(discount) + '<i class="discount_number_pointer"></i><i class="discount_word"></i>')
						}
						// if (discount < 10) {
						// 	$(itn + "discountten").removeClass().addClass("discount_word");
						// 	$(itn + "discountone").removeClass().addClass("discount_number_" + discount);
						// } else {
						// 	$(itn + "discountten").removeClass().addClass("discount_word").addClass("discount_number_" + parseInt(discount / 10));
						// 	$(itn + "discountone").removeClass().addClass("discount_number_" + discount - parseInt(discount / 10) * 10);
						// }

					}
					this.persiaShopRefreshInfo = result.refreshinfo;
					persiatimenow = result.curtime;
					persiatimenext = result.nexttime;
					//self.d.show();
					self.persiaTimer(persiatimenow, persiatimenext);

				}
			})
		},
		showImgnum: function(num) { //今日活跃度数字
			var n = num + '',
				nstr = '';
			for (var i = 0; i < n.length; i++) {
				nstr += '<span class="discount_number_' + n.substring(i, i + 1) + '"></span>';
			}

			return nstr;
		},
		persiaShopRefreshSelf: function() { ////商城自体刷新，用于实践到了之后的刷新策略，无刷新
			var self = this;
			$.ajax({
				type: "get",
				url: apiUrl + "persia/refreshPersiaList",
				dataType: "jsonp",
				jsonp: "jsonpCallback",
				success: function(data) {
					if (data.result == 200) {
						var item = data.result;
						//调用成功
						for (var i = 0; i < item.length; i++) {
							var itn = "#item" + i;
							$(itn + "img").attr('src', items[i].id);
							$(itn + "img").attr('title', items[i].description);
							$(itn + "discount").html(items[i].discount);
							$(itn + "name").html(items[i].name);
							$(itn + "oldprice").html(items[i].bid);
							$(itn + "newprice").html(items[i].nowbid);
							$(itn + "pricetype").attr('src', window.resUrl + "orig/images/prop_icon/dis" + items[i].bidtype + ".png");
							$(itn + "pricetype1").attr('src', window.resUrl + "orig/images/prop_icon/now" + items[i].bidtype + ".png");
							$(itn + "limitme").html(items[i].limit + "/" + items[i].totallimit);
							$(itn + "id").val(items[i].id);
						}
						//todo 这里要取全局
					} else if (data.result == 0) {
						if (data.error_code == 2008007) {
							alert("今天没有刷新次数了");
						} else if (data.error_code == 2008010) {
							//alert("insufficient balance");
							self.gotoBuy();
						}
					} else {
						//调用失败
						alert("没有返回正确的json");
					}
				},
				error: function(data) {
					alert("服务器挂了");
				}

			});
		},
		persiaShopRefresh: function() { ////商场整体刷新,用户主动刷新
			var self = this;
			$.ajax({
				type: "get",
				url: apiUrl + "persia/refreshPersiaList",
				dataType: "jsonp",
				jsonp: "jsonpCallback",
				success: function(data) {
					if (data.success == 200) {
						self.persiashopItemList();
					} else if (data.result == 0) {
						if (data.error_code == 2008007) {
							alert("今天没有刷新次数了");
						} else if (data.result == 2008010) {
							alert("insufficient balance");

						}
					} else {
						//调用失败
						alert("没有返回正确的json");
					}

				},
				error: function(data) {
					alert("服务器挂了");
				}
			});

		},
		priceRefresh: function(e, pageitemId) { //折扣刷新(层打开)
			$(".persiashopd-dialog").remove();
			var pageitemId = $(e.target).attr("id");
			pageitemId = pageitemId.substring(4, 5);
			//alert(pageitemId);
			alert(124343566)
			var itemId = $("#item" + pageitemId + "id").attr("value");
			this.loadTemplate('persia_DiscountRefresh', function(template) {
				this.wishSuccess = dialog({
					title: ' ',
					content: '',
					quickClose: false, //点击空白处快速关闭
					skin: 'bottleGames'
				});
				this.wishSuccess.content(template({}));
				this.wishSuccess.show();
				$("#pdcRfPriceType").html(this.persiaShopRefreshInfo.discoust);
				$("#pdcRfPriceType").attr('src', window.resUrl + "orig/images/prop_icon/now" + this.persiaShopRefreshInfo.discosttype + ".png");
				$("#pdcRTimes").html(this.persiaShopRefreshInfo.discurref + "/" + this.persiaShopRefreshInfo.distotalref);
				if (this.persiaShopRefreshInfo.discurref == 0) {
					$("#pdcRTimes").addClass("red").removeClass("green");

				} else {
					$("#pdcRTimes").addClass("green").removeClass("red");
				}
				$("#itemId").val(itemId);


				$('.bottleGames .ui-dialog-title').html('');
				$('.bottleGames .ui-dialog-close').text('');


			});


		},
		persiaBuy: function(e, pageitemId) { //点击购买
			var self = this;
			var pageitemId = $(e.target).attr("id");
			//alert(pageitemId);
			pageitemId = pageitemId.substring(4, 5);
			//alert(pageitemId);
			var itemId = $("#item" + pageitemId + "id").attr("value");

			$.ajax({
				type: "get",
				url: apiUrl + "persia/buyPersiaItem",
				dataType: "jsonp",
				jsonp: "jsonpCallback",
				data: {
					itemid: itemId,
					num: 1
				},
				success: function(data) {
					if (data.success == 200) {
						self.buyDone("persiashopItemList");
					} else {
						alert("购买失败")
					}

				},
				error: function(data) {
					alert("服务器挂了");
				}

			});
		},
		persiaTimer: function(persiatimenow, persiatimenext) { //定时器，处理倒计时
			var self = this;
			var nowHour = parseInt(persiatimenow.substring(0, 2));
			var nowMin = parseInt(persiatimenow.substring(3, 5));
			var nowSec = parseInt(persiatimenow.substring(6, 8));
			var nextHour = parseInt(persiatimenext.substring(0, 2));
			var nextMin = parseInt(persiatimenext.substring(3, 5));
			var nextSec = parseInt(persiatimenext.substring(6, 8));
			//    alert(nowHour);
			//    alert(nowMin);

			var nowToSec = nowHour * 3600 + nowMin * 60 + nowSec;
			//   alert("nowToSec"+nowToSec);

			var nextToSec = nextHour * 3600 + nextMin * 60 + nextSec;
			//   alert("nextTosec"+nextToSec);
			if (nowToSec > nextToSec) {
				nextToSec = nextToSec + 24 * 3600; //多一天
			}
			var leastSec = nextToSec - nowToSec;
			// alert(leastSec);
			self.displayTime(leastSec);

		},
		displayTime: function(leastSec) {
			var self = this;
			if ($("#persiaTime:visible").length < 1) {
				return;
			};
			var timeLast = leastSec;
			if (timeLast > 0) {
				$("#psrButtonSelf").addClass("hide");
				$("#psrButton").removeClass("hide");
				$("#persiaTime").html("刷新倒计时：" + parseInt(timeLast / 3600) + ":" + parseInt((timeLast - (parseInt(timeLast / 3600) * 3600)) / 60) + ":" + Number(parseInt(timeLast % 60 / 10)).toString() + (timeLast % 10));
				--timeLast;
				setTimeout("self.displayTime(" + timeLast + ")", 1000);
			} else if (timeLast == 0) {
				//免费
				$("#persiaTime").html("免费刷新");
				$("#psrButton").addClass("hide");
				$("#psrButtonSelf").removeClass("hide");
			} else {
				alert("囧");
			}
		},
		persiaShopRefreshPopUp: function() { //点击整体刷新，出现浮层
			var self = this;
			$(".bottleGames").parent().remove();
			this.loadTemplate('persia_shopRefresh', function(template) {
				this.wishSuccess = dialog({
					title: ' ',
					content: '',
					quickClose: false, //点击空白处快速关闭
					skin: 'bottleGames shopRefresh-dialog'
				});
				this.wishSuccess.content(template({}));
				$("#psRfPrice").html(this.persiaShopRefreshInfo.listcost);
				$("#psRPriceType").attr('src', window.resUrl + "orig/images/prop_icon/now" + this.persiaShopRefreshInfo.listcosttype + ".png");
				$("#psRTimes").html(this.persiaShopRefreshInfo.currefresh + "/" + this.persiaShopRefreshInfo.totalrefresh);
				if (this.persiaShopRefreshInfo.currefresh == 0) {
					$("#psRTimes").addClass("red").removeClass("green");

				} else {
					$("#psRTimes").addClass("green").removeClass("red");
				}

				this.wishSuccess.show();
				$('.bottleGames .ui-dialog-title').html('');
				$('.bottleGames .ui-dialog-close').text('');
				$('#cancel_Refresh').click(function() {
					alert(2344);
					$('.persiashopd-dialog').show();
					$('.shopRefresh-dialog').remove();
				})

			});

		},
		priceRefreshBuy: function() { //折扣刷新购买
			var self = this;
			var itemId = $("#itemId").attr("value");
			$.ajax({
				type: "get",
				url: apiUrl + "persia/refreshPersiaDiscount",
				dataType: "jsonp",
				jsonp: "jsonpCallback",
				data: {
					itemid: itemId
				},
				success: function(data) {

					if (data.success == 200) {
						self.buyDone("persiashopItemList");
						//popUpPerisaShop();


					} else {
						if (data.error_code == 2008007) {
							alert("There is no refresh chance left");
						} else if (data.error_code == 2008010) {
							self.gotoBuy();

						}
						//调用失败
						alert("没有返回正确的json");


					}
				},
				error: function(data) {
					alert("服务器挂了");
				}

			});
		},
		gotoBuy: function() {
			$(".bottleGames").parent().remove();
			this.loadTemplate('gotoBuy', function(template) {
				this.wishSuccess = dialog({
					title: ' ',
					content: '',
					quickClose: false, //点击空白处快速关闭
					skin: 'bottleGames'
				});
				this.wishSuccess.content(template({}));

				this.wishSuccess.show();
				$('.bottleGames .ui-dialog-title').html('');
				$('.bottleGames .ui-dialog-close').text('');


			});
		},
		buyDoneBack: function() {
			var fromFunction = $("#buyFrom").val();
			eval(fromFunction + "()");
		},
		buyDoneBackByfrom: function(buyFrom) {
			var fromFunction = $("#buyFrom").attr("id");
			eval(fromFunction + "()");
		},
		buyDone: function(buyFrom) {
			var self = this;
			$(".bottleGames").parent().remove();
			this.loadTemplate('buyDone', function(template) {
				this.wishSuccess = dialog({
					title: ' ',
					content: '',
					quickClose: false, //点击空白处快速关闭
					skin: 'bottleGames'
				});
				this.wishSuccess.content(template({}));
				this.wishSuccess.show();
				$("#buyFrom").val(buyFrom);
				$('.bottleGames .ui-dialog-title').html('');
				$('.bottleGames .ui-dialog-close').text('');
				$('#buyDoned').click(function() {
					self.buyDoneBack();
				})

			});
		}


	});
	return View;
});