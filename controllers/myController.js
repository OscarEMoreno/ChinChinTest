var moment = require('moment');
var pg = require('pg');
database = "CoinDB";
var pool  = new pg.Pool({
        user: "postgres",
        host: "127.0.0.1",
        database: "CoinDB",
        password: "admin",
        port: "5432"});


//createdAt: moment().unix(),
// expiresAt: moment().add(1,'day').unix()



exports.getCoins = function(req, res) {
    var Insert = 'INSERT INTO '+database+'.Coins(btc,eth,dash,ptr,bs,euro,added_at) VALUES (?,?,?,?,?,?,?)';
    var Select = 'SELECT * FROM '+database+'.usuarios';
    
    pool.end();
};


exports.fillCoins = function(req, res) {
    
};



exports.updateCoins = function(req, res) {
    
};


exports.deleteCoins = function(req, res) {
    
};
