var OccTheme = (function () {

	function initialize(basePath) {
		var contentPath = basePath + '/Content/';
		var wrapper = document.querySelector('.reveal');
		var logo = createSingletonNode(wrapper, 'div', 'logo', '<img src="' + contentPath + 'reveal/theme/images/sbslogo.png" alt="SBS Logo" />');
		var border = createSingletonNode(wrapper, 'div', 'side-border', '<img src="' + contentPath + 'reveal/theme/images/sbsbackground.png" alt="SBS Accent" />');
		var footerleft = createSingletonNode(wrapper, 'p', 'footer-left', '&copy; Smets, Morris, Malhotra');
		var footerright = createSingletonNode(wrapper, 'p', 'footer-right', '13');

		var topMenu = createSingletonNode(wrapper, 'div', 'topMenu',
			'<input id="cbxMenu" class="cbs1-selector-1" type="checkbox" value="" name="box-set-1"></input> \
			<label class="cbs1-label-1" for="cbxMenu"> \
			<img alt="menu button" src="' + contentPath + 'images/menu.png"></img> \
			</label>');
		var menu = createSingletonNode(topMenu, 'div', 'menu',
			'<input id="cbxAnnotation" class="cbs1-selector-2" type="checkbox" value="" name="box-set-1" onchange="showHideCanvas()"></input> \
			<label class="cbs1-label-2" for="cbxAnnotation"> \
			<img alt="annotation button" src="' + contentPath + 'images/annotation.png"></img> \
			</label> \
			<input id="cbxPen" class="cbs1-selector-3" type="checkbox" value="" name="box-set-1" onchange="drawOnCanvas()"></input> \
			<label class="cbs1-label-3" for="cbxPen"> \
			<img alt="pen button" src="' + contentPath + 'images/pen.png"></img> \
            </label> \
			<a href="' + basePath + '/Presentation/Secondary"> \
			<img alt="second-screen button" src="' + contentPath + 'images/secondScreen.png"></img> \
			</a>');

		wrapper = document.querySelector('.slides');
		//var graphs = createSingletonNode(wrapper, 'div', 'graphs', '<div id="graphsDiv" ng-controller="PGV_Controllers.PollGraphViewCtrl"></div>')
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
