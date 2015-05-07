define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "homefurn",
    template: 'clothesDetail',
    events: {
      'mouseleave': 'hide'
    },
    init: function(options) {
      options = options || {};
      this.listenTo(this.model, 'change', this.render.bind(this));
      this.$el.css({
        position: 'absolute'
      })
      this.hide();
    },
    show: function(pos) {
      this.$el.show();
      var beginPos = {
        left: pos.left + 50,
        top: pos.top
      }
      createjs.Tween.get(this.$el[0])
        .set(beginPos, this.$el[0].style)
        .to(pos, 200, createjs.Ease.bounceOut)
    },
    hide: function() {
      this.$el.hide();
    }
  });
  return View;
});