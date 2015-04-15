var logger = require('log4js').getLogger('module:index');
var resetctx = require('../../../../libs/server/resetctx');
var response = require('../../../../libs/server/response');
var settings = require('../../../../settings');
var request = require('request');
var thunkify = require('thunkify');
var DataPool = require('node-datapool');
var fs = require('fs');
var path = require('path');

var dataPool = new DataPool({
  interval: 10
});

dataPool.define(/GetUserBaseInfo/, function*(key, ctx) {
  var result =
    yield thunkify(request)({
      url: settings.api.accountApiBase + '/ucenter/GetUserBaseInfo',
      timeout: settings.http.timeout,
      // proxy: 'http://127.0.0.1:8888',
      headers: {
        'Cookie': ctx.header.cookie || ''
      }
    });
  if (result) {
    var body = result[1];
    var data = JSON.parse(body);
    return data;
  }
});

var fetchUserinfo = function*() {
  if (this.tried >= this.maxTry) {
    this.status = 500;
    if (this.error) {
      logger.error(this.error.stack);
    }
    return;
  }
  this.tried++;
  var girlid = this.request.params.girlid;
  try {
    var result =
      yield dataPool.get('GetUserBaseInfo', this);
  } catch (e) {
    this.error = e;
    yield fetchUserinfo.call(this);
  }
  if (result) {
    if (result && result.code == 1) {
      if (result.data) {
        this.result = result.data;
        return;
      }
    } else if (result && result.code == 2) {
      // 没有登录
      logger.info('no login')
      this.status = 301;
      this.redirect('http://' + __global.base.i + '/login');
      return;
    }
  }
  this.status = 404;
};


module.exports = function(app) {
  app.route('/setbasic').all(function*(next) {
    var dirname = __dirname;
    var expectFile = path.normalize(dirname + '/../views' + this.url + '.jade');
    // TODO 没有登录的话，跳到登录页 http://account.wanleyun.com/login
    yield resetctx.call(this);
    logger.info(this.url);
    if (this.url == '/setpwd' || this.url == '/setbasic' || this.url == '/setphoto') {
      yield fetchUserinfo.call(this);
    }
    logger.info('result');
    logger.info(this.result);
    if (this.result) {
      this.result.query = this.request.query;
      yield response.call(this, 'setbasic/index');
    }
  });
}