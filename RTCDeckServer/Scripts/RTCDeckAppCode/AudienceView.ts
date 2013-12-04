/// <reference path='HubCommunications.ts'/>
/// <reference path='Models.ts'/>

interface AudienceViewModel extends ng.IScope {
    slideData: AudienceSlideData;

    updateSlideIndex(slideData: AudienceSlideData);
}

interface AudienceSlideData {
    indexh: number;
    indexv: number;
    notesHtml: string;

}

module Controllers {


    // Class
    export class AudienceViewCtrl {
        // Constructor
        constructor(private $scope: AudienceViewModel, private SignalRService: Services.RTCDeckHubService, private $window) {

            $scope.updateSlideIndex = function (slideData: AudienceSlideData) {
                $scope.slideData = slideData;
            };
            
            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData: Models.SlideData) {
                $scope.$apply(function () {
                    $scope.updateSlideIndex(slideData)
                });
            });

            


        }

    }


}

var app = angular.module("audienceView", []);


app.value('$', $);
app.factory('SignalRService', function ($, $rootScope) {return new Services.RTCDeckHubService($, $rootScope) });
app.controller('Controllers.AudienceViewCtrl', Controllers.AudienceViewCtrl);

