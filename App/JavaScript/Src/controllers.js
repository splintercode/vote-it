(function () {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('BaseCtrl', ['$firebase', 'voteService', function($firebase, voteService) {
        var vm = this;

        vm.test = 'Hello World';

        var ref = new Firebase("https://verify-it.firebaseio.com/");
        // create an AngularFire reference to the data
        var sync = $firebase(ref);
        // download the data into a local object
        vm.data = sync.$asObject();
    }]);
}());