/**
 * Created by anooj on 29/04/16.
 */

exports.runningHost     =   process.env.RUNNING_HOST==0 ? "http://localhost:8000":"http://ec2-52-34-214-90.us-west-2.compute.amazonaws.com";

exports.mysqlConfig     =   {
    host        :   '127.0.0.1',
    port        :   '3306',
    user        :   'root',
    password    :   'root',
    database    :   "angryclowns"
};

exports.mysqlDevConfig     =   {
    host        :   'localhost',
    user        :   'root',
    password    :   'qaswlopk',
    database    :   "angryclowns"
};

exports.items_per_page  =   10;