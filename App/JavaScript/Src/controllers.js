(function() {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('BaseCtrl', ['$scope', '$firebase', function($scope, $firebase) {
        var ref = new Firebase("https://verify-it.firebaseio.com");
        var vm = this;
       
        //#region Authentication
        ref.authAnonymously(function(error, authData) {
            if (authData) {
                login(authData);
                vm.teamReady = false;
            } else {
                console.log("Login Failed!", error);
            }
        });

        ref.onAuth(function() {
            var sync = $firebase(ref.child('users'));
            vm.users = sync.$asObject();
        });

        function login(authData) {
            var userData = {
                authData: authData,
                userData: {
                    name: (vm.name ? vm.name : 'anonymous')
                }
            };

            var userRef = new Firebase('https://verify-it.firebaseio.com/users/' + authData.uid);
            userRef.set(userData);              // Save user data 
            userRef.onDisconnect().remove();    // Delete user data on end of session

            var sync = $firebase(userRef);
            var syncObject = sync.$asObject();  // download the data into a local object
            syncObject.$bindTo($scope, "user"); // FireBase Data Models
        }
        //#endregion
    }]);
}());