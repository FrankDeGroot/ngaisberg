function NavCtrl($scope, $location) {
    $scope.isUrl = function (path, className) {
        if ($location.path() == path) {
            return className;
        } else {
            return "";
        }
    }

    $scope.hasUrl = function (path, className) {
        if ($location.path().substring(0, path.length) == path) {
            return className;
        } else {
            return "";
        }
    }
}