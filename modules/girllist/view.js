define(["libs/client/views/base", ], function(Base) {
  var View = Base.extend({
    moduleName: "girllist",
    init: function() {
      this.render();
    },
    render: function() {
      $.ajax({
        url: window.apiUrl + 'flashMap/getMapData',
        dataType: 'jsonp',
        jsonp: 'jsonpCallback',
        cache: false,
        success: function(data) {
          var girlRstr = "";
          $(".goddess_show_listcon #goddessListS").html('');
          var girlList = [];
          $.each(data, function(i, v) {
            girlList = girlList.concat(_.map(v.userList, function(item) {
              return item.id;
            }));
          })
          if (girlList.length > 0) {
            if (girlList.length > 5) {
              $('.gift_leftbtn,.gift_rightbtn').show();
            }
            $.ajax({
              url: window.apiUrl + 'girlstatus/getgirlstatusbyids',
              data: {
                girlid: girlList
              },
              dataType: 'jsonp',
              cache: false,
              jsonp: 'jsonpCallback',
              success: function(data) {
                if (data.success === 200) {
                  girlV = data.result;
                  for (var girlid in girlV) {
                    girlRstr += '<li class="goddess_imgbg_1" id="' + girlid + '">' + '<a href="/room/' + girlid + '"><img class="girlstyle mt_25" src="' + window.resUrl + 'girl/' + girlid + '/78x134"/></a>' + '<div class="goddess_name" ><img src="' + window.resUrl + 'orig/images/girlName_' + girlid + '.png"/></div>' + '<a href="/room/' + girlid + '" class="goddess_hover_box  girlINfo" style="display:none;">' + '<p class="purple">' + girlV[girlid].popularleveltitle + '</p>' + '<p class="white">人气值：<span class="yellow_starbg">' + girlV[girlid].popularlevel + '</span></p>' + '<p class="cl"><span class="w78 btn_4y">进入她的房间</span></p>' + '</a>' + '<div class="out_dialog ' + (girlV[girlid].is_out == 1 ? 'show' : 'hide') + '"></div>' + '</li>'
                  }
                  $("#PlayerShowItem .viewport").html('<ul class="cl overview" id="goddessListS">' + girlRstr + '</ul>');
                  //随机显示
                  var girlarr = $('#PlayerShowItem #goddessListS li').toArray();
                  var len = girlarr.length;
                  var rand = parseInt(Math.random() * (len));
                  $('#PlayerShowItem #goddessListS li').each(function(i) {
                    $('#PlayerShowItem #goddessListS').append($('#PlayerShowItem #goddessListS li').eq(rand));
                    rand = parseInt(Math.random() * (len));
                  });
                  // hover 女神显示详细信息
                  $('#goddessListS li').mouseenter(function() {
                      $(this).children(".girlINfo").show();
                    }).mouseleave(function() {
                      $(this).children(".girlINfo").hide();
                    })
                    // 滚动条显示
                  var carousel;
                  $('#PlayerShowItem').tinycarousel({
                    step: 5,
                    infinite: true
                  });
                  carousel = $('#PlayerShowItem').data('plugin_tinycarousel');
                  setTimeout(function() {
                    carousel.update();
                    carousel.move(0);
                  })
                }
              }
            })
          }
        }
      });
    }
  });
  return View;
});