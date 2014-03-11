/// <reference path='HubCommunications.ts'/>

module Models {

    export interface PollAverageViewModel extends ng.IScope {
        // props
        slideData: Models.SlideData;
        //pollAnswers: Models.Poll[];
        averages: Models.Poll[];
        allPollsView: boolean;

        // methods
        applyslide(slideData: Models.SlideData): void;
        init(allPollsView: boolean): void;
        updateAverages(polls: Models.Poll[]): void;
    }
}

module PGV_Controllers {

    // Class
    export class PollAverageViewCtrl {
        // Constructor
        constructor(private $scope: Models.PollAverageViewModel, private RTCDeckHubService: Services.RTCDeckHubService, private $window) {
            $scope.allPollsView = false;
            $scope.averages = [];

            $scope.init = function (allPollsView: boolean) {
                $scope.allPollsView = allPollsView;
            };

            $scope.updateAverages = function (polls: Models.Poll[]) {
                // this function builds up a set of graphs in the "graphs" div.
                // well, it will one day any way. hopefully today.

                // strategy: Check whether a graph has been made or not
                // if not, add a new graph. if yes, update the existing graph.
                // I probably could have written this whole section without adding the "graphs" array 
                // but this allows me to leave original debug-type code in place still working throughout which 
                // is useful. If ever revisiting this code we should probably merge "pollAnswers" and "graphs"
                var pollIndex, pollIdentifier, pollData;
                for (pollIndex in polls) {

                    pollIdentifier = polls[pollIndex].Identifier;
                    pollData = polls[pollIndex].Options;

                    $scope.$apply(function () {
                        // set up data for graph
                        var totalCount = 0,
                            totalValue = 0,
                            averageValue = 0;

                        for (var optionIndex in pollData) {
                            // work out total so we can calc percentages
                            totalCount += pollData[optionIndex].Count;
                            totalValue += pollData[optionIndex].OptionText * pollData[optionIndex].Count;
                        }
                        averageValue = Math.round((totalValue / totalCount) * 10) / 10;

                        // if total == 0 we don't yet attempt to create a graph
                        if (totalCount != 0) {
                            // common attributes whether creating new or updat
                            var avgdivID = "avgforpoll" + pollIdentifier.trim();
                            var avgdivselector = '#' + avgdivID;

                            //if ($scope.averages[pollIdentifier] == null) {
                                // insert the average into its box
                                $(avgdivselector).text(averageValue);
                                $scope.averages[pollIdentifier] = polls[pollIndex];
                            //}

                           // $scope.averages[pollIdentifier] = polls[pollIndex];
                        }
                    });
                }
            }

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
                    // clear down graphs, but not in "all polls" view.
                    if (!$scope.allPollsView) {
                        $scope.averages = [];
                        $('.poll-average').empty();
                    }
                });
                var pollIndex;
                for (pollIndex in slideData.polls) {
                    // get initial state for the poll answers from the hub on new page load.
                    RTCDeckHubService.RequestPollAnswers(slideData.polls[pollIndex].Identifier);
                }
            };

            $scope.$parent.$on("slideChangedForPollGraph", function (e, slideData: Models.SlideData) {
                $scope.applyslide(slideData);
            });
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData: Models.SlideData) {
                $scope.applyslide(slideData);
            });

            $scope.$parent.$on("notifyPollData", function (e, polls: Models.Poll[]) {
                $scope.updateAverages(polls);
            });

            $scope.$parent.$on("updatePollAnswers", function (e, pollIdentifier: string, pollAnswers: Models.Poll) {
                var polls = new Array<Models.Poll>();
                polls[0] = pollAnswers;
                $scope.updateAverages(polls);
            });
            $scope.$parent.$on("clearPollGraphs", function (e) {
                if (!$scope.allPollsView) {
                    $scope.averages = [];
                    $('.poll-average').empty();
                }
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
            });

        }

    }

}

var app = angular.module("PollAverageView", ["ngSanitize"]);

app.value('$', $);
app.factory('RTCDeckHubService', function ($, $rootScope) {return new Services.RTCDeckHubService($, $rootScope, window) });
app.controller('Controllers.PollAverageViewCtrl', PGV_Controllers.PollAverageViewCtrl);
