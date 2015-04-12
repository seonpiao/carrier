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
      });
      userVitality.fetch();

    }
  });
  return View;
});