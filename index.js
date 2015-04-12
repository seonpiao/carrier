var fs = require('fs');
var logger = require('log4js').getLogger('page:index');
var _ = require('underscore');
var koa = require('koa');
var path = require('path');
var routing = require('koa-routing');
var views = require('koa-views');
var body = require('koa-body');
var resetctx = require('./libs/server/resetctx');
var response = require('./libs/server/response');

var APP_PATH = path.join(__dirname, 'apps');

function init(app, pagePath) {
    app.use(views(pagePath, {
        default: 'jade',
        cache: process.env.NODE_ENV === 'production' ? true : false
    }));

    //parse body
    app.use(body());

    //routing
    app.use(routing(app, {
        defer: true
    }));
}


var argv = process.argv;

var apps = argv[2];
if (apps) {
    apps = apps.split(',');
}

apps.forEach(function(appName) {
    var appPath = path.join(APP_PATH, appName)
    var appConfig = require(path.join(appPath, 'config.js'));
    var pagePath = path.join(appPath, 'pages');
    var pageNames = fs.readdirSync(pagePath);
    var app = koa();
    init(app, pagePath);
    pageNames.forEach(function(pageName) {
        var routePath = path.join(pagePath, pageName, 'route.js');
        if (fs.existsSync(routePath)) {
            var route = require(routePath);
            route(app);
        } else {
            app.route('/' + pageName).all(function*(next) {
                yield resetctx.call(this);
                this.result = {
                    query: this.request.query
                }
                yield response.call(this, pageName + '/index');
            });
        }
    });
    //如果前面没有匹配的路由，就走默认路由响应404
    app.route('*').all(function*(next) {
        yield resetctx.call(this);
        yield response.call(this);
    });
    logger.info('App[' + appName + '] listening: ' + appConfig.port);
    app.listen(appConfig.port);
});