function SignInCtrl($scope) {
    'use strict';

    $scope.signIn = function () {
        alert('Sign in of ' + $scope.name);
    };
}