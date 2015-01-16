(function() {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('BaseCtrl', ['$scope', '$firebase', 'userService', function($scope, $firebase, userService) {
        // View Models
        var vm = this;

        //#region Authentication
        var authRef = new Firebase("https://verify-it.firebaseio.com");

        authRef.authAnonymously(function(error, authData) {
            if (authData) {
                login(authData);
            } else {
                console.log("Login Failed!", error);
            }
        });

        authRef.onAuth(function(authData) {
            if (authData) {
                getOnlineUsers(authData);
            } else {
                console.log("User logged out");
            }
        });

        function login(authData) {
            var userData = {
                authData: authData,
                userData: {
                    name: 'anonymous'
                }
            };

            var userRef = new Firebase('https://verify-it.firebaseio.com/users/' + authData.uid);
            userRef.set(userData);              // Save user data 
            userRef.onDisconnect().remove();    // Delete user data on end of session

            var sync = $firebase(userRef);
            var syncObject = sync.$asObject();  // download the data into a local object
            syncObject.$bindTo($scope, "user"); // FireBase Data Models
        }

        function getOnlineUsers(authData) {
            var userRef = new Firebase("https://verify-it.firebaseio.com/users");
            var sync = $firebase(userRef);
            vm.users = sync.$asObject();

            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        }
        //#endregion
    }]);
}());