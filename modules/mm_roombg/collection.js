define([ "libs/collections/base", "./model" ], function(Base, Model) {
  var Colletion = Base.extend({
    model: Model,
    moduleName: "mm_roombg"
  });
  return Colletion;
});