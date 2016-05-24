/**
 * Created by anooj on 29/04/16.
 */

var mysql           =       require('mysql');
var config          =       require('./config');

var mysql_config    =       process.env.RUNNING_HOST==0 ? config.mysqlConfig : config.mysqlDevConfig;

//var pool            =       mysql.createPool(mysql_config);

var getConnection = function(callback) {
    // pool.getConnection(function(err, connection) {
    //
    //     callback(err, connection);
    // });
    var connection  =   mysql.createConnection(mysql_config,function (err, status) {
        console.log(status)
    });
    callback(false,connection)
};



module.exports = getConnection;