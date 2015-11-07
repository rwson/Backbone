/**
 * 路由控制
 */

var Models = require("../models").Models;
var Util = require("../Util");

module.exports = function (io,app) {

    var ioInstance = io.listen(app.listen(app.get('port')));
    //  启动socket端口

    /**
     * 用户注册
     */
    app.post("/user", function (req, res) {
        var User = new Models.User({
            "id": Util.randomId(),
            "username": req.body.username,
            "password": Util.encryptString(req.body.password),
            "register_time": Util.getTime()
        });
        Models.User.find({
            "username": req.body.username
        }, function (err, user) {
            if (err) {
                return res.send(500, err);
            } else if (user.length) {
                return res.send(400, {
                    "user": user,
                    "message": "用户名已存在!"
                });
            }
            User.save(function (err, user) {
                if (err) {
                    return res.send(500, err);
                }
                res.send(200, {
                    "code": 200,
                    "user": user
                });
            });
        });
    });

    /**
     * 获取用户列表
     */
    app.get("/user", function (req, res) {
        req.session.user = {
            "id": "b35c4fa3fb62e60432e05b88926f5ee0",
            "username": "小宋",
            "password": "7c4a8d09ca3762af61e59520943dc26494f8941b",
            "register_time": {
                "year": "2015",
                "month": "2015-11",
                "day": "2015-11-06",
                "minutes": "2015-11-06 12:43",
                "seconds": "2015-11-06 12:43:48"
            },
            "_id": "563c3004e65c50b410000001",
            "__v": 0
        };
        res.send(200, {
            "code": 200,
            "user": {
                "id": "b35c4fa3fb62e60432e05b88926f5ee0",
                "username": "小宋",
                "password": "7c4a8d09ca3762af61e59520943dc26494f8941b",
                "register_time": {
                    "year": "2015",
                    "month": "2015-11",
                    "day": "2015-11-06",
                    "minutes": "2015-11-06 12:43",
                    "seconds": "2015-11-06 12:43:48"
                },
                "_id": "563c3004e65c50b410000001",
                "__v": 0
            }
        });
        return;
        if (req.session.user) {
            return res.send(200, {
                "code": 200,
                "user": req.session.user
            });
        }
        //  如果已经有用户登录的情况
        Models.User.find(function (err, users) {
            if (err) {
                return res.send(500, err);
            }
            res.send(200, {
                "code": 200,
                "users": users
            });
        });
    });

    /**
     * 获取单个用户
     */
    app.get("/user/:id", function (req, res) {
        Models.User.find({
            "id": req.body.id
        }, function (err, user) {
            if (err) {
                return res.send(500, err);
            }
        });
    });

    /**
     * 用户登录
     */
    app.post("/login", function (req, res) {
        Models.User.find({
            "password": Util.encryptString(req.body.password)
        }, function (err, user) {
            if (err) {
                console.log(err);
                return res.send(500, err);
            } else if (!user.length) {
                res.send(400, {
                    "message": "登录失败!密码错误!"
                });
            } else if (user[0].username == req.body.username) {
                req.session.user = user[0];
                res.send(200, user[0]);
            } else {
                res.send(400, {
                    "message": "登录失败!用户名错误!"
                });
            }
        });
    });

    /**
     * 用户登出
     */
    app.get("/logout", function (req, res) {
        req.session.user = null;
        res.send(200, {
            "message": "登出成功!"
        });
    });

    /**
     * 话题列表
     */
    app.get("/topic", function (req, res) {
        Models.Topic.find(function (err, topics) {
            if (err) {
                console.log(err);
                return res.send(500, err);
            }
            res.send(topics);
        });
    });

    /**
     * 新建话题
     */
    app.post("/topic", function (req, res) {
        var Topic = new Models.Topic({
            "id": Util.randomId(),
            "title": req.body.title,
            "created_time": Util.getTime(),
            "owner": req.session.user["id"],
            "owner_name": req.session.user["username"]
        });
        Models.Topic.find({
            "title": req.body.title
        }, function (err, topic) {
            if (err) {
                res.send(500, err);
            } else if (topic.length) {
                res.send(400, {
                    "message": "该话题已存在!"
                });
            } else {
                Topic.save(function (err, topic) {
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    }
                    res.send(200, {
                        "message": "话题创建成功!"
                    });
                });
            }
        });
    });

    /**
     * 查看具体话题
     */
    app.get("/topic/:id", function (req, res) {
        Models.Topic.find({
            "id": req.params.id
        }, function (err, topic) {
            if (err) {
                console.log(err);
                return res.send(500, err);
            }
            res.send(200, {
                "code": 200,
                "topic": topic
            });
        });
    });

    /**
     * 发送消息
     */
    app.post("/message", function (req, res) {
        var Message = new Models.Message({
            "id": Util.randomId(),
            "content": req.body.content,
            "topic_id": req.body.topic_id,
            "user_id": req.session.user["id"],
            "created_time": Util.getTime()
        });
        Message.save(function (err, message) {
            if (err) {
                console.log(err);
                return res.send(500, err);
            }
            res.send(200, {
                "code": 200,
                "message": message
            });
        });
    });

    /**
     * 浏览某个话题下的消息
     */
    app.get("/message", function (req, res) {
        console.log(req.query.topic_id);
        Models.Message.find({
            "topic_id":req.query.topic_id
        },function(err,messages){
            if (err) {
                console.log(err);
                return res.send(500, err);
            }
            res.send(200, {
                "code": 200,
                "message": messages
            });
        });
    });

    /**
     * 删除某条消息
     */
    app.delete("/message/:id", function (req, res) {
        Models.Message.findOneAndRemove()
    });

    /**
     * 创建一条新消息
     */
    ioInstance.sockets.on("connection",function(socket){
        socket.on("message",function(message){
            console.log(message);
        });
    });

    //  上述路由不匹配,全部输出static目录下的index.html做响应
    app.use(function (req, res) {
        res.sendfile("static/index.html");
    });

};