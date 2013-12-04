/// <reference path='HubCommunications.ts'/>
var Controllers;
(function (Controllers) {
    // Class
    var AudienceViewCtrl = (function () {
        // Constructor
        function AudienceViewCtrl($scope, RTCDeckHubService, $window) {
            this.$scope = $scope;
            this.RTCDeckHubService = RTCDeckHubService;
            this.$window = $window;
            $scope.slideData = { indexh: 0, indexv: 0, supplementaryContent: "" };

            $scope.updateSlideIndex = function (slideData) {
                $scope.$apply(function () {
                    $scope.slideData = slideData;
                });
            };

            $scope.selectAnswer = function (poll, option) {
                $scope.sendPollAnswer(poll.Identifier, option.OptionID);
            };

            $scope.sendPollAnswer = function (pollID, optionID) {
                $window.alert("answer to " + pollID + " is " + optionID);
            };

            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData) {
                $scope.updateSlideIndex(slideData);
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
            });
        }
        return AudienceViewCtrl;
    })();
    Controllers.AudienceViewCtrl = AudienceViewCtrl;
})(Controllers || (Controllers = {}));

var app = angular.module("audienceView", ["ngSanitize"]);

app.value('$', $);
app.factory('RTCDeckHubService', function ($, $rootScope) {
    return new Services.RTCDeckHubService($, $rootScope, window);
});
app.controller('Controllers.AudienceViewCtrl', Controllers.AudienceViewCtrl);
app.directive("question", function () {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        controller: function ($scope, $element) {
            var poll = $scope.poll = $scope.$parent.poll;

            $scope.select = function (option) {
                $scope.$parent.$parent.sendPollAnswer(poll.Identifier, option.OptionID);
            };
        },
        template: '<div>' + '<a href="" ng-click="select(option)">  </a>' + '{{poll.Question}}' + '<ul>' + '<li ng-repeat="option in poll.Options">' + '<a href="#" ng-click="select(option)">' + '<img src="{{option.OptionImagePath}}" alt="{{option.OptionText}}">' + '</a > ' + '</li>' + '</ul>' + '</div>',
        replace: true
    };
});
//# sourceMappingURL=AudienceView.js.map
