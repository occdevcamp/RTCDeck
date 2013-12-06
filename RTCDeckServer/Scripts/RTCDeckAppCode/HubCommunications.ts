
/// <reference path='Models.ts'/>

module Services {

    export class RTCDeckHubService {
        private proxy: HubProxy;
        private isPrimaryPresentation: boolean;
        public sendCurrentSlideData: Function;
        public SendPresentationNavigationCommand: Function;
        public SendResetCommand: Function;
        public requestCurrentSlide: Function;
        public sendPollAnswer: Function;
        public RequestPollAnswers: Function;
        public sendDraw: Function;
        public requestPresentationTimeElapsed: Function;
        public startPresentationTimer: Function;

        constructor($, $rootScope, $window, $isPrimaryPresentation = false) {
            var connection: HubConnection = $.hubConnection($window.HUB_URL);
            this.proxy = connection.createHubProxy($window.HUB_NAME);
            this.isPrimaryPresentation = $isPrimaryPresentation;
            connection.start().done(
                function () {
                    $rootScope.$emit("connectionStarted")
                });

            //sending

            this.sendCurrentSlideData = function (slideData: Models.SlideData) {
                if (this.isPrimaryPresentation) {
                    this.proxy.invoke('SetCurrentSlide', slideData);
                }
            }

            this.SendPresentationNavigationCommand = function (command: string) {
                this.proxy.invoke('SendPresentationNavigationCommand', command);
            };

            this.SendResetCommand = function () {
                this.proxy.invoke('ResetPresentation');
            }

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
            this.proxy.on("notifyTimerStarted", function () {
                $rootScope.$broadcast("acceptTimerStarted");
            });
            this.proxy.on("notifyPollData", function (polls: Models.Poll[]) {
                $rootScope.$broadcast("notifyPollData", polls);
            });

            this.proxy.on("receivePresentationNavigationCommand", function (command: string) {
                if (this.isPrimaryPresentation) {
                    $rootScope.$emit("receivePresentationNavigationCommand", command);
                }
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