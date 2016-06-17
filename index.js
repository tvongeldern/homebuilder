var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'contractor'
});

function database(endpoint, operation, construct){
    app.post(endpoint, function(request, response){
        var query = '';
        var data = request.body;

        query = construct(data);

        connection.query(query, function(err, rows){
            if (!err){
                response.send(operation == 'select' ? rows : {success: true});
            } else {
                response.send({error: err, query: query});
            }
        });

    });
};

app.get('/', function(request, response){
    response.sendFile('index.html');
});

database('/userdata', 'select', function(data){
    return "SELECT * FROM projects WHERE projectName='" + data.project + "'";
});

database('/createproject', 'insert', function(data){
    return "INSERT INTO projects (`projectName`, `projectAdmin`) VALUES ('" + data.project + "', '" + data.name + "')";
});

database('/projectdata', 'select', function(data){
    return "SELECT * FROM rooms WHERE project='" + data.project + "'";
});

database('/createroom', 'insert', function(data){
    return "INSERT INTO rooms (`roomName`, `project`) VALUES ('" + data.name + "', '" + data.project + "')";
});

database('/createitem', 'insert', function(data){
    return "INSERT INTO items (`itemName`, `itemBudget`, `itemRoom`, `itemProject`) VALUES ('" + data.name + "', " + data.budget + ", '" + data.room + "', '" + data.project + "')";
});

database('/getitems', 'select', function(data){
    return "SELECT * FROM items WHERE itemProject='" + data.project + "' AND itemRoom='" + data.room + "'";
});

database('/updateitem', 'update', function(data){
    return "UPDATE items SET `itemBudget`=" + data.itemBudget + ", `itemCost`=" + data.itemCost + ", `itemBuyer`=" + data.buyer + " WHERE `itemName`='" + data.itemName + "' AND `itemRoom`='" + data.itemRoom + "' AND `itemProject`='" + data.itemProject + "'";
});

database('/getbudget', 'select', function(data){
    return "SELECT itemBudget, itemCost, itemRoom FROM items WHERE itemProject='" + data.project + "'";
});

database('/deleteitem', 'delete', function(data){
    return "DELETE FROM items WHERE `itemProject`='" + data.itemProject + "' AND `itemRoom`='" + data.itemRoom + "' AND `itemName`='" + data.itemName + "'";
});

app.listen(8080,function(){
	console.log("Started on PORT 8080");
});
