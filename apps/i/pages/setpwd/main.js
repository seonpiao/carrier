require(["apps/i/pages/setpwd/modules"], function() {});


$('#refresh_verify_img,#verify_img').click(function() {
  getLoginToken();
});
$('.login_item_wrap .signItem_tip').click(function() {
  $(this).parent().find('.sign_input').focus();
});
$('.login_item_wrap .sign_input').blur(function() {
  var tip = $(this).parent().find('.signItem_tip');
  if ($.trim($(this).val()) == '') {
    tip.show();
  };
}).each(function() {
  var tip = $(this).parent().find('.signItem_tip');
  if ($.trim($(this).val()) != '') {
    tip.hide();
  };
}).on('input', function() {
  $(this).parent().find('.signItem_tip').hide();
});

$('#loginForm').validate({
  singleLabel: true,
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
  message: {
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
  errorPlacement: function(error, element) {
    error.appendTo($('.sign_error[for=' + $(element).attr('name') + ']'));
  },
  submitHandler: function(form) {
    $('#loginForm :submit').attr('disabled', 'disabled');
    doLogin();
  }
});
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

function doLogin() {
  $.ajax({
    type: "GET",
    url: "http://account.<{$domain}>/user/Login",
    data: {
      username: $("#username").val(),
      password: hex_sha1($("#password").val()),
      remember: $('#remember').attr('value'),
      login_token: $("#login_token").val(),
      verify_code: $("#verify_code").val()
    },
    dataType: "jsonp",
    jsonp: "jsonpCallback",
    success: function(data) {
      if (data.code == 1) {
        location.href = 'http://mm.<{$domain}>/square'
      } else {
        var error_num = data.data.error_num;
        if (error_num > 1) {
          getLoginToken();
        }
        var tdiv = $('.login_item .sign_error:visible:last');
        tdiv.html('<label for="' + tdiv.attr('for') + '" generated="true" class="error">' + data.msg + '</label>');
        $('#loginForm :submit').removeAttr('disabled');
      }
    }
  });
}

function getLoginToken() {
  $.ajax({
    type: "GET",
    url: "http://account.<{$domain}>/user/GetLoginToken",
    data: {},
    dataType: "jsonp",
    jsonp: "jsonpCallback",
    success: function(data) {
      if (data.code === 1) {
        data = data.data;
        if (data.show_verify_code) {
          $("#verify_img").attr("src", "http://api.mm.<{$domain}>/verifycode/index/token/" + data.login_token + "/");
        }
        $("#login_token").val(data.login_token);
        if (data.show_verify_code) {
          $('#loginVerify').show();
        } else {
          $('#loginVerify').remove();
        }
      }
    }
  });
}
