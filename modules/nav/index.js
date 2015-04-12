define(["modules/nav/view", "models/userInfo"], function(View, userInfo) {
  return {
    init: function(el) {
      var view = new View({
        el: el,
        model: userInfo
      });
    }
  };
});