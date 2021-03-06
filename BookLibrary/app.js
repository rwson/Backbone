/**
 * Module dependencies.
 */

var express = require("express");
var http = require("http");
var path = require("path");
var mongoose = require("mongoose");
var fs = require("fs");
var multipart = require("connect-multiparty");
var formidable = require("formidable");
var accessLog = fs.createWriteStream('access.log',{'flags':'a'});
var errorLog = fs.createWriteStream('error.log',{'flags':'a'});

mongoose.connect("mongodb://localhost:27017/bookLibrary");

var keywords = new mongoose.Schema({
    "keyword": String
});
var Book = new mongoose.Schema({
    "title": String,
    "author": String,
    "coverImage": String,
    "releaseDate": Date,
    "bookId": String,
    "keywords": [keywords]
});

var BookModel = mongoose.model("Book", Book);

var app = express();

app.configure(function () {
    app.set("port", process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, "static")));
    app.use(express.logger({"stream":accessLog}));
    app.use(function(err,req,res,next){
        var meta = '[' + new Date() + ']' + req.url + '\n';
        errorLog.write(meta + err.static + '\n');
        next();
    });
    if ("development" == app.get("env")) {
        app.use(express.errorHandler({"dumpExceptions": true, "showStack": true}));
    }
});

/**
 * 上传文件
 */
app.post("/upload", function (req, res) {
    var form = new formidable.IncomingForm(),
        path = "static/upload/",
        extName = "",
        filePath = "",
        targetPath = "";
    form.encoding = "utf-8";
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req, function (err, fields, files) {
        err && function () {
            throw err;
        }();
        switch (files["files"]["type"]) {
            case "image/pjpeg":
            case "image/jpeg":
                //  jpg格式
                extName = "jpg";
                break;
            case "image/png":
            case "image/x-png":
                //  png格式
                extName = "png";
                break;
            default :
                res.send(400, {
                    "code": 400,
                    "msg": "上传失败!请检查文件类型!"
                });
                return;
        }
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        //  目录不存在,手动创建上传目录
        filePath = files["files"]["path"];
        targetPath = path + Date.now() + "." + extName;
        try {
            fs.renameSync(filePath, targetPath);
        } catch (e) {
            var inputStream = fs.createReadStream(filePath),
                outputStream = fs.createWriteStream(targetPath);
            inputStream.pipe(outputStream);
            inputStream.on("end", function () {
                fs.unlink(filePath);
            });
        }
        res.send(200, {
            "code": 200,
            "url": targetPath.replace(/^static\//i, "")
        });
    });
});

/**
 * 获取图书列表
 */
app.get("/api/books", function (req, res) {
    return BookModel.find(function (err, books) {
        err && function () {
            return console.log(err)
        }();
        console.log("success");
        res.send(books);
    });
});

/**
 * 获取书的详情
 */
app.get("/api/book/:bookId",function(req,res){
    BookModel.find({
        "bookId":req.params.bookId
    },function(err,book){
        err && function () {
            return console.log(err)
        }();
        res.send(200,book);
    });
});

/**
 * 添加一本新书
 */
app.post("/api/books", function (req, res) {
    var book = new BookModel({
        "title": req.body.title,
        "author": req.body.author,
        "releaseDate": req.body.releaseDate,
        "keywords": req.body.keywords,
        "coverImage": req.body.coverImage,
        "bookId": req.body.bookId
    });
    book.save(function (err) {
        err && function () {
            return console.log(err)
        }();
        console.log("success");
        res.send(book);
    });
});

/**
 * 根据书的id更新一本书
 */
app.put("/api/books/:id", function (req, res) {
    return BookModel.findById(req.params.id, function (req, book) {
        book.title = req.body.title;
        book.author = req.body.author;
        book.releaseDate = req.body.releaseDate;
        book.keywords = req.body.keywords;
        return book.save(function (err) {
            err && function () {
                return console.log(err)
            }();
            res.send(book);
        });
    });
});

/**
 * 根据id删除某本书
 */
app.delete("/api/books/:id", function (req, res) {
    return BookModel.remove({
        "_id": req.params.id
    }, function (err, book) {
        err && function () {
            return console.log(err)
        }();
        console.log("success");
        res.send(book);
    });
});

http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});
