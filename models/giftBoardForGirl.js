define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    module: 'item',
    action: 'getGiftBoardForGirl'
  });
  return new Model;
});