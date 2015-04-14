define(["libs/client/views/base", "models/userVitality"], function(Base, userVitality) {
  var View = Base.extend({
    moduleName: "i_ucavatar",
    init: function() {
      this.listenTo(userVitality, 'change', function(data) {
        var data = userVitality.toJSON();
        var vitalityLevel = data.vitalitylevel + '';
        var str = '';
        for (var i = 0, l = vitalityLevel.length; i < l; i++) {
          str += '<i class="num_' + vitalityLevel[i] + '"> </i>';
        }
        $('.p_vipgrade').html(str);
        var width = (parseInt(data.vitality) - data.vitalitylevelmin) / (data.vitalitylevelmax - data.vitalitylevelmin) * 100;
        $('.p_degreescroll').html('<span style="width:' + width + 'px;"></span>');
      });
      userVitality.fetch();

    }
  });
  return View;
});
