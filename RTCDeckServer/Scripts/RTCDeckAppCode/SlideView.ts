
/// <reference path='HubCommunications.ts'/>



module Controllers {

        // Class
        export class SlideViewCtrl {
            // Constructor
            constructor(private $scope, private SignalRService: Services.RTCDeckHubService, private $window) {

                $scope.sendCurrentSlideIndex = function (slideData: Models.SlideData) {
                    SignalRService.sendCurrentSlideData(slideData);
                };


                //bind to events from server
                $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData: Models.SlideData) {
                    $scope.$apply(function () {
                        $window.Reveal.slide(slideData.indexh, slideData.indexv);
                    });
                });

                $scope.$parent.$on("receivePresentationNavigationCommand", function (e, command :string) {
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
                            default: break;
                        }

                    });
                });
                //slide change event
                $window.Reveal.addEventListener('slidechanged', function (event) {
                    event.preventDefault();
                    $scope.sendCurrentSlideIndex({ indexh: event.indexh, indexv: event.indexv });
                });


            }

            getAsideContent(tag: string) {
                var slideElement : HTMLElement = this.$window.Reveal.getCurrentSlide();
                //the casting here is to avoid problems with incorrect types in the core def file - Element.innerHtml does not exist, but should.
                var content :any = slideElement.querySelector('aside.' + tag);
                var contenthtml = content ? content.innerHTML : '';
                return JSON.stringify(contenthtml);
            }

        }

    
    //// Class
    //export class SlideComponentCtrl {
    //    // Constructor
    //    constructor(private $scope) {

    //        $scope.sendCurrentSlideIndex = function (slideData: Models.SlideData) {
    //            alert("changing to " + slideData.h);
    //        }

    //    }
    //}

}

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
app.factory('SignalRService', function ($, $rootScope) {return new Services.RTCDeckHubService($, $rootScope) });
app.controller('Controllers.SlideViewCtrl', Controllers.SlideViewCtrl);

