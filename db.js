var mysql=require('mysql2');
var util=require('util');

var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Root',
    database:'dental'
});

var exe=util.promisify(conn.query).bind(conn);

module.exports=exe;