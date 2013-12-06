/// <reference path='Models.ts'/>
var Services;
(function (Services) {
    var RTCDeckHubService = (function () {
        function RTCDeckHubService($, $rootScope, $window) {
            var connection = $.hubConnection($window.HUB_URL);
            this.proxy = connection.createHubProxy($window.HUB_NAME);

            connection.start().done(function () {
                $rootScope.$emit("connectionStarted");
            });

            //sending
            this.sendCurrentSlideData = function (slideData) {
                this.proxy.invoke('SetCurrentSlide', slideData);
                // there may be a nicer way of doing this.....
                // but I want my PollGraphView module to listen to the slide deck being changed
                // but we've disabled the slide deck getting a message back from the hub when this happens
                // so it has to be done internally in the client-side code
                //$rootScope.$broadcast('slideChangedForPollGraph', slideData);
            };

            this.SendPresentationNavigationCommand = function (command) {
                this.proxy.invoke('SendPresentationNavigationCommand', command);
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
            this.proxy.on("notifyPollData", function (polls) {
                $rootScope.$broadcast("notifyPollData", polls);
            });

            this.proxy.on("receivePresentationNavigationCommand", function (command) {
                $rootScope.$emit("receivePresentationNavigationCommand", command);
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
        }
        return RTCDeckHubService;
    })();
    Services.RTCDeckHubService = RTCDeckHubService;
})(Services || (Services = {}));
//# sourceMappingURL=HubCommunications.js.map
