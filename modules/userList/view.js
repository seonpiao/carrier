define(["libs/client/views/base", "models/userList"], function(Base, userList) {
    var View = Base.extend({
        moduleName: "userList",
        template: 'index',
        events: {
            'click #audienceList .uname': 'showSingle2',
            'mouseleave #chat': 'hideSingle2',
            'click #': 'showSingle'
        },
        init: function() {
            userList.fetch({
                data: {
                    room: girlid
                }
            });
            this.listenTo(userList, 'change', this.render.bind(this));
        },
        render: function() {
            var self = this;
            this.loadTemplate('index', function(template) {
                var data = userList.toJSON();
                self.$('ul.overview').html(template(data));
                globalUtil.resetScrollbar('userListScrollbar', 214, '');
            });
        },
        userListO: [],
        showSingle2: function(e) {
            e.preventDefault();
            var self = this;
            var tdiv = $(e.target);
            var pdiv = tdiv.parent();
            var tid = pdiv.attr('data-itemid');
            var data = null;
            var ulist = userList.toJSON()
            if (self.userListO.length == 0 || self.userListO.length == null) {
                //console.log(self.userListO.length)
                $.each(ulist.result.userlist, function(i, o) {
                    self.userListO[o.ssoid] = o;
                });
            }
            data = self.userListO[tid];
            self.hideSingle2();
            if (data) {
                //data = $.parseJSON(data);
                //data=JSON.parse(data);
                if (globalUtil.userInfo && globalUtil.userInfo.ssoid && data.uid != globalUtil.userInfo.ssoid) {
                    var icons = pdiv.find('.chat_icons');
                    var pos = tdiv.offset();
                    var top = pos.top + 20,
                        left = pos.left + 20;
                    var skin = 'sayToNormal'
                    if (data.angel == 1) {
                        skin = 'sayToSilver'
                    }
                    if (data.angel == 2) {
                        skin = 'sayToGolden'
                    }
                    var saystr = '<div class="saySingle ' + skin + '" style="top:' + top + 'px; left:' + left + 'px">' + '<span class="sayPhoto"><img src="' + resUrl + 'head/' + data.ssoid + '/40" /></span>' + '<span class="sayInfo"><span class="uname">' + data.usrnick + '</span>' + icons.html() + '</span></div>'
                    $('#chat').append(saystr);
                    $('<a>', {
                        href: 'javascript:;',
                        'class': 'btn_chat',
                        'text': '与Ta私聊',
                        click: function() {
                            self.module('chat', function(chat) {
                                if (chat) {
                                    chat.sayTo(data.usrnick);
                                }
                            });
                        }
                    }).appendTo($('#chat .saySingle'));
                } else {
                    self.module('sign', function(sign) {
                        if (sign) {
                            sign.showSignModel('login', function() {
                                self.module('chat', function(chat) {
                                    if (chat) {
                                        chat.sayTo(globalUtil.userInfo.usrnick);
                                    }
                                });
                            });
                        }
                    });
                }

            }
        },
        hideSingle2: function() {
            $('.saySingle').remove();
        }
    });
    return View;
});