var mysql=require('mysql2');
var util=require('util');

var conn=mysql.createConnection({
    host:'bsfw181ajez1hg3uquvl-mysql.services.clever-cloud.com',
    user:'uf9ccycrv1wiw2vz',
    password:'uOHCAuYdpPZX3bYfzPM0',
    database:'bsfw181ajez1hg3uquvl'
});

var exe=util.promisify(conn.query).bind(conn);

module.exports=exe;
