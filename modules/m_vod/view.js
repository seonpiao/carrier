define(["libs/client/views/base"], function(Base) {
  //专题分页
  $.fn.sweetPages = function(opts){
    if(!opts) opts = {};
    var resultsPerPage = opts.perPage || 10;
    var ul = this;
    var li = ul.find('li');
    var pagesNumber = Math.ceil(li.length/resultsPerPage);
    if(pagesNumber<2) return this;
    var swControls = $('<div class="page_list cl">');
    var nstr = '';
    for(var i=0;i<pagesNumber;i++){
      li.slice(i*resultsPerPage,(i+1)*resultsPerPage).wrapAll('<div class="swPage cl" />');
      nstr += '<a class="swShowPage" href="javascript:void(0);" >'+(i+1)+'</a>';
    }
    swControls.append(nstr);
    ul.append(swControls);
    var totalWidth = 0;
    var swPage = ul.find('.swPage');
    swPage.each(function(){
      var elem = $(this);
      totalWidth+=elem.outerWidth();
      elem.css('float','left').width(ul.width());
    });
    swPage.wrapAll('<div class="swSlider cl" />');
    var swSlider = ul.find('.swSlider');
    swSlider.append('<div class="clear" />').width(totalWidth);
    var hyperLinks = ul.find('a.swShowPage');
    hyperLinks.click(function(e){
      e.preventDefault();
      $(this).addClass('active').siblings().removeClass('active');
      var nowswPageL = (parseInt($(this).text())-1)*ul.width();
      swSlider.animate({
        'margin-left':-nowswPageL
      },'slow');      
    });
    hyperLinks.eq(0).addClass('active');
    swControls.css({
      'left':'50%',
      'margin-left':-swControls.width()/2
    });
    return this;
  }
  var View = Base.extend({
    moduleName: "newsquare",
    init: function() {
      var self = this;
      self.videohrefW();
    },
    videohrefW: function() {
      //点击每个视频图片跳出视频窗口
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
      //鼠标经过每个视频图片出现可点击按钮
      $('#videohref li a').on('mouseenter', function() {
        var nowhref = $(this).attr('href');
        if (nowhref != '') {
          $(this).append('<i class="vd_hoverbg"></i>');
        }
      }).on('mouseleave', function() {
        $(this).children().siblings('i.vd_hoverbg').remove();
      })

      // 点击圆点分页效果
      //1.女神说
     // $('#holder').sweetPages({perPage:10});
     // var controls = $('#ladySays .page_list').detach();
     // controls.appendTo('#ladySays');

    }
  });
  return View;
});