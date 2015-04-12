define(["modules/happy/view", "models/happy"], function(View, model) {
  return {
    init: function(el) {
      var view = new View({
        el: el,
        model: model
      });
    }
  };
});