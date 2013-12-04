
/// <reference path='Models.ts'/>

module Services {

    export class RTCDeckHubService {
        private proxy: HubProxy;
        public sendCurrentSlideIndex: Function;
        public sendCurrentSlideData: Function;
        public SendPresentationNavigationCommand: Function;

        constructor($, $rootScope) {
            var connection: HubConnection = $.hubConnection();
            this.proxy = connection.createHubProxy("RTCDeckHub");
            connection.start();

            //sending
            this.sendCurrentSlideIndex = function (slideData: Models.SlideData) {
                this.proxy.invoke('SetCurrentSlide', slideData.indexh);
            };

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