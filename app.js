require('dotenv').config();
var express = require('express');
var path = require('path');
var request = require('request');

var app = express();
var apiUrl = process.env.API_URL;
var port = process.env.PORT;

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Pipe requests to api server
  app.use('/bin', function(req, res) {
    var url = req.url == '/' ? apiUrl : apiUrl + req.url;
    req.pipe(request(url)).pipe(res);
  });

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
