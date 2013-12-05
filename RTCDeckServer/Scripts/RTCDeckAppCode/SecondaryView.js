/// <reference path='HubCommunications.ts'/>
var Controllers;
(function (Controllers) {
    // Class
    var SecondaryViewCtrl = (function () {
        // Constructor
        function SecondaryViewCtrl($scope, RTCDeckHubService, $window) {
            this.$scope = $scope;
            this.RTCDeckHubService = RTCDeckHubService;
            this.$window = $window;
            $scope.updateSlide = function (slideData) {
                $scope.currentSlide = slideData;
            };

            $scope.startTimer = function () {
                $window.startTimer(0);
                RTCDeckHubService.startPresentationTimer();
            };

            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData) {
                $scope.$apply(function () {
                    $scope.updateSlide(slideData);
                });
            });

            $scope.$parent.$on("acceptTimeElapsed", function (e, secondsElapsed) {
                if (secondsElapsed != 0) {
                    $scope.$apply(function () {
                        $window.startTimer(secondsElapsed);
                    });
                }
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
                RTCDeckHubService.requestPresentationTimeElapsed();
            });
        }
        return SecondaryViewCtrl;
    })();
    Controllers.SecondaryViewCtrl = SecondaryViewCtrl;
})(Controllers || (Controllers = {}));

var app = angular.module("secondaryView", ["ngSanitize"]);

app.value('$', $);
app.factory('RTCDeckHubService', ["$", "$rootScope", function ($, $rootScope) {
        return new Services.RTCDeckHubService($, $rootScope, window);
    }]);
app.controller('Controllers.SecondaryViewCtrl', ["$scope", "RTCDeckHubService", "$window", Controllers.SecondaryViewCtrl]);
//# sourceMappingURL=SecondaryView.js.map
