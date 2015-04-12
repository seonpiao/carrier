define(["modules/golden/view", "models/userFund"], function(View, model) {
  return {
    init: function(el) {
      var view = new View({
        el: el,
        model: model
      });
    }
  };
});