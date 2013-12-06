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
                        var percentageValue, optionname, barlabel, optionsaretruncated = false, optionslabels = "";

                        for (var optionIndex in pollData)
                            total += pollData[optionIndex].Count;

                        for (var optionIndex in pollData) {
                            percentageValue = (total == 0) ? 0 : (Math.round(pollData[optionIndex].Count * 100 / total));
                            optionname = pollData[optionIndex].OptionText;
                            if (optionname == "Dislike")
                                barlabel = "Dislike";
else {
                                if (optionname.length > 5) {
                                    barlabel = optionname.substring(0, 1);
                                    optionsaretruncated = true;
                                } else
                                    barlabel = optionname;
                            }

                            data[optionIndex] = { name: barlabel, value: percentageValue, count: pollData[optionIndex].Count };
                        }
                        if (optionsaretruncated) {
                            optionslabels = "<ul>";
                            for (var optionIndex in pollData) {
                                optionslabels += "<li>" + pollData[optionIndex].OptionText + "</li>";
                            }
                            optionslabels += "</ul>";
                        }

                        if (total != 0) {
                            // common attributes whether creating new or updat
                            var graphdivID = "graphforpoll" + pollIdentifier.trim();
                            var graphdivselector = '#' + graphdivID;
                            var graphtags = '<svg id="' + graphdivID + '" class="chart"></svg>';
                            if ($scope.allPollsView) {
                                graphtags += "<p>" + polls[pollIndex].Question;
                                if (optionsaretruncated)
                                    graphtags += optionslabels;
                                graphtags += "</p>";
                            }

                            var height = 300, barWidth = 50, barMargin = 5, marginBottom = 30, marginTop = 30;

                            // Set up the axes
                            var x = d3.scale.ordinal().domain(data.map(function (d) {
                                return d.name;
                            })).rangeBands([0, data.length * (barWidth + barMargin)]);

                            var y = d3.scale.linear().domain([0, 100]).range([height, 0]);

                            var xAxis = d3.svg.axis().scale(x).orient("bottom");

                            if ($scope.graphs[pollIdentifier] == null) {
                                // make new svg in the main div
                                $('#graphsDiv').append(graphtags);

                                // Chart size
                                // Create the chart container
                                var chart = d3.select(graphdivselector).attr("width", data.length * (barWidth + barMargin)).attr("height", height + marginBottom + marginTop).append("g").attr("transform", "translate(0," + marginTop + ")");
                                ;

                                // Create the bar and bar-label containers
                                var bar = chart.selectAll("g").data(data).enter().append("g").attr("class", "bar").attr("width", barWidth + barMargin).attr("transform", function (d, i) {
                                    return "translate(" + i * (barWidth + barMargin) + ",0)";
                                });

                                // Create the bars
                                bar.append("rect").attr("y", function (d) {
                                    return y(0);
                                }).attr("height", function (d) {
                                    return height - y(0);
                                }).attr("width", barWidth);

                                // Create the bar labels
                                bar.append("text").attr("x", barWidth / 2).attr("y", function (d) {
                                    return y(0) - 3;
                                }).text(function (d) {
                                    return 0;
                                });

                                // Add the x-axis labels
                                chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

                                $scope.graphs[pollIdentifier] = polls[pollIndex];
                            }

                            // now update with results, even for new graphs to get slide-from-zero effect
                            var chart = d3.select(graphdivselector).select("g");
                            chart.selectAll("rect").data(data).transition().duration(1000).attr("y", function (d) {
                                return y(d.value);
                            }).attr("height", function (d) {
                                return height - y(d.value);
                            });

                            chart.selectAll(".bar text").data(data).transition().duration(1000).attr("y", function (d) {
                                return y(d.value) - 3;
                            }).text(function (d) {
                                return d.count;
                            });
                            $scope.graphs[pollIdentifier] = polls[pollIndex];
                        }
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
            $scope.$parent.$on("clearPollGraphs", function (e) {
                if (!$scope.allPollsView) {
                    $scope.graphs = [];
                    $('#graphsDiv').empty();
                }
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
