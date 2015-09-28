/**
 * book.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 */

var app = app || {};

app.BookView = Backbone.View.extend({

    "tagName":"div",

    "className":"bookContainer",

    "template": _.template($("#bookTemplate").html()),

    "render":function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

});
