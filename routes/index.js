var express = require('express');
var router = express.Router();
var request = require('request');

const Sequelize = require('sequelize');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database.sqlite'
});


const Model = Sequelize.Model;

class Foos extends Model {}
Foos.init({
    foo_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    foo_store: Sequelize.TEXT,
    foo_time: Sequelize.TEXT,
    foo_type: Sequelize.TEXT,
    foo_url: Sequelize.TEXT,
    foo_count: { 
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    foo_del: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }

}, { sequelize, modelName: 'Foos' });

Foos.sync().then(() => {
  return Foos.create({
    foo_store: '粩泰泰 泰味料理',
    foo_time: '午餐,晚餐',
    foo_type: '飯,麵',
    foo_url: 'https://goo.gl/maps/4qypquJYS3Cy8ema9',
  });
});


router.get('/webhook', function(req, res){
    console.dir(Foos.findAll({attributes: ['foo_store', 'foo_url']}));
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