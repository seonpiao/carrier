var logger = require('log4js').getLogger('module:index');
var resetctx = require('../../../../libs/server/resetctx');
var response = require('../../../../libs/server/response');
var settings = require('../../../../settings');
var request = require('request');
var thunkify = require('thunkify');
var DataPool = require('node-datapool');
var fs = require('fs');
var path = require('path');



module.exports = function(app) {
  app.route('/setbasic').all(function*(next) {
    yield fetchUserinfo.call(this);
  });
  app.route('/userlogin').all(function*(next) {
    console.log('userlogin');
    this.json = true;
    var result = yield thunkify(request)({
      url: settings.api.accountApiBase + '/ucenter/GetUserBaseInfo',
      timeout: settings.http.timeout,
      // proxy: 'http://127.0.0.1:8888',
      headers: {
        'Cookie': ctx.header.cookie || ''
      }
    });
    console.log(result);

  });
}
