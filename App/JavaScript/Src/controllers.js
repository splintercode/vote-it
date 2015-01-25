(function() {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('BaseCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', 'userService', function($scope, $location, $firebase, $firebaseAuth, userService) {
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
            var userAuth = $firebaseAuth(fireBase).$getAuth();
            var uid = userAuth.uid;
            fireBase.child('/groups/' + vm.group + '/users/' + uid).update({ vote: voteValue });
        };

        vm.join = function() {
            $location.path('/vote');
            joinGroup(vm.name, vm.group);
        };

        userService.authAnonymously(vm.name);

        var currentGroup = '';
        function joinGroup(userName, groupName) {
            var userAuth = $firebaseAuth(fireBase).$getAuth();
            var uid = userAuth.uid;

            // Remove user from current group
            fireBase.child('/groups/' + currentGroup + '/users/' + uid).remove();
            currentGroup = groupName;

            // Update group user list with new user (creates group if it doesn't exist)
            fireBase.child('/groups/' + groupName + '/users/' + uid).set({ userName: userName, vote: 'Neutral' });

            // Update user session
            fireBase.child('/users/' + uid + '/userData/').update({ groupName: groupName, userName: userName });

            // Sync users to vm
            var usersObject = $firebase(fireBase.child('/groups/' + groupName + '/users/'));
            vm.users = usersObject.$asObject();

            // Remove user from user list on disconnect
            fireBase.child('/groups/' + groupName + '/users/' + uid).onDisconnect().remove();
        }
    }]);
}());
