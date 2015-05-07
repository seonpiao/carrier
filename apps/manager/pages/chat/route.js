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

dataPool.define(/GetgirlNameList/, function*(key, ctx) {
  var result =
    yield thunkify(request)({
      url: 'http://api.mm.wanleyun.com/girlstatus/GetgirlNameList',
      // proxy: 'http://127.0.0.1:8888'
    });
  if (result) {
    var body = result[1];
    var data = JSON.parse(body);
    return data;
  }
});


var getgirlNameList = function*() {
  if (this.tried >= this.maxTry) {
    this.status = 500;
    if (this.error) {
      logger.error(this.error.stack);
    }
    return;
  }
  this.tried++;
  try {
    var result =
      yield dataPool.get('GetgirlNameList', this);
  } catch (e) {
    this.error = e;
    yield getgirlNameList.call(this);
  }
  if (result) {
    if (result && result.success == 200) {
      if (result.result) {
        this.result = this.result || {};
        this.result.girlList = result.result;
        return;
      }
    }
  }
  this.status = 404;
};


var urlBase = 'http://' + 'account.' + global.WLY_DOMAIN
var cookieMap = {};
module.exports = function(app) {
  app.route('/chat').all(function*(next) {
    this.result = this.result || {};
    this.template = 'chat/index';
    // yield getgirlNameList.call(this);
  });

  app.route('/api/userLogin$').all(function*(next) {
    this.json = true;
    var username = this.request.query.username;
    var result =
      yield thunkify(request)({
        url: urlBase + '/user/Login',
        qs: this.request.query,
        // proxy: 'http://127.0.0.1:8888'
      });
    if (result) {
      this.result = this.result || {};
      if (JSON.parse(result[0].body).code == 1) {
        cookieMap[username] = result[0].headers['set-cookie'];
      }
      this.result = JSON.parse(result[0].body);
    } else {
      this.result = {
        msg: '登录失败'
      };
    }
  });

  app.route('/api/push$').all(function*(next) {
    this.json = true;
    var username = this.request.query.username;
    var result =
      yield thunkify(request)({
        url: 'http://ic.mm.wanleyun.com/demo/web/php/push.php',
        qs: this.request.query,
        // proxy: 'http://127.0.0.1:8888',
        qs: this.request.query,
        headers: {
          'Cookie': cookieMap[username]
        }
      });
    if (result) {
      this.global.girlid = 9;
      this.result = result;
    } else {
      this.result = {
        code: 'noLogin'
      };
    }
  });
}
