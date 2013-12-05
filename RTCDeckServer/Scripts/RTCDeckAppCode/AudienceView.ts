/// <reference path='HubCommunications.ts'/>



module Models {

    export interface AudienceViewModel extends ng.IScope {
        slides: Models.SlideData[];
        currentSlide: Models.SlideIndices;
        currentServerSlide: Models.SlideIndices;
        paused: boolean;

        updateSlideIndex(indices: Models.SlideIndices) : boolean;
        addSlideData(slideData: Models.SlideData) :void;
        selectAnswer(poll: Models.Poll, option: Models.PollOption) :void;
        slideExists(indices: Models.SlideIndices): boolean;
        isCurrentSlide(indices: Models.SlideIndices): boolean;
        isCurrentServerSlide(indices: Models.SlideIndices): boolean;
        updateSlide(slideData: Models.SlideData) : void;
        moveSlide(hMove: number, vMove: number);
        navPrev();
        navNext();
        getCurrentSlide(): Models.SlideData;
        navigate(backwards: boolean, skipEmpty: boolean);
        goToCurrentServerSlide();
    }
}

module Controllers {


    // Class
    export class AudienceViewCtrl {
        // Constructor
        constructor(private $scope: Models.AudienceViewModel, private RTCDeckHubService: Services.RTCDeckHubService, private $window) {

            $scope.slides = [];
            $scope.paused = false;
            $scope.updateSlideIndex = function (indices: Models.SlideIndices) {
                if (!$scope.currentSlide || $scope.currentSlide.indexh != indices.indexh || $scope.currentSlide.indexv != indices.indexv) {
                    $scope.currentSlide = indices;
                    return true;
                }
                return false;
            };

            $scope.addSlideData = function (slideData: Models.SlideData) {
                if (!$scope.slideExists(slideData)) {
                    $scope.slides.push(slideData);
                }
            };

            $scope.getCurrentSlide = function () : Models.SlideData {
                var filteredSlides = $.grep($scope.slides, function (elem, i) {
                    return (elem.indexh === $scope.currentSlide.indexh && elem.indexv === $scope.currentSlide.indexv)
                });
                if (filteredSlides.length != 0) {
                    return filteredSlides[0];
                }
                return null;
            }

            $scope.moveSlide = function (hMove : number, vMove : number) {
                if ($scope.currentSlide) {
                    var indices: Models.SlideIndices = { indexh: $scope.currentSlide.indexh + hMove, indexv: $scope.currentSlide.indexv + vMove };
                    if ($scope.slideExists(indices)) {
                        $scope.updateSlideIndex(indices);
                    }
                }
            }

            //navigation

            $scope.navPrev = function () {
                var slideChanged = $scope.navigate(true, true);
                if (slideChanged) {
                    $scope.paused = true;
                }
            };
            $scope.navNext = function () {
                var slideChanged = $scope.navigate(false, true);
                if (slideChanged) {
                    $scope.paused = true;
                }
            };

            $scope.goToCurrentServerSlide = function () {
                $scope.paused = false;
                $scope.currentSlide = $scope.currentServerSlide;
            };

            $scope.navigate = function (backwards: boolean, skipEmpty: boolean) {
                var cur = $scope.getCurrentSlide();
                var index = $scope.slides.indexOf(cur);
                if (index === -1) {
                    throw new RangeException();
                }
                var filteredSlides = $.grep($scope.slides, function (elem, i) {
                    if ((backwards && i >= index) || (!backwards && i<= index)) {
                        return false;
                    }
                    if (skipEmpty) {
                        return (elem.supplementaryContent && elem.supplementaryContent != "");
                    }
                    return true;
                });
                if (filteredSlides.length != 0) {
                    var newIndex = backwards ? filteredSlides.length - 1 : 0;
                    return $scope.updateSlideIndex(filteredSlides[newIndex]);
                }
                return false;
            };

            $scope.slideExists = function(indices: Models.SlideIndices) {
                var filteredSlides = $.grep($scope.slides, function (elem, i) {
                    return (elem.indexh === indices.indexh && elem.indexv === indices.indexv)
                });
                return (filteredSlides.length != 0);
            };

            $scope.updateSlide = function (slideData: Models.SlideData) {
                $scope.addSlideData(slideData);
                $scope.currentServerSlide = slideData;
                if (!$scope.paused) {
                    $scope.updateSlideIndex(slideData);
                }
            };

            $scope.isCurrentSlide = function (indices: Models.SlideIndices) {
                if (!$scope.currentSlide) {
                    return false;
                }
                return ($scope.currentSlide.indexh === indices.indexh && $scope.currentSlide.indexv === indices.indexv);
            };

            
            $scope.isCurrentServerSlide = function (indices: Models.SlideIndices) {
                if (!$scope.currentServerSlide) {
                    return false;
                }
                return ($scope.currentServerSlide.indexh === indices.indexh && $scope.currentServerSlide.indexv === indices.indexv);
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
