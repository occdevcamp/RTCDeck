
/// <reference path='Models.ts'/>

module Services {

    export class RTCDeckHubService {
        private proxy: HubProxy;
        public sendCurrentSlideData: Function;
        public SendPresentationNavigationCommand: Function;
        public requestCurrentSlide: Function;
        public sendPollAnswer: Function;
        public sendDraw: Function;

        constructor($, $rootScope, $window) {
            var connection: HubConnection = $.hubConnection($window.HUB_URL);
            this.proxy = connection.createHubProxy($window.HUB_NAME);

            connection.start().done(
                function () {
                    $rootScope.$emit("connectionStarted")
                });

            //sending

            this.sendCurrentSlideData = function (slideData: Models.SlideData) {
                this.proxy.invoke('SetCurrentSlide', slideData);
            }

            this.SendPresentationNavigationCommand = function (command: string) {
                this.proxy.invoke('SendPresentationNavigationCommand', command);
            };

            this.sendPollAnswer = function (answer: Models.PollAnswer) {
                console.log(answer);
                this.proxy.invoke('AddPollAnswer', answer);
            };

            this.requestCurrentSlide = function () {
                this.proxy.invoke('RequestCurrentSlide');
            }

            this.sendDraw = function (message: string) {
                this.proxy.invoke('SendDraw', message);
            }

            //receiving
            this.proxy.on("notifyCurrentSlide", function (slideData: Models.SlideData) {
                $rootScope.$emit("acceptCurrentSlideIndex", slideData);
            });

            this.proxy.on("receivePresentationNavigationCommand", function (command: string) {
                $rootScope.$emit("receivePresentationNavigationCommand", command);
            });

            this.proxy.on("receiveDrawing", function (message: string) {
                $rootScope.$emit("receiveDrawing", message);
            });

            this.proxy.on("updatePollAnswers", function (pollIdentifier: string, pollAnswers: Models.Poll) {
                $rootScope.$emit("updatePollAnswers", pollIdentifier, pollAnswers);
            });
        }
    }




}