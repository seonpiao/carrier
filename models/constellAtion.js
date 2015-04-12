define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'astro',
    action: 'getGirlAstro'
  });
  return new Model;
});