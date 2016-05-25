var facebook = require('./facebook');
var getConnection   =   require('../utils/mysql-connector');
//var User = require('../models/user');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {

        var bkp_id  =   id;
        if(id != null && id != undefined && id.userid != undefined){
            id  =   id.userid;
        }
        console.log("Deserializing");
        console.log(id);
        getConnection(function (err, Connector) {
           Connector.query('select * from tbl_user where userid = ?',[id],function (err, user) {
               if(!err && user != null && user.length > 0)
                   done(null,user[0]);
               else {

                   done(null, bkp_id);
               }
           })
        });

    });

    facebook(passport);

};