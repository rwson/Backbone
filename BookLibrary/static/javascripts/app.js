/**
 * app.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 */

var app = app || {};

$(function () {

    var AppRouter = Backbone.Router.extend({
        routes: {
            "":"main",
            "book/:id": "getBook"
        },
        "main":function(){
            $("#releaseDate").datepicker();
            new app.LibraryView();

        },
        "getBook": function (id) {
            console.log(app);
            new app.DetailView();
        }
    });

    new AppRouter();
    Backbone.history.start();
});