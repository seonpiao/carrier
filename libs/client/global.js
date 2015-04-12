var apiUrl = 'http://api.mm.' + window.domain + '/';
var resUrl = 'http://static.mm.' + window.domain + '/';
var accountUrl = 'http://account.' + window.domain + '/';
var mmUrl = 'http://mm.' + window.domain + '/';

if (!window.JSON) {
  window.JSON = {};
  window.JSON.parse = function(data) {
    return (new Function("return " + data))();
  }
  window.JSON.stringify =
    (function() {
      /**
       * 字符串处理时需要转义的字符表
       * @private
       */
      var escapeMap = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\'
      };

      /**
       * 字符串序列化
       * @private
       */
      function encodeString(source) {
        if (/["\\\x00-\x1f]/.test(source)) {
          source = source.replace(
            /["\\\x00-\x1f]/g,
            function(match) {
              var c = escapeMap[match];
              if (c) {
                return c;
              }
              c = match.charCodeAt();
              return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            });
        }
        return '"' + source + '"';
      }

      /**
       * 数组序列化
       * @private
       */
      function encodeArray(source) {
        var result = ["["],
          l = source.length,
          preComma, i, item;

        for (i = 0; i < l; i++) {
          item = source[i];

          switch (typeof item) {
            case "undefined":
            case "function":
            case "unknown":
              break;
            default:
              if (preComma) {
                result.push(',');
              }
              result.push(global.JSON.stringify(item));
              preComma = 1;
          }
        }
        result.push("]");
        return result.join("");
      }

      /**
       * 处理日期序列化时的补零
       * @private
       */
      function pad(source) {
        return source < 10 ? '0' + source : source;
      }

      /**
       * 日期序列化
       * @private
       */
      function encodeDate(source) {
        return '"' + source.getFullYear() + "-" + pad(source.getMonth() + 1) + "-" + pad(source.getDate()) + "T" + pad(source.getHours()) + ":" + pad(source.getMinutes()) + ":" + pad(source.getSeconds()) + '"';
      }

      return function(value) {
        switch (typeof value) {
          case 'undefined':
            return 'undefined';

          case 'number':
            return isFinite(value) ? String(value) : "null";

          case 'string':
            return encodeString(value);

          case 'boolean':
            return String(value);

          default:
            if (value === null) {
              return 'null';
            } else if (value instanceof Array) {
              return encodeArray(value);
            } else if (value instanceof Date) {
              return encodeDate(value);
            } else {
              var result = ['{'],
                encode = global.JSON.stringify,
                preComma,
                item;

              for (var key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                  item = value[key];
                  switch (typeof item) {
                    case 'undefined':
                    case 'unknown':
                    case 'function':
                      break;
                    default:
                      if (preComma) {
                        result.push(',');
                      }
                      preComma = 1;
                      result.push(encode(key) + ':' + encode(item));
                  }
                }
              }
              result.push('}');
              return result.join('');
            }
        }
      };
    })();
}
var globalUtil = {
  queue: [],
  pkgNew: function() {
    var tdiv = $('#unpack');
    tdiv.addClass('newBling').append('<i></i>');
    this.doBling(tdiv);
    //var timers = sec ? sec : 3;
    this.pkgNewTimer = setInterval(function() {
      var ti = tdiv.find('i');
      ti.fadeOut(900, function() {
        ti.show();
      })
    }, 1000);
  },
  pkgNewTimer: null,
  emailNew: function() {
    var tdiv = $('#unmail');
    tdiv.addClass('newBling').append('<i></i>');
    this.doBling(tdiv);
    this.emailNewTimer = setInterval(function() {
      var ti = tdiv.find('i');
      ti.fadeOut(900, function() {
        ti.show();
      })
    }, 1000);
    return this.emailNewTimer;
  },
  lightpkgNew: function() { //背包图标和文字都变量
    var tdiv = $('#unpack');
    var times = 0;
    var timer = setInterval(function() {
      times++;
      if (times > 20) {
        clearInterval(timer);
      }
      if (tdiv.hasClass('packcurrent')) {
        tdiv.removeClass('packcurrent');
      } else {
        tdiv.addClass('packcurrent');
      }
    }, 1000);
    return timer;
  },
  lightemailNew: function() { //收件箱图标和文字都变量
    var tdiv = $('#unmail');
    console.log(tdiv)
    var times = 0;
    var timer = setInterval(function() {
      times++;
      if (times > 20) {
        clearInterval(timer);
      }
      if (tdiv.hasClass('mailcurrent')) {
        tdiv.removeClass('mailcurrent');
      } else {
        tdiv.addClass('mailcurrent');
      }
    }, 1000);
    return timer;
  },
  emailNewTimer: null,
  //timerBling : null,
  doBling: function(obj, sec) {

  },
  stopBling: function(obj, timer) {
    obj.removeClass('.newBling').find('i').remove();
    clearInterval(timer);
  },
  accountRefresh: function() {

  },
  itemList: [],
  userInfo: {},
  getUserInfo: function(callback) {
    $.ajax({
      url: apiUrl + 'account/getUsrinfo',
      data: {
        girlid: (girlid ? girlid : 0)
      },
      cache: false,
      dataType: "jsonp",
      jsonp: "jsonpCallback",
      success: function(data) {
        //var res = JSON.parse(data);
        var res = data;
        if (res.success == 200 && res.result) {
          globalUtil.userInfo = res.result;
          // var tdiv = $('.myLady .followers .followBtn')
          // res.result && res.result.usrangel && res.result.usrangel != '0' && res.result.angelgirl + '' == girlid + '' ? tdiv.addClass('disabled') : tdiv.removeClass('disabled')
          // res.result.angelgirl + '' != '0' && res.result.angelgirl + '' != girlid + '' ? tdiv.removeClass('disabled').addClass('already') : '';
          // var ustr = '<span class="' + (res.result.usrangel == '0' ? 'angle_btn_gray' : 'angle_btn_lights_' + res.result.usrAngel) + '"></span>' + '<span class="' + (res.result.usrvip == '0' ? 'vip_btn_gray' : 'vip_btn_lights') + '"></span>' + res.result.usrnick;
          // $('.navUsername').attr('islogin', '1').html(ustr);
          if (callback) {
            callback();
          }
        } else {
          // $('.navUsername').attr('islogin', '1').html('<a href="javascript:globalUtil.showSignModel();">登录</a>/<a href="javascript:globalUtil.showSignModel(\'register\');">注册</a>')
        }
      },
      error: function() {}

    });
  },
  commafy: function(num) {
    if ($.trim((num + "")) == "") {
      return ""
    }
    num = num + "";
    if (/^.*\..*$/.test(num)) {
      var pointIndex = num.lastIndexOf(".");
      var intPart = num.substring(0, pointIndex);
      var pointPart = num.substring(pointIndex + 1, num.length);
      intPart = intPart + "";
      var re = /(-?\d+)(\d{3})/
      while (re.test(intPart)) {
        intPart = intPart.replace(re, "$1,$2")
      }
      num = intPart + "." + pointPart;
    } else {
      num = num + "";
      var re = /(-?\d+)(\d{3})/
      while (re.test(num)) {
        num = num.replace(re, "$1,$2")
      }
    }
    return num;
  },
  delcommafy: function(num) {
    if ($.trim((num + "")) == "") {
      return "";
    }
    num = num.replace(/,/gi, '');
    return num;
  },
  showImgNum: function(num) {
    var n = num + '';
    var nstr = '';
    for (var i = 0; i < n.length; i++) {
      nstr += '<i class="num' + n.substring(i, i + 1) + '"></i>';
    }

    return nstr;
  },
  makeTimer: function(obj, callBack) {
    var self = this;
    var ss = obj.attr('seconds');
    var s = parseInt(self.converToSeconds(ss, ss));
    if (s == NaN || s == 'undefined' || ss == null) {
      s = 0
    }
    setInterval(function() {
      var t0 = parseInt(self.converToSeconds(obj.text(), ss));
      var tl = (t0 == NaN || tl == 'undefined' ? 0 : t0 - 1);
      if (tl > 0) {
        var ts = ss.indexOf(':') > -1 ? self.convertToHours(tl) : tl;
        obj.text(ts);
      } else {
        obj.text(ss.indexOf(':') > -1 ? '00:00:00' : '0');
        clearInterval();
        if (callBack) {
          callBack();
        }
      }
    }, 1000);

  },
  converToSeconds: function(t, t0) {
    if (t.indexOf(':') > -1) {
      var a = t.split(':');
      return parseInt(a[0]) * 3600 + parseInt(a[1]) * 60 + parseInt(a[2]);
    } else {
      return t;
    }

  },
  convertToHours: function(value) {
    var theTime = parseInt(value); // 秒 
    var theTime1 = 0; // 分 
    var theTime2 = 0; // 小时 
    // alert(theTime); 
    if (theTime > 60) {
      theTime1 = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      // alert(theTime1+"-"+theTime); 
      if (theTime1 > 60) {
        theTime2 = parseInt(theTime1 / 60);
        theTime1 = parseInt(theTime1 % 60);
      }
    }
    var result = "" + (parseInt(theTime) < 10 ? '0' + parseInt(theTime) : parseInt(theTime)) + "";
    //if(theTime1 > 0) { 
    result = "" + (parseInt(theTime1) < 10 ? '0' + parseInt(theTime1) : parseInt(theTime1)) + ":" + result;
    //} 
    //if(theTime2 > 0) { 
    result = "" + (parseInt(theTime2) < 10 ? '0' + parseInt(theTime2) : parseInt(theTime2)) + ":" + result;
    //}
    return result;
  },
  clearAll: function() {
    $('.pkg-item-btns').remove();
    $('.pkg-item-detail').remove();
  },
  resetScrollbar: function(oid, size, pos) {
    var scrollbar = $('#' + oid).tinyscrollbar({
      trackSize: size
    });
    var thisBar = scrollbar.data("plugin_tinyscrollbar");
    thisBar.update(pos);
    $('#' + oid).find('.scroll_up').click();
  },
  convertUsr: function(o) {
    if (typeof(o) != 'undefined' && o != null) {
      return '<span class="usrIcons">' + (o.usrangel && o.usrangel != '0' ? '<img src="' + resUrl + 'orig/images/flying' + o.usrangel + '.png" />' : '') + (o.usrvip && o.usrvip == '1' ? '<img src="' + resUrl + 'orig/images/vipbtn.png" />' : '') + '</span><span class="usrnick">' + (o.usrnick || o.username) + '</span>'
    }
  },
  dateUtil: function(i) {
    var util = {
      today: function(i) {
        var d = new Date();
        var ii = i ? i : 1;
        var y = d.getFullYear();
        var m = (d.getMonth() + ii < 10 ? '0' + (d.getMonth() + ii) : d.getMonth() + ii);
        var dd = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
        var y0 = (m > 12 ? y + 1 : y);
        var m0 = (m > 12 ? m - 12 : m);
        var d0 = (dd < 28 ? dd : this.nextMonth(y0, d.getMonth() + 1), d.getDate());
        return y0 + '-' + (m0 < 10 ? '0' + m0 : m0) + '-' + d0;
      },
      nextMonth: function(y, m, d) {
        var yu = (y % 4 == 0 && y % 100 != 0);
        var dc = {
          'm1': 31,
          'm2': (yu ? 29 : 28),
          'm3': 31,
          'm4': 30,
          'm5': 31,
          'm6': 30,
          'm7': 31,
          'm8': 31,
          'm9': 30,
          'm10': 31,
          'm11': 30,
          'm12': 30
        };
        var tm = 'm' + m;
        var nm = 'm' + (m + 1);
        var lm = (dc.nm >= d ? d : dc.nm);
        return lm < 10 ? '0' + lm : lm;
      },
      //计算当前日期后的N天
      date2str: function(n) {
        var s, d, t, t2;
        t = new Date().getTime();
        t2 = n * 1000 * 3600 * 24;
        t += t2;
        d = new Date(t);
        s = d.getUTCFullYear() + "-";
        s += ("00" + (d.getUTCMonth() + 1)).slice(-2) + "-";
        s += ("00" + d.getUTCDate()).slice(-2);
        return s;
      },

      //计算给定日期后的N天
      str2date: function(str, n) {
        var dd, mm, yy;
        var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
        if (arr = str.match(reg)) {
          yy = Number(arr[1]);
          mm = Number(arr[2]) - 1;
          dd = Number(arr[3]);
        } else {
          var d = new Date();
          yy = d.getUTCFullYear();
          mm = ("00" + (d.getUTCMonth())).slice(-2);
          dd = ("00" + d.getUTCDate()).slice(-2);
        }
        return date2str(yy, mm, dd, n);
      },

      //计算给定日期后的N天
      date2str: function(yy, mm, dd, n) {
        var s, d, t, t2;
        t = Date.UTC(yy, mm, dd);
        t2 = n * 1000 * 3600 * 24;
        t += t2;
        d = new Date(t);
        s = d.getUTCFullYear() + "-";
        s += ("00" + (d.getUTCMonth() + 1)).slice(-2) + "-";
        s += ("00" + d.getUTCDate()).slice(-2);
        return s;
      }
    }

    switch (i) {
      case 'nextMonth':
        break;
      case 30:
        return util.date2str(30)
        break;
      default:
        return util.today(i);

    }
  }
};

var shalUtil = {
  /*   
   *   A   JavaScript   implementation   of   the   Secure   Hash   Algorithm,   SHA-1,   as   defined
   *   in   FIPS   PUB   180-1
   *   Version   2.1-BETA   Copyright   Paul   Johnston   2000   -   2002.
   *   Other   contributors:   Greg   Holt,   Andrew   Kepert,   Ydnar,   Lostinet
   *   Distributed   under   the   BSD   License
   *   See   http://pajhome.org.uk/crypt/md5   for   details.
   */
  /*   
   *   Configurable   variables.   You   may   need   to   tweak   these   to   be   compatible   with
   *   the   server-side,   but   the   defaults   work   in   most   cases.
   */
  hexcase: 0,
  /*   hex   output   format.   0   -   lowercase;   1   -   uppercase                 */
  b64pad: "",
  /*   base-64   pad   character.   "="   for   strict   RFC   compliance       */
  chrsz: 8,
  /*   bits   per   input   character.   8   -   ASCII;   16   -   Unicode             */
  //These   are   the   functions   you'll   usually   want   to   call   
  //They   take   string   arguments   and   return   either   hex   or   base-64   encoded   strings   
  hex_sha1: function(s) {
    return shalUtil.binb2hex(shalUtil.core_sha1(shalUtil.str2binb(s), s.length * shalUtil.chrsz));
  },
  b64_sha1: function(s) {
    return shalUtil.binb2b64(shalUtil.core_sha1(shalUtil.str2binb(s), s.length * shalUtil.chrsz));
  },
  str_sha1: function(s) {
    return shalUtil.binb2str(shalUtil.core_sha1(shalUtil.str2binb(s), s.length * shalUtil.chrsz));
  },
  hex_hmac_sha1: function(key, data) {
    return shalUtil.binb2hex(shalUtil.core_hmac_sha1(key, data));
  },
  b64_hmac_sha1: function(key, data) {
    return shalUtil.binb2b64(shalUtil.core_hmac_sha1(key, data));
  },
  str_hmac_sha1: function(key, data) {
    return shalUtil.binb2str(shalUtil.core_hmac_sha1(key, data));
  },
  //perform   a   simple   self-test   to   see   if   the   VM   is   working   
  sha1_vm_test: function() {
    return shalUtil.hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
  },
  //Calculate   the   SHA-1   of   an   array   of   big-endian   words,   and   a   bit   length   
  core_sha1: function(x, len) {
    /*   append   padding   */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;

    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      var olde = e;

      for (var j = 0; j < 80; j++) {
        if (j < 16) w[j] = x[i + j];
        else w[j] = shalUtil.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        var t = shalUtil.safe_add(shalUtil.safe_add(shalUtil.rol(a, 5), shalUtil.sha1_ft(j, b, c, d)), shalUtil.safe_add(shalUtil.safe_add(e, w[j]), shalUtil.sha1_kt(j)));
        e = d;
        d = c;
        c = shalUtil.rol(b, 30);
        b = a;
        a = t;
      }

      a = shalUtil.safe_add(a, olda);
      b = shalUtil.safe_add(b, oldb);
      c = shalUtil.safe_add(c, oldc);
      d = shalUtil.safe_add(d, oldd);
      e = shalUtil.safe_add(e, olde);
    }
    return Array(a, b, c, d, e);

  },
  //Perform   the   appropriate   triplet   combination   function   for   the   current   
  //iteration   
  sha1_ft: function(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  },
  //Determine   the   appropriate   additive   constant   for   the   current   iteration   
  sha1_kt: function(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
  },
  //Calculate   the   HMAC-SHA1   of   a   key   and   some   data   
  core_hmac_sha1: function(key, data) {
    var bkey = shalUtil.str2binb(key);
    if (bkey.length > 16) bkey = shalUtil.core_sha1(bkey, key.length * shalUtil.chrsz);

    var ipad = Array(16),
      opad = Array(16);
    for (var i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = shalUtil.core_sha1(ipad.concat(shalUtil.str2binb(data)), 512 + data.length * shalUtil.chrsz);
    return shalUtil.core_sha1(opad.concat(hash), 512 + 160);
  },
  //Add   integers,   wrapping   at   2^32.   This   uses   16-bit   operations   internally   
  //to   work   around   bugs   in   some   JS   interpreters.   
  safe_add: function(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  },
  /*   
   *   Bitwise   rotate   a   32-bit   number   to   the   left.
   */
  rol: function(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  },
  /*   
   *   Convert   an   8-bit   or   16-bit   string   to   an   array   of   big-endian   words
   *   In   8-bit   function,   characters   >255   have   their   hi-byte   silently   ignored.
   */
  str2binb: function(str) {
    var bin = Array();
    var mask = (1 << shalUtil.chrsz) - 1;
    for (var i = 0; i < str.length * shalUtil.chrsz; i += shalUtil.chrsz)
      bin[i >> 5] |= (str.charCodeAt(i / shalUtil.chrsz) & mask) << (24 - i % 32);
    return bin;
  },

  /*   
   *   Convert   an   array   of   big-endian   words   to   a   string
   */
  binb2str: function(bin) {
    var str = "";
    var mask = (1 << shalUtil.chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += shalUtil.chrsz)
      str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
    return str;
  },
  //Convert   an   array   of   big-endian   words   to   a   hex   string.   
  binb2hex: function(binarray) {
    var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
  },
  //Convert   an   array   of   big-endian   words   to   a   base-64   string   
  binb2b64: function(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
      var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
      for (var j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32) str += shalUtil.b64pad;
        else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
      }
    }
    return str;
  }
}


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
            url: apiUrl + "sso/checkUsernameValid", //后台处理程序,只能返回true或false
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
          required: '请输入用户名',
          isUsername: '用户名不能含特殊符号',
          minlengthBytes: '用户名最少2个汉字或4个字符',
          maxlengthBytes: '用户名最多8个汉字或16个字符',
          remote: '用户名重复'
        }
      },
      singleLabel: true,
      submitHandler: function(form) {
        $('#nameHandle :submit').attr('disabled', 'disabled');
        nameHandle.doSaveName();
      }
    });
  },
  doSaveName: function() {

    $.ajax({
      url: apiUrl + 'sso/setUsernick',
      data: {
        nickname: $.trim($('#username_handle').val())
      },
      dataType: 'jsonp',
      jsonp: 'jsonpCallback',
      cache: false,
      success: function(data) {
        if (data.success == 200) {
          nameHandle.closeNameDialog();
          globalUtil.getUserInfo();
        }
      },
      error: function() {
        $('#username_handle').addClass('error');
        $('#username_handle-error').html('服务器打瞌睡了，请稍后重试｀').show();
      }
    });

  }
}


function oauth_callback(login, newuser, conflict, usrnick) {
  if (conflict == '1') {
    accountUtil.closeSignDialog();
    nameHandle.init();
    $('#username_handle').addClass('error').after('<label id="username_handle-error" class="error" for="username_handle">用户名重复</label>')
    $('#username_handle').val(usrnick);
    return false;
  }
  accountUtil.closeSignDialog();
  globalUtil.getUserInfo();
}