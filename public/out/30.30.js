webpackJsonp([30,29],{

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _superagent = __webpack_require__(159);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _reactRouter = __webpack_require__(166);

	__webpack_require__(213);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Login = function (_React$Component) {
		_inherits(Login, _React$Component);

		function Login(props) {
			_classCallCheck(this, Login);

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Login).call(this, props));

			_this2.state = {
				errMess: null,
				loginState: "登录"
			};
			return _this2;
		}

		/*点击登录按钮时触发验证*/


		_createClass(Login, [{
			key: "handleLogin",
			value: function handleLogin(event) {
				var _this = this;
				event.preventDefault();
				var phoneNumber = this.refs.phone_number.value;
				var password = this.refs.password.value;
				if (phoneNumber == null || phoneNumber.length == 0) {
					if (password == null || password.length == 0) {
						this.setState({ errMess: "亲~请填写表单信息哦~" });
						this.refs.errMess.style.display = "block";
						return false;
					} else {
						this.setState({ errMess: "手机号码不能为空哦~" });
						this.refs.errMess.style.display = "block";
						return false;
					};
				} else if (password == null || password.length == 0) {
					this.setState({ errMess: "密码不能为空哦~" });
					this.refs.errMess.style.display = "block";
					return false;
				} else if (!new RegExp("^[0-9]*$").test(phoneNumber)) {
					if (new RegExp("[\\u4E00-\\u9FFF]+", "g").test(password)) {
						this.setState({ errMess: "亲~手机号码和密码的格式都不对哦~" });
						this.refs.errMess.style.display = "block";
						return false;
					} else {
						this.setState({ errMess: "亲~手机号码的格式不对哦~" });
						this.refs.errMess.style.display = "block";
						return false;
					};
				} else if (new RegExp("[\\u4E00-\\u9FFF]+", "g").test(password)) {
					this.setState({ errMess: "亲~密码的格式不对哦~" });
					this.refs.errMess.style.display = "block";
					return false;
				};

				/*不予许同一浏览器同时登录两个账号*/
				if (localStorage.token && localStorage.token != "") {
					alert("请退出已登录账号再重新登录!");
					return false;
				};

				this.setState({ loginState: "登录中..." });
				this.refs.submit.disabled = true;
				_superagent2.default.post("/login").send({
					phoneNumber: phoneNumber,
					password: password
				}).end(function (err, res) {
					if (err || !res.ok) {
						console.log(err);
						return false;
					};
					_this.setState({
						errMess: res.body.message //还木有注册、密码错误、登录成功
					});
					_this.refs.errMess.style.display = "block";
					if (res.body.error) {
						_this.setState({ loginState: "登录" });
						_this.refs.submit.disabled = false;
						return false;
					};
					localStorage.token = res.body.token; //存储token
					setTimeout(function () {
						localStorage.auth = res.body.auth; //存储auth
						switch (res.body.auth) {//res.body.auth
							case 0:
								_this.props.history.replaceState(null, '/marriage_app/authentication'); //需认证
								break;
							case 1:
								_this.props.history.replaceState(null, '/marriage_app/checking'); //审核中
								break;
							case 2:
								_this.props.history.replaceState(null, '/marriage_app'); //主页
								break;
							default:
								_this.setState({ errMess: "出了点问题，重新登录试试？" });
								break;
						};
					}, 1000);
				});
			}
		}, {
			key: "render",
			value: function render() {
				var _this3 = this;

				return _react2.default.createElement(
					"div",
					{ className: "login" },
					_react2.default.createElement(
						"div",
						{ className: "authErrMess", ref: "errMess" },
						this.state.errMess
					),
					_react2.default.createElement(
						"div",
						{ className: "login_main" },
						_react2.default.createElement(
							"div",
							{ className: "decoration" },
							_react2.default.createElement(
								"div",
								{ className: "appName" },
								"初恋"
							),
							_react2.default.createElement(
								"div",
								{ className: "appSlogan" },
								"在这里，遇见最美的初恋"
							)
						),
						_react2.default.createElement(
							"form",
							{ className: "login_form", method: "post" },
							_react2.default.createElement(
								"div",
								{ className: "login_form_title" },
								"婚介所平台"
							),
							_react2.default.createElement(
								"div",
								{ className: "phone_number_wrap" },
								_react2.default.createElement("input", { className: "phone_number text_input", ref: "phone_number", type: "text", name: "phone_number", placeholder: "手机号" })
							),
							_react2.default.createElement(
								"div",
								{ className: "password_wrap" },
								_react2.default.createElement("input", { className: "password text_input", ref: "password", type: "password", name: "password", placeholder: "密码" })
							),
							_react2.default.createElement(
								"div",
								{ className: "submit_wrap" },
								_react2.default.createElement("input", { className: "submit", id: "submit", ref: "submit", type: "submit", name: "submit", value: this.state.loginState, onClick: function onClick(event) {
										return _this3.handleLogin(event);
									} })
							),
							_react2.default.createElement(
								"div",
								{ className: "redirect_zone" },
								_react2.default.createElement(
									_reactRouter.Link,
									{ to: "/marriage_app/reset_password", className: "find_password" },
									"找回密码"
								),
								_react2.default.createElement(
									_reactRouter.Link,
									{ to: "/marriage_app/register", className: "free_register" },
									"免费注册"
								)
							)
						)
					)
				);
			}
		}]);

		return Login;
	}(_react2.default.Component);

	;

	exports.default = Login;

	// ReactDOM.render(<Login/>,document.getElementById("app"));

/***/ },

/***/ 213:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(214);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(218)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./login.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./login.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 214:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(215)();
	// imports


	// module
	exports.push([module.id, "*{\r\n\tmargin:0;\r\n\tpadding:0;\r\n}\r\n@font-face {\r\n    font-family: \"Source Han Sans CN\";\r\n    src: url(" + __webpack_require__(216) + ");\r\n}\r\nhtml,body{\r\n\twidth:100%;\r\n\theight:100%;\r\n\tfont-family: \"Source Han Sans CN\";\r\n}\r\n#app{\r\n\twidth:100%;\r\n\theight:100%;\r\n}\r\n.login{\r\n\twidth:100%;\r\n\theight:100%;\r\n\tbackground-image:url(" + __webpack_require__(217) + ");\r\n\tbackground-repeat:no-repeat;\r\n\tbackground-size:cover;\r\n}\r\n.login .login_main{\r\n\tmargin:0px auto;\r\n\twidth:400px;\r\n\tposition:relative;\r\n\ttop:50px;\r\n}\r\n\r\n.login .authErrMess{\r\n\tdisplay:none;\r\n\tposition:fixed;\r\n\ttop:0;\r\n\twidth:100%;\r\n\theight:50px;\r\n\tbackground-color:#f1f1f1;\r\n\tcolor:#FC052D;\r\n\ttext-align:center;\r\n\tline-height:50px;\r\n\tfont-size:16px;\r\n\tfont-family: \"Source Han Sans CN\";\r\n}\r\n\r\n/*logo区域*/\r\n.login .decoration{\r\n\twidth:400px;\r\n\theight:160px;\r\n\ttext-align:center;\r\n}\r\n/* .login .decoration .logo{\r\n\tmargin:0 auto;\r\n\twidth:144px;\r\n\theight:120px;\r\n\tbackground-image:url('../images/icon.png');\r\n\tbackground-repeat:no-repeat;\r\n\tbackground-size:cover;\r\n} */\r\n.login .decoration .appName{\r\n\twidth:100%;\r\n\theight:90px;\r\n\tline-height:90px;\r\n\tfont-size:40px;\r\n\tcolor:#FFF;\r\n}\r\n.login .decoration .appSlogan{\r\n\twidth:100%;\r\n\theight:40px;\r\n\tfont-size:18px;\r\n\tcolor:#FFF;\r\n}\r\n\r\n/*表单区域*/\r\n.login .login_form{\r\n\twidth:400px;\r\n\theight:360px;\t/*400*/\r\n\tborder:1px solid #fff;\r\n\tbackground-color:#f1f1f1;\r\n}\r\n.login .login_form .login_form_title{\r\n\twidth:100%;\r\n\theight:80px;\r\n\tfont-size:20px;\r\n\tline-height:80px;\r\n\ttext-align:center;\r\n\tcolor:#666;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n\r\n.text_input{\r\n\twidth:360px;\r\n\theight:40px;\r\n\tpadding:10px 20px;\r\n\tborder:none;\r\n\tcolor:#333;\r\n\tfont-size:16px;\r\n\tbackground-color:#f1f1f1;\r\n}\r\n\r\n.login .login_form .phone_number_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n.login .login_form .phone_number{\r\n\t\r\n}\r\n\r\n.login .login_form .password_wrap{\r\n\twidth:100%;\r\n\theight:60px;\r\n\tborder-bottom:1px solid #bfbfbf;\r\n}\r\n.login .login_form .password{}\r\n\r\n.login .login_form .submit_wrap{\r\n\tmargin-top:20px;\r\n\twidth:100%;\r\n\theight:60px;\r\n\ttext-align:center;\r\n\tline-height:60px;\r\n}\r\n.login .login_form .submit{\r\n\tdisplay:inline-block;\r\n\twidth:150px;\r\n\theight:50px;\r\n\tborder:none;\r\n\tcolor:#FFF;\r\n\tbackground-color:#ffbb33;\r\n\tfont-size:14px;\r\n}\r\n.login .login_form .submit:hover{\r\n\tbackground-color:#FF5902;\r\n}                                               \r\n\r\n.login .login_form .redirect_zone{\r\n\twidth:100%;\r\n\theight:60px;\r\n\tline-height:60px;\r\n}\r\n.login .login_form .free_register{\r\n\ttext-decoration:none;\r\n\tfloat:left;\r\n\tcolor:#333;\r\n\tfont-size:14px;\r\n\tmargin-left: 15px;\r\n}\r\n.login .login_form .free_register:hover{\r\n\ttext-decoration:underline;\r\n}\r\n.login .login_form .find_password{\r\n\ttext-decoration:none;\r\n\tfloat:right;\r\n\tcolor:#333;\r\n\tfont-size:14px;\r\n\tmargin-right: 15px;\r\n}\r\n.login .login_form .find_password:hover{\r\n\ttext-decoration:underline;\r\n}", ""]);

	// exports


/***/ },

/***/ 215:
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

/***/ 216:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ed60a7f9ef26a0a6870e4735de4d09a6.otf";

/***/ },

/***/ 217:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "94ed60b23fc5848ae722031dfb60ac8d.jpg";

/***/ },

/***/ 218:
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


/***/ }

});