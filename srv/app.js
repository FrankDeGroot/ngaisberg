var express = require('express'),
    app = express(express.logger()),
    appDir = __dirname + '/../app';

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.static(appDir));
    app.get('/', function (req, res) {
        res.sendfile(appDir + '/index.html');
    });
});

module.exports = app;