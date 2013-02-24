/*global angular*/
(function () {
    'use strict';

    angular.module('project').
        controller('ProjectListCtrl', [
            '$scope', 'Project',
            function ($scope, Project) {
                $scope.projects = Project.query();
            }]);
}());
