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
            //  首页路由
            $("#releaseDate").datepicker();
            new app.LibraryView();

        },
        "getBook": function (id) {
            //  图书详情页
            new app.BookDetailView(id);
        }
    });

    new AppRouter();
    Backbone.history.start();
});