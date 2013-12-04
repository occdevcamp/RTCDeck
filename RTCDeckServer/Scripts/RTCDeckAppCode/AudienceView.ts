/// <reference path='HubCommunications.ts'/>



module Models {

    export interface AudienceViewModel extends ng.IScope {
        slideData: Models.SlideData;
        updateSlideIndex(slideData: Models.SlideData): void;
    }
}

module Controllers {


    // Class
    export class AudienceViewCtrl {
        // Constructor
        constructor(private $scope: Models.AudienceViewModel, private RTCDeckHubService: Services.RTCDeckHubService, private $window) {


            $scope.slideData = { indexh: 0, indexv: 0, supplementaryContent: "" };

            $scope.updateSlideIndex = function (slideData: Models.SlideData) {
                $scope.$apply(function () {
                    $scope.slideData = slideData;
                });
            };

            
            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData: Models.SlideData) {
                $scope.updateSlideIndex(slideData);
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
            });

        }

    }


}

var app = angular.module("audienceView", ["ngSanitize"]);


app.value('$', $);
app.factory('RTCDeckHubService', function ($, $rootScope) {return new Services.RTCDeckHubService($, $rootScope,window) });
app.controller('Controllers.AudienceViewCtrl', Controllers.AudienceViewCtrl);

