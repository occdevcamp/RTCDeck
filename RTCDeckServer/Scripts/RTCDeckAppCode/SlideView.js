var app = angular.module("slideView", []);

app.value('$', $);
app.factory('RTCDeckHubService', ["$", "$rootScope", function ($, $rootScope) {
        return new Services.RTCDeckHubService($, $rootScope, window);
    }]);
app.controller('Controllers.SlideViewCtrl', ["$scope", "RTCDeckHubService", "$window", Controllers.SlideViewCtrl]);
//# sourceMappingURL=SlideView.js.map
