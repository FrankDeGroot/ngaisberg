/*global angular*/
(function () {
    'use strict';

    angular.
        module('nav', []).
        controller('NavController', [
            '$scope', '$location',
            function ($scope, $location) {

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
            }]);
}());