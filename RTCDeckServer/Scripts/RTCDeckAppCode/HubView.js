var Controllers;
(function (Controllers) {
    // Class
    var HubViewCtrl = (function () {
        // Constructor
        function HubViewCtrl($scope, RTCDeckHubService, $window) {
            this.$scope = $scope;
            this.RTCDeckHubService = RTCDeckHubService;
            this.$window = $window;
            $scope.slideData = { indexh: 1, indexv: 0, speakerNotes: "", supplementaryContent: "" };

            $scope.updateSlideIndex = function (slideData) {
                $scope.$apply(function () {
                    $scope.slideData = slideData;
                    $scope.slideDataForForm = slideData;
                });
            };

            $scope.sendSlideUpdate = function () {
                if (!$('#setCurrentSlide_simplepoll').is(':checked')) {
                    $scope.slideDataForForm.polls = null;
                } else {
                    $scope.slideDataForForm.polls = [
                        {
                            Identifier: "PollForSlide1",
                            Question: "Is this slide helpful?",
                            Style: "ThumbsUpThumbsDown",
                            Options: [{ OptionID: 1, OptionImagePath: null, OptionText: "Yes" }, { OptionID: 2, OptionImagePath: null, OptionText: "No" }]
                        },
                        {
                            Identifier: "AnotherPollForSlide1",
                            Question: "Do you like bananas?",
                            Style: "ThumbsUpThumbsDown",
                            Options: [{ OptionID: 1, OptionImagePath: null, OptionText: "Yes" }, { OptionID: 2, OptionImagePath: null, OptionText: "No" }]
                        }
                    ];
                }
                RTCDeckHubService.sendCurrentSlideData($scope.slideDataForForm);
            };

            $scope.sendNavigationCommand = function () {
                RTCDeckHubService.SendPresentationNavigationCommand($scope.navigationCommandOut);
            };

            $scope.sendResetCommand = function () {
                RTCDeckHubService.SendResetCommand();
            };

            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData) {
                $scope.updateSlideIndex(slideData);
            });
            $scope.$parent.$on("receivePresentationNavigationCommand", function (e, command) {
                $scope.$apply(function () {
                    $scope.navigationCommandIn = command;
                    $scope.navigationCommandOut = command;
                });
            });
            $scope.$parent.$on("updatePollAnswers", function (e, pollIdentifier, pollAnswers) {
                $scope.$apply(function () {
                    $scope.latestPollAnswers = pollAnswers;
                });
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
            });
        }
        return HubViewCtrl;
    })();
    Controllers.HubViewCtrl = HubViewCtrl;
})(Controllers || (Controllers = {}));

var app = angular.module("hubView", ["ngSanitize"]);

app.value('$', $);
app.factory('RTCDeckHubService', function ($, $rootScope) {
    return new Services.RTCDeckHubService($, $rootScope, window);
});
app.controller('Controllers.HubViewCtrl', Controllers.HubViewCtrl);
//# sourceMappingURL=HubView.js.map
