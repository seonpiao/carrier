define(["libs/client/views/base", "libs/client/swf/swfobject", "libs/client/swf/swffit", "libs/client/tinycarousel/jquery.tinycarousel"], function(Base, SWFOBJECT, SWFFIT, tinycarousel) {
  var View = Base.extend({
    moduleName: "squaremap",
    init: function() {
      var self = this;
      window.showUserInfo = function(uid) {
        location.href = '/room/' + uid;
      };
      this.module('flash', function(module) {
        if (module) {
          self.show();
          module.on('flashready.map', function() {
            self._flashReady = true;
          });
        }
      });
    },
    show: function(tl) {
      //girlinfo.fetch();
      var self = this;
      if (self.aniVars.currentLevel == tl) return;
      self.aniVars.flashvars.tarLevel = tl;
      self.aniVars.targetLevel = tl;
      $('#goddessRoom .ladyroom_flash').fadeOut('fast', function() {
        $(this).append("<div id='map_flash'></div>").show();
        swfobject.embedSWF(resUrl + "flash/main.swf?" + (new Date()).getTime(), "map_flash", "250", "325", "10.0.0", "", self.aniVars.flashvars, self.aniVars.params, self.aniVars.attributes);
        self.aniVars.currentLevel = tl;
        self.aniVars.flashvars.curLevel = tl;
        $.ajax({
          url: window.apiUrl + 'flashMap/getMapData',
          dataType: 'jsonp',
          jsonp: 'jsonpCallback',
          cache: false,
          success: function(data) {
            var map = $('#map_flash')[0];
            //console.log(map)
            self.module('flash', function(module) {
              if (module) {
                if (self._flashReady) {
                  try {
                    map.sendRoomListData(data);
                  } catch (e) {}
                  self.loop();
                }
                module.on('flashready.map', function() {
                  try {
                    map.sendRoomListData(data);
                  } catch (e) {}
                  self.loop();
                });
                window.showRoomInfo = function(roomid, cameraid) {
                  var girlRstr = "";
                  girlRstr == " ";
                  $(".goddess_show_listcon #goddessListS").html('');
                  $.each(data, function(i, v) {
                    var dataroomid = v.roomID;
                    if (dataroomid == roomid) {
                      var girlList = _.map(v.userList, function(item) {
                        return item.id;
                      });
                      if (girlList.length > 0) {
                        if (girlList.length > 5) {
                          //console.log('sfsfsfs');
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
                                girlRstr += '<li class="goddess_imgbg_1" id="' + girlid + '">' + '<a href="/room/' + girlid + '"><img class="girlstyle mt_25" src="' + window.resUrl + 'girl/' + girlid + '/78x134"/></a>' + '<div class="goddess_name" ><img src="' + window.resUrl + 'orig/images/girlName_' + girlid + '.png"/></div>' + '<a href="/room/' + girlid + '" class="goddess_hover_box  girlINfo" style="display:none;">' + '<p class="purple">' + girlV[girlid].popularleveltitle + '</p>' + '<p class="white">人气值：<span class="yellow_starbg">' + girlV[girlid].popularlevel + '</span></p>' + '<p class="cl"><span class="w78 btn_4y">进入她的房间</span></p>' + '</a>' + '</li>'
                              }
                              $("#PlayerShowItem .viewport").html('<ul class="cl overview" id="goddessListS">' + girlRstr + '</ul>');
                              $('#goddessListS li').mouseenter(function() {
                                $(this).children(".girlINfo").show();
                              }).mouseleave(function() {
                                $(this).children(".girlINfo").hide();
                              })
                              var carousel;
                              $('#PlayerShowItem').tinycarousel({
                                step: 5,
                                infinite: false
                              });
                              carousel = $('#PlayerShowItem').data('plugin_tinycarousel');
                              setTimeout(function() {
                                carousel.update();
                                carousel.move(0);
                              })
                            }
                          }
                        })
                      } else {
                        $(".goddess_show_listcon").html('<div class="bathroom_word tc f14"></div>');
                        $('.gift_leftbtn,.gift_rightbtn').remove();
                      }
                    }
                  })
                };
                var max = 0,
                  dataroomid;
                _.each(data, function(v, k) {
                  var dataidnum = v.userList.length;
                  if (dataidnum > max) {
                    max = dataidnum;
                    dataroomid = v.roomID;
                  }
                });
                showRoomInfo(dataroomid);
              }
            });
          }
        });
      })
    },
    loop: function() {
      var self = this;
      clearTimeout(this._loopTimer);
      this._loopTimer = setTimeout(function _loop() {
        $.ajax({
          url: window.apiUrl + 'flashMap/getMapData',
          dataType: 'jsonp',
          jsonp: 'jsonpCallback',
          success: function(data) {
            var map = $('#map_flash')[0];
            try {
              map.sendRoomListData(data);
            } catch (e) {}
            self._loopTimer = setTimeout(_loop, 60000);
          }
        });
      }, 60000);
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
        callback: 'view_room'
      },
      currentLevel: 1,
      targetLevel: 1
    }

  });
  return View;
});