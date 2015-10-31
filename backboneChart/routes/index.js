/**
 * 路由控制
 */

var Models = require("../models").Models;

module.exports = function (app) {

    /**
     * 用户注册
     */
    app.post("/user", function (req, res) {
        var user = new Models.User({
            "id": _randomId(),
            "username": req.body.name,
            "password": req.body.password,
            "register_time": Date.now()
        });
        user.save(function(err,user){
            if(err){
                return res.send(500,err);
            }
            res.send(200,{
                "code":200,
                "user":user
            });
        });
    });

    /**
     * 获取用户列表
     */
    app.get("/user", function (req, res) {
        Models.User.find(function(err,users){
            if(err){
                return res.send(500,err);
            }
            res.send(200,{
                "code":200,
                "users":users
            });
        });
    });

    /**
     * 获取单个用户
     */
    app.get("/user/:id", function (req, res) {
        Models.User.find({
            "id":req.body.id
        },function(err,user){
            if(err){

            }
        });
    });

    /**
     * 用户登录
     */
    app.post("/login", function (req, res) {
    });

    /**
     * 用户登出
     */
    app.get("/logout", function (req, res) {
    });

    /**
     * 话题列表
     */
    app.get("/topic", function (req, res) {
    });

    /**
     * 新建话题
     */
    app.post("/topic", function (req, res) {
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

};

/**
 * 生成随机id,当各种id
 * @returns {string}
 * @private
 */
function _randomId() {
    var S4 = function () {
        return Math.floor(Math.random() *  0x10000).toString(16);
    };
    return [S4(),S4(),S4(),S4(),S4(),S4(),S4(),S4()].join("");
}