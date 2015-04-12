define([ "libs/collections/base", "./model" ], function(Base, Model) {
  var Colletion = Base.extend({
    model: Model,
    moduleName: "i_ucstyle"
  });
  return Colletion;
});