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

        fireBase.onAuth(function() {
            // Get update list of users
            //var sync = $firebase(fireBase.child('users'));
            //vm.users = sync.$asObject();
        });

        function joinGroup(userName, groupName) {
            var auth = $firebaseAuth(fireBase);
            var userAuth = auth.$getAuth();
            var uid = userAuth.uid;

            // store user
            fireBase.child('/users/' + uid + '/userData/').update({
                userName: userName,
                groupName: groupName
            });

            // store group
            fireBase.child('/groups/' + groupName).once('value', function(group) {
                if (group.val() !== null) {
                    console.log('Group Exists!');

                    // Update user list with new user
                    fireBase.child('/groups/' + groupName).child('/users/' + uid).set
                        ({
                            userName: userName,
                            vote: 'Neutral'
                        });

                } else {
                    console.log('Group Does not exist!');

                    // Create group
                    fireBase.child('/groups/' + groupName).set({
                        groupName: groupName
                    });

                    // Update user list with new user
                    fireBase.child('/groups/' + groupName + '/users/' + uid).set
                    ({
                        userName: userName,
                        vote: 'Neutral'
                    });
                }

                // Remove user from user list on disconnect
                fireBase.child('/groups/' + groupName + '/users/' + uid).onDisconnect().remove();

                // sync group to vm
                var syncGroup = $firebase(fireBase.child('/groups/' + groupName + '/users/'));
                vm.users = syncGroup.$asObject();

                // sync user to vm
                var syncUser = $firebase(fireBase.child('/groups/' + groupName + '/users/' + uid));
                var syncObject = syncUser.$asObject();  // download the data into a local object
                syncObject.$bindTo($scope, 'user'); // FireBase Data Models (3 way binding)
            });
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
