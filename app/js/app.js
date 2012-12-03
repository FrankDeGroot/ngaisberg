'use strict';

angular.module('main', ['resProject']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { templateUrl: 'partials/home.html' }).
            when('/about', { templateUrl: 'partials/about.html' }).
            when('/contact', { templateUrl: 'partials/contact.html' }).
            when('/project', { controller: ProjectListCtrl, templateUrl: 'partials/project/list.html' }).
            when('/project/edit/:projectId', { controller: ProjectEditCtrl, templateUrl: 'partials/project/detail.html' }).
            when('/project/new', { controller: ProjectCreateCtrl, templateUrl: 'partials/project/detail.html' }).
            otherwise({ redirectTo: '/' });
    });
