/**
 * 参数
 * coexist: true or false, default = false, true 表示共存，不会关掉其他的 dialog
 * parent: 指定 parent 的 id
 */
define(['libs/client/dialog/dialog-plus'], function() {

  var dialog = window.dialog;
  var baseCreate = dialog.oncreate;

  dialog.prototype.addChild = function(api) {
    this.child = (this.child || []).push(api);
  };
  dialog.prototype.removeAllChild = function() {
    if (this.child) {
      for (var i = 0, l = len; i < len; i++) {
        this.child[i].close();
      }
    }
  };
  dialog.oncreate = function(api) {
    var options = api.options;
    var originalOptions = options.original;
    api.x = originalOptions.parent;
    var parentId = originalOptions.parent;
    var coexist = originalOptions.coexist;
    var current = this.getCurrent();
    // var removeCurrent = function(current) {
    //   if (current) {
    //     var currentId = current.id;
    //     if (parentId != currentId) {
    //       if (current.parent && current.parent != parentId) {
    //         var parent = dialog.get(current.parent);
    //         removeCurrent(parent);
    //       }
    //       current.close();
    //     }
    //   }
    // };

    // removeCurrent(current);
    var list = dialog.list;
    var keyList = _.keys(list);
    var removeCurrent = function() {
      var key = keyList.pop();
      if (key) {
        if (list[key].id != parentId) {
          list[key].close();
          removeCurrent();
        }
      }
    };
    if (!coexist) {
      removeCurrent();
    }
    baseCreate(api);

    api.addEventListener('remove', function() {
      this.removeAllChild();
      var current = dialog.getCurrent();
      if (current) {
        var currentId = current.id;
      }
    });
  };

  return dialog;

});