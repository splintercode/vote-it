(function() {
    'use strict';

    var appServices = angular.module('app.services', []).value('version', '1.5.4');

    appServices.factory('voteService', function() {
        var voteService = {};

        return voteService;
    });

    appServices.factory('userStatusService', function() {
        var userStatusService = {};

        //var listRef = new Firebase("https://verify-it.firebaseio.com/presence/");
        //var userRef = listRef.push();

        //// Add ourselves to presence list when online.
        //var presenceRef = new Firebase("https://verify-it.firebaseio.com/.info/connected");
        //presenceRef.on("value", function(snap) {
        //    if (snap.val()) {
        //        userRef.set(true);

        //        // Remove ourselves when we disconnect.
        //        userRef.onDisconnect().remove();
        //    }
        //});

        //// Number of online users is the number of objects in the presence list.
        //listRef.on("value", function(snap) {
        //    console.log("# of online users = " + snap.numChildren());
        //    vm.activeUsers = snap.numChildren();
        //});

        return userStatusService;
    });
}());