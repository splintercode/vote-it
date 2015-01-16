(function() {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('BaseCtrl', ['$firebase', '$scope', 'voteService', function($firebase, $scope, voteService) {

        // Set up FireBase Connection
        var dataRef = new Firebase("https://verify-it.firebaseio.com/data");
        var sync = $firebase(dataRef);
        var syncObject = sync.$asObject();  // download the data into a local object

        // FireBase Models
        syncObject.$bindTo($scope, "data");

        // View Models
        var vm = this;
        vm.h1 = 'Verify It';




        //#region Authentication
        var authRef = new Firebase("https://verify-it.firebaseio.com");
        var disconnectRef = {};

        authRef.authAnonymously(function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("User " + authData.uid + " is logged in with " + authData.provider);

                authRef.child("users").child(authData.uid).set(authData); // Save user data 

                var disconnectRef = new Firebase('https://verify-it.firebaseio.com/users/' + authData.uid);
                disconnectRef.onDisconnect().remove();
            }
        });

        authRef.onAuth(function(authData) {
            if (authData) {
                var userRef = new Firebase("https://verify-it.firebaseio.com/users");
                var sync = $firebase(userRef);
                vm.users = sync.$asObject();

                //console.log("User " + authData.uid + " is logged in with " + authData.provider);
            } else {
                //console.log("User is logged out");
            }
        });
        //#endregion
    }]);
}());