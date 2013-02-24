/*global angular*/
(function () {
    'use strict';

    angular.module('project', ['ngResource']).
        factory('Project', [
            '$resource',
            function ($resource) {
                var Project = $resource('api/project/:id', {});

                Project.prototype.update = function (cb) {
                    return Project.save({ id: this._id },
                        angular.extend({}, this, { _id: undefined }), cb);
                };

                Project.prototype.destroy = function (cb) {
                    return Project.remove({ id: this._id }, cb);
                };

                return Project;
            }]);
}());
