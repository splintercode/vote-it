(function () {
    'use strict';

    var app = angular.module('app', [
        'ngRoute',
        'ngAnimate',
        'firebase',
        'app.filters',
        'app.services',
        'app.directives',
        'app.controllers'
    ]);

    app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        //$routeProvider
        //.when('/Book/:bookId/ch/:chapterId', {
        //    templateUrl: 'chapter.html',
        //    controller: 'ChapterController'
        //});

        //$locationProvider.html5Mode(true);
    }]);
}());