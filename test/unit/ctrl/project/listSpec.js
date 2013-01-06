describe('ProjectListCtrl', function () {
    'use strict';

    var controller, scope;

    beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
        scope = $rootScope.$new()
        controller = $controller(ProjectListCtrl, { $scope: scope, Project: Project });
    }));

    //it('Should query for all projects and assign it to projects.', function () {

    //});
});