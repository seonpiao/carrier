define(["libs/client/views/base", "models/buyItem"], function(Base, BuyItem) {
  var d;
  var View = Base.extend({
    moduleName: "gift",
    template: 'giftItem',
    events: {
      // 'mouseenter': 'showSingleList',
      // 'mouseleave': 'hideSingleList',
      'mouseenter': 'showDetail',
      'mouseleave': 'hideDetail',
      'click': 'buyGift'
    },
    errmsgs: {
      '2008011': '账户余额不足'
    },
    bufs: {

    },
    init: function(options) {
      options = options || {};
      // this.listenTo(this.model, 'change', this.render.bind(this));
    },
    destroy: function() {
      if (this._detail) {
        this._detail.destroy();
      }
    },
    showDetail: function() {
      var self = this;
      var offset = this.$el.offset();
      this.module('itemdetail', 'gift', function(itemdetail) {
        if (itemdetail) {
          self._detail = itemdetail;
          if (self.model.get('event') == '101') {
            itemdetail.setTemplate('gift2');
          } else {
            itemdetail.setTemplate('gift1');
          }
          itemdetail.setModel(self.model);
          itemdetail.show(self.$el);
        }
      });
    },
    hideDetail: function() {
      this.module('itemdetail', 'gift', function(itemdetail) {
        if (itemdetail) {
          itemdetail.hide();
        }
      });
    },
    // showSingleList: function() {
    //   var self = this;
    //   clearTimeout(this._hideChildTimer);
    //   if (!this.$child) {
    //     this.loadTemplate('giftdetailChild', function(template) {
    //       var html = template(self.model.toJSON());
    //       if (html) {
    //         self.$child = $(html);
    //         self.$child.find('.giftSigel').children('li').on('mouseenter', function() {
    //           $(this).siblings().removeClass('cur');
    //           //var sigleitem = $(this).children('div.play_gameitem').html();
    //           //$(this).parent().siblings('div.giftsigel_item').html(sigleitem);
    //           clearTimeout(self._hideChildTimer);
    //         });
    //         self.$child.on('mouseleave', function() {
    //           self.hideSingleList();
    //         });
    //         self.$child.find('.buy_gift').on('click', self.buyGift.bind(self));
    //         var itemPos = self.$el.offset();
    //         // self.$child.css({
    //         //   position: 'absolute',
    //         //   left: itemPos.left,
    //         //   top: itemPos.top - 90
    //         // });
    //         self.$child.css({
    //           position: 'absolute',
    //           left: itemPos.left + 80,
    //           top: itemPos.top - 196
    //         });

    //         self.$body.append(self.$child);
    //       }
    //     });
    //   }
    // },
    // hideSingleList: function() {
    //   var self = this;
    //   clearTimeout(this._hideChildTimer);
    //   if (this.$child) {
    //     this._hideChildTimer = setTimeout(function() {
    //       self.$child.remove();
    //       self.$child = null;
    //     }, 200);
    //   }
    // },
    buyGift: function(e) {
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            var $target = $(e.currentTarget).find('img');
            var num = $target.attr('data-num');
            var id = $target.attr('data-id');
            var pid = $target.attr('data-pid') || id;
            if (!self.bufs[id]) {
              self.bufs[id] = {
                count: 1
              };
              self.bufs[id].timer = setTimeout(function() {
                var buyItem = new BuyItem({
                  actionType: 'buy'
                });
                self.listenTo(buyItem, 'sync', self.success.bind(self));
                buyItem.set({
                  quality: self.model.get('quality'),
                  name: self.model.get('name'),
                  girlname: window.girlname
                });
                buyItem.fetch({
                  data: {
                    pid: pid,
                    itemid: id,
                    num: self.bufs[id].count,
                    girlid: window.girlid
                  }
                });
                delete self.bufs[id];
              }, 1000);
            } else {
              self.bufs[id].count++;
            }
          });
        }
      });
    },
    success: function(model) {
      var self = this;
      if (model.get('success') !== 200) {
        var errcode = model.get('error_code');
        if (errcode == '2008011') {
          var item = this.collection.findWhere({
            id: model.filter.pid
          });
          this.module('insufficient', function(module) {
            if (module) {
              module.show({
                id: model.filter.itemid,
                name: item.get('name'),
                bidtype: item.get('bidtype'),
                price: item.get('price') * model.filter.num,
                quality: item.get('quality')
              });
            }
          });
        } else {
          this.module('errmsg', function(module) {
            if (module) {
              module.show(self.errmsgs[errcode]);
            }
          });
        }
      } else {
        //暴击
        var crit = model.get('result').crit * 1;
        if (crit > 1) {
          model.set('itemid', model.filter.itemid);
          this.showCrit(model);
        } else {
          this.showSuccess(model);
        }
        //抽奖
        var getdrawD = model.get('result').lucky;
        var pageeventp = model.get('pageevent');
        if (getdrawD != null) {
          self.drawSuccess(getdrawD, pageeventp);
        } else {
          self.showSuccess(model);
        }

        //实物集资达成
        var raisesuc = model.get('result').raisesuc;
        if (raisesuc) {
          this.module('errmsg', function(errmsg) {
            if (errmsg) {
              if (self.model.get('event') == '101') {
                errmsg.show(self.model.get('name') + '已集齐，' + window.girlname + '可获得一个真实的' + self.model.get('name') + '，请不要离开屏幕，我们会尽快将您的礼物送到女神身边', {
                  time: 5000
                });
              } else {
                errmsg.show(self.model.get('name') + '已购买成功，' + window.girlname + '可获得一个真实的' + self.model.get('name') + '，请不要离开屏幕，我们会尽快将您的礼物送到女神身边', {
                  time: 5000
                });
              }
            }
          });
        }

        // this.model.set('curfunds', this.model.get('curfunds') * 1 + 1);
        this.model.fetch();
      }
    },
    showSuccess: function(model) {
      var $success = $('.buy_success_word');
      if (!$success.length) {
        $success = $('<div class="success_box buy_success_word hide"><div class="buy_lingtsshow"><span></span></div></div>');
        this.$body.append($success);
      }
      $success.removeClass('hide');
      setTimeout(function() {
        $success.addClass('hide');
      }, 3000);
    },
    drawSuccess: function(getdrawD, pageeventp) {
      var self = this;
      this.loadTemplate('getdrawsuccess', function(template) {
        d = dialog({
          id: 'getaward_Dt',
          skin: 'dialogBluebgGames getaward_dialog getawardp_dialog',
          title: ' ',
        });
        var html = template({
          items: getdrawD
        });
        d.content(html);
        $('#getdrawokbtn').on('click', self.getdrawDialog.bind(self));
        if (pageeventp) {
          $.each(pageeventp.event, function(i, prize) {
            if (prize === 'userPackNewItem') {
              globalUtil.pkgNew();
              globalUtil.lightpkgNew();
            }
          });
        }
        d.show();
      })
    },
    getdrawDialog: function() {
      if (d) {
        d.close().remove();
        d = null;
      }
    },
    showCrit: function(model) {
      this.module('crit', 'gift', function(crit) {
        if (crit) {
          crit.setModel(model);
          crit.show();
        }
      });
    }
  });
  return View;
});