define(["libs/client/views/base"], function(Base) {
	var View = Base.extend({
		moduleName: "userfeed",
		init: function() {
			var self = this;
			self.render();

		},
		render: function() {
			var self = this;
			console.log(344)
			this.loadTemplate('index', function(template) {
				var item = template({});
				console.log(item)
				self.$body.find('.userfeed').append(item);
			})
		}
	});
	return View;
});