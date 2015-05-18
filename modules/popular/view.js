define(["libs/client/views/base", "models/PopularTop", "models/daliyPopularTop", "models/dreamMoneyTop"], function(Base, popularTop, daliyPopularTop, dreamMoneyTop) {
  var View = Base.extend({
    moduleName: "popular",
    init: function() {
      var self = this;
      self.listenTo(popularTop, 'sync', self.renderPopularTop.bind(self));
      self.listenTo(daliyPopularTop, 'sync', self.renderDaliyPopularTop.bind(self));
      self.listenTo(dreamMoneyTop, 'sync', self.renderDreammoneyTop.bind(self));
      self.initTap();
      popularTop.fetch({
        data: {
          top: 10
        }
      });
    },
    initTap: function() {
      var title = $('.ranking_type_list li');
      title.click(function(e) {
        var cur = e.currentTarget;
        title.removeClass('on');
        $(cur).addClass('on');
        if (cur.getAttribute('data-type') == 'popularTop') {
          popularTop.fetch({
            data: {
              top: 10
            }
          });
        } else if (cur.getAttribute('data-type') == 'TodaypopularTop') {
          daliyPopularTop.fetch({
            data: {
              type: 2,
              top: 10
            }
          });
        } else {
          dreamMoneyTop.fetch({
            data: {
              top: 10
            }
          });
        }
      });
    },
    renderPopularTop: function() {
      this.loadTemplate('index', function(template) {
        var data = popularTop.toJSON();
        var html = template(data);
        $('.ranking_pk_main').html(html);
        this.$scrollbar = $('.popular-scroll');
        this.$scrollbar.tinyscrollbar({
          trackSize: 208
        });
      });
    },
    renderDaliyPopularTop: function() {
      this.loadTemplate('index', function(template) {
        var data = daliyPopularTop.toJSON();
        var html = template(data);
        $('.ranking_pk_main').html(html);
        this.$scrollbar = $('.popular-scroll');
        this.$scrollbar.tinyscrollbar({
          trackSize: 208
        });
      });
    },
    renderDreammoneyTop: function() {
      this.loadTemplate('dreamMoneyTop', function(template) {
        var data = dreamMoneyTop.toJSON();
        var html = template(data);
        $('.ranking_pk_main').html(html);
        this.$scrollbar = $('.popular-scroll');
        this.$scrollbar.tinyscrollbar({
          trackSize: 208
        });

      });
    }
  });
  return View;
});