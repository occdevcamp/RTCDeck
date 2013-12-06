var OccTheme = (function () {

	function initialize(contentPath) {
		var wrapper = document.querySelector('.reveal');
		var logo = createSingletonNode(wrapper, 'div', 'logo', '<img src="' + contentPath + 'reveal/theme/images/occlogo.png" alt="OCC Logo" />');
		var border = createSingletonNode(wrapper, 'div', 'bottom-border', '');

		wrapper = document.querySelector('.slides');
		var graphs = createSingletonNode(wrapper, 'div', 'graphs', '<div id="graphsDiv" ng-controller="PGV_Controllers.PollGraphViewCtrl"></div>')
	}

	/**
	 * Creates an HTML element and returns a reference to it.
	 * If the element already exists the existing instance will
	 * be returned.
	 */
	function createSingletonNode(container, tagname, classname, innerHTML) {

		var node = container.querySelector('.' + classname);
		if (!node) {
			node = document.createElement(tagname);
			node.classList.add(classname);
			if (innerHTML !== null) {
				node.innerHTML = innerHTML;
			}
			container.appendChild(node);
		}
		return node;

	}

	return {
		initialize: initialize
	};

})();