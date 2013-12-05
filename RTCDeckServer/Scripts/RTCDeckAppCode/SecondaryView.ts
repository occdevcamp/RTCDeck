/// <reference path='HubCommunications.ts'/>



module Models {

    export interface SecondaryViewModel extends ng.IScope {
        currentSlide: Models.SlideData;

        updateSlide(indices: Models.SlideData): void;
        startTimer(): void;
    }
}

module Controllers {


    // Class
    export class SecondaryViewCtrl {
        // Constructor
        constructor(private $scope: Models.SecondaryViewModel, private RTCDeckHubService: Services.RTCDeckHubService, private $window) {

            $scope.updateSlide = function (slideData: Models.SlideData) {
                $scope.currentSlide = slideData;
            };

            $scope.startTimer = function () {
                $window.startTimer(0);
                RTCDeckHubService.startPresentationTimer();
            };      
                      
            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function(e, slideData: Models.SlideData) {
                $scope.$apply(function () {
                    $scope.updateSlide(slideData);
                });
            });

            $scope.$parent.$on("acceptTimeElapsed", function (e, secondsElapsed: number) {
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

    }


}

var app = angular.module("secondaryView", ["ngSanitize"]);


app.value('$', $);
app.factory('RTCDeckHubService', ["$","$rootScope",function ($, $rootScope) {return new Services.RTCDeckHubService($, $rootScope,window) }]);
app.controller('Controllers.SecondaryViewCtrl', ["$scope", "RTCDeckHubService", "$window", Controllers.SecondaryViewCtrl]);
