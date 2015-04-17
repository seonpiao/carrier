var logger = require('log4js').getLogger('module:index');
var resetctx = require('../../../../libs/server/resetctx');
var response = require('../../../../libs/server/response');
var settings = require('../../../../settings');
var request = require('request');
var thunkify = require('thunkify');
var DataPool = require('node-datapool');

var urlBase = 'http://' + 'account.' + global.WLY_DOMAIN

module.exports = function(app) {
  app.route('/api/user/Login$').all(function*(next) {
    this.text = true;
    var result =
      yield thunkify(request)({
        url: urlBase + '/user/Login',
        qs: this.request.query,
        headers: {
          'Cookie': this.headers.Cookie || ''
        }
      });
    if (result) {
      var body = result[1];
      if (body) {
        this.set(result[0].headers)
      }
    }
  });
  app.route('/api/user/Logout$').all(function*(next) {
    this.text = true;
    var result =
      yield thunkify(request)({
        url: urlBase + '/user/Logout',
        qs: this.request.query,
        headers: {
          'Cookie': this.headers.Cookie || ''
        }
      });
    if (result) {
      var body = result[1];
      if (body) {
        this.set(result[0].headers)
      }
    }
  });
  app.route('/api/user/GetLoginToken$').all(function*(next) {
    this.text = true;
    var result =
      yield thunkify(request)({
        url: urlBase + '/user/GetLoginToken',
        qs: this.request.query,
        headers: {
          'Cookie': this.headers.Cookie || ''
        }
      });
    if (result) {
      var body = result[1];
      if (body) {
        this.set(result[0].headers)
      }
    }
  });
  app.route('/api/user/GetRegToken$').all(function*(next) {
    this.text = true;
    var result =
      yield thunkify(request)({
        url: urlBase + '/user/GetRegToken',
        qs: this.request.query,
        headers: {
          'Cookie': this.headers.Cookie || ''
        }
      });
    if (result) {
      var body = result[1];
      if (body) {
        this.set(result[0].headers)
      }
    }
  });
  app.route('/api/user/UserRegister$').all(function*(next) {
    this.text = true;
    var result =
      yield thunkify(request)({
        url: urlBase + '/user/UserRegister',
        qs: this.request.query,
        headers: {
          'Cookie': this.headers.Cookie || ''
        }
      });
    if (result) {
      var body = result[1];
      if (body) {
        this.set(result[0].headers)
      }
    }
  });
}