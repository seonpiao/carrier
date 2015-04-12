define(["libs/client/views/base"], function(Base) {
  var View = Base.extend({
    moduleName: "shop",
    events: {
      'click .game_list_tab>li': 'switchTitleTab'
    },
    errmsgs: {
      2008034: '当前道具已集资完成'
    },
    init: function() {},
    switchTitleTab: function(e) {
      e.preventDefault();
      var target = $(e.currentTarget);
      var type = target.attr('data-type');
      this.switchToTabByType(type);
    },
    switchToTabByType: function(type) {
      var map = {
        game: 'xxx',
        clothes: '1',
        food: '2',
        gift: '3',
        homefurn: '8'
      };
      var typeValue = map[type];
      var $title = $('.on[data-homef-tab]');
      var toType = $('li[data-type=' + type + ']');
      var tabList = $('.game_list_tab>li');
      $('.game_listbox>div').addClass('hide');
      var $box = $('.game_listbox_' + type);
      $box.removeClass('hide');
      tabList.removeClass('on').removeClass('inline');

      if (type === 'game') {
        toType.addClass('on');
      } else {
        toType.addClass('inline');
      }

      if (type === 'game') {
        this.$('.game_listbox').html('<div data-module="game" class="game">');
      } else if (typeValue == '1') {
        this.$('.game_listbox').html('<div data-module="clothes" class="clothes">');
      } else if (typeValue == '8') {
        this.$('.game_listbox').html('<div data-module="homefurn" class="homefurn">');
      } else if (typeValue === '3') {
        this.$('.game_listbox').html('<div data-module="gift" class="gift">');
      } else {
        this.$('.game_listbox').html('<div data-module="food" class="food">');
      }

    }
  });
  return View;
});