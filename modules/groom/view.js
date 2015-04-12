define(["libs/client/views/base"], function(Base) {
    var View = Base.extend({
        moduleName: "groom",
        events: {
            'click  .goddess_house': 'houseTab'
        },
        init: function() {

        },
        houseTab: function(e) {
            e.preventDefault();
            var self = this,
                oDiv = $(e.target),
                chatDiv = $('.notice.pr'),
                taskDiv = $('.mytask.pr'),
                houseDiv = $('.goddess_room.pr');
            if (houseDiv.css('display') == 'none') {
                chatDiv.hide();
                taskDiv.hide();
                houseDiv.show();
            } else {
                chatDiv.show();
                taskDiv.show();
                houseDiv.hide();
            }
        },
        render: function() {

        }
    });
    return View;
});