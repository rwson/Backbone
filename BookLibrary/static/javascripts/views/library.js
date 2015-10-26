/**
 * library.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 * 图书列表
 */

var app = app || {};

app.LibraryView = Backbone.View.extend({

    "el": "#books",

    "events": {
        "click #add": "addBook",
        "change #coverImage": "upload"
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