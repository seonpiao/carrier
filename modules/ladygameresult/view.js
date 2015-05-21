define(["libs/client/views/base", 'models/ladygameresult'], function(Base, ladygameresult) {
	var d;

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
		moduleName: "ladygameresult",
		init: function() {
			var self = this;
			var ladygrFlag = getCookie('ladygr-flag');
			var initladygrShow = self.$el.attr('data-show') === 'init';
			this.listenTo(ladygameresult, 'sync', this.ladygRshow.bind(this));
			if (!ladygrFlag && initladygrShow) {
				// ladygameresult.fetch();
			}
		},
		ladygamersscrool: null,
		show: function() {
			ladygameresult.fetch();
		},
		ladygRshow: function() { //页面直接执行的数据
			var self = this;
			var data = ladygameresult.toJSON();
			this.loadTemplate('index', function(template) {
				if (data.success == 200 && data.result != null) {
					var item = template(data);
					if (dialog.getCurrent()) {
						return;
					}
					d = dialog({
						id: 'ladygresultShow-dialog-on',
						title: ' ',
						content: item,
						padding: 0,
						autofocus: true,
						skin: 'dialogGames ladygreShow-dialog-on',
						onclose: function() {
							d.close();
						}
					});
					d.show();
					this.ladygamersscrool = $('.ladygreShow-dialog-on #itemListBar');
					this.ladygamersscrool.tinyscrollbar({
						trackSize: 280
					});
					setCookie('ladygr-flag', 1, 0.5);
					$('#ladygmresult_btn').on('click', self.closeladytShow.bind(self));
					$('.ladygreShow-dialog-on .ui-dialog-close').html('');
				}
			})
		},
		closeladytShow: function() {
			if (d) {
				d.close().remove();
				d = null;
			}
		}
	});
	return View;
});