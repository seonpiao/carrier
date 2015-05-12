define(["libs/client/views/base"], function(Base) {
	var View = Base.extend({
		moduleName: "popularrank",
		init: function() {
			var self = this;
			self.render();

		},
		render: function() {
			var self = this;
			this.loadTemplate('index', function(template) {
				var item = template({});
				//console.log(item)
				self.$body.find('.popularrank').append(item);
			})
		}
	});
	return View;
});