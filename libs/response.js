var errorMsgs = {
  404: 'Not found.',
  500: 'Internal error.'
}

var _ = require('underscore');

module.exports = function*(view) {

  var defaultLocals = {
    __env: {
      NODE_ENV: process.env.NODE_ENV,
      WLY_DOMAIN: process.env.WLY_DOMAIN
    }
  };

  this.locals = this.locals || defaultLocals;

  if (!this.result) {
    yield this.render('page404');
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