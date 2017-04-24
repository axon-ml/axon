"use strict";

var async = require('async');
var crypto = require('crypto');
 
var express = require('express');
var app = express();

var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require("fs");

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('schema/test.db');


app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());


// sql.setDialect('sqlite');

// mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

// db.serialize(function() {
//   db.run("CREATE TABLE lorem (info TEXT)");
 
//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();
 
// db.run("insert into users values ($val1, $val2)", { $val1 : "hi", $val2 : "15"}, 
//     function(err) { if(err) console.log("an error occurred"); });

// db.all("select * from users", function(err, rows) {
//     rows.forEach(function (row) { console.log(row); }); 
// }); 

// db.each("select * from users", function(err, row) {
//     console.log(row); 
// }); 

// db.close()

//JSON.stringify();
//response.status(400).send("string");  
//var numEntries = parseInt(request.query.limit); 
// var photoId = request.params.photo_id; 
//  var commentText = request.body.commentText; 
//  var userId = request.session.user_id; 
// request.session.destroy(function(err) { }); 
// request.session.login_name !== undefined


app.post('/admin/login', function(request, response) {
    
}); 

app.post('/admin/logout', function(request, response) {

}); 

app.post('/commentsOfPhoto/:photo_id', function(request, response) {
  
 
}); 

app.get('/activity', function(request, response) {
    
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


