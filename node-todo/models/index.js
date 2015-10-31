var mongoose = require("mongoose");

var Todo = new mongoose.Schema({
    "title": String,
    "order": Number,
    "done": Boolean
});

mongoose.connect("mongodb://localhost:27017/Backbobe-Todo");

exports.todoModel = mongoose.model('Todos',Todo);