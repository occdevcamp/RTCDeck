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
            $scope.slides = [];

            $scope.updateSlideIndex = function (indices) {
                $scope.currentSlide = indices;
            };

            $scope.addSlideData = function (slideData) {
                if (!$scope.slideExists(slideData)) {
                    $scope.slides.push(slideData);
                }
            };

            $scope.moveSlide = function (hMove, vMove) {
                if ($scope.currentSlide) {
                    var indices = { indexh: $scope.currentSlide.indexh + hMove, indexv: $scope.currentSlide.indexv + vMove };
                    if ($scope.slideExists(indices)) {
                        $scope.updateSlideIndex(indices);
                    }
                }
            };

            //navigation
            $scope.navLeft = function () {
                $scope.moveSlide(-1, 0);
            };
            $scope.navRight = function () {
                $scope.moveSlide(1, 0);
            };
            $scope.navUp = function () {
                $scope.moveSlide(0, 1);
            };
            $scope.navDown = function () {
                $scope.moveSlide(0, -1);
            };

            $scope.slideExists = function (indices) {
                var filteredSlides = $.grep($scope.slides, function (elem, i) {
                    return (elem.indexh === indices.indexh && elem.indexv === indices.indexv);
                });
                return (filteredSlides.length != 0);
            };

            $scope.updateSlide = function (slideData) {
                $scope.addSlideData(slideData);
                $scope.updateSlideIndex(slideData);
            };

            $scope.isCurrentSlide = function (indices) {
                if (!$scope.currentSlide) {
                    return false;
                }
                return ($scope.currentSlide.indexh === indices.indexh && $scope.currentSlide.indexv === indices.indexv);
            };

            $scope.selectAnswer = function (poll, option) {
                RTCDeckHubService.sendPollAnswer(new Models.PollAnswer(poll, option));
            };

            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData) {
                $scope.$apply(function () {
                    $scope.updateSlide(slideData);
                });
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
//# sourceMappingURL=AudienceView.js.map
