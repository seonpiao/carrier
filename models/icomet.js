define(["libs/client/models/base"], function(Base) {
  var icomet;
  var Model = Base.extend({
    fetch: function(options) {
      var self = this;
      var signUrl = "http://ic.mm.wanleyun.com/demo/web/php/sign.php";
      icomet = new iComet({
        channel: options.channel,
        signUrl: options.signUrl || signUrl,
        subUrl: options.subUrl,
        pubUrl: options.pubUrl,
        callback: function(content) {
          self.trigger('sync', content);

        }
      });
    },
    stop: function(){
      icomet.stop();
    },
    pub: function(content){
      icomet.pub(content);
    }
  });
  return Model;
});
