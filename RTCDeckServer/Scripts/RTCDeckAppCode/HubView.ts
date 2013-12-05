/// <reference path='HubCommunications.ts'/>
module Models {

    export interface HubViewModel extends ng.IScope {
		// props
        slideData: Models.SlideData;
        slideDataForForm: Models.SlideData;
		navigationCommandIn: string;
        navigationCommandOut: string;
        latestPollAnswers: Models.Poll; // transitory debug data only here

		// methods
        updateSlideIndex(slideData: Models.SlideData): void;
		sendSlideUpdate(): void;
        sendNavigationCommand(): void;

    }
}

module Controllers {

    // Class
    export class HubViewCtrl {
        // Constructor
        constructor(private $scope: Models.HubViewModel, private RTCDeckHubService: Services.RTCDeckHubService, private $window) {
            $scope.slideData = { indexh: 1, indexv: 0, speakerNotes: "", supplementaryContent: "" };

            $scope.updateSlideIndex = function (slideData: Models.SlideData) {
                $scope.$apply(function () {
                    $scope.slideData = slideData;
					$scope.slideDataForForm = slideData;
                });
            };

			$scope.sendSlideUpdate = function() {
				if (!$('#setCurrentSlide_simplepoll').is(':checked')) {
					$scope.slideDataForForm.polls = null;
				}
				else {
					$scope.slideDataForForm.polls = [
						{
							Identifier: "PollForSlide1",
							Question: "Is this slide helpful?",
							Style: "ThumbsUpThumbsDown",
							Options: [{ OptionID: 1, OptionImagePath: null, OptionText: "Yes" }, { OptionID: 2, OptionImagePath: null, OptionText: "No" }]
						},
						{
							Identifier: "AnotherPollForSlide1",
							Question: "Do you like bananas?",
							Style: "ThumbsUpThumbsDown",
							Options: [{ OptionID: 1, OptionImagePath: null, OptionText: "Yes" }, { OptionID: 2, OptionImagePath: null, OptionText: "No" }]
						}
					];
				}
				RTCDeckHubService.sendCurrentSlideData($scope.slideDataForForm);
			};

			$scope.sendNavigationCommand = function() {
				RTCDeckHubService.SendPresentationNavigationCommand($scope.navigationCommandOut);
			}

            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData: Models.SlideData) {
                $scope.updateSlideIndex(slideData);
            });
			$scope.$parent.$on("receivePresentationNavigationCommand", function (e, command: string) {
                $scope.$apply(function () {
                    $scope.navigationCommandIn = command;
                    $scope.navigationCommandOut = command;
                });
			});
            $scope.$parent.$on("updatePollAnswers", function (e, pollIdentifier: string, pollAnswers: Models.Poll) {
                $scope.$apply(function () {
                    $scope.latestPollAnswers = pollAnswers;
                });
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
            });

        }

    }

}

var app = angular.module("hubView", ["ngSanitize"]);

app.value('$', $);
app.factory('RTCDeckHubService', function ($, $rootScope) {return new Services.RTCDeckHubService($, $rootScope, window) });
app.controller('Controllers.HubViewCtrl', Controllers.HubViewCtrl);
