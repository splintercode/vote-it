(function() {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('BaseCtrl', ['$scope', '$firebase', '$firebaseAuth', function($scope, $firebase, $firebaseAuth) {
        var fireBase = new Firebase('https://vote-it.firebaseio.com');
        var vm = this;

        vm.name = 'Anonymous';
        vm.showGroup = false;
        vm.voteTypes = [{
            value: 'Yes'
        }, {
            value: 'No'
        }, {
            value: 'Neutral'
        }];

        vm.join = function() {
            vm.showGroup = true;
            joinGroup(vm.name, vm.group);
        };

        fireBase.authAnonymously(function(error, authData) {
            createSession(authData);
        });

        var currentGroup = '';
        function joinGroup(userName, groupName) {
            var auth = $firebaseAuth(fireBase);
            var userAuth = auth.$getAuth();
            var uid = userAuth.uid;

            // Remove user from current group
            console.log('/groups/' + currentGroup + '/users/' + uid);
            fireBase.child('/groups/' + currentGroup + '/users/' + uid).remove();
            currentGroup = groupName;

            // Update group user list with new user (creates group if it doesn't exist)
            fireBase.child('/groups/' + groupName + '/users/' + uid).set({ userName: userName, vote: 'Neutral' });

            // Update user session
            fireBase.child('/users/' + uid + '/userData/').update({ groupName: groupName, userName: userName });

            // Sync group to vm
            var syncGroup = $firebase(fireBase.child('/groups/' + groupName + '/users/'));
            vm.users = syncGroup.$asObject();

            // Sync user to vm
            var syncUser = $firebase(fireBase.child('/groups/' + groupName + '/users/' + uid));
            var syncObject = syncUser.$asObject();  // download the data into a local object
            syncObject.$bindTo($scope, 'user'); // FireBase Data Models (3 way binding)

            // Remove user from user list on disconnect
            fireBase.child('/groups/' + groupName + '/users/' + uid).onDisconnect().remove();
        }

        function createSession(authData) {
            if (authData) {
                var userData = {
                    authData: authData,
                    userData: {
                        userName: vm.name,
                        groupName: ''
                    }
                };

                var usersRef = fireBase.child('/users/' + authData.uid);
                usersRef.set(userData);              // Save user data
                usersRef.onDisconnect().remove();    // Delete user data on end of session
            } else {
                console.log('Login Failed!', error);
            }
        }
    }]);
}());
