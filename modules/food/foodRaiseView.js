define(["./clothesRaiseView", 'models/girlItemList'], function(Base, girlItemList) {
  var View = Base.extend({
    moduleName: "food",
    template: 'foodRaise',
    update: function(model) {
      Base.prototype.update.apply(this, arguments);
      $('.game_listbox_food .arrow_smaillpointer_dian').show();
      clearTimeout(this._timer);
      this._timer = setTimeout(function() {
        $('.game_listbox_food .arrow_smaillpointer_dian').hide();
      }, 2000);
    }
  });
  return View;
});