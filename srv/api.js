module.exports = function (app, callback) {
    var c9env = require('./c9env');
    c9env(function () {
        var mongodb = require('mongodb'),
            mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test',
            ObjectID = mongodb.ObjectID,
            fs = require('fs'),
            validator = require('JSV').JSV.createEnvironment(),
            schemaMap = {
                'project': {}
            };

        function checkSchema(object, schema, callback) {
            var report = validator.validate(object, schema),
                valid = (report.errors.length === 0);

            callback(valid);
        }

        mongodb.Db.connect(mongoUri + '?safe=true', function (err, db) {
            if (err) {
                console.log('Error connecting to MongoDB: ' + err);
                return;
            }
            console.log('Connected to MongoDB at ' + mongoUri);

            for (schema in schemaMap) {
                var schemaPath = __dirname + '/../schemas/' + schema + '.json';

                fs.readFile(schemaPath, 'utf8', function (err, data) {
                    schemaMap[schema] = JSON.parse(data);
                });
            }

            app.all('/api/:object/*?', function (req, res, next) {
                res.contentType('json');
                if (!!schemaMap[req.params.object]) {
                    next();
                } else {
                    res.send(req.params.object + " is not a valid object type");
                }
            });

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

            app.delete('/api/:object/:id', function ( req, res ) {
                var object_map = { _id: ObjectID( req.params.id ) };

                db.collection( req.params.object , function ( err, collection ) {
                    var options_map = { safe: true, single: true };
      
                    collection.remove( object_map, options_map, 
                        function ( err, result ) {
                            res.send( result );
                        });
                });
            });

            //console.log(app.routes);

            callback(app);
        });
    });
};
