/**
 * 路由控制
 */

var Models = require("../models").Models;
var Util = require("../Util");
var socket = require('../socket');

module.exports = function (app) {

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
        console.log(req.session);
        var Topic = new Models.Topic({
            "id": Util.randomId(),
            "title": req.body.title,
            "create_time": Util.getTime(),
            "owner": req.session.user["id"]
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
        Models.Topic.findById(req.params.id, function (err, topic) {
        });
    });

    /**
     * 发送消息
     */
    app.post("/message", function (req, res) {
    });

    /**
     * 浏览某条消息
     */
    app.get("/message/:id", function (req, res) {
    });

    /**
     * 删除某条消息
     */
    app.delete("/message/:id", function (req, res) {
    });

    app.use(function (req, res) {
        res.sendfile("static/index.html");
    });

};