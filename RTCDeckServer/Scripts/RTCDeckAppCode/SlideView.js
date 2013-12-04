/// <reference path='HubCommunications.ts'/>
/// <reference path='Models.ts'/>
var Controllers;
(function (Controllers) {
    // Class
    var SlideViewCtrl = (function () {
        // Constructor
        function SlideViewCtrl($scope, SignalRService, $window) {
            this.$scope = $scope;
            this.SignalRService = SignalRService;
            this.$window = $window;
            $scope.sendCurrentSlideIndex = function (slideData) {
                SignalRService.sendCurrentSlideIndex(slideData);
            };

            $scope.sendCurrentSlideIndex = function (indexh, indexv, notesData) {
                SignalRService.sendCurrentSlideData(indexh, indexv, notesData);
            };

            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData) {
                $scope.$apply(function () {
                    $window.Reveal.slide(slideData.indexh, slideData.indexv);
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
        SlideViewCtrl.prototype.getAsideContent = function (tag) {
            var slideElement = this.$window.Reveal.getCurrentSlide();

            //the casting here is to avoid problems with incorrect types in the core def file - Element.innerHtml does not exist, but should.
            var content = slideElement.querySelector('aside.' + tag);
            var contenthtml = content ? content.innerHTML : '';
            return JSON.stringify(contenthtml);
        };
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
    return new Services.RTCDeckHubService($, $rootScope);
});
app.controller('Controllers.SlideViewCtrl', Controllers.SlideViewCtrl);
//# sourceMappingURL=SlideView.js.map
