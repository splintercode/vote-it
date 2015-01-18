(function() {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('BaseCtrl', ['$scope', '$firebase', function($scope, $firebase) {
        var fireBase = new Firebase('https://vote-it.firebaseio.com');
        var vm = this;

        vm.voteTypes = [{
            value: 'Yes'
        }, {
            value: 'No'
        }, {
            value: 'Neutral'
        }];

        //#region Authentication
        fireBase.authAnonymously(function(error, authData) {
            if (authData) {
                login(authData);
            } else {
                console.log('Login Failed!', error);
            }
        });

        fireBase.onAuth(function() {
            getUpdatedListOfUsers();
        });

        function login(authData) {
            var userData = {
                authData: authData,
                userData: {
                    name: (vm.name ? vm.name : 'Anonymous'),
                    vote: 'Neutral'
                }
            };

            var userRef = new Firebase('https://vote-it.firebaseio.com/users/' + authData.uid);
            userRef.set(userData);              // Save user data
            userRef.onDisconnect().remove();    // Delete user data on end of session

            var sync = $firebase(userRef);
            var syncObject = sync.$asObject();  // download the data into a local object
            syncObject.$bindTo($scope, 'user'); // FireBase Data Models
        }

        function getUpdatedListOfUsers() {
            var sync = $firebase(fireBase.child('users'));
            vm.users = sync.$asObject();
        }
        //#endregion
    }]);
}());
