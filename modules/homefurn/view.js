define(["libs/client/views/base", "models/homefurn", "modules/homefurn/homefurnItemView"], function(Base, homefurn, HomefurnItemView) {
  var View = Base.extend({
    moduleName: "homefurn",
    progressTemplate: 'progress',
    events: {
      'click [data-homef-tab]': 'switchHomefTab',
      'click .raise_homefurn': 'raiseHomefurn'
    },
    init: function() {
      this.listenTo(homefurn, 'sync', this.render.bind(this));
      homefurn.fetch();
      this.collection = homefurn;
    },
    render: function() {
      var self = this;
      this.loadTemplate('index', function(template) {
        var data = homefurn.toJSON();
        console.log(data);
        self.$el.html(template({
          result: data,
          now: homefurn.now
        }));
        self.renderStyle();
      });
    },
    switchHomefTab: function(e) {
      var $target = $(e.target);
      var $tabs = this.$('[data-homef-tab]');
      $tabs.removeClass('on');
      $target.addClass('on');
      this.renderStyle();
    },
    initCarousel: function() {
      var self = this;
      var $carousel = this.$('.homef_tab_body');
      this.$carousel = $carousel;
      var carousel = $carousel.tinycarousel({
        step: 5,
        infinite: false,
        children: '.homef_show_list li'
      });
      this.carousel = carousel.data('plugin_tinycarousel');
      this.carousel.update();
      this.carousel.move(0);
      $carousel.on('move', function(e, curr, index) {
        self.updateProgress(self.$('.game_listbox_homefurn .progress_bar_panel'), new Backbone.Collection(self.collection.slice(index, index + 5)));
      });
    },
    synced: function() {
      this.initCarousel();
      this.updateProgress();
    },
    renderStyle: function() {
      var $title = this.$('.on[data-homef-tab]');
      var templateName = $title.attr('data-template');
      var self = this;
      this.loadTemplate(templateName, function(template) {
        self.$('.homef_con_right').html(template({}));
        homefurn.remove(homefurn.models);
        self.stopListening(homefurn);
        self.renderItems();
        // var $carousel = self.$('.homef_tab_body');
        // var carousel = $carousel.tinycarousel({
        //   step: 5,
        //   infinite: false,
        //   children: '.homef_show_list li'
        // });
        // carousel = carousel.data('plugin_tinycarousel');
        // carousel.move(0);
        // $carousel.on('move', function(e, curr, index) {
        //   self.updateProgress(self.$('.game_listbox_homefurn .progress_bar_panel'), 'homefurnProgressBar', new Backbone.Collection(girlItemList.slice(index, index + 5)));
        // });
        // girlItemList.forEach(function(model) {
        //   self.renderGirlItem(model, girlItemList, carousel);
        // });
        // self.updateProgress(self.$('.game_listbox_homefurn .progress_bar_panel'), 'homefurnProgressBar', new Backbone.Collection(girlItemList.slice(0, 5)));
      });
    },
    getProgress: function(item) {
      if (item.curfunds && item.targetfunds) {
        var curfunds = item.curfunds.replace(/,/g, '') * 1;
        var targetfunds = item.targetfunds.replace(/,/g, '') * 1;
        return Math.min(parseFloat(curfunds / targetfunds), 1);
      } else {
        return 0;
      }
    },
    updateProgress: function($el, list) {
      var self = this;
      this.loadTemplate(this.progressTemplate, function(template) {
        var progresses = [];
        var itemList = (list || self.collection).toJSON();
        console.log(itemList)
        if (itemList.slice(-1)[0].status != '0') {
          self.$carousel.find('.next').removeClass('lock_img');
        } else {
          self.$carousel.find('.next').addClass('lock_img');
        }
        itemList.forEach(function(item, index) {
          progresses.push(self.getProgress(item));
        });
        self.$('.progress_bar_panel').html(template({
          progresses: progresses
        }));
      });
    },
    renderItems: function() {
      this.listenTo(homefurn, 'add', this.renderItem.bind(this));
      this.listenTo(homefurn, 'sync', this.synced.bind(this));
      var params = {
        data: {}
      };
      var $title = this.$('.on[data-homef-tab]');
      params.data['class'] = $title.attr('data-homef-tab');
      this.$('.homef_show_list').html('');
      homefurn.fetch(params);
    },
    renderItem: function(model) {
      var self = this;
      this.module('raise', 'homefurn', function(module) {
        if (module) {
          var view = new HomefurnItemView({
            model: model,
            collection: self.collection,
            raise: module,
            homefurnView: self,
            el: $('<li data-itemid="' + model.get('id') + '" data-baidu data-baidu-category="homefurn" data-baidu-action="click_item" data-baidu-label="' + model.get('id') + '"/>')
          });
          view.on('afterrender', function() {
            if (self.carousel) {
              setTimeout(self.carousel.update.bind(self.carousel));
            }
          });
          self.$('.homef_show_list').append(view.render().$el);
        }
      });
    },
    switchHomefurnTab: function(e) {
      var $target = $(e.target);
      var $tabs = this.$('[data-homefurn-tab]');
      $tabs.removeClass('on');
      $target.addClass('on');
      var params = {
        data: {}
      };
      params.data['class'] = $target.attr('data-homefurn-tab');
      homefurn.fetch(params, {
        reset: true
      });
      this.$('.gift_show_list').html('');
    },
    raiseHomefurn: function(e) {
      var self = this;
      this.module('sign', function(module) {
        if (module) {
          module.showSignModel('login', function() {
            var nowItem = homefurn.findWhere({
              status: '3'
            });
            if (!nowItem) {
              nowItem = homefurn.at(0);
            }
            if (nowItem) {
              var itemid = nowItem.get('id');
              var $item = self.$('li[data-itemid="' + itemid + '"]');
              var view = $item.data('view');
              view.openRaise();
            } else {
              self.module('errmsg', function(module) {
                if (module) {
                  module.show('集资还没有开始呢');
                }
              });
            }
          });
        }
      });
    }
  });
  return View;
});