var Controllers;
(function (Controllers) {
    // Class
    var SlideViewCtrl = (function () {
        // Constructor
        function SlideViewCtrl($scope, RTCDeckHubService, $window) {
            this.$scope = $scope;
            this.RTCDeckHubService = RTCDeckHubService;
            this.$window = $window;
            $scope.sendCurrentSlideData = function () {
                var slideData = $scope.getSlideData();
                RTCDeckHubService.sendCurrentSlideData(slideData);
            };

            $scope.getAsideContent = function (tag) {
                var slideElement = $window.Reveal.getCurrentSlide();

                //the casting here is to avoid problems with incorrect types in the core def file - Element.innerHtml does not exist, but should.
                var content = slideElement.querySelector('aside.' + tag);
                var contenthtml = content ? content.innerHTML : '';
                return contenthtml;
            };

            $scope.getPolls = function () {
                var slideElement = $window.Reveal.getCurrentSlide();
                var content = slideElement.querySelector('aside.polls');
                var polls = $(content).data("polls");
                if (!polls || typeof polls === "string") {
                    return [];
                }
                return polls;
            };

            //bind to events from server
            $scope.$parent.$on("acceptCurrentSlideIndex", function (e, slideData) {
                $scope.$apply(function () {
                    if (slideData.indexh >= 0 && slideData.indexv >= 0) {
                        $window.Reveal.slide(slideData.indexh, slideData.indexv, slideData.indexf);
                    } else {
                        //hub doesn't know what the current slide is, so tell it.
                        $scope.sendCurrentSlideData();
                    }
                });
            });

            $scope.$parent.$on("receivePresentationNavigationCommand", function (e, command) {
                $scope.$apply(function () {
                    switch (command) {
                        case "left":
                            $window.Reveal.left();
                            break;
                        case "right":
                            $window.Reveal.right();
                            break;
                        case "up":
                            $window.Reveal.up();
                            break;
                        case "down":
                            $window.Reveal.down();
                            break;
                        default:
                            break;
                    }
                });
            });

            $scope.$parent.$on("receiveDrawing", function (e, message) {
                var drawObject = jQuery.parseJSON(message);
                $window.drawIt(drawObject, false);
            });

            $scope.getSlideData = function () {
                var indices = $window.Reveal.getIndices();
                var notesHtml = $scope.getAsideContent("notes");
                var supplementaryContentHtml = $scope.getAsideContent("supplementary");
                var polls = $scope.getPolls();
                var slideData = { indexh: indices.h, indexv: indices.v, indexf: indices.f, speakerNotes: notesHtml, supplementaryContent: supplementaryContentHtml, polls: polls };
                return slideData;
            };

            //slide change event
            $window.Reveal.addEventListener('slidechanged', function (event) {
                event.preventDefault();
                $scope.sendCurrentSlideData();
            });

            //fragment change event
            $window.Reveal.addEventListener('fragmentschanged', function (event) {
                event.preventDefault();
                $scope.sendCurrentSlideData();
            });

            //fragment change event
            $window.addEventListener('drawing', function (event) {
                RTCDeckHubService.sendDraw(event.detail.message);
            });

            //initialise
            $scope.$parent.$on("connectionStarted", function (e) {
                RTCDeckHubService.requestCurrentSlide();
            });
        }
        return SlideViewCtrl;
    })();
    Controllers.SlideViewCtrl = SlideViewCtrl;
})(Controllers || (Controllers = {}));
//# sourceMappingURL=SlideViewCtrl.js.map
