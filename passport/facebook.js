var FacebookStrategy = require('passport-facebook').Strategy;
//var User = require('../models/user');
var getConnection   =   require('../utils/mysql-connector')

var host    =   process.env.RUNNING_HOST;
if(host == 1)
    var fbConfig = require('../fb.js');
else
    var fbConfig = require('../fb_local.js');

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl,
		profileFields: ["id", "email", "first_name", "gender", "last_name","picture.type(large)"]
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {

    	console.log('profile', profile);

		// asynchronous
		process.nextTick(function() {


            getConnection(function (err, Connector) {
                if(!err){
                    Connector.query("select * from tbl_user where userid = ?",[profile.id],function (err, userInfo) {
                        console.log(err);
                        console.log(userInfo);

                        if(err){
                            return done(err);
                        }
                        if(!err && userInfo != null && userInfo != undefined && userInfo.length > 0){

                            var user =   userInfo[0];
                            //return done(null,user);

                            var gender_ =   profile.gender=='male' ? 1:0;
                            var email_  =   "";
                            var photos_ =   "";

                            if(profile.emails != undefined){
                                if(profile.emails[0] != null
                                    && profile.emails[0] != undefined
                                    && profile.emails[0].value != undefined) {
                                    email_ = profile.emails[0].value
                                }
                            }

                            if(profile.photos != undefined){
                                if(profile.photos[0] != null
                                    && profile.photos[0] != undefined
                                    && profile.photos[0].value != undefined) {
                                    photos_ = profile.photos[0].value
                                }
                            }

                            var userInfo    =   {
                                name    :   profile.name.givenName,
                                emailid :   email_,
                                gender  :   gender_,
                                image   :   photos_,
                                token   :   access_token
                            };
                            Connector.query("update tbl_user set ? where userid = ?",[userInfo,user.userid],function (err, userstatus) {
                                if(err){
                                    throw err;
                                }else{
                                    Connector.query('select * from tbl_user where userid = ?',[user.userid],function (err, userData) {
                                        return done(null,userData[0]);
                                    })
                                }
                            });


                        }else{

                            var gender_ =   profile.gender=='male' ? 1:0;
                            var email_  =   "";
                            var photos_ =   "";

                            if(profile.emails != undefined){
                                if(profile.emails[0] != null
                                    && profile.emails[0] != undefined
                                    && profile.emails[0].value != undefined) {
                                    email_ = profile.emails[0].value
                                }
                            }

                            if(profile.photos != undefined){
                                if(profile.photos[0] != null
                                    && profile.photos[0] != undefined
                                    && profile.photos[0].value != undefined) {
                                    photos_ = profile.photos[0].value
                                }
                            }

                            var user    =   {
                                userid  :   profile.id,
                                name    :   profile.name.givenName,
                                emailid :   email_,
                                gender  :   gender_,
                                image   :   photos_,
                                token   :   access_token
                            };
                            Connector.query("insert into tbl_user set ?",user,function (err, userstatus) {
                                if(err){
                                    throw err;
                                }else{
                                    Connector.query('select * from tbl_user where userid = ?',[profile.id],function (err, userData) {
                                        return done(null,userData[0]);
                                    })
                                }
                            });
                        }
                    })
                }
            });

        });

    }));

};
