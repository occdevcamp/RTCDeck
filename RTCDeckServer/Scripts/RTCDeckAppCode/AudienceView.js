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
            $scope.updateSlideIndex = function (slideData) {
                $scope.slideData = slideData;
            };

            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData) {
                $scope.$apply(function () {
                    $scope.updateSlideIndex(slideData);
                });
            });
        }
        return AudienceViewCtrl;
    })();
    Controllers.AudienceViewCtrl = AudienceViewCtrl;
})(Controllers || (Controllers = {}));

var app = angular.module("audienceView", []);

app.value('$', $);
app.factory('RTCDeckHubService', function ($, $rootScope) {
    return new Services.RTCDeckHubService($, $rootScope, window);
});
app.controller('Controllers.AudienceViewCtrl', Controllers.AudienceViewCtrl);
//# sourceMappingURL=AudienceView.js.map
