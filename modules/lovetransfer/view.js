define(["libs/client/views/base", 'models/lovetransfer', "models/girl", "models/userInfo", "models/angelList"], function(Base, lovetransfer, girl, userInfo, angelList) {
	var d;
	// cookie记录
	function getCookie(c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=")
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1
				c_end = document.cookie.indexOf(";", c_start)
				if (c_end == -1) c_end = document.cookie.length
				return unescape(document.cookie.substring(c_start, c_end))
			}
		}
		return ""
	}

	function setCookie(c_name, value, hours) {
		var exdate = new Date().getTime() + hours * 60 * 60 * 1000;
		document.cookie = c_name + "=" + escape(value) +
			((hours == null) ? "" : ";expires=" + new Date(exdate).toGMTString())
	}
	var View = Base.extend({
		moduleName: "lovetransfer",
		init: function() {
			var self = this;
			var show = this.$el.attr('data-show');
			if (show === 'init') {
				this.listenTo(lovetransfer, 'sync', this.loveTShow.bind(this));
			}
			var loveFlag = getCookie('lovetrans-flag');
			// if (!loveFlag) {
			lovetransfer.fetch();
			// }
		},
		loveTShow: function() {
			var self = this;
			var data = lovetransfer.toJSON();
			var isout = data.result.isout;
			var datazhi = data.result;
			// isout = true;
			// datazhi.newgirl = {
			// 	id: 12,
			// 	name: '卓卓'
			// };
			// datazhi.oldgirl = {
			// 	id: 3,
			// 	name: '李乔丹',
			// 	intimacy: 12389879
			// };
			if (isout != null && isout == 1) {
				if (datazhi != null) {
					var newgirlid = datazhi.newgirl.girlid;
					this.loadTemplate('index', function(template) {
						var item = template(datazhi);
						d = dialog({
							id: 'loveTShow-dialog-on',
							title: ' ',
							content: item,
							padding: 0,
							autofocus: true,
							skin: 'dialogBluebgGames loveTShow-dialog-on',
							onclose: function() {
								d.close();
							}
						});
						d.show();
						// setCookie('lovetrans-flag', '1', 0);
						$('#agina_sbtn').on('click', self.NoticeShow.bind(self));
						$('#goon_attbtnlove').on('click', function() {
							var gid = window.girlid;
							if (gid > 0) {
								self.goonattionD(gid);
							} else {
								self.goonattionD(newgirlid);
							}
						});
						$('.loveTShow-dialog-on .ui-dialog-close').html('');
					})
				}
			}
		},
		NoticeShow: function() {
			this.hide();
		},
		hide: function() {
			if (d) {
				d.close().remove();
				d = null;
			}
		},
		goonattionD: function(gid, newgirlid) {
			$.ajax({
				url: apiUrl + 'girlstatus/doFollow',
				data: {
					girlid: gid || newgirlid
				},
				dataType: 'jsonp',
				cache: false,
				jsonp: "jsonpCallback",
				success: function(data) {
					if (data.success == 200 && data.result.status) {
						girl.fetch();
						angelList.fetch();
						userInfo.fetch();
						self.NoticeShow();
						self.hide();
					}
				}
			});
		}
	});
	return View;
});