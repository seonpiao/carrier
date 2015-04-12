define(["libs/client/views/base", 'libs/client/nivoSlider'], function(Base, nivoSlider) {
	var View = Base.extend({
		moduleName: "appdowntemp",
		init: function() {
			var self = this;
			self.scrollslider();
			self.appdownshow();
		},
		scrollslider: function() {
			$('.appdownlist').nivoSlider({
				controlNav: false,
				directionNav: false,
				animSpeed: '1000',
				effect: 'slideInLeft,fade'
			});
			var nivoSlider = $('.appdownlist').data('nivoslider');
			nivoSlider.start();
		},
		appdownshow: function() {
			var $header = $('#header');
			var docHeight = $('body').height();
			$('#apptemoshow').height(docHeight - 50);
			console.log($('.indexappC').height());
		}
	});
	return View;
});