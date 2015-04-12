define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    fetch: function() {
      this.set({
        happy: 7000
      });
      this.trigger('sync');
    }
  });
  return new Model;
});