var express = require('express'),
    mongodb = require("mongodb"),
    app = express(express.logger()),
    mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test',
    ip = process.env.IP || '127.0.0.1',
    port = process.env.PORT || 3000,
    appDir = __dirname + '/../app';

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.static(appDir));
});

mongodb.Db.connect(mongoUri + "?safe=true", function (err, db) {
    console.log('Connected to MongoDB at ' + mongoUri);

    app.get('/api/:object', function (req, res) {
        db.collection(req.params.object, function (err, collection) {
            collection.find().toArray(
                function (err, result) {
                    res.send(result);
                }
            );
        });
    });

    app.get('/api/:object/:id', function (req, res) {
        var object_map = { _id: ObjectID(req.params.id) };

        db.collection(req.params.object, function (err, collection) {
            collection.findOne(object_map, function (err, result) {
                res.send(result);
            });
        });
    });

    app.post('/api/:object', function (req, res) {
        console.log(req.body);
        db.collection(req.params.object, function (err, collection) {
            collection.insert(req.body, { safe: true }, function (err, result) {
                res.send(result);
            });
        });
    });

    app.get('/', function (req, res) {
        res.sendfile(appDir + '/index.html');
    });

    app.listen(port, function () {
        console.log('Server running at http://' + ip + ':' + port + '/');
    });
});
