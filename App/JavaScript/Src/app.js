(function () {
    'use strict';

    angular.module('templates', []);

    var app = angular.module('app', [
        'ngRoute',
        'ngAnimate',
        'firebase',
        'templates',
        'app.filters',
        'app.services',
        'app.directives',
        'app.controllers'
    ]);

    app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        //$locationProvider.html5Mode(true);

        $routeProvider.when('/', {
            templateUrl: 'home.html'
        });
        $routeProvider.when('/vote', {
            templateUrl: 'vote.html'
        });
        $routeProvider.when('/about', {
            templateUrl: 'about.html'
        });

        $routeProvider.otherwise({ redirectTo: '/' });
    }]);
}());