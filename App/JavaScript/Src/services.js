(function() {
    'use strict';

    var appServices = angular.module('app.services', []).value('version', '1.5.4');

    appServices.factory('userService', ['$q', '$firebase', function($q, $firebase) {
        var fireBase = new Firebase('https://vote-it.firebaseio.com');

        var authAnonymously = function(userName) {
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
        };

        var joinGroup = function(userName, groupName) {

        };

        return {
            authAnonymously: authAnonymously
        };
    }]);

    appServices.factory('userStatusService', function() {
        var userStatusService = {};

        return userStatusService;
    });
}());