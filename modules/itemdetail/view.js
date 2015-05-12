define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "itemdetail",
    template: 'index',
    events: {
      'mouseleave': 'hide'
    },
    init: function(options) {
      options = options || {};
      this.$el.css({
        position: 'absolute'
      })
      this.hide();
      this.$el.appendTo(this.$body);
    },
    setModel: function() {
      Base.prototype.setModel.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render.bind(this));
    },
    show: function(pos) {
      var self = this;
      this.once('afterrender', function() {
        self.$el.show();
        //jQuery object
        if (pos.height) {
          var $el = pos;
          var elWidth = $el.width();
          var elHeight = $el.height();
          var offset = $el.offset();
          var detailOffset = self.$el.offset();
          var arrowOffset = self.$('.arrow_icon').offset();
          pos = {
            top: offset.top + elHeight - (arrowOffset.top - detailOffset.top) - 70,
            left: offset.left + elWidth + 10
          };
        }
        var beginPos = {
          left: pos.left,
          top: pos.top - 50,
          opacity: 0
        }
        self.$el.css(beginPos);
        createjs.Tween.removeTweens(self.$el[0]);
        self._tween = createjs.Tween.get(self.$el[0])
          .to(_.extend(pos, {
            opacity: 1
          }), 200, createjs.Ease.backOut)
          .wait(300)
          .call(function() {
            // self.$('.red').data('numbercounter').startCounter();
          });
        // self.$('.red').NumberCounter({
        //   onUpdate: function(curVal) {
        //     $(this).html(globalUtil.commafy(curVal))
        //   }
        // });
        // self.$('.red').html('0');
      })
      this.render();
    },
    hide: function() {
      createjs.Tween.removeTweens(this.$el[0]);
      this.$el.hide();
    }
  });
  return View;
});