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

            var update = function (req, res) {
                var find_map = { _id: ObjectID(req.params.id) },
                    object_map = req.body;

                db.collection(req.params.object, function (err, collection) {
                    var sort_order = [],
                        options_map = { new: true, upsert: false, safe: true };

                    collection.findAndModify(find_map, sort_order, object_map, options_map,
                        function (err, result) {
                            res.send(result);
                        });
                });
            };

            app.put('/api/:object/:id', update);

            app.post('/api/:object/:id', update);

            app.delete('api/:object/:id', function ( req, res ) {
                var object_map = { _id: ObjectID( req.params.id ) };

                db.collection( req.params.object , function ( err, collection ) {
                    var options_map = { safe: true, single: true };
      
                    collection.remove( object_map, options_map, 
                        function ( err, result ) {
                            res.send( result );
                        });
                });
            });

            callback(app);
        });
    });
};
