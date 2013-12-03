
/// <reference path="../typings/signalr/signalr.d.ts" />


module Services {

    export class SignalRService {
        private proxy: HubProxy;
        public sendCurrentSlideIndex: Function;
        SendPresentationNavigationCommand: Function;
        constructor($, $rootScope) {
            var connection: HubConnection = $.hubConnection();
            this.proxy = connection.createHubProxy("RTCDeckHub");
            connection.start();

            this.proxy.on("notifyCurrentSlide", function (indexh: number, indexv: number) {
                $rootScope.$emit("acceptCurrentSlideIndex", { h: indexh, v: indexv });
            });

            this.sendCurrentSlideIndex = function (slideData: Models.SlideData) {
                this.proxy.invoke('SetCurrentSlide', slideData.h, slideData.v);
            };


            this.proxy.on("receivePresentationNavigationCommand", function (command:string) {
                $rootScope.$emit("receivePresentationNavigationCommand", command);
            });

            //this.SendPresentationNavigationCommand = function (command: string) {
            //    this.proxy.invoke('SendPresentationNavigationCommand', command);
            //};
        }
    }

    


}

// Module
module Models {

    // Class
    //export class ViewModel {
    //    constructor(public components: SlideComponent[]) { }
    //}

    export interface SlideData {
        h :number;
        v :number;
    }

    //export interface SlideComponent {
    //    name: string;
    //    changeSlide(slideData: SlideData);
    //}



}

module Controllers {

        // Class
        export class SlideViewCtrl {
            // Constructor
            constructor(private $scope, private SignalRService: Services.SignalRService, $window) {

                $scope.sendCurrentSlideIndex = function (slideData: Models.SlideData) {
                    SignalRService.sendCurrentSlideIndex(slideData);
                };

                //bind to events from server
                $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData: Models.SlideData) {
                    $scope.$apply(function () {
                        $window.Reveal.slide(slideData.h, slideData.v);
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
                    $scope.sendCurrentSlideIndex({ h: event.indexh, v: event.indexv });
                });


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
app.factory('SignalRService', function ($, $rootScope) {return new Services.SignalRService($, $rootScope) });
app.controller('Controllers.SlideViewCtrl', Controllers.SlideViewCtrl);

