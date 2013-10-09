
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var precommit = require('./precommit');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/precommit', precommit.receive);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
