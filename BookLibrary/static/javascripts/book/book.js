/**
 * library.js
 * 图书库
 */
var app = app || {};

//  每本书的详情模型
app.BookDetailModel = Backbone.Model.extend({
    "defaults": {
        "coverImage": "images/default.jpg",
        "title": "No title",
        "author": "Unknown",
        "releaseDate": "Unknown",
        "keywords": "None",
        "bookId": "id"
    },
    "parse": function (res) {
        res.id = res._id;
        return res;
    },
    "fetch": function (id) {
        var self = this, tmpNews;
        $.ajax({
            "url": "/api/book/" + id,
            "type": "GET",
            "success": function (res) {
                self.set({
                    "coverImage":res[0]["coverImage"],
                    "title":res[0]["title"],
                    "author":res[0]["author"],
                    "releaseDate":res[0]["releaseDate"],
                    "keywords":res[0]["keywords"],
                    "bookId":res[0]["bookId"]
                });
                self.trigger("book:Detail");
            }
        });
    }
});

//  图书详情
app.BookDetailView = Backbone.View.extend({
    "el": "#book-detail",
    "model": new app.BookDetailModel(),
    "template": _.template($("#bookDetailTemplate").html()),
    "initialize": function (id) {
        this.model.fetch(id);
        this.model.bind("book:Detail", this.render, this);
    },
    "render": function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});