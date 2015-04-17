var logger = require('log4js').getLogger('module:index');
var resetctx = require('../../../../libs/server/resetctx');
var response = require('../../../../libs/server/response');
var settings = require('../../../../settings');
var request = require('request');
var thunkify = require('thunkify');
var DataPool = require('node-datapool');


module.exports = function(app) {
  app.route('/api/user/Login$').all(function*(next) {
    var urlBase = 'http://' + 'account.' + global.WLY_DOMAIN
    this.json = true;
    var result =
      yield thunkify(request)({

      });
  });
  app.route('/api/user/Logout$').all(function*(next) {
    this.global.girlid = this.request.params.girlid * 1;
  });
  app.route('/api/user/GetLoginToken$').all(function*(next) {
    this.global.girlid = this.request.params.girlid * 1;
  });
  app.route('/api/user/GetRegToken$').all(function*(next) {
    this.global.girlid = this.request.params.girlid * 1;
  });
  app.route('/api/user/UserRegister$').all(function*(next) {
    this.global.girlid = this.request.params.girlid * 1;
  });
}