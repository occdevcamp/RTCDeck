/// <reference path='HubCommunications.ts'/>



module Models {

    export interface AudienceViewModel extends ng.IScope {
        slides: Models.SlideData[];
        currentSlide: Models.SlideIndices;
        updateSlideIndex(indices: Models.SlideIndices);
        addSlideData(slideData: Models.SlideData);
        selectAnswer(poll: Models.Poll, option: Models.PollOption);
        slideExists(indices: Models.SlideIndices): boolean;
        isCurrentSlide(indices: Models.SlideIndices): boolean;
        updateSlide(slideData: Models.SlideData);
        moveSlide(hMove: number, vMove: number);
        navLeft();
        navUp();
        navDown();
        navRight();

    }
}

module Controllers {


    // Class
    export class AudienceViewCtrl {
        // Constructor
        constructor(private $scope: Models.AudienceViewModel, private RTCDeckHubService: Services.RTCDeckHubService, private $window) {

            $scope.slides = [];

            $scope.updateSlideIndex = function (indices: Models.SlideIndices) {
                $scope.currentSlide = indices;
            };

            $scope.addSlideData = function (slideData: Models.SlideData) {
                if (!$scope.slideExists(slideData)) {
                    $scope.slides.push(slideData);
                }
            };

            $scope.moveSlide = function (hMove : number, vMove : number) {
                if ($scope.currentSlide) {
                    var indices: Models.SlideIndices = { indexh: $scope.currentSlide.indexh + hMove, indexv: $scope.currentSlide.indexv + vMove };
                    if ($scope.slideExists(indices)) {
                        $scope.updateSlideIndex(indices);
                    }
                }
            }

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

            $scope.slideExists = function (indices: Models.SlideIndices) {
                var filteredSlides = $.grep($scope.slides, function (elem, i) {
                    return (elem.indexh === indices.indexh && elem.indexv === indices.indexv)
                });
                return (filteredSlides.length != 0);
            };

            $scope.updateSlide = function (slideData: Models.SlideData) {
                $scope.addSlideData(slideData);
                $scope.updateSlideIndex(slideData);
            };

            $scope.isCurrentSlide = function (indices: Models.SlideIndices) {
                if (!$scope.currentSlide) {
                    return false;
                }
                return ($scope.currentSlide.indexh === indices.indexh && $scope.currentSlide.indexv === indices.indexv);
            };

            $scope.selectAnswer = function (poll: Models.Poll, option: Models.PollOption) {
                //mark answer as selected
                angular.forEach(poll.Options, function (pollOption : Models.PollOption) {
                    pollOption.selected = false;
                });
                option.selected = true;
                RTCDeckHubService.sendPollAnswer(new Models.PollAnswer(poll, option));
            };
            
            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function(e, slideData: Models.SlideData) {
                $scope.$apply(function () {
                    //TODO: if current slide is null (i.e. the hub has no idea what the slide is), send up data.
                    $scope.updateSlide(slideData);
                });
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
