//  每本书的模型
var app = app || {};

app.Book = Backbone.Model.extend({
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

//  所有书的集合
app.Lbrary = Backbone.Collection.extend({
    "model":app.Book,
    "url":"/api/books"
});

//  每本书的视图
app.BookView = Backbone.View.extend({
    "tagName":"div",
    "className":"bookContainer",
    "events":{
        "click .delete":"deleteBook"
    },
    "template": _.template($("#bookTemplate").html()),
    "render":function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    "deleteBook":function(){
        this.model.destroy();
        this.remove();
    }
});

//  图书列表
app.LibraryView = Backbone.View.extend({
    "el": "#books",
    "events": {
        "click #add": "addBook"
    },
    "initialize": function () {
        this.collection = new app.Lbrary();
        this.collection.fetch({
            "reset": true
        });
        this.render();
        this.listenTo(this.collection, "add", this.renderBook);
        this.listenTo(this.collection, "reset", this.render);
    },
    "render": function () {
        this.collection.each(function (item) {
            this.renderBook(item);
        }, this);
    },
    "renderBook": function (item) {
        var bookView = new app.BookView({
            "model": item
        });
        this.$el.append(bookView.render().el);
    },
    "addBook": function (e) {
        e.preventDefault();
        var formData = {},
            formData = new FormData($("#frmUploadFile")[0]),
            _this = this;
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                if(200 === data.code) {
                    $("#addBook div").children("input").each(function (index, ele) {
                        if ($(ele).val() != "") {
                            if (ele.id == "keywords") {
                                formData[ele.id] = [];
                                _.each($(ele).val().split(" "), function (item) {
                                    formData[ele.id].push({
                                        "keyword": item
                                    });
                                });
                            } else if (ele.id == "releaseDate") {
                                formData[ele.id] = $("#releaseDate").datepicker("getDate").getTime();
                            } else {
                                formData[ele.id] = $(ele).val();
                            }
                        }
                    });
                    formData["coverImage"] = data["url"];
                    formData["bookId"] = _randomId();
                    _this.collection.create(formData);
                } else {
                    alert("图片上传失败");
                }
            },
            error: function(){
                alert("上传失败,请重试！");
            }
        });
    }
});

//  图书详情
app.DetailView = Backbone.View.extend({
    "otherEl": "#books",
    "events": {
        "click #add": "addBook"
    },
    "initialize": function () {
        $(this.otherEl).hide();
    }
});

/**
 * 生成随机id,存储书籍
 * @returns {string}
 * @private
 */
function _randomId() {
    var S4 = function () {
        return Math.floor(Math.random() *  0x10000).toString(16);
    };

    return [S4(),S4(),S4(),S4(),S4(),S4(),S4(),S4()].join("");
}