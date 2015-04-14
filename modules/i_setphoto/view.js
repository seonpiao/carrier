define(["libs/client/views/base", "libs/client/swf/swfobject"], function(Base, SWF) {
  var View = Base.extend({
    moduleName: "i_setphoto",
    init: function() {
      var self = this;
      window.uploadevent = function(data) {
        data = JSON.parse(data);
        if (data.success && data.success == 200) {
          self.follow();
        } else {
          var d = dialog({
            content: '头像修改失败了，请重试'
          });
          d.show();
          setTimeout(function() {
            d.close().remove();
          }, 3000);
        }
      };
      var flashvars = {
        "jsfunc": "uploadevent",
        "imgUrl": '',
        "pid": "75642723",
        "uploadSrc": true,
        "showBrow": true,
        "showCame": false,
        "uploadUrl": "http://account.wanleyun.com/UploadAvatar/Upload"
      };

      var params = {
        menu: "false",
        scale: "noScale",
        allowFullscreen: "true",
        allowScriptAccess: "always",
        wmode: "transparent",
        bgcolor: "#FFFFFF"
      };

      var attributes = {
        id: "FaustCplus"
      };

      swfobject.embedSWF(window.resUrl + "flash/FaustCplus.swf", "flashcontent", "660", "500", "11", "expressInstall.swf", flashvars, params, attributes);
    },
    follow: function() {
      var d = dialog({
        title: '恭喜您',
        content: '头像修改成功!'
      });
      d.show();
      setTimeout(function() {
        d.close().remove();
      }, 3000);
      $('#ucavatar').attr('src', $('#ucavatar').attr('src') + '?' + new Date());
    }
  });
  return View;
});