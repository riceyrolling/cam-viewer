var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    static = require('node-static'),
    file = new (static.Server)(__dirname);

// Import configuration file with user and password
const configFile = require('./config.json')

// Map config object to auth key value pair for hosts.
const auth = configFile.cameras.reduce(function ( cameraList, camera ) {
    cameraList[ camera.host ] = camera.auth;
    return cameraList;
}, {});

var proxy = httpProxy.createProxyServer({
    proxyTimeout: 5000,
    timout: 2000
});

proxy.on('error', function (err, req, res) {
    console.log('proxy error');
    console.log(err); console.log();
});

proxy.on('proxyReq', function (proxyReq, req, res, options) {
    authString = Buffer.from(auth[proxyReq.host].username + ":" + auth[proxyReq.host].password, 'utf8').toString('base64')
    proxyReq.setHeader('Authorization', 'Basic ' + authString);
});

proxy.on('proxyRes', function (proxyRes, req, res) {
    console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
  });

var server = http.createServer(function (req, res) {

    console.log("REQUEST TO",req.url)

    if (req.url.indexOf("http") == 0) { 
        // Proxy server request
        proxy.web(req, res, {
            target: req.url
        })
    } else {
        // Local file server request
        file.serve(req, res);
    }

});

console.log("listening on port 5050")
server.listen(5050);