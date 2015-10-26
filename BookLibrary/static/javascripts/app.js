/**
 * app.js
 * build by rwson @9/28/15
 * mail:rw_Song@sina.com
 */

var app = app || {};

$(function(){

    $("#releaseDate").datepicker();

    new app.LibraryView();
});