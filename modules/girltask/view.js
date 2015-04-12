define(["libs/client/views/base", 'models/girlTask'], function(Base, girlTask) {
    var View = Base.extend({
        moduleName: "girltask",
        events: {
            'click .goddess_single #go_wish': 'GoWishItem'
        },
        typeTit: [{
            '1': '课程：'
        }, {
            '2': '小运动：'
        }, {
            '5': '用餐'
        }, {
            '6': '许愿瓶开启'
        }],
        //type=1 课程 //课程公用９号模板
        //type=2 小运动 //9号
        //type=3、4 //３和４逻辑一样 1号
        //type=5 用餐 //5号
        //type=6 许愿瓶开启 //6号
        //type=7、8、9 //9号
        init: function() {
            var self = this;
            this.listenTo(girlTask, 'change', self.loadGirlTaskData.bind(this));
        },
        //直播页女神任务
        loadGirlTaskData: function() {
            var self = this,
                data = girlTask.toJSON();
            self.displayGirlTask(data.result);
        },
        displayGirlTask: function(data) {
            var self = this;
            this.loadTemplate('index', function(template) {
                $('#girltaskBar .overview').html('');
                $.each(data, function(j, result) {
                    //console.log(result)
                    $('#girltaskBar .overview').append(template(result));
                    globalUtil.resetScrollbar('girltaskBar', 144, '');
                });
            });
        },
        GoWishItem: function(e) {
            e.preventDefault();
            this.module('bottle', function(bottle) {
                if (bottle) {
                    bottle.show();
                }
            });
        }
    });
    return View;
});