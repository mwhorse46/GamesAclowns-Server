#!/usr/bin/env node
process.env.RUNNING_HOST  = 0;
var debug = require('debug')('passport-mongo');
var app = require('../app');

app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
