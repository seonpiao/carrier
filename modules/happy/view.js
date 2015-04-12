define(["libs/client/views/base", "models/girl", "models/girlHappiness", "libs/client/swf/swfobject", "libs/client/swf/swffit"], function(Base, girl, girlHappiness, SWFOBJECT, SWFFIT) {
  var View = Base.extend({
    moduleName: "happy",
    template: 'index',
    events: {
      'click .happyDetail .yBtn': 'callShop'
        //'click .happyNow' : 'showHappyDetail'
    },
    init: function() {
      var self = this;
      //girl.fetch({});
      this.listenTo(girlHappiness, 'change', this.render.bind(this));
      // girlHappiness.fetch();
      // if (girl.has('happiness')) {
      //   self.showHappy();
      // } else {
      //   self.listenTo(girl, 'change', self.showHappy.bind(this));
      // }
      setTimeout(function() {
        // self.testAnimate();
      }, 0);
      setInterval(function() {
        // self.testAnimate();
        //$('.happyNow').addClass('happyNow_'+res.happiness).attr('happy',res.happiness);
      }, 30000);

    },
    callShop: function(e) {
      var type = e.currentTarget.getAttribute('data-type');
      this.closeD();
      this.module('shop', function(module) {
        module.switchToTabByType(type);
      });
    },
    closeD: function() {
      this.d.close();
    },
    showHappy: function() {
      var res = girlHappiness.get('result');
      girlHappiness.fetch();
      // if (res) {
      //   this.render();
      // } else {
      //   this.listenTo(girlHappiness, 'change', this.render.bind(this));
      // }
    },
    render: function() {
      var self = this;
      var su = {
        '1': '早餐',
        '2': '午餐',
        '3': '晚餐'
      };
      var gi = this.gi;
      //if(girl){
      var res = girlHappiness.get('result');
      this.loadTemplate('index', function(template) {
        var happyStr = template(res);
        if (self.d) {
          self.d.content(happyStr);
          self.d._$('title').html('<span></span>');
        }
        var hs = $('.happyPop span.happyText').html(self.hs[gi.happiness]);
        $('.happyPop .iconHappyBLight').addClass(gi.happiness == '5' ? 'iconHappyBLightHover' : '');
        $('.happyPop .iconHappyB').addClass('iconHappyB' + gi.happiness);
        $('.happyPop .happyText').html(self.hs[gi.happiness]);
        $('.happyPop .pinkText').text(gi.name);
        //$('.happyPop .ui-dialog-close').text('');

        var tcloth = $('#timer_cloth').attr('seconds');
        if (typeof(tcloth) != 'undefined' && tcloth != null && tcloth != '00:00:00') {
          globalUtil.makeTimer($('#timer_cloth'), function() {
            var cloth = $('#timer_cloth').parent().html();
            if (cloth) {
              var clothstr = cloth.replace('会换上', '已换上');
              $('#timer_cloth').parent().html(clothstr);
            }
          });
        }
        var tfood = $('#timer_food').attr('seconds');
        if (typeof(tfood) != 'undefined' && tfood != null && tfood != '00:00:00') {
          globalUtil.makeTimer($('#timer_food'), function() {
            var food = $('#timer_food').parent().html();
            if (food) {
              var foodstr = food.replace('午餐将吃到', '午餐已吃到')
              $('#timer_food').parent().html(foodstr);
            }
          });
        }
      });
      return this;
      //}
    },
    converTimer: function(timer) {
      var s = typeof(timer) == 'undefined' || timer == null ? '00:00:00' : timer
      return s;
    },
    ha: {
      '1': '不幸福',
      '2': '还不错',
      '3': '开心了',
      '4': '小幸福',
      '5': '超幸福'
    },
    hs: {
      '1': '人家现在很不开心哎，你要不请我吃大餐的话我就不理你了哦。',
      '2': '心情一般啦，帮人家装饰下屋子让我高兴下吧。',
      '3': '还算开心啦，送人家一件漂亮的衣服让人家小幸福一下嘛！',
      '4': '好高兴哦，今天你还会请人家吃好吃的吗？ ',
      '5': '谢谢你哦，人家现在超开心的说，么么哒~ '
    },
    show: function(gi) {
      var self = this;
      self.d = dialog({
        id: 'happyGirl',
        title: '幸福度',
        content: '    ',
        quickClose: false,
        skin: 'happyPop',
        width: 690,
        height: 322,
        onclose: function() {
          self.closeD();
        }
      });
      // self.d.addEventListener('close', self.remove.bind(this));
      self.setElement(this.d.__popup);
      self.showHappy();
      // $('.happyPop .ui-dialog-title').html('<span class="">幸福度</span>');
      this.d.show();
      this.gi = gi;
      return this;
    },
    aniVars: {
      params: {
        quality: "high",
        scale: "noscale",
        wmode: "transparent",
        allowscriptaccess: "always"
      },
      attributes: {
        id: "map_flash",
        name: "map_flash"
      },
      flashvars: {
        curLevel: 1,
        tarLevel: 1,
        callback: 'destroy_flash'
      },
      currentLevel: 1,
      targetLevel: 1
    },

    animate: function(cl, tl) {
      var self = this;
      var res = girl.toJSON();
      if (self.aniVars.currentLevel == tl) return;
      self.aniVars.flashvars.tarLevel = tl;
      self.aniVars.targetLevel = tl;
      $("#emotionsDetail .happyNow").fadeOut('fast', function() {
        // $('#emotionsDetail .happyNow').removeClass('happyNow_' + cl).addClass('happyNow_' + tl).attr('happy', tl);
        $("#emotionsDetail .happy_flash").html("<div id='face_flash'></div>").show();
        swfobject.embedSWF(window.resUrl + "flash/face.swf", "face_flash", "74", "74", "10.0.0", "", self.aniVars.flashvars, self.aniVars.params, self.aniVars.attributes);
        self.aniVars.currentLevel = tl;
        self.aniVars.flashvars.curLevel = tl;
      });

    },
    testAnimate: function() {
      var cl0 = parseInt($("#emotionsDetail .happyNow").attr('happy')),
        cl = (cl0 == null || cl0 == NaN || typeof(cl0) != 'undefined' ? cl0 : 1);
      var tl = parseInt(5 * Math.random()) + 1;
      this.animate(this.aniVars.currentLevel, tl);
    }
  });
  return View;
});

function destroy_flash() {
  $("#emotionsDetail .happy_flash").empty().hide();
  $(".happyNow").fadeIn();
}