(function() {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('BaseCtrl', ['$location', 'userService', function($location, userService) {
        var fireBase = new Firebase('https://vote-it.firebaseio.com');
        var vm = this;

        vm.name = 'Anonymous';
        vm.showGroup = false;
        vm.showNav = false;

        vm.voteTypes = [{
            value: 'Yes'
        }, {
            value: 'No'
        }, {
            value: 'Neutral'
        }];

        vm.user = {
            vote: 'Neutral'
        }

        vm.toggleNav = function() {
            vm.showNav = !vm.showNav;
        };

        vm.vote = function(voteValue) {
            userService.vote(voteValue);
        };

        vm.join = function() {
            $location.path('/vote');
            vm.users = userService.joinGroup(vm.name, vm.group);
        };

        userService.authAnonymously(vm.name);
    }]);
}());
