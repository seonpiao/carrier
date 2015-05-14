define(["libs/client/views/base", "libs/client/scrollbar/jquery.tinyscrollbar", "models/popRank"], function(Base, SCROLLBAR, popRank) {
  var View = Base.extend({
    moduleName: "popularrank",
    init: function() {
      var self = this;
      self.render();
    },
    render: function() {
      var self = this;
      this.loadTemplate('index', function(template) {
        var item = template({});
        //console.log(item)
        self.$body.find('.popularrank').append(item);
      });
      var allPopRank = new popRank;
      this.listenTo(allPopRank, 'sync', this.renderAllPopRank.bind(this));
      allPopRank.fetch({
        data: {
          girlid: window.girlid,
          top: 10,
          type: 1
        }
      });
      var daliyPopRank = new popRank;
      this.listenTo(daliyPopRank, 'sync', this.renderDaliyPopRank.bind(this));
      daliyPopRank.fetch({
        data: {
          girlid: window.girlid,
          top: 3,
          type: 2
        }
      });
    },
    renderAllPopRank: function(data) {
      var ranks = data.attributes.result.ranks;
      if (ranks) {
        var html = '';
        for (var i = 0, l = ranks.length; i < l; i++) {
          if (i == l-1) {
            html += '<span>' + ranks[i].username + '</span>';
          } else {
            html += '<span>' + ranks[i].username + '，</span>';
          }
        }
        $('.totalpopul_list').html(html);
        $('#popular-scrollbar').tinyscrollbar({});
      } else {
        $('.totalpopul_list').html('暂时还没有人气贡献哦！');
      }
    },
    renderDaliyPopRank: function(data) {
      var ranks;
      if (data.attributes.result) {
        ranks = data.attributes.result.ranks;
      }
      if (ranks) {
        var html = '';
        for (var i = 0, l = ranks.length; i < l; i++) {
          if (i == l-1) {
            html += '<span class="crown_' + (i + 1) + '">' + ranks[i].username + '</span>';
          } else {
            html += '<span class="crown_' + (i + 1) + '">' + ranks[i].username + '，</span>';
          }
        }
        $('.todypopul_list').html(html);
      } else {
        $('.todypopul_list').html('暂时还没有人气贡献哦！');
      }
    }
  });
  return View;
});
