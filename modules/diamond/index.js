define(["modules/diamond/view", "models/userFund"], function(View, userFund) {
  return {
    init: function(el) {
      var view = new View({
        el: el,
        model: userFund
      });
    }
  };
});