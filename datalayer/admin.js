/**
 * Created by anooj on 24/05/16.
 */
'use-strict'

var getConnection   =   require('../utils/mysql-connector');
exports.addImage    =   function (req, res) {
console.log(req.body)
    if(req.body.image && req.body.dialog && req.body.gender){

        var data    =   {
            image   :   req.body.image,
            gender  :   req.body.gender,
            dialogue:   req.body.dialog
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