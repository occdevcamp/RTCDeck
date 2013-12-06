/// <reference path='HubCommunications.ts'/>
var PGV_Controllers;
(function (PGV_Controllers) {
    // Class
    var PollGraphViewCtrl = (function () {
        // Constructor
        function PollGraphViewCtrl($scope, RTCDeckHubService, $window) {
            this.$scope = $scope;
            this.RTCDeckHubService = RTCDeckHubService;
            this.$window = $window;
            $scope.allPollsView = false;
            $scope.graphs = [];

            $scope.init = function (allPollsView) {
                $scope.allPollsView = allPollsView;
            };

            $scope.updateGraphs = function (polls) {
                // this function builds up a set of graphs in the "graphs" div.
                // well, it will one day any way. hopefully today.
                // strategy: loop through pollAnswers. Check whether a graph has been made or not
                // if not, add a new graph. if yes, update the existing graph.
                // I probably could have written this whole section without adding the "graphs" array
                // but this allows me to leave original debug-type code in place still working throughout which
                // is useful. If ever revisiting this code we should probably merge "pollAnswers" and "graphs"
                //console.log('updating graphs');
                var pollIndex, pollIdentifier, pollData;
                for (pollIndex in polls) {
                    pollIdentifier = polls[pollIndex].Identifier;
                    pollData = polls[pollIndex].Options;

                    $scope.$apply(function () {
                        // set up data for graph
                        var data = [];
                        for (var optionIndex in pollData) {
                            data[optionIndex] = { name: pollData[optionIndex].OptionText, value: pollData[optionIndex].Count };
                        }

                        // common attributes whether creating new or updat
                        var graphdivID = "graphforpoll" + pollIdentifier.trim();
                        var graphdivselector = '#' + graphdivID;
                        var graphdiv = '<svg id="' + graphdivID + '" class="chart"></svg>';
                        var margin = { top: 20, right: 30, bottom: 30, left: 40 }, width = 200 - margin.left - margin.right, height = 300 - margin.top - margin.bottom;

                        // Set up the axes
                        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1).domain(data.map(function (d) {
                            return d.name;
                        }));

                        var y = d3.scale.linear().domain([0, 100]).range([height, 0]);

                        var xAxis = d3.svg.axis().scale(x).orient("bottom");

                        if ($scope.graphs[pollIdentifier] == null) {
                            console.log('add a new graph for ' + pollIdentifier);

                            // make new div
                            $('#graphsDiv').append(graphdiv);

                            // Chart size
                            // Create the chart container
                            var chart = d3.select(graphdivselector).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                            // Create the bar and bar-label containers
                            var bar = chart.selectAll("g").data(data).enter().append("g").attr("class", "bar").attr("transform", function (d) {
                                return "translate(" + x(d.name) + ",0)";
                            });

                            // Create the bars
                            bar.append("rect").attr("y", function (d) {
                                return y(d.value);
                            }).attr("height", function (d) {
                                return height - y(d.value);
                            }).attr("width", x.rangeBand());

                            // Create the bar labels
                            bar.append("text").attr("x", x.rangeBand() / 2).attr("y", function (d) {
                                return y(d.value) - 3;
                            }).text(function (d) {
                                return d.value;
                            });

                            // Add the x-axis labels
                            chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

                            $scope.graphs[pollIdentifier] = polls[pollIndex];
                        } else {
                            console.log('update graph for ' + pollIdentifier);
                            var chart = d3.select(graphdivselector).select("g");
                            chart.selectAll("rect").data(data).transition().duration(1000).attr("y", function (d) {
                                return y(d.value);
                            }).attr("height", function (d) {
                                return height - y(d.value);
                            });

                            chart.selectAll(".bar text").data(data).transition().duration(1000).attr("y", function (d) {
                                return y(d.value) - 3;
                            }).text(function (d) {
                                return d.value;
                            });
                            $scope.graphs[pollIdentifier] = polls[pollIndex];
                        }
                        //console.log($scope.graphs);
                    });
                }
            };

            //bind to events from server
            $scope.applyslide = function (slideData) {
                if ($scope.slideData != null && slideData.indexh == $scope.slideData.indexh && slideData.indexv == $scope.slideData.indexv)
                    return;

                $scope.$apply(function () {
                    // store data: we probably don't need this, and in the case of the dashboard we definitely don't.
                    // but for debug it proves we're showing polls for the current slide
                    $scope.slideData = slideData;

                    // clear down graphs
                    $scope.graphs = [];
                    $('#graphsDiv').empty();
                });
                var pollIndex;
                for (pollIndex in slideData.polls) {
                    // get initial state for the poll answers from the hub on new page load.
                    RTCDeckHubService.RequestPollAnswers(slideData.polls[pollIndex].Identifier);
                }
            };

            $scope.$parent.$on("slideChangedForPollGraph", function (e, slideData) {
                $scope.applyslide(slideData);
            });
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData) {
                $scope.applyslide(slideData);
            });

            $scope.$parent.$on("notifyPollData", function (e, polls) {
                $scope.updateGraphs(polls);
            });

            $scope.$parent.$on("updatePollAnswers", function (e, pollIdentifier, pollAnswers) {
                var polls = new Array();
                polls[0] = pollAnswers;
                $scope.updateGraphs(polls);
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
            });
        }
        return PollGraphViewCtrl;
    })();
    PGV_Controllers.PollGraphViewCtrl = PollGraphViewCtrl;
})(PGV_Controllers || (PGV_Controllers = {}));

var app = angular.module("pollGraphView", ["ngSanitize"]);

app.value('$', $);
app.factory('RTCDeckHubService', function ($, $rootScope) {
    return new Services.RTCDeckHubService($, $rootScope, window);
});
app.controller('Controllers.pollGraphViewCtrl', PGV_Controllers.PollGraphViewCtrl);
//# sourceMappingURL=PollGraphView.js.map
