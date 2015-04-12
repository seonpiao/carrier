define(["libs/client/views/base", 'libs/client/validate/jquery.validator', 'libs/client/countdown
    libs / client / chalUtil '], function(Base, VALIDATOR, chalUtil) {
    var View = Base.extend({
        moduleName: "setpwd",
        template: 'index',
        init: function() {
            $('input, textarea').placeholder();
            this.setpwd();
        },
        setpwd: function() {
            var self = this;
            $('#setpwdForm').validate({
                singleLabel: true,
                rules: {
                    oldPassword: {
                        required: true,
                        isPassword: true
                    },
                    newPassword: {
                        required: true,
                        minlength: 6,
                        maxlength: 20,
                        isPassword: true
                    },
                    confirm: {
                        required: true,
                        equalTo: '[name=newPassword]'
                    }
                },
                messages: {
                    oldPassword: {
                        required: '请输入密码',
                        isPassword: '密码需要包含大小写字母、数字、符号至少2项'
                    },
                    newPassword: {
                        required: '请输入密码',
                        minlength: '密码至少要6位',
                        maxlength: '密码最多不能超过20位',
                        isPassword: '密码需要包含大小写字母、数字、符号至少2项'
                    },
                    confirm: {
                        required: '请再次输入密码',
                        equalTo: '两次密码不一致'
                    }
                },
                errorPlacement: function(error, element) {
                    element.parent().append(error);
                },
                submitHandler: function(form) {
                    $('#setpwdForm :submit').attr('disabled', 'disabled');
                    self.updatePassword();
                }
            });
        },
        updatePassword: function() {
            var self = this;
            $.ajax({
                type: "GET",
                url: window.accountUrl + "ucenter/UpdateUserPass",
                data: {
                    password: shalUtil.hex_sha1($("#newPassword").val()),
                    oldpassword: shalUtil.hex_sha1($("#oldPassword").val())
                },
                dataType: "jsonp",
                cache: false,
                jsonp: 'jsonpCallback',
                success: function(data) {
                    if (data.code === 1) {
                        alert('密码修改成功');
                    } else {
                        $('#setpwdForm :submit').removeAttr('disabled');
                        alert(data.code);
                    }
                }
            });
        }
    });
    return View;
});