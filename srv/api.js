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
        
        function readSchema() {
            var schema;
            
            for (schema in schemaMap) {
                var schemaPath = __dirname + '/../schemas/' + schema + '.json';

                fs.readFile(schemaPath, 'utf8', function (err, data) {
                    schemaMap[schema] = JSON.parse(data);
                });
            }
        }

        mongodb.Db.connect(mongoUri + '?safe=true', function (err, db) {
            if (err) {
                console.log('Error connecting to MongoDB: ' + err);
                return;
            }
            console.log('Connected to MongoDB at ' + mongoUri);

            readSchema();

            app.all('/api/:object/*?', function (req, res, next) {
                if (!!schemaMap[req.params.object]) {
                    res.contentType('json');
                    next();
                } else {
                    res.send(400, req.params.object + " is not a valid object type.");
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
                var objectMap = { _id: ObjectID(req.params.id) };

                db.collection(req.params.object, function (err, collection) {
                    collection.findOne(objectMap, function (err, result) {
                        res.send(result);
                    });
                });
            });

            app.post('/api/:object', function (req, res) {
                //console.log(req.body);
                checkSchema(req.body, schemaMap[req.params.object], function (valid) {
                    if (valid) {
                        db.collection(req.params.object, function (err, collection) {
                            var optionsMap = { safe: true };
                            
                            collection.insert(req.body, optionsMap, function (err, result) {
                                res.send(result[0]);
                            });
                        });
                    } else {
                        res.send(400, 'Did not pass validation\n');
                    }
                });
            });

            var update = function (req, res) {
                checkSchema(req.body, schemaMap[req.params.object], function (valid) {
                    if (valid) {
                        var findMap = { _id: ObjectID(req.params.id) },
                            objectMap = req.body;

                        db.collection(req.params.object, function (err, collection) {
                            var sortOrder = [],
                                optionsMap = { new: true, upsert: false, safe: true };

                            collection.findAndModify(findMap, sortOrder, objectMap, optionsMap,
                                function (err, result) {
                                    res.send(result);
                                });
                        });
                    } else {
                        res.send(400, 'Did not pass validation\n');
                    }
                });
            };

            app.put('/api/:object/:id', update);

            app.post('/api/:object/:id', update);

            app.delete('/api/:object/:id', function (req, res) {
                var objectMap = { _id: ObjectID( req.params.id ) };

                db.collection(req.params.object, function (err, collection) {
                    var optionsMap = { safe: true, single: true };
      
                    collection.remove(objectMap, optionsMap, 
                        function (err, result) {
                            if (err) {
                                res.send(500, err);
                            } else if (result === 0) {
                                res.send(404);
                            } else {
                                res.send();
                            }
                        });
                });
            });

            //console.log(app.routes);

            callback(app);
        });
    });
};
