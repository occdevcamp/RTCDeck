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
                this.proxy.invoke('SetCurrentSlide', slideData.indexh, slideData.v);
            };

            this.sendCurrentSlideData = function (indexh: number, indexv: number, notesData: string) {
                this.proxy.invoke('SetCurrentSlide', indexh, indexv, notesData);
            }

            //receiving
            this.proxy.on("notifyCurrentSlide", function (indexh: number, indexv: number) {
                $rootScope.$emit("acceptCurrentSlideIndex", { h: indexh, v: indexv });
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