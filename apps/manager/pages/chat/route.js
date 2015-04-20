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
    yield fetchUserinfo.call(this);
  });
  app.route('/api/userLogin$').all(function*(next) {
    console.log('/api/userLogin');
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
}
