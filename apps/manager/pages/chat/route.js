var logger = require('log4js').getLogger('module:index');
var resetctx = require('../../../../libs/server/resetctx');
var response = require('../../../../libs/server/response');
var settings = require('../../../../settings');
var request = require('request');
var thunkify = require('thunkify');
var DataPool = require('node-datapool');
var fs = require('fs');
var path = require('path');

var urlBase = 'http://' + 'account.' + global.WLY_DOMAIN

module.exports = function(app) {
  app.route('/chat').all(function*(next) {
    this.result = {};
    this.template = 'chat/index';
  });

  app.route('/api/userLogin$').all(function*(next) {
    this.json = true;
    var result =
      yield thunkify(request)({
        url: urlBase + '/user/Login',
        qs: this.request.query,
        proxy: 'http://127.0.0.1:8888',
        qs: {
          username: 'yinfeng',
          password: 'db25f2fc14cd2d2b1e7af307241f548fb03c312a'
        },
        headers: {
          'Cookie': this.headers.Cookie || ''
        }
      });
    if (result) {
      this.result = result;
      console.log('result:');
      console.log(result);
    } else {
      this.result = {
        code: 'noLogin'
      };
    }
  });

  app.route('/api/push$').all(function*(next) {
    this.json = true;
    var result =
      yield thunkify(request)({
        url: 'http://ic.mm.wanleyun.com/demo/web/php/push.php',
        qs: this.request.query,
        proxy: 'http://127.0.0.1:8888',
        qs: {
          cname: 'girl_9',
          content: 'asdfasdfasdf'
        },
        headers: {
          'Cookie': this.headers.Cookie || ''
        }
      });
    if (result) {
      this.result = result;
    } else {
      this.result = {
        code: 'noLogin'
      };
    }
  });
}
