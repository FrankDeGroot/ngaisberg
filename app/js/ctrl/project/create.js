/*global angular*/
(function () {
    'use strict';

    angular.module('project').
        controller('ProjectCreateCtrl', [
            '$scope', '$location', 'Project',
            function ($scope, $location, Project) {
                $scope.save = function () {
                    Project.save($scope.project, function (project) {
                        $location.path('/project');
                    });
                };
            }]);
}());

