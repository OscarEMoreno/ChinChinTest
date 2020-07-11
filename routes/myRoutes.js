var express = require('express');
var router = express.Router();
const myController = require('../controllers/myController');


router
  .route('/getCoinsRate')    // get Coins current rates based in USD
  .get(myController.getCoins);
router
  .route('/fillCoinsRate') // manually fill coins value
  .post(myController.fillCoins);

router
  .route('/deleteCoinsRate') // delete rates
  .delete(myController.deleteCoins);

module.exports = router;
