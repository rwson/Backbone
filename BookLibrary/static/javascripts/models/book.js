/**
 * book.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 * 每本书的模型
 */

var app = app || {};

app.Book = Backbone.Model.extend({

    "defaults":{
        "coverImage":"images/default.jpg",
        "title":"No title",
        "author":"Unknown",
        "releaseDate":"Unknown",
        "keywords":"None"
    },

    "parse":function(res){
        res.id = res._id;
    }

});
