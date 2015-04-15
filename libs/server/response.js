var errorMsgs = {
  404: 'Not found.',
  500: 'Internal error.'
}

var _ = require('underscore');

module.exports = function*(view) {

  var defaultLocals = {
    __env: {
      NODE_ENV: process.env.NODE_ENV,
      WLY_DOMAIN: global.WLY_DOMAIN
    },
    __global: this.global || {}
  };

  var self = this;

  var baseRule;
  _.some(bases, function(item, key) {
    var exp = new RegExp(sanitize(key));
    if (self.host.match(exp)) {
      baseRule = item;
      return true;
    }
    return false;
  });
  if (!baseRule) {
    baseRule = bases.defaults;
  }
  defaultLocals.__global.base = {};
  _.forEach(baseRule, function(val, key) {
    defaultLocals.__global.base[key] = rules[val](self.host, key);
  });


  this.locals = this.locals || defaultLocals;

  if (!this.result) {
    this.status = 404;
    try {
      //如果有自定义的404页面，就渲染404页面
      yield this.render('404/index');
    } catch (e) {
      this.body = 'Not found';
    }
    return;
  }

  if (this.json) {
    this.body = this.result
  } else {
    this.locals = this.result
  }

  if (!this.json) {
    _.extend(this.locals, defaultLocals);
    this.status = 200;
    yield this.render(view);
  } else if (this.body === null) {
    this.status = !isNaN(this.status) ? this.status : 500;
    this.body = errorMsgs[this.status];
  } else if (typeof this.body.pipe === 'function') {
    this.status = 200;
  } else {
    this.status = 200;
    _.extend(this.body, defaultLocals);
  }
}