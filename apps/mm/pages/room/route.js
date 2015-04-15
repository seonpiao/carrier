var logger = require('log4js').getLogger('module:index');
var resetctx = require('../../../../libs/server/resetctx');
var response = require('../../../../libs/server/response');
var settings = require('../../../../settings');
var request = require('request');
var thunkify = require('thunkify');
var DataPool = require('node-datapool');

var dataPool = new DataPool({
  interval: 10
});

dataPool.define(/getGirlStatus_\d+/, function*(key) {
  var girlid = key.replace(/getGirlStatus_/, '');
  var result =
    yield thunkify(request)({
      url: settings.api.apiBase + '/girlstatus/getGirlStatus',
      qs: {
        girlid: girlid
      },
      timeout: settings.http.timeout
    });
  if (result) {
    var body = result[1];
    var data = JSON.parse(body);
    return data;
  }
}, {
  expires: 60,
  autoUpdate: true
});

var fetch = function*() {
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
      yield dataPool.get('getGirlStatus_' + girlid);
  } catch (e) {
    this.error = e;
    yield fetch.call(this);
  }
  if (result) {
    var data = result;
    if (data && data.success == 200) {
      if (data.result && data.result.name && data.result.is_out != '1') {
        this.result = {
          girl: data.result
        };
        return;
      }
    }
  }
  this.status = 404;
};

module.exports = function(app, pageName) {
  app.route('/' + pageName + '/:girlid$').all(function*(next) {
    yield fetch.call(this);
    this.global.girlid = this.request.params.girlid * 1;
  });
}