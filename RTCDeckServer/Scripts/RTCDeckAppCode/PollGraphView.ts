/// <reference path='HubCommunications.ts'/>
module Models {

    export interface PollGraphViewModel extends ng.IScope {
        // props
        slideData: Models.SlideData;
        pollAnswers: Models.Poll[];
        allPollsView: boolean;

        // methods
        applyslide(slideData: Models.SlideData): void;
        init(allPollsView: boolean): void;
    }
}

module PGV_Controllers {

    // Class
    export class PollGraphViewCtrl {
        // Constructor
        constructor(private $scope: Models.PollGraphViewModel, private RTCDeckHubService: Services.RTCDeckHubService, private $window) {
            $scope.allPollsView = false;

            $scope.init = function(allPollsView: boolean) {
                $scope.allPollsView = allPollsView;
            };

            //bind to events from server
            $scope.applyslide = function (slideData: Models.SlideData) {
                // until we implement deferred polling, the poll identifiers to graph are 
                // exactly the same as the polls on the current slide. We may change behaviour later 
                // to allow an override specified set of identifiers through a new element on slideData, with 
                // a fallback to "polls on slide" behaviour if not specified?
                if ($scope.slideData != null && 
                    slideData.indexh == $scope.slideData.indexh && slideData.indexv == $scope.slideData.indexv) return;
                $scope.$apply(function () {
                    // store data: we probably don't need this, and in the case of the dashboard we definitely don't. 
                    // but for debug it proves we're showing polls for the current slide
                    $scope.slideData = slideData;

                    // new slide => clear down cached answers?
                    // don't do this in "all polls" view.
                    if (!$scope.allPollsView)
                        $scope.pollAnswers = [];

                    // if we haven't logged anything yet, just create a new set of polls
                    if ($scope.pollAnswers == null)
                        $scope.pollAnswers = [];

                    var pollIndex;
                    for (pollIndex in slideData.polls) {
                        $scope.pollAnswers[$scope.pollAnswers.length] = slideData.polls[pollIndex];
                        // get initial state for the poll answers from the hub on new page load.
                        RTCDeckHubService.RequestPollAnswers(slideData.polls[pollIndex].Identifier);
                    }
                });
            };

            $scope.$parent.$on("slideChangedForPollGraph", function (e, slideData: Models.SlideData) {
                $scope.applyslide(slideData);
            });
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData: Models.SlideData) {
                $scope.applyslide(slideData);
            });

            $scope.$parent.$on("updatePollAnswers", function (e, pollIdentifier: string, pollAnswers: Models.Poll) {
                // find poll in $scope.pollAnswers and update it
                $scope.$apply(function () {
                    var pollIndex;
                    for (pollIndex in $scope.pollAnswers) {
                        if (pollIdentifier == $scope.pollAnswers[pollIndex].Identifier) {
                            $scope.pollAnswers[pollIndex] = pollAnswers;
                        }
                    }
                });
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
            });

        }

    }

}

var app = angular.module("pollGraphView", ["ngSanitize"]);

app.value('$', $);
app.factory('RTCDeckHubService', function ($, $rootScope) {return new Services.RTCDeckHubService($, $rootScope, window) });
app.controller('Controllers.pollGraphViewCtrl', PGV_Controllers.PollGraphViewCtrl);
