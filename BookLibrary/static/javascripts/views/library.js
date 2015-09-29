/**
 * library.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 * 图书列表
 */

var app = app || {};

app.LibraryView = Backbone.View.extend({

    "el":"#books",

    "events":{
        "click #add":"addBook"
    },

    "initialize":function(initializeBooks){
        this.collection = new app.Lbrary();
        this.collection.fetch({
            "reset":true
        });
        this.render();

        this.listenTo(this.collection,"add",this.renderBook);
        this.listenTo(this.collection,"reset",this.render);
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
    },

    "addBook":function(e){
        e.preventDefault();
        var formData = {};
        $("#addBook div").children("input").each(function(index,ele){
            if($(ele).val() != ""){
                formData[ele.id] = $(ele).val();
            }
        });
        this.collection.create(formData);
    }

});
