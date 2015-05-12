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
      'click .buy_gift': 'buyGift'
    },
    errmsgs: {
      '2008011': '账户余额不足'
    },
    bufs: {

    },
    init: function(options) {
      options = options || {};
      this.listenTo(this.model, 'change', this.render.bind(this));
    },
    showDetail: function() {
      var self = this;
      var offset = this.$el.offset();
      this.module('itemdetail', 'gift', function(itemdetail) {
        if (itemdetail) {
          var random = Date.now() % 2;
          if (random === 1) {
            itemdetail.setTemplate('gift');
          } else {
            itemdetail.setTemplate('index');
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
            var $target = $(e.target);
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