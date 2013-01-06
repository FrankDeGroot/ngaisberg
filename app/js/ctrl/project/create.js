function ProjectCreateCtrl($scope, $location, Project) {
    'use strict';

    $scope.save = function () {
        Project.save($scope.project, function (project) {
            $location.path('/project');
        });
    };
}
