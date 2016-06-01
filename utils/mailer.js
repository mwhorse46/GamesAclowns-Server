/**
 * Created by anooj on 01/06/16.
 */

var config  =   require('./config');

exports.sendMail    =   function (data) {

    var smtpTransport = setUpSmtp();
    var mailOptions = {
        from: "BluewingsAdmin<" + config.MAIL_CONFIG.auth.user + ">", // sender address
        to: 'anooj1483@gmail.com,shyamparakashj06@gmail.com',
        subject: "AngryClownsEntertainment Bug", // Subject line
        text: "AngryClownsEntertainment Bug", // plaintext body
        html: ""+data

    };

    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            throw error;
        } else {

        }
    });


};
function setUpSmtp() {
    var nodeMailer = require("nodemailer");
    //var smtpTransportt = nodeMailer.createTransport("direct", {debug: true});
    var smtpTransport = nodeMailer.createTransport("SMTP", config.MAIL_CONFIG);
    return smtpTransport;
}