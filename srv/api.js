module.exports = function (app, callback) {
    var c9env = require('./c9env');
    c9env(function () {
        var mongodb = require('mongodb'),
            mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test',
            ObjectID = mongodb.ObjectID;

        mongodb.Db.connect(mongoUri + '?safe=true', function (err, db) {
            if (err) {
                console.log('Error connecting to MongoDB: ' + err);
                return;
            }
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

            callback(app);
        });
    });
};
