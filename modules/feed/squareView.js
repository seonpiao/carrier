define(["modules/feed/view"], function(Base) {
	var View = Base.extend({
		moduleName: "feed",
		template: 'index',
		init: function() {
			this.$('#sqrecv_chat_window').tinyscrollbar();
		},
		initMap: function() {

		},
		feed_scrollbar_update: function(pos) {
			var scrollbar = this.$('#sqrecv_chat_window').data('plugin_tinyscrollbar');
			scrollbar.update(pos)
		},
		icommet_show_feed: function(msg) {
			this.transformStr(msg);
		},
		showInChat: function(strTime, strMsg) {
			var self = this;
			var sqchatBox = $('#sqchat_box');
			var showMsg = '<li><em>' + strTime + '</em>' + strMsg + '</li>';
			if (showMsg) {
				sqchatBox.append(showMsg);
				var ii = $('#sqchat_box li').length - 3000
				if (ii > 0) {
					$('#sqchat_box li:lt(' + ii + ')').remove();
				}
				self.feed_scrollbar_update('bottom');
			}
		}
	});
	return View;
});