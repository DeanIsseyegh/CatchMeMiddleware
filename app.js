
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
//app.get('/findrequests', routes.findrequests);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require("./routes");

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
