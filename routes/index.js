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
  storage: './database.sqlite'
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

router.get('/load',function(req,res){
    request({
          uri:"https://sheetdb.io/api/v1/ryt19gjxt8ph8",
          json:true
        },function(error, response, body){
        if(!error && response.statusCode ==200){
            if(body.length > 0) {
                Foos.sync({ force: true }).then(() => {
                    for(var i = 0; i < body.length;i++) {
                        Foos.create({
                            foo_store: body[i].foo_store,
                            foo_time: body[i].foo_time,
                            foo_type: body[i].foo_type,
                            foo_url: body[i].foo_url,
                        });
                    }
                });
            }
            res.json("load data ok");
        }else{
            console.log("[google doc] failed");
        }
    });
});

router.get('/webhook', function(req, res){
    Foos.findAll({}).
    then(function(result){
        res.json(result);   
    });   
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