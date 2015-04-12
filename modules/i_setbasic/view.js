define(["libs/client/views/base", 'models/userInfo', 'libs/client/city-code', 'libs/client/moment', 'libs/client/validate/jquery.validator'], function(Base, userInfo, cityCode, MOMENT, VALIDATOR) {
  var View = Base.extend({
    moduleName: "i_setbasic",
    init: function() {
      // this.listenTo(userInfo, 'change', this.render.bind(this));
      // userInfo.fetch();
      this.setBirthday(document.getElementById('birthday-value').getAttribute('data-birthday'));
      this.setAstro(document.getElementById('astroid-value').getAttribute('data-astroid'));
      cityCode.init(document.getElementById('province'), document.getElementById('city'),
        document.getElementById('city-value').getAttribute('data-city'));
      this.initValidate();
    },
    render: function() {
      var self = this;
      this.loadTemplate('content', function(template) {
        var uInfo = userInfo.toJSON();
        $('#setbasic').html(template(uInfo));
        cityCode.init(document.getElementById('province'), document.getElementById('city'), uInfo.city);
        self.setAstro(uInfo.astroid);
        self.setBirthday(uInfo.birthday);
        self.initValidate();
      });
    },
    initValidate: function() {
      var self = this;
      $('#setbasic-form').validate({
        rules: {
          usrnick: {
            required: true
          },
          sex: {
            required: true
          },
          year: {
            required: true
          },
          month: {
            required: true
          },
          day: {
            required: true
          },
          astro: {
            required: true
          },
          province: {
            required: true
          },
          city: {
            required: true
          }
        },
        messages: {
          usrnick: {
            required: '请输入昵称'
          },
          sex: {
            required: '请选择性别'
          },
          year: {
            required: '请输入生日'
          },
          month: {
            required: '请输入生日'
          },
          day: {
            required: '请输入生日'
          },
          astro: {
            required: '请选择星座'
          },
          province: {
            required: '请选择省市'
          },
          city: {
            required: '请选择省市'
          }
        },
        singleLabel: true,
        errorPlacement: function(error, element) {
          var name = $(element).attr('name');
          if (name == 'province') {
            name = 'city';
          } else if (name == 'year' || name == 'month' || name == 'day') {
            name = 'birthday';
          }
          if ($('.basic-error[for=' + name + ']').html().length < 2) {
            error.appendTo($('.basic-error[for=' + name + ']'));
          }
        },
        submitHandler: function(form) {
          $('#setbasic-form :submit').attr('disabled', 'disabled');
          self.handleSetbasic(form);
        }
      });
    },
    handleSetbasic: function(form) {
      var queryString = $('#setbasic-form').serialize();
      var pairs = queryString.split('&');
      var result = {};
      pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
      });
      var data = {};
      data.usrnick = result.usrnick;
      data.sex = result.sex;
      data.birthday = result.year + '-' + result.month + '-' + result.day;
      data.astroid = result.astro;
      data.city = result.city;
      $.ajax({
        url: 'http://account.' + window.domain + '/ucenter/UpdateUserInfo',
        data: data,
        dataType: "jsonp",
        jsonp: "jsonpCallback",
        success: function(data) {
          if (data.code == 1) {
            userInfo.fetch();
            var d = dialog({
              title: '恭喜您',
              content: '您的个人信息修改成功！'
            });
            d.show();
            setTimeout(function() {
              d.close().remove();
            }, 3000);
          } else {
            var d = dialog({
              title: '人信息修改失败了',
              content: data.msg
            });
            d.show();
            setTimeout(function() {
              d.close().remove();
            }, 3000);
          }
          $('#setbasic-form :submit').removeAttr('disabled');
        },
        error: function() {
          $('#setbasic-form :submit').removeAttr('disabled');

        }
      });
    },
    setAstro: function(id) {
      var array = [
        '水瓶座（1.20-2.18）',
        '双鱼座（2.19-3.20）',
        '白羊座（3.21-4.19）',
        '金牛座（4.20-5.20）',
        '双子座（5.21-6.21）',
        '巨蟹座（6.22-7.22）',
        '狮子座（7.23-8.22）',
        '处女座（8.23-9.22）',
        '天秤座（9.23-10.23）',
        '天蝎座（10.24-11.22）',
        '射手座（11.23-12.21）',
        '魔羯座（12.22-1.19）'
      ];
      var astroSelect = document.getElementById('astro');
      for (var i = 0, l = array.length; i < l; i++) {
        astroSelect.options[i] = new Option(array[i], i + 1);
      }
      if (id) {
        astroSelect.options[id - 1].selected = true;
      }
    },
    setBirthday: function(birthday) {
      birthday = birthday || '1990-01-01';
      birthday = moment(birthday, 'YYYY-MM-DD');
      var year = birthday.year();
      var month = parseInt(birthday.month());
      var day = parseInt(birthday.date());
      var yearSelect = document.getElementById('year');
      var monthSelect = document.getElementById('month');
      var daySelect = document.getElementById('day');
      var currentYear = new Date().getFullYear();

      var initDay = function(day, month, year) {
        var year = yearSelect.value || year;
        var month = monthSelect.value || month;
        if (year && month) {
          var days = moment(year + '-' + month, 'YYYY-MM').daysInMonth();
          for (var i = 0, l = days; i < l; i++) {
            daySelect.options[i] = new Option(i + 1, i + 1);
          }
          if (day) {
            daySelect.options[day - 1].selected = true;
          }
        } else {
          daySelect.innerHTML = '';
        }
      };

      for (var i = 0, l = 100; i < l; i++) {
        yearSelect.options[i] = new Option(currentYear - i, currentYear - i);
      }
      yearSelect.options[currentYear - year].selected = true;

      for (var i = 0, l = 12; i < l; i++) {
        monthSelect.options[i] = new Option(i + 1, i + 1);
      }
      monthSelect.options[month].selected = true;

      initDay(day, month, year);
      yearSelect.onchange = function() {
        initDay();
      };
      monthSelect.onchange = function() {
        initDay();
      };

    }
  });
  return View;
});