var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', function(request, response){
    response.sendFile('index.html');
});

// app.get('/angular', function(request, response){
//     response.sendFile('angular.js');
// });

app.post('/data-endpoint', function(request, response){

    response.send({message: "HELLO THERE WORLD!"});

});

app.listen(8080,function(){
	console.log("Started on PORT 8080");
});
