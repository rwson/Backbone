/**
 * library.js
 * 图书库
 */
var app = app || {};

//  每本书的详情模型
app.BookDetailModel = Backbone.Model.extend({
    "urlRoot": '/api/book',
    "defaults":{
        "coverImage":"images/default.jpg",
        "title":"No title",
        "author":"Unknown",
        "releaseDate":"Unknown",
        "keywords":"None",
        "bookId":"id"
    },
    "parse":function(res){
        res.id = res._id;
        return res;
    }
});

//  一本书的集合
app.BookLibrary = Backbone.Collection.extend({
    "model":app.BookDetailModel,
    "url":"/api/books"
});

//  图书详情
app.BookDetailView = Backbone.View.extend({
    "el":"#book-detail",
    "template": _.template($("#bookDetailTemplate").html()),
    "initialize": function (id) {
        var _this = this,
            Book = new app.BookDetailModel({
            "id":id
        });
        this.collection = new app.BookLibrary({
            "id":id
        });
        this.collection.fetch({
            "reset":true
        });
        Book.fetch({
            reset:true,
            success: function (book) {
                _this.render(book);
            }
        });
    },
    "render":function(model){
        this.$el.html(this.template(model.toJSON()));
        return this;
    }
});