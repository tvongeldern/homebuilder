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

var endpoint = {
    dbPut: function(endpoint, construct){
        app.post(endpoint, function(request, response){
            var query = '';
            var data = request.body;

            query = construct(data);

            connection.query(query, function(err){
                if (!err){
                    response.send({success: true});
                } else {
                    response.send({error: err, query: query});
                }
            });

        });
    },
    dbGet: function(endpoint, construct){
        app.post(endpoint, function(request, response){
            var query = '';
            var data = request.body;

            query = construct(data);

            connection.query(query, function(err, rows){
                if (!err){
                    response.send(rows);
                } else {
                    response.send({error: err, query: query});
                }
            });
        });
    }
};

app.get('/', function(request, response){
    response.sendFile('index.html');
});

endpoint.dbGet('/userdata', function(data){
    return "SELECT * FROM projects WHERE projectName='" + data.project + "'";
});

endpoint.dbPut('/createproject', function(data){
    return "INSERT INTO projects (`projectName`, `projectAdmin`) VALUES ('" + data.project + "', '" + data.name + "')";
});

endpoint.dbGet('/projectdata', function(data){
    return "SELECT * FROM rooms WHERE project='" + data.project + "'";
});

endpoint.dbPut('/createroom', function(data){
    return "INSERT INTO rooms (`roomName`, `project`) VALUES ('" + data.name + "', '" + data.project + "')";
});

endpoint.dbPut('/createitem', function(data){
    return "INSERT INTO items (`itemName`, `itemBudget`, `itemRoom`, `itemProject`) VALUES ('" + data.name + "', " + data.budget + ", '" + data.room + "', '" + data.project + "')";
});

endpoint.dbGet('/getitems', function(data){
    return "SELECT * FROM items WHERE itemProject='" + data.project + "' AND itemRoom='" + data.room + "'";
});

endpoint.dbPut('/updateitem', function(data){
    return "UPDATE items SET `itemBudget`=" + data.itemBudget + ", `itemCost`=" + data.itemCost + ", `itemBuyer`=" + data.buyer + " WHERE `itemName`='" + data.itemName + "' AND `itemRoom`='" + data.itemRoom + "' AND `itemProject`='" + data.itemProject + "'";
});

endpoint.dbGet('/getbudget', function(data){
    return "SELECT itemBudget, itemCost, itemRoom FROM items WHERE itemProject='" + data.project + "'";
});

endpoint.dbPut('/deleteitem', function(data){
    return "DELETE FROM items WHERE `itemProject`='" + data.itemProject + "' AND `itemRoom`='" + data.itemRoom + "' AND `itemName`='" + data.itemName + "'";
});

app.listen(8080,function(){
	console.log("Started on PORT 8080");
});
