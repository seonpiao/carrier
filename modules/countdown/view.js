define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "countdown",
    init: function() {
      var countdown = this.$el.attr('data-seconds') * 1;
      var plugin = this.$el.data('countdown');
      var endTime = moment().add(countdown, 'seconds');
      var self = this;
      if (plugin) {
        plugin.update(endTime.toDate());
      } else {
        this.$el.countdown({
          date: endTime.toDate(),
          render: function(data) {
            var html = '';
            if (data.hours == 0) {
              html += this.leadingZeros(data.min, 2) + '分钟'
              html += this.leadingZeros(data.sec, 2) + '秒';
            } else {
              if (data.hours > 0) {
                html += data.hours + '小时';
              }
              html += this.leadingZeros(data.min, 2) + '分钟'
            }
            self.$el.html(html);
          }
        });
      }
    }
  });
  return View;
});