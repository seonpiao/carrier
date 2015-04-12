var logger = require('log4js').getLogger('module:index');
var resetctx = require('../../../../libs/server/resetctx');
var response = require('../../../../libs/server/response');
var settings = require('../../../../settings');
var request = require('request');
var thunkify = require('thunkify');

module.exports = function(app) {
  app.route('/square$').all(function*(next) {
    yield resetctx.call(this);
    this.result = {};
    this.result.query = this.request.query;
    yield response.call(this, 'vod/index');
  });
}