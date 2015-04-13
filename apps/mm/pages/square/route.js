var logger = require('log4js').getLogger('module:index');
var resetctx = require('../../../../libs/server/resetctx');
var response = require('../../../../libs/server/response');
var settings = require('../../../../settings');
var request = require('request');
var thunkify = require('thunkify');

module.exports = function(app, pageName) {
  app.route('/' + pageName + '$').all(function*(next) {
    yield resetctx.call(this);
    this.result = {
      query: this.request.query
    };
    this.global = {
      girlid: 0,
      page: pageName
    };
    yield response.call(this, pageName + '/index');
  });
}