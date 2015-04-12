define(["libs/client/collections/base", "./model"], function(Base, Model) {
  var Colletion = Base.extend({
    model: Model,
    moduleName: "i_ucnav"
  });
  return Colletion;
});