function ProjectCreateCtrl($scope, $location, Project) {
    $scope.save = function () {
        Project.save($scope.project, function (project) {
            $location.path('/edit/' + project._id);
        });
    }
}
