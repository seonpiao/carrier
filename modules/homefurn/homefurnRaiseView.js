define(["./clothesRaiseView", 'models/girlItemList'], function(Base, girlItemList) {
  var View = Base.extend({
    moduleName: "homefurn",
    template: 'homefurnRaise',
    update: function(model) {
      girlItemList.fetch({
        data: girlItemList.filter
      });
    }
  });
  return View;
});