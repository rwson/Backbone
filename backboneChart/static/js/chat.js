/**
 * backbone webChat前端模块
 */

WEB_SOCKET_SWF_LOCATION = "/static/WebSocketMain.swf";
WEB_SOCKET_DEBUG = true;

var socket = io.connect();
socket.on("connect", function () {
    console.log('connected');
});

$(window).bind("beforeunload", function () {
    socket.disconnect();
});

var appRouter,      //  路由控制
    g_user;         //  全局缓存用户

//  用户模型
var User = Backbone.Model.extend({
    "urlRoot": "/user"
});

//  话题模型
var Topic = Backbone.Model.extend({
    "urlRoot": "/topic"
});

//  消息模型
var Message = Backbone.Model.extend({
    "urlRoot": "/message",
    "sync": function (method, model, options) {
        if (method === "create") {
            socket.emit("message", model.attributes);
            $("#comment").val("");
        } else {
            return Backbone.sync(method, model, options);
        }
    }
});

//  话题集合
var Topics = Backbone.Collection.extend({
    "url": "/topic",
    "model": Topic
});

//  消息集合
var Messages = Backbone.Collection.extend({
    "url": "/message",
    "model": Message
});

var topics = new Topics();

//  主题视图
var TopicView = Backbone.View.extend({
    "tagName": "div class='column'",
    "templ": _.template($("#topic-template").html()),
    "render": function () {
        console.log(this.model.toJSON());
        $(this.el).html(this.templ(this.model.toJSON()));
        return this;
    }
});

//  消息视图
var MessageView = Backbone.View.extend({
    "tagName": "div class='comment'",
    "templ": _.template($("#message-template").html()),
    "render": function () {
        $(this.el).html(this.templ(this.model.toJSON()));
        return this;
    }
});

//  用户视图
var UserView = Backbone.View.extend({
    "el": "#user_info",
    "username": $("#username"),
    "show": function (username) {
        this.username.html(username);
        this.$el.show();
    }
});

//  AppView(视图管理)
//  获取Topic和Message的数据到Collection中,调用model对应的view把数据填到模板
var AppView = Backbone.View.extend({
    "el": "#main",
    "topic_list": $("#topic_list"),
    "topic_section": $("#topic_section"),
    "message_list": $("#message_list"),
    "message_section": $("#message_section"),
    "message_head": $("#message_head"),
    "events": {
        "click .submit": "saveMessage",
        "click .submit_topic": "saveTopic",
        "keypress #comment": "saveMessageEvent"
    },
    "initialize": function () {
        _.bindAll(this, "addTopic", "addMessage");
        topics.bind("add", this.addTopic);

        this.message_pool = {};
        this.message_list_div = $("#message_list");
    },
    "addTopic": function (topic) {
        var view = new TopicView({
            "model": topic
        });
        this.topic_list.append(view.render().el);
    },
    "addMessage": function (message) {
        var view = new MessageView({
            "model": message
        });
        this.message_list.append(view.render().el);
    },
    "saveMessage": function (ev) {
        var comment_box = $("#comment");
        var content = comment_box.val();
        if (!content) {
            alert("内容不能为空");
            return false;
        }
        var topic_id = comment_box.attr("id");
        var message = new Message({
            "content": content,
            "topic_id": topic_id
        });
        var self = this;
        var messages = this.message_pool[topic_id];
        message.save(null, {
            "success": function (model, res, opt) {
                comment_box.val("");
                //messages.fetch({
                //    "data": {
                //        "topic_id": topic_id
                //    },
                //    "success": function () {
                //        self.message_list.scrollTop(self.message_list_div.scrollHeight);
                //        message.add(res);
                //    }
                //});
            }
        });
    },
    "saveMessageEvent": function (ev) {
        if (ev.keyCode == 13) {
            this.saveMessage(ev);
        }
    },
    "saveTopic": function () {
        var topic_title = $("#topic_title");
        if (!topic_title.val()) {
            alert("主题不能为空");
            return false;
        }
        var topic = new Topic({
            "title": topic_title.val()
        });
        var self = this;
        topic.save(null, {
            "success": function (model, res, opt) {
            }
        });
    },
    "showTopic": function () {
        topics.fetch(null, {
            "success": function (collection, res, opt) {
                console.log(res);
            }
        });
        this.topic_section.show();
        this.message_section.hide();
        this.message_list.html("");
        this.goOut();
    },
    "goOut": function () {
        // 退出房间
        socket.emit("go_out");
        socket.removeAllListeners("message");
    },
    "initMessage": function (topic_id) {
        var messages = new Messages();
        messages.bind("add", this.addMessage);
        this.message_pool[topic_id] = messages;
    },
    "showMessage": function (topic_id) {
        this.initMessage(topic_id);
        this.message_section.show();
        this.topic_section.show();
        this.showMessageHead(topic_id);
        var messages = this.message_pool[topic_id];
        var self = this;
        socket.emit("topic", topic_id);
        socket.on("message", function (res) {
            messages.add(res);
        });
        messages.fetch({
            "data": {
                "topic_id": topic_id
            },
            "success": function (res) {
                self.message_list.scrollTop(self.message_list_div.scrollHeight);
            }
        });
    },
    "showMessageHead": function (topic_id) {
        var topic = new Topic({
            "id": topic_id
        });
        var self = this;
        topic.fetch({
            "success": function (res, model, opt) {
                self.message_head.html(model.title);
            }
        });
    }
});

//  登录视图,展示登录注册
var LoginView = Backbone.View.extend({
    "el": "#login",
    "wrapper": $("#wrapper"),
    "events": {
        "keypress #login_pwd": "loginEvent",
        "click .login_submit": "login",
        "click #reg_pwd_repeat": "registeEvent",
        "click .registe_submit": "registe"
    },
    "hide": function () {
        this.wrapper.hide();
    },
    "show": function () {
        this.wrapper.show();
    },
    "loginEvent": function (ev) {
        if (ev.keyCode == 13) {
            this.login(ev);
        }
    },
    "login": function (ev) {
        var username_input = $("#login_username");
        var pwd_input = $("#login_pwd");
        var user = new User({
            "username": username_input.val(),
            "password": pwd_input.val()
        });
        user.save(null, {
            "url": "/login",
            "success": function (model, res, opt) {
                g_user = res;
                appRouter.navigate("index", {
                    "trigger": true
                });
            }
        });
    },
    "registeEvent": function (ev) {
        if (ev.keyCode == 13) {
            this.registe(ev);
        }
    },
    "registe": function (ev) {
        var reg_username_input = $("#reg_username");
        var reg_pwd_input = $("#reg_pwd");
        var reg_pwd_repeat = $("#reg_pwd_repeat");
        var user = new User({
            "username": reg_username_input.val(),
            "password": reg_pwd_input.val(),
            "password_repeat": reg_pwd_repeat.val()
        });
        user.save(null, {
            "success": function (model, res, opt) {
                g_user = res;
                AppRouter.navigate("index", {
                    "trigger": true
                });
            }
        });
    }
});

//  定义路由
var AppRouter = Backbone.Router.extend({
    "routes": {
        "login": "login",
        "index": "index",
        "topic/:id": "topic"
    },
    "initialize": function () {
        this.appView = new AppView();
        this.loginView = new LoginView();
        this.userView = new UserView();
        this.indexFlag = false;
    },
    "login": function () {
        this.loginView.show();
    },
    "index": function () {
        if (g_user && g_user.id != undefined) {
            this.appView.showTopic();
            this.userView.show(g_user.username);
            this.loginView.hide();
            this.indexFlag = true;
        }
    },
    "topic": function (topic_id) {
        if (g_user && g_user.id != undefined) {
            this.appView.showMessage(topic_id);
            this.userView.show();
            this.loginView.hide();
            this.indexFlag = true;
        }
    }
});

//  程序启动
appRouter = new AppRouter();
g_user = new User();
g_user.fetch({
    "success": function (model, res, opt) {
        if (res["user"]) {
            g_user = res["user"];
        }
        Backbone.history.start();
        if (g_user == null || g_user.id == undefined) {
            appRouter.navigate("login", {
                "trigger": true
            });
        } else if (appRouter.indexFlag == false) {
            appRouter.navigate("index", {
                "trigger": true
            });
        }
    }
});