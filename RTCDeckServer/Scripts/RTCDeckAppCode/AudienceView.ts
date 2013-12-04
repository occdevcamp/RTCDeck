/// <reference path='HubCommunications.ts'/>



module Models {

    export interface AudienceViewModel extends ng.IScope {
        slideData: Models.SlideData;
        updateSlideIndex(slideData: Models.SlideData): void;
        sendPollAnswer(pollID: string, optionID: number);
        selectAnswer(poll: Models.Poll,option: Models.PollOption)
    }
}

module Controllers {


    // Class
    export class AudienceViewCtrl {
        // Constructor
        constructor(private $scope: Models.AudienceViewModel, private RTCDeckHubService: Services.RTCDeckHubService, private $window) {


            $scope.slideData = { indexh: 0, indexv: 0, supplementaryContent: "" };

            $scope.updateSlideIndex = function (slideData: Models.SlideData) {
                $scope.$apply(function () {
                    $scope.slideData = slideData;
                });
            };

            $scope.selectAnswer = function (poll : Models.Poll, option: Models.PollOption) {
                $scope.sendPollAnswer(poll.Identifier, option.OptionID);
            }

            $scope.sendPollAnswer = function (pollID: string, optionID: number) {
                $window.alert("answer to " + pollID + " is " + optionID);
            }
            
            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData: Models.SlideData) {
                $scope.updateSlideIndex(slideData);
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
            });

        }

    }


}

var app = angular.module("audienceView", ["ngSanitize"]);


app.value('$', $);
app.factory('RTCDeckHubService', function ($, $rootScope) {return new Services.RTCDeckHubService($, $rootScope,window) });
app.controller('Controllers.AudienceViewCtrl', Controllers.AudienceViewCtrl);
app.directive("question", function () {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        controller: function ($scope, $element: Element) {
            var poll = $scope.poll = $scope.$parent.poll;

            $scope.select = function (option: Models.PollOption) {
                $scope.$parent.$parent.sendPollAnswer(poll.Identifier, option.OptionID);
            }
        },
        template:
        '<div>' +
        '<a href="" ng-click="select(option)">  </a>'+
        '{{poll.Question}}' +
        '<ul>' +
        '<li ng-repeat="option in poll.Options">' +
        '<a href="#" ng-click="select(option)">' +
        '<img src="{{option.OptionImagePath}}" alt="{{option.OptionText}}">' +
        '</a > ' +
        '</li>' +
        '</ul>' +
        '</div>',
        replace: true
    };
});

