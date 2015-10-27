/**
 * app.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 */

var app = app || {};

$(function () {

    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "main",
            "/book/111": "getBook",
            "/posts/:id": "getPost",
            "/download/*path": "downloadFile",  //对应的链接为<a href="#/download/user/images/hey.gif">download gif</a>
            "/:route/:action": "loadView",      //对应的链接为<a href="#/dashboard/graph">Load Route/Action View</a>
            "*actions": "getBook"
        },
        main: function () {
            $("#releaseDate").datepicker();
            new app.LibraryView();
        },
        getBook: function (id) {
            alert(111);
            alert(id);
        },
        getPost: function (id) {
            alert(id);
        },
        defaultRoute: function (actions) {
            alert(actions);
        },
        loadView: function (route, action) {
            console.log(route);
            console.log(action);
        }
    });

    new AppRouter();
    Backbone.history.start();
});