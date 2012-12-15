function ProjectListCtrl($scope, Project) {
    $scope.projects = Project.query();
}