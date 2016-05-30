var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var mysql   =   require('./utils/mysql-connector');
var mySqlConnection   =   require('./utils/mysqlConnection');
var mySqlConnectionObj = new mySqlConnection();


var fs = require('fs');
var passwordHash                    =   require('password-hash');
var multer = require('multer');

//var mongoose = require('mongoose');
// Connect to DB
//mongoose.connect(dbConfig.url);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());


// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);


// mysql(function (err, Connection) {
//     err ? console.log(err) : console.log("Connected to AngryClowns DB");
//     // Connection.query("select * from tbl_user",function (err, status) {
//     //     console.log(err)
//     //     console.log(status)
//     // })
// });

mySqlConnectionObj.init();
setInterval(function () {
    mySqlConnectionObj.executeQuery('SELECT 1',[],function (err, status) {
        //console.log("MySQL Heartbeat ")
        console.log(status)
    });
}, 60000);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    console.log(req.path)
    if(req.path != "/imageUpload") {
        res.render('404');
    }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('landing');
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('landing');
});


process.on('uncaughtException', function(err) {
    console.log(err);
});


module.exports = app;
