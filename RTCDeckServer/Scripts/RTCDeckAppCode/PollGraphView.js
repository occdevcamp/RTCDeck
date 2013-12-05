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

            $scope.init = function (allPollsView) {
                $scope.allPollsView = allPollsView;
            };

            //bind to events from server
            $scope.applyslide = function (slideData) {
                if ($scope.slideData != null && slideData.indexh == $scope.slideData.indexh && slideData.indexv == $scope.slideData.indexv)
                    return;
                $scope.$apply(function () {
                    // store data: we probably don't need this, and in the case of the dashboard we definitely don't.
                    // but for debug it proves we're showing polls for the current slide
                    $scope.slideData = slideData;

                    if (!$scope.allPollsView)
                        $scope.pollAnswers = [];

                    if ($scope.pollAnswers == null)
                        $scope.pollAnswers = [];

                    var pollIndex;
                    for (pollIndex in slideData.polls) {
                        $scope.pollAnswers[$scope.pollAnswers.length] = slideData.polls[pollIndex];
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

            $scope.$parent.$on("updatePollAnswers", function (e, pollIdentifier, pollAnswers) {
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
