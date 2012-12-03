﻿angular.module('resProject', ['ngResource']).
    factory('Project', function ($resource) {
        var Project = $resource('api/project/:id', {
            update: { method: 'PUT' }
        });

        Project.prototype.update = function (cb) {
            return Project.update({ id: this._id.$oid },
                angular.extend({}, this, { _id: undefined }), cb);
        };

        Project.prototype.destroy = function (cb) {
            return Project.remove({ id: this._id.$oid }, cb);
        };

        return Project;
    });