/// <reference path='Models.ts'/>
var Services;
(function (Services) {
    var RTCDeckHubService = (function () {
        function RTCDeckHubService($, $rootScope) {
            var connection = $.hubConnection();
            this.proxy = connection.createHubProxy("RTCDeckHub");
            connection.start();

            //sending
            this.sendCurrentSlideIndex = function (slideData) {
                this.proxy.invoke('SetCurrentSlide', slideData.indexh);
            };

            this.sendCurrentSlideData = function (slideData) {
                this.proxy.invoke('SetCurrentSlide', slideData);
            };

            //receiving
            this.proxy.on("notifyCurrentSlide", function (slideData) {
                $rootScope.$emit("acceptCurrentSlideIndex", slideData);
            });

            this.proxy.on("receivePresentationNavigationCommand", function (command) {
                $rootScope.$emit("receivePresentationNavigationCommand", command);
            });
            //this.SendPresentationNavigationCommand = function (command: string) {
            //    this.proxy.invoke('SendPresentationNavigationCommand', command);
            //};
        }
        return RTCDeckHubService;
    })();
    Services.RTCDeckHubService = RTCDeckHubService;
})(Services || (Services = {}));
//# sourceMappingURL=HubCommunications.js.map
