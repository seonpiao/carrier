define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'rank',
    action: 'GirlDaliyPopularTopTen'
  });
  return new Model;
});