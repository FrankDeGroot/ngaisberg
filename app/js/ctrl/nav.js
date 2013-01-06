function NavCtrl($scope, $location) {
    'use strict';

    $scope.isUrl = function (path, className) {
        if ($location.path() === path) {
            return className;
        }
        return "";
    };

    $scope.hasUrl = function (path, className) {
        if ($location.path().search(path) === 0) {
            return className;
        }
        return "";
    };
}
NavCtrl.$inject = ['$scope', '$location'];