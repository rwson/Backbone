/**
 * backbone webChat前端模块
 */

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
    "urlRoot": "/message"
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

//  主题视图
var TopicView = Backbone.View.extend({
    "tagName": "div class='column'",
    "templ": _.template($("#topic-template").html()),
    "render": function () {
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
        this.message_list_div = document.getElementById("message_list");
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
        if(!content){
            alert("内容不能为空");
            return false;
        }
        var topic_id = comment_box.attr("id");
        var message = new Message({
            "content":content,
            "topic_id":topic_id
        });
        var self = this;
        var messages = this.message_pool[topic_id];
        message.save(null,{
            "success":function(model,res,opt){
                comment_box.val("");
                messages.fetch({
                    "data":{
                        "topic_id":topic_id
                    },
                    "success":function(){
                        self.message_list.scrollTop(self.message_list_div.scrollHeight);
                        message.add(res);
                    }
                });
            }
        });
    },
    "saveMessageEvent": function (ev) {
        if (ev.keyCode == 13) {
            this.saveMessage(ev);
        }
    },
    "saveTopic":function(){
        var topic_title = $("#topic_title");
        if(!topic_title.val()){
            alert("主题不能为空");
            return false;
        }
        var topic = new Topic({
            "title":topic_title.val()
        });
        var self = this;
        topic.save(null,{
            "success":function(model,res,opt){}
        });
    }
});