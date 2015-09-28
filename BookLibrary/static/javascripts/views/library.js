/**
 * library.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 */

var app = app || {};

app.LibraryView = Backbone.View.extend({

    "el":"#books",

    "initialize":function(initializeBooks){
        this.collection = new app.Lbrary(initializeBooks);
        this.render();
    },

    "render":function(){
        this.collection.each(function(item){
            this.renderBook(item);
        },this);
    },

    "renderBook":function(item){
        var bookView = new app.BookView({
            "model":item
        });
        this.$el.append(bookView.render().el);
    }

});
