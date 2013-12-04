
/// <reference path='Models.ts'/>

module Services {

    export class RTCDeckHubService {
        private proxy: HubProxy;
        public sendCurrentSlideData: Function;
        public SendPresentationNavigationCommand: Function;

        constructor($, $rootScope, $window) {
            var connection: HubConnection = $.hubConnection($window.HUB_URL);
            this.proxy = connection.createHubProxy($window.HUB_NAME);

            connection.start();

            //sending

            this.sendCurrentSlideData = function (slideData: Models.SlideData) {
                this.proxy.invoke('SetCurrentSlide', slideData);
            }

            //receiving
            this.proxy.on("notifyCurrentSlide", function (slideData: Models.SlideData) {
                $rootScope.$emit("acceptCurrentSlideIndex", slideData);
            });

            this.proxy.on("receivePresentationNavigationCommand", function (command: string) {
                $rootScope.$emit("receivePresentationNavigationCommand", command);
            });

            //this.SendPresentationNavigationCommand = function (command: string) {
            //    this.proxy.invoke('SendPresentationNavigationCommand', command);
            //};
        }
    }




}