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

    response.send({hello:world});

});

app.listen(8080,function(){
	console.log("Started on PORT 8080");
});
