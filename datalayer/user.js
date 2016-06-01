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
            //if(!err && choices != null && choices.length > 0){
                // var choiceid    =   choices[0].pk_choiceid;
                // sqlExecuteQueryHelper.executeQuery('update tbl_user_choices set ? where pk_choiceid = ?',[userInfo,choiceid],function (err, choiceupdate) {
                //
                //     sqlExecuteQueryHelper.executeQuery('select * from tbl_user_choices where userid = ?',[userInfo.userid],function (err, choices) {
                //         callback(err,choices[0]);
                //     });
                //
                // })
                sqlExecuteQueryHelper.executeQuery('insert into tbl_user_choices set ?',[userInfo],function (err, choiceupdate) {
                    console.log(choiceupdate)

                    //TODO: GET CHOICE ID, ADD TO TEMPORARY LIST

                    var temp_info   =   {
                        userid      :userInfo.userid,
                        choiceid    :choiceupdate.insertId
                    };
                    sqlExecuteQueryHelper.executeQuery("insert into tbl_temp_choices set ?",[temp_info],function (err, tempinfo) {

                        sqlExecuteQueryHelper.executeQuery('select * from tbl_user_choices where userid = ? and pk_choiceid = ?', [userInfo.userid, choiceupdate.insertId], function (err, choices) {
                            callback(err, choices[0]);
                        });
                    });
                });

            // }else{
            //     sqlExecuteQueryHelper.executeQuery('insert into tbl_user_choices set ?',[userInfo],function (err, choiceupdate) {
            //         console.log(choiceupdate)
            //         sqlExecuteQueryHelper.executeQuery('select * from tbl_user_choices where userid = ? and pk_choiceid = ?',[userInfo.userid,choiceupdate.insertId],function (err, choices) {
            //             callback(err,choices[0]);
            //         });
            //     })
            // }
        });
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
};

exports.removetempchoices   =   function (selectedinfo) {
console.log(selectedinfo);
    sqlExecuteQueryHelper.executeQuery("select * from tbl_temp_choices where userid = ? and choiceid != ?",
        [selectedinfo.userid,selectedinfo.choiceid],function (err, status) {
console.log(status)
            var path = require('path');
            var fs  =   require('fs');
            for(var i in status) {
                var newPath = path.dirname(__dirname) + "/public/images/user/"+status[i].userid+"_"+status[i].choiceid+".png";
                console.log(newPath)
                fs.unlink(newPath);

            }
            sqlExecuteQueryHelper.executeQuery("delete from tbl_temp_choices where userid = ? and choiceid != ?",[selectedinfo.userid,selectedinfo.choiceid],
            function (err, status) {
                console.log(status)
            })
        });
};