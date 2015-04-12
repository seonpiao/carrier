define([ "libs/collections/base", "./model" ], function(Base, Model) {
  var Colletion = Base.extend({
    model: Model,
    moduleName: "exchangeActivity"
  });
  return Colletion;
});