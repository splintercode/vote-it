﻿(function() {
    'use strict';

    var appServices = angular.module('app.services', []).value('version', '1.5.4');

    appServices.factory('userService', ['$q', '$firebase', '$firebaseAuth', function($q, $firebase, $firebaseAuth) {
        var fireBase = new Firebase('https://vote-it.firebaseio.com');
        var currentGroup = '';

        var userService = {
            authAnonymously: authAnonymously,
            joinGroup: joinGroup,
            vote: vote
        };

        return userService;

        function authAnonymously(userName) {
            fireBase.authAnonymously(function(error, authData) {
                if (authData) {
                    var userData = {
                        authData: authData,
                        userData: {
                            userName: userName,
                            groupName: ''
                        }
                    };

                    var usersRef = fireBase.child('/users/' + authData.uid);
                    usersRef.set(userData);              // Save user data
                    usersRef.onDisconnect().remove();    // Delete user data on end of session
                } else {
                    console.log('Login Failed!', error);
                }
            });
        }

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

            // Remove user from user list on disconnect
            fireBase.child('/groups/' + groupName + '/users/' + uid).onDisconnect().remove();

            // Sync users to view model
            var usersObject = $firebase(fireBase.child('/groups/' + groupName + '/users/'));

            // Return view model
            return usersObject.$asObject();
        }

        function vote(voteValue) {
            var userAuth = $firebaseAuth(fireBase).$getAuth();
            var uid = userAuth.uid;
            fireBase.child('/groups/' + currentGroup + '/users/' + uid).update({ vote: voteValue });
        }
    }]);
}());