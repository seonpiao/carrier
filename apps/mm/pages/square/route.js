var logger = require('log4js').getLogger('module:index');
var resetctx = require('../../../../libs/server/resetctx');
var response = require('../../../../libs/server/response');
var settings = require('../../../../settings');
var request = require('request');
var thunkify = require('thunkify');

module.exports = function(app, pageName) {
	app.route('/' + pageName + '$').all(function*(next) {
		this.result = {};
		this.global.girlid = 0;
    this.page = 'square';
		// this.page = 'vod';
	});
}