define(["libs/client/views/base", "libs/client/models/base", "modules/game/gameItemRaiseView", "models/girlItem"], function(Base, Model, GameItemRaiseView, GirlItem) {
  var View = Base.extend({
    moduleName: "game",
    template: 'gameRaise',
    events: {
      'click .crowdfunding_props_list li': 'raise'
    },
    init: function() {
      var self = this;
      this.on('afterrender', function() {
        setTimeout(function() {
          self.$('.crowdfunding_props_con').tinycarousel({
            step: 5,
            infinite: false
          });
        });
      });
    },
    raise: function(e) {
      var self = this;
      var $target = $(e.currentTarget);
      if ($target.hasClass('disabled')) {
        return;
      }
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            var index = $target.attr('data-id');
            var model = new GirlItem(self.model.get('field' + index));
            model.set({
              bid: self.model.get('bid'),
              bidtype: self.model.get('bidtype'),
              eventid: self.model.get('eventid'),
              subtype: self.model.get('subtype'),
              subgameid: self.model.get('subgameid'),
              optionid: index
            });
            self.loadTemplate('gameItemRaise', function(template) {
              self.raise.setModel(self.model);
              self.raise.setTemplate('raise', template);
              self.raise.show();
              self.raise.once('success', function(model) {
                self.collection.fetch();
              });
            });
          });
        }
      });
    }
  });
  return View;
});