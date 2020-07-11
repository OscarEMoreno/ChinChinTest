var moment = require('moment');
var pg = require('pg');
var request = require('request');
var Bitcoin = 0;
var Dash = 0;
var Ethereum = 0;
var Petro = 60;
var Bs = 1/100000;
var PetroBs = 0;
var Euro = 0;

database = "CoinDB";
var pool; 

//createdAt: moment().unix(),
// expiresAt: moment().add(1,'day').unix()

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


exports.getCoins = function(req, res) {
    //
    //var Select = 'INSERT INTO users(id, firstName, lastName) VALUES(1, ‘Shahriar’, ‘Shovon’)
    
    getRates().then(rates => {
        console.log(rates);
        console.log("Finished updating coins");
        if (PetroBs && Petro) {Bs = Petro/PetroBs;}
        console.log(Bs);

        ConnectionDB();
        var Insert = 'INSERT INTO '+database+'.Coins(btc,eth,dash,ptr,bs,euro,added_at) VALUES (Bitcoin,Ethereum,Dash,Petro,Bs,Euro,?)';
        console.log(moment().unix());
        res.status(200).json({status: 200, message: "Done"});
    });
    
};






exports.fillCoins = function(req, res) {
    
};



exports.updateCoins = function(req, res) {
    
};


exports.deleteCoins = function(req, res) {
    
};
