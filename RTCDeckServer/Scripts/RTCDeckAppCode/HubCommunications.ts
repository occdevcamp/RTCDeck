
/// <reference path='Models.ts'/>

module Services {

    export class RTCDeckHubService {
        private proxy: HubProxy;
        public sendCurrentSlideData: Function;
        public SendPresentationNavigationCommand: Function;
        public requestCurrentSlide: Function;
        public sendPollAnswer: Function;
        public RequestPollAnswers: Function;
        public sendDraw: Function;
        public requestPresentationTimeElapsed: Function;
        public startPresentationTimer: Function;

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
                // there may be a nicer way of doing this.....
                // but I want my PollGraphView module to listen to the slide deck being changed 
                // but we've disabled the slide deck getting a message back from the hub when this happens
                // so it has to be done internally in the client-side code
                //$rootScope.$broadcast('slideChangedForPollGraph', slideData);
            }

            this.SendPresentationNavigationCommand = function (command: string) {
                this.proxy.invoke('SendPresentationNavigationCommand', command);
            };

            this.sendPollAnswer = function (answer: Models.PollAnswer) {
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

            this.RequestPollAnswers = function (pollIdentifier: string) {
                this.proxy.invoke('RequestPollAnswers', pollIdentifier);
            };

            this.sendDraw = function (message: string) {
                this.proxy.invoke('SendDraw', message);
            }

            //receiving
            this.proxy.on("notifyCurrentSlide", function (slideData: Models.SlideData) {
                $rootScope.$broadcast("acceptCurrentSlideIndex", slideData);
            });
            this.proxy.on("notifyPollData", function (polls: Models.Poll[]) {
                $rootScope.$broadcast("notifyPollData", polls);
            });

            this.proxy.on("receivePresentationNavigationCommand", function (command: string) {
                $rootScope.$emit("receivePresentationNavigationCommand", command);
            });

            this.proxy.on("receiveDrawing", function (message: string) {
                $rootScope.$emit("receiveDrawing", message);
            });

            this.proxy.on("updatePollAnswers", function (pollIdentifier: string, pollAnswers: Models.Poll) {
                $rootScope.$broadcast("updatePollAnswers", pollIdentifier, pollAnswers);
            });

            this.proxy.on("notifyTimeElapsed", function (secondsElapsed : number) {
                $rootScope.$broadcast("acceptTimeElapsed", secondsElapsed);
            });
        }
    }




}