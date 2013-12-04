/// <reference path='HubCommunications.ts'/>
var Controllers;
(function (Controllers) {
    // Class
    var SlideViewCtrl = (function () {
        // Constructor
        function SlideViewCtrl($scope, RTCDeckHubService, $window) {
            this.$scope = $scope;
            this.RTCDeckHubService = RTCDeckHubService;
            this.$window = $window;
            $scope.sendCurrentSlideData = function (slideData) {
                RTCDeckHubService.sendCurrentSlideData(slideData);
            };

            $scope.getAsideContent = function (tag) {
                var slideElement = $window.Reveal.getCurrentSlide();

                //the casting here is to avoid problems with incorrect types in the core def file - Element.innerHtml does not exist, but should.
                var content = slideElement.querySelector('aside.' + tag);
                var contenthtml = content ? content.innerHTML : '';
                return contenthtml;
            };

            $scope.getQuestions = function () {
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
                var notesHtml = $scope.getAsideContent("notes");
                var supplementaryContentHtml = $scope.getAsideContent("supplementary");
                $scope.sendCurrentSlideData({ indexh: event.indexh, indexv: event.indexv, speakerNotes: notesHtml, supplementaryContent: supplementaryContentHtml });
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
app.factory('RTCDeckHubService', function ($, $rootScope) {
    return new Services.RTCDeckHubService($, $rootScope, window);
});
app.controller('Controllers.SlideViewCtrl', Controllers.SlideViewCtrl);
//# sourceMappingURL=SlideView.js.map
