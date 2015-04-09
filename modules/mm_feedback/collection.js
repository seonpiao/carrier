define([ "libs/collections/base", "./model" ], function(Base, Model) {
  var Colletion = Base.extend({
    model: Model,
    moduleName: "mm_feedback"
  });
  return Colletion;
});