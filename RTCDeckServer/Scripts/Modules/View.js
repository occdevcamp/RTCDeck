// Module
var View;
(function (View) {
    // Class
    var ViewConfig = (function () {
        // Constructor
        function ViewConfig(components) {
            this.components = components;
        }
        return ViewConfig;
    })();
    View.ViewConfig = ViewConfig;

    var ComponentConfig = (function () {
        function ComponentConfig(name, show) {
            this.name = name;
            this.show = show;
        }
        return ComponentConfig;
    })();
    View.ComponentConfig = ComponentConfig;
})(View || (View = {}));
//# sourceMappingURL=View.js.map
