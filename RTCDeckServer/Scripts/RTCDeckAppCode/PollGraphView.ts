/// <reference path='HubCommunications.ts'/>

module Models {

    export interface PollGraphViewModel extends ng.IScope {
        // props
        slideData: Models.SlideData;
        //pollAnswers: Models.Poll[];
        graphs: Models.Poll[];
        allPollsView: boolean;

        // methods
        applyslide(slideData: Models.SlideData): void;
        init(allPollsView: boolean): void;
        updateGraphs(polls: Models.Poll[]): void;
    }
}

module PGV_Controllers {

    // Class
    export class PollGraphViewCtrl {
        // Constructor
        constructor(private $scope: Models.PollGraphViewModel, private RTCDeckHubService: Services.RTCDeckHubService, private $window) {
            $scope.allPollsView = false;
            $scope.graphs = [];

            $scope.init = function (allPollsView: boolean) {
                $scope.allPollsView = allPollsView;
            };

            $scope.updateGraphs = function (polls: Models.Poll[]) {
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
                        var data = [];
                        var total = 0;
                        var percentageValue, optionname, barlabel;
                        // work out total so we can calc percentages
                        for (var optionIndex in pollData) total += pollData[optionIndex].Count;

                        for (var optionIndex in pollData) {
                            percentageValue = (total == 0) ? 0 : (Math.round(pollData[optionIndex].Count * 100 / total));
                            optionname = pollData[optionIndex].OptionText;
                            if (optionname == "Dislike")
                                barlabel = "Dislike";
                            else 
                                barlabel = (optionname.length > 5) ? optionname.substring(0, 1) : optionname;

                            data[optionIndex] = { name: barlabel, value: percentageValue, count: pollData[optionIndex].Count };
                        }

                        // if total == 0 we don't yet attempt to create a graph
                        if (total != 0) {
                            // common attributes whether creating new or updat
                            var graphdivID = "graphforpoll" + pollIdentifier.trim();
                            var graphdivselector = '#' + graphdivID;
                            var graphtags;
                            // IN PROGRESS: if ($scope.allPollsView) graphtags = "<h2>Polls for Slide ";
                            graphtags = '<svg id="' + graphdivID + '" class="chart"></svg>';
                            var margin = { top: 20, right: 30, bottom: 30, left: 40 },
                                width = 200 - margin.left - margin.right,
                                height = 300 - margin.top - margin.bottom;
                            // Set up the axes
                            var x = d3.scale.ordinal()
                                .rangeRoundBands([0, width], .1)
                                .domain(data.map(function (d) { return d.name; }));

                            var y = d3.scale.linear()
                                .domain([0, 100])
                                .range([height, 0]);

                            var xAxis = d3.svg.axis()
                                .scale(x)
                                .orient("bottom");

                            if ($scope.graphs[pollIdentifier] == null) {
                                // make new svg in the main div
                                $('#graphsDiv').append(graphtags);
                                // Chart size
                                // Create the chart container
                                var chart = d3.select(graphdivselector)
                                    .attr("width", width + margin.left + margin.right)
                                    .attr("height", height + margin.top + margin.bottom)
                                    .append("g")
                                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                                // Create the bar and bar-label containers
                                var bar = chart.selectAll("g")
                                    .data(data)
                                    .enter().append("g")
                                    .attr("class", "bar")
                                    .attr("transform", function (d) { return "translate(" + x(d.name) + ",0)"; });

                                // Create the bars
                                bar.append("rect")
                                    .attr("y", function (d) { return y(0); })
                                    .attr("height", function (d) { return height - y(0); })
                                    .attr("width", x.rangeBand());

                                // Create the bar labels
                                bar.append("text")
                                    .attr("x", x.rangeBand() / 2)
                                    .attr("y", function (d) { return y(0) - 3; })
                                    .text(function (d) { return 0 /*+ '%'*/; });

                                // Add the x-axis labels
                                chart.append("g")
                                    .attr("class", "x axis")
                                    .attr("transform", "translate(0," + height + ")")
                                    .call(xAxis);


                                $scope.graphs[pollIdentifier] = polls[pollIndex];
                            }

                            // now update with results, even for new graphs to get slide-from-zero effect
                            var chart = d3.select(graphdivselector).select("g");
                            chart.selectAll("rect")
                                .data(data)
                                .transition()
                                .duration(1000)
                                .attr("y", function (d) { return y(d.value); })
                                .attr("height", function (d) { return height - y(d.value); })

                            chart.selectAll(".bar text")
                                .data(data)
                                .transition()
                                .duration(1000)
                                .attr("y", function (d) { return y(d.value) - 3; })
                                .text(function (d) { return d.count /*+ '%'*/; });
                            $scope.graphs[pollIdentifier] = polls[pollIndex];

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
                        $scope.graphs = [];
                        $('#graphsDiv').empty();
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
                $scope.updateGraphs(polls);
            });

            $scope.$parent.$on("updatePollAnswers", function (e, pollIdentifier: string, pollAnswers: Models.Poll) {
                var polls = new Array<Models.Poll>();
                polls[0] = pollAnswers;
                $scope.updateGraphs(polls);
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
