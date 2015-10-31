/**
 * User/Topic/Message表设计
 */
var mongoose = require("mongoose");
var exportObj = {
    "User": new mongoose.Schema({
        "id": String,
        "username": String,
        "password": String,
        "register_time": Date
    }),
    "Topic": new mongoose.Schema({
        "id": String,
        "title": String,
        "create_time": Date,
        "owner": String
    }),
    "Message": new mongoose.Schema({
        "id": String,
        "content": String,
        "top_id": String,
        "user_id": String,
        "create_time": Date
    })
};

mongoose.connect("mongodb://localhost:27017/backbobeChart");

exports.Models = {
    "User": mongoose.model('User', exportObj.User),
    "Topic": mongoose.model('Topic', exportObj.Topic),
    "Message": mongoose.model('Message', exportObj.Message)
};