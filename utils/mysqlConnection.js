var async = require('async');
var mysql = require('mysql');
var EXPIRY_TIME_LIMIT = 10;    //  10 seconds
var config          =       require('./config');

var mysql_config    =       process.env.RUNNING_HOST==0 ? config.mysqlConfig : config.mysqlDevConfig;

function Connection() {
}


var pool;
Connection.prototype.init = function () {
    pool = mysql.createPool(mysql_config);
};

Connection.prototype.closeConnection = function (connection) {
    connection.end();
};

function currentTime() {
    return Math.round((new Date().getTime()) / 1000);
}

function cb(err, result) {
    var val = result;
}


function handleDisconnect(callback, timeLimit) {

    pool.getConnection(function (err, connection) {
        if (err) {
            // error in getting db connection
            // reconnect after a time interval

            //console.log('could not get db connection. Re-connecting...');
            setTimeout(function () {
                if (currentTime() < timeLimit) {
                    handleDisconnect(callback, timeLimit);
                } else {
                    return callback(new Error('db error'));
                }
            }, 1000);
        } else {
            async.series([
                function (cb) {
                    connection.on('error', function (err) {
                        // utility.logEvent(err);
                        connection.destroy();
                        if (currentTime() < timeLimit) {
                            handleDisconnect(callback, timeLimit);
                        } else {
                            return callback(new Error('db error'));
                        }
                    });
                    cb(null, 2);
                },
                function (cb) {
                    return callback(null, connection);
                    cb(null, 4);
                }
            ]);
        }
    });
}

function getConnection(callback) {
    handleDisconnect(callback,
        currentTime() + EXPIRY_TIME_LIMIT
    );
}


Connection.prototype.executeQuery = function (query,parameters,callback) {
    getConnection(function (err, connection) {
        console.log(err)
        console.log(query)
        connection.query(query,parameters,function (err, rows) {
            connection.release();
            if (err) {
                throw err;
            }

            callback(err,rows);
        });
    });

};

//exports.Connection = Connection;
module.exports = Connection;