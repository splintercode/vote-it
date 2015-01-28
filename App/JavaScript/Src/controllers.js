(function() {
    'use strict';

    var appControllers = angular.module('app.controllers', []);

    appControllers.controller('BaseCtrl', ['$scope', '$location', 'userService', function($scope, $location, userService) {
        var vm = this;

        vm.name = 'Anonymous';
        vm.showGroup = false;
        vm.showNav = false;
        vm.users = [];
        vm.data = [];
        vm.chartLabels = ["Yes Votes", "No Votes", "Neutral Votes"];

        vm.voteTypes = [{
            value: 'Yes'
        }, {
            value: 'No'
        }, {
            value: 'Neutral'
        }];

        vm.user = {
            vote: 'Neutral'
        }

        vm.toggleNav = function() {
            vm.showNav = !vm.showNav;
        };

        vm.vote = function(voteValue) {
            userService.vote(voteValue);
        };

        vm.join = function() {
            $location.path('/vote');
            vm.users = userService.joinGroup(vm.name, vm.group);
        };

        userService.authAnonymously(vm.name);

        $scope.$watchCollection(function() {
            return vm.users;
        }, function(newValue, oldValue) {
            updateChart();
        }, true);

        function updateChart() {
            var yesVotes = 0;
            var noVotes = 0;
            var neutralVotes = 0;

            vm.users.forEach(getUserVote);

            function getUserVote(user, index, array) {
                
                switch (user.vote) {
                    case 'Yes':
                        yesVotes += 1;
                        break;
                    case 'No':
                        noVotes += 1;
                        break;
                    case 'Neutral':
                        neutralVotes += 1;
                        break;
                    default:
                        neutralVotes += 1;
                }

                vm.data = [yesVotes, noVotes, neutralVotes];
            }
        }
    }]);
}());
