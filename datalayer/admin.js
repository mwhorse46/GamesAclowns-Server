/**
 * Created by anooj on 24/05/16.
 */
'use-strict'

var getConnection   =   require('../utils/mysql-connector');
exports.addImage    =   function (req, res) {
console.log(req.body)
    if(req.body.image && req.body.dialog && req.body.gender && req.user && req.user.adminid){

        var data    =   {
            image   :   req.body.image,
            gender  :   req.body.gender,
            dialogue:   req.body.dialog,
            fk_admin:   req.user.adminid
        };

        getConnection(function (err, Connector) {
            if(!err){
                Connector.query('insert into tbl_images set ?',data,function (err, status) {
                    if(!err){
                        res.send(status);
                    }else{
                        res.send(false);
                    }
                })

            }else{
                res.send(false)
            }
        })

    }else{
        res.send(false);
    }

};

exports.fetchgallery    =   function (req, res) {
    console.log("FETCGING")
    getConnection(function (err, Connector) {
        if(!err){
            Connector.query('SELECT images.*,tbl_admin.username FROM tbl_images as images LEFT JOIN tbl_admin ON images.fk_admin=tbl_admin.adminid',function (err, status) {
                if(!err){
console.log(status)
                    res.send('gallery',status);
                }else{
                    res.redirect("/angryadmin")
                }
            })

        }else{
            res.redirect("/angryadmin")
        }
    })

}