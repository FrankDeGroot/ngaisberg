/*global beforeEach describe expect inject it NavCtrl */
describe('NavCtrl', function () {
    'use strict';

    var controller, path, location, scope;

    beforeEach(inject(function ($rootScope, $controller) {
        path = undefined;
        location = {
            path: function () {
                return path;
            }
        };
        scope = $rootScope.$new();
        controller = $controller(NavCtrl, { $scope: scope, $location: location });
    }));

    it('Should return an empty string when url does not match.', function () {
        path = 'url1';
        expect(scope.isUrl('url2', 'className1')).toEqual('');
    });

    it('Should return the className when url does match.', function () {
        path = 'url1';
        expect(scope.isUrl('url1', 'className1')).toEqual('className1');
    });

    it('Should return an empty string when current url does not start with the supplied url.', function () {
        path = 'url1-url';
        expect(scope.hasUrl('url2', 'className1')).toEqual('');
    });

    it('Should return the className when current url starts with the supplied url.', function () {
        path = 'url1-url';
        expect(scope.hasUrl('url1', 'className1')).toEqual('className1');
    });
});
