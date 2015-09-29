/**
 * library.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 * 书的集合
 */

var app = app || {};

app.Lbrary = Backbone.Collection.extend({

    "model":app.Book,

    "url":"/api/books"

});
