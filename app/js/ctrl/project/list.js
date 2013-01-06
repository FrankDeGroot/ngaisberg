function ProjectListCtrl($scope, Project) {
    'use strict';

    $scope.projects = Project.query();
}