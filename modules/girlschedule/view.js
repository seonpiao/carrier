define(["libs/client/views/base", 'models/girlschedule'], function(Base, girlschedule) {
    var View = Base.extend({
        moduleName: "girlschedule",
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
            girlschedule.fetch();
            this.listenTo(girlschedule, 'change', self.loadsqGirlTaskData.bind(this));
        },
        //广场页女神任务
        loadsqGirlTaskData: function() {
            var self = this,
                data = girlschedule.toJSON();
            self.displaysqGirlTask(data.result);
        },
        displaysqGirlTask: function(data) {
            var self = this;
            this.loadTemplate('index', function(template) {
                $('#girltaskBar .overview').html('');
                $.each(data, function(j, result) {
                    //console.log(result);
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