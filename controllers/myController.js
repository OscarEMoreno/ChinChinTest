
const pg = require('pg');
var request = require('request');
var Bitcoin = 0;
var Dash = 0;
var Ethereum = 0;
var Petro = 60;
var Bs = 1/100000;
var PetroBs = 0;
var Euro = 0;
var pool;

var database = "CoinDB";


function ConnectionDB () {
    pool = new pg.Pool({
        user: "postgres",
        host: "127.0.0.1",
        database: "CoinDB",
        password: "admin",
        port: "5432"});
}

function getRates() {

    
    var ratesURL = "http://api.coinlayer.com/api/live?access_key=808f10e8575521ad9c2c9b5dcefdb324";
    var ratesURL2 = "https://api.exchangeratesapi.io/latest?base=USD";
    var ratesURL3 = "https://petroapp-price.petro.gob.ve/price/";
    var Obj = { "coins": ["PTR"], "fiats": ["USD", "Bs"]};
    var rates = [Bitcoin,Ethereum,Dash,Euro,Petro,PetroBs];

    return new Promise((resolve) => {

        request(ratesURL, (error, response, body) => {
            var data = JSON.parse(body);
            Bitcoin = data.rates.BTC;
            Ethereum = data.rates.ETH;
            Dash = data.rates.DASH;
            request(ratesURL2, (error, response, body) => {
                var data = JSON.parse(body);
                Euro = data.rates.EUR;                
                request.post({
                    url: ratesURL3,
                    form: Obj
                 }
                   ,(error, response, body) => {  // can be optimized with async await
                    var data2 = JSON.parse(body);
                    Petro = data2.data.PTR.USD;
                    PetroBs = data2.data.PTR.BS;
                    rates = [Bitcoin,Ethereum,Dash,Euro,Petro,PetroBs];
                    resolve(rates);
                 });

            });

        });
        

    });


}


exports.getCoins = function(req, response) {
    //
    getRates().then(rates => {
        console.log(rates);
        console.log("Finished updating coins");
        if (PetroBs && Petro) {Bs = Petro/PetroBs;}
        //console.log(Bs);
        var Insert = "INSERT INTO coins (btc,eth,dash,ptr,bs,euro) VALUES ("+Bitcoin+","+Ethereum+","+Dash+","+Petro+","+Bs+","+Euro+")";
        ConnectionDB();
        pool.query(Insert, (err, res) => {
            console.log (err,res);
            //pool.end();
        })
        response.status(200).json({status: 200, message: "Done"}); //Status needs to be verified for errors, this is a placeholder
    });
    
};




exports.fillCoins = function(req, response) {
    Bitcoin = req.body.btc;
    Ethereum = req.body.eth;
    Dash = req.body.dash;
    Petro = req.body.petro;
    Bs = req.body.bs;
    Euro = req.body.euro;

    var Modify = "INSERT INTO coins (btc,eth,dash,ptr,bs,euro) VALUES ("+Bitcoin+","+Ethereum+","+Dash+","+Petro+","+Bs+","+Euro+")";
    ConnectionDB();
    pool.query(Modify, (err, res) => {
            console.log (err,res);
            //pool.end();
        });
    
    response.status(200).json({status: 200, message: "Done"});
};

exports.xChange = function(req, response) {
    var Amount = req.body.amount;
    var Currency = req.body.currency;
    var Dollar_ref;
    var get_last = "SELECT * FROM coins ORDER BY id DESC LIMIT 1";
    ConnectionDB();
    pool.query(get_last, (err, res) => {
            


            // input must be sanitized
            if (Currency === "usd") {Dollar_ref = Amount;}
            else{
             // currencies  {"btc","eth", "usd", "euro", "ptr", "bs", "dash"};
                Dollar_ref = Amount*res["rows"][0][Currency]; // get the reference in USD dollars
            } 
            console.log (Amount + " in " + Currency);
            response.status(200).json(
            {   usd: Dollar_ref, 
                eur: (Dollar_ref/res["rows"][0]["euro"]),
                bs: (Dollar_ref/res["rows"][0]["bs"]),
                btc: (Dollar_ref/res["rows"][0]["btc"]),
                eth: (Dollar_ref/res["rows"][0]["eth"]),
                dash: (Dollar_ref/res["rows"][0]["dash"]),
                ptr: (Dollar_ref/res["rows"][0]["ptr"]),

            }); 
            //pool.end();

        });
    
    
};


exports.deleteCoins = function(req, response) {
    
    ConnectionDB();
    var truncate = "TRUNCATE TABLE coins";
    pool.query(truncate, (err, res) => {
                console.log (err,res);
                //pool.end();
            });
    response.status(200).json({status: 200, message: "Done"}); //
};
