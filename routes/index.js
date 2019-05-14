var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/webhook', function(req, res){
    res.json({fulfillmentText:"test bot"});   
});


router.post('/webhook', function(req, res){
    var data = req.body;
    //let queryDate = data.queryResult.parameters.date;
    //let queryCity = data.queryResult.parameters["geo-city"];
    console.dir(data);
    console.log("connect me");
    res.json({fulfillmentText:"test bot"});
      
});










module.exports = router;
