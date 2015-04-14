define(["libs/client/views/base", 'models/ladygameresult'], function(Base, ladygameresult) {
	var d;
	var View = Base.extend({
		moduleName: "ladygameresult",
		init: function() {
			//this.listenTo(ladygameresult, 'sync', this.show.bind(this));
		},
		ladygamersscrool: null,
		show: function() {
			var self = this;
			ladygameresult.fetch();
			ladygameresult.once('sync', function() {
				self.loadTemplate('index', function(template) {
					var data = ladygameresult.toJSON();
					console.log(data)
					if (data.success == 200 && data.result != null) {
						var item = template(data);
						//console.log(item)
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
						$('#ladygmresult_btn').on('click', self.CloseNticeShow.bind(self));
						$('.ladygreShow-dialog-on .ui-dialog-close').html('');
					}
				})
			})
		},
		CloseNticeShow: function() {
			if (d) {
				d.close().remove();
				d = null;
			}
		}
	});
	return View;
});