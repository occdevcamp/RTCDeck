// Module
var Models;
(function (Models) {
    // Class
    var ViewModel = (function () {
        function ViewModel(components) {
            this.components = components;
        }
        return ViewModel;
    })();
    Models.ViewModel = ViewModel;
})(Models || (Models = {}));

var Controllers;
(function (Controllers) {
    // Class
    var SlideComponentCtrl = (function () {
        // Constructor
        function SlideComponentCtrl($scope) {
            this.$scope = $scope;
            $scope.changeSlide = function (slideData) {
                alert("changing to " + slideData.index);
            };
        }
        return SlideComponentCtrl;
    })();
    Controllers.SlideComponentCtrl = SlideComponentCtrl;
})(Controllers || (Controllers = {}));

angular.module("slideData", []).directive("slide-component", function () {
    return {
        restrict: 'E',
        scope: {},
        controller: Controllers.SlideComponentCtrl,
        template: '<div class="slide-component-content" ng-transclude></div>',
        replace: true
    };
});
//# sourceMappingURL=models.js.map
