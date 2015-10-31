/**
 * index.js
 * todos的路由控制,处理路由相关逻辑
 */

var TodoModel = require("../models/index").todoModel;     //  加入todo模型依赖

module.exports = function(app){

    /**
     * 获取所有的todo项
     */
    app.get("/todos",function(req,res){
        TodoModel.find(function(err,todos){
            if(err){
                console.log("查询失败");
                return res.send(500,err);
            }
            res.send(todos);
        });
    });

    /**
     * 插入一个todo项
     */
    app.post("/todo",function(req,res){
        var todo = new TodoModel({
            "title":req.body.title,
            "order":req.body.order,
            "done":req.body.done
        });
        todo.save(function(err,todo){
            if(err){
                console.log("保存失败");
                return res.send(500,err);
            }
            res.send(200,{
                "code":"200",
                "message":"保存成功"
            });
        });
    });

    /**
     * 更新一个todo项
     */
    app.put("/todo/:id",function(req,res){
        return TodoModel.findById(req.params.id, function (err, todo) {
            if(err){
                return res.send(500,err);
            }
            todo.title = req.body.title;
            todo.order = req.body.order;
            todo.done = req.body.done;
            todo.save(function(err){
                if(err){
                    return res.send(500,err);
                }
                res.send(todo);
            });
        });
    });

    /**
     * 删除一个todo项
     */
    app.delete("/todo/:id",function(req,res){
        return TodoModel.remove({
            "_id": req.params.id
        }, function (err, book) {
            err && function () {
                return console.log(err)
            }();
            console.log("success");
            res.send(book);
        });
    });

};