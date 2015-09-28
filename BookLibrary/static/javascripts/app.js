/**
 * app.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 */

var app = app || {};

$(function(){
    var book = [
        {
            "coverImage":"images/default.jpg",
            "title":"No title",
            "author":"Unknown",
            "releaseDate":"Unknown",
            "keywords":"None"
        },
        {
            "coverImage":"images/default.jpg",
            "title":"No title",
            "author":"Unknown",
            "releaseDate":"Unknown",
            "keywords":"None"
        },
        {
            "coverImage":"images/default.jpg",
            "title":"No title",
            "author":"Unknown",
            "releaseDate":"Unknown",
            "keywords":"None"
        },
        {
            "coverImage":"images/default.jpg",
            "title":"No title",
            "author":"Unknown",
            "releaseDate":"Unknown",
            "keywords":"None"
        },
        {
            "coverImage":"images/default.jpg",
            "title":"No title",
            "author":"Unknown",
            "releaseDate":"Unknown",
            "keywords":"None"
        }
    ];

    new app.LibraryView(book);
});