/**
 * User/Topic/Message表设计
 */
var mongoose = require("mongoose");
var exportObj = {
    "User": new mongoose.Schema({
        "id": String,
        "username": String,
        "password": String,
        "register_time": Object
    }),
    "Topic": new mongoose.Schema({
        "id": String,
        "title": String,
        "created_time": Object,
        "owner": String,
        "owner_name":String
    }),
    "Message": new mongoose.Schema({
        "id": String,
        "content": String,
        "top_id": String,
        "user_id": String,
        "created_time": Object
    })
};

mongoose.connect("mongodb://localhost:27017/backbobeChart");

exports.Models = {
    "User": mongoose.model('User', exportObj.User),
    "Topic": mongoose.model('Topic', exportObj.Topic),
    "Message": mongoose.model('Message', exportObj.Message)
};