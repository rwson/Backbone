/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/bookLibrary");

var Book = new mongoose.Schema({
    "title": String,
    "author": String,
    "releaseDate": Date
});

var BookModel = mongoose.model('Book', Book);

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'static')));

    if ('development' == app.get('env')) {
        app.use(express.errorHandler({'dumpExceptions': true, 'showStack': true}));
    }
});

/**
 * 获取图书列表
 */
app.get('/api/books',function(req,res){
    return BookModel.find(function(err,books){
        return err ? console.log(err) : res.send(books);
    });
});

/**
 * 添加一本新书
 */
app.post('/api/books',function(req,res){
    var book = new BookModel({
        'title':req.body.title,
        'author':req.body.author,
        'releaseDate':req.body.releaseDate
    });
    book.save(function(err){
        return err ? console.log(err) : console.log('success') && res.send(book);
    });
});

/**
 * 根据书的id更新一本书
 */
app.put('/api/books/:id',function(req,res){
    return BookModel.findById(req.params.id,function(req,book){
        book.title = req.body.title;
        book.author = req.body.author;
        book.releaseDate = req.body.releaseDate;
        return book.save(function(err){
            return err ? console.log(err) : console.log('success') && res.send(book);
        });
    });
});

/**
 * 根据id删除某本书
 */
app.delete('/api/books/:id',function(req,res){
    return BookModel.remove({
        '_id':req.params.id
    },function(err,book){
        return err ? console.log(err) : console.log('success') && res.send(book);
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
