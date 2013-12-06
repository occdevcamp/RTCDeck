var OccTheme = (function () {

	function initialize(contentPath) {
		var wrapper = document.querySelector('.reveal');
		var logo = createSingletonNode(wrapper, 'div', 'logo', '<img src="' + contentPath + 'reveal/theme/images/occlogo.png" alt="OCC Logo" />');
		var border = createSingletonNode(wrapper, 'div', 'bottom-border', '');
		var topMenu = createSingletonNode(wrapper, 'div', 'topMenu',
			'<input id="cbxMenu" class="cbs1-selector-1" type="checkbox" value="" name="box-set-1"></input> \
			<label class="cbs1-label-1" for="cbxMenu"> \
			<img alt="" src="' + contentPath + 'images/menu.png"></img> \
			</label>');
		var menu = createSingletonNode(topMenu, 'div', 'menu',
			'<input id="cbxAnnotation" class="cbs1-selector-2" type="checkbox" value="" name="box-set-1" onchange="showHideCanvas()"></input> \
			<label class="cbs1-label-2" for="cbxAnnotation"> \
			<img alt="" src="' + contentPath + 'images/annotation.png"></img> \
			</label> \
			<input id="cbxPen" class="cbs1-selector-3" type="checkbox" value="" name="box-set-1" onchange="drawOnCanvas()"></input> \
			<label class="cbs1-label-3" for="cbxPen"> \
			<img alt="" src="' + contentPath + 'images/pen.png"></img> \
			</label> \
			<input id="cbxSecondScreen" class="cbs1-selector-4" type="checkbox" value="" name="box-set-1"></input> \
			<label class="cbs1-label-4" for="cbxSecondScreen"> \
			<img alt="" src="' + contentPath + 'images/secondScreen.png"></img> \
			</label>');

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
