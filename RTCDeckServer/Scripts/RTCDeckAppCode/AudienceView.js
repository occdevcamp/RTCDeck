/// <reference path='HubCommunications.ts'/>
var Controllers;
(function (Controllers) {
    // Class
    var AudienceViewCtrl = (function () {
        // Constructor
        function AudienceViewCtrl($scope, RTCDeckHubService, $window) {
            this.$scope = $scope;
            this.RTCDeckHubService = RTCDeckHubService;
            this.$window = $window;
            $scope.slideData = { indexh: 0, indexv: 0, supplementaryContent: "" };

            $scope.updateSlideIndex = function (slideData) {
                $scope.$apply(function () {
                    $scope.slideData = slideData;
                });
            };

            $scope.selectAnswer = function (poll, option) {
                RTCDeckHubService.sendPollAnswer(new Models.PollAnswer(poll, option));
            };

            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData) {
                $scope.updateSlideIndex(slideData);
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
            });
        }
        return AudienceViewCtrl;
    })();
    Controllers.AudienceViewCtrl = AudienceViewCtrl;
})(Controllers || (Controllers = {}));

var app = angular.module("audienceView", ["ngSanitize"]);

app.value('$', $);
app.factory('RTCDeckHubService', function ($, $rootScope) {
    return new Services.RTCDeckHubService($, $rootScope, window);
});
app.controller('Controllers.AudienceViewCtrl', Controllers.AudienceViewCtrl);
//# sourceMappingURL=AudienceView.js.map
