var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    static = require('node-static');

var file = new (static.Server)(__dirname);

// Import configuration file with user and password
const auth = require('./config.json');
const authString = Buffer.from(auth.user + ":" + auth.password, 'utf8').toString('base64')

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({
    proxyTimeout: 5000,
    timout: 2000
});

proxy.on('error', function (err, req, res) {
    console.log('proxy error');
    console.log(err); console.log();
});

proxy.on('proxyReq', function (proxyReq, req, res, options) {
    proxyReq.setHeader('Authorization', 'Basic ' + authString);
});

var server = http.createServer(function (req, res) {

    console.log(req.url)
    if (req.url.indexOf("http") == 0) {
        proxy.web(req, res, {
            target: req.url
        })
    } else {
        file.serve(req, res);
    }

});

console.log("listening on port 5050")
server.listen(5050);