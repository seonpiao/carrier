define(["libs/client/views/base", "libs/client/global"], function(Base, GLOBAL) {
  var View = Base.extend({
    moduleName: "managerChat",
    events: {
      'click .login-btn': 'login',
      'click .add': 'render'
    },
    init: function() {
    	this.render();
    },
    render: function() {
      this.loadTemplate('index', function(template) {
        var res = {};
        var html = template(res);
        $('.add').before(html);

      });
    },
    login: function() {
      this.module('sign', function(sign) {
        if (sign) {
          sign.showSignModel('login', function() {
            alert(1);
          });
        }
      });
    }
  });
  return View;
});
