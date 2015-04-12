define(["libs/client/models/base"], function(Base) {
  var Model = Base.extend({
    idAttribute: 'id',
    module: 'now',
    parse: function(resp) {
      resp.happybuf = this.commafy(resp.happybuf);
      resp.lovebuf = this.commafy(resp.lovebuf);
      resp.popbuf = this.commafy(resp.popbuf);
      //每次集资的默认值
      resp.dbid = 10;
      // resp.bid = this.commafy(resp.bid);
      // resp.curfunds = this.commafy(resp.curfunds);
      // resp.targetfunds = this.commafy(resp.targetfunds);
      resp.classval = resp['class'];
      delete resp['class'];
      return resp;
    }
  });
  return Model;
});