define(["libs/client/views/base", "libs/client/queue"], function(Base, queue) {
  var View = Base.extend({
    moduleName: "flash",
    base: window.resUrl + 'flash/cutscenes/',
    movies: {
      '星星': {
        flash_url: window.resUrl + 'flash/cutscenes/1.swf',
        width: 400,
        height: 400
      },
      'SPA': {
        flash_url: window.resUrl + 'flash/cutscenes/2.swf',
        width: 400,
        height: 400
      },
      '房卡': {
        flash_url: window.resUrl + 'flash/cutscenes/3.swf',
        width: 400,
        height: 400
      },
      '海洋之心': {
        flash_url: window.resUrl + 'flash/cutscenes/4.swf',
        width: 800,
        height: 600,
        ts: 4
      },
      '环游世界': {
        flash_url: window.resUrl + 'flash/cutscenes/5.swf',
        width: 400,
        height: 400
      },
      '加油fight': {
        flash_url: window.resUrl + 'flash/cutscenes/6.swf',
        width: 400,
        height: 400
      },
      '水晶浴缸': {
        flash_url: window.resUrl + 'flash/cutscenes/7.swf',
        width: 400,
        height: 400
      },
      '私人海岛': {
        flash_url: window.resUrl + 'flash/cutscenes/8.swf',
        width: 800,
        height: 600
      },
      '土豪金': {
        flash_url: window.resUrl + 'flash/cutscenes/9.swf',
        width: 400,
        height: 400
      },
      '你是我的小苹果': {
        flash_url: window.resUrl + 'flash/cutscenes/10.swf',
        width: 400,
        height: 400
      },
      '小烟火': {
        flash_url: window.resUrl + 'flash/cutscenes/11.swf',
        width: 400,
        height: 400
      },
      '中烟火': {
        flash_url: window.resUrl + 'flash/cutscenes/12.swf',
        width: 400,
        height: 400
      },
      '大烟火': {
        flash_url: window.resUrl + 'flash/cutscenes/13.swf',
        width: 400,
        height: 400
      },
      angel: {
        flash_url: window.resUrl + 'flash/angel.swf?name=' + window.resUrl + 'head/{uid}/100.png',
        width: 400,
        height: 400
      },
      angel_silver: {
        flash_url: window.resUrl + 'flash/angel_silver.swf?name=' + window.resUrl + 'head/{uid}/100.png',
        width: 400,
        height: 400
      }
    },
    init: function() {
      this._random = new Date().getTime();
      this.tmpId = 'flash_tmp_' + this._random;
      var self = this;
      window.flashReady = function(flashName) {
        self.trigger('flashready.' + flashName);
      };
      window.__flash = this;
      this._queue = queue(1);
    },
    show: function(flashid, itemid, userid) {
      var self = this;
      var movie = this.movies[flashid];
      if (movie) {
        movie.userid = userid;
        this._queue.defer(function(callback) {
          self.play(movie, callback);
        })
      } else {
        $.ajax({
          url: window.apiUrl + 'itemFlash/GetItemFlashById',
          data: {
            flashid: flashid,
            itemid: itemid
          },
          cache: false,
          dataType: 'jsonp',
          jsonp: 'jsonpCallback',
          success: function(data) {
            if (data.success == 200) {
              var movie = data.result;
              movie.userid = userid;
              self._queue.defer(function(callback) {
                self.play(movie, callback);
              })
            }
          }
        });
      }
    },
    play: function(movie, callback) {
      if (this.$tmp) {
        this.hide();
      }
      this.$tmp = $('<div class="flash_effect_wrapper"><div id="' + this.tmpId + '"/></div>');
      this.$body.append(this.$tmp);
      var aniVars = {
        flashvars: {},
        params: {
          quality: "high",
          scale: "showall",
          wmode: "transparent",
          allowscriptaccess: "always",
          loop: "false"
        },
        attributes: {
          id: this.tmpId,
          name: this.tmpId
        }
      };
      var self = this;
      if (movie.userid) {
        movie.flash_url = movie.flash_url.replace(/\{uid\}/g, movie.userid);
      }
      swfobject.embedSWF(movie.flash_url, self.tmpId, movie.width, movie.height, "10.0.0", "", aniVars.flashvars, aniVars.params, aniVars.attributes);
      this.$tmp.css({
        position: 'absolute',
        width: movie.width,
        height: movie.height,
        overflow: 'hidden',
        top: '50%',
        left: '50%',
        marginTop: -(movie.height / 2 - 100),
        marginLeft: -(movie.width / 2 - 300),
        zIndex: 1
      });
      setTimeout(function() {
        self.hide();
        if (callback) {
          callback();
        }
      }, (movie.ts || 5) * 1000);
    },
    hide: function() {
      this.$tmp.remove();
      this.$tmp = null;
    }
  });
  return View;
});