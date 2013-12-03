// Module
var Models;
(function (Models) {
    // Class
    var ViewConfig = (function () {
        // Constructor
        function ViewConfig(components) {
            this.components = components;
        }
        return ViewConfig;
    })();
    Models.ViewConfig = ViewConfig;

    var Component = (function () {
        function Component(name, show) {
            this.name = name;
            this.show = show;
        }
        return Component;
    })();
    Models.Component = Component;
})(Models || (Models = {}));
//# sourceMappingURL=Model.js.map
