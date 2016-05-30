/**
 * Created by anooj on 24/05/16.
 */
'use-strict'

//var getConnection   =   require('../utils/mysql-connector');
var sqlExecuteQueryHelper = require('../utils/mysqlConnection');
var sqlExecuteQueryHelper = new sqlExecuteQueryHelper();

exports.fetchImage    =   function (gender,callback) {

    //getConnection(function (err, Connector) {
    sqlExecuteQueryHelper.executeQuery('select * from tbl_images where gender = ? ORDER BY RAND() LIMIT 0,1',gender,function (err, image) {
            if(!err && image != null && image.length > 0){
                callback(image[0])
            }else {
                callback(false);
            }

        })
    //})
};

exports.addChoice   =   function (userInfo, callback) {

    //getConnection(function (err, Connector) {
    sqlExecuteQueryHelper.executeQuery('select * from tbl_user_choices where userid = ?',[userInfo.userid],function (err, choices) {
            if(!err && choices != null && choices.length > 0){
                var choiceid    =   choices[0].pk_choiceid;
                sqlExecuteQueryHelper.executeQuery('update tbl_user_choices set ? where pk_choiceid = ?',[userInfo,choiceid],function (err, choiceupdate) {

                    sqlExecuteQueryHelper.executeQuery('select * from tbl_user_choices where userid = ?',[userInfo.userid],function (err, choices) {
                        callback(err,choices[0]);
                    });

                })
            }else{
                sqlExecuteQueryHelper.executeQuery('insert into tbl_user_choices set ?',[userInfo],function (err, choiceupdate) {
                    sqlExecuteQueryHelper.executeQuery('select * from tbl_user_choices where userid = ?',[userInfo.userid],function (err, choices) {
                        callback(err,choices[0]);
                    });
                })
            }
        })
    //})
};

exports.getchoice   =   function (userinfo, callback) {
    //getConnection(function (err,Connector) {

        var choice  =   userinfo.choiceid;
        var userid  =   userinfo.userid;

    sqlExecuteQueryHelper.executeQuery('SELECT *,tbl_user.image as userimage,tbl_images.image as charimage FROM tbl_user_choices LEFT JOIN tbl_images on tbl_images.pk_imgid=tbl_user_choices.imageid LEFT JOIN tbl_user on tbl_user_choices.userid=tbl_user.userid where tbl_user_choices.userid = ? and tbl_user_choices.pk_choiceid = ?',
        [userid,choice],function (err, choice) {

                if(!err && choice != null && choice.length > 0)
                    callback(err,choice[0]);
                else
                    callback(true,false);
        })
    //})
}