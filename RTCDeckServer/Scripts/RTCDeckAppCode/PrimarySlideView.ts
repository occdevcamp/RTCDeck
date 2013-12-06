var app = angular.module("slideView", []);

app.value('$', $);
app.factory('RTCDeckHubService', ["$","$rootScope",function ($, $rootScope) {return new Services.RTCDeckHubService($, $rootScope, window, true) }]);
app.controller('Controllers.SlideViewCtrl', ["$scope", "RTCDeckHubService", "$window",Controllers.SlideViewCtrl]);

