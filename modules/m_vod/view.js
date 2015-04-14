define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "newsquare",
    init: function() {
      var self = this;
      self.newsquareshow();
    },
    newsquareshow: function() {
      var self = this;
      self.videohrefW();
      // $('#holder').ready(function() {
      //  self.sweetPages({
      //    perPage: 10
      //  });
      // })
      // var controls = $('.swControls').detach();
      // controls.appendTo('#holder');
    },
    sweetPages: function(opts) {
      // if (!opts) opts = {};
      // var resultsPerPage = opts.perPage || 10;
      // var conB = $('#holder');
      // var li = conB.find('li');
      // li.each(function() {
      //  var el = $(this);
      //  el.data('height', el.outerHeight(true));
      // });
      // var pagesNumber = Math.ceil(li.length / resultsPerPage);
      // var swControls = $('<div class="page_btn cl.swControls">');
      // for (var i = 0; i < pagesNumber; i++) {
      //  li.slice(i * resultsPerPage, (i + 1) * resultsPerPage).wrapAll('<div class="pagelist meiti_channelcon.fl" />');
      //  swControls.append('<span class="cur">' + (i + 1) + '</span>');
      // }
      // conB.append(swControls);
      // if (pagesNumber < 2) {
      //  return this;
      // }
      // var maxHeight = 0;
      // var totalWidth = 0;
      // var swPage = conB.find('.pagelist');
      // console.log(swPage)
      // swPage.each(function() {
      //  var elem = $(this);
      //  var tmpHeight = 0;
      //  elem.find('li').each(function() {
      //    tmpHeight += $(this).data('height');
      //  });
      //  if (tmpHeight > maxHeight) {
      //    maxHeight = tmpHeight;
      //  }

      //  totalWidth += elem.outerWidth();

      //  elem.css('float', 'left').width(conB.width());
      // });

      // swPage.wrapAll('<div class="swSlider" />');

      // conB.height(maxHeight);

      // var swSlider = conB.find('.swSlider');
      // swSlider.append('<div class="clear" />').width(totalWidth);

      // var hyperLinks = conB.find('span.cur');

      // hyperLinks.click(function(e) {
      //  $(this).addClass('cur').siblings().removeClass('cur');
      //  swSlider.stop().animate({
      //    'margin-left': -(parseInt($(this).text()) - 1) * conB.width()
      //  }, 'slow');
      //  e.preventDefault();
      // });

      // hyperLinks.eq(0).addClass('cur');
      // // swControls.css({
      // //   'left': '50%',
      // //   'margin-left': -swControls.width() / 2
      // // });
      //return this;
    },
    videohrefW: function() {
      $('#videohref li,.girl_pj_vbtn').children('a').on('click', function(e) {
        e.preventDefault();
        $('#video_dialog').remove();
        var nowhref = $(this).attr('href');
        var $playerBox = $('<div id="video_dialog"/>');
        $playerBox.html('<div style="background:rgba(0,0,0,.5);height:40px;"><a href="javascript:;" style="float:right;line-height:40px;padding-right:10px;color:white;">关闭</a></div><embed width="490" height="370" src="' + nowhref + '" />');
        $('body').append($playerBox);
        $playerBox.css({
          position: 'fixed',
          top: '50%',
          left: '50%',
          marginLeft: -245,
          marginTop: -185,
          zIndex: 99
        });
        $playerBox.find('a').on('click', function() {
          $playerBox.remove();
        });
      })

      $('#videohref li a').on('mouseenter', function() {
        var nowhref = $(this).attr('href');
        if (nowhref != '') {
          $(this).append('<i class="vd_hoverbg"></i>');
        }
      }).on('mouseleave', function() {
        $(this).children().siblings('i.vd_hoverbg').remove();
      })
    }
  });
  return View;
});