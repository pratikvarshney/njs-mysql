var express = require('express');
var mysql = require('mysql');
var app = express();

app.get('/', function (req, res) {
  res.send('Click submit to post <form method="post"><input type="submit" value="submit" /></form>');
});

//parser
var bodyParser = require('body-parser');

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser());

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'pass',
  database : 'emaildb'
  });

  connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... \n\n"); 
  } else {
      console.log("Error connecting database ... \n\n");
  }
  });

// accept POST request on the homepage
app.post('/', function (req, res) {

  res.send('Got a POST request from ' + req.body.uname.toString() + '<br>email : ' + req.body.email.toString());

  connection.query('INSERT INTO userdata VALUES (1, \''+ req.body.uname.toString() +'\', \'' + req.body.email.toString() + '\');', function(err, rows, fields) {
  connection.end();
  if (!err){
    console.log('The solution is: ', rows);
  }
  else{
    console.log('Error while performing Query.');
  }

  });



});

app.use(express.static('public'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});