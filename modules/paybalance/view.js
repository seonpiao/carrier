define(["libs/client/views/base"], function(Base) {
	var View = Base.extend({
		moduleName: "paybalance",
		init: function() {
			var self = this;
			self.render();
		},
		render: function() {
			var self = this;
			console.log(3435)
			this.loadTemplate('index', function(template) {
				var item = template({});
				console.log(item)
				self.$body.find('.paybalance').append(item);
			})
		}
	});
	return View;
});