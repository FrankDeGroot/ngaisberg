var app = require('./app'),
    api = require('./api'),
    ip = process.env.IP || '127.0.0.1',
    port = process.env.PORT || 8000;

api(app, function () {
    app.listen(port, function () {
        console.log('Server running at http://' + ip + ':' + port + '/');
    });
});
