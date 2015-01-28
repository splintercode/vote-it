(function () {
    'use strict';

    angular.module('templates', []);

    var app = angular.module('app', [
        'ngRoute',
        'ngAnimate',
        'ngMessages',
        'firebase',
        'chart.js',
        'templates',
        'app.filters',
        'app.services',
        'app.directives',
        'app.controllers'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
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