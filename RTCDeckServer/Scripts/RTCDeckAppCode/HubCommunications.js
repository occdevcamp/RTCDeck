/// <reference path='Models.ts'/>
var Services;
(function (Services) {
    var RTCDeckHubService = (function () {
        function RTCDeckHubService($, $rootScope, $window, $isPrimaryPresentation) {
            if (typeof $isPrimaryPresentation === "undefined") { $isPrimaryPresentation = false; }
            var connection = $.hubConnection($window.HUB_URL);
            this.proxy = connection.createHubProxy($window.HUB_NAME);
            this.isPrimaryPresentation = $isPrimaryPresentation;
            connection.start().done(function () {
                $rootScope.$emit("connectionStarted");
            });

            //sending
            this.sendCurrentSlideData = function (slideData) {
                if (this.isPrimaryPresentation) {
                    this.proxy.invoke('SetCurrentSlide', slideData);
                }
            };

            this.SendPresentationNavigationCommand = function (command) {
                this.proxy.invoke('SendPresentationNavigationCommand', command);
            };

            this.SendResetCommand = function () {
                this.proxy.invoke('ResetPresentation');
            };

            this.sendPollAnswer = function (answer) {
                this.proxy.invoke('AddPollAnswer', answer);
            };

            this.requestCurrentSlide = function () {
                this.proxy.invoke('RequestCurrentSlide');
            };
            this.requestPresentationTimeElapsed = function () {
                this.proxy.invoke('RequestPresentationTimeElapsed');
            };
            this.startPresentationTimer = function () {
                this.proxy.invoke('StartPresentationTimer');
            };

            this.RequestPollAnswers = function (pollIdentifier) {
                this.proxy.invoke('RequestPollAnswers', pollIdentifier);
            };

            this.sendDraw = function (message) {
                this.proxy.invoke('SendDraw', message);
            };

            //receiving
            this.proxy.on("notifyCurrentSlide", function (slideData) {
                $rootScope.$broadcast("acceptCurrentSlideIndex", slideData);
            });
            this.proxy.on("notifyTimerStarted", function () {
                $rootScope.$broadcast("acceptTimerStarted");
            });
            this.proxy.on("notifyPollData", function (polls) {
                $rootScope.$broadcast("notifyPollData", polls);
            });

            this.proxy.on("receivePresentationNavigationCommand", function (command) {
                if (this.isPrimaryPresentation) {
                    $rootScope.$emit("receivePresentationNavigationCommand", command);
                }
            });

            this.proxy.on("receiveDrawing", function (message) {
                $rootScope.$emit("receiveDrawing", message);
            });

            this.proxy.on("updatePollAnswers", function (pollIdentifier, pollAnswers) {
                $rootScope.$broadcast("updatePollAnswers", pollIdentifier, pollAnswers);
            });

            this.proxy.on("notifyTimeElapsed", function (secondsElapsed) {
                $rootScope.$broadcast("acceptTimeElapsed", secondsElapsed);
            });

            this.proxy.on("presenterClearPollGraphs", function () {
                $rootScope.$broadcast("clearPollGraphs");
            });
        }
        return RTCDeckHubService;
    })();
    Services.RTCDeckHubService = RTCDeckHubService;
})(Services || (Services = {}));
//# sourceMappingURL=HubCommunications.js.map
