webpackJsonp([95,24],{

/***/ 169:
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },

/***/ 173:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },

/***/ 229:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _rcPager = __webpack_require__(230);

	var _rcPager2 = _interopRequireDefault(_rcPager);

	__webpack_require__(232);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Pager = function (_React$Component) {
		_inherits(Pager, _React$Component);

		function Pager(props) {
			_classCallCheck(this, Pager);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pager).call(this, props));

			_this.state = {
				current: 0
			};
			return _this;
		}

		_createClass(Pager, [{
			key: 'handleSkip',
			value: function handleSkip(page) {
				this.setState({
					current: page
				});
				if (this.props.onSkipTo) {
					this.props.onSkipTo(page + 1);
				};
			}
		}, {
			key: 'render',
			value: function render() {
				return _react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(_rcPager2.default, { total: this.props.total, current: this.state.current, onSkipTo: this.handleSkip.bind(this) })
				);
			}
		}]);

		return Pager;
	}(_react2.default.Component);

	;

	exports.default = Pager;

/***/ },

/***/ 230:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(231);

/***/ },

/***/ 231:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _get = function get(_x, _x2, _x3) {
	  var _again = true;_function: while (_again) {
	    var object = _x,
	        property = _x2,
	        receiver = _x3;desc = parent = getter = undefined;_again = false;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
	      }
	    } else if ('value' in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;if (getter === undefined) {
	        return undefined;
	      }return getter.call(receiver);
	    }
	  }
	};

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== 'function' && superClass !== null) {
	    throw new TypeError('Super expression must either be null or a function, not ' + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
	}

	var React = __webpack_require__(2);

	var PagerItem = function (_React$Component) {
	  function PagerItem() {
	    _classCallCheck(this, PagerItem);

	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }

	  _inherits(PagerItem, _React$Component);

	  _createClass(PagerItem, [{
	    key: 'handleClick',
	    value: function handleClick(ev) {
	      ev.preventDefault();
	      if (!this.props.active && !this.props.disabled) {
	        this.props.skipTo(this.props.page);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var status = this.props.active ? 'rc-pager-item-active' : '';
	      if (this.props.disabled) {
	        status += 'rc-pager-item-disabled';
	      }
	      return React.createElement('li', { onClick: this.handleClick.bind(this), className: status, key: 1 }, //<=
	      React.createElement('a', { href: '#' }, this.props.text));
	    }
	  }]);

	  return PagerItem;
	}(React.Component);

	/**
	 * @private
	 * 命令子项
	 */

	var CmdItem = function (_React$Component2) {
	  function CmdItem() {
	    _classCallCheck(this, CmdItem);

	    if (_React$Component2 != null) {
	      _React$Component2.apply(this, arguments);
	    }
	  }

	  _inherits(CmdItem, _React$Component2);

	  _createClass(CmdItem, [{
	    key: 'handleClick',
	    value: function handleClick(ev) {
	      ev.preventDefault();
	      if (!this.props.disabled) {
	        this.props.skipTo(this.props.page);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var disabled = this.props.disabled ? 'rc-pager-item-disabled' : '';
	      return React.createElement('li', { onClick: this.handleClick.bind(this), className: disabled }, React.createElement('a', { href: '#' }, React.createElement('span', { 'aria-hidden': 'true' }, this.props.text)));
	    }
	  }]);

	  return CmdItem;
	}(React.Component);

	//分页栏

	var Pager = function (_React$Component3) {
	  function Pager(props) {
	    _classCallCheck(this, Pager);

	    _get(Object.getPrototypeOf(Pager.prototype), 'constructor', this).call(this, props);
	    this.skipTo = this.skipTo.bind(this);
	  }

	  _inherits(Pager, _React$Component3);

	  _createClass(Pager, [{
	    key: '_getFirstItem',

	    //获取首页按钮
	    value: function _getFirstItem() {
	      var self = this,
	          props = self.props,
	          current = props.current,
	          disabled = current === 0,
	          label = props.previousLabel || '«';

	      return React.createElement(CmdItem, { disabled: disabled, text: label, skipTo: this.skipTo, page: current - 1 });
	    }
	  }, {
	    key: '_getLastItem',

	    //获取最后一页按钮
	    value: function _getLastItem() {
	      var self = this,
	          total = self.props.total,
	          current = self.props.current,
	          disabled = current === total - 1,
	          label = self.props.nextLabel || '»';

	      return React.createElement(CmdItem, { disabled: disabled, text: label, skipTo: this.skipTo, page: current + 1 });
	    }
	  }, {
	    key: '_getItems',

	    //获取所有数字按钮
	    value: function _getItems() {
	      var self = this,
	          total = self.props.total,
	          current = self.props.current,
	          rst = [],
	          from = 0,
	          active,
	          skip = 2,
	          to = total - 1;

	      if (current > skip) {
	        from = current - skip;
	      }
	      if (total - current > skip) {
	        to = current + skip;
	      }
	      if (from !== 0) {
	        rst.push(React.createElement(PagerItem, { text: 1, skipTo: this.skipTo, page: 0, key: 1 }));
	        if (from > 1) {
	          rst.push(React.createElement(PagerItem, { text: '...', disabled: true, key: i + 1 }));
	        }
	      }

	      for (var i = from; i <= to; i++) {
	        active = current === i;
	        rst.push(React.createElement(PagerItem, { text: i + 1, active: active, skipTo: this.skipTo, page: i, key: i + 1 }));
	      }

	      if (to < total - 1) {
	        active = current === total - 1;
	        if (to < total - 2) {
	          rst.push(React.createElement(PagerItem, { text: '...', disabled: true, key: i + 1 }));
	        }
	        rst.push(React.createElement(PagerItem, { text: total, skipTo: this.skipTo, page: total - 1, key: total }));
	      }
	      return rst;
	    }
	  }, {
	    key: 'skipTo',

	    /**
	     * 跳转到对应的节点
	     * @param  {Number} page 页码
	     **/
	    value: function skipTo(page) {
	      var handler = this.props.onSkipTo;
	      if (handler) {
	        handler(page);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var self = this,
	          first = self._getFirstItem(),
	          last = self._getLastItem(),
	          items = self._getItems();

	      var className = 'rc-pager';
	      if (this.props.className) {
	        className += ' ' + this.props.className;
	      }

	      return React.createElement('ul', { className: className }, first, items, last);
	    }
	  }]);

	  return Pager;
	}(React.Component);

	module.exports = Pager;

/***/ },

/***/ 232:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(233);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../css-loader/index.js!./bootstrap.css", function() {
				var newContent = require("!!./../../css-loader/index.js!./bootstrap.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 233:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(169)();
	// imports


	// module
	exports.push([module.id, ".rc-pager {\n  display: inline-block;\n  padding-left: 0;\n  margin: 20px 0;\n  border-radius: 4px;\n}\n.rc-pager > li {\n  display: inline;\n}\n.rc-pager > li > a,\n.rc-pager > li > span {\n  position: relative;\n  float: left;\n  padding: 6px 12px;\n  margin-left: -1px;\n  line-height: 1.42857143;\n  color: #337ab7;\n  text-decoration: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n}\n.rc-pager > li:first-child > a,\n.rc-pager > li:first-child > span {\n  margin-left: 0;\n  border-top-left-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\n.rc-pager > li:last-child > a,\n.rc-pager > li:last-child > span {\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 4px;\n}\n.rc-pager > li > a:hover,\n.rc-pager > li > span:hover,\n.rc-pager > li > a:focus,\n.rc-pager > li > span:focus {\n  color: #23527c;\n  background-color: #eee;\n  border-color: #ddd;\n}\n.rc-pager > .rc-pager-item-active > a,\n.rc-pager > .rc-pager-item-active > span,\n.rc-pager > .rc-pager-item-active > a:hover,\n.rc-pager > .rc-pager-item-active > span:hover,\n.rc-pager > .rc-pager-item-active > a:focus,\n.rc-pager > .rc-pager-item-active > span:focus {\n  z-index: 2;\n  color: #fff;\n  cursor: default;\n  background-color: #337ab7;\n  border-color: #337ab7;\n}\n.rc-pager > .rc-pager-item-disabled > span,\n.rc-pager > .rc-pager-item-disabled > span:hover,\n.rc-pager > .rc-pager-item-disabled > span:focus,\n.rc-pager > .rc-pager-item-disabled > a,\n.rc-pager > .rc-pager-item-disabled > a:hover,\n.rc-pager > .rc-pager-item-disabled > a:focus {\n  color: #777;\n  cursor: not-allowed;\n  background-color: #fff;\n  border-color: #ddd;\n}\n", ""]);

	// exports


/***/ },

/***/ 404:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _superagent = __webpack_require__(160);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _pager = __webpack_require__(229);

	var _pager2 = _interopRequireDefault(_pager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Comment = function (_React$Component) {
		_inherits(Comment, _React$Component);

		function Comment(props) {
			_classCallCheck(this, Comment);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Comment).call(this, props));

			var activity_comment = [{
				head: "../../../images/xiaode.jpg",
				name: "小妖狐",
				sex: "女",
				comment: "在这里找到的心中的那个他啦，好幸运~给活动点个大大的赞在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运",
				date: "2016-03-08 24:00",
				photos: ["../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg"]
			}, {
				head: "../../../images/xiaode.jpg",
				name: "小妖狐",
				sex: "女",
				comment: "在这里找到的心中的那个他啦，好幸运~给活动点个大大的赞在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运~给活动点个大大的赞在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运~给活动点个大大的赞在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运",
				date: "2016-03-08 24:00",
				photos: ["../../../images/xiaode.jpg", "../../../images/xiaode.jpg"]
			}, {
				head: "../../../images/xiaode.jpg",
				name: "小妖狐",
				sex: "女",
				comment: "在这里找到的心中的那个他啦，好幸运~给活动点个大大的赞在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运在这里找到的心中的那个他啦，好幸运",
				date: "2016-03-08 24:00",
				photos: ["../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg", "../../../images/xiaode.jpg"]
			}];
			var pages = 8;
			_this.state = {
				activity_comment: activity_comment,
				pages: pages
			};
			return _this;
		}

		_createClass(Comment, [{
			key: "queryByPage",
			value: function queryByPage(page) {
				_superagent2.default.get("/getPageComment").accept('application/json').query({ page: page }).end(function (err, res) {
					if (err || !res.ok) {
						console.log(err);
						return false;
					};
					console.log("获取第" + page + "页评论");
				});
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				return _react2.default.createElement(
					"div",
					{ className: "comment" },
					_react2.default.createElement(
						"div",
						{ className: "activity_comment_main" },
						this.state.activity_comment ? this.state.activity_comment.map(function (element, index) {
							return _react2.default.createElement(
								"div",
								{ className: "activity_comment_list", key: index },
								_react2.default.createElement(
									"div",
									{ className: "user_information" },
									_react2.default.createElement("img", { src: element.head }),
									_react2.default.createElement(
										"span",
										{ className: "name" },
										element.name
									),
									_react2.default.createElement(
										"span",
										{ className: "sex" },
										element.sex
									)
								),
								_react2.default.createElement(
									"div",
									{ className: "comment" },
									_react2.default.createElement(
										"span",
										null,
										"评语:"
									),
									_react2.default.createElement(
										"p",
										null,
										element.comment
									)
								),
								_react2.default.createElement(
									"div",
									{ className: "comment_photos" },
									element.photos.map(function (element, index) {
										return _react2.default.createElement("img", { src: element, key: index });
									})
								),
								_react2.default.createElement(
									"div",
									{ className: "comment_date" },
									_react2.default.createElement(
										"span",
										{ className: "label" },
										"posted @"
									),
									_react2.default.createElement(
										"span",
										{ className: "date" },
										element.date
									)
								)
							);
						}) : _react2.default.createElement(
							"div",
							{ className: "empty" },
							"暂无评论"
						)
					),
					_react2.default.createElement(
						"div",
						{ className: "pager" },
						_react2.default.createElement(_pager2.default, { total: this.state.pages, onSkipTo: function onSkipTo(page) {
								_this2.queryByPage(page);
							} })
					)
				);
			}
		}]);

		return Comment;
	}(_react2.default.Component);

	exports.default = Comment;

/***/ }

});