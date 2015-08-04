define(["modules/beima_signup_form/view", "modules/beima_signup_form/model"], function(View, Model) {
  return {
    init: function(el) {
      var view = new View({
        el: el,
        model: new Model
      });
    }
  };
});