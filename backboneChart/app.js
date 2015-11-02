/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var socket = require('./socket');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.cookieParser("backboneChat"));
app.use(express.session({
    secret: "backboneChat",
    key: "sessionUser",
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}
}));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'static')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//  start socket server
socket.startServer(io, app);

//  apply routers
routes(app);

console.log('Express server listening on port ' + app.get('port'));