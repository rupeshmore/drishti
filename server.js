var config   = require('./config.json'),
    compress = require('compression'),
    fs       = require('fs'),
    path     = require('path'),
    express  = require('express')

function die(msg){
    console.log(msg);
    process.exit(1);
}

var app = new (require('express'))();
app.use(compress());

var port = process.env.PORT || config.port;
var url = process.env.url || config.url;

console.log('port: ' + port);
console.log('url: ' + url);

if (url.indexOf('http') == 0){
    url = url.replace(/^.*\/\//, '');
}
var parts = url.match(/^([^\/]+)(.*)$/);
if (parts === null){
    die('Invalid URL supplied: ' + url);
}

var drishti = process.env.file || config.file || 'js/lib/drishti.js'

app.get("/", function(req, res) {

    // Have we got a cached version of the feed?
    try {
        fs.access(path.join(__dirname, drishti), fs.F_OK, function(err) {
            if (!err) {
                res.setHeader('Content-Type', 'application/json');
                res.header('Access-Control-Allow-Origin', '*');

                fs.readFile(path.join(__dirname, drishti), function(err, data){
                    res.end(data);
                });

            } else {
            }
        });
    } catch(e) {
        polling.then(function(){
            res.setHeader('Content-Type', 'application/json');
            res.header('Access-Control-Allow-Origin', '*');
            res.sendFile(path.join(__dirname, 'data/_json.json'));
            res.end();
        }, function(e){
            die('Invalid response: ' + e);
        });
    }

})

app.get("/healthcheck", function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end('alive');
})

app.listen(port, function(error) {
    if (error) {
      console.error(error)
    } else {
      console.info("==> 🌎  Listening on port %s.", port)
    }
})
