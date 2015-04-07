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
        vm.voteTypes = [{ value: 'Yes' }, { value: 'No' }, { value: 'Neutral' }];
        vm.user = { vote: 'Neutral' };

        vm.toggleNav = toggleNav;
        vm.vote = vote;
        vm.join = join;

        userService.authAnonymously(vm.name);

        function toggleNav() {
            vm.showNav = !vm.showNav;
        }

        function vote(voteValue) {
            userService.vote(voteValue);
        }

        function join() {
            $location.path('/vote');
            vm.users = userService.joinGroup(vm.name, vm.group);
        }

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
