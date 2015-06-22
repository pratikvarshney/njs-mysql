var express = require('express');
var mysql = require('mysql');
var validator = require("email-validator");
var app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/public/forms/form.html');
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


  if(req.body.uname.toString().trim() == "")
  {
    res.send('Invalid Username');
    return;
  }
  if(!validator.validate(req.body.email.toString()))
  {
    res.send('Invalid Email');
    return;
  }

  res.write('Got a POST request from ' + req.body.uname.toString() + '\nemail : ' + req.body.email.toString());

  var query = "select * from userdata where username = '" + req.body.uname.toString() + "' or email = '" + req.body.email.toString() +"';";

  connection.query(query, function(err, rows, fields) {

    if (!err){
      console.log('Select Query Done.');
    }
    else{
      console.log('Error while performing Select Query.');
      connection.end();
      return;
    }

    if(rows.length>0)
    {
      res.write('\nUsername or email already exist');
      res.end();
      return;
    }

    var query = "select max(uid) as maxm from userdata;";
    connection.query(query, function(err, rows, fields) {

      if (!err){
        console.log('Select Query Done.');
      }
      else{
        console.log('Error while performing Select Query.');
        connection.end();
        return;
      }

      var uid = 0;
      if(rows.length>0)
      {
        uid = (Number(rows[0].maxm)+1);
      }
      var query = "INSERT INTO userdata VALUES ("+ uid +", '"+ req.body.uname.toString() +"', '"+ req.body.email.toString() + "');";
    
      connection.query(query, function(err, rows, fields) {
      connection.end();
      if (!err){
        console.log('Insert Query Done.');
      }
      else{
        console.log('Error while performing Insert Query.');
      }

      res.write('\nQuery done...');
      res.end();

      });

    });

  });



});

app.use(express.static('public'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});