var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'contractor'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', function(request, response){
    response.sendFile('index.html');
});

app.post('/userdata', function(request, response){

    var project = request.body.project;
    var name = request.body.name;

    var query = "SELECT * FROM projects WHERE projectName='" + project + "'";

    connection.query(query, function(err, rows){

        if (!err){
            response.send(rows);
        } else {
            response.send({error: err, query: query});
        }

    });

});

app.post('/createproject', function(request, response){

    var name = request.body.name;
    var project = request.body.project;

    var query = "INSERT INTO projects (`projectName`, `projectAdmin`) VALUES ('" + project + "', '" + name + "')";

    connection.query(query, function(err){
        if (!err){
            response.send({success: true});
        } else {
            response.send({error: err, query: query});
        }
    });

});

app.post('/projectdata', function(request, response){

    var project = request.body.project;

    var query = "SELECT * FROM rooms WHERE project='" + project + "'";

    connection.query(query, function(err, rows){
        if (!err){
            response.send(rows);
        } else {
            response.send({error: err, query: query});
        }
    });

});

app.post('/createroom', function(request, response){

    var project = request.body.project;
    var roomName = request.body.name;

    var query = "INSERT INTO rooms (`roomName`, `project`) VALUES ('" + roomName + "', '" + project + "')";

    connection.query(query, function(err, rows){
        if (!err){
            response.send({success: true});
        } else {
            response.send({error: err, query: query});
        }
    });

});

app.post('/createitem', function(request, response){

    var name = request.body.name;
    var budget = request.body.budget;
    var room = request.body.room;
    var project = request.body.project;

    var query = "INSERT INTO items (`itemName`, `itemBudget`, `itemRoom`, `itemProject`) VALUES ('" + name + "', " + budget + ", '" + room + "', '" + project + "')";

    connection.query(query, function (err){

        if (!err){
            response.send({success: true});
        } else {
            response.send({error: err, query: query});
        }

    });

});

app.post('/getitems', function(request, response){

    var project = request.body.project;
    var room = request.body.room;

    var query = "SELECT * FROM items WHERE itemProject='" + project + "' AND itemRoom='" + room + "'";

    connection.query(query, function(err, rows){
        if (!err){
            response.send(rows);
        } else {
            response.send({error: err, query: query});
        }
    });

});

app.post('/updateitem', function(request, response){

    var item = request.body;

    var query = "UPDATE items SET `itemBudget`=" + item.itemBudget + ", `itemCost`=" + item.itemCost + ", `itemBuyer`=" + item.buyer + " WHERE `itemName`='" + item.itemName + "' AND `itemRoom`='" + item.itemRoom + "' AND `itemProject`='" + item.itemProject + "'";

    connection.query(query, function(err){
        if (!err){
            response.send({success: true});
        } else {
            response.send({error: err, query: query});
        }
    });

});

app.post('/getbudget', function(request, response){

    var project = request.body.project;

    var query = "SELECT itemBudget, itemCost, itemRoom FROM items WHERE itemProject='" + project + "'";

    connection.query(query, function(err, rows){
        if (!err){
            response.send(rows);
        } else {
            response.send({error: err, query: query});
        }
    });

});

app.listen(8080,function(){
	console.log("Started on PORT 8080");
});
