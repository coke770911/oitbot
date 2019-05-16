var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const Sequelize = require('sequelize');

/*
//看OS決定DB路徑
const isWin = process.platform;
var dbPath = '';
if( isWin === 'win32') {
    dbPath = './database.sqlite';
} else {
    dbPath = '../database.sqlite';
}
*/
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
    foo_store: Sequelize.STRING,
    foo_time: Sequelize.STRING,
    foo_keyword: Sequelize.TEXT,
    foo_url: Sequelize.STRING,
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
                            foo_keyword: body[i].foo_keyword,
                            foo_url: body[i].foo_url,
                        });
                    }
                });
            }
            res.json("load data ok");
        }else{
            console.log("[google sheet] failed");
        }
    });
});

router.get('/webhook', function(req, res){
    var foo_keyword = req.query.foo_keyword ? req.query.foo_keyword : 1;
    var foo_time = req.query.foo_time ? req.query.foo_time : 1;
    var Op = Sequelize.Op
    
    Foos.findAll({
        where: {
            [Op.or]: [
                {foo_keyword: { [Op.substring]: foo_keyword }},
                {'': { [Op.eq]: foo_keyword }}
            ],
            [Op.and]: {
                [Op.or]: [
                    {foo_time: { [Op.substring]: foo_time }},
                    {'': { [Op.eq]: foo_time }}
                ]
            }          
        }
    })
    .then(function(result){
        res.json(result);
    });    
});

router.post('/webhook', function(req, res){
    var data = req.body;
    var foo_keyword = data.queryResult.parameters["foo_keyword"];
    var foo_time = data.queryResult.parameters["foo_time"] ;
    foo_time = foo_time === '' ? foo_time : 1;
    var Op = Sequelize.Op

    Foos.findAll({
        where: {
            foo_keyword: {
                [Op.substring]: foo_keyword
            } ,
            [Op.or]: [
                {foo_time: {[Op.substring]: foo_time}},
                {'': {[Op.eq]: foo_time}}
            ]            
        }
    })
    .then(function(result){
        var index_num = Math.floor(Math.random()*result.length);
        if( result.length > 0) {
            res.json({fulfillmentText:"推薦您吃 " + result[index_num].foo_store + result[index_num].foo_url +" 希望您滿意!"});    
        } else {
            res.json({fulfillmentText:"您想吃的東西找不到，請再試試看別的關鍵字。"});    
        } 
    });   
});

module.exports = router;