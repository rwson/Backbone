/**
 * 路由控制
 */

var Models = require("../models").Models;
var crypto = require('crypto');

module.exports = function (app) {

    /**
     * 用户注册
     */
    app.post("/user", function (req, res) {
        var User = new Models.User({
            "id": _randomId(),
            "username": req.body.username,
            "password": _encryptString(req.body.password),
            "register_time": Date.now()
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
                console.log(err);
                return res.send(500, err);
            }
        });
    });

    /**
     * 用户登录
     */
    app.post("/login", function (req, res) {
        Models.User.find({
            "password": _encryptString(req.body.password)
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
        res.send(200,{
            "message":"登出成功!"
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
            res.send(200, {
                "topics": topics
            });
        });
    });

    /**
     * 新建话题
     */
    app.post("/topic", function (req, res) {
        console.log(req.session);
        var Topic = new Models.Topic({
            "id": _randomId(),
            "title": req.body.title,
            "create_time": Date.now(),
            "owner": req.session.user["id"]
        });
        Models.Topic.find({
            "title": req.body.title
        }, function (err, topic) {
            if (err) {
                console.log(err);
                res.send(500, err);
            } else if (topic.length) {
                res.send(400, {
                    "message":"该话题已存在!"
                });
            }else{
                Topic.save(function(err,topic){
                    if(err){
                        console.log(err);
                        res.send(200,{
                            "message":"话题创建成功!"
                        });
                    }
                });
            }
        });
    });

    /**
     * 查看具体话题
     */
    app.get("/topic/:id", function (req, res) {
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

/**
 * 生成随机id,当各种id
 * @returns {string}
 * @private
 */
function _randomId() {
    var S4 = function () {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return [S4(), S4(), S4(), S4(), S4(), S4(), S4(), S4()].join("");
}

/**
 * 加密字符串
 * @param str   被加密的字符串
 * @return {string}
 * @private
 */
function _encryptString(str) {
    var sha1 = crypto.createHash("sha1");
    sha1.update("" + str);
    return sha1.digest("hex");
}