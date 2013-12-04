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
            };

            this.SendPresentationNavigationCommand = function (command) {
                this.proxy.invoke('SendPresentationNavigationCommand', command);
            };

            this.requestCurrentSlide = function () {
                this.proxy.invoke('RequestCurrentSlide');
            };

            //receiving
            this.proxy.on("notifyCurrentSlide", function (slideData) {
                $rootScope.$emit("acceptCurrentSlideIndex", slideData);
            });

            this.proxy.on("receivePresentationNavigationCommand", function (command) {
                $rootScope.$emit("receivePresentationNavigationCommand", command);
            });
        }
        return RTCDeckHubService;
    })();
    Services.RTCDeckHubService = RTCDeckHubService;
})(Services || (Services = {}));
//# sourceMappingURL=HubCommunications.js.map
