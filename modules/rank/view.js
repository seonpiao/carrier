define(["libs/client/views/base", "models/popRank"], function(Base, popRank) {
  var View = Base.extend({
    moduleName: "rank",
    events: {
      'click .goddess_ranking_list li': 'changeType'
    },
    init: function() {
      this.listenTo(popRank, 'sync', this.switchRank.bind(this));
    },
    show: function() {
      if (this.d) {
        this.hide();
      }
      var self = this;
      this.loadTemplate('index', function(template) {
        self.d = dialog({
          title: ' ',
          content: template({}),
          skin: 'dialogGames',

        });
        self.setElement(self.d._popup);
        self.d.show();
        popRank.fetch({
          data: {
            type: 1
          }
        });
      });
    },
    hide: function() {
      if (this.d) {
        this.d.close().remove();
        this.d = null;
      }
    },
    switchRank: function(model) {
      var self = this;
      this.loadTemplate('rank', function(template) {
        var data = model.toJSON(); 
        if(data.result != null){
          var html = template(data);
          self.$('.popularity_1').html(html);
          self.$scrollbar = $('#ladyrankListBar');
          self.$scrollbar.tinyscrollbar({
            trackSize: 340
          });
        }
      });
    },
    changeType: function(e) {
      this.$('.goddess_ranking_list li').removeClass('on');
      var $target = $(e.currentTarget);
      $target.addClass('on');
      var type = $target.attr('data-type');
      popRank.fetch({
        data: {
          type: type
        }
      });
    }
  });
  return View;
});