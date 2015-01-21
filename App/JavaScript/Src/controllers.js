﻿(function() {
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
            var userAuth = $firebaseAuth(fireBase).$getAuth();
            var uid = userAuth.uid;

            // Update group user list with new user (creates group if it doesn't exist)
            fireBase.child('/groups/' + groupName + '/users/' + uid).set({ userName: userName, vote: 'Neutral' });

            // Update user session
            fireBase.child('/users/' + uid + '/userData/').update({ groupName: groupName, userName: userName });

            // Sync users to vm
            var usersObject = $firebase(fireBase.child('/groups/' + groupName + '/users/'));
            vm.users = usersObject.$asObject();

            // Sync user to vm
            var userObject = $firebase(fireBase.child('/groups/' + groupName + '/users/' + uid)).$asObject();
            userObject.$bindTo($scope, 'user');         // FireBase Data Models (3 way binding)

            // Remove user from current group
            fireBase.child('/groups/' + currentGroup + '/users/' + uid).remove();
            currentGroup = groupName;

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
