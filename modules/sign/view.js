define(["libs/client/views/base", "models/userVitality", 'libs/client/dialog/dialog-plus', 'libs/client/validate/jquery.validator', 'libs/client/chalUtil', "libs/client/base64", "models/userInfo"], function(Base, userVitality, DIALOG, VALIDATOR, SHALUTIL, base64, userInfo) {
  var View = Base.extend({
    moduleName: "sign",
    template: 'index',
    events: {
      'click .signToLogin': 'signToLogin',
      'click .signToRegister': 'signToRegister',
      'click .doLogin': '',
      'click .doRegister': '',
      'click .signToWeibo': 'signToWeibo',
      'click .btn_login': 'signToLogin',
      'click .btn_register': 'signToRegister'
    },
    init: function() {
      var self = this;
      $(window).on('quicklink.openLoginPopwin', function() {
        self.showSignModel();
      });
      this.listenTo(this.model, 'change', this.render.bind(this));
      this.model.cache(this.render.bind(this));
      // this.loadTemplate('index', function(template) {
      //  self.model.cache(function() {
      //    var data = self.model.toJSON();
      //    var html = template(data);
      //    self.$el.html(html);
      //  });
      // });
      window.ssoLoginCallback = function(data) {
        // 'msg' => '登录成功', 'code' => 1);
        // 'msg' => '请完善用户信息', 'code' => 2);
        // 'msg' => '请重新命名昵称', 'code' => 3);
        // 'msg' => '登录错误，请重试', 'code' => 0);
        data = JSON.parse(base64.utf8to16(base64.decode64(data)));
        var originData = data;
        var code = data.code;
        if (code == 3) {
          self.closeSignDialog();

          var nameHandle = {
            nameDialog: null,
            closeNameDialog: function() {
              if (this.nameDialog) {
                this.nameDialog.close().remove();
              }
            },
            init: function() {
              var namestr = '<div class="nameHandle"><div class="nameHandleInner clearfix"><form action="" onsubmit="" method="" id="nameHandle">' + '<h3>好名字总是被重复，换一个名字让我们重新认识下</h3>' + '<div class="photo"><img src="' + resUrl + 'orig/images/photo.png" width="60" height="60"/></div>' + '<ul class="nameInfo"><li class="nameArea"><input class="nameInput" name="username" id="username_handle" autocomplete="off"/></li><li class="nameSubmit">'
                //+'<a href="javascript:void(0);" class="submit">'
                + '<input type="submit" class="nameHandleSubmit" value="修改" />'
                //+'</a>'
                + '</li></ul>' + '</form></div></div>'
              var d = dialog({
                id: 'popup-nameHanle',
                title: '完善资料',
                content: namestr,
                width: 500,
                skin: 'popup-nameHandle'
              });
              d.show();
              nameHandle.nameDialog = d;
              nameHandle.initValidate();
            },
            initValidate: function() {
              $('#nameHandle').validate({
                rules: {
                  username: {
                    required: true,
                    isUsername: true,
                    maxlengthBytes: 16,
                    minlengthBytes: 4,
                    remote: {
                      url: apiUrl + "user/CheckUserName", //后台处理程序,只能返回true或false
                      data: {
                        username: function() {
                          return $("#username_handle").val()
                        }
                      },
                      type: "GET", //数据发送方式
                      dataType: "jsonp" //接受数据格式
                    }
                  }
                },
                messages: {
                  username: {
                    required: '请输入昵称',
                    isUsername: '昵称不能含特殊符号',
                    minlengthBytes: '昵称最少2个汉字或4个字符',
                    maxlengthBytes: '昵称最多8个汉字或16个字符',
                    remote: '昵称已经被使用了'
                  }
                },
                singleLabel: true,
                submitHandler: function(form) {
                  $('#nameHandle :submit').attr('disabled', 'disabled');
                  nameHandle.doSaveName(originData);
                }
              });
            },
            doSaveName: function(data) {
              $.ajax({
                url: apiUrl + 'user/SetNickname',
                data: {
                  nickname: $.trim($('#username_handle').val())
                },
                dataType: "jsonp",
                jsonp: "jsonpCallback",
                success: function(data) {
                  $('#nameHandle :submit').removeAttr('disabled');
                  var code = data.code;
                  if (code == 1) {
                    nameHandle.closeNameDialog();
                    userInfo.fetch();
                  }
                },
                error: function() {
                  $('#nameHandle :submit').removeAttr('disabled');
                  $('#username_handle').addClass('error');
                  $('#username_handle-error').html('服务器打瞌睡了，请稍后重试').show();
                }
              });
            }
          };
          nameHandle.init();
          var data = data.data;
          $('#username_handle').addClass('error').after('<label id="username_handle-error" class="error" for="username_handle">昵称已经被使用了</label>')
          $('#username_handle').val(data.usrnick);
          $('.nameHandleInner .photo img').attr('src', data.avatar);
          return false;
        } else if (code == 0) {
          alert(data.msg);
        }
        self.signDialog.close().remove();
        userInfo.fetch();
      };
      this.listenTo(userVitality, 'sync', function(data) {
        var data = userVitality.toJSON();
        var vitalityLevel = data.vitalitylevel + '';
        var str = '';
        for (var i = 0, l = vitalityLevel.length; i < l; i++) {
          str += '<i class="num_' + vitalityLevel[i] + '"> </i>';
        }
        $('.p_vipgradei').html(str);
        var width = (parseInt(data.vitality) - data.vitalitylevelmin) / (data.vitalitylevelmax - data.vitalitylevelmin) * 67;
        $('.user_grade_progress').html('<span style="width:' + Math.round(width) + 'px;"></span>');
      });
    },
    render: function() {
      Base.prototype.render.apply(this, arguments);
      userVitality.fetch();
    },
    initLogin: function(callback) {
      var self = this;
      // self.getLoginToken();
      $('#refresh_verify_img,#verify_img').click(function() {
        self.getLoginToken();
      });
      self.initInput();
      $('#remember').click(function() {
        if (this.checked) {
          $(this).attr({
            'value': '1',
            'checked': 'checked'
          });
        } else {
          $(this).attr('value', '0').removeAttr('checked');
        }
      });
      $('#loginForm').validate({
        rules: {
          username: {
            required: true
          },
          password: {
            required: true
          },
          verify_code: {
            required: function() {
              return $('#loginVerify:visible').length > 0 ? true : false
            }
          }
        },
        messages: {
          username: {
            required: '请输入用户名'
          },
          password: {
            required: '请输入密码'
          },
          verify_code: {
            required: '请输入验证码'
          }
        },
        singleLabel: true,
        errorPlacement: function(error, element) {
          error.appendTo($('.sign_error[for=' + $(element).attr('name') + ']'));
        },
        submitHandler: function(form) {
          $('#loginForm :submit').attr('disabled', 'disabled');
          self.doLogin(callback);
        }
      });
    },
    initRegister: function(callback) {
      var self = this;
      self.getRegToken();
      $('#reg_refresh_verify_img,#reg_verify_img').click(function() {
        self.getRegToken();
      });
      self.initInput();
      $('#registerForm').validate({
        singleLabel: true,
        rules: {
          reg_username: {
            required: true,
            isUsername: true,
            maxlengthBytes: 16,
            minlengthBytes: 4,
            remote: {
              url: apiUrl + "user/CheckUserName", //后台处理程序,只能返回true或false
              data: {
                username: function() {
                  return $("#reg_username").val()
                }
              },
              type: "GET", //数据发送方式
              dataType: "jsonp" //接受数据格式
            }
          },
          reg_password: {
            required: true,
            minlength: 6,
            maxlength: 20,
            isPassword: true
          },
          confirm: {
            required: true,
            equalTo: '#reg_password'
          },
          reg_verify_code: {
            required: true

          }
        },
        messages: {
          reg_username: {
            required: '请输入用户名',
            isUsername: '用户名不能含特殊符号',
            minlengthBytes: '用户名最少2个汉字或4个字符',
            maxlengthBytes: '用户名最多8个汉字或16个字符',
            remote: '用户名重复'
          },
          reg_password: {
            required: '请输入密码',
            minlength: '密码至少要6位',
            maxlength: '密码最多不能超过20位',
            isPassword: '密码需要包含大小写字母、数字、符号至少2项',
            remote: '该用户名已经存在'
          },
          confirm: {
            required: '请再次输入密码',
            equalTo: '两次密码不一致'

          },
          reg_verify_code: {
            required: '请输入验证码'
          }
        },
        errorPlacement: function(error, element) {
          error.appendTo($('.sign_error[for=' + $(element).attr('name') + ']'));
        },
        submitHandler: function(form) {
          $('#registerForm :submit').attr('disabled', 'disabled');
          self.createUser(callback);
        }
      });
    },
    initInput: function() {
      $('input').placeholder();
      $('input').click(function() {
        $(this).select();
      });
      // var self = this;
      // $('.login_item_wrap .signItem_tip').click(function() {
      //   $(this).hide().parent().find('.sign_input').focus();
      // });
      // $('.login_item_wrap .sign_input').blur(function() {
      //   var tip = $(this).parent().find('.signItem_tip');
      //   if ($.trim($(this).val()) == '') {
      //     tip.show();
      //   }
      // }).focus(function() {
      //   $(this).parent().find('.signItem_tip').hide();
      // }).each(function() {
      //   var tip = $(this).parent().find('.signItem_tip');
      //   if ($.trim($(this).val()) != '') {
      //     tip.hide();
      //   }
      // });
    },
    doLogin: function(callback) {
      var self = this;
      $.ajax({
        type: "GET",
        url: window.accountUrl + "user/Login",
        data: {
          username: $("#username").val(),
          password: shalUtil.hex_sha1($("#password").val()),
          remember: $('#remember').attr('value'),
          login_token: $("#login_token").val(),
          verify_code: $("#verify_code").val()
        },
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.code === 1) {
            $('#loginForm :submit').attr('disabled', 'disabled');
            self.signDialog.close().remove();
            userInfo.fetch();
            if (callback) {
              callback();
            }
          } else {
            var error_num = data.data.error_num;
            if (error_num > 1) {
              self.getLoginToken();
            }
            self.showServerMsg(data);
            $('#loginForm :submit').removeAttr('disabled');
          }
        }
      });
    },
    getLoginToken: function() {
      var self = this;
      $.ajax({
        type: "GET",
        url: window.accountUrl + 'user/GetLoginToken',
        data: {},
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.code === 1) {
            data = data.data;
            $("#verify_img").attr("src", apiUrl + "verifycode/index/token/" + data.login_token + "/");
            $("#login_token").val(data.login_token);
            if (data.show_verify_code) {
              $("#verify_code").addClass("required");
              $('#loginVerify').show();
            } else {
              $("#verify_code").removeClass("required");
              $('#loginVerify').hide();
            }
          }
        }
      });
    },
    //显示服务器错误信息
    showServerMsg: function(data) {
      var self = this;
      var msg = [];
      msg[5001006] = "您输入的密码和用户名不匹配，请重新输入";
      msg[5001004] = "验证码不正确";
      msg[5001001] = "用户名包含敏感词";
      var item, errStr = '',
        tdiv = $('#loginForm .login_item:visible .sign_error:last');
      item = tdiv.attr('for');
      if (data.code !== 1) {
        errStr = '<label for="' + item + '" generated="true" class="error">' + msg[data.code] + '</label>';
        tdiv.html(errStr);
        if (data.error_code == 5001004) {
          item = 'verify_code';
          $('input[name=' + item + ']').addClass('error').val('').focus();
        }
      }
    },
    getRegToken: function() {
      var self = this;
      $.ajax({
        type: "GET",
        url: window.accountUrl + "user/GetRegToken",
        data: {},
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.code === 1) {
            data = data.data;
            $("#reg_verify_img").attr("src", apiUrl + "verifycode/index/token/" + data.reg_token + "/v/" + (new Date()).getTime());
            $("#reg_token").val(data.reg_token);
          }
        }
      });
    },
    createUser: function(callback) {
      var self = this;
      $.ajax({
        type: "GET",
        url: window.accountUrl + "user/UserRegister",
        data: {
          username: $("#reg_username").val(),
          password: shalUtil.hex_sha1($("#reg_password").val()),
          reg_token: $("#reg_token").val(),
          verify_code: $("#reg_verify_code").val()
        },
        dataType: "jsonp",
        cache: false,
        jsonp: "jsonpCallback",
        success: function(data) {
          //alert(data.error_code);
          if (data.code === 1) {
            $('#registerForm :submit').attr('disabled', 'disabled');
            //location.href='/'
            self.signDialog.close().remove();
            userInfo.fetch();
          } else {
            $('#registerForm :submit').removeAttr('disabled');
            self.showServerMsgReg(data);
          }
        }
      });
    },
    //显示服务器错误信息
    showServerMsgReg: function(data) {
      var self = this;
      var msg = [];
      msg[5001004] = "验证码不正确";
      // msg[2001008] = "用户名重复";
      msg[5001001] = "用户名昵称含敏感词";
      var item, errStr = '',
        tdiv = $('#registerForm .login_item .sign_error:last');
      item = tdiv.attr('for');
      if (data.code) {
        if (data.code == 2001008 || data.code == 5001001) { //用户名错误
          item = 'reg_username';
          tdiv = $('.login_item .sign_error[reg_username]');
          $('input[name=' + item + ']').addClass('error').val('').focus();
        }
        errStr = '<label for="' + item + '" generated="true" class="error">' + msg[data.code] + '</label>';
        tdiv.html(errStr);
      } else {
        errStr = '<label for="' + item + '" generated="true" class="error">未知错误，请稍后重试</label>';
        tdiv.html(errStr);
      }
    },
    signTab: function(item) {
      $('.signPopwinTab span[item=' + item + ']').click();
    },
    signTitleStr: '<div class="signPopwinTab"><span class="hover" item="login">登录</span><span class="" item="register">注册</span></div>',
    signLoginStr: '<div class="popwinLeft" item="login"><form action="" onsubmit="" method="" id="loginForm" class="cl">' + '<input id="login_token" type="hidden" name="login_token" value=""/>' + '<dl class="login_item cl"><dd class="right login_item_wrap fl"><input name="username" type="text" id="username" placeholder="请输入用户名" class="sign_input input_288_38"  autocomplete="off"/></dd><dd class="sign_error" for="username"></dd></dl>' + '<dl class="login_item cl"><dd class="right login_item_wrap fl"><input name="password" type="password" id="password"  placeholder="请输入不少于6位密码" class="sign_input input_288_38"  autocomplete="off"/></dd><dd class="sign_error" for="password"></dd></dl>' + '<dl class="login_item cl" style="display: none;" id="loginVerify"><dd class="right login_item_wrap fl"><input name="verify_code" type="text" id="verify_code" class="sign_input input_confrom" placeholder="验证码" autocomplete="off"/><span><a href="#"><img src="" width="110" height="38" hspace="10" vspace="0" border="0" id="verify_img"/></a><a href="javascript:void(0)" id="refresh_verify_img">点击刷新</a></span></dd><dd class="sign_error" for="verify_code"></dd></dl>' + '<div class="remember cl"><span><label for="remember"><input type="checkbox" name="remember" id="remember" value="1" checked="checked"/> 记住我</label></span><a class="forget_pw hide" href="/findpassword" style="margin-left:5px">找回密码</a></div>' + '<div class="cl" style="margin-top:5px;"><input class="reg_bt signToLogin" type="submit" value="登录" style="margin-left:0px;"/></div>' + '<div class="remember cl" style="line-height:24px;margin-top:10px;"><span>没有账号？</span></div>' + '</form></div>',
    signRegistStr: '<div class="popwinLeft" item="register" style="display:none"><form action="" onsubmit="" method="" id="registerForm">' + '<input id="reg_token" type="hidden" name="reg_token" value=""/>' + '<dl class="login_item cl"><dd class="right login_item_wrap fl"><input name="reg_username" type="text" autocomplete="off" id="reg_username" placeholder="请输入用户名" class="sign_input input_288_38 "/></dd><dd class="sign_error" for="reg_username"></dd></dl>' + '<dl class="login_item cl"><dd class="right login_item_wrap fl"><input name="reg_password" type="password" autocomplete="off" id="reg_password"  placeholder="请输入不少于6位密码" class="sign_input input_288_38" /></dd><dd class="sign_error" for="reg_password"></dd></dl>' + '<dl class="login_item cl"><dd class="right login_item_wrap fl"><input name="confirm" type="password" autocomplete="off" id="confirm"  placeholder="再次输入密码" class="sign_input input_288_38" /></dd><dd class="sign_error" for="confirm"></dd></dl>' + '<dl class="login_item cl"><dd class="right login_item_wrap fl"><input name="reg_verify_code" type="text" autocomplete="off" id="reg_verify_code" placeholder="验证码" class="sign_input input_confrom" /><span><a href="#"><img src="" width="110" height="38" hspace="10" vspace="0" border="0" id="reg_verify_img"/></a><a href="javascript:void(0)" id="reg_refresh_verify_img">点击刷新</a></span></dd><dd class="sign_error" for="reg_verify_code"></dd></dl>' + '<div class="remember" style=""><a href="http://www.wanleyun.com/user_agreement.html" class="login">《玩乐云用户使用协议》</a></div>' + '<div class="line cl" style="line-height:24px; margin-top:5px;"><input class="reg_bt signToRegister" type="submit" value="同意并注册" style="margin-left:0px;"/></div><div class="remember cl" style="margin-top:10px;"><span>已有账号？ </span></div>' + '</form></div>',
    cooperationStr: '<div class="popwinRight"><div class="otherMethods cl"><p style="line-height:22px;"><span color="#7f7f7f">使用合作网站账号一键登录</span></p><p><a href="javascript:window.open(\'' + accountUrl + 'weixinauth/login\');" class="oMsgBtn wx" style="margin-right:10px;"><i></i><em>微信登录</em></a><a href="javascript:window.open(\'' + accountUrl + 'qqauth/login\');" class="oMsgBtn qq" style="margin-right:10px;"><i></i><em>QQ登录</em></a><a href="javascript:window.open(\'' + accountUrl + 'weiboauth/login\');" class="oMsgBtn wb"><i></i><em>微博登录</em></a></p></div></div>',
    signDialog: null,
    closeSignDialog: function() {
      if (this.signDialog) {
        this.signDialog.close().remove();
      }
    },
    doTab: function(e) {
      e.preventDefault();
      var self = this;
      var tdiv = $(e.target);
      var item = tdiv.attr('item');
      if (!tdiv.hasClass('hover')) {
        tdiv.addClass('hover').siblings('span').removeClass('hover');
        $('.popwinLeft').hide();
        $('.popwinLeft[item=' + item + ']').show();
      }
      if (item === 'login') {
        this.initLogin();
      } else {
        this.initRegister();
      }
    },
    signToLogin: function(e, callback) {
      e.preventDefault();
      this.showSignModel('login', callback);
    },
    signToRegister: function(e, callback) {
      e.preventDefault();
      this.showSignModel('register', callback);
    },
    getSignStr: function() {
      var finalStr = ''
      this.loadTemplate('title', function(template) {
        finalStr += template();
      });
      finalStr += '<div class="signPopwinC cl">';
      this.loadTemplate('login', function(template) {
        finalStr += template();
      });
      this.loadTemplate('register', function(template) {
        finalStr += template();
      });
      this.loadTemplate('cooperate', function(template) {
        finalStr += template();
      });
      finalStr += '</div>';
      return finalStr;
    },
    showSignModel: function(item, callback) {
      if (userInfo.get('isLogin') === true) {
        if (callback) {
          callback();
        }
        return;
      }
      var self = this;
      var finalStr = this.signTitleStr + '<div class="signPopwinC cl">' + this.signLoginStr + this.signRegistStr + this.cooperationStr + '</div>'
      var signDialog = dialog({
        id: 'signDialog',
        title: ' ',
        content: finalStr,
        padding: '17px 29px 15px 29px',
        width: 520,
        skin: 'popup-sign-dialog'
      });
      signDialog.showModal();
      this.signDialog = signDialog;
      $('<a>', {
        'href': 'javascript:;',
        text: '  立即注册',
        click: function() {
          self.signTab('register');
        }
      }).appendTo($('.popwinLeft[item=login] .remember:last span'));
      $('<a>', {
        'href': 'javascript:;',
        text: '  直接登录',
        click: function() {
          self.signTab('login');
        }
      }).appendTo($('.popwinLeft[item=register] .remember:last span'));
      $('.signPopwinTab span').click(function(e) {
        self.doTab(e);
      });
      if (item == 'register') {
        $('.signPopwinTab span[item=register]').click();
        // self.initRegister(callback);
      } else {
        self.initLogin(callback);
      }
    }


  });
  return View;
});
