define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "homefurn",
    template: 'homefurnItem',
    events: {
      'click': 'openRaise',
      'mouseenter': 'showDetail',
      'mouseleave': 'hideDetail'
    },
    init: function(options) {
      options = options || {};
      this.listenTo(this.model, 'change', this.render.bind(this));
      this.raise = options.raise;
      this.homefurnView = options.homefurnView;
    },
    openRaise: function(e) {
      if (this.model.get('classval') != '4' && this.model.get('status') == '0') {
        return;
      }
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            self.loadTemplate('homefurnRaise', function(template) {
              self.raise.setModel(self.model);
              self.raise.setTemplate('index', template);
              self.raise.show();
              self.raise.once('success', function(model) {
                self.collection.fetch();
                var $pointer = self.homefurnView.$('.arrow_rightpointer');
                if ($pointer.length > 0) {
                  self.module('numtip', 'homefurn', function(numtip) {
                    if (numtip) {
                      numtip.show({
                        elem: $pointer[0],
                        num: model.get('result').bid * model.get('result').crit,
                        align: 'right'
                      });
                    }
                  });
                }
              });
            });
          });
        }
      });
    },
    showDetail: function() {
      var self = this;
      var offset = this.$el.offset();
      this.module('itemdetail', 'homefurn', function(itemdetail) {
        if (itemdetail) {
          itemdetail.setModel(self.model);
          itemdetail.show({
            top: offset.top - 40,
            left: offset.left + self.$el.width() + 10
          });
        }
      });
    },
    hideDetail: function() {
      this.module('itemdetail', 'homefurn', function(itemdetail) {
        if (itemdetail) {
          itemdetail.hide();
        }
      });
    }
  });
  return View;
});