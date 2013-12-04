var Services;
(function (Services) {
    var RTCDeckHubService = (function () {
        function RTCDeckHubService($, $rootScope) {
            var connection = $.hubConnection();
            this.proxy = connection.createHubProxy("RTCDeckHub");
            connection.start();

            //sending
            this.sendCurrentSlideIndex = function (slideData) {
                this.proxy.invoke('SetCurrentSlide', slideData.indexh, slideData.v);
            };

            this.sendCurrentSlideData = function (indexh, indexv, notesData) {
                this.proxy.invoke('SetCurrentSlide', indexh, indexv, notesData);
            };

            //receiving
            this.proxy.on("notifyCurrentSlide", function (indexh, indexv) {
                $rootScope.$emit("acceptCurrentSlideIndex", { h: indexh, v: indexv });
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
