/**
 * book.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 * 每本书的视图
 */

var app = app || {};

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
