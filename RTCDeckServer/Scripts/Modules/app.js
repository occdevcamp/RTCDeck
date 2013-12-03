/// <reference path="../typings/signalr/signalr.d.ts" />
var Services;
(function (Services) {
    var SignalRService = (function () {
        function SignalRService($, $rootScope) {
            var connection = $.hubConnection();
            this.proxy = connection.createHubProxy("RTCDeckHub");
            connection.start();

            this.proxy.on("receiveCurrentSlideIndex", function (slideData) {
                $rootScope.$emit("acceptCurrentSlideIndex", slideData);
            });

            this.sendCurrentSlideIndex = function (slideData) {
                this.proxy.invoke('SetCurrentSlide', slideData.h, slideData.v);
            };

            this.proxy.on("receivePresentationNavigationCommand", function (command) {
                $rootScope.$emit("receivePresentationNavigationCommand", command);
            });
            //this.SendPresentationNavigationCommand = function (command: string) {
            //    this.proxy.invoke('SendPresentationNavigationCommand', command);
            //};
        }
        return SignalRService;
    })();
    Services.SignalRService = SignalRService;
})(Services || (Services = {}));

var Controllers;
(function (Controllers) {
    // Class
    var SlideViewCtrl = (function () {
        // Constructor
        function SlideViewCtrl($scope, SignalRService, $window) {
            this.$scope = $scope;
            this.SignalRService = SignalRService;
            $scope.sendCurrentSlideIndex = function (slideData) {
                SignalRService.sendCurrentSlideIndex(slideData);
            };

            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData) {
                $scope.$apply(function () {
                    $window.Reveal.slide(slideData.h, slideData.v);
                });
            });

            $scope.$parent.$on("receivePresentationNavigationCommand", function (e, command) {
                $scope.$apply(function () {
                    switch (command) {
                        case "left":
                            $window.Reveal.left();
                            break;
                        case "right":
                            $window.Reveal.right();
                            break;
                        case "up":
                            $window.Reveal.up();
                            break;
                        case "down":
                            $window.Reveal.down();
                            break;
                        default:
                            break;
                    }
                });
            });

            //slide change event
            $window.Reveal.addEventListener('slidechanged', function (event) {
                event.preventDefault();
                $scope.sendCurrentSlideIndex({ h: event.indexh, v: event.indexv });
            });
        }
        return SlideViewCtrl;
    })();
    Controllers.SlideViewCtrl = SlideViewCtrl;
})(Controllers || (Controllers = {}));

var app = angular.module("slideView", []);

//.directive("slide-component", function (): ng.IDirective {
//    return {
//        restrict: 'E',
//        scope: {},
//        controller: Controllers.SlideComponentCtrl,
//        template:
//        '<div class="slide-component-content" ng-transclude></div>',
//        replace: true
//    }
//});
app.value('$', $);
app.factory('SignalRService', function ($, $rootScope) {
    return new Services.SignalRService($, $rootScope);
});
app.controller('Controllers.SlideViewCtrl', Controllers.SlideViewCtrl);
//# sourceMappingURL=app.js.map
