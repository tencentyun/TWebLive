(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.TIM = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$1 = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

	var isPure = false;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$2 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$2();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$5
	};

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var f$6 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$6
	};

	var defineProperty = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var defineProperty$1 = objectDefineProperty.f;



	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
	    defineProperty$1(it, TO_STRING_TAG, { configurable: true, value: TAG });
	  }
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(SYMBOL);
	var ObjectPrototype = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore$1 = shared('wks');
	var QObject = global_1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
	    nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPrimitive(P, true);
	  anObject(Attributes);
	  if (has(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive(V, true);
	  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
	  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPrimitive(P, true);
	  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState(this).tag;
	  });

	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState(this).description;
	      }
	    });
	    {
	      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.github.io/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = String(key);
	    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
	    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.github.io/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	if ($stringify) {
	  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify(Object(symbol)) != '{}';
	  });

	  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol(value)) return value;
	      };
	      args[1] = replacer;
	      return $stringify.apply(null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
	  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	var defineProperty$2 = objectDefineProperty.f;


	var NativeSymbol = global_1.Symbol;

	if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var result = this instanceof SymbolWrapper
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };
	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
	  symbolPrototype.constructor = SymbolWrapper;

	  var symbolToString = symbolPrototype.toString;
	  var native = String(NativeSymbol('test')) == 'Symbol(test)';
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  defineProperty$2(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject(this) ? this.valueOf() : this;
	      var string = symbolToString.call(symbol);
	      if (has(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var defineProperty$3 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty$3(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $filter = arrayIteration.filter;



	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
	// Edge 14- issue
	var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var $find = arrayIteration.find;



	var FIND = 'find';
	var SKIPS_HOLES = true;

	var USES_TO_LENGTH$1 = arrayMethodUsesToLength(FIND);

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH$1 }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	var slice = [].slice;
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!(argsLength in factories)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	var functionBind = Function.bind || function bind(that /* , ...args */) {
	  var fn = aFunction$1(this);
	  var partArgs = slice.call(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = partArgs.concat(slice.call(arguments));
	    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
	  };
	  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
	  return boundFunction;
	};

	// `Function.prototype.bind` method
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	_export({ target: 'Function', proto: true }, {
	  bind: functionBind
	});

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function ownKeys$1(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);
	    if (enumerableOnly) symbols = symbols.filter(function (sym) {
	      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	    });
	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys$1(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys$1(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	var version$1 = "0.2.2";

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var iterators = {};

	var ITERATOR = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR] === it);
	};

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$1] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || iterators[classof(it)];
	};

	// `Array.from` method implementation
	// https://tc39.github.io/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = iteratorMethod.call(O);
	    next = iterator.next;
	    result = new C();
	    for (;!(step = next.call(iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = toLength(O.length);
	    result = new C(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$2] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$2] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $indexOf = arrayIncludes.indexOf;



	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD = arrayMethodIsStrict('indexOf');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH$2 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype$1 = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype$1 : null;
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	var returnThis = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if ( !has(IteratorPrototype, ITERATOR$3)) {
	  createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
	  }
	  iterators[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$1 = internalState.set;
	var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.github.io/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState$1(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$1(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
	iterators.Arguments = iterators.Array;

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var defineProperty$4 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty$4(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var freezing = !fails(function () {
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty.f;



	var METADATA = uid('meta');
	var id = 0;

	var isExtensible = Object.isExtensible || function () {
	  return true;
	};

	var setMetadata = function (it) {
	  defineProperty(it, METADATA, { value: {
	    objectID: 'O' + ++id, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData = function (it, create) {
	  if (!has(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
	  return it;
	};

	var meta = module.exports = {
	  REQUIRED: false,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys[METADATA] = true;
	});
	var internalMetadata_1 = internalMetadata.REQUIRED;
	var internalMetadata_2 = internalMetadata.fastKey;
	var internalMetadata_3 = internalMetadata.getWeakData;
	var internalMetadata_4 = internalMetadata.onFreeze;

	var iterate_1 = createCommonjsModule(function (module) {
	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
	  var boundFunction = functionBindContext(fn, that, AS_ENTRIES ? 2 : 1);
	  var iterator, iterFn, index, length, result, next, step;

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = toLength(iterable.length); length > index; index++) {
	        result = AS_ENTRIES
	          ? boundFunction(anObject(step = iterable[index])[0], step[1])
	          : boundFunction(iterable[index]);
	        if (result && result instanceof Result) return result;
	      } return new Result(false);
	    }
	    iterator = iterFn.call(iterable);
	  }

	  next = iterator.next;
	  while (!(step = next.call(iterator)).done) {
	    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
	    if (typeof result == 'object' && result && result instanceof Result) return result;
	  } return new Result(false);
	};

	iterate.stop = function (result) {
	  return new Result(true, result);
	};
	});

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
	};

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    typeof (NewTarget = dummy.constructor) == 'function' &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var nativeMethod = NativePrototype[KEY];
	    redefine(NativePrototype, KEY,
	      KEY == 'add' ? function add(value) {
	        nativeMethod.call(this, value === 0 ? 0 : value);
	        return this;
	      } : KEY == 'delete' ? function (key) {
	        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'get' ? function get(key) {
	        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'has' ? function has(key) {
	        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : function set(key, value) {
	        nativeMethod.call(this, key === 0 ? 0 : key, value);
	        return this;
	      }
	    );
	  };

	  // eslint-disable-next-line max-len
	  if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
	    new NativeConstructor().entries().next();
	  })))) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    internalMetadata.REQUIRED = true;
	  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new
	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
	        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
	        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

	    // weak collections should not contains .clear method
	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var SPECIES$2 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$2]) {
	    defineProperty(Constructor, SPECIES$2, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var defineProperty$5 = objectDefineProperty.f;








	var fastKey = internalMetadata.fastKey;


	var setInternalState$2 = internalState.set;
	var internalStateGetterFor = internalState.getterFor;

	var collectionStrong = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, CONSTRUCTOR_NAME);
	      setInternalState$2(that, {
	        type: CONSTRUCTOR_NAME,
	        index: objectCreate(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!descriptors) that.size = 0;
	      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
	    });

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index;
	      // change existing entry
	      if (entry) {
	        entry.value = value;
	      // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: undefined,
	          removed: false
	        };
	        if (!state.first) state.first = entry;
	        if (previous) previous.next = entry;
	        if (descriptors) state.size++;
	        else that.size++;
	        // add to index
	        if (index !== 'F') state.index[index] = entry;
	      } return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that);
	      // fast case
	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') return state.index[index];
	      // frozen object case
	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key == key) return entry;
	      }
	    };

	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var data = state.index;
	        var entry = state.first;
	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) entry.previous = entry.previous.next = undefined;
	          delete data[entry.index];
	          entry = entry.next;
	        }
	        state.first = state.last = undefined;
	        if (descriptors) state.size = 0;
	        else that.size = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) prev.next = next;
	          if (next) next.previous = prev;
	          if (state.first == entry) state.first = next;
	          if (state.last == entry) state.last = prev;
	          if (descriptors) state.size--;
	          else that.size--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this);
	          // revert to the last existing entry
	          while (entry && entry.removed) entry = entry.previous;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });

	    redefineAll(C.prototype, IS_MAP ? {
	      // 23.1.3.6 Map.prototype.get(key)
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // 23.1.3.9 Map.prototype.set(key, value)
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // 23.2.3.1 Set.prototype.add(value)
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (descriptors) defineProperty$5(C.prototype, 'size', {
	      get: function () {
	        return getInternalState(this).size;
	      }
	    });
	    return C;
	  },
	  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState$2(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: undefined
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last;
	      // revert to the last existing entry
	      while (entry && entry.removed) entry = entry.previous;
	      // get next entry
	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = undefined;
	        return { value: undefined, done: true };
	      }
	      // return step by kind
	      if (kind == 'keys') return { value: entry.key, done: false };
	      if (kind == 'values') return { value: entry.value, done: false };
	      return { value: [entry.key, entry.value], done: false };
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(CONSTRUCTOR_NAME);
	  }
	};

	// `Map` constructor
	// https://tc39.github.io/ecma262/#sec-map-objects
	var es_map = collection('Map', function (init) {
	  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	// `Object.{ entries, values }` methods implementation
	var createMethod$2 = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject(it);
	    var keys = objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!descriptors || propertyIsEnumerable.call(O, key)) {
	        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.github.io/ecma262/#sec-object.entries
	  entries: createMethod$2(true),
	  // `Object.values` method
	  // https://tc39.github.io/ecma262/#sec-object.values
	  values: createMethod$2(false)
	};

	var $values = objectToArray.values;

	// `Object.values` method
	// https://tc39.github.io/ecma262/#sec-object.values
	_export({ target: 'Object', stat: true }, {
	  values: function values(O) {
	    return $values(O);
	  }
	});

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$3 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$3(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$3(true)
	};

	var charAt = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$3 = internalState.set;
	var getInternalState$2 = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$3(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$2(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR$5] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype, ITERATOR$5, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR$5] = ArrayValues;
	    }
	    if (!CollectionPrototype[TO_STRING_TAG$3]) {
	      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
	    }
	    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	}

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

	var max$1 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$3 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$1(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var DatePrototype = Date.prototype;
	var INVALID_DATE = 'Invalid Date';
	var TO_STRING = 'toString';
	var nativeDateToString = DatePrototype[TO_STRING];
	var getTime = DatePrototype.getTime;

	// `Date.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
	if (new Date(NaN) + '' != INVALID_DATE) {
	  redefine(DatePrototype, TO_STRING, function toString() {
	    var value = getTime.call(this);
	    // eslint-disable-next-line no-self-compare
	    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
	  });
	}

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var TO_STRING$1 = 'toString';
	var RegExpPrototype = RegExp.prototype;
	var nativeToString = RegExpPrototype[TO_STRING$1];

	var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = nativeToString.name != TO_STRING$1;

	// `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING$1, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	var global$1 = (typeof global !== "undefined" ? global :
	            typeof self !== "undefined" ? self :
	            typeof window !== "undefined" ? window : {});

	var _console;

	var method;

	if (typeof console !== 'undefined') {
	  _console = console;
	} else if (typeof global$1 !== 'undefined' && global$1.console) {
	  _console = global$1.console;
	} else if (typeof window !== 'undefined' && window.console) {
	  _console = window.console;
	} else {
	  _console = {};
	}

	var noop = function noop() {};

	var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
	var length = methods.length;

	while (length--) {
	  method = methods[length];

	  if (!console[method]) {
	    _console[method] = noop;
	  }
	}

	_console.methods = methods;
	var console$1 = _console;

	var $forEach$1 = arrayIteration.forEach;



	var STRICT_METHOD$1 = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH$4 = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD$1 || !USES_TO_LENGTH$4) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	var $includes = arrayIncludes.includes;



	var USES_TO_LENGTH$5 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$5 }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	// `Array.isArray` method
	// https://tc39.github.io/ecma262/#sec-array.isarray
	_export({ target: 'Array', stat: true }, {
	  isArray: isArray
	});

	var nativeJoin = [].join;

	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD$2 = arrayMethodIsStrict('join', ',');

	// `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$2 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$6 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$3 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$2 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$6 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$3];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$2(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	// `Date.now` method
	// https://tc39.github.io/ecma262/#sec-date.now
	_export({ target: 'Date', stat: true }, {
	  now: function now() {
	    return new Date().getTime();
	  }
	});

	// `String.prototype.repeat` method implementation
	// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
	var stringRepeat = ''.repeat || function repeat(count) {
	  var str = String(requireObjectCoercible(this));
	  var result = '';
	  var n = toInteger(count);
	  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
	  return result;
	};

	// https://github.com/tc39/proposal-string-pad-start-end




	var ceil$1 = Math.ceil;

	// `String.prototype.{ padStart, padEnd }` methods implementation
	var createMethod$4 = function (IS_END) {
	  return function ($this, maxLength, fillString) {
	    var S = String(requireObjectCoercible($this));
	    var stringLength = S.length;
	    var fillStr = fillString === undefined ? ' ' : String(fillString);
	    var intMaxLength = toLength(maxLength);
	    var fillLen, stringFiller;
	    if (intMaxLength <= stringLength || fillStr == '') return S;
	    fillLen = intMaxLength - stringLength;
	    stringFiller = stringRepeat.call(fillStr, ceil$1(fillLen / fillStr.length));
	    if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
	    return IS_END ? S + stringFiller : stringFiller + S;
	  };
	};

	var stringPad = {
	  // `String.prototype.padStart` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
	  start: createMethod$4(false),
	  // `String.prototype.padEnd` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.padend
	  end: createMethod$4(true)
	};

	var padStart = stringPad.start;

	var abs = Math.abs;
	var DatePrototype$1 = Date.prototype;
	var getTime$1 = DatePrototype$1.getTime;
	var nativeDateToISOString = DatePrototype$1.toISOString;

	// `Date.prototype.toISOString` method implementation
	// https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
	// PhantomJS / old WebKit fails here:
	var dateToIsoString = (fails(function () {
	  return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
	}) || !fails(function () {
	  nativeDateToISOString.call(new Date(NaN));
	})) ? function toISOString() {
	  if (!isFinite(getTime$1.call(this))) throw RangeError('Invalid time value');
	  var date = this;
	  var year = date.getUTCFullYear();
	  var milliseconds = date.getUTCMilliseconds();
	  var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
	  return sign + padStart(abs(year), sign ? 6 : 4, 0) +
	    '-' + padStart(date.getUTCMonth() + 1, 2, 0) +
	    '-' + padStart(date.getUTCDate(), 2, 0) +
	    'T' + padStart(date.getUTCHours(), 2, 0) +
	    ':' + padStart(date.getUTCMinutes(), 2, 0) +
	    ':' + padStart(date.getUTCSeconds(), 2, 0) +
	    '.' + padStart(milliseconds, 3, 0) +
	    'Z';
	} : nativeDateToISOString;

	// `Date.prototype.toISOString` method
	// https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
	// PhantomJS / old WebKit has a broken implementations
	_export({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== dateToIsoString }, {
	  toISOString: dateToIsoString
	});

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$5 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$5(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod$5(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod$5(3)
	};

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$6 = objectDefineProperty.f;
	var trim = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global_1[NUMBER];
	var NumberPrototype = NativeNumber.prototype;

	// Opera ~12 has broken Object#toString
	var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

	// `ToNumber` abstract operation
	// https://tc39.github.io/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, false);
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim(it);
	    first = it.charCodeAt(0);
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = it.slice(2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = digits.charCodeAt(index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.github.io/ecma262/#sec-number-constructor
	if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var dummy = this;
	    return dummy instanceof NumberWrapper
	      // check on 1..constructor(foo) case
	      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
	        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
	  };
	  for (var keys$1 = descriptors ? getOwnPropertyNames(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j = 0, key; keys$1.length > j; j++) {
	    if (has(NativeNumber, key = keys$1[j]) && !has(NumberWrapper, key)) {
	      defineProperty$6(NumberWrapper, key, getOwnPropertyDescriptor$2(NativeNumber, key));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine(global_1, NUMBER, NumberWrapper);
	}

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	_export({ target: 'Object', stat: true, sham: !descriptors }, {
	  create: objectCreate
	});

	var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

	var FAILS_ON_PRIMITIVES$1 = fails(function () { return !Object.getOwnPropertyNames(1); });

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 }, {
	  getOwnPropertyNames: nativeGetOwnPropertyNames$2
	});

	var FAILS_ON_PRIMITIVES$2 = fails(function () { objectGetPrototypeOf(1); });

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2, sham: !correctPrototypeGetter }, {
	  getPrototypeOf: function getPrototypeOf(it) {
	    return objectGetPrototypeOf(toObject(it));
	  }
	});

	var trim$1 = stringTrim.trim;


	var $parseInt = global_1.parseInt;
	var hex = /^[+-]?0[Xx]/;
	var FORCED$1 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

	// `parseInt` method
	// https://tc39.github.io/ecma262/#sec-parseint-string-radix
	var numberParseInt = FORCED$1 ? function parseInt(string, radix) {
	  var S = trim$1(String(string));
	  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
	} : $parseInt;

	// `parseInt` method
	// https://tc39.github.io/ecma262/#sec-parseint-string-radix
	_export({ global: true, forced: parseInt != numberParseInt }, {
	  parseInt: numberParseInt
	});

	var nativePromiseConstructor = global_1.Promise;

	var SPECIES$4 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

	var location$1 = global_1.location;
	var set$1 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process$1 = global_1.process;
	var MessageChannel = global_1.MessageChannel;
	var Dispatch = global_1.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(id + '', location$1.protocol + '//' + location$1.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$1 || !clear) {
	  set$1 = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (classofRaw(process$1) == 'process') {
	    defer = function (id) {
	      process$1.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !engineIsIos) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = functionBindContext(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global_1.addEventListener &&
	    typeof postMessage == 'function' &&
	    !global_1.importScripts &&
	    !fails(post) &&
	    location$1.protocol !== 'file:'
	  ) {
	    defer = post;
	    global_1.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task = {
	  set: set$1,
	  clear: clear
	};

	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;

	var macrotask = task.set;


	var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var process$2 = global_1.process;
	var Promise$1 = global_1.Promise;
	var IS_NODE = classofRaw(process$2) == 'process';
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$3(global_1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE && (parent = process$2.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (IS_NODE) {
	    notify = function () {
	      process$2.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  } else if (MutationObserver && !engineIsIos) {
	    toggle = true;
	    node = document.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    then = promise.then;
	    notify = function () {
	      then.call(promise, flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global_1, flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify();
	  } last = task;
	};

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction$1(resolve);
	  this.reject = aFunction$1(reject);
	};

	// 25.4.1.5 NewPromiseCapability(C)
	var f$7 = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability = {
		f: f$7
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var hostReportErrors = function (a, b) {
	  var console = global_1.console;
	  if (console && console.error) {
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var task$1 = task.set;










	var SPECIES$5 = wellKnownSymbol('species');
	var PROMISE = 'Promise';
	var getInternalState$3 = internalState.get;
	var setInternalState$4 = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var PromiseConstructor = nativePromiseConstructor;
	var TypeError$1 = global_1.TypeError;
	var document$2 = global_1.document;
	var process$3 = global_1.process;
	var $fetch = getBuiltIn('fetch');
	var newPromiseCapability$1 = newPromiseCapability.f;
	var newGenericPromiseCapability = newPromiseCapability$1;
	var IS_NODE$1 = classofRaw(process$3) == 'process';
	var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	var FORCED$2 = isForced_1(PROMISE, function () {
	  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
	  if (!GLOBAL_CORE_JS_PROMISE) {
	    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // We can't detect it synchronously, so just check versions
	    if (engineV8Version === 66) return true;
	    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
	  }
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
	  // Detect correctness of subclassing with @@species support
	  var promise = PromiseConstructor.resolve(1);
	  var FakePromise = function (exec) {
	    exec(function () { /* empty */ }, function () { /* empty */ });
	  };
	  var constructor = promise.constructor = {};
	  constructor[SPECIES$5] = FakePromise;
	  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
	});

	var INCORRECT_ITERATION$1 = FORCED$2 || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify$1 = function (promise, state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var index = 0;
	    // variable length - can't use forEach
	    while (chain.length > index) {
	      var reaction = chain[index++];
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
	            state.rejection = HANDLED;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // can throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    }
	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(promise, state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$2.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (handler = global_1['on' + name]) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (IS_NODE$1) {
	          process$3.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    if (IS_NODE$1) {
	      process$3.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind = function (fn, promise, state, unwrap) {
	  return function (value) {
	    fn(promise, state, value, unwrap);
	  };
	};

	var internalReject = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify$1(promise, state, true);
	};

	var internalResolve = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask(function () {
	        var wrapper = { done: false };
	        try {
	          then.call(value,
	            bind(internalResolve, promise, wrapper, state),
	            bind(internalReject, promise, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(promise, wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify$1(promise, state, false);
	    }
	  } catch (error) {
	    internalReject(promise, { done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED$2) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromiseConstructor, PROMISE);
	    aFunction$1(executor);
	    Internal.call(this);
	    var state = getInternalState$3(this);
	    try {
	      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
	    } catch (error) {
	      internalReject(this, state, error);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    setInternalState$4(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };
	  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = IS_NODE$1 ? process$3.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify$1(this, state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$3(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, promise, state);
	    this.reject = bind(internalReject, promise, state);
	  };
	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if ( typeof nativePromiseConstructor == 'function') {
	    nativeThen = nativePromiseConstructor.prototype.then;

	    // wrap native Promise#then for native async functions
	    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
	      var that = this;
	      return new PromiseConstructor(function (resolve, reject) {
	        nativeThen.call(that, resolve, reject);
	      }).then(onFulfilled, onRejected);
	    // https://github.com/zloirock/core-js/issues/640
	    }, { unsafe: true });

	    // wrap fetch result
	    if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
	      // eslint-disable-next-line no-unused-vars
	      fetch: function fetch(input /* , init */) {
	        return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
	      }
	    });
	  }
	}

	_export({ global: true, wrap: true, forced: FORCED$2 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	PromiseWrapper = getBuiltIn(PROMISE);

	// statics
	_export({ target: PROMISE, stat: true, forced: FORCED$2 }, {
	  // `Promise.reject` method
	  // https://tc39.github.io/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	_export({ target: PROMISE, stat: true, forced:  FORCED$2 }, {
	  // `Promise.resolve` method
	  // https://tc39.github.io/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve( this, x);
	  }
	});

	_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
	  // `Promise.all` method
	  // https://tc39.github.io/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate_1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.github.io/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      iterate_1(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.
	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible(this))
	      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points







	var SPECIES$6 = wellKnownSymbol('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	var REPLACE = wellKnownSymbol('replace');
	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$6] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !(
	      REPLACE_SUPPORTS_NAMED_GROUPS &&
	      REPLACE_KEEPS_$0 &&
	      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    )) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	var charAt$1 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt$1(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	// @@match logic
	fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible(this);
	      var matcher = regexp == undefined ? undefined : regexp[MATCH];
	      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative(nativeMatch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      if (!rx.global) return regexpExecAbstract(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	var max$3 = Math.max;
	var min$3 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      if (
	        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
	        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
	      ) {
	        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	        if (res.done) return res.value;
	      }

	      var rx = anObject(regexp);
	      var S = String(this);

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regexpExecAbstract(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = String(result[0]);
	        var position = max$3(min$3(toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	  // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	for (var COLLECTION_NAME$1 in domIterables) {
	  var Collection$1 = global_1[COLLECTION_NAME$1];
	  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype$1 && CollectionPrototype$1.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype$1, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype$1.forEach = arrayForEach;
	  }
	}

	var trim$2 = stringTrim.trim;


	var $parseFloat = global_1.parseFloat;
	var FORCED$3 = 1 / $parseFloat(whitespaces + '-0') !== -Infinity;

	// `parseFloat` method
	// https://tc39.github.io/ecma262/#sec-parsefloat-string
	var numberParseFloat = FORCED$3 ? function parseFloat(string) {
	  var trimmedString = trim$2(String(string));
	  var result = $parseFloat(trimmedString);
	  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
	} : $parseFloat;

	// `parseFloat` method
	// https://tc39.github.io/ecma262/#sec-parsefloat-string
	_export({ global: true, forced: parseFloat != numberParseFloat }, {
	  parseFloat: numberParseFloat
	});

	/**
	 * @file env.js
	 * @module env
	 */
	var IN_BROWSER = typeof window !== 'undefined'; // 请勿在这里引用common-utlils的isFunction，避免模块循环引用
	// 作为小程序插件使用时，wx.canIUse 是 undefined，这个接口在sdk内已经不再用了，干脆去掉

	var IN_WX_MINI_APP = typeof wx !== 'undefined' && typeof wx.getSystemInfoSync === 'function';
	var USER_AGENT = IN_BROWSER && window.navigator && window.navigator.userAgent || '';
	var webkitVersionMap = /AppleWebKit\/([\d.]+)/i.exec(USER_AGENT);
	var appleWebkitVersion = webkitVersionMap ? parseFloat(webkitVersionMap.pop()) : null;
	/*
	 * Device is an iPhone
	 *
	 * @type {Boolean}
	 * @constant
	 * @private
	 */

	var IS_IPAD = /iPad/i.test(USER_AGENT); // The Facebook app's UIWebView identifies as both an iPhone and iPad, so
	// to identify iPhones, we need to exclude iPads.
	// http://artsy.github.io/blog/2012/10/18/the-perils-of-ios-user-agent-sniffing/

	var IS_IPHONE = /iPhone/i.test(USER_AGENT) && !IS_IPAD;
	var IS_IPOD = /iPod/i.test(USER_AGENT);
	var IOS_VERSION = function () {
	  var match = USER_AGENT.match(/OS (\d+)_/i);

	  if (match && match[1]) {
	    return match[1];
	  }

	  return null;
	}();
	var IS_ANDROID = /Android/i.test(USER_AGENT);
	var ANDROID_VERSION = function () {
	  // This matches Android Major.Minor.Patch versions
	  // ANDROID_VERSION is Major.Minor as a Number, if Minor isn't available, then only Major is returned
	  var match = USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);

	  if (!match) {
	    return null;
	  }

	  var major = match[1] && parseFloat(match[1]);
	  var minor = match[2] && parseFloat(match[2]);

	  if (major && minor) {
	    return parseFloat(match[1] + '.' + match[2]);
	  }

	  if (major) {
	    return major;
	  }

	  return null;
	}(); // Old Android is defined as Version older than 2.3, and requiring a webkit version of the android browser

	var IS_OLD_ANDROID = IS_ANDROID && /webkit/i.test(USER_AGENT) && ANDROID_VERSION < 2.3;
	var IS_FIREFOX = /Firefox/i.test(USER_AGENT);
	var IS_EDGE = /Edge/i.test(USER_AGENT);
	var IS_CHROME = !IS_EDGE && /Chrome/i.test(USER_AGENT);
	var CHROME_VERSION = function () {
	  var match = USER_AGENT.match(/Chrome\/(\d+)/);

	  if (match && match[1]) {
	    return parseFloat(match[1]);
	  }

	  return null;
	}(); // IE

	var IS_IE = /MSIE/.test(USER_AGENT); // 是否为IE浏览器

	var IS_IE8 = /MSIE\s8\.0/.test(USER_AGENT);
	var IE_VERSION = function () {
	  var result = /MSIE\s(\d+)\.\d/.exec(USER_AGENT);
	  var version = result && parseFloat(result[1]);

	  if (!version && /Trident\/7.0/i.test(USER_AGENT) && /rv:11.0/.test(USER_AGENT)) {
	    // IE 11 has a different user agent string than other IE versions
	    version = 11.0;
	  }

	  return version;
	}(); // Safari

	var IS_SAFARI = /Safari/i.test(USER_AGENT) && !IS_CHROME && !IS_ANDROID && !IS_EDGE;
	var IS_TBS = /TBS\/\d+/i.test(USER_AGENT); // 仅X5内核，QQ浏览器默认x5内核，但是agent没有TBS

	var TBS_VERSION = function () {
	  var match = USER_AGENT.match(/TBS\/(\d+)/i);

	  if (match && match[1]) {
	    return match[1];
	  }
	}(); // X5内核版本

	var IS_MQQB = !IS_TBS && /MQQBrowser\/\d+/i.test(USER_AGENT); // 移动端QQ浏览器

	var IS_QQB = !IS_TBS && / QQBrowser\/\d+/i.test(USER_AGENT); // pc端QQ浏览器

	var IS_WECHAT = /(micromessenger|webbrowser)/i.test(USER_AGENT);
	var IS_WIN = /Windows/i.test(USER_AGENT); // window系统

	var IS_MAC = /MAC OS X/i.test(USER_AGENT); // MAC系统，先检查IOS

	var IS_WX = /MicroMessenger/i.test(USER_AGENT); // 是否为微信环境

	/**
	 * 检测input类型是否为Map
	 * @param {*} input 任意类型的输入
	 * @returns {Boolean} true->map / false->not a map
	 */

	var isMap = function isMap(input) {
	  return getType(input) === 'map';
	};
	/**
	 * 检测input类型是否为Set
	 * @param {*} input 任意类型的输入
	 * @returns {Boolean} true->set / false->not a set
	 */

	var isSet = function isSet(input) {
	  return getType(input) === 'set';
	};
	/**
	 * 检测input类型是否为File
	 * @param {*} input 任意类型的输入
	 * @returns {Boolean} true->file / false->not a file
	 */

	var isFile = function isFile(input) {
	  return getType(input) === 'file';
	};
	var isObject$1 = function isObject(input) {
	  // null is object, hence the extra check
	  return input !== null && _typeof(input) === 'object';
	};
	/**
	 * Checks to see if a value is an object and only an object
	 * plain object: 没有标准定义，一般认为通过 {} 或者 new Object() 或者 Object.create(null) 方式创建的对象是纯粹对象
	 * @param {*} input 任意类型的输入
	 * @returns {Boolean} true->an object and only an object
	 */

	var isPlainObject = function isPlainObject(input) {
	  // 注意不能使用以下方式判断，因为IE9/IE10下，对象的__proto__是undefined
	  // return isObject(input) && input.__proto__ === Object.prototype;
	  if (_typeof(input) !== 'object' || input === null) {
	    return false;
	  }

	  var proto = Object.getPrototypeOf(input);

	  if (proto === null) {
	    // edge case Object.create(null)
	    return true;
	  }

	  var baseProto = proto;

	  while (Object.getPrototypeOf(baseProto) !== null) {
	    baseProto = Object.getPrototypeOf(baseProto);
	  } // 2. 原型链第一个和最后一个比较


	  return proto === baseProto;
	};
	/**
	 * 检测input类型是否为数组
	 * @param {*} input 任意类型的输入
	 * @returns {Boolean} true->array / false->not an array
	 */

	var isArray$1 = function isArray(input) {
	  if (typeof Array.isArray === 'function') {
	    return Array.isArray(input);
	  }

	  return getType(input) === 'array';
	};
	/**
	 * 检测input类型是否为数组或者object
	 * @param {*} input 任意类型的输入
	 * @returns {Boolean} true->input is an array or an object
	 */

	var isArrayOrObject = function isArrayOrObject(input) {
	  return isArray$1(input) || isObject$1(input);
	};
	/**
	 * 检测input是否为Error的实例
	 * @param {*} input 任意类型的输入
	 * @returns {Boolean} true->input is an instance of Error
	 */

	var isInstanceOfError = function isInstanceOfError(input) {
	  return input instanceof Error;
	};
	/**
	 * Get the object type string
	 * @param {*} input 任意类型的输入
	 * @returns {String} the object type string
	 */

	var getType = function getType(input) {
	  return Object.prototype.toString.call(input).match(/^\[object (.*)\]$/)[1].toLowerCase();
	};

	var baseTime = 0;

	if (!Date.now) {
	  Date.now = function now() {
	    return new Date().getTime();
	  };
	}

	var TimeUtil = {
	  now: function now() {
	    if (baseTime === 0) {
	      baseTime = Date.now() - 1;
	    }

	    var diff = Date.now() - baseTime;

	    if (diff > 0xffffffff) {
	      baseTime += 0xffffffff;
	      return Date.now() - baseTime;
	    }

	    return diff;
	  },
	  utc: function utc() {
	    return Math.round(Date.now() / 1000);
	  }
	}; // -----------------深度合并工具函数-----------------

	/**
	 * 序列化Error实例，只序列化Error实例的message和code属性（如果有的话）
	 * @param {Error} error Error实例
	 * @returns {String} 序列化后的内容
	 */

	var stringifyError = function stringifyError(error) {
	  return JSON.stringify(error, ['message', 'code']);
	};
	var getPageProtocol = function getPageProtocol() {
	  if (IN_WX_MINI_APP) {
	    return 'https:';
	  }

	  var preFix = window.location.protocol;

	  if (['http:', 'https:'].indexOf(preFix) < 0) {
	    preFix = 'http:';
	  }

	  return preFix;
	}; // 统一用HTTPS

	var LOGLEVEL_DEBUG = -1;
	var LOGLEVEL_LOG = 0;
	var LOGLEVEL_INFO = 1;
	var LOGLEVEL_WARN = 2;
	var LOGLEVEL_ERROR = 3;
	var LOGLEVEL_NON_LOGGING = 4; // 无日志记录级别，sdk将不打印任何日志

	var MAX_LOG_LENGTH = 1000;
	var globalLevel = LOGLEVEL_LOG; // 暂停使用 wx.getLogManager，没发现它能起到什么作用
	var timerMap = new Map();
	/**
	 * 对齐毫秒字符串
	 * @param {*} ms 毫秒
	 * @returns {String} 对齐后的毫秒时间字符串
	 */

	function padMs(ms) {
	  var len = ms.toString().length;
	  var ret;

	  switch (len) {
	    case 1:
	      ret = '00' + ms;
	      break;

	    case 2:
	      ret = '0' + ms;
	      break;

	    default:
	      ret = ms;
	      break;
	  }

	  return ret;
	}
	/**
	 * log前缀
	 * @returns {String} 日志前缀
	 */


	function getPrefix() {
	  var date = new Date();
	  return 'TWebLive ' + date.toLocaleTimeString('en-US', {
	    hour12: false
	  }) + '.' + padMs(date.getMilliseconds()) + ':';
	}
	/**
	 * wx LogManager是否可用
	 * @returns {Boolean} true->I can use LogManager
	 */
	// function canIUseWxLog() {
	//   if (IN_WX_MINI_APP) {
	//     // 必须是微信小程序环境，百度小程序目前还只能用console
	//     const version = wx.getSystemInfoSync().SDKVersion;
	//     // HBuilder等工具会在window对象下挂自己模拟的wx对象，但是又没抄好，做个防御
	//     if (typeof version === 'undefined' ||
	//       typeof wx.getLogManager === 'undefined') {
	//       return false;
	//     }
	//     if (compareVersion(version, '2.1.0') >= 0) {
	//       wx.getLogManager().log('I can use wx log. SDKVersion=' + version);
	//       return true;
	//     }
	//   }
	//   return false;
	// }

	/**
	 * 比较wx SDKVersion
	 * @param {String} v1 版本字符串
	 * @param {String} v2 版本字符串
	 * @returns {Number} v1>v2，返回1；v1<v2，返回-1；v1==v2，返回0
	 */
	// function compareVersion(v1, v2) {
	//   v1 = v1.split('.');
	//   v2 = v2.split('.');
	//   const len = Math.max(v1.length, v2.length);
	//   while (v1.length < len) {
	//     v1.push('0');
	//   }
	//   while (v2.length < len) {
	//     v2.push('0');
	//   }
	//   for (let i = 0; i < len; i++) {
	//     const num1 = parseInt(v1[i]);
	//     const num2 = parseInt(v2[i]);
	//     if (num1 > num2) {
	//       return 1;
	//     }
	//     if (num1 < num2) {
	//       return -1;
	//     }
	//   }
	//   return 0;
	// }


	var logger = {
	  _data: [],
	  _length: 0,
	  _visible: false,
	  // 将函数参数拼成字符串
	  arguments2String: function arguments2String(args) {
	    var s;

	    if (args.length === 1) {
	      s = getPrefix() + args[0];
	    } else {
	      s = getPrefix();

	      for (var i = 0, length = args.length; i < length; i++) {
	        if (isArrayOrObject(args[i])) {
	          if (isInstanceOfError(args[i])) {
	            s += stringifyError(args[i]);
	          } else {
	            s += JSON.stringify(args[i]);
	          }
	        } else {
	          s += args[i];
	        }

	        s += ' ';
	      }
	    }

	    return s;
	  },

	  /**
	   * 打印调试日志
	   */
	  debug: function debug() {
	    if (globalLevel <= LOGLEVEL_DEBUG) {
	      // 对参数使用slice会阻止某些JavaScript引擎中的优化 (比如 V8 - 更多信息)
	      // see:https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
	      var s = this.arguments2String(arguments);
	      logger.record(s, 'debug');
	      console$1.debug(s);
	    }
	  },

	  /**
	   * 打印普通日志
	   */
	  log: function log() {
	    if (globalLevel <= LOGLEVEL_LOG) {
	      var s = this.arguments2String(arguments);
	      logger.record(s, 'log');
	      console$1.log(s);
	    }
	  },

	  /**
	   * 打印release日志
	   */
	  info: function info() {
	    if (globalLevel <= LOGLEVEL_INFO) {
	      var s = this.arguments2String(arguments);
	      logger.record(s, 'info');
	      console$1.info(s);
	    }
	  },

	  /**
	   * 打印告警日志
	   */
	  warn: function warn() {
	    if (globalLevel <= LOGLEVEL_WARN) {
	      var s = this.arguments2String(arguments);
	      logger.record(s, 'warn');
	      console$1.warn(s);
	    }
	  },

	  /**
	   * 打印错误日志
	   */
	  error: function error() {
	    if (globalLevel <= LOGLEVEL_ERROR) {
	      var s = this.arguments2String(arguments);
	      logger.record(s, 'error');
	      console$1.error(s); // 微信写不了error日志，就用warn代替了
	    }
	  },
	  time: function time(label) {
	    timerMap.set(label, TimeUtil.now());
	  },
	  timeEnd: function timeEnd(label) {
	    if (timerMap.has(label)) {
	      var cost = TimeUtil.now() - timerMap.get(label);
	      timerMap["delete"](label);
	      return cost;
	    }

	    console$1.warn("\u672A\u627E\u5230\u5BF9\u5E94label: ".concat(label, ", \u8BF7\u5728\u8C03\u7528 logger.timeEnd \u524D\uFF0C\u8C03\u7528 logger.time"));
	    return 0;
	  },
	  setLevel: function setLevel(newLevel) {
	    if (newLevel < LOGLEVEL_NON_LOGGING) {
	      console$1.log(getPrefix() + 'set level from ' + globalLevel + ' to ' + newLevel);
	    }

	    globalLevel = newLevel;
	  },
	  record: function record(s, type) {

	    if (logger._length === MAX_LOG_LENGTH + 100) {
	      logger._data.splice(0, 100);

	      logger._length = MAX_LOG_LENGTH;
	    }

	    logger._length++;

	    logger._data.push("".concat(s, " [").concat(type, "] \n"));
	  },
	  getLog: function getLog() {
	    return logger._data;
	  }
	};

	/**
	 * 接入侧需要监听处理的事件列表，详细如下：
	 * @memberof SDK
	 * @exports EVENT
	 * @module EVENT
	 */
	var EVENT = {
	  /**
	   * @description SDK 进入 ready 状态时触发，接入侧监听此事件，然后可调用 SDK 发送消息等api，使用 SDK 的各项功能
	   * @memberOf module:EVENT
	   * @example
	   * let onIMReady = function(event) {
	   *   tweblive.sendTextMessage({
	   *     roomID: 'AV1',
	   *     priority: TWebLive.TYPES.MSG_PRIORITY_NORMAL,
	   *     text: 'hello from TWebLive'
	   *   });
	   * }
	   * tweblive.on(TWebLive.EVENT.IM_READY, onIMReady);
	   */
	  IM_READY: 't_im_ready',

	  /**
	   * @description SDK 进入 not ready 状态时触发，此时接入侧将无法使用 SDK 发送消息等功能。
	   * @memberof module:EVENT
	   * @example
	   * let onIMNotReady = function(event) {
	   *   // 如果想使用发送消息等功能，接入侧需驱动 SDK 进入 ready 状态，重新调用 login 接口即可，如下所示：
	   *   // tweblive.login({userID: 'your userID', userSig: 'your userSig'});
	   * };
	   * tweblive.on(TWebLive.EVENT.IM_NOT_READY, onIMNotReady);
	   */
	  IM_NOT_READY: 't_im_not_ready',

	  /**
	   * @description 收到文本消息时触发
	   * @memberOf module:EVENT
	   * @example
	   * let onTextMessageReceived = function(event) {
	   *   event.data.forEach(function(message) {
	   *     console.log('demo ' + (message.from || message.nick) + ' : ', message.payload.text);
	   *   });
	   * };
	   * tweblive.on(TWebLive.EVENT.TEXT_MESSAGE_RECEIVED, onTextMessageReceived);
	   */
	  TEXT_MESSAGE_RECEIVED: 't_text_message_received',

	  /**
	   * @description 收到自定义消息时触发
	   * @memberOf module:EVENT
	   * @example
	   * let onCustomMessageReceived = function(event) {
	   *   console.log('demo custom message received', event.data);
	   * };
	   * tweblive.on(TWebLive.EVENT.CUSTOM_MESSAGE_RECEIVED, onCustomMessageReceived);
	   */
	  CUSTOM_MESSAGE_RECEIVED: 't_custom_message_received',

	  /**
	   * @description 有远端用户进入直播间时触发
	   * @memberOf module:EVENT
	   * @example
	   * let onRemoteUserJoin = function(event) {
	   *   event.data.forEach(function(message) {
	   *     console.log('demo ' + (message.nick || message.payload.userIDList[0]) + ' 来了');
	   *   });
	   * };
	   * tweblive.on(TWebLive.EVENT.REMOTE_USER_JOIN, onRemoteUserJoin);
	   */
	  REMOTE_USER_JOIN: 't_remote_user_join',

	  /**
	   * @description 有远端用户离开直播间时触发
	   * @memberof module:EVENT
	   * @example
	   * let onRemoteUserLeave = function(event) {
	   *   event.data.forEach(function(message) {
	   *     console.log('demo ' + (message.nick || message.payload.userIDList[0]) + ' 走了');
	   *   });
	   * };
	   * tweblive.on(TWebLive.EVENT.REMOTE_USER_LEAVE, onRemoteUserLeave);
	   */
	  REMOTE_USER_LEAVE: 't_remote_user_leave',

	  /**
	   * @description 用户被踢下线时触发
	   * @memberof module:EVENT
	   * @example
	   * let onKickedOut = function(event) {
	   *   console.log(event.data.type);
	   *   // TWebLive.TYPES.KICKED_OUT_MULT_ACCOUNT(Web端，同一账号，多页面登录被踢)
	   *   // TWebLive.TYPES.KICKED_OUT_MULT_DEVICE(同一账号，多端登录被踢)
	   *   // TWebLive.TYPES.KICKED_OUT_USERSIG_EXPIRED(签名过期)
	   * };
	   * tweblive.on(TWebLive.EVENT.KICKED_OUT, onKickedOut);
	   */
	  KICKED_OUT: 't_kicked_out',

	  /**
	   * @description 网络状态发生改变
	   * @memberof module:EVENT
	   * @example
	   * let onNetStateChange = function(event) {
	   *   // event.data.state 当前网络状态，枚举值及说明如下：
	   *   // TWebLive.TYPES.NET_STATE_CONNECTED - 已接入网络
	   *   // TWebLive.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
	   *   // TWebLive.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
	   * };
	   * tweblive.on(TWebLive.EVENT.NET_STATE_CHANGE, onNetStateChange);
	   */
	  NET_STATE_CHANGE: 't_net_state_change',

	  /**
	   * @description 播放器进入播放状态时触发
	   * @memberof module:EVENT
	   * @example
	   * let onPlayerPlaying = function(event) {
	   * };
	   * tweblive.on(TWebLive.EVENT.PLAYING, onPlayerPlaying);
	   */
	  PLAYING: 't_playing',

	  /**
	   * @description 播放器暂停时触发
	   * @memberof module:EVENT
	   * @example
	   * let onPlayerPause = function(event) {
	   * };
	   * tweblive.on(TWebLive.EVENT.PAUSE, onPlayerPause);
	   */
	  PAUSE: 't_pause',

	  /**
	   * @description 播放器缓冲时触发
	   * @memberof module:EVENT
	   * @example
	   * let onPlayerWaiting = function(event) {
	   * };
	   * tweblive.on(TWebLive.EVENT.WAITING, onPlayerWaiting);
	   */
	  WAITING: 't_waiting',

	  /**
	   * @description 播放器播放进度更新时触发
	   * @memberof module:EVENT
	   * @example
	   * let onPlayerTimeUpdate = function(event) {
	   * };
	   * tweblive.on(TWebLive.EVENT.TIMEUPDATE, onPlayerTimeUpdate);
	   */
	  TIMEUPDATE: 't_timeupdate',

	  /**
	   * @description 视频播放结束时触发
	   * @memberof module:EVENT
	   * @example
	   * let onLiveEnded = function(event) {
	   *   // 直播已结束
	   * };
	   * tweblive.on(TWebLive.EVENT.ENDED, onLiveEnded);
	   */
	  ENDED: 't_ended',

	  /**
	   * @description 播放器遇到错误时触发
	   * @memberof module:EVENT
	   * @example
	   * let onError = function(event) {
	   *   // event.data.code - 错误码
	   *   // event.data.message - 错误信息
	   * };
	   * tweblive.on(TWebLive.EVENT.ERROR, onError);
	   */
	  ERROR: 't_error' // 给 SDK 外部处理的error事件

	};

	/**
	 * 用于安全回调封装
	 *
	 * @class SafetyCallback
	 */

	var SafetyCallback = /*#__PURE__*/function () {
	  function SafetyCallback() {
	    _classCallCheck(this, SafetyCallback);

	    this._funcMap = new Map();
	  }
	  /**
	   * 对用户输入的函数做安全封装
	   *
	   * @param {String} eventName - 必填，事件名称
	   * @param {Function} func - 必填，推荐使用具名函数
	   * @param {Object} [context] - 选填，回调函数的执行作用域，默认为 undefined
	   * @returns {Function | null}
	   *  Function: 说明封装成功;
	   *  null: 说明封装失败，请检查入参;
	   * @memberof SafetyCallback
	   */


	  _createClass(SafetyCallback, [{
	    key: "defense",
	    value: function defense(eventName, func) {
	      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

	      if (typeof eventName !== 'string') {
	        return null;
	      }

	      if (eventName.length === 0) {
	        return null;
	      }

	      if (typeof func !== 'function') {
	        return null;
	      } // 如果此函数已经存在，返回原函数


	      if (this._funcMap.has(eventName) && this._funcMap.get(eventName).has(func)) {
	        return this._funcMap.get(eventName).get(func);
	      }

	      if (!this._funcMap.has(eventName)) {
	        this._funcMap.set(eventName, new Map());
	      }

	      var safeFunc = null; // 如果已经封装过一次了，不需要重复封装

	      if (this._funcMap.get(eventName).has(func)) {
	        safeFunc = this._funcMap.get(eventName).get(func);
	      } else {
	        safeFunc = this._pack(eventName, func, context);

	        this._funcMap.get(eventName).set(func, safeFunc);
	      }

	      return safeFunc;
	    }
	    /**
	     * 对用户输入的函数做安全封装，此处为一次性封装，不存map，用于 TIM.once 函数
	     *
	     * @param {String} eventName - 必填，事件名称
	     * @param {Function} func - 必填，推荐使用具名函数
	     * @param {Object} [context] - 选填，回调函数的执行作用域，默认为 undefined
	     * @returns {Function | null}
	     *  Function: 说明封装成功;
	     *  null: 说明封装失败，请检查入参;
	     * @memberof SafetyCallback
	     */

	  }, {
	    key: "defenseOnce",
	    value: function defenseOnce(eventName, func) {
	      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

	      if (typeof func !== 'function') {
	        return null;
	      }

	      return this._pack(eventName, func, context);
	    }
	    /**
	     * 通过事件名称和源回调，查找某个安全回调
	     *
	     * @param {String} eventName - 必填，事件名称
	     * @param {Function} func - 必填，具名函数
	     * @returns {Function | null}
	     *  Function: 说明查找成功;
	     *  null: 说明没找到，请检查入参，或确认回调是否正确绑定;
	     * @memberof SafetyCallback
	     */

	  }, {
	    key: "find",
	    value: function find(eventName, func) {
	      if (typeof eventName !== 'string' || eventName.length === 0) {
	        return null;
	      }

	      if (typeof func !== 'function') {
	        return null;
	      }

	      if (!this._funcMap.has(eventName)) {
	        logger.log("SafetyCallback.find: \u627E\u4E0D\u5230 eventName-".concat(eventName, " \u5BF9\u5E94\u7684 func"));
	        return null;
	      }

	      if (!this._funcMap.get(eventName).has(func)) {
	        logger.log("SafetyCallback.find: \u627E\u4E0D\u5230 func \u2014\u2014 ".concat(eventName, "/").concat(func.name !== '' ? func.name : '[anonymous]'));
	        return null;
	      }

	      return this._funcMap.get(eventName).get(func);
	    }
	    /**
	     * 从 map 中删除函数
	     *
	     * @param {String} eventName - 必填，事件名称
	     * @param {Function} func - 必填，推荐使用具名函数
	     * @returns {Boolean}
	     * @memberof SafetyCallback
	     */

	  }, {
	    key: "delete",
	    value: function _delete(eventName, func) {
	      if (typeof func !== 'function') {
	        return false;
	      }

	      if (!this._funcMap.has(eventName)) {
	        return false;
	      }

	      if (!this._funcMap.get(eventName).has(func)) {
	        return false;
	      }

	      this._funcMap.get(eventName)["delete"](func); // 如果此 eventName 下的Map 已经是空的，则删除此节点


	      if (this._funcMap.get(eventName).size === 0) {
	        this._funcMap["delete"](eventName);
	      }

	      return true;
	    }
	    /**
	     * 安全封装
	     *
	     * @param {String} eventName - 事件名称
	     * @param {Function} func - 具名回调函数
	     * @param {Object} [context] - 回调函数的执行上下文，默认为 undefined
	     * @returns {Function}
	     */

	  }, {
	    key: "_pack",
	    value: function _pack(eventName, func, context) {
	      return function () {
	        try {
	          func.apply(context, Array.from(arguments));
	        } catch (err) {
	          var index = Object.values(EVENT).indexOf(eventName);
	          var event = Object.keys(EVENT)[index];
	          logger.error("\u63A5\u5165\u4FA7\u4E8B\u4EF6 EVENT.".concat(event, " \u5BF9\u5E94\u7684\u56DE\u8C03\u51FD\u6570\u903B\u8F91\u5B58\u5728\u95EE\u9898\uFF0C\u8BF7\u68C0\u67E5\uFF01"), err);
	        }
	      };
	    }
	  }]);

	  return SafetyCallback;
	}();

	const Apply = Function.prototype.apply;
	const privateMap = new WeakMap();

	// For making private properties.
	function internal(obj) {
	  if (!privateMap.has(obj)) {
	    privateMap.set(obj, {});
	  }

	  return privateMap.get(obj);
	}

	/** Class EventEmitter for event-driven architecture. */
	class EventEmitter {
	  /**
	   * Constructor.
	   *
	   * @constructor
	   * @param {number|null} maxListeners.
	   * @param {object} localConsole.
	   *
	   * Set private initial parameters:
	   *   _events, _callbacks, _maxListeners, _console.
	   *
	   * @return {this}
	   */
	  constructor(maxListeners = null, localConsole = console) {
	    const self = internal(this);

	    self._events = new Set();
	    self._callbacks = {};
	    self._console = localConsole;
	    self._maxListeners = maxListeners === null ?
	      null : parseInt(maxListeners, 10);

	    return this;
	  }

	  /**
	   * Add callback to the event.
	   *
	   * @param {string} eventName.
	   * @param {function} callback
	   * @param {object|null} context - In than context will be called callback.
	   * @param {number} weight - Using for sorting callbacks calls.
	   *
	   * @return {this}
	   */
	  _addCallback(eventName, callback, context, weight) {
	    this._getCallbacks(eventName)
	      .push({
	        callback,
	        context,
	        weight
	      });

	    // Sort the array of callbacks in
	    // the order of their call by "weight".
	    this._getCallbacks(eventName)
	      .sort((a, b) => a.weight > b.weight);

	    return this;
	  }

	  /**
	   * Get all callback for the event.
	   *
	   * @param {string} eventName
	   *
	   * @return {object|undefined}
	   */
	  _getCallbacks(eventName) {
	    return internal(this)._callbacks[eventName];
	  }

	  /**
	   * Get callback's index for the event.
	   *
	   * @param {string} eventName
	   * @param {callback} callback
	   *
	   * @return {number|null}
	   */
	  _getCallbackIndex(eventName, callback) {
	    return this._has(eventName) ?
	      this._getCallbacks(eventName)
	        .findIndex((element) => element.callback === callback) : null;
	  }

	  /**
	   * Check if we achive maximum of listeners for the event.
	   *
	   * @param {string} eventName
	   *
	   * @return {bool}
	   */
	  _achieveMaxListener(eventName) {
	    return (internal(this)._maxListeners !== null &&
	      internal(this)._maxListeners <= this.listenersNumber(eventName));
	  }

	  /**
	   * Check if callback is already exists for the event.
	   *
	   * @param {string} eventName
	   * @param {function} callback
	   * @param {object|null} context - In than context will be called callback.
	   *
	   * @return {bool}
	   */
	  _callbackIsExists(eventName, callback, context) {
	    const callbackInd = this._getCallbackIndex(eventName, callback);
	    const activeCallback = callbackInd !== -1 ?
	      this._getCallbacks(eventName)[callbackInd] : void 0;

	    return (callbackInd !== -1 && activeCallback &&
	      activeCallback.context === context);
	  }

	  /**
	   * Check is the event was already added.
	   *
	   * @param {string} eventName
	   *
	   * @return {bool}
	   */
	  _has(eventName) {
	    return internal(this)._events.has(eventName);
	  }

	  /**
	   * Add the listener.
	   *
	   * @param {string} eventName
	   * @param {function} callback
	   * @param {object|null} context - In than context will be called callback.
	   * @param {number} weight - Using for sorting callbacks calls.
	   *
	   * @return {this}
	   */
	  on(eventName, callback, context = null, weight = 1) {
	    /* eslint no-unused-vars: 0 */
	    const self = internal(this);

	    if (typeof callback !== 'function') {
	      throw new TypeError(`${callback} is not a function`);
	    }

	    // If event wasn't added before - just add it
	    // and define callbacks as an empty object.
	    if (!this._has(eventName)) {
	      self._events.add(eventName);
	      self._callbacks[eventName] = [];
	    } else {
	      // Check if we reached maximum number of listeners.
	      if (this._achieveMaxListener(eventName)) {
	        self._console.warn(`Max listeners (${self._maxListeners})` +
	          ` for event "${eventName}" is reached!`);
	      }

	      // Check if the same callback has already added.
	      if (this._callbackIsExists(...arguments)) {
	        self._console.warn(`Event "${eventName}"` +
	          ` already has the callback ${callback}.`);
	      }
	    }

	    this._addCallback(...arguments);

	    return this;
	  }

	  /**
	   * Add the listener which will be executed only once.
	   *
	   * @param {string} eventName
	   * @param {function} callback
	   * @param {object|null} context - In than context will be called callback.
	   * @param {number} weight - Using for sorting callbacks calls.
	   *
	   * @return {this}
	   */
	  once(eventName, callback, context = null, weight = 1) {
	    const onceCallback = (...args) => {
	      this.off(eventName, onceCallback);
	      return Apply.call(callback, context, args);
	    };

	    return this.on(eventName, onceCallback, context, weight);
	  }

	  /**
	   * Remove an event at all or just remove selected callback from the event.
	   *
	   * @param {string} eventName
	   * @param {function} callback
	   *
	   * @return {this}
	   */
	  off(eventName, callback = null) {
	    const self = internal(this);
	    let callbackInd;

	    if (this._has(eventName)) {
	      if (callback === null) {
	        // Remove the event.
	        self._events.delete(eventName);
	        // Remove all listeners.
	        self._callbacks[eventName] = null;
	      } else {
	        callbackInd = this._getCallbackIndex(eventName, callback);

	        if (callbackInd !== -1) {
	          self._callbacks[eventName].splice(callbackInd, 1);
	          // Remove all equal callbacks.
	          this.off(...arguments);
	        }
	      }
	    }

	    return this;
	  }

	  /**
	   * Trigger the event.
	   *
	   * @param {string} eventName
	   * @param {...args} args - All arguments which should be passed into callbacks.
	   *
	   * @return {this}
	   */
	  emit(eventName, ...args) {
	    if (this._has(eventName)) {
	      // All callbacks will be triggered sorter by "weight" parameter.
	      this._getCallbacks(eventName)
	        .forEach((element) =>
	          Apply.call(element.callback, element.context, args)
	        );
	    }

	    return this;
	  }

	  /**
	   * Clear all events and callback links.
	   *
	   * @return {this}
	   */
	  clear() {
	    const self = internal(this);

	    self._events.clear();
	    self._callbacks = {};

	    return this;
	  }

	  /**
	   * Returns number of listeners for the event.
	   *
	   * @param {string} eventName
	   *
	   * @return {number|null} - Number of listeners for event
	   *                         or null if event isn't exists.
	   */
	  listenersNumber(eventName) {
	    return this._has(eventName) ?
	      this._getCallbacks(eventName).length : null;
	  }
	}

	/**
	 * Has own property.
	 *
	 * @type {Function}
	 */

	var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
	/**
	 * Test whether a value is "empty".
	 *
	 * @param {Mixed} val
	 * @returns {Boolean}
	 */

	function isEmpty(val) {
	  // Null and Undefined...
	  if (val === null || typeof val === 'undefined') return true; // Booleans...

	  if ('boolean' === typeof val) return false; // Numbers...

	  if ('number' === typeof val) return val === 0; // Strings...

	  if ('string' === typeof val) return val.length === 0; // Functions...

	  if ('function' === typeof val) return val.length === 0; // Arrays...

	  if (Array.isArray(val)) return val.length === 0; // Errors...

	  if (val instanceof Error) return val.message === ''; // plain object

	  if (isPlainObject(val)) {
	    for (var key in val) {
	      if (hasOwnProperty$1.call(val, key)) {
	        return false;
	      }
	    }

	    return true;
	  } // map or set or file


	  if (isMap(val) || isSet(val) || isFile(val)) {
	    return val.size === 0;
	  } // Anything else...


	  return false;
	}

	// `Symbol.iterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');

	// `thisNumberValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-thisnumbervalue
	var thisNumberValue = function (value) {
	  if (typeof value != 'number' && classofRaw(value) != 'Number') {
	    throw TypeError('Incorrect invocation');
	  }
	  return +value;
	};

	var nativeToFixed = 1.0.toFixed;
	var floor$2 = Math.floor;

	var pow = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
	};

	var log = function (x) {
	  var n = 0;
	  var x2 = x;
	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }
	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  } return n;
	};

	var FORCED$4 = nativeToFixed && (
	  0.00008.toFixed(3) !== '0.000' ||
	  0.9.toFixed(0) !== '1' ||
	  1.255.toFixed(2) !== '1.25' ||
	  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
	) || !fails(function () {
	  // V8 ~ Android 4.3-
	  nativeToFixed.call({});
	});

	// `Number.prototype.toFixed` method
	// https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
	_export({ target: 'Number', proto: true, forced: FORCED$4 }, {
	  // eslint-disable-next-line max-statements
	  toFixed: function toFixed(fractionDigits) {
	    var number = thisNumberValue(this);
	    var fractDigits = toInteger(fractionDigits);
	    var data = [0, 0, 0, 0, 0, 0];
	    var sign = '';
	    var result = '0';
	    var e, z, j, k;

	    var multiply = function (n, c) {
	      var index = -1;
	      var c2 = c;
	      while (++index < 6) {
	        c2 += n * data[index];
	        data[index] = c2 % 1e7;
	        c2 = floor$2(c2 / 1e7);
	      }
	    };

	    var divide = function (n) {
	      var index = 6;
	      var c = 0;
	      while (--index >= 0) {
	        c += data[index];
	        data[index] = floor$2(c / n);
	        c = (c % n) * 1e7;
	      }
	    };

	    var dataToString = function () {
	      var index = 6;
	      var s = '';
	      while (--index >= 0) {
	        if (s !== '' || index === 0 || data[index] !== 0) {
	          var t = String(data[index]);
	          s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
	        }
	      } return s;
	    };

	    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
	    // eslint-disable-next-line no-self-compare
	    if (number != number) return 'NaN';
	    if (number <= -1e21 || number >= 1e21) return String(number);
	    if (number < 0) {
	      sign = '-';
	      number = -number;
	    }
	    if (number > 1e-21) {
	      e = log(number * pow(2, 69, 1)) - 69;
	      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(0, z);
	        j = fractDigits;
	        while (j >= 7) {
	          multiply(1e7, 0);
	          j -= 7;
	        }
	        multiply(pow(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(1 << 23);
	          j -= 23;
	        }
	        divide(1 << j);
	        multiply(1, 1);
	        divide(2);
	        result = dataToString();
	      } else {
	        multiply(0, z);
	        multiply(1 << -e, 0);
	        result = dataToString() + stringRepeat.call('0', fractDigits);
	      }
	    }
	    if (fractDigits > 0) {
	      k = result.length;
	      result = sign + (k <= fractDigits
	        ? '0.' + stringRepeat.call('0', fractDigits - k) + result
	        : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
	    } else {
	      result = sign + result;
	    } return result;
	  }
	});

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	_export({ target: 'Object', stat: true }, {
	  setPrototypeOf: objectSetPrototypeOf
	});

	var defineProperty$7 = objectDefineProperty.f;
	var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;





	var setInternalState$5 = internalState.set;



	var MATCH$2 = wellKnownSymbol('match');
	var NativeRegExp = global_1.RegExp;
	var RegExpPrototype$1 = NativeRegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;

	var FORCED$5 = descriptors && isForced_1('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y$2 || fails(function () {
	  re2[MATCH$2] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	})));

	// `RegExp` constructor
	// https://tc39.github.io/ecma262/#sec-regexp-constructor
	if (FORCED$5) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper;
	    var patternIsRegExp = isRegexp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var sticky;

	    if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
	      return pattern;
	    }

	    if (CORRECT_NEW) {
	      if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
	    } else if (pattern instanceof RegExpWrapper) {
	      if (flagsAreUndefined) flags = regexpFlags.call(pattern);
	      pattern = pattern.source;
	    }

	    if (UNSUPPORTED_Y$2) {
	      sticky = !!flags && flags.indexOf('y') > -1;
	      if (sticky) flags = flags.replace(/y/g, '');
	    }

	    var result = inheritIfRequired(
	      CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
	      thisIsRegExp ? this : RegExpPrototype$1,
	      RegExpWrapper
	    );

	    if (UNSUPPORTED_Y$2 && sticky) setInternalState$5(result, { sticky: sticky });

	    return result;
	  };
	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$7(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };
	  var keys$2 = getOwnPropertyNames$1(NativeRegExp);
	  var index = 0;
	  while (keys$2.length > index) proxy(keys$2[index++]);
	  RegExpPrototype$1.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype$1;
	  redefine(global_1, 'RegExp', RegExpWrapper);
	}

	// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	var arrayPush = [].push;
	var min$4 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF;

	// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
	var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

	// @@split logic
	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string];
	      // If `separator` is not a regex, use native split
	      if (!isRegexp(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }
	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output.length > lim ? output.slice(0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [
	    // `String.prototype.split` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible(this);
	      var splitter = separator == undefined ? undefined : separator[SPLIT];
	      return splitter !== undefined
	        ? splitter.call(separator, O, limit)
	        : internalSplit.call(String(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (regexp, limit) {
	      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);
	      var C = speciesConstructor(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (SUPPORTS_Y ? 'y' : 'g');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y ? q : 0;
	        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = min$4(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
	        ) {
	          q = advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          A.push(S.slice(p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            A.push(z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      A.push(S.slice(p));
	      return A;
	    }
	  ];
	}, !SUPPORTS_Y);

	var quot = /"/g;

	// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	// https://tc39.github.io/ecma262/#sec-createhtml
	var createHtml = function (string, tag, attribute, value) {
	  var S = String(requireObjectCoercible(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};

	// check the existence of a method, lowercase
	// of a tag and escaping quotes in arguments
	var stringHtmlForced = function (METHOD_NAME) {
	  return fails(function () {
	    var test = ''[METHOD_NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  });
	};

	// `String.prototype.sub` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.sub
	_export({ target: 'String', proto: true, forced: stringHtmlForced('sub') }, {
	  sub: function sub() {
	    return createHtml(this, 'sub', '', '');
	  }
	});

	var slice$1 = [].slice;
	var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check

	var wrap$1 = function (scheduler) {
	  return function (handler, timeout /* , ...arguments */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice$1.call(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
	    } : handler, timeout);
	  };
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	_export({ global: true, bind: true, forced: MSIE }, {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap$1(global_1.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap$1(global_1.setInterval)
	});

	var ITERATOR$6 = wellKnownSymbol('iterator');

	var nativeUrl = !fails(function () {
	  var url = new URL('b?a=1&b=2&c=3', 'http://a');
	  var searchParams = url.searchParams;
	  var result = '';
	  url.pathname = 'c%20d';
	  searchParams.forEach(function (value, key) {
	    searchParams['delete']('b');
	    result += key + value;
	  });
	  return (isPure && !url.toJSON)
	    || !searchParams.sort
	    || url.href !== 'http://a/c%20d?a=1&c=3'
	    || searchParams.get('c') !== '3'
	    || String(new URLSearchParams('?a=1')) !== 'a=1'
	    || !searchParams[ITERATOR$6]
	    // throws in Edge
	    || new URL('https://a@b').username !== 'a'
	    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
	    // not punycoded in Edge
	    || new URL('http://тест').host !== 'xn--e1aybc'
	    // not escaped in Chrome 62-
	    || new URL('http://a#б').hash !== '#%D0%B1'
	    // fails in Chrome 66-
	    || result !== 'a1c3'
	    // throws in Safari
	    || new URL('http://x', undefined).host !== 'x';
	});

	var nativeAssign = Object.assign;
	var defineProperty$8 = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$8({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$8(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : nativeAssign;

	// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
	var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128; // 0x80
	var delimiter = '-'; // '\x2D'
	var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
	var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
	var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
	var baseMinusTMin = base - tMin;
	var floor$3 = Math.floor;
	var stringFromCharCode = String.fromCharCode;

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 */
	var ucs2decode = function (string) {
	  var output = [];
	  var counter = 0;
	  var length = string.length;
	  while (counter < length) {
	    var value = string.charCodeAt(counter++);
	    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
	      // It's a high surrogate, and there is a next character.
	      var extra = string.charCodeAt(counter++);
	      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
	        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
	      } else {
	        // It's an unmatched surrogate; only append this code unit, in case the
	        // next code unit is the high surrogate of a surrogate pair.
	        output.push(value);
	        counter--;
	      }
	    } else {
	      output.push(value);
	    }
	  }
	  return output;
	};

	/**
	 * Converts a digit/integer into a basic code point.
	 */
	var digitToBasic = function (digit) {
	  //  0..25 map to ASCII a..z or A..Z
	  // 26..35 map to ASCII 0..9
	  return digit + 22 + 75 * (digit < 26);
	};

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 */
	var adapt = function (delta, numPoints, firstTime) {
	  var k = 0;
	  delta = firstTime ? floor$3(delta / damp) : delta >> 1;
	  delta += floor$3(delta / numPoints);
	  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
	    delta = floor$3(delta / baseMinusTMin);
	  }
	  return floor$3(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 */
	// eslint-disable-next-line  max-statements
	var encode = function (input) {
	  var output = [];

	  // Convert the input in UCS-2 to an array of Unicode code points.
	  input = ucs2decode(input);

	  // Cache the length.
	  var inputLength = input.length;

	  // Initialize the state.
	  var n = initialN;
	  var delta = 0;
	  var bias = initialBias;
	  var i, currentValue;

	  // Handle the basic code points.
	  for (i = 0; i < input.length; i++) {
	    currentValue = input[i];
	    if (currentValue < 0x80) {
	      output.push(stringFromCharCode(currentValue));
	    }
	  }

	  var basicLength = output.length; // number of basic code points.
	  var handledCPCount = basicLength; // number of code points that have been handled;

	  // Finish the basic string with a delimiter unless it's empty.
	  if (basicLength) {
	    output.push(delimiter);
	  }

	  // Main encoding loop:
	  while (handledCPCount < inputLength) {
	    // All non-basic code points < n have been handled already. Find the next larger one:
	    var m = maxInt;
	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue >= n && currentValue < m) {
	        m = currentValue;
	      }
	    }

	    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
	    var handledCPCountPlusOne = handledCPCount + 1;
	    if (m - n > floor$3((maxInt - delta) / handledCPCountPlusOne)) {
	      throw RangeError(OVERFLOW_ERROR);
	    }

	    delta += (m - n) * handledCPCountPlusOne;
	    n = m;

	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue < n && ++delta > maxInt) {
	        throw RangeError(OVERFLOW_ERROR);
	      }
	      if (currentValue == n) {
	        // Represent delta as a generalized variable-length integer.
	        var q = delta;
	        for (var k = base; /* no condition */; k += base) {
	          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	          if (q < t) break;
	          var qMinusT = q - t;
	          var baseMinusT = base - t;
	          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
	          q = floor$3(qMinusT / baseMinusT);
	        }

	        output.push(stringFromCharCode(digitToBasic(q)));
	        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
	        delta = 0;
	        ++handledCPCount;
	      }
	    }

	    ++delta;
	    ++n;
	  }
	  return output.join('');
	};

	var stringPunycodeToAscii = function (input) {
	  var encoded = [];
	  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
	  var i, label;
	  for (i = 0; i < labels.length; i++) {
	    label = labels[i];
	    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
	  }
	  return encoded.join('.');
	};

	var getIterator = function (it) {
	  var iteratorMethod = getIteratorMethod(it);
	  if (typeof iteratorMethod != 'function') {
	    throw TypeError(String(it) + ' is not iterable');
	  } return anObject(iteratorMethod.call(it));
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















	var $fetch$1 = getBuiltIn('fetch');
	var Headers = getBuiltIn('Headers');
	var ITERATOR$7 = wellKnownSymbol('iterator');
	var URL_SEARCH_PARAMS = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
	var setInternalState$6 = internalState.set;
	var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
	var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

	var plus = /\+/g;
	var sequences = Array(4);

	var percentSequence = function (bytes) {
	  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
	};

	var percentDecode = function (sequence) {
	  try {
	    return decodeURIComponent(sequence);
	  } catch (error) {
	    return sequence;
	  }
	};

	var deserialize = function (it) {
	  var result = it.replace(plus, ' ');
	  var bytes = 4;
	  try {
	    return decodeURIComponent(result);
	  } catch (error) {
	    while (bytes) {
	      result = result.replace(percentSequence(bytes--), percentDecode);
	    }
	    return result;
	  }
	};

	var find = /[!'()~]|%20/g;

	var replace = {
	  '!': '%21',
	  "'": '%27',
	  '(': '%28',
	  ')': '%29',
	  '~': '%7E',
	  '%20': '+'
	};

	var replacer = function (match) {
	  return replace[match];
	};

	var serialize = function (it) {
	  return encodeURIComponent(it).replace(find, replacer);
	};

	var parseSearchParams = function (result, query) {
	  if (query) {
	    var attributes = query.split('&');
	    var index = 0;
	    var attribute, entry;
	    while (index < attributes.length) {
	      attribute = attributes[index++];
	      if (attribute.length) {
	        entry = attribute.split('=');
	        result.push({
	          key: deserialize(entry.shift()),
	          value: deserialize(entry.join('='))
	        });
	      }
	    }
	  }
	};

	var updateSearchParams = function (query) {
	  this.entries.length = 0;
	  parseSearchParams(this.entries, query);
	};

	var validateArgumentsLength = function (passed, required) {
	  if (passed < required) throw TypeError('Not enough arguments');
	};

	var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
	  setInternalState$6(this, {
	    type: URL_SEARCH_PARAMS_ITERATOR,
	    iterator: getIterator(getInternalParamsState(params).entries),
	    kind: kind
	  });
	}, 'Iterator', function next() {
	  var state = getInternalIteratorState(this);
	  var kind = state.kind;
	  var step = state.iterator.next();
	  var entry = step.value;
	  if (!step.done) {
	    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
	  } return step;
	});

	// `URLSearchParams` constructor
	// https://url.spec.whatwg.org/#interface-urlsearchparams
	var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
	  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
	  var init = arguments.length > 0 ? arguments[0] : undefined;
	  var that = this;
	  var entries = [];
	  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

	  setInternalState$6(that, {
	    type: URL_SEARCH_PARAMS,
	    entries: entries,
	    updateURL: function () { /* empty */ },
	    updateSearchParams: updateSearchParams
	  });

	  if (init !== undefined) {
	    if (isObject(init)) {
	      iteratorMethod = getIteratorMethod(init);
	      if (typeof iteratorMethod === 'function') {
	        iterator = iteratorMethod.call(init);
	        next = iterator.next;
	        while (!(step = next.call(iterator)).done) {
	          entryIterator = getIterator(anObject(step.value));
	          entryNext = entryIterator.next;
	          if (
	            (first = entryNext.call(entryIterator)).done ||
	            (second = entryNext.call(entryIterator)).done ||
	            !entryNext.call(entryIterator).done
	          ) throw TypeError('Expected sequence with length 2');
	          entries.push({ key: first.value + '', value: second.value + '' });
	        }
	      } else for (key in init) if (has(init, key)) entries.push({ key: key, value: init[key] + '' });
	    } else {
	      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
	    }
	  }
	};

	var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

	redefineAll(URLSearchParamsPrototype, {
	  // `URLSearchParams.prototype.appent` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
	  append: function append(name, value) {
	    validateArgumentsLength(arguments.length, 2);
	    var state = getInternalParamsState(this);
	    state.entries.push({ key: name + '', value: value + '' });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.delete` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
	  'delete': function (name) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var key = name + '';
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index].key === key) entries.splice(index, 1);
	      else index++;
	    }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.get` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
	  get: function get(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) return entries[index].value;
	    }
	    return null;
	  },
	  // `URLSearchParams.prototype.getAll` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
	  getAll: function getAll(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var result = [];
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) result.push(entries[index].value);
	    }
	    return result;
	  },
	  // `URLSearchParams.prototype.has` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
	  has: function has(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index++].key === key) return true;
	    }
	    return false;
	  },
	  // `URLSearchParams.prototype.set` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
	  set: function set(name, value) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var found = false;
	    var key = name + '';
	    var val = value + '';
	    var index = 0;
	    var entry;
	    for (; index < entries.length; index++) {
	      entry = entries[index];
	      if (entry.key === key) {
	        if (found) entries.splice(index--, 1);
	        else {
	          found = true;
	          entry.value = val;
	        }
	      }
	    }
	    if (!found) entries.push({ key: key, value: val });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.sort` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
	  sort: function sort() {
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    // Array#sort is not stable in some engines
	    var slice = entries.slice();
	    var entry, entriesIndex, sliceIndex;
	    entries.length = 0;
	    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
	      entry = slice[sliceIndex];
	      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
	        if (entries[entriesIndex].key > entry.key) {
	          entries.splice(entriesIndex, 0, entry);
	          break;
	        }
	      }
	      if (entriesIndex === sliceIndex) entries.push(entry);
	    }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.forEach` method
	  forEach: function forEach(callback /* , thisArg */) {
	    var entries = getInternalParamsState(this).entries;
	    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      boundFunction(entry.value, entry.key, this);
	    }
	  },
	  // `URLSearchParams.prototype.keys` method
	  keys: function keys() {
	    return new URLSearchParamsIterator(this, 'keys');
	  },
	  // `URLSearchParams.prototype.values` method
	  values: function values() {
	    return new URLSearchParamsIterator(this, 'values');
	  },
	  // `URLSearchParams.prototype.entries` method
	  entries: function entries() {
	    return new URLSearchParamsIterator(this, 'entries');
	  }
	}, { enumerable: true });

	// `URLSearchParams.prototype[@@iterator]` method
	redefine(URLSearchParamsPrototype, ITERATOR$7, URLSearchParamsPrototype.entries);

	// `URLSearchParams.prototype.toString` method
	// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
	redefine(URLSearchParamsPrototype, 'toString', function toString() {
	  var entries = getInternalParamsState(this).entries;
	  var result = [];
	  var index = 0;
	  var entry;
	  while (index < entries.length) {
	    entry = entries[index++];
	    result.push(serialize(entry.key) + '=' + serialize(entry.value));
	  } return result.join('&');
	}, { enumerable: true });

	setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

	_export({ global: true, forced: !nativeUrl }, {
	  URLSearchParams: URLSearchParamsConstructor
	});

	// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
	// https://github.com/zloirock/core-js/issues/674
	if (!nativeUrl && typeof $fetch$1 == 'function' && typeof Headers == 'function') {
	  _export({ global: true, enumerable: true, forced: true }, {
	    fetch: function fetch(input /* , init */) {
	      var args = [input];
	      var init, body, headers;
	      if (arguments.length > 1) {
	        init = arguments[1];
	        if (isObject(init)) {
	          body = init.body;
	          if (classof(body) === URL_SEARCH_PARAMS) {
	            headers = init.headers ? new Headers(init.headers) : new Headers();
	            if (!headers.has('content-type')) {
	              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	            }
	            init = objectCreate(init, {
	              body: createPropertyDescriptor(0, String(body)),
	              headers: createPropertyDescriptor(0, headers)
	            });
	          }
	        }
	        args.push(init);
	      } return $fetch$1.apply(this, args);
	    }
	  });
	}

	var web_urlSearchParams = {
	  URLSearchParams: URLSearchParamsConstructor,
	  getState: getInternalParamsState
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











	var codeAt = stringMultibyte.codeAt;





	var NativeURL = global_1.URL;
	var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
	var getInternalSearchParamsState = web_urlSearchParams.getState;
	var setInternalState$7 = internalState.set;
	var getInternalURLState = internalState.getterFor('URL');
	var floor$4 = Math.floor;
	var pow$1 = Math.pow;

	var INVALID_AUTHORITY = 'Invalid authority';
	var INVALID_SCHEME = 'Invalid scheme';
	var INVALID_HOST = 'Invalid host';
	var INVALID_PORT = 'Invalid port';

	var ALPHA = /[A-Za-z]/;
	var ALPHANUMERIC = /[\d+-.A-Za-z]/;
	var DIGIT = /\d/;
	var HEX_START = /^(0x|0X)/;
	var OCT = /^[0-7]+$/;
	var DEC = /^\d+$/;
	var HEX = /^[\dA-Fa-f]+$/;
	// eslint-disable-next-line no-control-regex
	var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
	// eslint-disable-next-line no-control-regex
	var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
	// eslint-disable-next-line no-control-regex
	var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
	// eslint-disable-next-line no-control-regex
	var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
	var EOF;

	var parseHost = function (url, input) {
	  var result, codePoints, index;
	  if (input.charAt(0) == '[') {
	    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
	    result = parseIPv6(input.slice(1, -1));
	    if (!result) return INVALID_HOST;
	    url.host = result;
	  // opaque host
	  } else if (!isSpecial(url)) {
	    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
	    result = '';
	    codePoints = arrayFrom(input);
	    for (index = 0; index < codePoints.length; index++) {
	      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
	    }
	    url.host = result;
	  } else {
	    input = stringPunycodeToAscii(input);
	    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
	    result = parseIPv4(input);
	    if (result === null) return INVALID_HOST;
	    url.host = result;
	  }
	};

	var parseIPv4 = function (input) {
	  var parts = input.split('.');
	  var partsLength, numbers, index, part, radix, number, ipv4;
	  if (parts.length && parts[parts.length - 1] == '') {
	    parts.pop();
	  }
	  partsLength = parts.length;
	  if (partsLength > 4) return input;
	  numbers = [];
	  for (index = 0; index < partsLength; index++) {
	    part = parts[index];
	    if (part == '') return input;
	    radix = 10;
	    if (part.length > 1 && part.charAt(0) == '0') {
	      radix = HEX_START.test(part) ? 16 : 8;
	      part = part.slice(radix == 8 ? 1 : 2);
	    }
	    if (part === '') {
	      number = 0;
	    } else {
	      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
	      number = parseInt(part, radix);
	    }
	    numbers.push(number);
	  }
	  for (index = 0; index < partsLength; index++) {
	    number = numbers[index];
	    if (index == partsLength - 1) {
	      if (number >= pow$1(256, 5 - partsLength)) return null;
	    } else if (number > 255) return null;
	  }
	  ipv4 = numbers.pop();
	  for (index = 0; index < numbers.length; index++) {
	    ipv4 += numbers[index] * pow$1(256, 3 - index);
	  }
	  return ipv4;
	};

	// eslint-disable-next-line max-statements
	var parseIPv6 = function (input) {
	  var address = [0, 0, 0, 0, 0, 0, 0, 0];
	  var pieceIndex = 0;
	  var compress = null;
	  var pointer = 0;
	  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

	  var char = function () {
	    return input.charAt(pointer);
	  };

	  if (char() == ':') {
	    if (input.charAt(1) != ':') return;
	    pointer += 2;
	    pieceIndex++;
	    compress = pieceIndex;
	  }
	  while (char()) {
	    if (pieceIndex == 8) return;
	    if (char() == ':') {
	      if (compress !== null) return;
	      pointer++;
	      pieceIndex++;
	      compress = pieceIndex;
	      continue;
	    }
	    value = length = 0;
	    while (length < 4 && HEX.test(char())) {
	      value = value * 16 + parseInt(char(), 16);
	      pointer++;
	      length++;
	    }
	    if (char() == '.') {
	      if (length == 0) return;
	      pointer -= length;
	      if (pieceIndex > 6) return;
	      numbersSeen = 0;
	      while (char()) {
	        ipv4Piece = null;
	        if (numbersSeen > 0) {
	          if (char() == '.' && numbersSeen < 4) pointer++;
	          else return;
	        }
	        if (!DIGIT.test(char())) return;
	        while (DIGIT.test(char())) {
	          number = parseInt(char(), 10);
	          if (ipv4Piece === null) ipv4Piece = number;
	          else if (ipv4Piece == 0) return;
	          else ipv4Piece = ipv4Piece * 10 + number;
	          if (ipv4Piece > 255) return;
	          pointer++;
	        }
	        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
	        numbersSeen++;
	        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
	      }
	      if (numbersSeen != 4) return;
	      break;
	    } else if (char() == ':') {
	      pointer++;
	      if (!char()) return;
	    } else if (char()) return;
	    address[pieceIndex++] = value;
	  }
	  if (compress !== null) {
	    swaps = pieceIndex - compress;
	    pieceIndex = 7;
	    while (pieceIndex != 0 && swaps > 0) {
	      swap = address[pieceIndex];
	      address[pieceIndex--] = address[compress + swaps - 1];
	      address[compress + --swaps] = swap;
	    }
	  } else if (pieceIndex != 8) return;
	  return address;
	};

	var findLongestZeroSequence = function (ipv6) {
	  var maxIndex = null;
	  var maxLength = 1;
	  var currStart = null;
	  var currLength = 0;
	  var index = 0;
	  for (; index < 8; index++) {
	    if (ipv6[index] !== 0) {
	      if (currLength > maxLength) {
	        maxIndex = currStart;
	        maxLength = currLength;
	      }
	      currStart = null;
	      currLength = 0;
	    } else {
	      if (currStart === null) currStart = index;
	      ++currLength;
	    }
	  }
	  if (currLength > maxLength) {
	    maxIndex = currStart;
	    maxLength = currLength;
	  }
	  return maxIndex;
	};

	var serializeHost = function (host) {
	  var result, index, compress, ignore0;
	  // ipv4
	  if (typeof host == 'number') {
	    result = [];
	    for (index = 0; index < 4; index++) {
	      result.unshift(host % 256);
	      host = floor$4(host / 256);
	    } return result.join('.');
	  // ipv6
	  } else if (typeof host == 'object') {
	    result = '';
	    compress = findLongestZeroSequence(host);
	    for (index = 0; index < 8; index++) {
	      if (ignore0 && host[index] === 0) continue;
	      if (ignore0) ignore0 = false;
	      if (compress === index) {
	        result += index ? ':' : '::';
	        ignore0 = true;
	      } else {
	        result += host[index].toString(16);
	        if (index < 7) result += ':';
	      }
	    }
	    return '[' + result + ']';
	  } return host;
	};

	var C0ControlPercentEncodeSet = {};
	var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
	  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
	});
	var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
	  '#': 1, '?': 1, '{': 1, '}': 1
	});
	var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
	  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
	});

	var percentEncode = function (char, set) {
	  var code = codeAt(char, 0);
	  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
	};

	var specialSchemes = {
	  ftp: 21,
	  file: null,
	  http: 80,
	  https: 443,
	  ws: 80,
	  wss: 443
	};

	var isSpecial = function (url) {
	  return has(specialSchemes, url.scheme);
	};

	var includesCredentials = function (url) {
	  return url.username != '' || url.password != '';
	};

	var cannotHaveUsernamePasswordPort = function (url) {
	  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
	};

	var isWindowsDriveLetter = function (string, normalized) {
	  var second;
	  return string.length == 2 && ALPHA.test(string.charAt(0))
	    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
	};

	var startsWithWindowsDriveLetter = function (string) {
	  var third;
	  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
	    string.length == 2 ||
	    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
	  );
	};

	var shortenURLsPath = function (url) {
	  var path = url.path;
	  var pathSize = path.length;
	  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
	    path.pop();
	  }
	};

	var isSingleDot = function (segment) {
	  return segment === '.' || segment.toLowerCase() === '%2e';
	};

	var isDoubleDot = function (segment) {
	  segment = segment.toLowerCase();
	  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
	};

	// States:
	var SCHEME_START = {};
	var SCHEME = {};
	var NO_SCHEME = {};
	var SPECIAL_RELATIVE_OR_AUTHORITY = {};
	var PATH_OR_AUTHORITY = {};
	var RELATIVE = {};
	var RELATIVE_SLASH = {};
	var SPECIAL_AUTHORITY_SLASHES = {};
	var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
	var AUTHORITY = {};
	var HOST = {};
	var HOSTNAME = {};
	var PORT = {};
	var FILE = {};
	var FILE_SLASH = {};
	var FILE_HOST = {};
	var PATH_START = {};
	var PATH = {};
	var CANNOT_BE_A_BASE_URL_PATH = {};
	var QUERY = {};
	var FRAGMENT = {};

	// eslint-disable-next-line max-statements
	var parseURL = function (url, input, stateOverride, base) {
	  var state = stateOverride || SCHEME_START;
	  var pointer = 0;
	  var buffer = '';
	  var seenAt = false;
	  var seenBracket = false;
	  var seenPasswordToken = false;
	  var codePoints, char, bufferCodePoints, failure;

	  if (!stateOverride) {
	    url.scheme = '';
	    url.username = '';
	    url.password = '';
	    url.host = null;
	    url.port = null;
	    url.path = [];
	    url.query = null;
	    url.fragment = null;
	    url.cannotBeABaseURL = false;
	    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
	  }

	  input = input.replace(TAB_AND_NEW_LINE, '');

	  codePoints = arrayFrom(input);

	  while (pointer <= codePoints.length) {
	    char = codePoints[pointer];
	    switch (state) {
	      case SCHEME_START:
	        if (char && ALPHA.test(char)) {
	          buffer += char.toLowerCase();
	          state = SCHEME;
	        } else if (!stateOverride) {
	          state = NO_SCHEME;
	          continue;
	        } else return INVALID_SCHEME;
	        break;

	      case SCHEME:
	        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
	          buffer += char.toLowerCase();
	        } else if (char == ':') {
	          if (stateOverride && (
	            (isSpecial(url) != has(specialSchemes, buffer)) ||
	            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
	            (url.scheme == 'file' && !url.host)
	          )) return;
	          url.scheme = buffer;
	          if (stateOverride) {
	            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
	            return;
	          }
	          buffer = '';
	          if (url.scheme == 'file') {
	            state = FILE;
	          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
	            state = SPECIAL_RELATIVE_OR_AUTHORITY;
	          } else if (isSpecial(url)) {
	            state = SPECIAL_AUTHORITY_SLASHES;
	          } else if (codePoints[pointer + 1] == '/') {
	            state = PATH_OR_AUTHORITY;
	            pointer++;
	          } else {
	            url.cannotBeABaseURL = true;
	            url.path.push('');
	            state = CANNOT_BE_A_BASE_URL_PATH;
	          }
	        } else if (!stateOverride) {
	          buffer = '';
	          state = NO_SCHEME;
	          pointer = 0;
	          continue;
	        } else return INVALID_SCHEME;
	        break;

	      case NO_SCHEME:
	        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
	        if (base.cannotBeABaseURL && char == '#') {
	          url.scheme = base.scheme;
	          url.path = base.path.slice();
	          url.query = base.query;
	          url.fragment = '';
	          url.cannotBeABaseURL = true;
	          state = FRAGMENT;
	          break;
	        }
	        state = base.scheme == 'file' ? FILE : RELATIVE;
	        continue;

	      case SPECIAL_RELATIVE_OR_AUTHORITY:
	        if (char == '/' && codePoints[pointer + 1] == '/') {
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	          pointer++;
	        } else {
	          state = RELATIVE;
	          continue;
	        } break;

	      case PATH_OR_AUTHORITY:
	        if (char == '/') {
	          state = AUTHORITY;
	          break;
	        } else {
	          state = PATH;
	          continue;
	        }

	      case RELATIVE:
	        url.scheme = base.scheme;
	        if (char == EOF) {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = base.query;
	        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
	          state = RELATIVE_SLASH;
	        } else if (char == '?') {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = '';
	          state = QUERY;
	        } else if (char == '#') {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = base.query;
	          url.fragment = '';
	          state = FRAGMENT;
	        } else {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.path.pop();
	          state = PATH;
	          continue;
	        } break;

	      case RELATIVE_SLASH:
	        if (isSpecial(url) && (char == '/' || char == '\\')) {
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	        } else if (char == '/') {
	          state = AUTHORITY;
	        } else {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          state = PATH;
	          continue;
	        } break;

	      case SPECIAL_AUTHORITY_SLASHES:
	        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
	        pointer++;
	        break;

	      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
	        if (char != '/' && char != '\\') {
	          state = AUTHORITY;
	          continue;
	        } break;

	      case AUTHORITY:
	        if (char == '@') {
	          if (seenAt) buffer = '%40' + buffer;
	          seenAt = true;
	          bufferCodePoints = arrayFrom(buffer);
	          for (var i = 0; i < bufferCodePoints.length; i++) {
	            var codePoint = bufferCodePoints[i];
	            if (codePoint == ':' && !seenPasswordToken) {
	              seenPasswordToken = true;
	              continue;
	            }
	            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
	            if (seenPasswordToken) url.password += encodedCodePoints;
	            else url.username += encodedCodePoints;
	          }
	          buffer = '';
	        } else if (
	          char == EOF || char == '/' || char == '?' || char == '#' ||
	          (char == '\\' && isSpecial(url))
	        ) {
	          if (seenAt && buffer == '') return INVALID_AUTHORITY;
	          pointer -= arrayFrom(buffer).length + 1;
	          buffer = '';
	          state = HOST;
	        } else buffer += char;
	        break;

	      case HOST:
	      case HOSTNAME:
	        if (stateOverride && url.scheme == 'file') {
	          state = FILE_HOST;
	          continue;
	        } else if (char == ':' && !seenBracket) {
	          if (buffer == '') return INVALID_HOST;
	          failure = parseHost(url, buffer);
	          if (failure) return failure;
	          buffer = '';
	          state = PORT;
	          if (stateOverride == HOSTNAME) return;
	        } else if (
	          char == EOF || char == '/' || char == '?' || char == '#' ||
	          (char == '\\' && isSpecial(url))
	        ) {
	          if (isSpecial(url) && buffer == '') return INVALID_HOST;
	          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
	          failure = parseHost(url, buffer);
	          if (failure) return failure;
	          buffer = '';
	          state = PATH_START;
	          if (stateOverride) return;
	          continue;
	        } else {
	          if (char == '[') seenBracket = true;
	          else if (char == ']') seenBracket = false;
	          buffer += char;
	        } break;

	      case PORT:
	        if (DIGIT.test(char)) {
	          buffer += char;
	        } else if (
	          char == EOF || char == '/' || char == '?' || char == '#' ||
	          (char == '\\' && isSpecial(url)) ||
	          stateOverride
	        ) {
	          if (buffer != '') {
	            var port = parseInt(buffer, 10);
	            if (port > 0xFFFF) return INVALID_PORT;
	            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
	            buffer = '';
	          }
	          if (stateOverride) return;
	          state = PATH_START;
	          continue;
	        } else return INVALID_PORT;
	        break;

	      case FILE:
	        url.scheme = 'file';
	        if (char == '/' || char == '\\') state = FILE_SLASH;
	        else if (base && base.scheme == 'file') {
	          if (char == EOF) {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = base.query;
	          } else if (char == '?') {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = '';
	            state = QUERY;
	          } else if (char == '#') {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = base.query;
	            url.fragment = '';
	            state = FRAGMENT;
	          } else {
	            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
	              url.host = base.host;
	              url.path = base.path.slice();
	              shortenURLsPath(url);
	            }
	            state = PATH;
	            continue;
	          }
	        } else {
	          state = PATH;
	          continue;
	        } break;

	      case FILE_SLASH:
	        if (char == '/' || char == '\\') {
	          state = FILE_HOST;
	          break;
	        }
	        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
	          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
	          else url.host = base.host;
	        }
	        state = PATH;
	        continue;

	      case FILE_HOST:
	        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
	          if (!stateOverride && isWindowsDriveLetter(buffer)) {
	            state = PATH;
	          } else if (buffer == '') {
	            url.host = '';
	            if (stateOverride) return;
	            state = PATH_START;
	          } else {
	            failure = parseHost(url, buffer);
	            if (failure) return failure;
	            if (url.host == 'localhost') url.host = '';
	            if (stateOverride) return;
	            buffer = '';
	            state = PATH_START;
	          } continue;
	        } else buffer += char;
	        break;

	      case PATH_START:
	        if (isSpecial(url)) {
	          state = PATH;
	          if (char != '/' && char != '\\') continue;
	        } else if (!stateOverride && char == '?') {
	          url.query = '';
	          state = QUERY;
	        } else if (!stateOverride && char == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (char != EOF) {
	          state = PATH;
	          if (char != '/') continue;
	        } break;

	      case PATH:
	        if (
	          char == EOF || char == '/' ||
	          (char == '\\' && isSpecial(url)) ||
	          (!stateOverride && (char == '?' || char == '#'))
	        ) {
	          if (isDoubleDot(buffer)) {
	            shortenURLsPath(url);
	            if (char != '/' && !(char == '\\' && isSpecial(url))) {
	              url.path.push('');
	            }
	          } else if (isSingleDot(buffer)) {
	            if (char != '/' && !(char == '\\' && isSpecial(url))) {
	              url.path.push('');
	            }
	          } else {
	            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
	              if (url.host) url.host = '';
	              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
	            }
	            url.path.push(buffer);
	          }
	          buffer = '';
	          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
	            while (url.path.length > 1 && url.path[0] === '') {
	              url.path.shift();
	            }
	          }
	          if (char == '?') {
	            url.query = '';
	            state = QUERY;
	          } else if (char == '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          }
	        } else {
	          buffer += percentEncode(char, pathPercentEncodeSet);
	        } break;

	      case CANNOT_BE_A_BASE_URL_PATH:
	        if (char == '?') {
	          url.query = '';
	          state = QUERY;
	        } else if (char == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (char != EOF) {
	          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
	        } break;

	      case QUERY:
	        if (!stateOverride && char == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (char != EOF) {
	          if (char == "'" && isSpecial(url)) url.query += '%27';
	          else if (char == '#') url.query += '%23';
	          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
	        } break;

	      case FRAGMENT:
	        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
	        break;
	    }

	    pointer++;
	  }
	};

	// `URL` constructor
	// https://url.spec.whatwg.org/#url-class
	var URLConstructor = function URL(url /* , base */) {
	  var that = anInstance(this, URLConstructor, 'URL');
	  var base = arguments.length > 1 ? arguments[1] : undefined;
	  var urlString = String(url);
	  var state = setInternalState$7(that, { type: 'URL' });
	  var baseState, failure;
	  if (base !== undefined) {
	    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
	    else {
	      failure = parseURL(baseState = {}, String(base));
	      if (failure) throw TypeError(failure);
	    }
	  }
	  failure = parseURL(state, urlString, null, baseState);
	  if (failure) throw TypeError(failure);
	  var searchParams = state.searchParams = new URLSearchParams$1();
	  var searchParamsState = getInternalSearchParamsState(searchParams);
	  searchParamsState.updateSearchParams(state.query);
	  searchParamsState.updateURL = function () {
	    state.query = String(searchParams) || null;
	  };
	  if (!descriptors) {
	    that.href = serializeURL.call(that);
	    that.origin = getOrigin.call(that);
	    that.protocol = getProtocol.call(that);
	    that.username = getUsername.call(that);
	    that.password = getPassword.call(that);
	    that.host = getHost.call(that);
	    that.hostname = getHostname.call(that);
	    that.port = getPort.call(that);
	    that.pathname = getPathname.call(that);
	    that.search = getSearch.call(that);
	    that.searchParams = getSearchParams.call(that);
	    that.hash = getHash.call(that);
	  }
	};

	var URLPrototype = URLConstructor.prototype;

	var serializeURL = function () {
	  var url = getInternalURLState(this);
	  var scheme = url.scheme;
	  var username = url.username;
	  var password = url.password;
	  var host = url.host;
	  var port = url.port;
	  var path = url.path;
	  var query = url.query;
	  var fragment = url.fragment;
	  var output = scheme + ':';
	  if (host !== null) {
	    output += '//';
	    if (includesCredentials(url)) {
	      output += username + (password ? ':' + password : '') + '@';
	    }
	    output += serializeHost(host);
	    if (port !== null) output += ':' + port;
	  } else if (scheme == 'file') output += '//';
	  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
	  if (query !== null) output += '?' + query;
	  if (fragment !== null) output += '#' + fragment;
	  return output;
	};

	var getOrigin = function () {
	  var url = getInternalURLState(this);
	  var scheme = url.scheme;
	  var port = url.port;
	  if (scheme == 'blob') try {
	    return new URL(scheme.path[0]).origin;
	  } catch (error) {
	    return 'null';
	  }
	  if (scheme == 'file' || !isSpecial(url)) return 'null';
	  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
	};

	var getProtocol = function () {
	  return getInternalURLState(this).scheme + ':';
	};

	var getUsername = function () {
	  return getInternalURLState(this).username;
	};

	var getPassword = function () {
	  return getInternalURLState(this).password;
	};

	var getHost = function () {
	  var url = getInternalURLState(this);
	  var host = url.host;
	  var port = url.port;
	  return host === null ? ''
	    : port === null ? serializeHost(host)
	    : serializeHost(host) + ':' + port;
	};

	var getHostname = function () {
	  var host = getInternalURLState(this).host;
	  return host === null ? '' : serializeHost(host);
	};

	var getPort = function () {
	  var port = getInternalURLState(this).port;
	  return port === null ? '' : String(port);
	};

	var getPathname = function () {
	  var url = getInternalURLState(this);
	  var path = url.path;
	  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
	};

	var getSearch = function () {
	  var query = getInternalURLState(this).query;
	  return query ? '?' + query : '';
	};

	var getSearchParams = function () {
	  return getInternalURLState(this).searchParams;
	};

	var getHash = function () {
	  var fragment = getInternalURLState(this).fragment;
	  return fragment ? '#' + fragment : '';
	};

	var accessorDescriptor = function (getter, setter) {
	  return { get: getter, set: setter, configurable: true, enumerable: true };
	};

	if (descriptors) {
	  objectDefineProperties(URLPrototype, {
	    // `URL.prototype.href` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-href
	    href: accessorDescriptor(serializeURL, function (href) {
	      var url = getInternalURLState(this);
	      var urlString = String(href);
	      var failure = parseURL(url, urlString);
	      if (failure) throw TypeError(failure);
	      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
	    }),
	    // `URL.prototype.origin` getter
	    // https://url.spec.whatwg.org/#dom-url-origin
	    origin: accessorDescriptor(getOrigin),
	    // `URL.prototype.protocol` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-protocol
	    protocol: accessorDescriptor(getProtocol, function (protocol) {
	      var url = getInternalURLState(this);
	      parseURL(url, String(protocol) + ':', SCHEME_START);
	    }),
	    // `URL.prototype.username` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-username
	    username: accessorDescriptor(getUsername, function (username) {
	      var url = getInternalURLState(this);
	      var codePoints = arrayFrom(String(username));
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      url.username = '';
	      for (var i = 0; i < codePoints.length; i++) {
	        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	      }
	    }),
	    // `URL.prototype.password` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-password
	    password: accessorDescriptor(getPassword, function (password) {
	      var url = getInternalURLState(this);
	      var codePoints = arrayFrom(String(password));
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      url.password = '';
	      for (var i = 0; i < codePoints.length; i++) {
	        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	      }
	    }),
	    // `URL.prototype.host` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-host
	    host: accessorDescriptor(getHost, function (host) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      parseURL(url, String(host), HOST);
	    }),
	    // `URL.prototype.hostname` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-hostname
	    hostname: accessorDescriptor(getHostname, function (hostname) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      parseURL(url, String(hostname), HOSTNAME);
	    }),
	    // `URL.prototype.port` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-port
	    port: accessorDescriptor(getPort, function (port) {
	      var url = getInternalURLState(this);
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      port = String(port);
	      if (port == '') url.port = null;
	      else parseURL(url, port, PORT);
	    }),
	    // `URL.prototype.pathname` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-pathname
	    pathname: accessorDescriptor(getPathname, function (pathname) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      url.path = [];
	      parseURL(url, pathname + '', PATH_START);
	    }),
	    // `URL.prototype.search` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-search
	    search: accessorDescriptor(getSearch, function (search) {
	      var url = getInternalURLState(this);
	      search = String(search);
	      if (search == '') {
	        url.query = null;
	      } else {
	        if ('?' == search.charAt(0)) search = search.slice(1);
	        url.query = '';
	        parseURL(url, search, QUERY);
	      }
	      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
	    }),
	    // `URL.prototype.searchParams` getter
	    // https://url.spec.whatwg.org/#dom-url-searchparams
	    searchParams: accessorDescriptor(getSearchParams),
	    // `URL.prototype.hash` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-hash
	    hash: accessorDescriptor(getHash, function (hash) {
	      var url = getInternalURLState(this);
	      hash = String(hash);
	      if (hash == '') {
	        url.fragment = null;
	        return;
	      }
	      if ('#' == hash.charAt(0)) hash = hash.slice(1);
	      url.fragment = '';
	      parseURL(url, hash, FRAGMENT);
	    })
	  });
	}

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	redefine(URLPrototype, 'toJSON', function toJSON() {
	  return serializeURL.call(this);
	}, { enumerable: true });

	// `URL.prototype.toString` method
	// https://url.spec.whatwg.org/#URL-stringification-behavior
	redefine(URLPrototype, 'toString', function toString() {
	  return serializeURL.call(this);
	}, { enumerable: true });

	if (NativeURL) {
	  var nativeCreateObjectURL = NativeURL.createObjectURL;
	  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
	  // `URL.createObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
	  // eslint-disable-next-line no-unused-vars
	  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
	    return nativeCreateObjectURL.apply(NativeURL, arguments);
	  });
	  // `URL.revokeObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
	  // eslint-disable-next-line no-unused-vars
	  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
	    return nativeRevokeObjectURL.apply(NativeURL, arguments);
	  });
	}

	setToStringTag(URLConstructor, 'URL');

	_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
	  URL: URLConstructor
	});

	var TcPlayerModule2_3_2 = createCommonjsModule(function (module, exports) {
	  !function (e, t) {
	     module.exports = t() ;
	  }(commonjsGlobal, function () {
	    return function (e) {
	      function t(o) {
	        if (i[o]) return i[o].exports;
	        var n = i[o] = {
	          exports: {},
	          id: o,
	          loaded: !1
	        };
	        return e[o].call(n.exports, n, n.exports, t), n.loaded = !0, n.exports;
	      }

	      var i = {};
	      return t.m = e, t.c = i, t.p = "//imgcache.qq.com/open/qcloud/video/vcplayer/", t(0);
	    }([function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function r(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function s(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      function a(e, t) {
	        if (d.IS_MOBILE ? (e.flash = !1, d.IS_X5TBS && e.x5_player ? b.mobile = ["flv", "m3u8", "mp4"] : d.IS_ENABLED_MSE && e.h5_flv && (b.mobile = ["flv", "m3u8", "mp4"])) : (e.flash = !!t.isFormat("rtmp") || e.flash, t.isFormat("flv") && void 0 == e.flash && (e.flash = !0), e.flash ? d.IS_ENABLED_FLASH || (e.flash = !1, d.IS_ENABLED_MSE ? e.h5_flv && (d.IS_SAFARI && A.compareVersion(d.SAFARI_VERSION, "10.1") > -1 || !d.IS_SAFARI) ? b.pc = ["flv", "m3u8", "mp4"] : b.pc = ["m3u8", "mp4"] : b.pc = ["mp4"]) : d.IS_ENABLED_MSE ? e.h5_flv && (d.IS_SAFARI && A.compareVersion(d.SAFARI_VERSION, "10.1") > -1 || !d.IS_SAFARI) ? b.pc = ["flv", "m3u8", "mp4"] : b.pc = ["m3u8", "mp4"] : d.IS_ENABLED_FLASH ? e.flash = !0 : b.pc = ["mp4"]), e.clarity) {
	          var i = M.indexOf(e.clarity);
	          M.splice(i, 1), M.unshift(e.clarity);
	        }
	      }

	      function l(e) {
	        var t = {
	          urls: {
	            m3u8: {
	              od: e.m3u8 || "",
	              hd: e.m3u8_hd || "",
	              sd: e.m3u8_sd || ""
	            },
	            flv: {
	              od: e.flv || "",
	              hd: e.flv_hd || "",
	              sd: e.flv_sd || ""
	            },
	            mp4: {
	              od: e.mp4 || "",
	              hd: e.mp4_hd || "",
	              sd: e.mp4_sd || ""
	            },
	            rtmp: {
	              od: e.rtmp || "",
	              hd: e.rtmp_hd || "",
	              sd: e.rtmp_sd || ""
	            }
	          },
	          isClarity: function isClarity(e) {
	            var i = t.urls;
	            return !!(i.m3u8[e] || i.flv[e] || i.mp4[e] || i.rtmp[e]);
	          },
	          isFormat: function isFormat(e) {
	            var i = t.urls;
	            return !!i[e].od || !!i[e].hd || !!i[e].sd;
	          },
	          hasUrl: function hasUrl() {
	            return this.isFormat("rtmp") || this.isFormat("flv") || this.isFormat("m3u8") || this.isFormat("mp4");
	          }
	        };
	        t.definitions = [];

	        for (var i = 0; i < M.length; i++) {
	          t.isClarity(M[i]) && t.definitions.push(M[i]);
	        }

	        a(e, t);
	        var o = p(t);
	        return o && (t.curUrl = o.url, t.curDef = o.definition, t.curFormat = o.format), t;
	      }

	      function c(e, t, i) {
	        var o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : b,
	            n = "",
	            r = void 0;
	        i = i || (d.IS_MOBILE ? o.mobile : o.pc);

	        for (var s = 0; s < i.length; s++) {
	          if (n = i[s], e[n][t]) {
	            r = {
	              definition: t,
	              url: e[n][t],
	              format: n
	            };
	            break;
	          }
	        }

	        return r;
	      }

	      function u(e, t) {
	        for (var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : M, o = "", n = 0; n < i.length; n++) {
	          if (o = i[n], e[t][o]) return {
	            definition: o,
	            url: e[t][o]
	          };
	        }
	      }

	      function p(e) {
	        for (var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : b, i = void 0, o = "", n = e.urls, r = d.IS_MOBILE ? t.mobile : t.pc, s = 0; s < r.length; s++) {
	          if (o = r[s], e.isFormat(o)) {
	            i = u(n, o), i.format = o;
	            break;
	          }
	        }

	        return i;
	      }

	      t.__esModule = !0, t.TcPlayer = void 0;
	      var h = i(1),
	          d = o(h),
	          f = i(2),
	          y = (o(f), i(3)),
	          A = o(y),
	          v = i(4),
	          m = o(v),
	          g = i(5),
	          w = m.MSG,
	          b = {
	        mobile: ["m3u8", "mp4"],
	        pc: ["rtmp", "flv", "m3u8", "mp4"]
	      },
	          M = ["od", "hd", "sd"];

	      t.TcPlayer = function (e) {
	        function t(i, o) {
	          n(this, t);
	          var s = l(o);
	          M = ["od", "hd", "sd"];
	          var a = {
	            owner: i,
	            videoSource: s,
	            src: s.curUrl,
	            autoplay: o.autoplay,
	            live: o.live,
	            flash: o.flash,
	            flashUrl: o.flashUrl,
	            poster: o.poster,
	            width: o.width,
	            height: o.height,
	            volume: o.volume,
	            listener: o.listener,
	            wording: o.wording,
	            controls: o.controls,
	            clarity: o.clarity,
	            clarityLabel: o.clarityLabel,
	            showLoading: "boolean" != typeof o.showLoading || o.showLoading,
	            pausePosterEnabled: void 0 === o.pausePosterEnabled || o.pausePosterEnabled,
	            fullscreenEnabled: void 0 === o.fuScrnEnabled || o.fuScrnEnabled,
	            systemFullscreen: o.systemFullscreen || !1,
	            hls: o.hls || "0.12.4",
	            h5_flv: o.h5_flv,
	            x5_player: o.x5_player !== !1,
	            x5_type: o.x5_type,
	            x5_fullscreen: o.x5_fullscreen,
	            x5_orientation: o.x5_orientation,
	            x5_playsinline: o.x5_playsinline,
	            preload: o.preload || "auto",
	            hlsConfig: o.hlsConfig,
	            flvConfig: o.flvConfig
	          };
	          return r(this, e.call(this, a));
	        }

	        return s(t, e), t.prototype._switchClarity = function (e) {
	          e = e || "od";
	          var t = this.currentTime(),
	              i = this.options.videoSource,
	              o = c(i.urls, e),
	              n = this.playing();
	          this.load(o.url), i.curUrl = o.url, i.curDef = o.definition, i.curFormat = o.format;
	          var r = A.bind(this, function () {
	            parseInt(this.duration() - t) > 0 && !this.options.live && this.currentTime(t), n && this.play(!0), m.unsub(w.MetaLoaded, "*", r, this);
	          });
	          m.sub(w.MetaLoaded, "*", r, this);
	        }, t.prototype.switchClarity = function (e) {
	          this.claritySwitcher ? this.claritySwitcher.setClarity(e) : this._switchClarity(e);
	        }, t.prototype.handleMsg = function (t) {
	          e.prototype.handleMsg.call(this, t);
	        }, t;
	      }(g.Player);
	    }, function (e, t) {

	      t.__esModule = !0;

	      var i = window.navigator.userAgent,
	          o = /AppleWebKit\/([\d.]+)/i.exec(i),
	          n = o ? parseFloat(o.pop()) : null,
	          r = t.IS_IPAD = /iPad/i.test(i),
	          s = t.IS_IPHONE = /iPhone/i.test(i) && !r,
	          a = t.IS_IPOD = /iPod/i.test(i),
	          l = t.IS_IOS = s || r || a,
	          c = (t.IOS_VERSION = function () {
	        var e = i.match(/OS (\d+)_/i);
	        if (e && e[1]) return e[1];
	      }(), t.IS_MAC = /Mac/i.test(i), t.IS_ANDROID = /Android/i.test(i)),
	          u = t.ANDROID_VERSION = function () {
	        var e,
	            t,
	            o = i.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);
	        return o ? (e = o[1] && parseFloat(o[1]), t = o[2] && parseFloat(o[2]), e && t ? parseFloat(o[1] + "." + o[2]) : e ? e : null) : null;
	      }(),
	          p = (t.IS_OLD_ANDROID = c && /webkit/i.test(i) && u < 2.3, t.IS_NATIVE_ANDROID = c && u < 5 && n < 537, t.IS_FIREFOX = /Firefox/i.test(i), t.IS_EDGE = /Edge/i.test(i)),
	          h = t.IS_CHROME = !p && /Chrome/i.test(i),
	          d = t.IS_SAFARI = !p && !h && /Safari/i.test(i),
	          f = (t.SAFARI_VERSION = function () {
	        if (!d) return null;
	        var e = /version\/([\d.]+)/i,
	            t = i.match(e);
	        return t ? t[1] : void 0;
	      }(), t.IS_IE8 = /MSIE\s8\.0/.test(i), t.IS_IE9 = /MSIE\s9\.0/.test(i), t.IS_IE = /(msie\s|trident.*rv:)([\w.]+)/i.test(i)),
	          y = (t.IE_VERSION = function () {
	        var e = /(msie\s|trident.*rv:)([\w.]+)/i,
	            t = i.match(e);
	        return t ? t[2] : null;
	      }(), t.TOUCH_ENABLED = !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch), t.BACKGROUND_SIZE_SUPPORTED = "backgroundSize" in document.createElement("video").style, t.HASVIDEO = !!document.createElement("video").canPlayType, t.IS_X5TBS = /TBS\/\d+/i.test(i)),
	          A = (t.TBS_VERSION = function () {
	        var e = i.match(/TBS\/(\d+)/i);
	        if (e && e[1]) return e[1];
	      }(), t.IS_MQQB = !y && /MQQBrowser\/\d+/i.test(i), t.IS_QQB = !y && / QQBrowser\/\d+/i.test(i), t.IS_WECHAT = /(micromessenger|webbrowser)/i.test(i), t.IS_MQQ = / QQ\/\d+/i.test(i), t.IS_MOBILE = c || l, t.IS_FILE_PROTOCOL = /file:/.test(location.protocol), t.FLASH_VERSION = null);

	      t.IS_ENABLED_FLASH = function () {
	        var e;
	        if (document.all || f) try {
	          if (e = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) return t.FLASH_VERSION = A = e.GetVariable("$version").split(" ")[1].replace(/,/g, "."), window.console && console.log("FLASH_VERSION", A), !0;
	        } catch (i) {
	          return !1;
	        } else try {
	          if (navigator.plugins && navigator.plugins.length > 0 && (e = navigator.plugins["Shockwave Flash"])) {
	            for (var o = e.description.split(" "), n = 0; n < o.length; ++n) {
	              isNaN(parseInt(o[n])) || (t.FLASH_VERSION = A = o[n], window.console && console.log("FLASH_VERSION", parseInt(o[n])));
	            }

	            return !0;
	          }
	        } catch (i) {
	          return !1;
	        }
	        return !1;
	      }(), t.IS_ENABLED_MSE = function () {
	        var e = window.MediaSource = window.MediaSource || window.WebKitMediaSource,
	            t = window.SourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer,
	            i = e && "function" == typeof e.isTypeSupported && e.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'),
	            o = !t || t.prototype && "function" == typeof t.prototype.appendBuffer && "function" == typeof t.prototype.remove;
	        if (!l) return i && o;
	      }(), t.BROWSER_TYPE = function () {
	        return i.indexOf("Edge") > -1 ? "Edge" : i.indexOf(".NET") > -1 ? "IE" : i.indexOf("QQBrowser") > -1 ? "QQBrowser" : i.indexOf("Mac OS") > -1 ? "safari" : i.indexOf("Chrome") > -1 ? "chrome" : "other";
	      }();
	    }, function (e, t) {

	      function i(e, t, i) {
	        return e ? (e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent && e.attachEvent("on" + t, i), i) : console.warn("element not exists");
	      }

	      function o(e, t, i) {
	        return e ? void (e.removeEventListener ? e.removeEventListener(t, i, !1) : e.detachEvent && e.detachEvent("on" + t, i)) : console.warn("element not exists");
	      }

	      function n() {
	        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "div",
	            t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
	            i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
	            o = document.createElement(e);

	        for (var n in t) {
	          if (t.hasOwnProperty(n)) {
	            var r = t[n];
	            null === r ? o.removeAttribute(r) : o.setAttribute(n, r);
	          }
	        }

	        for (var s in i) {
	          i.hasOwnProperty(s) && (o[s] = i[s]);
	        }

	        return o;
	      }

	      function r(e) {
	        return document.getElementById(e);
	      }

	      function s(e, t) {
	        e.classList ? e.classList.add(t) : c(e, t) || (e.className = e.className + " " + t);
	      }

	      function a(e, t) {
	        e.classList ? e.classList.remove(t) : e.className = e.className.replace(u(t), " ");
	      }

	      function l(e, t, i) {
	        i ? s(e, t) : a(e, t);
	      }

	      function c(e, t) {
	        return e.classList ? e.classList.contains(t) : u(t).test(e.className);
	      }

	      function u(e) {
	        return new RegExp("(^|\\s)" + e + "($|\\s)");
	      }

	      function p(e) {
	        var t = void 0;
	        if (e.getBoundingClientRect && e.parentNode && (t = e.getBoundingClientRect()), !t) return {
	          left: 0,
	          top: 0
	        };
	        var i = document.documentElement,
	            o = document.body,
	            n = i.clientLeft || o.clientLeft || 0,
	            r = window.pageXOffset || o.scrollLeft,
	            s = t.left + r - n,
	            a = i.clientTop || o.clientTop || 0,
	            l = window.pageYOffset || o.scrollTop,
	            c = t.top + l - a;
	        return {
	          left: Math.round(s),
	          top: Math.round(c)
	        };
	      }

	      function h(e, t, i) {
	        var o = {},
	            n = i || p(e),
	            r = e.offsetWidth,
	            s = e.offsetHeight,
	            a = n.top,
	            l = n.left,
	            c = t.pageY || t.clientY,
	            u = t.pageX || t.clientX;
	        return t.changedTouches && (u = t.changedTouches[0].pageX, c = t.changedTouches[0].pageY), o.y = Math.max(0, Math.min(1, (a - c + s) / s)), o.x = Math.max(0, Math.min(1, (u - l) / r)), o;
	      }

	      function d(e, t, i) {
	        var o = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
	            n = document.createElement("script");
	        if (n.onload = n.onreadystatechange = function () {
	          this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || ("function" == typeof t && t(), n.onload = n.onreadystatechange = null, n.parentNode && !o && n.parentNode.removeChild(n));
	        }, i) for (var r in i) {
	          if (i.hasOwnProperty(r)) {
	            var s = i[r];
	            null === s ? n.removeAttribute(s) : n.setAttribute(r, s);
	          }
	        }
	        n.src = e, document.getElementsByTagName("head")[0].appendChild(n);
	      }

	      function f() {
	        var e = document,
	            t = e.documentElement,
	            i = e.body;
	        return {
	          width: t && t.clientWidth || i && i.offsetWidth || window.innerWidth || 0,
	          height: t && t.clientHeight || i && i.offsetHeight || window.innerHeight || 0
	        };
	      }

	      t.__esModule = !0, t.on = i, t.off = o, t.createEl = n, t.get = r, t.addClass = s, t.removeClass = a, t.toggleClass = l, t.hasClass = c, t.findElPosition = p, t.getPointerPosition = h, t.loadScript = d, t.getViewportSize = f;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n() {
	        return I++;
	      }

	      function r(e, t, i) {
	        t.guid || (t.guid = n());

	        var o = function o() {
	          t.apply(e, arguments);
	        };

	        return o.guid = i ? i + "_" + t.guid : t.guid, o;
	      }

	      function s(e) {
	        if (e instanceof Array) return 0 === e.length;

	        for (var t in e) {
	          if (e.hasOwnProperty(t)) return !1;
	        }

	        return !0;
	      }

	      function a(e) {
	        e = 0 | e;
	        var t = 3600,
	            i = 60,
	            o = e / t | 0,
	            n = (e - o * t) / i | 0,
	            r = e - o * t - n * i;
	        return o = o > 0 ? o + ":" : "", n = n > 0 ? n + ":" : "00:", r = r > 0 ? r + "" : o.length > 0 || n.length > 0 ? "00" : "00:00", o = 2 == o.length ? "0" + o : o, n = 2 == n.length ? "0" + n : n, r = 1 == r.length ? "0" + r : r, o + n + r;
	      }

	      function l(e) {
	        p.__isFullscreen = !!document[S.fullscreenElement], p.__isFullscreen || g.off(document, S.fullscreenchange, l), b.pub({
	          type: w.MSG.FullScreen,
	          src: "util",
	          ts: e.timeStamp,
	          detail: {
	            isFullscreen: p.__isFullscreen
	          }
	        }, p.player);
	      }

	      function c(e, t) {
	        g.off(t.video.el, "webkitbeginfullscreen", c), "webkitbeginfullscreen" == e.type ? (g.on(t.video.el, "webkitendfullscreen", function (e) {
	          c(e, t);
	        }), b.pub({
	          type: w.MSG.FullScreen,
	          src: "util",
	          ts: e.timeStamp,
	          detail: {
	            isFullscreen: !0
	          }
	        }, p.player)) : "webkitendfullscreen" == e.type && (g.off(t.video.el, "webkitendfullscreen", c), b.pub({
	          type: w.MSG.FullScreen,
	          src: "util",
	          ts: e.timeStamp,
	          detail: {
	            isFullscreen: !1
	          }
	        }, p.player));
	      }

	      function u(e) {
	        27 === e.keyCode && p(p.player, !1);
	      }

	      function p(e, t, i) {
	        if ("undefined" == typeof t) return p.__isFullscreen || !1;
	        var o = e.options.systemFullscreen;
	        p.player = e, S.requestFullscreen ? t ? (g.on(document, S.fullscreenchange, l), i && i[S.requestFullscreen]()) : document[S.exitFullscreen]() : o && e.video.el.webkitEnterFullScreen ? (g.on(e.video.el, "webkitbeginfullscreen", function (t) {
	          c(t, e);
	        }), t ? e.video.el.webkitEnterFullScreen() : e.video.el.webkitExitFullscreen()) : (p.__isFullscreen = t, p.__isFullscreen ? (p.__origOverflow = document.documentElement.style.overflow, document.documentElement.style.overflow = "hidden", g.on(document, "keydown", u)) : (document.documentElement.style.overflow = p.__origOverflow, g.off(document, "keydown", u)), g.toggleClass(document.body, "vcp-full-window", t), b.pub({
	          type: w.MSG.FullScreen,
	          src: "util",
	          detail: {
	            isFullscreen: p.__isFullscreen
	          }
	        }, p.player));
	      }

	      function h(e) {
	        for (var t = arguments.length, i = Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++) {
	          i[o - 1] = arguments[o];
	        }

	        for (var n = 0; n < i.length; n++) {
	          var r = i[n];

	          for (var s in r) {
	            r.hasOwnProperty(s) && (e[s] = e[s] || r[s]);
	          }
	        }

	        return e;
	      }

	      function d(e, t) {
	        return "undefined" == typeof t ? JSON.parse(localStorage[e] || "null") : void (localStorage[e] = JSON.stringify(t));
	      }

	      function f(e, t) {
	        if (e = e || "0.0.0", t = t || "0.0.0", e == t) return 0;

	        for (var i = e.split("."), o = t.split("."), n = Math.max(i.length, o.length), r = 0; r < n; r++) {
	          var s = ~~o[r],
	              a = ~~i[r];
	          if (s < a) return 1;
	          if (s > a) return -1;
	        }

	        return -1;
	      }

	      function y(e) {
	        return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\//g, "&#x2F;");
	      }

	      function A(e) {
	        var t = "unknown";
	        return e.isFormat("rtmp") ? t = "rtmp" : e.isFormat("flv") ? t = "flv" : e.isFormat("m3u8") ? t = "m3u8" : e.isFormat("mp4") && (t = "mp4"), t;
	      }

	      function v(e, t) {
	        e = e.replace(/^(http|https):/, "");
	        var i = window.location.protocol;
	        return "http:" != i && "https:" != i && (i = t || "https:"), e = i + e;
	      }

	      t.__esModule = !0, t.supportStyle = t.console = t.VideoType = t.CDNPath = t.FullscreenApi = void 0, t.guid = n, t.bind = r, t.isEmpty = s, t.convertTime = a, t.doFullscreen = p, t.extend = h, t.store = d, t.compareVersion = f, t.escapeHTML = y, t.getFormat = A, t.unifyProtocol = v;

	      for (var m = i(2), g = o(m), w = i(4), b = o(w), M = i(1), I = (o(M), 1), S = t.FullscreenApi = {
	        requestFullscreen: null,
	        exitFullscreen: null,
	        fullscreenElement: null,
	        fullscreenEnabled: null,
	        fullscreenchange: null,
	        fullscreenerror: null
	      }, E = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]], _ = E[0], T = void 0, D = 0; D < E.length; D++) {
	        if (E[D][1] in document) {
	          T = E[D];
	          break;
	        }
	      }

	      if (T) for (var L = 0; L < T.length; L++) {
	        S[_[L]] = T[L];
	      }
	      t.CDNPath = "https://imgcache.qq.com/open/qcloud/video/vcplayer/", t.VideoType = {
	        RTMP: "rtmp",
	        FLV: "flv",
	        M3U8: "m3u8"
	      }, t.console = {
	        log: function log() {
	          window.console && window.console.log.apply(window.console, arguments);
	        },
	        warn: function warn() {
	          window.console && window.console.warn.apply(window.console, arguments);
	        },
	        error: function error() {
	          window.console && window.console.error.apply(window.console, arguments);
	        }
	      }, t.supportStyle = function () {
	        var e = document.createElement("div"),
	            t = "Khtml O Moz Webkit".split(" "),
	            i = t.length;
	        return function (o) {
	          if (o in e.style) return !0;
	          if ("-ms-" + o in e.style) return !0;

	          for (o = o.replace(/^[a-z]/, function (e) {
	            return e.toUpperCase();
	          }); i--;) {
	            if (t[i] + o in e.style) return !0;
	          }

	          return !1;
	        };
	      }();
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        var t = e.guid;
	        return t ? (h[t] = h[t] || {}, h[t]) : (console.error(e, " has no guid."), {});
	      }

	      function r(e) {
	        var t = e.guid;
	        return t ? (d[t] = d[t] || {}, d[t]) : (console.error(e, " has no guid."), {});
	      }

	      function s(e, t) {
	        a(e.type, e, t), a("*", e, t);
	      }

	      function a(e, t, i) {
	        try {
	          var o = n(i),
	              s = r(i);
	          if (!o[e]) return;
	          var a = o[e];

	          for (var l in a) {
	            if (a.hasOwnProperty(l)) {
	              var c = a[l],
	                  u = s[l];
	              if ("function" != typeof u) return !1;

	              for (var p = 0; p < c.length; p++) {
	                var h = c[p];
	                "*" !== h && h !== t.src || u(t);
	              }
	            }
	          }
	        } catch (d) {
	          window.console && console.error && console.error(d.stack || d);
	        }
	      }

	      function l(e, t, i, o) {
	        var s = n(o),
	            a = r(o);
	        return i.guid ? (a[i.guid] = i, s[e] = s[e] || {}, s[e][i.guid] = s[e][i.guid] || [], s[e][i.guid].push(t), i) : console.error("callback function need guid");
	      }

	      function c(e, t, i, o) {
	        var s = n(o),
	            a = r(o);
	        if (("*" == e || s[e]) && ("*" == e || s[e][i.guid])) for (var l in s) {
	          if (("*" === e || l == e) && s.hasOwnProperty(l)) if ("*" !== i) {
	            var c = s[l][i.guid];
	            "*" === t && (c = []);

	            for (var u = 0; u < c.length;) {
	              c[u] === t ? c.splice(u, 1) : u++;
	            }

	            0 == c.length && delete s[l][i.guid], p.isEmpty(s[l]) && delete s[l];
	          } else {
	            for (var h in s[l]) {
	              delete a[h];
	            }

	            delete s[l];
	          }
	        }
	      }

	      t.__esModule = !0, t.MSG = void 0, t.pub = s, t.sub = l, t.unsub = c;
	      var u = i(3),
	          p = o(u),
	          h = (t.MSG = {
	        Error: "error",
	        TimeUpdate: "timeupdate",
	        Load: "load",
	        MetaLoaded: "loadedmetadata",
	        Loaded: "loadeddata",
	        Progress: "progress",
	        FullScreen: "fullscreen",
	        Play: "play",
	        Playing: "playing",
	        Pause: "pause",
	        Ended: "ended",
	        Seeking: "seeking",
	        Seeked: "seeked",
	        Resize: "resize",
	        VolumeChange: "volumechange"
	      }, {}),
	          d = {};
	    }, function (e, t, i) {

	      function o(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function n(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      t.__esModule = !0, t.Player = t.dom = t.util = t.browser = t.MSG = void 0, i(6);

	      var s = i(1),
	          a = n(s),
	          l = i(2),
	          c = n(l),
	          u = i(3),
	          p = n(u),
	          h = i(4),
	          d = n(h),
	          f = i(23),
	          y = o(f),
	          A = i(26),
	          v = o(A),
	          m = i(27),
	          g = o(m),
	          w = i(35),
	          b = o(w),
	          M = i(36),
	          I = o(M),
	          S = i(37),
	          E = o(S),
	          _ = i(38),
	          T = o(_),
	          D = i(39),
	          L = o(D);

	      window.console || (window.console = {
	        log: function log() {},
	        error: function error() {},
	        debug: function debug() {},
	        info: function info() {}
	      });
	      var O = t.MSG = d.MSG,
	          C = t.browser = a,
	          x = t.util = p,
	          P = t.dom = c;

	      t.Player = function () {
	        function e(t) {
	          r(this, e), this.options = t, this.ready = !1, this.hasPlay = !1;
	          var i = t.owner;
	          return i ? (this.guid = x.guid(), this.listener = this.options.listener, d.sub("*", "*", x.bind(this, this.handleMsg), this), i = P.get(i), this.mtaReport = new L["default"](this, this.options), void this.render(i)) : console.error("Player need a container");
	        }

	        return e.prototype.render = function (e) {
	          var t = "vcp-player";
	          if (C.TOUCH_ENABLED && (t += " touchable"), this.el = P.createEl("div", {
	            "class": t
	          }), e.appendChild(this.el), this.errortips = new T["default"](this), this.errortips.render(this.el), this.loading = new E["default"](this), this.loading.render(this.el), this.options.width = this.options.width || e.offsetWidth, this.options.height = this.options.height || e.offsetHeight, this.size(this.options.width, this.options.height), !this.verifyOptions()) return this.listener({
	            type: "error",
	            code: 5
	          }), x.console.error("create failed");

	          if (!this.options.flash && C.HASVIDEO) {
	            var i = new y["default"](this);
	            i.render(this.el), this.video = i;
	          } else {
	            var o = new v["default"](this);
	            o.render(this.el), this.video = o;
	          }

	          if (!this.video) return x.console.error("create video failed");
	          this.poster = new I["default"](this), this.poster.render(this.el), (C.IS_SAFARI && parseInt(C.SAFARI_VERSION) > 10 || C.IOS_VERSION > 10) && "system" == this.options.controls || (this.bigplay = new b["default"](this), this.bigplay.render(this.el));
	          var n = void 0;
	          n = !(this.options.controls && "default" != this.options.controls && (!this.options.flash || "system" != this.options.controls)), n && (this.panel = new g["default"](this), this.panel.render(this.el)), this.setup();
	        }, e.prototype.verifyOptions = function () {
	          return C.IE_VERSION && x.compareVersion(C.IE_VERSION, "8.0") == -1 ? (this.errortips.show({
	            code: 5
	          }), !1) : !!this.options.src || (this.options.videoSource.hasUrl() ? C.IS_IE || !C.IS_ENABLED_FLASH ? this.errortips.show({
	            code: 5
	          }) : this.errortips.show({
	            code: 5
	          }) : this.errortips.show({
	            code: 12
	          }), !1);
	        }, e.prototype.size = function (e, t, i) {
	          i = i || "cover";
	          var o = /^\d+\.?\d{0,2}%$/,
	              n = void 0,
	              r = void 0;
	          if (o.test(e) || o.test(t)) n = e, r = t;else {
	            var s = this.video ? this.video.videoWidth() : this.options.width,
	                a = this.video ? this.video.videoHeight() : this.options.height;

	            if (n = e, r = t, s && a) {
	              var l = s / a;
	              "fit" == i && (n = e, r = n / l, r > t && (n *= t / r, r = t));
	            }

	            var c = P.getViewportSize();
	            c.width > 0 && n > c.width && (n = c.width);
	          }
	          n += o.test(n) ? "" : "px", r += o.test(r) ? "" : "px", this.el.style.width = n, this.el.style.height = r, this.video && (this.video.width(n), this.video.height(r)), this.width = n, this.height = r;
	        }, e.prototype.setup = function () {
	          if (this.__handleEvent = x.bind(this, this.handleEvent), C.IS_MOBILE) {
	            if (this.options.autoplay) {
	              var e = this;
	              document.addEventListener("WeixinJSBridgeReady", function () {
	                e.play();
	              });
	            }
	          } else this.loading.show();
	        }, e.prototype.destroy = function () {
	          this.video && this.video.destroy(), this.panel && this.panel.destroy(), this.bigplay && this.bigplay.destroy(), this.loading && this.loading.destroy(), d.unsub("*", "*", this.handleMsg, this), this.video = this.panel = this.bigplay = this.loading = null, this.el.parentNode.removeChild(this.el);
	        }, e.prototype.setListener = function (e) {
	          this.listener = e;
	        }, e.prototype.handleEvent = function (e) {
	          switch (e.type) {
	            case "mousemove":
	              if (this.__lastmove && new Date() - this.__lastmove < 100) break;
	              var t = this;

	              if (this.__movecnt = this.__movecnt || 0, this.__movecnt++, this.__movecnt < 5) {
	                setTimeout(function () {
	                  t.__movecnt = 0;
	                }, 500);
	                break;
	              }

	              this.__movecnt = 0, this.__lastmove = +new Date(), clearTimeout(this.__moveid), t.panel && t.panel.show(), this.__moveid = setTimeout(function () {
	                t.playing() && t.panel && t.panel.hide();
	              }, 3e3);
	          }
	        }, e.prototype.handleMsg = function (e) {
	          switch (e.type) {
	            case O.Load:
	              P.removeClass(this.el, "vcp-playing"), ("none" === this.options.preload || this.options.hlsConfig && this.options.hlsConfig.autoStartLoad === !1) && this.loading.hide();
	              break;

	            case O.Play:
	              if (!this.playing()) break;
	              !this.hasPlay && this.options.flash && (this.mtaReport.reportFlash(), this.hasPlay = !0), P.addClass(this.el, "vcp-playing"), this.video.type() == x.VideoType.RTMP && (this.__wait = !0, this.loading.show()), P.on(this.el, "mousemove", this.__handleEvent);
	              break;

	            case O.Playing:
	              this.loading.hide();
	              break;

	            case O.TimeUpdate:
	              this.__wait && (this.__wait = !1, this.loading.hide());
	              break;

	            case O.Pause:
	              P.off(this.el, "mousemove", this.__handleEvent), P.removeClass(this.el, "vcp-playing");
	              break;

	            case O.Ended:
	              P.off(this.el, "mousemove", this.__handleEvent), this.panel && this.panel.show(), P.removeClass(this.el, "vcp-playing");
	              break;

	            case O.MetaLoaded:
	              this.loading.hide(), this.mtaReport.report(), this.size(this.options.width, this.options.height);
	              break;

	            case O.Seeking:
	              this.loading.show();
	              break;

	            case O.Seeked:
	              this.loading.hide();
	              break;

	            case O.FullScreen:
	              var t = this;
	              setTimeout(function () {
	                P.toggleClass(t.el, "vcp-fullscreen", e.detail.isFullscreen);
	              }, 0);
	              break;

	            case O.Error:
	              this.loading.hide(), this.errortips.show(e.detail), this.panel && this.panel.show();

	              try {
	                var i = this.options.videoSource,
	                    o = x.getFormat(i);
	                C.IS_X5TBS ? MtaH5.clickStat("x5_err", {
	                  format: o
	                }) : MtaH5.clickStat("error", {
	                  format: o
	                });
	              } catch (n) {}

	          }

	          !e["private"] && this.listener && this.listener(e);
	        }, e.prototype.currentTime = function (e) {
	          return this.video.currentTime(e);
	        }, e.prototype.duration = function () {
	          return this.video.duration();
	        }, e.prototype.percent = function (e) {
	          return this.video.duration() ? "undefined" == typeof e ? this.video.currentTime() / this.video.duration() : void this.video.currentTime(this.video.duration() * e) : 0;
	        }, e.prototype.buffered = function () {
	          return this.video.duration() ? this.video.buffered() / this.video.duration() : 0;
	        }, e.prototype.pause = function () {
	          this.video.pause();
	        }, e.prototype.play = function () {
	          var e;
	          this.errortips.clear(), (e = this.video).play.apply(e, arguments);
	        }, e.prototype.togglePlay = function () {
	          this.errortips.clear(), this.video.togglePlay();
	        }, e.prototype.stop = function () {
	          this.video.stop();
	        }, e.prototype.mute = function (e) {
	          return this.video.mute(e);
	        }, e.prototype.volume = function (e) {
	          return this.video.volume(e);
	        }, e.prototype.fullscreen = function (e) {
	          return this.video.fullscreen(e);
	        }, e.prototype.load = function (e, t) {
	          this.errortips.clear(), this.loading.show(), this.video.load(e || this.options.src, t);
	        }, e.prototype.playing = function () {
	          return this.video && this.video.playing();
	        }, e.prototype.paused = function () {
	          return this.video && this.video.paused();
	        }, e;
	      }();
	    }, function (e, t, i) {
	      var o = i(7);
	      "string" == typeof o && (o = [[e.id, o, ""]]);
	      i(22)(o, {});
	      o.locals && (e.exports = o.locals);
	    }, function (e, t, i) {
	      t = e.exports = i(8)(), t.push([e.id, ".vcp-player{position:relative;z-index:0;font-family:Tahoma,\\\\5FAE\\8F6F\\96C5\\9ED1,\\u5b8b\\u4f53,Verdana,Arial,sans-serif;background-color:#000}.vcp-player video{display:block;overflow:hidden}.vcp-fullscreen.vcp-player,.vcp-fullscreen video,body.vcp-full-window{width:100%!important;height:100%!important}body.vcp-full-window{overflow-y:auto}.vcp-full-window .vcp-player{position:fixed;left:0;top:0;z-index:2147483647}.vcp-pre-flash,.vcp-video{width:100%;height:100%}.vcp-pre-flash{z-index:999;background:#000;position:absolute;top:0;left:0}.vcp-controls-panel{position:absolute;bottom:0;width:100%;font-size:16px;height:3em;z-index:1000}.vcp-controls-panel.show{-webkit-animation:fadeIn ease .8s;animation:fadeIn ease .8s;animation-fill-mode:forwards;-webkit-animation-fill-mode:forwards}.vcp-controls-panel.hide{-webkit-animation:fadeOut ease .8s;animation:fadeOut ease .8s;animation-fill-mode:forwards;-webkit-animation-fill-mode:forwards}.vcp-panel-bg{width:100%;height:100%;position:absolute;left:0;top:0;background-color:#242424;opacity:.8;filter:alpha(opacity=80);z-index:1000}.vcp-playtoggle{cursor:pointer;position:relative;z-index:1001;width:3em;height:100%;float:left;background-image:url(" + i(9) + ");background-image:url(" + i(10) + ")\\0}.vcp-playtoggle:focus,.vcp-playtoggle:hover{background-color:#708090;opacity:.9;filter:alpha(opacity=90)}.touchable .vcp-playtoggle:hover{background-color:transparent;opacity:1}.vcp-playing .vcp-playtoggle{background-image:url(" + i(11) + ");background-image:url(" + i(12) + ")\\0}.vcp-bigplay{width:100%;height:80%;position:absolute;background-color:white\\0;filter:alpha(opacity=0);opacity:0;z-index:1000;top:0;left:0}.vcp-slider{position:relative;z-index:1001;float:left;background:#c4c4c4;height:10px;opacity:.8;filter:alpha(opacity=80);cursor:pointer}.vcp-slider .vcp-slider-track{width:0;height:100%;margin-top:0;opacity:1;filter:alpha(opacity=100);background-color:#1e90ff}.vcp-slider .vcp-slider-thumb{cursor:pointer;background-color:#fff;position:absolute;top:0;left:0;border-radius:1em!important;height:10px;margin-left:-5px;width:10px}.vcp-slider-vertical{position:relative;width:.5em;height:8em;top:-5.6em;z-index:1001;background-color:#1c1c1c;opacity:.9;filter:alpha(opacity=90);cursor:pointer}.vcp-slider-vertical .vcp-slider-track{background-color:#1275cf;width:.5em;height:100%;opacity:.8;filter:alpha(opacity=80)}.vcp-slider-vertical .vcp-slider-thumb{cursor:pointer;position:absolute;background-color:#f0f8ff;width:.8em;height:.8em;border-radius:.8em!important;margin-top:-.4em;top:0;left:-.15em}.vcp-timeline{top:-10px;left:0;height:10px;position:absolute;z-index:1001;width:100%}.vcp-timeline .vcp-slider-thumb{top:-4px}.vcp-timeline .vcp-slider{margin-top:8px;height:2px;width:100%}.vcp-timeline:hover .vcp-slider{margin-top:0;height:10px}.vcp-timeline:hover .vcp-slider-thumb{display:block;width:16px;height:16px;top:-3px;margin-left:-8px}.vcp-timelabel{display:inline-block;line-height:3em;float:left;color:#fff;padding:0 9px}.vcp-timelabel,.vcp-volume{height:3em;z-index:1001;position:relative}.vcp-volume{width:3em;cursor:pointer;float:right;background-color:transparent;opacity:.9;filter:alpha(opacity=90)}.vcp-volume-icon{background-image:url(" + i(13) + ");background-image:url(" + i(14) + ")\\0;display:inline-block;width:3em;height:3em;position:absolute;left:0;top:0}.vcp-volume-muted .vcp-volume-icon{background-image:url(" + i(15) + ");background-image:url(" + i(16) + ")\\0}.vcp-volume .vcp-slider-vertical{top:-8.4em;left:1em;display:none}.vcp-volume .vcp-slider-track{position:absolute;bottom:0}.vcp-volume:hover .vcp-slider-vertical{display:block}.vcp-volume .vcp-volume-bg{height:8.8em;width:2em;position:absolute;left:.25em;top:-8.8em;background:#242424;display:none}.vcp-volume:hover .vcp-slider-vertical,.vcp-volume:hover .vcp-volume-bg{display:block}.vcp-fullscreen-toggle{position:relative;width:3em;height:3em;float:right;cursor:pointer;z-index:1001;background-image:url(" + i(17) + ");background-image:url(" + i(18) + ")\\0}.vcp-fullscreen .vcp-fullscreen-toggle{background-image:url(" + i(19) + ");background-image:url(" + i(20) + ')\\0}.vcp-loading{box-sizing:border-box;background-clip:padding-box;width:50px;height:50px;display:none;position:absolute;top:50%;left:50%;margin:-25px 0 0 -25px;text-indent:-9999em}.vcp-loading:before{box-sizing:inherit;content:"";display:block;width:100%;height:100%;border-radius:50%;border:3px solid hsla(0,0%,100%,0);border-left-color:#fff;border-right-color:#fff;-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-animation:load8 1.1s infinite linear;animation:load8 1.1s infinite linear}@-webkit-keyframes load8{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes load8{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.vcp-poster{position:absolute;left:0;top:0;overflow:hidden;z-index:1000;width:100%;height:100%;display:none}.vcp-poster-pic{position:relative}.vcp-poster-pic.cover,.vcp-poster-pic.default{left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vcp-poster-pic.cover{width:100%}.vcp-poster-pic.stretch{width:100%;height:100%}.vcp-error-tips{position:absolute;z-index:1001;width:100%;height:4.5em;left:0;top:50%;color:#ff4500;margin-top:-5.25em;text-align:center;display:none}.vcp-clarityswitcher{height:3em;width:3em;cursor:pointer;position:relative;z-index:1001;float:right;background-color:transparent;opacity:.9}.vcp-vertical-switcher-container{width:3em;position:absolute;left:0;bottom:2.4em;background:#242424;display:none}.vcp-vertical-switcher-current{display:block;color:#fff;text-align:center;line-height:3em}.vcp-vertical-switcher-item{display:block;color:#fff;text-align:center;line-height:2em}.vcp-vertical-switcher-item.current{color:#888}.vcp-share>a{width:3em;height:3em;cursor:pointer;background-image:url(' + i(21) + ");opacity:.9;display:block}.vcp-share{width:3em;height:3em;position:relative;float:right;z-index:1001}.vcp-vertical-share-container{width:auto;height:auto;position:absolute;background:rgba(36,36,36,.8);padding:.5em;overflow:hidden;display:none}@-webkit-keyframes fadeOut{0%{opacity:1}to{opacity:0}}@keyframes fadeOut{0%{opacity:1}to{opacity:0}}.fadeOut{-webkit-animation:fadeOut ease .8s;animation:fadeOut ease .8s;animation-fill-mode:forwards;-webkit-animation-fill-mode:forwards}@-webkit-keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.fadeIn{-webkit-animation:fadeIn ease .8s;animation:fadeIn ease .8s;animation-fill-mode:forwards;-webkit-animation-fill-mode:forwards}", ""]);
	    }, function (e, t) {
	      e.exports = function () {
	        var e = [];
	        return e.toString = function () {
	          for (var e = [], t = 0; t < this.length; t++) {
	            var i = this[t];
	            i[2] ? e.push("@media " + i[2] + "{" + i[1] + "}") : e.push(i[1]);
	          }

	          return e.join("");
	        }, e.i = function (t, i) {
	          "string" == typeof t && (t = [[null, t, ""]]);

	          for (var o = {}, n = 0; n < this.length; n++) {
	            var r = this[n][0];
	            "number" == typeof r && (o[r] = !0);
	          }

	          for (n = 0; n < t.length; n++) {
	            var s = t[n];
	            "number" == typeof s[0] && o[s[0]] || (i && !s[2] ? s[2] = i : i && (s[2] = "(" + s[2] + ") and (" + i + ")"), e.push(s));
	          }
	        }, e;
	      };
	    }, function (e, t) {
	      e.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogICAgPHBhdGggZD0iTTExLDEwIEwxOCwxMy43NCAxOCwyMi4yOCAxMSwyNiBNMTgsMTMuNzQgTDI2LDE4IDI2LDE4IDE4LDIyLjI4IiBmaWxsPSIjZmZmIj48L3BhdGg+DQo8L3N2Zz4=";
	    }, function (e, t) {
	      e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAFoAAABaAHAjuH0AAAAHdElNRQfgBRQSOydLEdPXAAABmUlEQVRYw+2Wu0oDQRhGz2oIEhAtBEHRQpIIXtAH0M7Kd7DQQl/BV/BlFEEsBO9IUAmI8X5Bi6RQoqgYJYr5LMISE5LdmZhyT7mzO9/8Z3b/WQgICAjwxak9JLPbfGiqfwGNCBhkmj4cECqryJyQ52iMWeIccsI9eVfav4tyEZrSjwpKaUHj6lKLHFnXEvIZd3CI080k6yyRJGdryi8AIEyYdtoYZJ9NEnzYyDIJKM7VQw8DROnnmGseihJNY6oiNKWCyvnRq5Y1o6jaFXJ3xMuaaQUuTbQywSgXLLLGXeMU/ZUVoZcOOhljj23OXVnVVdkHFIkwwgBDxEhwRpq3OuaougeV5HWsefXX3ge/XmQiOezloV5FAN+cssEB52QaH/DBNanSJjcyQHySrXxNa39stgEF3tlimR2yvJs8YBfwRIJ1klzyWLro3SpMA0SaG5LssMuL2dTmAV/kyJS3a/MG5xcg4IpVVrjlmbz9uekdkOOILRKkikemuRgjhIY1p7ia7Q/KEn7/RY6t80r8elF9yw4ICAiw4xcxfsNvJiWE7gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wNS0yMFQxODo1OToxOCswODowMJKBy7cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTYtMDUtMjBUMTg6NTk6MzkrMDg6MDAHjn/CAAAAPHRFWHRzdmc6YmFzZS11cmkAZmlsZTovLy9EOi9zcGFjZS92Y19wbGF5ZXIvc3JjL2ltZy9wbGF5X2J0bi5zdmedrkudAAAAAElFTkSuQmCC";
	    }, function (e, t) {
	      e.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogICAgPHBhdGggZD0iTTExLDEwIEwxNywxMCAxNywyNiAxMSwyNiBNMjAsMTAgTDI2LDEwIDI2LDI2IDIwLDI2IiBmaWxsPSIjZmZmIj48L3BhdGg+DQo8L3N2Zz4=";
	    }, function (e, t) {
	      e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAFoAAABaAHAjuH0AAAAHdElNRQfgBRQTADNsu4KlAAAAfklEQVRYw+2WsQ2AMAwEPyiZimloWIqOhjHYg1VAMi1Ejo2l0P2VH/kvnQ0QQohLaj9Jl6ocnBInDwpGzI+qgh0LxMhjCGSSN5skaeY6g+m4qn+dTh4WdIACCiiggAIKfEGulntxcrXC4sBaLXc7V/DuosDZolf9fngRQsgHbrk8P6SPYKxbAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTA1LTIwVDE5OjAwOjI0KzA4OjAwi3r4LQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0wNS0yMFQxOTowMDo1MSswODowMKLaZi8AAAA8dEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL0Q6L3NwYWNlL3ZjX3BsYXllci9zcmMvaW1nL3N0b3BfYnRuLnN2Z0xvOgsAAAAASUVORK5CYII=";
	    }, function (e, t) {
	      e.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogICAgPHBhdGggZD0iTTEyLjM5LDE1LjU0IEwxMCwxNS41NCBMMTAsMjAuNDQgTDEyLjQsMjAuNDQgTDE3LDI1LjUwIEwxNywxMC40OCBMMTIuMzksMTUuNTQgWiIgb3BhY2l0eT0iMSIgZmlsbD0iI2ZmZiI+PC9wYXRoPg0KICAgIDxwYXRoIGQ9Ik0xMi4zOSwxNS41NCBMMTAsMTUuNTQgTDEwLDIwLjQ0IEwxMi40LDIwLjQ0IEwxNywyNS41MCBMMTcsMTAuNDggTDEyLjM5LDE1LjU0IFoiIG9wYWNpdHk9IjEiIGZpbGw9IiNmZmYiPjwvcGF0aD4NCiAgICA8cGF0aCBkPSJNMjIsMTcuOTkgQzIyLDE2LjQgMjAuNzQsMTUuMDUgMTksMTQuNTQgTDE5LDIxLjQ0IEMyMC43NCwyMC45MyAyMiwxOS41OSAyMiwxNy45OSBaIiBvcGFjaXR5PSIxIiBmaWxsPSIjZmZmIj48L3BhdGg+DQogICAgPHBhdGggZD0iTTIyLDE3Ljk5IEMyMiwxNi40IDIwLjc0LDE1LjA1IDE5LDE0LjU0IEwxOSwyMS40NCBDMjAuNzQsMjAuOTMgMjIsMTkuNTkgMjIsMTcuOTkgWiIgb3BhY2l0eT0iMSIgZmlsbD0iI2ZmZiI+PC9wYXRoPg0KPC9zdmc+";
	    }, function (e, t) {
	      e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAFoAAABaAHAjuH0AAAAHdElNRQfgBR8OMR9bwV7WAAABiElEQVRYw+2WvS9DURiHn9sSbUMrrTZSsYgYSATBIkRYLI0JsfkDjCb+B4mFxeJjNVsMEkwmMRhMNloShg5K+zO4lV4ft6e9DJL7nO3c97zPOe/JOeeCj4+PT1UsszDVPsQm8NcrMBLY84+T+BOBnT7CDFM11sckud2aNalT7cuS96TfCBo1qhNJe7ULGgyKAyOsMFTuKPeaVesHgWOewyyRqYhsp0juPaa6xG0FMSJAhGUWHHFjtHBEloK3ElnMMQF00EfIsbRp5jljjSuKXgQwwCwFmmn61B8lwTjLbHFRXeB2DmJEaSP0pdAlIMYs3SYlchPIdVySsFeBOyWzsECd30rckjcRuG1yjiwvtBL+pAoC9xxw7VVwToAgXfSTdmz0E3ccs2km+AEhFFVKKXVqQzm9sytLKKNFpdUoPFx8qmy9Wle+QpBUvPzNM3aiQe3o8UPwW8kdK+nRoV5//bqu4IZVgvVMsYrAwj7Qz1yyXU9djF6Nj0ff4qHW35b//1/k4+PjY8AbQVScfN4fNOAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDUtMzFUMTQ6NDk6MDYrMDg6MDB87oydAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA1LTMxVDE0OjQ5OjMxKzA4OjAwRpsNTAAAADp0RVh0c3ZnOmJhc2UtdXJpAGZpbGU6Ly8vRDovc3BhY2UvdmNfcGxheWVyL3NyYy9pbWcvdm9sdW1uLnN2Z7m8k5MAAAAASUVORK5CYII=";
	    }, function (e, t) {
	      e.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogICAgPHBhdGggZD0iTTEyLjM5LDE1LjU0IEwxMCwxNS41NCBMMTAsMjAuNDQgTDEyLjQsMjAuNDQgTDE3LDI1LjUwIEwxNywxMC40OCBMMTIuMzksMTUuNTQgWiIgb3BhY2l0eT0iMSIgZmlsbD0iI2ZmZiI+PC9wYXRoPg0KICAgIDxwYXRoIGQ9Ik0xMi4zOSwxNS41NCBMMTAsMTUuNTQgTDEwLDIwLjQ0IEwxMi40LDIwLjQ0IEwxNywyNS41MCBMMTcsMTAuNDggTDEyLjM5LDE1LjU0IFoiIG9wYWNpdHk9IjEiIGZpbGw9IiNmZmYiPjwvcGF0aD4NCiAgICA8cGF0aCBkPSJNMTkuNjMsMTUuOTIgTDIwLjY4LDE0LjkzIEwyMi44MSwxNi45NCBMMjQuOTQsMTQuOTMgTDI2LDE1LjkyIEwyMy44NiwxNy45MyBMMjYsMTkuOTMgTDI0Ljk0LDIwLjkyIEwyMi44MSwxOC45MiBMMjAuNjgsMjAuOTIgTDE5LjYzLDE5LjkzIEwyMS43NiwxNy45MyBMMTkuNjMsMTUuOTIgWiIgb3BhY2l0eT0iMSIgZmlsbD0iI2ZmZiI+PC9wYXRoPg0KICAgIDxwYXRoIGQ9Ik0xOS42MywxNS45MiBMMjAuNjgsMTQuOTMgTDIyLjgxLDE2Ljk0IEwyNC45NCwxNC45MyBMMjYsMTUuOTIgTDIzLjg2LDE3LjkzIEwyNiwxOS45MyBMMjQuOTQsMjAuOTIgTDIyLjgxLDE4LjkyIEwyMC42OCwyMC45MiBMMTkuNjMsMTkuOTMgTDIxLjc2LDE3LjkzIEwxOS42MywxNS45MiBaIiBvcGFjaXR5PSIxIiBmaWxsPSIjZmZmIj48L3BhdGg+DQo8L3N2Zz4=";
	    }, function (e, t) {
	      e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAFoAAABaAHAjuH0AAAAHdElNRQfgBR8OMx9p9zxUAAAB3UlEQVRYw+2Wz0sVURTHP+PMw3joG39jWRGFLpQnIhZBEGEEuZBoERK0aNUqWrXyL3AVtWjnKjVaqOBChKJV8UJatAgraBUkgo8Cn2kk8b4uHMN5zcybO+pCmM/ZnXvv+Z5z7g8upKSkpFTFijdN5ks8ag67glgCXv5NNB+KgBc+y3UGDfsTJ7hndbqit5qUpf0HDRDI6ILeSJowF3BiNAfO85D+XUeQRHjnQgR8QQa4y3D1VIJFopa5ZIEs9xnxzbNxaaBEiS0ytGNT4qd5iyxucRnooIdjvpFGbnOHlzznM6cZ4zgzPEamAtDHDbaoo7bC/xuHPC04fOci1yhGHd7oFuUC/ZssMs0QNylzkmXmKSQTUKi/wBqdDOBQosAUH8KDJHuLamnGxQEynKMhampUBWHiLle5xxnesU6ebh7gMhdWb1QFRVZZZoPyf2u6uMQSUzzlBb/oI5+sgvfUYHOWXk74zsk6X3nFLK9ZYZEyOb4YN1kI5dSmNp3SExW1wzNZQqheHcrJFrLVqnbVC8M3SnutW4+04RMINKM9sDwD4BMTTLNWOVZpifiXX5cW9PfAn+s9fGMUO0mKVQQsvAv9h4+Mm+7kboQYjQKgCYsfpt+Wo/8vSklJSYnBNtEBsGU3qz6oAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTA1LTMxVDE0OjUxOjA1KzA4OjAwn18JNAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0wNS0zMVQxNDo1MTozMSswODowMJTCkngAAAA5dEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL0Q6L3NwYWNlL3ZjX3BsYXllci9zcmMvaW1nL211dGVkLnN2Z6SDmFIAAAAASUVORK5CYII=";
	    }, function (e, t) {
	      e.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogICAgPHBhdGggZD0iTTcsMTYgTDEwLDE2IEwxMCwxMyBMMTMsMTMgTDEzLDEwIEw3LDEwIEw3LDE2IFoiIG9wYWN0aXk9IjEiIGZpbGw9IiNmZmYiPjwvcGF0aD4NCiAgICA8cGF0aCBkPSJNMjMsMTAgTDIzLDEzIEwyNiwxMyBMMjYsMTYgTDI5LDE2IEwyOSwxMCBMMjMsMTAgWiIgb3BhY3RpeT0iMSIgZmlsbD0iI2ZmZiI+PC9wYXRoPg0KICAgIDxwYXRoIGQ9Ik0yMywyMyBMMjMsMjYgTDI5LDI2IEwyOSwyMCBMMjYsMjAgTDI2LDIzIEwyMywyMyBaIiBvcGFjdGl5PSIxIiBmaWxsPSIjZmZmIj48L3BhdGg+DQogICAgPHBhdGggZD0iTTEwLDIwIEw3LDIwIEw3LDI2IEwxMywyNiBMMTMsMjMgTDEwLDIzIEwxMCwyMCBaIiBvcGFjdGl5PSIxIiBmaWxsPSIjZmZmIj48L3BhdGg+DQo8L3N2Zz4=";
	    }, function (e, t) {
	      e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAFoAAABaAHAjuH0AAAAHdElNRQfgBR8TICc05PV7AAABZUlEQVRYw+2WPXKDMBSEPwXsg6TIJVxxEBcunEPFld04t6DiEi58EGyyKSAOED1JZCZFZrQVmtl9f/tGAjIyMjKicNOj0mgLuGVCNCtSErf0SPZU3EaSNxoj/IbXUYoVNYdgOSDkdNYUO1nc3Yx5lptznzzK2+zcmfV0EaWRYFQi0AWaFt2DZ6AMiA/UrJHpADTscLRU7L2LFkwANe+EceU6fO2Xd+BYY5U1EL5aZW0TfR70E+0iCzdVdCOlt4xx7A0vdIiGq4vGBsEzGxwFF5p5yMhVkZhgseY/4c9H5FvTkcmJZU5MjlQjp6Mk6a5t2p4KbXWXJB3TLru+x2LBOjgKa6Khu6j9nm/kRWvRb+6iCobLzvKin31LldyrkNNpeD4+9BHy4jH7nidJp58ehDqIe9HPPuiVz+TV7FyY6iKiNDqoYfLoX8wEF06zR98Ywyga3l8Rc4ui3NJSJmIJNyMjI8PCJz46uKC8JLnTAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTA1LTMxVDE3OjQ1OjU3KzA4OjAwNY8FDQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0wNS0zMVQxOTozMjozOSswODowMOODzSEAAAA+dEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL0Q6L3NwYWNlL3ZjX3BsYXllci9zcmMvaW1nL2Z1bGxzY3JlZW4uc3ZnTGxUBwAAAABJRU5ErkJggg==";
	    }, function (e, t) {
	      e.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogICAgPGRlZnM+DQogICAgICAgIDxwYXRoIGQ9Ik0xMywxMCBMMTAsMTAgTDEwLDEzIEw3LDEzIEw3LDE2IEwxMywxNiBMMTMsMTAgWiIgaWQ9InN2Zy1xdWl0LTEiPjwvcGF0aD4NCiAgICAgICAgPHBhdGggZD0iTTI5LDE2IEwyOSwxMyBMMjYsMTMgTDI2LDEwIEwyMywxMCBMMjMsMTYgTDI5LDE2IFoiIGlkPSJzdmctcXVpdC0yIj48L3BhdGg+DQogICAgICAgIDxwYXRoIGQ9Ik0yOSwyMyBMMjksMjAgTDIzLDIwIEwyMywyNiBMMjYsMjYgTDI2LDIzIEwyOSwyMyBaIiBpZD0ic3ZnLXF1aXQtMyI+PC9wYXRoPg0KICAgICAgICA8cGF0aCBkPSJNMTAsMjYgTDEzLDI2IEwxMywyMCBMNywyMCBMNywyMyBMMTAsMjMgTDEwLDI2IFoiIGlkPSJzdmctcXVpdC00Ij48L3BhdGg+DQogICAgPC9kZWZzPg0KICAgIDx1c2Ugc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iLjE1IiBzdHJva2Utd2lkdGg9IjJweCIgeGxpbms6aHJlZj0iI3N2Zy1xdWl0LTEiPjwvdXNlPg0KICAgIDx1c2Ugc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iLjE1IiBzdHJva2Utd2lkdGg9IjJweCIgeGxpbms6aHJlZj0iI3N2Zy1xdWl0LTIiPjwvdXNlPg0KICAgIDx1c2Ugc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iLjE1IiBzdHJva2Utd2lkdGg9IjJweCIgeGxpbms6aHJlZj0iI3N2Zy1xdWl0LTMiPjwvdXNlPg0KICAgIDx1c2Ugc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iLjE1IiBzdHJva2Utd2lkdGg9IjJweCIgeGxpbms6aHJlZj0iI3N2Zy1xdWl0LTQiPjwvdXNlPg0KICAgIDx1c2UgZmlsbD0iI2ZmZiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhsaW5rOmhyZWY9IiNzdmctcXVpdC0xIj48L3VzZT4NCiAgICA8dXNlIGZpbGw9IiNmZmYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bGluazpocmVmPSIjc3ZnLXF1aXQtMiI+PC91c2U+DQogICAgPHVzZSBmaWxsPSIjZmZmIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeGxpbms6aHJlZj0iI3N2Zy1xdWl0LTMiPjwvdXNlPg0KICAgIDx1c2UgZmlsbD0iI2ZmZiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhsaW5rOmhyZWY9IiNzdmctcXVpdC00Ij48L3VzZT4NCjwvc3ZnPg==";
	    }, function (e, t) {
	      e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwEAQAAACtm+1PAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAFoAAABaAHAjuH0AAAAHdElNRQfgBR8RLwr1J2GvAAAFUklEQVRo3u2Yf0iUdxzHX889z915levSmBbpNS8NlSCcrY7+iJq2H8ZNYQwyguZYMBhBUK1iKeWgX46xGAaFzWEYtYHXUZJaiTB2mSaCTSG7QpPVxJbN8rzHu/vuj9PSqfeczkHBveD55/l+vu/v5/P9fD7P830eiBAhQoQIESK8HhjDtJNmODaTtaaHdBcnKDtBuQCKFZR0UFaAMiRb5JwwFzYGbZWhkbnpI1oXQNkZXCN8lOkYi2VKPQvilxryDANKGjE48fAQn/c45f7cv09CXw7QpiGT4u9acFJ2vFFu3I2PRcjYifG1M6BWqUvFskf14PtfEgAoFwwFSWUtK4pq+lKqE3tPXXT3xjuKKwe3xEHsALAqDJFVEDtQObglrjfeUdx76qK7L6U6sWVFUY2hIKksmInZYZJykLPmlCbF9CVUJ4sxNBXuN4N5LZAZhm4mmNc2Fe43j9XoS6hOnlOaFANyVni+BNGFWMg7vublLFAKPFbRFrCrZS+smkVH4JJ/JZA9jc3JDlzyr6RZdIzeCNjVMo9VtIFSMLLW2J7wTiUUsgfG1XwmLR6r+MncYLgvZTF3Gs6GhZTFXHOD4X5/zeJ1Jrf0pa85vJ7QamKbIc8wcKNp65LEutWxAbvqlrKYO/9ExhC5sxvA/BMZQ3d2HDUJJ26d0xDbbW5csiavokc9gw34bqYB7FPSiEn8dfWfsd0fdL24mws8o4550yqbqXlGnf56QvZCEoLaP3CH5ViUtIo4Ff4KNVWnIR2FE09g13D9hJFR59MlD5vIBzzTcDk4J13yjNMaQ2DXcD1OPEBUKCGtDOh4iI9CUcnnfD226V44Xx54IDYLG4fon0YAsWKzsFEecLNNB78L07jRTCmVQlFJNH4tH7UCaPIep/zqxp+LkotufjvytHnJJvLFZmG7fKD1XTBY0c5ocFMwVF0+0FpC8b5r0hHJxSUqxxlskls773UZvbUcJJdtobIQ8mwiW+Qcf9eCkyAWgP99Jj4qPUAsGKr0Nu+nw66nh4H7GgG8pbfN3zfsMv4Iah7wGDD9y6YO5CsgPZEtT77wd/kvzyiAkXHDyM4KDTsfMBxGBgD0BLOvpRkA1FB24aT8lSZkD8gW+cPXvISUIdmRWF6x0VaUfMTiDdXExb+0WqHXD9zUCOAdeFM+8PFKd07xymvSuSmaeG+XcWut66A/t3sb+KKYGcqKOclJqb3xjuLgqS3QPu4aFLdEqd9xo2NPG5iPEf5h7tiNjj1totTvEIPi1gRdIURvvKN4TnJSavCbIYSHGosFWITMbik/uLSUOsFimw7piOQiWArh8lg6J7nYq3sbExlkTlIIh6R8znKeTgKhhLSaeAg7Jl2Jfv2EkWfUAcGXULAETIRPcM7oC2xUa6xjJfr12DEBQ6GEtDJw2NfOQLexcQmJpATsatnoYU5/PWF2zkEA88ge3vDgt6c7WqLEVZ7rnIbPus2Np33t9ADRwCczDcClVqlL1+RV9CiZFY89VmE1Nxju39lx1LSQhFnzH+DpjpaolKavPP121WpKlx77mulRq9RnwO0ZZ0C661svlj2qV89gU8+IDFAa+msWrxNO3LN9nBZXed5vV63ivT8aBvFlgBQN3A76MPVxOhSvxSdlqAxM8hknbfc1M9BtblzCciyBXcP1FIrKzntdRg7JV4ANYQQggXylc2/XMsuii99wSMrXlejXd5sbT/ua6RnZ+avavmgHMBkveyKtIo6zfEQ0fm8tB0F6gsYTY4QhkJ5srXUdNEa7vucs59lOnK89vJr/T7yKP7amw+v/azFChAgRIkSIMMv8A/Qifkc5vn6XAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTA1LTMxVDE3OjQ2OjUxKzA4OjAwvWiLNAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0wNS0zMVQxNzo0NzoxMCswODowMAHKXfgAAABDdEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL0Q6L3NwYWNlL3ZjX3BsYXllci9zcmMvaW1nL2Z1bGxzY3JlZW5fZXhpdC5zdmeq7hYiAAAAAElFTkSuQmCC";
	    }, function (e, t) {
	      e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAjVJREFUeNrsmDtoFUEUhr+rJkiCSEyRQhHRCCohBAlioRIECxtBQRBL8VHYWFmIhXaijY2gRCGIFlbpLASFYDAiPoiPYFBBRBQFkRA0PmI+m3MhhORe3ZDNXpgfplh2mZlv5/zn7NmSSi1rATWuBJAAEkACSAAJIAHMpxbluFYbcBDYCiwBvgODQDdwD5jINKuax+hSB51ew+p+tS7L3HlsvlW9b2UNqGuyzJ+HBzqBjVWeaQIai2ri31XiewK4BbwvmgdK6k71tjo+Q+j8UbvVlqzrlOagIysBHcAxYDfwDOgB1sV1c5zKa+B63BvNvNgsABqApcBIpESAlcBh4Ehsqge4DHwIsPVAK/AtwD7P+m1lBNgCHAJWAa+AG8By4ATQAlwFLgIv5txhGeJuh/p2Six/UkfUXnVzTrUlUx1Yq/bPYMibakOem89SB9piTKePk7xQ2I+5p8CjCsWoqegAb4AzYdyyRoEnYezeSJUNeQFkzUKdwL54433AXWATcDJCrBc4D/RPU4UXR0odm0+AsuqiKJW1AjgAHI1TuAZcAJ4Dq4FdQHuc/BBwB3iYdxr9l9GhXlLH1CH1nNqn/pqUtcYjHR9XG/NKo/8z6tXtFdJuWT/V02pzUfuBveqPKhBf1FNF7Qfqw7SVtAzYVtR+4DEwXMt/JV4CZ4GvVSCvFLmpXxheeDAl9sej4emKZwrR0FRSO7AH2BAFbiCK3rv5KmTpz1wCSAAJIAEkgASQAGpZfwcAT9esWbDao2gAAAAASUVORK5CYII=";
	    }, function (e, t, i) {
	      function o(e, t) {
	        for (var i = 0; i < e.length; i++) {
	          var o = e[i],
	              n = d[o.id];

	          if (n) {
	            n.refs++;

	            for (var r = 0; r < n.parts.length; r++) {
	              n.parts[r](o.parts[r]);
	            }

	            for (; r < o.parts.length; r++) {
	              n.parts.push(c(o.parts[r], t));
	            }
	          } else {
	            for (var s = [], r = 0; r < o.parts.length; r++) {
	              s.push(c(o.parts[r], t));
	            }

	            d[o.id] = {
	              id: o.id,
	              refs: 1,
	              parts: s
	            };
	          }
	        }
	      }

	      function n(e) {
	        for (var t = [], i = {}, o = 0; o < e.length; o++) {
	          var n = e[o],
	              r = n[0],
	              s = n[1],
	              a = n[2],
	              l = n[3],
	              c = {
	            css: s,
	            media: a,
	            sourceMap: l
	          };
	          i[r] ? i[r].parts.push(c) : t.push(i[r] = {
	            id: r,
	            parts: [c]
	          });
	        }

	        return t;
	      }

	      function r(e, t) {
	        var i = A(),
	            o = g[g.length - 1];
	        if ("top" === e.insertAt) o ? o.nextSibling ? i.insertBefore(t, o.nextSibling) : i.appendChild(t) : i.insertBefore(t, i.firstChild), g.push(t);else {
	          if ("bottom" !== e.insertAt) throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	          i.appendChild(t);
	        }
	      }

	      function s(e) {
	        e.parentNode.removeChild(e);
	        var t = g.indexOf(e);
	        t >= 0 && g.splice(t, 1);
	      }

	      function a(e) {
	        var t = document.createElement("style");
	        return t.type = "text/css", r(e, t), t;
	      }

	      function l(e) {
	        var t = document.createElement("link");
	        return t.rel = "stylesheet", r(e, t), t;
	      }

	      function c(e, t) {
	        var i, o, n;

	        if (t.singleton) {
	          var r = m++;
	          i = v || (v = a(t)), o = u.bind(null, i, r, !1), n = u.bind(null, i, r, !0);
	        } else e.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (i = l(t), o = h.bind(null, i), n = function n() {
	          s(i), i.href && URL.revokeObjectURL(i.href);
	        }) : (i = a(t), o = p.bind(null, i), n = function n() {
	          s(i);
	        });

	        return o(e), function (t) {
	          if (t) {
	            if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap) return;
	            o(e = t);
	          } else n();
	        };
	      }

	      function u(e, t, i, o) {
	        var n = i ? "" : o.css;
	        if (e.styleSheet) e.styleSheet.cssText = w(t, n);else {
	          var r = document.createTextNode(n),
	              s = e.childNodes;
	          s[t] && e.removeChild(s[t]), s.length ? e.insertBefore(r, s[t]) : e.appendChild(r);
	        }
	      }

	      function p(e, t) {
	        var i = t.css,
	            o = t.media;
	        if (o && e.setAttribute("media", o), e.styleSheet) e.styleSheet.cssText = i;else {
	          for (; e.firstChild;) {
	            e.removeChild(e.firstChild);
	          }

	          e.appendChild(document.createTextNode(i));
	        }
	      }

	      function h(e, t) {
	        var i = t.css,
	            o = t.sourceMap;
	        o && (i += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(o)))) + " */");
	        var n = new Blob([i], {
	          type: "text/css"
	        }),
	            r = e.href;
	        e.href = URL.createObjectURL(n), r && URL.revokeObjectURL(r);
	      }

	      var d = {},
	          f = function f(e) {
	        var t;
	        return function () {
	          return "undefined" == typeof t && (t = e.apply(this, arguments)), t;
	        };
	      },
	          y = f(function () {
	        return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	      }),
	          A = f(function () {
	        return document.head || document.getElementsByTagName("head")[0];
	      }),
	          v = null,
	          m = 0,
	          g = [];

	      e.exports = function (e, t) {
	        t = t || {}, "undefined" == typeof t.singleton && (t.singleton = y()), "undefined" == typeof t.insertAt && (t.insertAt = "bottom");
	        var i = n(e);
	        return o(i, t), function (e) {
	          for (var r = [], s = 0; s < i.length; s++) {
	            var a = i[s],
	                l = d[a.id];
	            l.refs--, r.push(l);
	          }

	          if (e) {
	            var c = n(e);
	            o(c, t);
	          }

	          for (var s = 0; s < r.length; s++) {
	            var l = r[s];

	            if (0 === l.refs) {
	              for (var u = 0; u < l.parts.length; u++) {
	                l.parts[u]();
	              }

	              delete d[l.id];
	            }
	          }
	        };
	      };

	      var w = function () {
	        var e = [];
	        return function (t, i) {
	          return e[t] = i, e.filter(Boolean).join("\n");
	        };
	      }();
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;

	      var l = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
	        return _typeof(e);
	      } : function (e) {
	        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
	      },
	          c = i(24),
	          u = n(c),
	          p = i(2),
	          h = o(p),
	          d = i(3),
	          f = o(d),
	          y = i(4),
	          A = i(25),
	          v = o(A),
	          m = i(1),
	          g = o(m),
	          w = (f.FullscreenApi, {
	        "0.7.1": "libs/hls.js",
	        "0.7min": "libs/hls.min.js",
	        "0.8.1": "libs/hls0.8.js",
	        "0.8.9": "libs/hls.min.0.8.9.js",
	        "0.12.4": "libs/hls.min.0.12.4.js"
	      }),
	          b = function (e) {
	        function t(i) {
	          return r(this, t), s(this, e.call(this, i, "H5Video"));
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          var i,
	              o = this.player.options,
	              n = "system" == o.controls ? "" : null,
	              r = !!o.autoplay || null;
	          return i = o.poster && "object" == l(o.poster) ? o.poster.src : "string" == typeof o.poster ? o.poster : null, this.createEl("video", {
	            controls: n,
	            preload: o.preload || "auto",
	            autoplay: r,
	            "webkit-playsinline": "",
	            playsinline: "",
	            "x-webkit-airplay": "allow",
	            "x5-video-player-type": "h5" == o.x5_type ? "h5" : null,
	            "x5-video-player-fullscreen": !!o.x5_fullscreen || null,
	            "x5-video-orientation": ["landscape", "portrait", "landscape|portrait"][o.x5_orientation] || null,
	            "x5-playsinline": 1 == !!o.x5_playsinline ? o.x5_playsinline : null,
	            "x5-mse-live-streaming": o.live ? "" : null
	          }), this.el.style.width = this.player.width, this.el.style.height = this.player.height, e.prototype.render.call(this, t);
	        }, t.prototype.__hlsLoaded = function (e) {
	          if (!Hls.isSupported()) return this.notify({
	            type: "error",
	            code: 5,
	            timeStamp: +new Date()
	          });
	          this.hls && this.hls.destroy();
	          var t = new Hls(this.options.hlsConfig);
	          t.loadSource(e), t.attachMedia(this.el), t.on(Hls.Events.MANIFEST_PARSED, function (e, t) {}), t.on(Hls.Events.MEDIA_DETACHED, function () {}), t.on(Hls.Events.ERROR, f.bind(this, this.__hlsOnError)), this.hls = t;
	        }, t.prototype.__hlsOnManifestParsed = function (e, t) {
	          this.metaDataLoaded = !0;
	        }, t.prototype.__hlsOnError = function (e, t) {
	          var i = t.type,
	              o = t.details,
	              n = t.fatal,
	              r = this.hls;
	          if (n) switch (i) {
	            case Hls.ErrorTypes.NETWORK_ERROR:
	              o.indexOf("TimeOut") > 0 ? f.console.error("加载视频文件超时") : f.console.error("无法加载视频文件，请检查网络，以及视频文件是否允许跨域请求访问，m3u8文件是否存在 " + (t.response && t.response.status ? "netstatus:" + t.response.status : "")), this.notify({
	                type: "error",
	                code: 2,
	                timeStamp: +new Date()
	              }), r.startLoad();
	              break;

	            case Hls.ErrorTypes.MEDIA_ERROR:
	              r.recoverMediaError();
	              break;

	            default:
	              r.destroy();
	          }
	        }, t.prototype.__flvLoaded = function (e) {
	          if (!flvjs.isSupported()) return this.notify({
	            type: "error",
	            code: 5,
	            timeStamp: +new Date()
	          });
	          this.flv && this.flv.destroy();
	          var t = flvjs.createPlayer({
	            type: "flv",
	            isLive: this.player.options.live,
	            url: e
	          }, this.options.flvConfig);
	          t.attachMediaElement(this.el), t.on(flvjs.Events.ERROR, f.bind(this, function (e, t, i) {
	            var o = {
	              type: "error"
	            };
	            e == flvjs.ErrorTypes.NETWORK_ERROR && (o.code = 2), e == flvjs.ErrorTypes.MEDIA_ERROR && (o.code = 1002), e == flvjs.ErrorTypes.OTHER_ERROR, o.timeStamp = +new Date(), this.notify(o);
	          })), t.on(flvjs.Events.MEDIA_INFO, f.bind(this, function (e, t) {})), t.on(flvjs.Events.STATISTICS_INFO, f.bind(this, function (e, t) {})), this.flv = t, t.load();
	        }, t.prototype.setup = function () {
	          this.playState = v.PlayStates.IDLE, this.seekState = v.SeekStates.IDLE, this.metaDataLoaded = !1, this.__timebase = +new Date(), this.on(y.MSG.MetaLoaded, this.notify), this.on(y.MSG.Loaded, this.notify), this.on(y.MSG.Progress, this.notify), this.on(y.MSG.Play, this.notify), this.on(y.MSG.Playing, this.notify), this.on(y.MSG.Pause, this.notify), this.on(y.MSG.Error, this.notify), this.on(y.MSG.TimeUpdate, this.notify), this.on(y.MSG.Ended, this.notify), this.on(y.MSG.Seeking, this.notify), this.on(y.MSG.Seeked, this.notify), this.on(y.MSG.VolumeChange, this.notify), this.on("durationchange", this.notify), this.load(this.options.src, this.options.m3u8 ? f.VideoType.M3U8 : "");
	        }, t.prototype.destroy = function () {
	          e.prototype.destroy.call(this), this.hls && this.hls.destroy(), this.flv && this.flv.destroy();
	        }, t.prototype.notify = function (e) {
	          var t = {
	            type: e.type,
	            src: this,
	            ts: +new Date(),
	            timeStamp: e.timeStamp
	          };

	          switch (e.type) {
	            case y.MSG.MetaLoaded:
	              this.metaDataLoaded = !0;
	              break;

	            case y.MSG.Error:
	              var i = {
	                1: "MEDIA_ERR_ABORTED",
	                2: "MEDIA_ERR_NETWORK",
	                3: "MEDIA_ERR_DECODE",
	                4: "MEDIA_ERR_SRC_NOT_SUPPORTED"
	              };
	              t.detail = this.el && this.el.error || {
	                code: e.code
	              }, t.detail.reason = i[t.detail.code];
	              break;

	            case y.MSG.Ended:
	              this.pause(), this.playState = v.PlayStates.STOP;
	              break;

	            case "durationchange":
	              0 != this.videoHeight() && (t.type = y.MSG.Resize);
	              break;

	            case y.MSG.Playing:
	              this.playState = e.type.toUpperCase();
	              break;

	            case y.MSG.Pause:
	              this.playState = v.PlayStates.PAUSED;
	              break;

	            case y.MSG.Seeking:
	            case y.MSG.Seeked:
	              this.seekState = e.type.toUpperCase();
	          }

	          "timeupdate" != e.type, this.pub(t);
	        }, t.prototype.videoWidth = function () {
	          return this.el.videoWidth;
	        }, t.prototype.videoHeight = function () {
	          return this.el.videoHeight;
	        }, t.prototype.width = function (e) {
	          return e ? void (this.el.style.width = e) : this.el.width;
	        }, t.prototype.height = function (e) {
	          return e ? void (this.el.style.height = e) : this.el.height;
	        }, t.prototype.play = function () {
	          this.options.hlsConfig && this.options.hlsConfig.autoStartLoad === !1 && this.hls && this.hls.startLoad(-1), this.el.play();
	        }, t.prototype.togglePlay = function () {
	          this.paused() ? this.play() : this.pause();
	        }, t.prototype.pause = function () {
	          this.el.pause();
	        }, t.prototype.stop = function () {
	          this.el.pause(), this.el.currentTime = 0;
	        }, t.prototype.paused = function () {
	          return this.el.paused;
	        }, t.prototype.buffered = function () {
	          return this.el.buffered.length >= 1 ? this.el.buffered.end(this.el.buffered.length - 1) : 0;
	        }, t.prototype.currentTime = function (e) {
	          return "undefined" == typeof e ? this.el.currentTime : this.el.currentTime = e;
	        }, t.prototype.duration = function () {
	          return this.el.duration || 0;
	        }, t.prototype.mute = function (e) {
	          return "undefined" == typeof e ? this.el.muted : (this.volume(e ? 0 : this.__lastVol), this.el.muted = e);
	        }, t.prototype.volume = function (e) {
	          return "undefined" == typeof e ? this.el.volume : (e < 0 && (e = 0), e > 1 && (e = 1), 0 != e && (this.__lastVol = e), this.el.muted = 0 == e, this.options.volume = e, this.el.volume = e);
	        }, t.prototype.fullscreen = function (e) {
	          return f.doFullscreen(this.player, e, this.owner);
	        }, t.prototype.load = function (e, t) {
	          this.pub({
	            type: y.MSG.Load,
	            src: this,
	            ts: +new Date(),
	            detail: {
	              src: e,
	              type: t
	            }
	          });
	          var i = e.indexOf(".m3u8") > -1 || t == f.VideoType.M3U8,
	              o = e.indexOf(".flv") > -1;
	          if (!g.IS_ENABLED_MSE || !i && !o || g.IS_X5TBS && this.player.options.x5_player || i && g.IS_MAC && g.IS_SAFARI && !g.IS_IOS) this.__type = t, this.el.src = e;else {
	            var n = this,
	                r = w[this.options.hls] || w["0.7.1"];
	            i ? (this.__type = f.VideoType.M3U8, "undefined" == typeof window.Hls ? h.loadScript(f.unifyProtocol(f.CDNPath + r), function () {
	              n.__hlsLoaded.call(n, e);
	            }) : this.__hlsLoaded(e)) : o && (this.__type = f.VideoType.FLV, "undefined" == typeof window.flvjs ? h.loadScript(f.unifyProtocol(f.CDNPath + "libs/flv.min.1.5.js"), function () {
	              n.__flvLoaded.call(n, e);
	            }) : this.__flvLoaded(e));
	          }
	        }, t.prototype.playing = function () {
	          return !this.el.paused;
	        }, t.prototype.type = function () {
	          return this.__type;
	        }, t;
	      }(u["default"]);

	      t["default"] = b;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function r(e, t) {
	        return t + "_" + e;
	      }

	      function s(e, t) {
	        return t.guid && String(t.guid).indexOf("_") == -1 ? e + "_" + t.guid : t.guid;
	      }

	      t.__esModule = !0;

	      var a = i(2),
	          l = o(a),
	          c = i(3),
	          u = o(c),
	          p = i(4),
	          h = o(p),
	          d = i(1),
	          f = o(d),
	          y = function () {
	        function e(t, i) {
	          n(this, e), this.name = i, this.player = t, this.options = t.options, this.fnCache = {}, this.guid = u.guid();
	        }

	        return e.prototype.createEl = function (e, t, i) {
	          return this.el = l.createEl(e, t, i);
	        }, e.prototype.render = function (e) {
	          return e && this.el && (this.owner = e, e.appendChild(this.el), this.setup()), this.el;
	        }, e.prototype.on = function (e, t, i) {
	          "string" == typeof e && (i = t, t = e, e = this.el), this.cbs = this.cbs || {};
	          var o = s(this.guid, i),
	              n = !o,
	              a = o && !this.fnCache[o];
	          return n || a ? (i = u.bind(this, i, this.guid), this.fnCache[i.guid] = i, o = i.guid) : i = this.fnCache[o], l.on(e, t, i), this.cbs[r(o, t)] = {
	            guid: o,
	            el: e,
	            type: t
	          }, i;
	        }, e.prototype.off = function (e, t, i) {
	          "string" == typeof e && (i = t, t = e, e = this.el), f.IS_MOBILE && "click" == t && (t = "touchend");
	          var o = s(this.guid, i);
	          this.fnCache[o] && (i = this.fnCache[o]), l.off(e, t, i), delete this.cbs[r(o, t)];
	        }, e.prototype.pub = function (e) {
	          var t = this;
	          setTimeout(function () {
	            h.pub(e, t.player);
	          }, 0);
	        }, e.prototype.sub = function (e, t, i) {
	          h.sub(e, t, i, this.player);
	        }, e.prototype.unsub = function (e, t, i) {
	          h.unsub(e, t, i, this.player);
	        }, e.prototype.handleMsg = function () {}, e.prototype.setup = function () {}, e.prototype.destroy = function () {
	          if (this.handleMsg && this.unsub("*", "*", this.handleMsg), this.cbs) {
	            for (var e in this.cbs) {
	              if (this.cbs.hasOwnProperty(e)) {
	                var t = this.cbs[e];
	                l.off(t.el, t.type, this.fnCache[t.guid]), delete this.cbs[e];
	              }
	            }

	            this.fnCache = null, this.cbs = null;

	            try {
	              this.el.parentNode.removeChild(this.el);
	            } catch (i) {}
	          }
	        }, e;
	      }();

	      t["default"] = y;
	    }, function (e, t) {

	      t.__esModule = !0;
	      t.PlayStates = {
	        IDLE: "IDLE",
	        PLAYING: "PLAYING",
	        PAUSED: "PAUSED",
	        STOP: "STOP"
	      }, t.SeekStates = {
	        IDLE: "IDLE",
	        SEEKING: "SEEKING",
	        SEEKED: "SEEKED"
	      }, t.ControlsStates = {
	        DEFAULT: "default",
	        NONE: "none",
	        SYSTEM: ""
	      };
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      function l(e) {
	        return window.document[e] ? window.document[e] : navigator.appName.indexOf("Microsoft Internet") != -1 ? document.getElementById(e) : document.embeds && document.embeds[e] ? document.embeds[e] : void 0;
	      }

	      t.__esModule = !0;

	      var c = i(24),
	          u = n(c),
	          p = i(4),
	          h = i(2),
	          d = o(h),
	          f = i(3),
	          y = o(f),
	          A = i(25),
	          v = o(A),
	          m = i(1),
	          g = o(m),
	          w = function (e) {
	        function t(i) {
	          r(this, t);
	          var o = s(this, e.call(this, i, "FlashVideo")),
	              n = "vcpFlashCB_" + o.guid;
	          return o.__flashCB = n, window[n] || (window[n] = function (e, t) {
	            t = t && t[0];
	            var i = window[n].fnObj && window[n].fnObj[t.objectID];
	            i && i(e, t);
	          }, window[n].fnObj = {}), o;
	        }

	        return a(t, e), t.prototype.render = function (e) {
	          this.__timebase = +new Date();
	          var t = this.player.options,
	              i = y.unifyProtocol(t.flashUrl || "//imgcache.qq.com/open/qcloud/video/player/release/QCPlayer.swf"),
	              o = "opaque",
	              n = "obj_vcplayer_" + this.player.guid,
	              r = this.__flashCB;
	          this.__id = n;
	          var s = d.createEl("div", {
	            "class": "vcp-video"
	          });
	          s.innerHTML = '\n\t\t<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="" id="' + n + '" width="100%" height="100%">\n            <param name="movie"  value="' + i + '" />\n            <param name="quality" value="autohigh" />\n            <param name="swliveconnect" value="true" />\n            <param name="allowScriptAccess" value="always" />\n            <param name="bgcolor" value="#000" />\n            <param name="allowFullScreen" value="true" />\n            <param name="wmode" value="' + o + '" />\n            <param name="FlashVars" value="cbName=' + r + '" />\n\n            <embed src="' + i + '" width="100%" height="100%" name="' + n + '"\n                   quality="autohigh"\n                   bgcolor="#000"\n                   align="middle" allowFullScreen="true"\n                   allowScriptAccess="always"\n                   type="application/x-shockwave-flash"\n                   swliveconnect="true"\n                   wmode="' + o + '"\n                   FlashVars="cbName=' + r + '"\n                   pluginspage="http://www.macromedia.com/go/getflashplayer" >\n            </embed>\n        </object>\n\t\t', this.container = s, this.owner = e, this.owner.appendChild(s), this.cover = d.createEl("div", {
	            "class": "vcp-pre-flash"
	          }), this.owner.appendChild(this.cover), window[this.__flashCB].fnObj[this.__id] = y.bind(this, this.notify);
	        }, t.prototype.setup = function () {
	          this.on("error", this.notify), this.playState = v.PlayStates.IDLE, this.seekState = v.SeekStates.IDLE, this.metaDataLoaded = !1;
	        }, t.prototype.doPolling = function () {
	          this.options.live || (clearInterval(this.__timer), this.__timer = setInterval(this.interval.bind(this), 1e3));
	        }, t.prototype.endPolling = function () {
	          clearInterval(this.__timer);
	        }, t.prototype.interval = function () {
	          var e;

	          try {
	            e = this.el.getState();
	          } catch (t) {
	            return void this.endPolling();
	          }

	          if (this.__m3u8) {
	            var i = this.currentTime() + e.bufferLength;
	            this.__buffered !== i && (this.__buffered = i, this.pub({
	              type: p.MSG.Progress,
	              src: this,
	              ts: +new Date()
	            })), this.__buffered >= this.duration() && this.endPolling();
	          } else this.__rtmp || (this.__bytesloaded != e.bytesLoaded && (this.__bytesloaded = e.bytesLoaded, this.pub({
	            type: p.MSG.Progress,
	            src: this,
	            ts: +new Date()
	          })), this.__bytesloaded >= this.__bytesTotal && this.endPolling());
	        }, t.prototype.destroy = function () {
	          "undefined" != typeof this.el && "undefined" != typeof this.el.destroy && this.el.destroy(), this.endPolling(), delete window[this.__flashCB].fnObj[this.__id], e.prototype.destroy.call(this);
	        }, t.prototype.notify = function (e, t) {
	          var i = {
	            type: e,
	            ts: +new Date()
	          };

	          try {
	            switch (this.options.debug && this.pub({
	              type: i.type,
	              src: this,
	              ts: i.ts,
	              detail: y.extend({
	                debug: !0
	              }, t)
	            }), i.type) {
	              case "ready":
	                if (this.el = l(this.__id), this.setup(), g.IS_FIREFOX) {
	                  var o = this;
	                  setTimeout(function () {
	                    o.el.setAutoPlay(!!o.options.autoplay), o.__timebase = new Date() - t.time, o.load(o.options.src);
	                  }, 0);
	                } else this.el.setAutoPlay(!!this.options.autoplay), this.__timebase = new Date() - t.time, this.load(this.options.src);

	                return;

	              case "metaData":
	                i.type = p.MSG.MetaLoaded, this.__videoWidth = t.videoWidth, this.__videoHeight = t.videoHeight, this.__duration = t.duration, this.__bytesTotal = t.bytesTotal, this.__prevPlayState = null, this.__m3u8 = t.type === y.VideoType.M3U8, this.__rtmp = t.type === y.VideoType.RTMP, this.__type = t.type, this.__metaloaded = !0, this.metaDataLoaded = !0, this.doPolling();
	                var o = this;
	                if (!o.cover) break;
	                setTimeout(function () {
	                  o.cover && (o.owner.removeChild(o.cover), o.cover = null);
	                }, 500);
	                break;

	              case "playState":
	                this.playState = t.playState, t.playState == v.PlayStates.PLAYING ? (this.__playing = !0, this.__stopped = !1, i.type = p.MSG.Play) : t.playState == v.PlayStates.PAUSED ? (this.__playing = !1, this.__stopped = !1, i.type = p.MSG.Pause) : t.playState == v.PlayStates.STOP ? (this.__playing = !1, this.__stopped = !0, i.type = p.MSG.Ended, this.__prevPlayState = null, this.options.live && (this.metaDataLoaded = !1)) : t.playState == v.PlayStates.IDLE && (this.__playing = !1, this.__stopped = !0, i.type = p.MSG.Ended);
	                break;

	              case "seekState":
	                if (this.seekState = t.seekState, !this.__metaloaded) return;
	                if (t.seekState == v.SeekStates.SEEKING) i.type = p.MSG.Seeking;else {
	                  if (t.seekState != v.SeekStates.SEEKED) return;
	                  this.__m3u8 || this.options.live || t.playState != v.PlayStates.STOP || (this.play(), this.__prevPlayState = t.playState), this.__m3u8 && (i.type = p.MSG.Seeked);
	                }
	                break;

	              case "netStatus":
	                this.options.live || ("NetStream.Buffer.Full" == t.code ? (this.__prevPlayState == v.PlayStates.PAUSED || this.__prevPlayState == v.PlayStates.STOP, this.__prevPlayState = null, i.type = p.MSG.Seeked) : "NetStream.Seek.Complete" == t.code), "NetConnection.Connect.Closed" == t.code && (this.options.src.indexOf("rtmp://") > -1 ? this.playState == v.PlayStates.STOP ? (i.type = "error", t = {
	                  code: 13,
	                  reason: t.code
	                }) : (i.type = "error", t = {
	                  code: 1002,
	                  reason: t.code
	                }) : this.playState = v.PlayStates.IDLE), "NetStream.Play.Stop" != t.code && "NetConnection.Connect.Success" != t.code && "NetConnection.Connect.Failed" != t.code || (this.playState = v.PlayStates.IDLE);
	                break;

	              case "mediaTime":
	                this.__videoWidth = t.videoWidth, this.__videoHeight = t.videoHeight, i.type = p.MSG.TimeUpdate;
	                break;

	              case "error":
	                if ("NetStream.Seek.InvalidTime" == t.code) return this.currentTime(t.details), !1;
	                "NetStream.Play.StreamNotFound" == t.code && this.pub({
	                  type: "netStatus",
	                  src: this,
	                  ts: i.ts,
	                  detail: t
	                });
	                var n = isNaN(parseInt(t.code)) ? 1002 : t.code,
	                    r = isNaN(parseInt(t.code)) ? t.code : t.msg,
	                    s = r.match(/#(\d+)/);
	                s && s[1] && (n = s[1]), t = {
	                  code: n,
	                  reason: r || ""
	                }, this.metaDataLoaded = !1;
	            }

	            var a = "printLog" == e || "canPlay" == e;
	            !a && this.pub({
	              type: i.type,
	              src: this,
	              ts: i.ts,
	              detail: t
	            });
	          } catch (c) {
	            y.console.error(e + " " + i.type, c);
	          }
	        }, t.prototype.handleMsg = function (e) {}, t.prototype.videoWidth = function () {
	          return this.__videoWidth;
	        }, t.prototype.videoHeight = function () {
	          return this.__videoHeight;
	        }, t.prototype.width = function (e) {
	          return "undefined" == typeof e ? this.el && this.el.width : (e = "100%", this.el && (this.el.width = e));
	        }, t.prototype.height = function (e) {
	          return "undefined" == typeof e ? this.el && this.el.height : (e = "100%", this.el && (this.el.height = e));
	        }, t.prototype.play = function (e) {
	          this.playState == v.PlayStates.PAUSED || this.playState == v.PlayStates.PLAYING || e ? this.el.playerResume() : this.playState != v.PlayStates.PLAYING && this.el.playerPlay();
	        }, t.prototype.togglePlay = function () {
	          this.metaDataLoaded ? this.playState == v.PlayStates.PAUSED ? this.el.playerResume() : this.playState == v.PlayStates.PLAYING ? this.el.playerPause() : this.playState == v.PlayStates.STOP ? (this.currentTime(0), this.el.playerResume()) : this.el.playerPlay() : this.player.load();
	        }, t.prototype.pause = function () {
	          this.el.playerPause();
	        }, t.prototype.stop = function () {
	          this.el.playerStop();
	        }, t.prototype.paused = function () {
	          return !this.__playing;
	        }, t.prototype.buffered = function () {
	          var e;
	          return this.__m3u8 ? this.__buffered || 0 : (e = (this.__bytesloaded || 0) / (this.__bytesTotal || 1), this.duration() * e);
	        }, t.prototype.currentTime = function (e) {
	          return "undefined" == typeof e ? this.el.getPosition() : void this.el.playerSeek(e);
	        }, t.prototype.duration = function () {
	          return this.__duration;
	        }, t.prototype.mute = function (e) {
	          return "undefined" == typeof e ? 0 == this.volume() : void this.volume(e ? 0 : this.__lastVol);
	        }, t.prototype.volume = function (e) {
	          return "undefined" == typeof e ? this.el && this.el.getState().volume : (this.el && this.el.playerVolume(e), 0 != e && (this.__lastVol = e), this.options.volume = e, void this.pub({
	            type: p.MSG.VolumeChange,
	            src: this,
	            ts: +new Date()
	          }));
	        }, t.prototype.fullscreen = function (e) {
	          return y.doFullscreen(this.player, e, this.owner);
	        }, t.prototype.load = function (e, t) {
	          this.pub({
	            type: p.MSG.Load,
	            src: this,
	            ts: +new Date(),
	            detail: {
	              src: e,
	              type: t
	            }
	          }), this.el && this.el.playerLoad(e);
	        }, t.prototype.playing = function () {
	          return this.el && this.el.getState && this.el.getState().playState === v.PlayStates.PLAYING;
	        }, t.prototype.type = function () {
	          return this.__type;
	        }, t.prototype.state = function () {
	          return this.playState;
	        }, t;
	      }(u["default"]);

	      t["default"] = w;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;

	      var l = i(24),
	          c = n(l),
	          u = i(28),
	          p = n(u),
	          h = i(29),
	          d = n(h),
	          f = i(30),
	          y = i(31),
	          A = n(y),
	          v = i(32),
	          m = n(v),
	          g = i(33),
	          w = n(g),
	          b = i(34),
	          M = n(b),
	          I = i(4),
	          S = i(2),
	          E = o(S),
	          _ = i(3),
	          T = o(_),
	          D = i(1),
	          L = o(D),
	          O = function (e) {
	        function t(i) {
	          return r(this, t), s(this, e.call(this, i, "Panel"));
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          return this.createEl("div", {
	            "class": "vcp-controls-panel"
	          }), this.el.appendChild(E.createEl("div", {
	            "class": "vcp-panel-bg"
	          })), this.playToggle = new p["default"](this.player), this.playToggle.render(this.el), this.timelabel = new m["default"](this.player), this.timelabel.render(this.el), this.timeline = new A["default"](this.player), this.timeline.render(this.el), this.options.fullscreenEnabled === !0 && (this.fullscreen = new d["default"](this.player), this.fullscreen.render(this.el)), L.IS_MOBILE || (this.volume = new w["default"](this.player), this.volume.render(this.el)), this.options.videoSource && this.options.videoSource.definitions.length > 1 && !L.IS_MOBILE && (this.claritySwitcher = new M["default"](this.player), this.claritySwitcher.render(this.el)), e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {
	          var e = T.bind(this, this.handleMsg);
	          this.sub(f.MSG.Changing, this.volume, e), this.sub(f.MSG.Changed, this.timeline.progress, e), this.sub(I.MSG.TimeUpdate, this.player.video, e), this.sub(I.MSG.Progress, this.player.video, e), this.sub(I.MSG.MetaLoaded, this.player.video, e), this.sub(I.MSG.Pause, this.player.video, e), this.sub(I.MSG.Play, this.player.video, e), this.sub(I.MSG.Ended, this.player.video, e);
	        }, t.prototype.handleMsg = function (e) {
	          switch (e.type) {
	            case I.MSG.MetaLoaded:
	              this.timeline.percent(this.player.percent()), this.timeline.buffered(this.player.buffered()), this.player.volume("undefined" == typeof this.options.volume ? .5 : this.options.volume), !this.options.autoplay && this.show();
	              break;

	            case I.MSG.TimeUpdate:
	              this.timeline.scrubbing || this.timeline.percent(this.player.percent());
	              break;

	            case I.MSG.Pause:
	              this.show();
	              break;

	            case I.MSG.Play:
	              this.hide();
	              break;

	            case I.MSG.Progress:
	              this.timeline.buffered(this.player.buffered());
	              break;

	            case f.MSG.Changed:
	              e.src === this.timeline.progress && this.player.percent(this.timeline.percent());
	              break;

	            case I.MSG.Ended:
	              this.show();
	          }
	        }, t.prototype.toggle = function () {
	          E.hasClass(this.el, "show") ? this.hide() : this.show();
	        }, t.prototype.show = function () {
	          E.hasClass(this.el, "hide") && (E.removeClass(this.el, "hide"), E.addClass(this.el, "show"));
	        }, t.prototype.hide = function () {
	          E.removeClass(this.el, "show"), E.addClass(this.el, "hide");
	        }, t;
	      }(c["default"]);

	      t["default"] = O;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;
	      var l = i(24),
	          c = n(l),
	          u = i(2),
	          p = (o(u), i(4)),
	          h = (o(p), i(3)),
	          d = (o(h), i(25)),
	          f = (o(d), function (e) {
	        function t(i) {
	          return r(this, t), s(this, e.call(this, i, "PlayToggle"));
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          return this.createEl("div", {
	            "class": "vcp-playtoggle"
	          }), e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {
	          this.on("click", this.onClick);
	        }, t.prototype.onClick = function () {
	          this.player.togglePlay();
	        }, t.prototype.handleMsg = function (e) {
	          console.log("@" + this.name, e);
	        }, t;
	      }(c["default"]));
	      t["default"] = f;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;

	      var l = i(24),
	          c = n(l),
	          u = i(2),
	          p = (o(u), i(4)),
	          h = (o(p), i(3)),
	          d = o(h),
	          f = function (e) {
	        function t(i) {
	          return r(this, t), s(this, e.call(this, i, "FullscreenToggle"));
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          return this.createEl("div", {
	            "class": "vcp-fullscreen-toggle"
	          }), window.fsApi = d.FullscreenApi, e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {
	          this.on("click", this.onClick);
	        }, t.prototype.onClick = function () {
	          this.player.fullscreen(!this.player.fullscreen());
	        }, t.prototype.handleMsg = function (e) {
	          console.log(t.name, e);
	        }, t;
	      }(c["default"]);

	      t["default"] = f;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0, t.MSG = void 0;

	      var l = i(24),
	          c = n(l),
	          u = i(2),
	          p = o(u),
	          h = i(4),
	          d = (o(h), i(3)),
	          f = (o(d), t.MSG = {
	        Changing: "sliderchanging",
	        Changed: "sliderchanged"
	      }),
	          y = function (e) {
	        function t(i, o) {
	          r(this, t);
	          var n = s(this, e.call(this, i, "Slider"));
	          return n.vertical = o || !1, n;
	        }

	        return a(t, e), t.prototype.render = function (t, i) {
	          var o = this.vertical ? "vcp-slider-vertical" : "vcp-slider";
	          return this.createEl("div", {
	            "class": o
	          }), this.track = p.createEl("div", {
	            "class": "vcp-slider-track"
	          }), this.thumb = p.createEl("div", {
	            "class": "vcp-slider-thumb"
	          }), this.el.appendChild(this.track), this.el.appendChild(this.thumb), this.enabled = "undefined" == typeof i || i, e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {
	          this.enabled && (this.ownerDoc = document.body.ownerDocument, this.on("mousedown", this.mousedown), this.on("touchstart", this.mousedown));
	        }, t.prototype.handleMsg = function (e) {}, t.prototype.mousedown = function (e) {
	          return e.preventDefault && e.preventDefault(), this.pos = p.findElPosition(this.el), this.on(this.ownerDoc, "mouseup", this.mouseup), this.on(this.ownerDoc, "mousemove", this.mousemove), this.on(this.ownerDoc, "touchend", this.mouseup), this.on(this.ownerDoc, "touchmove", this.mousemove), this.mousemove(e), !1;
	        }, t.prototype.mouseup = function (e) {
	          e.target || e.srcElement;
	          this.off(this.ownerDoc, "mouseup", this.mouseup), this.off(this.ownerDoc, "mousemove", this.mousemove), this.off(this.ownerDoc, "touchend", this.mouseup), this.off(this.ownerDoc, "touchmove", this.mousemove), this.pub({
	            type: f.Changed,
	            src: this,
	            "private": !0
	          });
	        }, t.prototype.mousemove = function (e) {
	          var t = p.getPointerPosition(this.el, e, this.pos);
	          this.vertical ? (this.__percent = 1 - t.y, this.thumb.style.top = 100 * this.__percent + "%") : (this.__percent = t.x, this.thumb.style.left = 100 * this.__percent + "%"), this.__percent = Number(this.__percent.toFixed(3)), this.pub({
	            type: f.Changing,
	            src: this,
	            "private": !0
	          });
	        }, t.prototype.percent = function (e) {
	          return e || 0 == e ? (this.__percent = e, void (this.vertical ? this.thumb.style.top = 100 * this.__percent + "%" : this.thumb.style.left = 100 * this.__percent + "%")) : this.__percent;
	        }, t;
	      }(c["default"]);

	      t["default"] = y;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;

	      var l = i(30),
	          c = n(l),
	          u = i(24),
	          p = n(u),
	          h = i(2),
	          d = (o(h), i(3)),
	          f = o(d),
	          y = function (e) {
	        function t(i) {
	          return r(this, t), s(this, e.call(this, i, "Timeline"));
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          return this.enabled = !this.options.live, this.createEl("div", {
	            "class": "vcp-timeline"
	          }), this.progress = new c["default"](this.player, !1), this.progress.render(this.el, this.enabled), this.track = this.progress.track, this.enabled || (this.el.style.display = "none"), e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {
	          this.enabled && (this.sub(l.MSG.Changing, this.progress, f.bind(this, this.handleMsg)), this.sub(l.MSG.Changed, this.progress, f.bind(this, this.handleMsg)));
	        }, t.prototype.handleMsg = function (e) {
	          e.type === l.MSG.Changing ? (this.scrubbing = !0, this.syncLabel(this.percent())) : e.type === l.MSG.Changed && (this.scrubbing = !1);
	        }, t.prototype.syncLabel = function (e) {
	          var t = this.player.duration();
	          e = Math.min(e, 1);
	          var i = "";
	          t && (i = f.convertTime(e * t) + " / " + f.convertTime(t)), this.pub({
	            type: "timelabel",
	            src: "timeline",
	            label: i,
	            "private": !0
	          });
	        }, t.prototype.buffered = function (e) {
	          this.enabled && (e = Math.min(e, 1), this.__buffered = e, this.track.style.width = 100 * e + "%");
	        }, t.prototype.percent = function (e) {
	          if (this.enabled) return "undefined" == typeof e ? this.progress.percent() || 0 : (e = Math.min(e, 1), this.syncLabel(e), this.__buffered < e && this.buffered(this.player.buffered()), this.progress.percent(e));
	        }, t;
	      }(p["default"]);

	      t["default"] = y;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;

	      var l = i(30),
	          c = (n(l), i(24)),
	          u = n(c),
	          p = i(2),
	          h = (o(p), i(3)),
	          d = o(h),
	          f = function (e) {
	        function t(i) {
	          return r(this, t), s(this, e.call(this, i, "Timelabel"));
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          return this.createEl("span", {
	            "class": "vcp-timelabel"
	          }), e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {
	          this.sub("timelabel", "timeline", d.bind(this, this.handleMsg));
	        }, t.prototype.handleMsg = function (e) {
	          this.el.innerHTML = e.label;
	        }, t;
	      }(u["default"]);

	      t["default"] = f;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;

	      var l = i(30),
	          c = n(l),
	          u = i(24),
	          p = n(u),
	          h = i(2),
	          d = o(h),
	          f = i(3),
	          y = o(f),
	          A = i(4),
	          v = function (e) {
	        function t(i) {
	          return r(this, t), s(this, e.call(this, i, "Volume"));
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          return this.createEl("div", {
	            "class": "vcp-volume"
	          }), this.bg = d.createEl("div", {
	            "class": "vcp-volume-bg"
	          }), this.el.appendChild(this.bg), this.volume = new c["default"](this.player, !0), this.volume.render(this.el), this.track = this.volume.track, this.icon = d.createEl("span", {
	            "class": "vcp-volume-icon"
	          }), this.el.appendChild(this.icon), e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {
	          this.sub(l.MSG.Changing, this.volume, y.bind(this, this.handleMsg)), this.sub(l.MSG.Changed, this.volume, y.bind(this, this.handleMsg)), this.sub(A.MSG.VolumeChange, this.player.video, y.bind(this, this.handleMsg)), this.on(this.icon, "click", this.toggleMute);
	        }, t.prototype.handleMsg = function (e) {
	          switch (e.type) {
	            case l.MSG.Changing:
	              this.syncTrack(this.percent());
	              break;

	            case l.MSG.Changed:
	              this.percent(this.percent());
	              break;

	            case A.MSG.VolumeChange:
	              var t = this.player.volume();
	              this.syncTrack(t), 0 == t ? this.syncMute(!0) : t > 0 && this.__muted && this.syncMute(!1);
	          }
	        }, t.prototype.toggleMute = function (e) {
	          var t = !this.player.mute();
	          this.player.mute(t);
	        }, t.prototype.syncMute = function (e) {
	          e ? d.addClass(this.el, "vcp-volume-muted") : d.removeClass(this.el, "vcp-volume-muted"), this.__muted = e;
	        }, t.prototype.syncTrack = function (e) {
	          this.track.style.height = 100 * e + "%", this.volume.percent(1 - e);
	        }, t.prototype.percent = function (e) {
	          return "undefined" == typeof e ? 1 - this.volume.percent() || 0 : (this.player.volume(e), e);
	        }, t;
	      }(p["default"]);

	      t["default"] = v;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;

	      var l = i(24),
	          c = n(l),
	          u = i(2),
	          p = o(u),
	          h = i(3),
	          d = o(h),
	          f = {
	        od: "超清",
	        hd: "高清",
	        sd: "标清"
	      },
	          y = function (e) {
	        function t(i) {
	          r(this, t);
	          var o = s(this, e.call(this, i, "ClaritySwitcher"));
	          return f = d.extend({}, i.options.clarityLabel, f), i.claritySwitcher = o, o;
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          this.show = !1, this.createEl("div", {
	            "class": "vcp-clarityswitcher"
	          }), this.current = p.createEl("a", {
	            "class": "vcp-vertical-switcher-current"
	          }), this.container = p.createEl("div", {
	            "class": "vcp-vertical-switcher-container"
	          }), this.items = [], this.currentItem = "";
	          var i = this.options.videoSource;
	          this.current.innerHTML = f[i.curDef], this.el.appendChild(this.current);

	          for (var o = 0; o < i.definitions.length; o++) {
	            var n = p.createEl("a", {
	              "class": "vcp-vertical-switcher-item"
	            });
	            n.innerHTML = f[i.definitions[o]], i.definitions[o] == i.curDef && (p.addClass(n, "current"), this.currentItem = n), n.setAttribute("data-def", i.definitions[o]), this.items.push(n), this.container.appendChild(n);
	          }

	          return this.el.appendChild(this.container), e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {
	          this.on("click", this.onClick), this.on("mouseenter", this.onMouseEnter), this.on("mouseleave", this.onMouseLeave);
	        }, t.prototype.onClick = function (e) {
	          var t = e.target.getAttribute("data-def");
	          t ? (this.current.innerHTML = f[t], p.removeClass(this.currentItem, "current"), p.addClass(e.target, "current"), this.currentItem = e.target, this.player._switchClarity(t)) : !this.show;
	        }, t.prototype.onMouseLeave = function () {
	          this.container.style.display = "none", this.show = !1;
	        }, t.prototype.onMouseEnter = function () {
	          this.container.style.display = "block", this.show = !0;
	        }, t.prototype.setClarity = function (e) {
	          e && (this.current.innerHTML = f[e], p.removeClass(document.querySelector(".vcp-vertical-switcher-item.current"), "current"), p.addClass(document.querySelector('.vcp-vertical-switcher-item[data-def="' + e + '"]'), "current"), this.currentItem = document.querySelector('.vcp-vertical-switcher-item[data-def="' + e + '"]'), this.player._switchClarity(e));
	        }, t;
	      }(c["default"]);

	      t["default"] = y;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;

	      var l = i(24),
	          c = n(l),
	          u = i(1),
	          p = o(u),
	          h = function (e) {
	        function t(i) {
	          return r(this, t), s(this, e.call(this, i, "BigPlay"));
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          return this.createEl("div", {
	            "class": "vcp-bigplay"
	          }), e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {
	          this.on("click", this.onClick);
	        }, t.prototype.onClick = function () {
	          var e = this.player.video;
	          return p.IS_MOBILE && !e.paused() ? this.player.panel && this.player.panel.toggle() : void this.player.togglePlay();
	        }, t.prototype.handleMsg = function (e) {
	          console.log("@" + this.name, e);
	        }, t;
	      }(c["default"]);

	      t["default"] = h;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;

	      var l = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
	        return _typeof(e);
	      } : function (e) {
	        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
	      },
	          c = i(24),
	          u = n(c),
	          p = i(2),
	          h = o(p),
	          d = i(3),
	          f = o(d),
	          y = i(1),
	          A = o(y),
	          v = i(4),
	          m = function (e) {
	        function t(i) {
	          r(this, t);
	          var o = s(this, e.call(this, i, "Poster"));
	          return o.options.poster && "object" == l(o.options.poster) ? o.poster = o.options.poster : "string" == typeof o.options.poster ? o.poster = {
	            src: o.options.poster
	          } : o.poster = {}, o;
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          this.createEl("div", {
	            "class": "vcp-poster"
	          }), this.hide();
	          var i = this.poster;

	          if (i) {
	            this.pic = h.createEl("img", {
	              "class": "vcp-poster-pic"
	            });
	            var o = this.poster.style;

	            switch (o) {
	              case "stretch":
	                h.addClass(this.pic, "stretch");
	                break;

	              case "cover":
	                h.addClass(this.pic, "cover");
	                break;

	              default:
	                h.addClass(this.pic, "default");
	            }

	            this.el.appendChild(this.pic);
	          }

	          return e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {
	          this.on("click", this.onClick), this.sub(v.MSG.Load, this.player.video, f.bind(this, this.handleMsg)), this.sub(v.MSG.MetaLoaded, this.player.video, f.bind(this, this.handleMsg)), this.sub(v.MSG.Play, this.player.video, f.bind(this, this.handleMsg)), this.sub(v.MSG.Pause, this.player.video, f.bind(this, this.handleMsg)), this.sub(v.MSG.Ended, this.player.video, f.bind(this, this.handleMsg)), this.sub(v.MSG.Error, this.player.video, f.bind(this, this.handleMsg));
	        }, t.prototype.onClick = function () {
	          this.pub({
	            type: "click",
	            src: this
	          }), (A.IS_SAFARI && parseInt(A.SAFARI_VERSION) > 10 || A.IOS_VERSION > 10) && "system" == this.player.options.controls && this.player.togglePlay();
	        }, t.prototype.handleMsg = function (e) {
	          switch (e.type) {
	            case v.MSG.Load:
	              this.__loaded = !1, this.setPoster(this.poster.start);
	              break;

	            case v.MSG.MetaLoaded:
	              if (this.__loaded = !0, !this.player.playing()) break;
	              this.hide();

	            case v.MSG.Play:
	              if (!this.__loaded) break;
	              this.hide();
	              break;

	            case v.MSG.Pause:
	              if (!this.__loaded) break;
	              this.options.pausePosterEnabled === !0 && this.setPoster(this.poster.pause);
	              break;

	            case v.MSG.Ended:
	              if (!this.__loaded) break;
	              break;

	            case v.MSG.Error:
	              if (!this.__loaded) break;
	          }
	        }, t.prototype.setPoster = function (e) {
	          if (e = e || this.poster.src) {
	            this.__preload && (this.__preload.onload = null), this.__preload = new Image();
	            var t = this.__preload;
	            this.hide();
	            var i = this;
	            t.onload = function () {
	              if (i.pic.src = t.src, i.show(), !f.supportStyle("transform")) {
	                var e = "stretch" == i.poster.style;
	                if (e) return;
	                var o = "cover" == i.poster.style ? i.options.width / (t.width / t.height) : t.height,
	                    n = "-" + i.options.width / 2 + "px",
	                    r = "-" + o / 2 + "px";
	                i.pic.style.cssText = "left: 50%; top: 50%; margin-left: " + n + "; margin-top: " + r + ";";
	              }
	            }, t.src = e;
	          }
	        }, t.prototype.toggle = function (e) {
	          clearTimeout(this.__tid);
	          var t = this;
	          this.__tid = setTimeout(function () {
	            t.el.style.display = e;
	          }, 100);
	        }, t.prototype.hide = function () {
	          this.__preload && (this.__preload.onload = null), this.toggle("none");
	        }, t.prototype.show = function () {
	          this.toggle("block");
	        }, t;
	      }(u["default"]);

	      t["default"] = m;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;
	      var l = i(24),
	          c = n(l),
	          u = i(2),
	          p = (o(u), i(4)),
	          h = (o(p), i(3)),
	          d = (o(h), function (e) {
	        function t(i) {
	          r(this, t);
	          var o = s(this, e.call(this, i, "Loading"));
	          return o.timeSeed = null, o;
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          return this.createEl("div", {
	            "class": "vcp-loading"
	          }), e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {}, t.prototype.handleMsg = function (e) {}, t.prototype.show = function () {
	          if (this.options.showLoading !== !1) {
	            var e = 500,
	                t = this;
	            this.timeSeed = setTimeout(function () {
	              t.el.style.display = "block";
	            }, e);
	          }
	        }, t.prototype.hide = function () {
	          this.timeSeed && (clearTimeout(this.timeSeed), this.timeSeed = null), this.el.style.display = "none";
	        }, t;
	      }(c["default"]));
	      t["default"] = d;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function r(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      function s(e, t) {
	        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
	      }

	      function a(e, t) {
	        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
	        e.prototype = Object.create(t && t.prototype, {
	          constructor: {
	            value: e,
	            enumerable: !1,
	            writable: !0,
	            configurable: !0
	          }
	        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
	      }

	      t.__esModule = !0;

	      var l = i(24),
	          c = n(l),
	          u = i(2),
	          p = (o(u), i(4)),
	          h = (o(p), i(3)),
	          d = o(h),
	          f = {
	        EnvError: "当前系统环境不支持播放该视频格式",
	        EnvFlashError: "当前系统环境不支持播放该视频格式",
	        VideoSourceError: "获取视频失败，请检查播放链接是否有效",
	        NetworkError: "网络错误，请检查网络配置或者播放链接是否正确",
	        VideoDecodeError: "视频解码错误",
	        ArgumentError: "使用参数有误，请检查播放器调用代码",
	        UrlEmpty: "请填写视频播放地址",
	        FileProtocol: "请勿在file协议下使用播放器，可能会导致视频无法播放",
	        LiveFinish: "直播已结束,请稍后再来",
	        CrossDomainError: "无法加载视频文件，跨域访问被拒绝",
	        Ie9IframeFullscreenError: "在IE9中用iframe引用的实例无法支持全屏"
	      },
	          y = {
	        FileProtocol: [10],
	        ArgumentError: [11],
	        UrlEmpty: [12],
	        LiveFinish: [13],
	        VideoSourceError: [1002, 2032],
	        EnvError: [4, 5],
	        NetworkError: [1001, 1, 2],
	        VideoDecodeError: [3],
	        CrossDomainError: [2048],
	        Ie9IframeFullscreenError: [10001]
	      },
	          A = function (e) {
	        function t(i) {
	          r(this, t);
	          var o = s(this, e.call(this, i, "ErrorTips"));
	          o.customTips = d.extend({}, f, o.options.wording);

	          for (var n in y) {
	            for (var a = 0; a < y[n].length; a++) {
	              var l = y[n][a];
	              o.customTips[l] = o.customTips[l] || o.customTips[n];
	            }
	          }

	          return o;
	        }

	        return a(t, e), t.prototype.render = function (t) {
	          return this.createEl("div", {
	            "class": "vcp-error-tips"
	          }), e.prototype.render.call(this, t);
	        }, t.prototype.setup = function () {}, t.prototype.handleMsg = function (e) {}, t.prototype.show = function (e) {
	          this.el.style.display = "block";
	          var t = void 0;
	          if ("string" == typeof e) t = e;else {
	            var i = this.customTips[e.code] || e.reason;
	            t = "[" + e.code + "]" + i;
	          }
	          this.el.innerHTML = d.escapeHTML(t);
	        }, t.prototype.hide = function () {
	          this.el.style.display = "none";
	        }, t.prototype.clear = function () {
	          this.el.innerHTML = "", this.hide();
	        }, t;
	      }(c["default"]);

	      t["default"] = A;
	    }, function (e, t, i) {

	      function o(e) {
	        if (e && e.__esModule) return e;
	        var t = {};
	        if (null != e) for (var i in e) {
	          Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
	        }
	        return t["default"] = e, t;
	      }

	      function n(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      t.__esModule = !0;

	      var r = i(1),
	          s = o(r),
	          a = i(2),
	          l = o(a),
	          c = i(3),
	          u = function () {
	        function e(t, i) {
	          n(this, e), this.player = t, this.options = i, this.load();
	        }

	        return e.prototype.load = function () {
	          l.loadScript((0, c.unifyProtocol)("//pingjs.qq.com/h5/stats.js?v2.0.4"), null, {
	            name: "MTAH5",
	            sid: "500376528",
	            cid: "500383222"
	          }, !0);
	        }, e.prototype.report = function () {
	          window.MtaH5 && (0 == this.player.duration() || this.player.duration() == 1 / 0 ? MtaH5.clickStat("live", {
	            live: "true"
	          }) : MtaH5.clickStat("vod", {
	            vod: "true"
	          }));
	        }, e.prototype.reportFlash = function () {
	          if (window.MtaH5) {
	            var e = this.options.videoSource,
	                t = (0, c.getFormat)(e),
	                i = {
	              browser: s.BROWSER_TYPE,
	              mse: !!s.IS_ENABLED_MSE,
	              format: t
	            };
	            MtaH5.clickStat("flash", i);
	          }
	        }, e;
	      }();

	      t["default"] = u;
	    }]);
	  });
	});
	unwrapExports(TcPlayerModule2_3_2);
	var TcPlayerModule2_3_2_1 = TcPlayerModule2_3_2.TcPlayer;

	var timJs = createCommonjsModule(function (module, exports) {
	!function(e,t){module.exports=t();}(commonjsGlobal,(function(){var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:{};function t(e,t){return e(t={exports:{}},t.exports),t.exports}var n=function(e){return e&&e.Math==Math&&e},r=n("object"==typeof globalThis&&globalThis)||n("object"==typeof window&&window)||n("object"==typeof self&&self)||n("object"==typeof e&&e)||Function("return this")(),o=function(e){try{return !!e()}catch(t){return !0}},i=!o((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),s={}.propertyIsEnumerable,a=Object.getOwnPropertyDescriptor,u={f:a&&!s.call({1:2},1)?function(e){var t=a(this,e);return !!t&&t.enumerable}:s},c=function(e,t){return {enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},l={}.toString,p=function(e){return l.call(e).slice(8,-1)},f="".split,h=o((function(){return !Object("z").propertyIsEnumerable(0)}))?function(e){return "String"==p(e)?f.call(e,""):Object(e)}:Object,d=function(e){if(null==e)throw TypeError("Can't call method on "+e);return e},g=function(e){return h(d(e))},m=function(e){return "object"==typeof e?null!==e:"function"==typeof e},v=function(e,t){if(!m(e))return e;var n,r;if(t&&"function"==typeof(n=e.toString)&&!m(r=n.call(e)))return r;if("function"==typeof(n=e.valueOf)&&!m(r=n.call(e)))return r;if(!t&&"function"==typeof(n=e.toString)&&!m(r=n.call(e)))return r;throw TypeError("Can't convert object to primitive value")},y={}.hasOwnProperty,_=function(e,t){return y.call(e,t)},C=r.document,I=m(C)&&m(C.createElement),M=function(e){return I?C.createElement(e):{}},S=!i&&!o((function(){return 7!=Object.defineProperty(M("div"),"a",{get:function(){return 7}}).a})),T=Object.getOwnPropertyDescriptor,E={f:i?T:function(e,t){if(e=g(e),t=v(t,!0),S)try{return T(e,t)}catch(n){}if(_(e,t))return c(!u.f.call(e,t),e[t])}},D=function(e){if(!m(e))throw TypeError(String(e)+" is not an object");return e},k=Object.defineProperty,w={f:i?k:function(e,t,n){if(D(e),t=v(t,!0),D(n),S)try{return k(e,t,n)}catch(r){}if("get"in n||"set"in n)throw TypeError("Accessors not supported");return "value"in n&&(e[t]=n.value),e}},A=i?function(e,t,n){return w.f(e,t,c(1,n))}:function(e,t,n){return e[t]=n,e},b=function(e,t){try{A(r,e,t);}catch(n){r[e]=t;}return t},R=r["__core-js_shared__"]||b("__core-js_shared__",{}),O=Function.toString;"function"!=typeof R.inspectSource&&(R.inspectSource=function(e){return O.call(e)});var L,N,P,G=R.inspectSource,x=r.WeakMap,U="function"==typeof x&&/native code/.test(G(x)),q=t((function(e){(e.exports=function(e,t){return R[e]||(R[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.6.4",mode:"global",copyright:"© 2020 Denis Pushkarev (zloirock.ru)"});})),F=0,j=Math.random(),B=function(e){return "Symbol("+String(void 0===e?"":e)+")_"+(++F+j).toString(36)},H=q("keys"),V=function(e){return H[e]||(H[e]=B(e))},K={},$=r.WeakMap;if(U){var Y=new $,z=Y.get,W=Y.has,X=Y.set;L=function(e,t){return X.call(Y,e,t),t},N=function(e){return z.call(Y,e)||{}},P=function(e){return W.call(Y,e)};}else {var J=V("state");K[J]=!0,L=function(e,t){return A(e,J,t),t},N=function(e){return _(e,J)?e[J]:{}},P=function(e){return _(e,J)};}var Q={set:L,get:N,has:P,enforce:function(e){return P(e)?N(e):L(e,{})},getterFor:function(e){return function(t){var n;if(!m(t)||(n=N(t)).type!==e)throw TypeError("Incompatible receiver, "+e+" required");return n}}},Z=t((function(e){var t=Q.get,n=Q.enforce,o=String(String).split("String");(e.exports=function(e,t,i,s){var a=!!s&&!!s.unsafe,u=!!s&&!!s.enumerable,c=!!s&&!!s.noTargetGet;"function"==typeof i&&("string"!=typeof t||_(i,"name")||A(i,"name",t),n(i).source=o.join("string"==typeof t?t:"")),e!==r?(a?!c&&e[t]&&(u=!0):delete e[t],u?e[t]=i:A(e,t,i)):u?e[t]=i:b(t,i);})(Function.prototype,"toString",(function(){return "function"==typeof this&&t(this).source||G(this)}));})),ee=r,te=function(e){return "function"==typeof e?e:void 0},ne=function(e,t){return arguments.length<2?te(ee[e])||te(r[e]):ee[e]&&ee[e][t]||r[e]&&r[e][t]},re=Math.ceil,oe=Math.floor,ie=function(e){return isNaN(e=+e)?0:(e>0?oe:re)(e)},se=Math.min,ae=function(e){return e>0?se(ie(e),9007199254740991):0},ue=Math.max,ce=Math.min,le=function(e,t){var n=ie(e);return n<0?ue(n+t,0):ce(n,t)},pe=function(e){return function(t,n,r){var o,i=g(t),s=ae(i.length),a=le(r,s);if(e&&n!=n){for(;s>a;)if((o=i[a++])!=o)return !0}else for(;s>a;a++)if((e||a in i)&&i[a]===n)return e||a||0;return !e&&-1}},fe={includes:pe(!0),indexOf:pe(!1)},he=fe.indexOf,de=function(e,t){var n,r=g(e),o=0,i=[];for(n in r)!_(K,n)&&_(r,n)&&i.push(n);for(;t.length>o;)_(r,n=t[o++])&&(~he(i,n)||i.push(n));return i},ge=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],me=ge.concat("length","prototype"),ve={f:Object.getOwnPropertyNames||function(e){return de(e,me)}},ye={f:Object.getOwnPropertySymbols},_e=ne("Reflect","ownKeys")||function(e){var t=ve.f(D(e)),n=ye.f;return n?t.concat(n(e)):t},Ce=function(e,t){for(var n=_e(t),r=w.f,o=E.f,i=0;i<n.length;i++){var s=n[i];_(e,s)||r(e,s,o(t,s));}},Ie=/#|\.prototype\./,Me=function(e,t){var n=Te[Se(e)];return n==De||n!=Ee&&("function"==typeof t?o(t):!!t)},Se=Me.normalize=function(e){return String(e).replace(Ie,".").toLowerCase()},Te=Me.data={},Ee=Me.NATIVE="N",De=Me.POLYFILL="P",ke=Me,we=E.f,Ae=function(e,t){var n,o,i,s,a,u=e.target,c=e.global,l=e.stat;if(n=c?r:l?r[u]||b(u,{}):(r[u]||{}).prototype)for(o in t){if(s=t[o],i=e.noTargetGet?(a=we(n,o))&&a.value:n[o],!ke(c?o:u+(l?".":"#")+o,e.forced)&&void 0!==i){if(typeof s==typeof i)continue;Ce(s,i);}(e.sham||i&&i.sham)&&A(s,"sham",!0),Z(n,o,s,e);}},be=function(e){if("function"!=typeof e)throw TypeError(String(e)+" is not a function");return e},Re=function(e,t,n){if(be(e),void 0===t)return e;switch(n){case 0:return function(){return e.call(t)};case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,o){return e.call(t,n,r,o)}}return function(){return e.apply(t,arguments)}},Oe=function(e){return Object(d(e))},Le=Array.isArray||function(e){return "Array"==p(e)},Ne=!!Object.getOwnPropertySymbols&&!o((function(){return !String(Symbol())})),Pe=Ne&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,Ge=q("wks"),xe=r.Symbol,Ue=Pe?xe:xe&&xe.withoutSetter||B,qe=function(e){return _(Ge,e)||(Ne&&_(xe,e)?Ge[e]=xe[e]:Ge[e]=Ue("Symbol."+e)),Ge[e]},Fe=qe("species"),je=function(e,t){var n;return Le(e)&&("function"!=typeof(n=e.constructor)||n!==Array&&!Le(n.prototype)?m(n)&&null===(n=n[Fe])&&(n=void 0):n=void 0),new(void 0===n?Array:n)(0===t?0:t)},Be=[].push,He=function(e){var t=1==e,n=2==e,r=3==e,o=4==e,i=6==e,s=5==e||i;return function(a,u,c,l){for(var p,f,d=Oe(a),g=h(d),m=Re(u,c,3),v=ae(g.length),y=0,_=l||je,C=t?_(a,v):n?_(a,0):void 0;v>y;y++)if((s||y in g)&&(f=m(p=g[y],y,d),e))if(t)C[y]=f;else if(f)switch(e){case 3:return !0;case 5:return p;case 6:return y;case 2:Be.call(C,p);}else if(o)return !1;return i?-1:r||o?o:C}},Ve={forEach:He(0),map:He(1),filter:He(2),some:He(3),every:He(4),find:He(5),findIndex:He(6)},Ke=function(e,t){var n=[][e];return !!n&&o((function(){n.call(null,t||function(){throw 1},1);}))},$e=Object.defineProperty,Ye={},ze=function(e){throw e},We=function(e,t){if(_(Ye,e))return Ye[e];t||(t={});var n=[][e],r=!!_(t,"ACCESSORS")&&t.ACCESSORS,s=_(t,0)?t[0]:ze,a=_(t,1)?t[1]:void 0;return Ye[e]=!!n&&!o((function(){if(r&&!i)return !0;var e={length:-1};r?$e(e,1,{enumerable:!0,get:ze}):e[1]=1,n.call(e,s,a);}))},Xe=Ve.forEach,Je=Ke("forEach"),Qe=We("forEach"),Ze=Je&&Qe?[].forEach:function(e){return Xe(this,e,arguments.length>1?arguments[1]:void 0)};Ae({target:"Array",proto:!0,forced:[].forEach!=Ze},{forEach:Ze});var et=function(e,t,n,r){try{return r?t(D(n)[0],n[1]):t(n)}catch(i){var o=e.return;throw void 0!==o&&D(o.call(e)),i}},tt={},nt=qe("iterator"),rt=Array.prototype,ot=function(e){return void 0!==e&&(tt.Array===e||rt[nt]===e)},it=function(e,t,n){var r=v(t);r in e?w.f(e,r,c(0,n)):e[r]=n;},st={};st[qe("toStringTag")]="z";var at="[object z]"===String(st),ut=qe("toStringTag"),ct="Arguments"==p(function(){return arguments}()),lt=at?p:function(e){var t,n,r;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=function(e,t){try{return e[t]}catch(n){}}(t=Object(e),ut))?n:ct?p(t):"Object"==(r=p(t))&&"function"==typeof t.callee?"Arguments":r},pt=qe("iterator"),ft=function(e){if(null!=e)return e[pt]||e["@@iterator"]||tt[lt(e)]},ht=function(e){var t,n,r,o,i,s,a=Oe(e),u="function"==typeof this?this:Array,c=arguments.length,l=c>1?arguments[1]:void 0,p=void 0!==l,f=ft(a),h=0;if(p&&(l=Re(l,c>2?arguments[2]:void 0,2)),null==f||u==Array&&ot(f))for(n=new u(t=ae(a.length));t>h;h++)s=p?l(a[h],h):a[h],it(n,h,s);else for(i=(o=f.call(a)).next,n=new u;!(r=i.call(o)).done;h++)s=p?et(o,l,[r.value,h],!0):r.value,it(n,h,s);return n.length=h,n},dt=qe("iterator"),gt=!1;try{var mt=0,vt={next:function(){return {done:!!mt++}},return:function(){gt=!0;}};vt[dt]=function(){return this},Array.from(vt,(function(){throw 2}));}catch(mC){}var yt=function(e,t){if(!t&&!gt)return !1;var n=!1;try{var r={};r[dt]=function(){return {next:function(){return {done:n=!0}}}},e(r);}catch(mC){}return n},_t=!yt((function(e){Array.from(e);}));Ae({target:"Array",stat:!0,forced:_t},{from:ht});var Ct,It=Object.keys||function(e){return de(e,ge)},Mt=i?Object.defineProperties:function(e,t){D(e);for(var n,r=It(t),o=r.length,i=0;o>i;)w.f(e,n=r[i++],t[n]);return e},St=ne("document","documentElement"),Tt=V("IE_PROTO"),Et=function(){},Dt=function(e){return "<script>"+e+"<\/script>"},kt=function(){try{Ct=document.domain&&new ActiveXObject("htmlfile");}catch(mC){}var e,t;kt=Ct?function(e){e.write(Dt("")),e.close();var t=e.parentWindow.Object;return e=null,t}(Ct):((t=M("iframe")).style.display="none",St.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(Dt("document.F=Object")),e.close(),e.F);for(var n=ge.length;n--;)delete kt.prototype[ge[n]];return kt()};K[Tt]=!0;var wt=Object.create||function(e,t){var n;return null!==e?(Et.prototype=D(e),n=new Et,Et.prototype=null,n[Tt]=e):n=kt(),void 0===t?n:Mt(n,t)};Ae({target:"Object",stat:!0,sham:!i},{create:wt});var At=o((function(){It(1);}));Ae({target:"Object",stat:!0,forced:At},{keys:function(e){return It(Oe(e))}});var bt,Rt,Ot,Lt=function(e){return function(t,n){var r,o,i=String(d(t)),s=ie(n),a=i.length;return s<0||s>=a?e?"":void 0:(r=i.charCodeAt(s))<55296||r>56319||s+1===a||(o=i.charCodeAt(s+1))<56320||o>57343?e?i.charAt(s):r:e?i.slice(s,s+2):o-56320+(r-55296<<10)+65536}},Nt={codeAt:Lt(!1),charAt:Lt(!0)},Pt=!o((function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype})),Gt=V("IE_PROTO"),xt=Object.prototype,Ut=Pt?Object.getPrototypeOf:function(e){return e=Oe(e),_(e,Gt)?e[Gt]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?xt:null},qt=qe("iterator"),Ft=!1;[].keys&&("next"in(Ot=[].keys())?(Rt=Ut(Ut(Ot)))!==Object.prototype&&(bt=Rt):Ft=!0),null==bt&&(bt={}),_(bt,qt)||A(bt,qt,(function(){return this}));var jt={IteratorPrototype:bt,BUGGY_SAFARI_ITERATORS:Ft},Bt=w.f,Ht=qe("toStringTag"),Vt=function(e,t,n){e&&!_(e=n?e:e.prototype,Ht)&&Bt(e,Ht,{configurable:!0,value:t});},Kt=jt.IteratorPrototype,$t=function(){return this},Yt=function(e,t,n){var r=t+" Iterator";return e.prototype=wt(Kt,{next:c(1,n)}),Vt(e,r,!1),tt[r]=$t,e},zt=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,n={};try{(e=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(n,[]),t=n instanceof Array;}catch(mC){}return function(n,r){return D(n),function(e){if(!m(e)&&null!==e)throw TypeError("Can't set "+String(e)+" as a prototype")}(r),t?e.call(n,r):n.__proto__=r,n}}():void 0),Wt=jt.IteratorPrototype,Xt=jt.BUGGY_SAFARI_ITERATORS,Jt=qe("iterator"),Qt=function(){return this},Zt=function(e,t,n,r,o,i,s){Yt(n,t,r);var a,u,c,l=function(e){if(e===o&&g)return g;if(!Xt&&e in h)return h[e];switch(e){case"keys":case"values":case"entries":return function(){return new n(this,e)}}return function(){return new n(this)}},p=t+" Iterator",f=!1,h=e.prototype,d=h[Jt]||h["@@iterator"]||o&&h[o],g=!Xt&&d||l(o),m="Array"==t&&h.entries||d;if(m&&(a=Ut(m.call(new e)),Wt!==Object.prototype&&a.next&&(Ut(a)!==Wt&&(zt?zt(a,Wt):"function"!=typeof a[Jt]&&A(a,Jt,Qt)),Vt(a,p,!0))),"values"==o&&d&&"values"!==d.name&&(f=!0,g=function(){return d.call(this)}),h[Jt]!==g&&A(h,Jt,g),tt[t]=g,o)if(u={values:l("values"),keys:i?g:l("keys"),entries:l("entries")},s)for(c in u)(Xt||f||!(c in h))&&Z(h,c,u[c]);else Ae({target:t,proto:!0,forced:Xt||f},u);return u},en=Nt.charAt,tn=Q.set,nn=Q.getterFor("String Iterator");Zt(String,"String",(function(e){tn(this,{type:"String Iterator",string:String(e),index:0});}),(function(){var e,t=nn(this),n=t.string,r=t.index;return r>=n.length?{value:void 0,done:!0}:(e=en(n,r),t.index+=e.length,{value:e,done:!1})}));var rn={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0};for(var on in rn){var sn=r[on],an=sn&&sn.prototype;if(an&&an.forEach!==Ze)try{A(an,"forEach",Ze);}catch(mC){an.forEach=Ze;}}var un,cn,ln={SDK_READY:"sdkStateReady",SDK_NOT_READY:"sdkStateNotReady",SDK_DESTROY:"sdkDestroy",MESSAGE_RECEIVED:"onMessageReceived",MESSAGE_REVOKED:"onMessageRevoked",CONVERSATION_LIST_UPDATED:"onConversationListUpdated",GROUP_LIST_UPDATED:"onGroupListUpdated",GROUP_SYSTEM_NOTICE_RECEIVED:"receiveGroupSystemNotice",PROFILE_UPDATED:"onProfileUpdated",BLACKLIST_UPDATED:"blacklistUpdated",KICKED_OUT:"kickedOut",ERROR:"error",NET_STATE_CHANGE:"netStateChange"},pn={MSG_TEXT:"TIMTextElem",MSG_IMAGE:"TIMImageElem",MSG_SOUND:"TIMSoundElem",MSG_AUDIO:"TIMSoundElem",MSG_FILE:"TIMFileElem",MSG_FACE:"TIMFaceElem",MSG_VIDEO:"TIMVideoFileElem",MSG_GEO:"TIMLocationElem",MSG_GRP_TIP:"TIMGroupTipElem",MSG_GRP_SYS_NOTICE:"TIMGroupSystemNoticeElem",MSG_CUSTOM:"TIMCustomElem",MSG_PRIORITY_HIGH:"High",MSG_PRIORITY_NORMAL:"Normal",MSG_PRIORITY_LOW:"Low",MSG_PRIORITY_LOWEST:"Lowest",CONV_C2C:"C2C",CONV_GROUP:"GROUP",CONV_SYSTEM:"@TIM#SYSTEM",GRP_PRIVATE:"Private",GRP_PUBLIC:"Public",GRP_CHATROOM:"ChatRoom",GRP_AVCHATROOM:"AVChatRoom",GRP_MBR_ROLE_OWNER:"Owner",GRP_MBR_ROLE_ADMIN:"Admin",GRP_MBR_ROLE_MEMBER:"Member",GRP_TIP_MBR_JOIN:1,GRP_TIP_MBR_QUIT:2,GRP_TIP_MBR_KICKED_OUT:3,GRP_TIP_MBR_SET_ADMIN:4,GRP_TIP_MBR_CANCELED_ADMIN:5,GRP_TIP_GRP_PROFILE_UPDATED:6,GRP_TIP_MBR_PROFILE_UPDATED:7,MSG_REMIND_ACPT_AND_NOTE:"AcceptAndNotify",MSG_REMIND_ACPT_NOT_NOTE:"AcceptNotNotify",MSG_REMIND_DISCARD:"Discard",GENDER_UNKNOWN:"Gender_Type_Unknown",GENDER_FEMALE:"Gender_Type_Female",GENDER_MALE:"Gender_Type_Male",KICKED_OUT_MULT_ACCOUNT:"multipleAccount",KICKED_OUT_MULT_DEVICE:"multipleDevice",KICKED_OUT_USERSIG_EXPIRED:"userSigExpired",ALLOW_TYPE_ALLOW_ANY:"AllowType_Type_AllowAny",ALLOW_TYPE_NEED_CONFIRM:"AllowType_Type_NeedConfirm",ALLOW_TYPE_DENY_ANY:"AllowType_Type_DenyAny",FORBID_TYPE_NONE:"AdminForbid_Type_None",FORBID_TYPE_SEND_OUT:"AdminForbid_Type_SendOut",JOIN_OPTIONS_FREE_ACCESS:"FreeAccess",JOIN_OPTIONS_NEED_PERMISSION:"NeedPermission",JOIN_OPTIONS_DISABLE_APPLY:"DisableApply",JOIN_STATUS_SUCCESS:"JoinedSuccess",JOIN_STATUS_ALREADY_IN_GROUP:"AlreadyInGroup",JOIN_STATUS_WAIT_APPROVAL:"WaitAdminApproval",GRP_PROFILE_OWNER_ID:"ownerID",GRP_PROFILE_CREATE_TIME:"createTime",GRP_PROFILE_LAST_INFO_TIME:"lastInfoTime",GRP_PROFILE_MEMBER_NUM:"memberNum",GRP_PROFILE_MAX_MEMBER_NUM:"maxMemberNum",GRP_PROFILE_JOIN_OPTION:"joinOption",GRP_PROFILE_INTRODUCTION:"introduction",GRP_PROFILE_NOTIFICATION:"notification",GRP_PROFILE_MUTE_ALL_MBRS:"muteAllMembers",NET_STATE_CONNECTED:"connected",NET_STATE_CONNECTING:"connecting",NET_STATE_DISCONNECTED:"disconnected"},fn=ne("navigator","userAgent")||"",hn=r.process,dn=hn&&hn.versions,gn=dn&&dn.v8;gn?cn=(un=gn.split("."))[0]+un[1]:fn&&(!(un=fn.match(/Edge\/(\d+)/))||un[1]>=74)&&(un=fn.match(/Chrome\/(\d+)/))&&(cn=un[1]);var mn=cn&&+cn,vn=qe("species"),yn=function(e){return mn>=51||!o((function(){var t=[];return (t.constructor={})[vn]=function(){return {foo:1}},1!==t[e](Boolean).foo}))},_n=Ve.map,Cn=yn("map"),In=We("map");Ae({target:"Array",proto:!0,forced:!Cn||!In},{map:function(e){return _n(this,e,arguments.length>1?arguments[1]:void 0)}});var Mn=[].slice,Sn={},Tn=function(e,t,n){if(!(t in Sn)){for(var r=[],o=0;o<t;o++)r[o]="a["+o+"]";Sn[t]=Function("C,a","return new C("+r.join(",")+")");}return Sn[t](e,n)},En=Function.bind||function(e){var t=be(this),n=Mn.call(arguments,1),r=function(){var o=n.concat(Mn.call(arguments));return this instanceof r?Tn(t,o.length,o):t.apply(e,o)};return m(t.prototype)&&(r.prototype=t.prototype),r};function Dn(e){return (Dn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function kn(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function wn(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}function An(e,t,n){return t&&wn(e.prototype,t),n&&wn(e,n),e}function bn(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Rn(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r);}return n}function On(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Rn(Object(n),!0).forEach((function(t){bn(e,t,n[t]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Rn(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t));}));}return e}function Ln(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Pn(e,t);}function Nn(e){return (Nn=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Pn(e,t){return (Pn=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Gn(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return !1}}function xn(e,t,n){return (xn=Gn()?Reflect.construct:function(e,t,n){var r=[null];r.push.apply(r,t);var o=new(Function.bind.apply(e,r));return n&&Pn(o,n.prototype),o}).apply(null,arguments)}function Un(e){var t="function"==typeof Map?new Map:void 0;return (Un=function(e){if(null===e||(n=e,-1===Function.toString.call(n).indexOf("[native code]")))return e;var n;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,r);}function r(){return xn(e,arguments,Nn(this).constructor)}return r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),Pn(r,e)})(e)}function qn(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Fn(e,t){return !t||"object"!=typeof t&&"function"!=typeof t?qn(e):t}function jn(e){return function(){var t,n=Nn(e);if(Gn()){var r=Nn(this).constructor;t=Reflect.construct(n,arguments,r);}else t=n.apply(this,arguments);return Fn(this,t)}}function Bn(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var s,a=e[Symbol.iterator]();!(r=(s=a.next()).done)&&(n.push(s.value),!t||n.length!==t);r=!0);}catch(u){o=!0,i=u;}finally{try{r||null==a.return||a.return();}finally{if(o)throw i}}return n}(e,t)||Vn(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Hn(e){return function(e){if(Array.isArray(e))return Kn(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Vn(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Vn(e,t){if(e){if("string"==typeof e)return Kn(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return "Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Kn(e,t):void 0}}function Kn(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function $n(e){if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=Vn(e))){var t=0,n=function(){};return {s:n,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,o,i=!0,s=!1;return {s:function(){r=e[Symbol.iterator]();},n:function(){var e=r.next();return i=e.done,e},e:function(e){s=!0,o=e;},f:function(){try{i||null==r.return||r.return();}finally{if(s)throw o}}}}Ae({target:"Function",proto:!0},{bind:En});var Yn=function(){function e(){kn(this,e),this.cache=[],this.options=null;}return An(e,[{key:"use",value:function(e){if("function"!=typeof e)throw "middleware must be a function";return this.cache.push(e),this}},{key:"next",value:function(e){if(this.middlewares&&this.middlewares.length>0)return this.middlewares.shift().call(this,this.options,this.next.bind(this))}},{key:"run",value:function(e){return this.middlewares=this.cache.map((function(e){return e})),this.options=e,this.next()}}]),e}(),zn=qe("isConcatSpreadable"),Wn=mn>=51||!o((function(){var e=[];return e[zn]=!1,e.concat()[0]!==e})),Xn=yn("concat"),Jn=function(e){if(!m(e))return !1;var t=e[zn];return void 0!==t?!!t:Le(e)};Ae({target:"Array",proto:!0,forced:!Wn||!Xn},{concat:function(e){var t,n,r,o,i,s=Oe(this),a=je(s,0),u=0;for(t=-1,r=arguments.length;t<r;t++)if(i=-1===t?s:arguments[t],Jn(i)){if(u+(o=ae(i.length))>9007199254740991)throw TypeError("Maximum allowed index exceeded");for(n=0;n<o;n++,u++)n in i&&it(a,u,i[n]);}else {if(u>=9007199254740991)throw TypeError("Maximum allowed index exceeded");it(a,u++,i);}return a.length=u,a}});var Qn=w.f,Zn=Function.prototype,er=Zn.toString,tr=/^\s*function ([^ (]*)/;i&&!("name"in Zn)&&Qn(Zn,"name",{configurable:!0,get:function(){try{return er.call(this).match(tr)[1]}catch(mC){return ""}}});var nr=t((function(t,n){var r,o,i,s,a,u,c,l,p,f,h,d,g,m,v,y,_,C;t.exports=(r="function"==typeof Promise,o="object"==typeof self?self:e,i="undefined"!=typeof Symbol,s="undefined"!=typeof Map,a="undefined"!=typeof Set,u="undefined"!=typeof WeakMap,c="undefined"!=typeof WeakSet,l="undefined"!=typeof DataView,p=i&&void 0!==Symbol.iterator,f=i&&void 0!==Symbol.toStringTag,h=a&&"function"==typeof Set.prototype.entries,d=s&&"function"==typeof Map.prototype.entries,g=h&&Object.getPrototypeOf((new Set).entries()),m=d&&Object.getPrototypeOf((new Map).entries()),v=p&&"function"==typeof Array.prototype[Symbol.iterator],y=v&&Object.getPrototypeOf([][Symbol.iterator]()),_=p&&"function"==typeof String.prototype[Symbol.iterator],C=_&&Object.getPrototypeOf(""[Symbol.iterator]()),function(e){var t=typeof e;if("object"!==t)return t;if(null===e)return "null";if(e===o)return "global";if(Array.isArray(e)&&(!1===f||!(Symbol.toStringTag in e)))return "Array";if("object"==typeof window&&null!==window){if("object"==typeof window.location&&e===window.location)return "Location";if("object"==typeof window.document&&e===window.document)return "Document";if("object"==typeof window.navigator){if("object"==typeof window.navigator.mimeTypes&&e===window.navigator.mimeTypes)return "MimeTypeArray";if("object"==typeof window.navigator.plugins&&e===window.navigator.plugins)return "PluginArray"}if(("function"==typeof window.HTMLElement||"object"==typeof window.HTMLElement)&&e instanceof window.HTMLElement){if("BLOCKQUOTE"===e.tagName)return "HTMLQuoteElement";if("TD"===e.tagName)return "HTMLTableDataCellElement";if("TH"===e.tagName)return "HTMLTableHeaderCellElement"}}var n=f&&e[Symbol.toStringTag];if("string"==typeof n)return n;var i=Object.getPrototypeOf(e);return i===RegExp.prototype?"RegExp":i===Date.prototype?"Date":r&&i===Promise.prototype?"Promise":a&&i===Set.prototype?"Set":s&&i===Map.prototype?"Map":c&&i===WeakSet.prototype?"WeakSet":u&&i===WeakMap.prototype?"WeakMap":l&&i===DataView.prototype?"DataView":s&&i===m?"Map Iterator":a&&i===g?"Set Iterator":v&&i===y?"Array Iterator":_&&i===C?"String Iterator":null===i?"Object":Object.prototype.toString.call(e).slice(8,-1)});}));Ae({target:"Array",stat:!0},{isArray:Le});var rr=qe("unscopables"),or=Array.prototype;null==or[rr]&&w.f(or,rr,{configurable:!0,value:wt(null)});var ir=function(e){or[rr][e]=!0;},sr=Ve.find,ar=!0,ur=We("find");"find"in[]&&Array(1).find((function(){ar=!1;})),Ae({target:"Array",proto:!0,forced:ar||!ur},{find:function(e){return sr(this,e,arguments.length>1?arguments[1]:void 0)}}),ir("find");var cr=fe.includes,lr=We("indexOf",{ACCESSORS:!0,1:0});Ae({target:"Array",proto:!0,forced:!lr},{includes:function(e){return cr(this,e,arguments.length>1?arguments[1]:void 0)}}),ir("includes");var pr=fe.indexOf,fr=[].indexOf,hr=!!fr&&1/[1].indexOf(1,-0)<0,dr=Ke("indexOf"),gr=We("indexOf",{ACCESSORS:!0,1:0});Ae({target:"Array",proto:!0,forced:hr||!dr||!gr},{indexOf:function(e){return hr?fr.apply(this,arguments)||0:pr(this,e,arguments.length>1?arguments[1]:void 0)}});var mr=Q.set,vr=Q.getterFor("Array Iterator"),yr=Zt(Array,"Array",(function(e,t){mr(this,{type:"Array Iterator",target:g(e),index:0,kind:t});}),(function(){var e=vr(this),t=e.target,n=e.kind,r=e.index++;return !t||r>=t.length?(e.target=void 0,{value:void 0,done:!0}):"keys"==n?{value:r,done:!1}:"values"==n?{value:t[r],done:!1}:{value:[r,t[r]],done:!1}}),"values");tt.Arguments=tt.Array,ir("keys"),ir("values"),ir("entries");var _r=[].join,Cr=h!=Object,Ir=Ke("join",",");Ae({target:"Array",proto:!0,forced:Cr||!Ir},{join:function(e){return _r.call(g(this),void 0===e?",":e)}});var Mr=yn("slice"),Sr=We("slice",{ACCESSORS:!0,0:0,1:2}),Tr=qe("species"),Er=[].slice,Dr=Math.max;Ae({target:"Array",proto:!0,forced:!Mr||!Sr},{slice:function(e,t){var n,r,o,i=g(this),s=ae(i.length),a=le(e,s),u=le(void 0===t?s:t,s);if(Le(i)&&("function"!=typeof(n=i.constructor)||n!==Array&&!Le(n.prototype)?m(n)&&null===(n=n[Tr])&&(n=void 0):n=void 0,n===Array||void 0===n))return Er.call(i,a,u);for(r=new(void 0===n?Array:n)(Dr(u-a,0)),o=0;a<u;a++,o++)a in i&&it(r,o,i[a]);return r.length=o,r}}),Ae({target:"Date",stat:!0},{now:function(){return (new Date).getTime()}});var kr="".repeat||function(e){var t=String(d(this)),n="",r=ie(e);if(r<0||Infinity==r)throw RangeError("Wrong number of repetitions");for(;r>0;(r>>>=1)&&(t+=t))1&r&&(n+=t);return n},wr=Math.ceil,Ar=function(e){return function(t,n,r){var o,i,s=String(d(t)),a=s.length,u=void 0===r?" ":String(r),c=ae(n);return c<=a||""==u?s:(o=c-a,(i=kr.call(u,wr(o/u.length))).length>o&&(i=i.slice(0,o)),e?s+i:i+s)}},br={start:Ar(!1),end:Ar(!0)}.start,Rr=Math.abs,Or=Date.prototype,Lr=Or.getTime,Nr=Or.toISOString,Pr=o((function(){return "0385-07-25T07:06:39.999Z"!=Nr.call(new Date(-50000000000001))}))||!o((function(){Nr.call(new Date(NaN));}))?function(){if(!isFinite(Lr.call(this)))throw RangeError("Invalid time value");var e=this.getUTCFullYear(),t=this.getUTCMilliseconds(),n=e<0?"-":e>9999?"+":"";return n+br(Rr(e),n?6:4,0)+"-"+br(this.getUTCMonth()+1,2,0)+"-"+br(this.getUTCDate(),2,0)+"T"+br(this.getUTCHours(),2,0)+":"+br(this.getUTCMinutes(),2,0)+":"+br(this.getUTCSeconds(),2,0)+"."+br(t,3,0)+"Z"}:Nr;Ae({target:"Date",proto:!0,forced:Date.prototype.toISOString!==Pr},{toISOString:Pr});var Gr=Date.prototype,xr=Gr.toString,Ur=Gr.getTime;new Date(NaN)+""!="Invalid Date"&&Z(Gr,"toString",(function(){var e=Ur.call(this);return e==e?xr.call(this):"Invalid Date"}));var qr=function(e,t,n){var r,o;return zt&&"function"==typeof(r=t.constructor)&&r!==n&&m(o=r.prototype)&&o!==n.prototype&&zt(e,o),e},Fr="\t\n\v\f\r                　\u2028\u2029\ufeff",jr="["+Fr+"]",Br=RegExp("^"+jr+jr+"*"),Hr=RegExp(jr+jr+"*$"),Vr=function(e){return function(t){var n=String(d(t));return 1&e&&(n=n.replace(Br,"")),2&e&&(n=n.replace(Hr,"")),n}},Kr={start:Vr(1),end:Vr(2),trim:Vr(3)},$r=ve.f,Yr=E.f,zr=w.f,Wr=Kr.trim,Xr=r.Number,Jr=Xr.prototype,Qr="Number"==p(wt(Jr)),Zr=function(e){var t,n,r,o,i,s,a,u,c=v(e,!1);if("string"==typeof c&&c.length>2)if(43===(t=(c=Wr(c)).charCodeAt(0))||45===t){if(88===(n=c.charCodeAt(2))||120===n)return NaN}else if(48===t){switch(c.charCodeAt(1)){case 66:case 98:r=2,o=49;break;case 79:case 111:r=8,o=55;break;default:return +c}for(s=(i=c.slice(2)).length,a=0;a<s;a++)if((u=i.charCodeAt(a))<48||u>o)return NaN;return parseInt(i,r)}return +c};if(ke("Number",!Xr(" 0o1")||!Xr("0b1")||Xr("+0x1"))){for(var eo,to=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof to&&(Qr?o((function(){Jr.valueOf.call(n);})):"Number"!=p(n))?qr(new Xr(Zr(t)),n,to):Zr(t)},no=i?$r(Xr):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),ro=0;no.length>ro;ro++)_(Xr,eo=no[ro])&&!_(to,eo)&&zr(to,eo,Yr(Xr,eo));to.prototype=Jr,Jr.constructor=to,Z(r,"Number",to);}var oo=ve.f,io={}.toString,so="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],ao={f:function(e){return so&&"[object Window]"==io.call(e)?function(e){try{return oo(e)}catch(mC){return so.slice()}}(e):oo(g(e))}},uo=ao.f,co=o((function(){return !Object.getOwnPropertyNames(1)}));Ae({target:"Object",stat:!0,forced:co},{getOwnPropertyNames:uo});var lo=o((function(){Ut(1);}));Ae({target:"Object",stat:!0,forced:lo,sham:!Pt},{getPrototypeOf:function(e){return Ut(Oe(e))}});var po=at?{}.toString:function(){return "[object "+lt(this)+"]"};at||Z(Object.prototype,"toString",po,{unsafe:!0});var fo=Kr.trim,ho=r.parseInt,go=/^[+-]?0[Xx]/,mo=8!==ho(Fr+"08")||22!==ho(Fr+"0x16")?function(e,t){var n=fo(String(e));return ho(n,t>>>0||(go.test(n)?16:10))}:ho;Ae({global:!0,forced:parseInt!=mo},{parseInt:mo});var vo,yo,_o,Co=r.Promise,Io=function(e,t,n){for(var r in t)Z(e,r,t[r],n);return e},Mo=qe("species"),So=function(e){var t=ne(e),n=w.f;i&&t&&!t[Mo]&&n(t,Mo,{configurable:!0,get:function(){return this}});},To=function(e,t,n){if(!(e instanceof t))throw TypeError("Incorrect "+(n?n+" ":"")+"invocation");return e},Eo=t((function(e){var t=function(e,t){this.stopped=e,this.result=t;};(e.exports=function(e,n,r,o,i){var s,a,u,c,l,p,f,h=Re(n,r,o?2:1);if(i)s=e;else {if("function"!=typeof(a=ft(e)))throw TypeError("Target is not iterable");if(ot(a)){for(u=0,c=ae(e.length);c>u;u++)if((l=o?h(D(f=e[u])[0],f[1]):h(e[u]))&&l instanceof t)return l;return new t(!1)}s=a.call(e);}for(p=s.next;!(f=p.call(s)).done;)if("object"==typeof(l=et(s,h,f.value,o))&&l&&l instanceof t)return l;return new t(!1)}).stop=function(e){return new t(!0,e)};})),Do=qe("species"),ko=function(e,t){var n,r=D(e).constructor;return void 0===r||null==(n=D(r)[Do])?t:be(n)},wo=/(iphone|ipod|ipad).*applewebkit/i.test(fn),Ao=r.location,bo=r.setImmediate,Ro=r.clearImmediate,Oo=r.process,Lo=r.MessageChannel,No=r.Dispatch,Po=0,Go={},xo=function(e){if(Go.hasOwnProperty(e)){var t=Go[e];delete Go[e],t();}},Uo=function(e){return function(){xo(e);}},qo=function(e){xo(e.data);},Fo=function(e){r.postMessage(e+"",Ao.protocol+"//"+Ao.host);};bo&&Ro||(bo=function(e){for(var t=[],n=1;arguments.length>n;)t.push(arguments[n++]);return Go[++Po]=function(){("function"==typeof e?e:Function(e)).apply(void 0,t);},vo(Po),Po},Ro=function(e){delete Go[e];},"process"==p(Oo)?vo=function(e){Oo.nextTick(Uo(e));}:No&&No.now?vo=function(e){No.now(Uo(e));}:Lo&&!wo?(_o=(yo=new Lo).port2,yo.port1.onmessage=qo,vo=Re(_o.postMessage,_o,1)):!r.addEventListener||"function"!=typeof postMessage||r.importScripts||o(Fo)?vo="onreadystatechange"in M("script")?function(e){St.appendChild(M("script")).onreadystatechange=function(){St.removeChild(this),xo(e);};}:function(e){setTimeout(Uo(e),0);}:(vo=Fo,r.addEventListener("message",qo,!1)));var jo,Bo,Ho,Vo,Ko,$o,Yo,zo,Wo={set:bo,clear:Ro},Xo=E.f,Jo=Wo.set,Qo=r.MutationObserver||r.WebKitMutationObserver,Zo=r.process,ei=r.Promise,ti="process"==p(Zo),ni=Xo(r,"queueMicrotask"),ri=ni&&ni.value;ri||(jo=function(){var e,t;for(ti&&(e=Zo.domain)&&e.exit();Bo;){t=Bo.fn,Bo=Bo.next;try{t();}catch(mC){throw Bo?Vo():Ho=void 0,mC}}Ho=void 0,e&&e.enter();},ti?Vo=function(){Zo.nextTick(jo);}:Qo&&!wo?(Ko=!0,$o=document.createTextNode(""),new Qo(jo).observe($o,{characterData:!0}),Vo=function(){$o.data=Ko=!Ko;}):ei&&ei.resolve?(Yo=ei.resolve(void 0),zo=Yo.then,Vo=function(){zo.call(Yo,jo);}):Vo=function(){Jo.call(r,jo);});var oi,ii,si,ai,ui=ri||function(e){var t={fn:e,next:void 0};Ho&&(Ho.next=t),Bo||(Bo=t,Vo()),Ho=t;},ci=function(e){var t,n;this.promise=new e((function(e,r){if(void 0!==t||void 0!==n)throw TypeError("Bad Promise constructor");t=e,n=r;})),this.resolve=be(t),this.reject=be(n);},li={f:function(e){return new ci(e)}},pi=function(e,t){if(D(e),m(t)&&t.constructor===e)return t;var n=li.f(e);return (0, n.resolve)(t),n.promise},fi=function(e){try{return {error:!1,value:e()}}catch(mC){return {error:!0,value:mC}}},hi=Wo.set,di=qe("species"),gi="Promise",mi=Q.get,vi=Q.set,yi=Q.getterFor(gi),_i=Co,Ci=r.TypeError,Ii=r.document,Mi=r.process,Si=ne("fetch"),Ti=li.f,Ei=Ti,Di="process"==p(Mi),ki=!!(Ii&&Ii.createEvent&&r.dispatchEvent),wi=ke(gi,(function(){if(!(G(_i)!==String(_i))){if(66===mn)return !0;if(!Di&&"function"!=typeof PromiseRejectionEvent)return !0}if(mn>=51&&/native code/.test(_i))return !1;var e=_i.resolve(1),t=function(e){e((function(){}),(function(){}));};return (e.constructor={})[di]=t,!(e.then((function(){}))instanceof t)})),Ai=wi||!yt((function(e){_i.all(e).catch((function(){}));})),bi=function(e){var t;return !(!m(e)||"function"!=typeof(t=e.then))&&t},Ri=function(e,t,n){if(!t.notified){t.notified=!0;var r=t.reactions;ui((function(){for(var o=t.value,i=1==t.state,s=0;r.length>s;){var a,u,c,l=r[s++],p=i?l.ok:l.fail,f=l.resolve,h=l.reject,d=l.domain;try{p?(i||(2===t.rejection&&Pi(e,t),t.rejection=1),!0===p?a=o:(d&&d.enter(),a=p(o),d&&(d.exit(),c=!0)),a===l.promise?h(Ci("Promise-chain cycle")):(u=bi(a))?u.call(a,f,h):f(a)):h(o);}catch(mC){d&&!c&&d.exit(),h(mC);}}t.reactions=[],t.notified=!1,n&&!t.rejection&&Li(e,t);}));}},Oi=function(e,t,n){var o,i;ki?((o=Ii.createEvent("Event")).promise=t,o.reason=n,o.initEvent(e,!1,!0),r.dispatchEvent(o)):o={promise:t,reason:n},(i=r["on"+e])?i(o):"unhandledrejection"===e&&function(e,t){var n=r.console;n&&n.error&&(1===arguments.length?n.error(e):n.error(e,t));}("Unhandled promise rejection",n);},Li=function(e,t){hi.call(r,(function(){var n,r=t.value;if(Ni(t)&&(n=fi((function(){Di?Mi.emit("unhandledRejection",r,e):Oi("unhandledrejection",e,r);})),t.rejection=Di||Ni(t)?2:1,n.error))throw n.value}));},Ni=function(e){return 1!==e.rejection&&!e.parent},Pi=function(e,t){hi.call(r,(function(){Di?Mi.emit("rejectionHandled",e):Oi("rejectionhandled",e,t.value);}));},Gi=function(e,t,n,r){return function(o){e(t,n,o,r);}},xi=function(e,t,n,r){t.done||(t.done=!0,r&&(t=r),t.value=n,t.state=2,Ri(e,t,!0));},Ui=function(e,t,n,r){if(!t.done){t.done=!0,r&&(t=r);try{if(e===n)throw Ci("Promise can't be resolved itself");var o=bi(n);o?ui((function(){var r={done:!1};try{o.call(n,Gi(Ui,e,r,t),Gi(xi,e,r,t));}catch(mC){xi(e,r,mC,t);}})):(t.value=n,t.state=1,Ri(e,t,!1));}catch(mC){xi(e,{done:!1},mC,t);}}};wi&&(_i=function(e){To(this,_i,gi),be(e),oi.call(this);var t=mi(this);try{e(Gi(Ui,this,t),Gi(xi,this,t));}catch(mC){xi(this,t,mC);}},(oi=function(e){vi(this,{type:gi,done:!1,notified:!1,parent:!1,reactions:[],rejection:!1,state:0,value:void 0});}).prototype=Io(_i.prototype,{then:function(e,t){var n=yi(this),r=Ti(ko(this,_i));return r.ok="function"!=typeof e||e,r.fail="function"==typeof t&&t,r.domain=Di?Mi.domain:void 0,n.parent=!0,n.reactions.push(r),0!=n.state&&Ri(this,n,!1),r.promise},catch:function(e){return this.then(void 0,e)}}),ii=function(){var e=new oi,t=mi(e);this.promise=e,this.resolve=Gi(Ui,e,t),this.reject=Gi(xi,e,t);},li.f=Ti=function(e){return e===_i||e===si?new ii(e):Ei(e)},"function"==typeof Co&&(ai=Co.prototype.then,Z(Co.prototype,"then",(function(e,t){var n=this;return new _i((function(e,t){ai.call(n,e,t);})).then(e,t)}),{unsafe:!0}),"function"==typeof Si&&Ae({global:!0,enumerable:!0,forced:!0},{fetch:function(e){return pi(_i,Si.apply(r,arguments))}}))),Ae({global:!0,wrap:!0,forced:wi},{Promise:_i}),Vt(_i,gi,!1),So(gi),si=ne(gi),Ae({target:gi,stat:!0,forced:wi},{reject:function(e){var t=Ti(this);return t.reject.call(void 0,e),t.promise}}),Ae({target:gi,stat:!0,forced:wi},{resolve:function(e){return pi(this,e)}}),Ae({target:gi,stat:!0,forced:Ai},{all:function(e){var t=this,n=Ti(t),r=n.resolve,o=n.reject,i=fi((function(){var n=be(t.resolve),i=[],s=0,a=1;Eo(e,(function(e){var u=s++,c=!1;i.push(void 0),a++,n.call(t,e).then((function(e){c||(c=!0,i[u]=e,--a||r(i));}),o);})),--a||r(i);}));return i.error&&o(i.value),n.promise},race:function(e){var t=this,n=Ti(t),r=n.reject,o=fi((function(){var o=be(t.resolve);Eo(e,(function(e){o.call(t,e).then(n.resolve,r);}));}));return o.error&&r(o.value),n.promise}});var qi=function(){var e=D(this),t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e.unicode&&(t+="u"),e.sticky&&(t+="y"),t};function Fi(e,t){return RegExp(e,t)}var ji,Bi,Hi={UNSUPPORTED_Y:o((function(){var e=Fi("a","y");return e.lastIndex=2,null!=e.exec("abcd")})),BROKEN_CARET:o((function(){var e=Fi("^r","gy");return e.lastIndex=2,null!=e.exec("str")}))},Vi=RegExp.prototype.exec,Ki=String.prototype.replace,$i=Vi,Yi=(ji=/a/,Bi=/b*/g,Vi.call(ji,"a"),Vi.call(Bi,"a"),0!==ji.lastIndex||0!==Bi.lastIndex),zi=Hi.UNSUPPORTED_Y||Hi.BROKEN_CARET,Wi=void 0!==/()??/.exec("")[1];(Yi||Wi||zi)&&($i=function(e){var t,n,r,o,i=this,s=zi&&i.sticky,a=qi.call(i),u=i.source,c=0,l=e;return s&&(-1===(a=a.replace("y","")).indexOf("g")&&(a+="g"),l=String(e).slice(i.lastIndex),i.lastIndex>0&&(!i.multiline||i.multiline&&"\n"!==e[i.lastIndex-1])&&(u="(?: "+u+")",l=" "+l,c++),n=new RegExp("^(?:"+u+")",a)),Wi&&(n=new RegExp("^"+u+"$(?!\\s)",a)),Yi&&(t=i.lastIndex),r=Vi.call(s?n:i,l),s?r?(r.input=r.input.slice(c),r[0]=r[0].slice(c),r.index=i.lastIndex,i.lastIndex+=r[0].length):i.lastIndex=0:Yi&&r&&(i.lastIndex=i.global?r.index+r[0].length:t),Wi&&r&&r.length>1&&Ki.call(r[0],n,(function(){for(o=1;o<arguments.length-2;o++)void 0===arguments[o]&&(r[o]=void 0);})),r});var Xi=$i;Ae({target:"RegExp",proto:!0,forced:/./.exec!==Xi},{exec:Xi});var Ji=RegExp.prototype,Qi=Ji.toString,Zi=o((function(){return "/a/b"!=Qi.call({source:"a",flags:"b"})})),es="toString"!=Qi.name;(Zi||es)&&Z(RegExp.prototype,"toString",(function(){var e=D(this),t=String(e.source),n=e.flags;return "/"+t+"/"+String(void 0===n&&e instanceof RegExp&&!("flags"in Ji)?qi.call(e):n)}),{unsafe:!0});var ts=qe("match"),ns=function(e){var t;return m(e)&&(void 0!==(t=e[ts])?!!t:"RegExp"==p(e))},rs=function(e){if(ns(e))throw TypeError("The method doesn't accept regular expressions");return e},os=qe("match");Ae({target:"String",proto:!0,forced:!function(e){var t=/./;try{"/./"[e](t);}catch(n){try{return t[os]=!1,"/./"[e](t)}catch(r){}}return !1}("includes")},{includes:function(e){return !!~String(d(this)).indexOf(rs(e),arguments.length>1?arguments[1]:void 0)}});var is=qe("species"),ss=!o((function(){var e=/./;return e.exec=function(){var e=[];return e.groups={a:"7"},e},"7"!=="".replace(e,"$<a>")})),as="$0"==="a".replace(/./,"$0"),us=qe("replace"),cs=!!/./[us]&&""===/./[us]("a","$0"),ls=!o((function(){var e=/(?:)/,t=e.exec;e.exec=function(){return t.apply(this,arguments)};var n="ab".split(e);return 2!==n.length||"a"!==n[0]||"b"!==n[1]})),ps=function(e,t,n,r){var i=qe(e),s=!o((function(){var t={};return t[i]=function(){return 7},7!=""[e](t)})),a=s&&!o((function(){var t=!1,n=/a/;return "split"===e&&((n={}).constructor={},n.constructor[is]=function(){return n},n.flags="",n[i]=/./[i]),n.exec=function(){return t=!0,null},n[i](""),!t}));if(!s||!a||"replace"===e&&(!ss||!as||cs)||"split"===e&&!ls){var u=/./[i],c=n(i,""[e],(function(e,t,n,r,o){return t.exec===Xi?s&&!o?{done:!0,value:u.call(t,n,r)}:{done:!0,value:e.call(n,t,r)}:{done:!1}}),{REPLACE_KEEPS_$0:as,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:cs}),l=c[0],p=c[1];Z(String.prototype,e,l),Z(RegExp.prototype,i,2==t?function(e,t){return p.call(e,this,t)}:function(e){return p.call(e,this)});}r&&A(RegExp.prototype[i],"sham",!0);},fs=Nt.charAt,hs=function(e,t,n){return t+(n?fs(e,t).length:1)},ds=function(e,t){var n=e.exec;if("function"==typeof n){var r=n.call(e,t);if("object"!=typeof r)throw TypeError("RegExp exec method returned something other than an Object or null");return r}if("RegExp"!==p(e))throw TypeError("RegExp#exec called on incompatible receiver");return Xi.call(e,t)};ps("match",1,(function(e,t,n){return [function(t){var n=d(this),r=null==t?void 0:t[e];return void 0!==r?r.call(t,n):new RegExp(t)[e](String(n))},function(e){var r=n(t,e,this);if(r.done)return r.value;var o=D(e),i=String(this);if(!o.global)return ds(o,i);var s=o.unicode;o.lastIndex=0;for(var a,u=[],c=0;null!==(a=ds(o,i));){var l=String(a[0]);u[c]=l,""===l&&(o.lastIndex=hs(i,ae(o.lastIndex),s)),c++;}return 0===c?null:u}]}));var gs=Math.max,ms=Math.min,vs=Math.floor,ys=/\$([$&'`]|\d\d?|<[^>]*>)/g,_s=/\$([$&'`]|\d\d?)/g;ps("replace",2,(function(e,t,n,r){var o=r.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,i=r.REPLACE_KEEPS_$0,s=o?"$":"$0";return [function(n,r){var o=d(this),i=null==n?void 0:n[e];return void 0!==i?i.call(n,o,r):t.call(String(o),n,r)},function(e,r){if(!o&&i||"string"==typeof r&&-1===r.indexOf(s)){var u=n(t,e,this,r);if(u.done)return u.value}var c=D(e),l=String(this),p="function"==typeof r;p||(r=String(r));var f=c.global;if(f){var h=c.unicode;c.lastIndex=0;}for(var d=[];;){var g=ds(c,l);if(null===g)break;if(d.push(g),!f)break;""===String(g[0])&&(c.lastIndex=hs(l,ae(c.lastIndex),h));}for(var m,v="",y=0,_=0;_<d.length;_++){g=d[_];for(var C=String(g[0]),I=gs(ms(ie(g.index),l.length),0),M=[],S=1;S<g.length;S++)M.push(void 0===(m=g[S])?m:String(m));var T=g.groups;if(p){var E=[C].concat(M,I,l);void 0!==T&&E.push(T);var k=String(r.apply(void 0,E));}else k=a(C,l,I,M,T,r);I>=y&&(v+=l.slice(y,I)+k,y=I+C.length);}return v+l.slice(y)}];function a(e,n,r,o,i,s){var a=r+e.length,u=o.length,c=_s;return void 0!==i&&(i=Oe(i),c=ys),t.call(s,c,(function(t,s){var c;switch(s.charAt(0)){case"$":return "$";case"&":return e;case"`":return n.slice(0,r);case"'":return n.slice(a);case"<":c=i[s.slice(1,-1)];break;default:var l=+s;if(0===l)return t;if(l>u){var p=vs(l/10);return 0===p?t:p<=u?void 0===o[p-1]?s.charAt(1):o[p-1]+s.charAt(1):t}c=o[l-1];}return void 0===c?"":c}))}}));var Cs=qe("iterator"),Is=qe("toStringTag"),Ms=yr.values;for(var Ss in rn){var Ts=r[Ss],Es=Ts&&Ts.prototype;if(Es){if(Es[Cs]!==Ms)try{A(Es,Cs,Ms);}catch(mC){Es[Cs]=Ms;}if(Es[Is]||A(Es,Is,Ss),rn[Ss])for(var Ds in yr)if(Es[Ds]!==yr[Ds])try{A(Es,Ds,yr[Ds]);}catch(mC){Es[Ds]=yr[Ds];}}}var ks=Kr.trim,ws=r.parseFloat,As=1/ws(Fr+"-0")!=-Infinity?function(e){var t=ks(String(e)),n=ws(t);return 0===n&&"-"==t.charAt(0)?-0:n}:ws;Ae({global:!0,forced:parseFloat!=As},{parseFloat:As});var bs="undefined"!=typeof window,Rs="undefined"!=typeof wx&&"function"==typeof wx.getSystemInfoSync,Os=bs&&window.navigator&&window.navigator.userAgent||"",Ls=/AppleWebKit\/([\d.]+)/i.exec(Os),Ns=(Ls&&parseFloat(Ls.pop()),/iPad/i.test(Os)),Ps=(/iPhone/i.test(Os),/iPod/i.test(Os),function(){var e=Os.match(/OS (\d+)_/i);e&&e[1]&&e[1];}(),/Android/i.test(Os)),Gs=function(){var e=Os.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);if(!e)return null;var t=e[1]&&parseFloat(e[1]),n=e[2]&&parseFloat(e[2]);return t&&n?parseFloat(e[1]+"."+e[2]):t||null}(),xs=(Ps&&/webkit/i.test(Os),/Firefox/i.test(Os),/Edge/i.test(Os)),Us=!xs&&/Chrome/i.test(Os),qs=(function(){var e=Os.match(/Chrome\/(\d+)/);e&&e[1]&&parseFloat(e[1]);}(),/MSIE/.test(Os)),Fs=(/MSIE\s8\.0/.test(Os),function(){var e=/MSIE\s(\d+)\.\d/.exec(Os),t=e&&parseFloat(e[1]);return !t&&/Trident\/7.0/i.test(Os)&&/rv:11.0/.test(Os)&&(t=11),t}()),js=(/Safari/i.test(Os),/TBS\/\d+/i.test(Os)),Bs=(function(){var e=Os.match(/TBS\/(\d+)/i);if(e&&e[1])e[1];}(),!js&&/MQQBrowser\/\d+/i.test(Os),!js&&/ QQBrowser\/\d+/i.test(Os),/(micromessenger|webbrowser)/i.test(Os)),Hs=(/Windows/i.test(Os),/MAC OS X/i.test(Os),/MicroMessenger/i.test(Os),yn("splice")),Vs=We("splice",{ACCESSORS:!0,0:0,1:2}),Ks=Math.max,$s=Math.min;Ae({target:"Array",proto:!0,forced:!Hs||!Vs},{splice:function(e,t){var n,r,o,i,s,a,u=Oe(this),c=ae(u.length),l=le(e,c),p=arguments.length;if(0===p?n=r=0:1===p?(n=0,r=c-l):(n=p-2,r=$s(Ks(ie(t),0),c-l)),c+n-r>9007199254740991)throw TypeError("Maximum allowed length exceeded");for(o=je(u,r),i=0;i<r;i++)(s=l+i)in u&&it(o,i,u[s]);if(o.length=r,n<r){for(i=l;i<c-r;i++)a=i+n,(s=i+r)in u?u[a]=u[s]:delete u[a];for(i=c;i>c-r+n;i--)delete u[i-1];}else if(n>r)for(i=c-r;i>l;i--)a=i+n-1,(s=i+r-1)in u?u[a]=u[s]:delete u[a];for(i=0;i<n;i++)u[i+l]=arguments[i+2];return u.length=c-r+n,o}});var Ys,zs,Ws=!o((function(){return Object.isExtensible(Object.preventExtensions({}))})),Xs=t((function(e){var t=w.f,n=B("meta"),r=0,o=Object.isExtensible||function(){return !0},i=function(e){t(e,n,{value:{objectID:"O"+ ++r,weakData:{}}});},s=e.exports={REQUIRED:!1,fastKey:function(e,t){if(!m(e))return "symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!_(e,n)){if(!o(e))return "F";if(!t)return "E";i(e);}return e[n].objectID},getWeakData:function(e,t){if(!_(e,n)){if(!o(e))return !0;if(!t)return !1;i(e);}return e[n].weakData},onFreeze:function(e){return Ws&&s.REQUIRED&&o(e)&&!_(e,n)&&i(e),e}};K[n]=!0;})),Js=(Xs.REQUIRED,Xs.fastKey,Xs.getWeakData,Xs.onFreeze,w.f),Qs=Xs.fastKey,Zs=Q.set,ea=Q.getterFor,ta=(function(e,t,n){var i=-1!==e.indexOf("Map"),s=-1!==e.indexOf("Weak"),a=i?"set":"add",u=r[e],c=u&&u.prototype,l=u,p={},f=function(e){var t=c[e];Z(c,e,"add"==e?function(e){return t.call(this,0===e?0:e),this}:"delete"==e?function(e){return !(s&&!m(e))&&t.call(this,0===e?0:e)}:"get"==e?function(e){return s&&!m(e)?void 0:t.call(this,0===e?0:e)}:"has"==e?function(e){return !(s&&!m(e))&&t.call(this,0===e?0:e)}:function(e,n){return t.call(this,0===e?0:e,n),this});};if(ke(e,"function"!=typeof u||!(s||c.forEach&&!o((function(){(new u).entries().next();})))))l=n.getConstructor(t,e,i,a),Xs.REQUIRED=!0;else if(ke(e,!0)){var h=new l,d=h[a](s?{}:-0,1)!=h,g=o((function(){h.has(1);})),v=yt((function(e){new u(e);})),y=!s&&o((function(){for(var e=new u,t=5;t--;)e[a](t,t);return !e.has(-0)}));v||((l=t((function(t,n){To(t,l,e);var r=qr(new u,t,l);return null!=n&&Eo(n,r[a],r,i),r}))).prototype=c,c.constructor=l),(g||y)&&(f("delete"),f("has"),i&&f("get")),(y||d)&&f(a),s&&c.clear&&delete c.clear;}p[e]=l,Ae({global:!0,forced:l!=u},p),Vt(l,e),s||n.setStrong(l,e,i);}("Map",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),{getConstructor:function(e,t,n,r){var o=e((function(e,s){To(e,o,t),Zs(e,{type:t,index:wt(null),first:void 0,last:void 0,size:0}),i||(e.size=0),null!=s&&Eo(s,e[r],e,n);})),s=ea(t),a=function(e,t,n){var r,o,a=s(e),c=u(e,t);return c?c.value=n:(a.last=c={index:o=Qs(t,!0),key:t,value:n,previous:r=a.last,next:void 0,removed:!1},a.first||(a.first=c),r&&(r.next=c),i?a.size++:e.size++,"F"!==o&&(a.index[o]=c)),e},u=function(e,t){var n,r=s(e),o=Qs(t);if("F"!==o)return r.index[o];for(n=r.first;n;n=n.next)if(n.key==t)return n};return Io(o.prototype,{clear:function(){for(var e=s(this),t=e.index,n=e.first;n;)n.removed=!0,n.previous&&(n.previous=n.previous.next=void 0),delete t[n.index],n=n.next;e.first=e.last=void 0,i?e.size=0:this.size=0;},delete:function(e){var t=s(this),n=u(this,e);if(n){var r=n.next,o=n.previous;delete t.index[n.index],n.removed=!0,o&&(o.next=r),r&&(r.previous=o),t.first==n&&(t.first=r),t.last==n&&(t.last=o),i?t.size--:this.size--;}return !!n},forEach:function(e){for(var t,n=s(this),r=Re(e,arguments.length>1?arguments[1]:void 0,3);t=t?t.next:n.first;)for(r(t.value,t.key,this);t&&t.removed;)t=t.previous;},has:function(e){return !!u(this,e)}}),Io(o.prototype,n?{get:function(e){var t=u(this,e);return t&&t.value},set:function(e,t){return a(this,0===e?0:e,t)}}:{add:function(e){return a(this,e=0===e?0:e,e)}}),i&&Js(o.prototype,"size",{get:function(){return s(this).size}}),o},setStrong:function(e,t,n){var r=t+" Iterator",o=ea(t),i=ea(r);Zt(e,t,(function(e,t){Zs(this,{type:r,target:e,state:o(e),kind:t,last:void 0});}),(function(){for(var e=i(this),t=e.kind,n=e.last;n&&n.removed;)n=n.previous;return e.target&&(e.last=n=n?n.next:e.state.first)?"keys"==t?{value:n.key,done:!1}:"values"==t?{value:n.value,done:!1}:{value:[n.key,n.value],done:!1}:(e.target=void 0,{value:void 0,done:!0})}),n?"entries":"values",!n,!0),So(t);}}),"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});Ys="undefined"!=typeof console?console:void 0!==ta&&ta.console?ta.console:"undefined"!=typeof window&&window.console?window.console:{};for(var na=function(){},ra=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],oa=ra.length;oa--;)zs=ra[oa],console[zs]||(Ys[zs]=na);Ys.methods=ra;var ia=Ys,sa=0,aa=new Map;function ua(){var e=new Date;return "TIM "+e.toLocaleTimeString("en-US",{hour12:!1})+"."+function(e){var t;switch(e.toString().length){case 1:t="00"+e;break;case 2:t="0"+e;break;default:t=e;}return t}(e.getMilliseconds())+":"}var ca={_data:[],_length:0,_visible:!1,arguments2String:function(e){var t;if(1===e.length)t=ua()+e[0];else {t=ua();for(var n=0,r=e.length;n<r;n++)va(e[n])?_a(e[n])?t+=Ea(e[n]):t+=JSON.stringify(e[n]):t+=e[n],t+=" ";}return t},debug:function(){if(sa<=-1){var e=this.arguments2String(arguments);ca.record(e,"debug"),ia.debug(e);}},log:function(){if(sa<=0){var e=this.arguments2String(arguments);ca.record(e,"log"),ia.log(e);}},info:function(){if(sa<=1){var e=this.arguments2String(arguments);ca.record(e,"info"),ia.info(e);}},warn:function(){if(sa<=2){var e=this.arguments2String(arguments);ca.record(e,"warn"),ia.warn(e);}},error:function(){if(sa<=3){var e=this.arguments2String(arguments);ca.record(e,"error"),ia.error(e);}},time:function(e){aa.set(e,Sa.now());},timeEnd:function(e){if(aa.has(e)){var t=Sa.now()-aa.get(e);return aa.delete(e),t}return ia.warn("未找到对应label: ".concat(e,", 请在调用 logger.timeEnd 前，调用 logger.time")),0},setLevel:function(e){e<4&&ia.log(ua()+"set level from "+sa+" to "+e),sa=e;},record:function(e,t){1100===ca._length&&(ca._data.splice(0,100),ca._length=1e3),ca._length++,ca._data.push("".concat(e," [").concat(t,"] \n"));},getLog:function(){return ca._data}},la=function(e){return "file"===Ca(e)},pa=function(e){return null!==e&&("number"==typeof e&&!isNaN(e-0)||"object"===Dn(e)&&e.constructor===Number)},fa=function(e){return "string"==typeof e},ha=function(e){return null!==e&&"object"===Dn(e)},da=function(e){if("object"!==Dn(e)||null===e)return !1;var t=Object.getPrototypeOf(e);if(null===t)return !0;for(var n=t;null!==Object.getPrototypeOf(n);)n=Object.getPrototypeOf(n);return t===n},ga=function(e){return "function"==typeof Array.isArray?Array.isArray(e):"array"===Ca(e)},ma=function(e){return void 0===e},va=function(e){return ga(e)||ha(e)},ya=function(e){return "function"==typeof e},_a=function(e){return e instanceof Error},Ca=function(e){return Object.prototype.toString.call(e).match(/^\[object (.*)\]$/)[1].toLowerCase()},Ia=function(e){if("string"!=typeof e)return !1;var t=e[0];return !/[^a-zA-Z0-9]/.test(t)},Ma=0;Date.now||(Date.now=function(){return (new Date).getTime()});var Sa={now:function(){0===Ma&&(Ma=Date.now()-1);var e=Date.now()-Ma;return e>4294967295?(Ma+=4294967295,Date.now()-Ma):e},utc:function(){return Math.round(Date.now()/1e3)}},Ta=function e(t,n,r,o){if(!va(t)||!va(n))return 0;for(var i,s=0,a=Object.keys(n),u=0,c=a.length;u<c;u++)if(i=a[u],!(ma(n[i])||r&&r.includes(i)))if(va(t[i])&&va(n[i]))s+=e(t[i],n[i],r,o);else {if(o&&o.includes(n[i]))continue;t[i]!==n[i]&&(t[i]=n[i],s+=1);}return s},Ea=function(e){return JSON.stringify(e,["message","code"])},Da=function(){var e=new Date,t=e.toISOString(),n=e.getTimezoneOffset()/60,r="";return r=n<0?n>-10?"+0"+Math.abs(100*n):"+"+Math.abs(100*n):n>=10?"-"+100*n:"-0"+100*n,t.replace("Z",r)},ka=function(e){if(0===e.length)return 0;for(var t=0,n=0,r="undefined"!=typeof document&&void 0!==document.characterSet?document.characterSet:"UTF-8";void 0!==e[t];)n+=e[t++].charCodeAt[t]<=255?1:!1===r?3:2;return n},wa=function(e){var t=e||99999999;return Math.round(Math.random()*t)},Aa="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",ba=Aa.length,Ra=function(e,t){for(var n in e)if(e[n]===t)return !0;return !1},Oa={},La=function(){if(Rs)return "https:";var e=window.location.protocol;return ["http:","https:"].indexOf(e)<0&&(e="http:"),e},Na=function(e){return -1===e.indexOf("http://")||-1===e.indexOf("https://")?"https://"+e:e.replace(/https|http/,"https")};function Pa(e,t){ga(e)&&ga(t)?t.forEach((function(t){var n=t.key,r=t.value,o=e.find((function(e){return e.key===n}));o?o.value=r:e.push({key:n,value:r});})):ca.warn("updateCustomField target 或 source 不是数组，忽略此次更新。");}var Ga=function(e){return e===pn.GRP_PUBLIC},xa=function(e){return e===pn.GRP_AVCHATROOM},Ua=function(e){return fa(e)&&e===pn.CONV_SYSTEM};function qa(e,t){var n={};return Object.keys(e).forEach((function(r){n[r]=t(e[r],r);})),n}var Fa=Object.prototype.hasOwnProperty;function ja(e){if(null==e)return !0;if("boolean"==typeof e)return !1;if("number"==typeof e)return 0===e;if("string"==typeof e)return 0===e.length;if("function"==typeof e)return 0===e.length;if(Array.isArray(e))return 0===e.length;if(e instanceof Error)return ""===e.message;if(da(e)){for(var t in e)if(Fa.call(e,t))return !1;return !0}return !("map"!==Ca(e)&&!function(e){return "set"===Ca(e)}(e)&&!la(e))&&0===e.size}function Ba(e,t,n){if(void 0===t)return !0;var r=!0;if("object"===nr(t).toLowerCase())Object.keys(t).forEach((function(o){var i=1===e.length?e[0][o]:void 0;r=!!Ha(i,t[o],n,o)&&r;}));else if("array"===nr(t).toLowerCase())for(var o=0;o<t.length;o++)r=!!Ha(e[o],t[o],n,t[o].name)&&r;if(r)return r;throw new Error("Params validate failed.")}function Ha(e,t,n,r){if(void 0===t)return !0;var o=!0;return t.required&&ja(e)&&(ia.error("TIM [".concat(n,'] Missing required params: "').concat(r,'".')),o=!1),ja(e)||nr(e).toLowerCase()===t.type.toLowerCase()||(ia.error("TIM [".concat(n,'] Invalid params: type check failed for "').concat(r,'".Expected ').concat(t.type,".")),o=!1),t.validator&&!t.validator(e)&&(ia.error("TIM [".concat(n,"] Invalid params: custom validator check failed for params.")),o=!1),o}var Va={f:qe},Ka=w.f,$a=Ve.forEach,Ya=V("hidden"),za=qe("toPrimitive"),Wa=Q.set,Xa=Q.getterFor("Symbol"),Ja=Object.prototype,Qa=r.Symbol,Za=ne("JSON","stringify"),eu=E.f,tu=w.f,nu=ao.f,ru=u.f,ou=q("symbols"),iu=q("op-symbols"),su=q("string-to-symbol-registry"),au=q("symbol-to-string-registry"),uu=q("wks"),cu=r.QObject,lu=!cu||!cu.prototype||!cu.prototype.findChild,pu=i&&o((function(){return 7!=wt(tu({},"a",{get:function(){return tu(this,"a",{value:7}).a}})).a}))?function(e,t,n){var r=eu(Ja,t);r&&delete Ja[t],tu(e,t,n),r&&e!==Ja&&tu(Ja,t,r);}:tu,fu=function(e,t){var n=ou[e]=wt(Qa.prototype);return Wa(n,{type:"Symbol",tag:e,description:t}),i||(n.description=t),n},hu=Pe?function(e){return "symbol"==typeof e}:function(e){return Object(e)instanceof Qa},du=function(e,t,n){e===Ja&&du(iu,t,n),D(e);var r=v(t,!0);return D(n),_(ou,r)?(n.enumerable?(_(e,Ya)&&e[Ya][r]&&(e[Ya][r]=!1),n=wt(n,{enumerable:c(0,!1)})):(_(e,Ya)||tu(e,Ya,c(1,{})),e[Ya][r]=!0),pu(e,r,n)):tu(e,r,n)},gu=function(e,t){D(e);var n=g(t),r=It(n).concat(_u(n));return $a(r,(function(t){i&&!mu.call(n,t)||du(e,t,n[t]);})),e},mu=function(e){var t=v(e,!0),n=ru.call(this,t);return !(this===Ja&&_(ou,t)&&!_(iu,t))&&(!(n||!_(this,t)||!_(ou,t)||_(this,Ya)&&this[Ya][t])||n)},vu=function(e,t){var n=g(e),r=v(t,!0);if(n!==Ja||!_(ou,r)||_(iu,r)){var o=eu(n,r);return !o||!_(ou,r)||_(n,Ya)&&n[Ya][r]||(o.enumerable=!0),o}},yu=function(e){var t=nu(g(e)),n=[];return $a(t,(function(e){_(ou,e)||_(K,e)||n.push(e);})),n},_u=function(e){var t=e===Ja,n=nu(t?iu:g(e)),r=[];return $a(n,(function(e){!_(ou,e)||t&&!_(Ja,e)||r.push(ou[e]);})),r};if(Ne||(Z((Qa=function(){if(this instanceof Qa)throw TypeError("Symbol is not a constructor");var e=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,t=B(e),n=function(e){this===Ja&&n.call(iu,e),_(this,Ya)&&_(this[Ya],t)&&(this[Ya][t]=!1),pu(this,t,c(1,e));};return i&&lu&&pu(Ja,t,{configurable:!0,set:n}),fu(t,e)}).prototype,"toString",(function(){return Xa(this).tag})),Z(Qa,"withoutSetter",(function(e){return fu(B(e),e)})),u.f=mu,w.f=du,E.f=vu,ve.f=ao.f=yu,ye.f=_u,Va.f=function(e){return fu(qe(e),e)},i&&(tu(Qa.prototype,"description",{configurable:!0,get:function(){return Xa(this).description}}),Z(Ja,"propertyIsEnumerable",mu,{unsafe:!0}))),Ae({global:!0,wrap:!0,forced:!Ne,sham:!Ne},{Symbol:Qa}),$a(It(uu),(function(e){!function(e){var t=ee.Symbol||(ee.Symbol={});_(t,e)||Ka(t,e,{value:Va.f(e)});}(e);})),Ae({target:"Symbol",stat:!0,forced:!Ne},{for:function(e){var t=String(e);if(_(su,t))return su[t];var n=Qa(t);return su[t]=n,au[n]=t,n},keyFor:function(e){if(!hu(e))throw TypeError(e+" is not a symbol");if(_(au,e))return au[e]},useSetter:function(){lu=!0;},useSimple:function(){lu=!1;}}),Ae({target:"Object",stat:!0,forced:!Ne,sham:!i},{create:function(e,t){return void 0===t?wt(e):gu(wt(e),t)},defineProperty:du,defineProperties:gu,getOwnPropertyDescriptor:vu}),Ae({target:"Object",stat:!0,forced:!Ne},{getOwnPropertyNames:yu,getOwnPropertySymbols:_u}),Ae({target:"Object",stat:!0,forced:o((function(){ye.f(1);}))},{getOwnPropertySymbols:function(e){return ye.f(Oe(e))}}),Za){var Cu=!Ne||o((function(){var e=Qa();return "[null]"!=Za([e])||"{}"!=Za({a:e})||"{}"!=Za(Object(e))}));Ae({target:"JSON",stat:!0,forced:Cu},{stringify:function(e,t,n){for(var r,o=[e],i=1;arguments.length>i;)o.push(arguments[i++]);if(r=t,(m(t)||void 0!==e)&&!hu(e))return Le(t)||(t=function(e,t){if("function"==typeof r&&(t=r.call(this,e,t)),!hu(t))return t}),o[1]=t,Za.apply(null,o)}});}Qa.prototype[za]||A(Qa.prototype,za,Qa.prototype.valueOf),Vt(Qa,"Symbol"),K[Ya]=!0;var Iu=w.f,Mu=r.Symbol;if(i&&"function"==typeof Mu&&(!("description"in Mu.prototype)||void 0!==Mu().description)){var Su={},Tu=function(){var e=arguments.length<1||void 0===arguments[0]?void 0:String(arguments[0]),t=this instanceof Tu?new Mu(e):void 0===e?Mu():Mu(e);return ""===e&&(Su[t]=!0),t};Ce(Tu,Mu);var Eu=Tu.prototype=Mu.prototype;Eu.constructor=Tu;var Du=Eu.toString,ku="Symbol(test)"==String(Mu("test")),wu=/^Symbol\((.*)\)[^)]+$/;Iu(Eu,"description",{configurable:!0,get:function(){var e=m(this)?this.valueOf():this,t=Du.call(e);if(_(Su,e))return "";var n=ku?t.slice(7,-1):t.replace(wu,"$1");return ""===n?void 0:n}}),Ae({global:!0,forced:!0},{Symbol:Tu});}var Au=u.f,bu=function(e){return function(t){for(var n,r=g(t),o=It(r),s=o.length,a=0,u=[];s>a;)n=o[a++],i&&!Au.call(r,n)||u.push(e?[n,r[n]]:r[n]);return u}},Ru={entries:bu(!0),values:bu(!1)}.values;Ae({target:"Object",stat:!0},{values:function(e){return Ru(e)}});var Ou={SUCCESS:"JoinedSuccess",WAIT_APPROVAL:"WaitAdminApproval"},Lu={SUCCESS:0},Nu={IS_LOGIN:1,IS_NOT_LOGIN:0},Pu={UNSEND:"unSend",SUCCESS:"success",FAIL:"fail"},Gu={NOT_START:"notStart",PENDING:"pengding",RESOLVED:"resolved",REJECTED:"rejected"},xu=function(){function e(t){kn(this,e),this.type=pn.MSG_TEXT,this.content={text:t.text||""};}return An(e,[{key:"setText",value:function(e){this.content.text=e;}},{key:"sendable",value:function(){return 0!==this.content.text.length}}]),e}(),Uu=qe("iterator"),qu=!o((function(){var e=new URL("b?a=1&b=2&c=3","http://a"),t=e.searchParams,n="";return e.pathname="c%20d",t.forEach((function(e,r){t.delete("b"),n+=r+e;})),!t.sort||"http://a/c%20d?a=1&c=3"!==e.href||"3"!==t.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!t[Uu]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("http://тест").host||"#%D0%B1"!==new URL("http://a#б").hash||"a1c3"!==n||"x"!==new URL("http://x",void 0).host})),Fu=Object.assign,ju=Object.defineProperty,Bu=!Fu||o((function(){if(i&&1!==Fu({b:1},Fu(ju({},"a",{enumerable:!0,get:function(){ju(this,"b",{value:3,enumerable:!1});}}),{b:2})).b)return !0;var e={},t={},n=Symbol();return e[n]=7,"abcdefghijklmnopqrst".split("").forEach((function(e){t[e]=e;})),7!=Fu({},e)[n]||"abcdefghijklmnopqrst"!=It(Fu({},t)).join("")}))?function(e,t){for(var n=Oe(e),r=arguments.length,o=1,s=ye.f,a=u.f;r>o;)for(var c,l=h(arguments[o++]),p=s?It(l).concat(s(l)):It(l),f=p.length,d=0;f>d;)c=p[d++],i&&!a.call(l,c)||(n[c]=l[c]);return n}:Fu,Hu=/[^\0-\u007E]/,Vu=/[.\u3002\uFF0E\uFF61]/g,Ku="Overflow: input needs wider integers to process",$u=Math.floor,Yu=String.fromCharCode,zu=function(e){return e+22+75*(e<26)},Wu=function(e,t,n){var r=0;for(e=n?$u(e/700):e>>1,e+=$u(e/t);e>455;r+=36)e=$u(e/35);return $u(r+36*e/(e+38))},Xu=function(e){var t,n,r=[],o=(e=function(e){for(var t=[],n=0,r=e.length;n<r;){var o=e.charCodeAt(n++);if(o>=55296&&o<=56319&&n<r){var i=e.charCodeAt(n++);56320==(64512&i)?t.push(((1023&o)<<10)+(1023&i)+65536):(t.push(o),n--);}else t.push(o);}return t}(e)).length,i=128,s=0,a=72;for(t=0;t<e.length;t++)(n=e[t])<128&&r.push(Yu(n));var u=r.length,c=u;for(u&&r.push("-");c<o;){var l=2147483647;for(t=0;t<e.length;t++)(n=e[t])>=i&&n<l&&(l=n);var p=c+1;if(l-i>$u((2147483647-s)/p))throw RangeError(Ku);for(s+=(l-i)*p,i=l,t=0;t<e.length;t++){if((n=e[t])<i&&++s>2147483647)throw RangeError(Ku);if(n==i){for(var f=s,h=36;;h+=36){var d=h<=a?1:h>=a+26?26:h-a;if(f<d)break;var g=f-d,m=36-d;r.push(Yu(zu(d+g%m))),f=$u(g/m);}r.push(Yu(zu(f))),a=Wu(s,p,c==u),s=0,++c;}}++s,++i;}return r.join("")},Ju=function(e){var t=ft(e);if("function"!=typeof t)throw TypeError(String(e)+" is not iterable");return D(t.call(e))},Qu=ne("fetch"),Zu=ne("Headers"),ec=qe("iterator"),tc=Q.set,nc=Q.getterFor("URLSearchParams"),rc=Q.getterFor("URLSearchParamsIterator"),oc=/\+/g,ic=Array(4),sc=function(e){return ic[e-1]||(ic[e-1]=RegExp("((?:%[\\da-f]{2}){"+e+"})","gi"))},ac=function(e){try{return decodeURIComponent(e)}catch(mC){return e}},uc=function(e){var t=e.replace(oc," "),n=4;try{return decodeURIComponent(t)}catch(mC){for(;n;)t=t.replace(sc(n--),ac);return t}},cc=/[!'()~]|%20/g,lc={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},pc=function(e){return lc[e]},fc=function(e){return encodeURIComponent(e).replace(cc,pc)},hc=function(e,t){if(t)for(var n,r,o=t.split("&"),i=0;i<o.length;)(n=o[i++]).length&&(r=n.split("="),e.push({key:uc(r.shift()),value:uc(r.join("="))}));},dc=function(e){this.entries.length=0,hc(this.entries,e);},gc=function(e,t){if(e<t)throw TypeError("Not enough arguments")},mc=Yt((function(e,t){tc(this,{type:"URLSearchParamsIterator",iterator:Ju(nc(e).entries),kind:t});}),"Iterator",(function(){var e=rc(this),t=e.kind,n=e.iterator.next(),r=n.value;return n.done||(n.value="keys"===t?r.key:"values"===t?r.value:[r.key,r.value]),n})),vc=function(){To(this,vc,"URLSearchParams");var e,t,n,r,o,i,s,a,u,c=arguments.length>0?arguments[0]:void 0,l=this,p=[];if(tc(l,{type:"URLSearchParams",entries:p,updateURL:function(){},updateSearchParams:dc}),void 0!==c)if(m(c))if("function"==typeof(e=ft(c)))for(n=(t=e.call(c)).next;!(r=n.call(t)).done;){if((s=(i=(o=Ju(D(r.value))).next).call(o)).done||(a=i.call(o)).done||!i.call(o).done)throw TypeError("Expected sequence with length 2");p.push({key:s.value+"",value:a.value+""});}else for(u in c)_(c,u)&&p.push({key:u,value:c[u]+""});else hc(p,"string"==typeof c?"?"===c.charAt(0)?c.slice(1):c:c+"");},yc=vc.prototype;Io(yc,{append:function(e,t){gc(arguments.length,2);var n=nc(this);n.entries.push({key:e+"",value:t+""}),n.updateURL();},delete:function(e){gc(arguments.length,1);for(var t=nc(this),n=t.entries,r=e+"",o=0;o<n.length;)n[o].key===r?n.splice(o,1):o++;t.updateURL();},get:function(e){gc(arguments.length,1);for(var t=nc(this).entries,n=e+"",r=0;r<t.length;r++)if(t[r].key===n)return t[r].value;return null},getAll:function(e){gc(arguments.length,1);for(var t=nc(this).entries,n=e+"",r=[],o=0;o<t.length;o++)t[o].key===n&&r.push(t[o].value);return r},has:function(e){gc(arguments.length,1);for(var t=nc(this).entries,n=e+"",r=0;r<t.length;)if(t[r++].key===n)return !0;return !1},set:function(e,t){gc(arguments.length,1);for(var n,r=nc(this),o=r.entries,i=!1,s=e+"",a=t+"",u=0;u<o.length;u++)(n=o[u]).key===s&&(i?o.splice(u--,1):(i=!0,n.value=a));i||o.push({key:s,value:a}),r.updateURL();},sort:function(){var e,t,n,r=nc(this),o=r.entries,i=o.slice();for(o.length=0,n=0;n<i.length;n++){for(e=i[n],t=0;t<n;t++)if(o[t].key>e.key){o.splice(t,0,e);break}t===n&&o.push(e);}r.updateURL();},forEach:function(e){for(var t,n=nc(this).entries,r=Re(e,arguments.length>1?arguments[1]:void 0,3),o=0;o<n.length;)r((t=n[o++]).value,t.key,this);},keys:function(){return new mc(this,"keys")},values:function(){return new mc(this,"values")},entries:function(){return new mc(this,"entries")}},{enumerable:!0}),Z(yc,ec,yc.entries),Z(yc,"toString",(function(){for(var e,t=nc(this).entries,n=[],r=0;r<t.length;)e=t[r++],n.push(fc(e.key)+"="+fc(e.value));return n.join("&")}),{enumerable:!0}),Vt(vc,"URLSearchParams"),Ae({global:!0,forced:!qu},{URLSearchParams:vc}),qu||"function"!=typeof Qu||"function"!=typeof Zu||Ae({global:!0,enumerable:!0,forced:!0},{fetch:function(e){var t,n,r,o=[e];return arguments.length>1&&(t=arguments[1],m(t)&&(n=t.body,"URLSearchParams"===lt(n)&&((r=t.headers?new Zu(t.headers):new Zu).has("content-type")||r.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"),t=wt(t,{body:c(0,String(n)),headers:c(0,r)}))),o.push(t)),Qu.apply(this,o)}});var _c,Cc={URLSearchParams:vc,getState:nc},Ic=Nt.codeAt,Mc=r.URL,Sc=Cc.URLSearchParams,Tc=Cc.getState,Ec=Q.set,Dc=Q.getterFor("URL"),kc=Math.floor,wc=Math.pow,Ac=/[A-Za-z]/,bc=/[\d+\-.A-Za-z]/,Rc=/\d/,Oc=/^(0x|0X)/,Lc=/^[0-7]+$/,Nc=/^\d+$/,Pc=/^[\dA-Fa-f]+$/,Gc=/[\u0000\u0009\u000A\u000D #%/:?@[\\]]/,xc=/[\u0000\u0009\u000A\u000D #/:?@[\\]]/,Uc=/^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,qc=/[\u0009\u000A\u000D]/g,Fc=function(e,t){var n,r,o;if("["==t.charAt(0)){if("]"!=t.charAt(t.length-1))return "Invalid host";if(!(n=Bc(t.slice(1,-1))))return "Invalid host";e.host=n;}else if(Xc(e)){if(t=function(e){var t,n,r=[],o=e.toLowerCase().replace(Vu,".").split(".");for(t=0;t<o.length;t++)n=o[t],r.push(Hu.test(n)?"xn--"+Xu(n):n);return r.join(".")}(t),Gc.test(t))return "Invalid host";if(null===(n=jc(t)))return "Invalid host";e.host=n;}else {if(xc.test(t))return "Invalid host";for(n="",r=ht(t),o=0;o<r.length;o++)n+=zc(r[o],Vc);e.host=n;}},jc=function(e){var t,n,r,o,i,s,a,u=e.split(".");if(u.length&&""==u[u.length-1]&&u.pop(),(t=u.length)>4)return e;for(n=[],r=0;r<t;r++){if(""==(o=u[r]))return e;if(i=10,o.length>1&&"0"==o.charAt(0)&&(i=Oc.test(o)?16:8,o=o.slice(8==i?1:2)),""===o)s=0;else {if(!(10==i?Nc:8==i?Lc:Pc).test(o))return e;s=parseInt(o,i);}n.push(s);}for(r=0;r<t;r++)if(s=n[r],r==t-1){if(s>=wc(256,5-t))return null}else if(s>255)return null;for(a=n.pop(),r=0;r<n.length;r++)a+=n[r]*wc(256,3-r);return a},Bc=function(e){var t,n,r,o,i,s,a,u=[0,0,0,0,0,0,0,0],c=0,l=null,p=0,f=function(){return e.charAt(p)};if(":"==f()){if(":"!=e.charAt(1))return;p+=2,l=++c;}for(;f();){if(8==c)return;if(":"!=f()){for(t=n=0;n<4&&Pc.test(f());)t=16*t+parseInt(f(),16),p++,n++;if("."==f()){if(0==n)return;if(p-=n,c>6)return;for(r=0;f();){if(o=null,r>0){if(!("."==f()&&r<4))return;p++;}if(!Rc.test(f()))return;for(;Rc.test(f());){if(i=parseInt(f(),10),null===o)o=i;else {if(0==o)return;o=10*o+i;}if(o>255)return;p++;}u[c]=256*u[c]+o,2!=++r&&4!=r||c++;}if(4!=r)return;break}if(":"==f()){if(p++,!f())return}else if(f())return;u[c++]=t;}else {if(null!==l)return;p++,l=++c;}}if(null!==l)for(s=c-l,c=7;0!=c&&s>0;)a=u[c],u[c--]=u[l+s-1],u[l+--s]=a;else if(8!=c)return;return u},Hc=function(e){var t,n,r,o;if("number"==typeof e){for(t=[],n=0;n<4;n++)t.unshift(e%256),e=kc(e/256);return t.join(".")}if("object"==typeof e){for(t="",r=function(e){for(var t=null,n=1,r=null,o=0,i=0;i<8;i++)0!==e[i]?(o>n&&(t=r,n=o),r=null,o=0):(null===r&&(r=i),++o);return o>n&&(t=r,n=o),t}(e),n=0;n<8;n++)o&&0===e[n]||(o&&(o=!1),r===n?(t+=n?":":"::",o=!0):(t+=e[n].toString(16),n<7&&(t+=":")));return "["+t+"]"}return e},Vc={},Kc=Bu({},Vc,{" ":1,'"':1,"<":1,">":1,"`":1}),$c=Bu({},Kc,{"#":1,"?":1,"{":1,"}":1}),Yc=Bu({},$c,{"/":1,":":1,";":1,"=":1,"@":1,"[":1,"\\":1,"]":1,"^":1,"|":1}),zc=function(e,t){var n=Ic(e,0);return n>32&&n<127&&!_(t,e)?e:encodeURIComponent(e)},Wc={ftp:21,file:null,http:80,https:443,ws:80,wss:443},Xc=function(e){return _(Wc,e.scheme)},Jc=function(e){return ""!=e.username||""!=e.password},Qc=function(e){return !e.host||e.cannotBeABaseURL||"file"==e.scheme},Zc=function(e,t){var n;return 2==e.length&&Ac.test(e.charAt(0))&&(":"==(n=e.charAt(1))||!t&&"|"==n)},el=function(e){var t;return e.length>1&&Zc(e.slice(0,2))&&(2==e.length||"/"===(t=e.charAt(2))||"\\"===t||"?"===t||"#"===t)},tl=function(e){var t=e.path,n=t.length;!n||"file"==e.scheme&&1==n&&Zc(t[0],!0)||t.pop();},nl=function(e){return "."===e||"%2e"===e.toLowerCase()},rl={},ol={},il={},sl={},al={},ul={},cl={},ll={},pl={},fl={},hl={},dl={},gl={},ml={},vl={},yl={},_l={},Cl={},Il={},Ml={},Sl={},Tl=function(e,t,n,r){var o,i,s,a,u,c=n||rl,l=0,p="",f=!1,h=!1,d=!1;for(n||(e.scheme="",e.username="",e.password="",e.host=null,e.port=null,e.path=[],e.query=null,e.fragment=null,e.cannotBeABaseURL=!1,t=t.replace(Uc,"")),t=t.replace(qc,""),o=ht(t);l<=o.length;){switch(i=o[l],c){case rl:if(!i||!Ac.test(i)){if(n)return "Invalid scheme";c=il;continue}p+=i.toLowerCase(),c=ol;break;case ol:if(i&&(bc.test(i)||"+"==i||"-"==i||"."==i))p+=i.toLowerCase();else {if(":"!=i){if(n)return "Invalid scheme";p="",c=il,l=0;continue}if(n&&(Xc(e)!=_(Wc,p)||"file"==p&&(Jc(e)||null!==e.port)||"file"==e.scheme&&!e.host))return;if(e.scheme=p,n)return void(Xc(e)&&Wc[e.scheme]==e.port&&(e.port=null));p="","file"==e.scheme?c=ml:Xc(e)&&r&&r.scheme==e.scheme?c=sl:Xc(e)?c=ll:"/"==o[l+1]?(c=al,l++):(e.cannotBeABaseURL=!0,e.path.push(""),c=Il);}break;case il:if(!r||r.cannotBeABaseURL&&"#"!=i)return "Invalid scheme";if(r.cannotBeABaseURL&&"#"==i){e.scheme=r.scheme,e.path=r.path.slice(),e.query=r.query,e.fragment="",e.cannotBeABaseURL=!0,c=Sl;break}c="file"==r.scheme?ml:ul;continue;case sl:if("/"!=i||"/"!=o[l+1]){c=ul;continue}c=pl,l++;break;case al:if("/"==i){c=fl;break}c=Cl;continue;case ul:if(e.scheme=r.scheme,i==_c)e.username=r.username,e.password=r.password,e.host=r.host,e.port=r.port,e.path=r.path.slice(),e.query=r.query;else if("/"==i||"\\"==i&&Xc(e))c=cl;else if("?"==i)e.username=r.username,e.password=r.password,e.host=r.host,e.port=r.port,e.path=r.path.slice(),e.query="",c=Ml;else {if("#"!=i){e.username=r.username,e.password=r.password,e.host=r.host,e.port=r.port,e.path=r.path.slice(),e.path.pop(),c=Cl;continue}e.username=r.username,e.password=r.password,e.host=r.host,e.port=r.port,e.path=r.path.slice(),e.query=r.query,e.fragment="",c=Sl;}break;case cl:if(!Xc(e)||"/"!=i&&"\\"!=i){if("/"!=i){e.username=r.username,e.password=r.password,e.host=r.host,e.port=r.port,c=Cl;continue}c=fl;}else c=pl;break;case ll:if(c=pl,"/"!=i||"/"!=p.charAt(l+1))continue;l++;break;case pl:if("/"!=i&&"\\"!=i){c=fl;continue}break;case fl:if("@"==i){f&&(p="%40"+p),f=!0,s=ht(p);for(var g=0;g<s.length;g++){var m=s[g];if(":"!=m||d){var v=zc(m,Yc);d?e.password+=v:e.username+=v;}else d=!0;}p="";}else if(i==_c||"/"==i||"?"==i||"#"==i||"\\"==i&&Xc(e)){if(f&&""==p)return "Invalid authority";l-=ht(p).length+1,p="",c=hl;}else p+=i;break;case hl:case dl:if(n&&"file"==e.scheme){c=yl;continue}if(":"!=i||h){if(i==_c||"/"==i||"?"==i||"#"==i||"\\"==i&&Xc(e)){if(Xc(e)&&""==p)return "Invalid host";if(n&&""==p&&(Jc(e)||null!==e.port))return;if(a=Fc(e,p))return a;if(p="",c=_l,n)return;continue}"["==i?h=!0:"]"==i&&(h=!1),p+=i;}else {if(""==p)return "Invalid host";if(a=Fc(e,p))return a;if(p="",c=gl,n==dl)return}break;case gl:if(!Rc.test(i)){if(i==_c||"/"==i||"?"==i||"#"==i||"\\"==i&&Xc(e)||n){if(""!=p){var y=parseInt(p,10);if(y>65535)return "Invalid port";e.port=Xc(e)&&y===Wc[e.scheme]?null:y,p="";}if(n)return;c=_l;continue}return "Invalid port"}p+=i;break;case ml:if(e.scheme="file","/"==i||"\\"==i)c=vl;else {if(!r||"file"!=r.scheme){c=Cl;continue}if(i==_c)e.host=r.host,e.path=r.path.slice(),e.query=r.query;else if("?"==i)e.host=r.host,e.path=r.path.slice(),e.query="",c=Ml;else {if("#"!=i){el(o.slice(l).join(""))||(e.host=r.host,e.path=r.path.slice(),tl(e)),c=Cl;continue}e.host=r.host,e.path=r.path.slice(),e.query=r.query,e.fragment="",c=Sl;}}break;case vl:if("/"==i||"\\"==i){c=yl;break}r&&"file"==r.scheme&&!el(o.slice(l).join(""))&&(Zc(r.path[0],!0)?e.path.push(r.path[0]):e.host=r.host),c=Cl;continue;case yl:if(i==_c||"/"==i||"\\"==i||"?"==i||"#"==i){if(!n&&Zc(p))c=Cl;else if(""==p){if(e.host="",n)return;c=_l;}else {if(a=Fc(e,p))return a;if("localhost"==e.host&&(e.host=""),n)return;p="",c=_l;}continue}p+=i;break;case _l:if(Xc(e)){if(c=Cl,"/"!=i&&"\\"!=i)continue}else if(n||"?"!=i)if(n||"#"!=i){if(i!=_c&&(c=Cl,"/"!=i))continue}else e.fragment="",c=Sl;else e.query="",c=Ml;break;case Cl:if(i==_c||"/"==i||"\\"==i&&Xc(e)||!n&&("?"==i||"#"==i)){if(".."===(u=(u=p).toLowerCase())||"%2e."===u||".%2e"===u||"%2e%2e"===u?(tl(e),"/"==i||"\\"==i&&Xc(e)||e.path.push("")):nl(p)?"/"==i||"\\"==i&&Xc(e)||e.path.push(""):("file"==e.scheme&&!e.path.length&&Zc(p)&&(e.host&&(e.host=""),p=p.charAt(0)+":"),e.path.push(p)),p="","file"==e.scheme&&(i==_c||"?"==i||"#"==i))for(;e.path.length>1&&""===e.path[0];)e.path.shift();"?"==i?(e.query="",c=Ml):"#"==i&&(e.fragment="",c=Sl);}else p+=zc(i,$c);break;case Il:"?"==i?(e.query="",c=Ml):"#"==i?(e.fragment="",c=Sl):i!=_c&&(e.path[0]+=zc(i,Vc));break;case Ml:n||"#"!=i?i!=_c&&("'"==i&&Xc(e)?e.query+="%27":e.query+="#"==i?"%23":zc(i,Vc)):(e.fragment="",c=Sl);break;case Sl:i!=_c&&(e.fragment+=zc(i,Kc));}l++;}},El=function(e){var t,n,r=To(this,El,"URL"),o=arguments.length>1?arguments[1]:void 0,s=String(e),a=Ec(r,{type:"URL"});if(void 0!==o)if(o instanceof El)t=Dc(o);else if(n=Tl(t={},String(o)))throw TypeError(n);if(n=Tl(a,s,null,t))throw TypeError(n);var u=a.searchParams=new Sc,c=Tc(u);c.updateSearchParams(a.query),c.updateURL=function(){a.query=String(u)||null;},i||(r.href=kl.call(r),r.origin=wl.call(r),r.protocol=Al.call(r),r.username=bl.call(r),r.password=Rl.call(r),r.host=Ol.call(r),r.hostname=Ll.call(r),r.port=Nl.call(r),r.pathname=Pl.call(r),r.search=Gl.call(r),r.searchParams=xl.call(r),r.hash=Ul.call(r));},Dl=El.prototype,kl=function(){var e=Dc(this),t=e.scheme,n=e.username,r=e.password,o=e.host,i=e.port,s=e.path,a=e.query,u=e.fragment,c=t+":";return null!==o?(c+="//",Jc(e)&&(c+=n+(r?":"+r:"")+"@"),c+=Hc(o),null!==i&&(c+=":"+i)):"file"==t&&(c+="//"),c+=e.cannotBeABaseURL?s[0]:s.length?"/"+s.join("/"):"",null!==a&&(c+="?"+a),null!==u&&(c+="#"+u),c},wl=function(){var e=Dc(this),t=e.scheme,n=e.port;if("blob"==t)try{return new URL(t.path[0]).origin}catch(mC){return "null"}return "file"!=t&&Xc(e)?t+"://"+Hc(e.host)+(null!==n?":"+n:""):"null"},Al=function(){return Dc(this).scheme+":"},bl=function(){return Dc(this).username},Rl=function(){return Dc(this).password},Ol=function(){var e=Dc(this),t=e.host,n=e.port;return null===t?"":null===n?Hc(t):Hc(t)+":"+n},Ll=function(){var e=Dc(this).host;return null===e?"":Hc(e)},Nl=function(){var e=Dc(this).port;return null===e?"":String(e)},Pl=function(){var e=Dc(this),t=e.path;return e.cannotBeABaseURL?t[0]:t.length?"/"+t.join("/"):""},Gl=function(){var e=Dc(this).query;return e?"?"+e:""},xl=function(){return Dc(this).searchParams},Ul=function(){var e=Dc(this).fragment;return e?"#"+e:""},ql=function(e,t){return {get:e,set:t,configurable:!0,enumerable:!0}};if(i&&Mt(Dl,{href:ql(kl,(function(e){var t=Dc(this),n=String(e),r=Tl(t,n);if(r)throw TypeError(r);Tc(t.searchParams).updateSearchParams(t.query);})),origin:ql(wl),protocol:ql(Al,(function(e){var t=Dc(this);Tl(t,String(e)+":",rl);})),username:ql(bl,(function(e){var t=Dc(this),n=ht(String(e));if(!Qc(t)){t.username="";for(var r=0;r<n.length;r++)t.username+=zc(n[r],Yc);}})),password:ql(Rl,(function(e){var t=Dc(this),n=ht(String(e));if(!Qc(t)){t.password="";for(var r=0;r<n.length;r++)t.password+=zc(n[r],Yc);}})),host:ql(Ol,(function(e){var t=Dc(this);t.cannotBeABaseURL||Tl(t,String(e),hl);})),hostname:ql(Ll,(function(e){var t=Dc(this);t.cannotBeABaseURL||Tl(t,String(e),dl);})),port:ql(Nl,(function(e){var t=Dc(this);Qc(t)||(""==(e=String(e))?t.port=null:Tl(t,e,gl));})),pathname:ql(Pl,(function(e){var t=Dc(this);t.cannotBeABaseURL||(t.path=[],Tl(t,e+"",_l));})),search:ql(Gl,(function(e){var t=Dc(this);""==(e=String(e))?t.query=null:("?"==e.charAt(0)&&(e=e.slice(1)),t.query="",Tl(t,e,Ml)),Tc(t.searchParams).updateSearchParams(t.query);})),searchParams:ql(xl),hash:ql(Ul,(function(e){var t=Dc(this);""!=(e=String(e))?("#"==e.charAt(0)&&(e=e.slice(1)),t.fragment="",Tl(t,e,Sl)):t.fragment=null;}))}),Z(Dl,"toJSON",(function(){return kl.call(this)}),{enumerable:!0}),Z(Dl,"toString",(function(){return kl.call(this)}),{enumerable:!0}),Mc){var Fl=Mc.createObjectURL,jl=Mc.revokeObjectURL;Fl&&Z(El,"createObjectURL",(function(e){return Fl.apply(Mc,arguments)})),jl&&Z(El,"revokeObjectURL",(function(e){return jl.apply(Mc,arguments)}));}Vt(El,"URL"),Ae({global:!0,forced:!qu,sham:!i},{URL:El});var Bl={JSON:{TYPE:{C2C:{NOTICE:1,COMMON:9,EVENT:10},GROUP:{COMMON:3,TIP:4,SYSTEM:5,TIP2:6},FRIEND:{NOTICE:7},PROFILE:{NOTICE:8}},SUBTYPE:{C2C:{COMMON:0,READED:92,KICKEDOUT:96},GROUP:{COMMON:0,LOVEMESSAGE:1,TIP:2,REDPACKET:3}},OPTIONS:{GROUP:{JOIN:1,QUIT:2,KICK:3,SET_ADMIN:4,CANCEL_ADMIN:5,MODIFY_GROUP_INFO:6,MODIFY_MEMBER_INFO:7}}},PROTOBUF:{},IMAGE_TYPES:{ORIGIN:1,LARGE:2,SMALL:3},IMAGE_FORMAT:{JPG:1,JPEG:1,GIF:2,PNG:3,BMP:4,UNKNOWN:255}},Hl=1,Vl=2,Kl=3,$l=4,Yl=5,zl=7,Wl=8,Xl=9,Jl=10,Ql=15,Zl=255,ep=2,tp=0,np=1,rp={NICK:"Tag_Profile_IM_Nick",GENDER:"Tag_Profile_IM_Gender",BIRTHDAY:"Tag_Profile_IM_BirthDay",LOCATION:"Tag_Profile_IM_Location",SELFSIGNATURE:"Tag_Profile_IM_SelfSignature",ALLOWTYPE:"Tag_Profile_IM_AllowType",LANGUAGE:"Tag_Profile_IM_Language",AVATAR:"Tag_Profile_IM_Image",MESSAGESETTINGS:"Tag_Profile_IM_MsgSettings",ADMINFORBIDTYPE:"Tag_Profile_IM_AdminForbidType",LEVEL:"Tag_Profile_IM_Level",ROLE:"Tag_Profile_IM_Role"},op={UNKNOWN:"Gender_Type_Unknown",FEMALE:"Gender_Type_Female",MALE:"Gender_Type_Male"},ip={NONE:"AdminForbid_Type_None",SEND_OUT:"AdminForbid_Type_SendOut"},sp={NEED_CONFIRM:"AllowType_Type_NeedConfirm",ALLOW_ANY:"AllowType_Type_AllowAny",DENY_ANY:"AllowType_Type_DenyAny"},ap=function(){function e(t){kn(this,e),this._imageMemoryURL="",this._file=t.file,Rs?this.createImageDataASURLInWXMiniApp(t.file):this.createImageDataASURLInWeb(t.file),this._initImageInfoModel(),this.type=pn.MSG_IMAGE,this._percent=0,this.content={imageFormat:Bl.IMAGE_FORMAT[t.imageFormat]||Bl.IMAGE_FORMAT.UNKNOWN,uuid:t.uuid,imageInfoArray:[]},this.initImageInfoArray(t.imageInfoArray),this._defaultImage="http://imgcache.qq.com/open/qcloud/video/act/webim-images/default.jpg",this._autoFixUrl();}return An(e,[{key:"_initImageInfoModel",value:function(){var e=this;this._ImageInfoModel=function(t){this.instanceID=wa(9999999),this.sizeType=t.type||0,this.size=t.size||0,this.width=t.width||0,this.height=t.height||0,this.imageUrl=t.url||"",this.url=t.url||e._imageMemoryURL||e._defaultImage;},this._ImageInfoModel.prototype={setSizeType:function(e){this.sizeType=e;},setImageUrl:function(e){e&&(this.imageUrl=e);},getImageUrl:function(){return this.imageUrl}};}},{key:"initImageInfoArray",value:function(e){for(var t=2,n=null,r=null;t>=0;)r=void 0===e||void 0===e[t]?{type:0,size:0,width:0,height:0,url:""}:e[t],(n=new this._ImageInfoModel(r)).setSizeType(t+1),this.addImageInfo(n),t--;}},{key:"updateImageInfoArray",value:function(e){for(var t,n=this.content.imageInfoArray.length,r=0;r<n;r++)t=this.content.imageInfoArray[r],e.size&&(t.size=e.size),e.url&&t.setImageUrl(e.url),e.width&&(t.width=e.width),e.height&&(t.height=e.height);}},{key:"_autoFixUrl",value:function(){for(var e=this.content.imageInfoArray.length,t="",n="",r=["http","https"],o=null,i=0;i<e;i++)this.content.imageInfoArray[i].url&&""!==(o=this.content.imageInfoArray[i]).imageUrl&&(n=o.imageUrl.slice(0,o.imageUrl.indexOf("://")+1),t=o.imageUrl.slice(o.imageUrl.indexOf("://")+1),r.indexOf(n)<0&&(n="https:"),this.content.imageInfoArray[i].setImageUrl([n,t].join("")));}},{key:"updatePercent",value:function(e){this._percent=e,this._percent>1&&(this._percent=1);}},{key:"updateImageFormat",value:function(e){this.content.imageFormat=e;}},{key:"createImageDataASURLInWeb",value:function(e){void 0!==e&&e.files.length>0&&(this._imageMemoryURL=window.URL.createObjectURL(e.files[0]));}},{key:"createImageDataASURLInWXMiniApp",value:function(e){e&&e.url&&(this._imageMemoryURL=e.url);}},{key:"replaceImageInfo",value:function(e,t){this.content.imageInfoArray[t]instanceof this._ImageInfoModel||(this.content.imageInfoArray[t]=e);}},{key:"addImageInfo",value:function(e){this.content.imageInfoArray.length>=3||this.content.imageInfoArray.push(e);}},{key:"sendable",value:function(){return 0!==this.content.imageInfoArray.length&&(""!==this.content.imageInfoArray[0].imageUrl&&0!==this.content.imageInfoArray[0].size)}}]),e}(),up=function(){function e(t){kn(this,e),this.type=pn.MSG_FACE,this.content=t||null;}return An(e,[{key:"sendable",value:function(){return null!==this.content}}]),e}(),cp=function(){function e(t){kn(this,e),this.type=pn.MSG_AUDIO,this._percent=0,this.content={downloadFlag:2,second:t.second,size:t.size,url:t.url,remoteAudioUrl:"",uuid:t.uuid};}return An(e,[{key:"updatePercent",value:function(e){this._percent=e,this._percent>1&&(this._percent=1);}},{key:"updateAudioUrl",value:function(e){this.content.remoteAudioUrl=e;}},{key:"sendable",value:function(){return ""!==this.content.remoteAudioUrl}}]),e}();Ae({target:"Object",stat:!0,forced:!i,sham:!i},{defineProperty:w.f});var lp={from:!0,groupID:!0,groupName:!0,to:!0},pp=function(){function e(t){kn(this,e),this.type=pn.MSG_GRP_TIP,this.content={},this._initContent(t);}return An(e,[{key:"_initContent",value:function(e){var t=this;Object.keys(e).forEach((function(n){switch(n){case"remarkInfo":break;case"groupProfile":t.content.groupProfile={},t._initGroupProfile(e[n]);break;case"operatorInfo":case"memberInfoList":break;case"msgMemberInfo":t.content.memberList=e[n],Object.defineProperty(t.content,"msgMemberInfo",{get:function(){return ca.warn("!!! 禁言的群提示消息中的 payload.msgMemberInfo 属性即将废弃，请使用 payload.memberList 属性替代。 \n","msgMemberInfo 中的 shutupTime 属性对应更改为 memberList 中的 muteTime 属性，表示禁言时长。 \n","参考：群提示消息 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html#.GroupTipPayload"),t.content.memberList.map((function(e){return {userID:e.userID,shutupTime:e.muteTime}}))}});break;default:t.content[n]=e[n];}})),this.content.userIDList||(this.content.userIDList=[this.content.operatorID]);}},{key:"_initGroupProfile",value:function(e){for(var t=Object.keys(e),n=0;n<t.length;n++){var r=t[n];lp[r]&&(this.content.groupProfile[r]=e[r]);}}}]),e}(),fp={from:!0,groupID:!0,name:!0,to:!0},hp=function(){function e(t){kn(this,e),this.type=pn.MSG_GRP_SYS_NOTICE,this.content={},this._initContent(t);}return An(e,[{key:"_initContent",value:function(e){var t=this;Object.keys(e).forEach((function(n){switch(n){case"memberInfoList":break;case"remarkInfo":t.content.handleMessage=e[n];break;case"groupProfile":t.content.groupProfile={},t._initGroupProfile(e[n]);break;default:t.content[n]=e[n];}}));}},{key:"_initGroupProfile",value:function(e){for(var t=Object.keys(e),n=0;n<t.length;n++){var r=t[n];fp[r]&&(this.content.groupProfile[r]=e[r]);}}}]),e}(),dp=Math.min,gp=[].lastIndexOf,mp=!!gp&&1/[1].lastIndexOf(1,-0)<0,vp=Ke("lastIndexOf"),yp=We("indexOf",{ACCESSORS:!0,1:0}),_p=mp||!vp||!yp?function(e){if(mp)return gp.apply(this,arguments)||0;var t=g(this),n=ae(t.length),r=n-1;for(arguments.length>1&&(r=dp(r,ie(arguments[1]))),r<0&&(r=n+r);r>=0;r--)if(r in t&&t[r]===e)return r||0;return -1}:gp;Ae({target:"Array",proto:!0,forced:_p!==[].lastIndexOf},{lastIndexOf:_p});var Cp={70001:"UserSig 已过期，请重新生成。建议 UserSig 有效期设置不小于24小时。",70002:"UserSig 长度为0，请检查传入的 UserSig 是否正确。",70003:"UserSig 非法，请使用官网提供的 API 重新生成 UserSig(https://cloud.tencent.com/document/product/269/32688)。",70005:"UserSig 非法，请使用官网提供的 API 重新生成 UserSig(https://cloud.tencent.com/document/product/269/32688)。",70009:"UserSig 验证失败，可能因为生成 UserSig 时混用了其他 SDKAppID 的私钥或密钥导致，请使用对应 SDKAppID 下的私钥或密钥重新生成 UserSig(https://cloud.tencent.com/document/product/269/32688)。",70013:"请求中的 UserID 与生成 UserSig 时使用的 UserID 不匹配，您可以在即时通信 IM 控制台的【开发辅助工具(https://console.cloud.tencent.com/im-detail/tool-usersig)】页面校验 UserSig。",70014:"请求中的 SDKAppID 与生成 UserSig 时使用的 SDKAppID 不匹配，您可以在即时通信 IM 控制台的【开发辅助工具(https://console.cloud.tencent.com/im-detail/tool-usersig)】页面校验 UserSig。",70016:"密钥不存在，UserSig 验证失败，请在即时通信 IM 控制台获取密钥(https://cloud.tencent.com/document/product/269/32578#.E8.8E.B7.E5.8F.96.E5.AF.86.E9.92.A5)。",70020:"SDKAppID 未找到，请在即时通信 IM 控制台确认应用信息。",70050:"UserSig 验证次数过于频繁。请检查 UserSig 是否正确，并于1分钟后重新验证。您可以在即时通信 IM 控制台的【开发辅助工具(https://console.cloud.tencent.com/im-detail/tool-usersig)】页面校验 UserSig。",70051:"帐号被拉入黑名单。",70052:"UserSig 已经失效，请重新生成，再次尝试。",70107:"因安全原因被限制登录，请不要频繁登录。",70169:"请求的用户帐号不存在。",70114:"服务端内部超时，请稍后重试。",70202:"服务端内部超时，请稍后重试。",70206:"请求中批量数量不合法。",70402:"参数非法，请检查必填字段是否填充，或者字段的填充是否满足协议要求。",70403:"请求失败，需要 App 管理员权限。",70398:"帐号数超限。如需创建多于100个帐号，请将应用升级为专业版，具体操作指引请参见购买指引(https://cloud.tencent.com/document/product/269/32458)。",70500:"服务端内部错误，请稍后重试。",71e3:"删除帐号失败。仅支持删除体验版帐号，您当前应用为专业版，暂不支持帐号删除。",20001:"请求包非法。",20002:"UserSig 或 A2 失效。",20003:"消息发送方或接收方 UserID 无效或不存在，请检查 UserID 是否已导入即时通信 IM。",20004:"网络异常，请重试。",20005:"服务端内部错误，请重试。",20006:"触发发送单聊消息之前回调，App 后台返回禁止下发该消息。",20007:"发送单聊消息，被对方拉黑，禁止发送。消息发送状态默认展示为失败，您可以登录控制台修改该场景下的消息发送状态展示结果，具体操作请参见消息保留设置(https://cloud.tencent.com/document/product/269/38656)。",20009:"消息发送双方互相不是好友，禁止发送（配置单聊消息校验好友关系才会出现）。",20010:"发送单聊消息，自己不是对方的好友（单向关系），禁止发送。",20011:"发送单聊消息，对方不是自己的好友（单向关系），禁止发送。",20012:"发送方被禁言，该条消息被禁止发送。",20016:"消息撤回超过了时间限制（默认2分钟）。",20018:"删除漫游内部错误。",90001:"JSON 格式解析失败，请检查请求包是否符合 JSON 规范。",90002:"JSON 格式请求包中 MsgBody 不符合消息格式描述，或者 MsgBody 不是 Array 类型，请参考 TIMMsgElement 对象的定义(https://cloud.tencent.com/document/product/269/2720#.E6.B6.88.E6.81.AF.E5.85.83.E7.B4.A0-timmsgelement)。",90003:"JSON 格式请求包体中缺少 To_Account 字段或者 To_Account 帐号不存在。",90005:"JSON 格式请求包体中缺少 MsgRandom 字段或者 MsgRandom 字段不是 Integer 类型。",90006:"JSON 格式请求包体中缺少 MsgTimeStamp 字段或者 MsgTimeStamp 字段不是 Integer 类型。",90007:"JSON 格式请求包体中 MsgBody 类型不是 Array 类型，请将其修改为 Array 类型。",90008:"JSON 格式请求包体中缺少 From_Account 字段或者 From_Account 帐号不存在。",90009:"请求需要 App 管理员权限。",90010:"JSON 格式请求包不符合消息格式描述，请参考 TIMMsgElement 对象的定义(https://cloud.tencent.com/document/product/269/2720#.E6.B6.88.E6.81.AF.E5.85.83.E7.B4.A0-timmsgelement)。",90011:"批量发消息目标帐号超过500，请减少 To_Account 中目标帐号数量。",90012:"To_Account 没有注册或不存在，请确认 To_Account 是否导入即时通信 IM 或者是否拼写错误。",90026:"消息离线存储时间错误（最多不能超过7天）。",90031:"JSON 格式请求包体中 SyncOtherMachine 字段不是 Integer 类型。",90044:"JSON 格式请求包体中 MsgLifeTime 字段不是 Integer 类型。",90048:"请求的用户帐号不存在。",90054:"撤回请求中的 MsgKey 不合法。",90994:"服务内部错误，请重试。",90995:"服务内部错误，请重试。",91e3:"服务内部错误，请重试。",90992:"服务内部错误，请重试；如果所有请求都返回该错误码，且 App 配置了第三方回调，请检查 App 服务端是否正常向即时通信 IM 后台服务端返回回调结果。",93e3:"JSON 数据包超长，消息包体请不要超过8k。",91101:"Web 端长轮询被踢（Web 端同时在线实例个数超出限制）。",10002:"服务端内部错误，请重试。",10003:"请求中的接口名称错误，请核对接口名称并重试。",10004:"参数非法，请根据错误描述检查请求是否正确。",10005:"请求包体中携带的帐号数量过多。",10006:"操作频率限制，请尝试降低调用的频率。",10007:"操作权限不足，例如 Public 群组中普通成员尝试执行踢人操作，但只有 App 管理员才有权限。",10008:"请求非法，可能是请求中携带的签名信息验证不正确，请再次尝试。",10009:"该群不允许群主主动退出。",10010:"群组不存在，或者曾经存在过，但是目前已经被解散。",10011:"解析 JSON 包体失败，请检查包体的格式是否符合 JSON 格式。",10012:"发起操作的 UserID 非法，请检查发起操作的用户 UserID 是否填写正确。",10013:"被邀请加入的用户已经是群成员。",10014:"群已满员，无法将请求中的用户加入群组，如果是批量加人，可以尝试减少加入用户的数量。",10015:"找不到指定 ID 的群组。",10016:"App 后台通过第三方回调拒绝本次操作。",10017:"因被禁言而不能发送消息，请检查发送者是否被设置禁言。",10018:"应答包长度超过最大包长（1MB），请求的内容过多，请尝试减少单次请求的数据量。",10019:"请求的用户帐号不存在。",10021:"群组 ID 已被使用，请选择其他的群组 ID。",10023:"发消息的频率超限，请延长两次发消息时间的间隔。",10024:"此邀请或者申请请求已经被处理。",10025:"群组 ID 已被使用，并且操作者为群主，可以直接使用。",10026:"该 SDKAppID 请求的命令字已被禁用。",10030:"请求撤回的消息不存在。",10031:"消息撤回超过了时间限制（默认2分钟）。",10032:"请求撤回的消息不支持撤回操作。",10033:"群组类型不支持消息撤回操作。",10034:"该消息类型不支持删除操作。",10035:"音视频聊天室和在线成员广播大群不支持删除消息。",10036:"音视频聊天室创建数量超过了限制，请参考价格说明(https://cloud.tencent.com/document/product/269/11673)购买预付费套餐“IM音视频聊天室”。",10037:"单个用户可创建和加入的群组数量超过了限制，请参考价格说明(https://cloud.tencent.com/document/product/269/11673)购买或升级预付费套餐“单人可创建与加入群组数”。",10038:"群成员数量超过限制，请参考价格说明(https://cloud.tencent.com/document/product/269/11673)购买或升级预付费套餐“扩展群人数上限”。",10041:"该应用（SDKAppID）已配置不支持群消息撤回。"},Ip=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this)).code=e.code,r.message=Cp[e.code]||e.message,r.data=e.data||{},r}return n}(Un(Error)),Mp=2e3,Sp=2001,Tp=2002,Ep=2003,Dp=2022,kp=2023,wp=2040,Ap=2100,bp=2103,Rp=2105,Op=2106,Lp=2108,Np=2109,Pp=2110,Gp=2251,xp=2252,Up=2253,qp=2300,Fp=2301,jp=2350,Bp=2351,Hp=2352,Vp=2400,Kp=2401,$p=2402,Yp=2403,zp=2500,Wp=2501,Xp=2502,Jp=2600,Qp=2601,Zp=2620,ef=2621,tf=2622,nf=2660,rf=2661,of=2662,sf=2680,af=2681,uf=2682,cf=2683,lf=2684,pf=2685,ff=2700,hf=2721,df=2722,gf=2740,mf=2741,vf=2742,yf=2800,_f=2801,Cf=2802,If=2803,Mf=2804,Sf=2805,Tf=2900,Ef=2901,Df=2902,kf=2903,wf=2904,Af=2999,bf=91101,Rf=20002,Of=70001,Lf="无 SDKAppID",Nf="无 accountType",Pf="无 userID",Gf="无 userSig",xf="无 tinyID",Uf="无 a2key",qf="未检测到 COS 上传插件",Ff="消息发送失败",jf="MessageController.constructor() 需要参数 options",Bf="需要 Message 的实例",Hf='Message.conversationType 只能为 "C2C" 或 "GROUP"',Vf="无法发送空文件",Kf="回调函数运行时遇到错误，请检查接入侧代码",$f="消息撤回失败",Yf="请先选择一个图片",zf="只允许上传 jpg png jpeg gif 格式的图片",Wf="图片大小超过20M，无法发送",Xf="语音上传失败",Jf="语音大小大于20M，无法发送",Qf="视频上传失败",Zf="视频大小超过100M，无法发送",eh="只允许上传 mp4 格式的视频",th="文件上传失败",nh="请先选择一个文件",rh="文件大小超过100M，无法发送 ",oh="缺少必要的参数文件 URL",ih="没有找到相应的会话，请检查传入参数",sh="没有找到相应的用户或群组，请检查传入参数",ah="未记录的会话类型",uh="非法的群类型，请检查传入参数",ch="不能加入 Private 类型的群组",lh="AVChatRoom 类型的群组不能转让群主",ph="不能把群主转让给自己",fh="不能解散 Private 类型的群组",hh="加群失败，请检查传入参数或重试",dh="AVChatRoom 类型的群不支持邀请群成员",gh="非 AVChatRoom 类型的群组不允许匿名加群，请先登录后再加群",mh="不能在 AVChatRoom 类型的群组踢人",vh="你不是群主，只有群主才有权限操作",yh="不能在 Private / AVChatRoom 类型的群中设置群成员身份",_h="不合法的群成员身份，请检查传入参数",Ch="不能设置自己的群成员身份，请检查传入参数",Ih="不能将自己禁言，请检查传入参数",Mh="传入 deleteFriend 接口的参数无效",Sh="传入 updateMyProfile 接口的参数无效",Th="updateMyProfile 无标配资料字段或自定义资料字段",Eh="传入 addToBlacklist 接口的参数无效",Dh="传入 removeFromBlacklist 接口的参数无效",kh="不能拉黑自己",wh="网络层初始化错误，缺少 URL 参数",Ah="打包错误，未定义的 serverName",bh="未定义的 packageConfig",Rh="未连接到网络",Oh="不规范的参数名称",Lh="意料外的通知条件",Nh="_syncOffset 丢失",Ph="获取 longpolling id 失败",Gh="接口需要 SDK 处于 ready 状态后才能调用",xh=["jpg","jpeg","gif","png"],Uh=["mp4"],qh=function(){function e(t){kn(this,e);var n=this._check(t);if(n instanceof Ip)throw n;this.type=pn.MSG_FILE,this._percent=0;var r=this._getFileInfo(t);this.content={downloadFlag:2,fileUrl:t.url||"",uuid:t.uuid,fileName:r.name||"",fileSize:r.size||0};}return An(e,[{key:"_getFileInfo",value:function(e){if(e.fileName&&e.fileSize)return {size:e.fileSize,name:e.fileName};if(Rs)return {};var t=e.file.files[0];return {size:t.size,name:t.name,type:t.type.slice(t.type.lastIndexOf("/")+1).toLowerCase()}}},{key:"updatePercent",value:function(e){this._percent=e,this._percent>1&&(this._percent=1);}},{key:"updateFileUrl",value:function(e){this.content.fileUrl=e;}},{key:"_check",value:function(e){if(e.size>104857600)return new Ip({code:$p,message:"".concat(rh,": ").concat(104857600," bytes")})}},{key:"sendable",value:function(){return ""!==this.content.fileUrl&&(""!==this.content.fileName&&0!==this.content.fileSize)}}]),e}(),Fh=function(){function e(t){kn(this,e),this.type=pn.MSG_CUSTOM,this.content={data:t.data||"",description:t.description||"",extension:t.extension||""};}return An(e,[{key:"setData",value:function(e){return this.content.data=e,this}},{key:"setDescription",value:function(e){return this.content.description=e,this}},{key:"setExtension",value:function(e){return this.content.extension=e,this}},{key:"sendable",value:function(){return 0!==this.content.data.length||0!==this.content.description.length||0!==this.content.extension.length}}]),e}(),jh=function(){function e(t){kn(this,e),this.type=pn.MSG_VIDEO,this._percent=0,this.content={remoteVideoUrl:t.remoteVideoUrl,videoFormat:t.videoFormat,videoSecond:parseInt(t.videoSecond,10),videoSize:t.videoSize,videoUrl:t.videoUrl,videoDownloadFlag:2,videoUUID:t.videoUUID,thumbUUID:t.thumbUUID,thumbFormat:t.thumbFormat,thumbWidth:t.thumbWidth,thumbHeight:t.thumbHeight,thumbSize:t.thumbSize,thumbDownloadFlag:2,thumbUrl:t.thumbUrl};}return An(e,[{key:"updatePercent",value:function(e){this._percent=e,this._percent>1&&(this._percent=1);}},{key:"updateVideoUrl",value:function(e){e&&(this.content.remoteVideoUrl=e);}},{key:"sendable",value:function(){return ""!==this.content.remoteVideoUrl}}]),e}(),Bh=function e(t){kn(this,e),this.type=pn.MSG_GEO,this.content=t;},Hh={1:pn.MSG_PRIORITY_HIGH,2:pn.MSG_PRIORITY_NORMAL,3:pn.MSG_PRIORITY_LOW,4:pn.MSG_PRIORITY_LOWEST},Vh=function(){function e(t){kn(this,e),this.ID="",this.conversationID=t.conversationID||null,this.conversationType=t.conversationType||pn.CONV_C2C,this.conversationSubType=t.conversationSubType,this.time=t.time||Math.ceil(Date.now()/1e3),this.sequence=t.sequence||0,this.clientSequence=t.clientSequence||t.sequence||0,this.random=t.random||wa(),this.priority=this._computePriority(t.priority),this.nick="",this.avatar="",this._elements=[],this.isPlaceMessage=t.isPlaceMessage||0,this.isRevoked=2===t.isPlaceMessage||8===t.msgFlagBits,this.geo={},this.from=t.from||null,this.to=t.to||null,this.flow="",this.isSystemMessage=t.isSystemMessage||!1,this.protocol=t.protocol||"JSON",this.isResend=!1,this.isRead=!1,this.status=t.status||Pu.SUCCESS,this.reInitialize(t.currentUser),this.extractGroupInfo(t.groupProfile||null);}return An(e,[{key:"getElements",value:function(){return this._elements}},{key:"extractGroupInfo",value:function(e){null!==e&&(fa(e.fromAccountNick)&&(this.nick=e.fromAccountNick),fa(e.fromAccountHeadurl)&&(this.avatar=e.fromAccountHeadurl));}},{key:"_initProxy",value:function(){this.payload=this._elements[0].content,this.type=this._elements[0].type;}},{key:"reInitialize",value:function(e){e&&(this.status=this.from?Pu.SUCCESS:Pu.UNSEND,!this.from&&(this.from=e)),this._initFlow(e),this._initielizeSequence(e),this._concactConversationID(e),this.generateMessageID(e);}},{key:"isSendable",value:function(){return 0!==this._elements.length&&("function"!=typeof this._elements[0].sendable?(ca.warn("".concat(this._elements[0].type,' need "boolean : sendable()" method')),!1):this._elements[0].sendable())}},{key:"_initTo",value:function(e){this.conversationType===pn.CONV_GROUP&&(this.to=e.groupID);}},{key:"_initielizeSequence",value:function(e){0===this.clientSequence&&e&&(this.clientSequence=function(e){if(!e)return ca.error("autoincrementIndex(string: key) need key parameter"),!1;if(void 0===Oa[e]){var t=new Date,n="3".concat(t.getHours()).slice(-2),r="0".concat(t.getMinutes()).slice(-2),o="0".concat(t.getSeconds()).slice(-2);Oa[e]=parseInt([n,r,o,"0001"].join("")),n=null,r=null,o=null,ca.warn("utils.autoincrementIndex() create new sequence : ".concat(e," = ").concat(Oa[e]));}return Oa[e]++}(e)),0===this.sequence&&this.conversationType===pn.CONV_C2C&&(this.sequence=this.clientSequence);}},{key:"generateMessageID",value:function(e){var t=e===this.from?1:0,n=this.sequence>0?this.sequence:this.clientSequence;this.ID="".concat(this.conversationID,"-").concat(n,"-").concat(this.random,"-").concat(t);}},{key:"_initFlow",value:function(e){""!==e&&(e===this.from?(this.flow="out",this.isRead=!0):this.flow="in");}},{key:"_concactConversationID",value:function(e){var t=this.to,n="",r=this.conversationType;r!==pn.CONV_SYSTEM?(n=r===pn.CONV_C2C?e===this.from?t:this.from:this.to,this.conversationID="".concat(r).concat(n)):this.conversationID=pn.CONV_SYSTEM;}},{key:"isElement",value:function(e){return e instanceof xu||e instanceof ap||e instanceof up||e instanceof cp||e instanceof qh||e instanceof jh||e instanceof pp||e instanceof hp||e instanceof Fh||e instanceof Bh}},{key:"setElement",value:function(e){var t=this;if(this.isElement(e))return this._elements=[e],void this._initProxy();var n=function(e){switch(e.type){case pn.MSG_TEXT:t.setTextElement(e.content);break;case pn.MSG_IMAGE:t.setImageElement(e.content);break;case pn.MSG_AUDIO:t.setAudioElement(e.content);break;case pn.MSG_FILE:t.setFileElement(e.content);break;case pn.MSG_VIDEO:t.setVideoElement(e.content);break;case pn.MSG_CUSTOM:t.setCustomElement(e.content);break;case pn.MSG_GEO:t.setGEOElement(e.content);break;case pn.MSG_GRP_TIP:t.setGroupTipElement(e.content);break;case pn.MSG_GRP_SYS_NOTICE:t.setGroupSystemNoticeElement(e.content);break;case pn.MSG_FACE:t.setFaceElement(e.content);break;default:ca.warn(e.type,e.content,"no operation......");}};if(Array.isArray(e))for(var r=0;r<e.length;r++)n(e[r]);else n(e);this._initProxy();}},{key:"setTextElement",value:function(e){var t="string"==typeof e?e:e.text,n=new xu({text:t});this._elements.push(n);}},{key:"setImageElement",value:function(e){var t=new ap(e);this._elements.push(t);}},{key:"setAudioElement",value:function(e){var t=new cp(e);this._elements.push(t);}},{key:"setFileElement",value:function(e){var t=new qh(e);this._elements.push(t);}},{key:"setVideoElement",value:function(e){var t=new jh(e);this._elements.push(t);}},{key:"setGEOElement",value:function(e){var t=new Bh(e);this._elements.push(t);}},{key:"setCustomElement",value:function(e){var t=new Fh(e);this._elements.push(t);}},{key:"setGroupTipElement",value:function(e){if(e.operatorInfo){var t=e.operatorInfo,n=t.nick,r=t.avatar;fa(n)&&(this.nick=n),fa(r)&&(this.avatar=r);}var o=new pp(e);this._elements.push(o);}},{key:"setGroupSystemNoticeElement",value:function(e){var t=new hp(e);this._elements.push(t);}},{key:"setFaceElement",value:function(e){var t=new up(e);this._elements.push(t);}},{key:"setIsRead",value:function(e){this.isRead=e;}},{key:"_computePriority",value:function(e){if(ma(e))return pn.MSG_PRIORITY_NORMAL;if(fa(e)&&-1!==Object.values(Hh).indexOf(e))return e;if(pa(e)){var t=""+e;if(-1!==Object.keys(Hh).indexOf(t))return Hh[t]}return pn.MSG_PRIORITY_NORMAL}},{key:"elements",get:function(){return ca.warn("！！！Message 实例的 elements 属性即将废弃，请尽快修改。使用 type 和 payload 属性处理单条消息，兼容组合消息使用 _elements 属性！！！"),this._elements}}]),e}(),Kh=function(e){return !!e&&(!!(function(e){return fa(e)&&e.slice(0,3)===pn.CONV_C2C}(e)||function(e){return fa(e)&&e.slice(0,5)===pn.CONV_GROUP}(e)||Ua(e))||(console.warn("非法的会话 ID:".concat(e,"。会话 ID 组成方式：\n  C2C + userID（单聊）\n  GROUP + groupID（群聊）\n  @TIM#SYSTEM（系统通知会话）")),!1))},$h={login:{userID:{type:"String",required:!0},userSig:{type:"String",required:!0}},addToBlacklist:{userIDList:{type:"Array",required:!0}},mutilParam:[{name:"paramName",type:"Number",required:!0},{name:"paramName",type:"String",required:!0}],on:[{name:"eventName",type:"String",validator:function(e){return "string"==typeof e&&0!==e.length||(console.warn("on 接口的 eventName 参数必须是 String 类型，且不能为空。"),!1)}},{name:"handler",type:"Function",validator:function(e){return "function"!=typeof e?(console.warn("on 接口的 handler 参数必须是 Function 类型。"),!1):(""===e.name&&console.warn("on 接口的 handler 参数推荐使用具名函数。具名函数可以使用 off 接口取消订阅，匿名函数无法取消订阅。"),!0)}}],once:[{name:"eventName",type:"String",validator:function(e){return "string"==typeof e&&0!==e.length||(console.warn("once 接口的 eventName 参数必须是 String 类型，且不能为空。"),!1)}},{name:"handler",type:"Function",validator:function(e){return "function"!=typeof e?(console.warn("once 接口的 handler 参数必须是 Function 类型。"),!1):(""===e.name&&console.warn("once 接口的 handler 参数推荐使用具名函数。"),!0)}}],off:[{name:"eventName",type:"String",validator:function(e){return "string"==typeof e&&0!==e.length||(console.warn("off 接口的 eventName 参数必须是 String 类型，且不能为空。"),!1)}},{name:"handler",type:"Function",validator:function(e){return "function"!=typeof e?(console.warn("off 接口的 handler 参数必须是 Function 类型。"),!1):(""===e.name&&console.warn("off 接口的 handler 参数为匿名函数，无法取消订阅。"),!0)}}],sendMessage:[{name:"message",type:"Object",required:!0}],getMessageList:{conversationID:{type:"String",required:!0,validator:function(e){return Kh(e)}},nextReqMessageID:{type:"String"},count:{type:"Number",validator:function(e){return !(!ma(e)&&!/^[1-9][0-9]*$/.test(e))||(console.warn("getMessageList 接口的 count 参数必须为正整数"),!1)}}},setMessageRead:{conversationID:{type:"String",required:!0,validator:function(e){return Kh(e)}}},getConversationProfile:[{name:"conversationID",type:"String",required:!0,validator:function(e){return Kh(e)}}],deleteConversation:[{name:"conversationID",type:"String",required:!0,validator:function(e){return Kh(e)}}],getGroupList:{groupProfileFilter:{type:"Array"}},getGroupProfile:{groupID:{type:"String",required:!0},groupCustomFieldFilter:{type:"Array"},memberCustomFieldFilter:{type:"Array"}},getGroupProfileAdvance:{groupIDList:{type:"Array",required:!0}},createGroup:{name:{type:"String",required:!0}},joinGroup:{groupID:{type:"String",required:!0},type:{type:"String"},applyMessage:{type:"String"}},quitGroup:[{name:"groupID",type:"String",required:!0}],handleApplication:{message:{type:"Object",required:!0},handleAction:{type:"String",required:!0},handleMessage:{type:"String"}},changeGroupOwner:{groupID:{type:"String",required:!0},newOwnerID:{type:"String",required:!0}},updateGroupProfile:{groupID:{type:"String",required:!0},muteAllMembers:{type:"Boolean"}},dismissGroup:[{name:"groupID",type:"String",required:!0}],searchGroupByID:[{name:"groupID",type:"String",required:!0}],getGroupMemberList:{groupID:{type:"String",required:!0},offset:{type:"Number"},count:{type:"Number"}},getGroupMemberProfile:{groupID:{type:"String",required:!0},userIDList:{type:"Array",required:!0},memberCustomFieldFilter:{type:"Array"}},addGroupMemeber:{groupID:{type:"String",required:!0},userIDList:{type:"Array",required:!0}},setGroupMemberRole:{groupID:{type:"String",required:!0},userID:{type:"String",required:!0},role:{type:"String",required:!0}},setGroupMemberMuteTime:{groupID:{type:"String",required:!0},userID:{type:"String",required:!0},muteTime:{type:"Number",validator:function(e){return e>=0}}},setGroupMemberNameCard:{groupID:{type:"String",required:!0},userID:{type:"String"},nameCard:{type:"String",required:!0,validator:function(e){return !0!==/^\s+$/.test(e)}}},setMessageRemindType:{groupID:{type:"String",required:!0},messageRemindType:{type:"String",required:!0}},setGroupMemberCustomField:{groupID:{type:"String",required:!0},userID:{type:"String"},memberCustomField:{type:"Array",required:!0}},deleteGroupMember:{groupID:{type:"String",required:!0}},createTextMessage:{to:{type:"String",required:!0},conversationType:{type:"String",required:!0},payload:{type:"Object",required:!0,validator:function(e){return fa(e.text)?0!==e.text.length||(console.warn("createTextMessage 消息内容不能为空。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createTextMessage"),!1):(console.warn("createTextMessage payload.text 类型必须为字符串。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createTextMessage"),!1)}}},createCustomMessage:{to:{type:"String",required:!0},conversationType:{type:"String",required:!0},payload:{type:"Object",required:!0,validator:function(e){return e.data&&!fa(e.data)?(console.warn("createCustomMessage payload.data 类型必须为 String。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createCustomMessage"),!1):e.description&&!fa(e.description)?(console.warn("createCustomMessage payload.description 类型必须为 String。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createCustomMessage"),!1):!(e.extension&&!fa(e.extension))||(console.warn("createCustomMessage payload.extension 类型必须为 String。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createCustomMessage"),!1)}}},createImageMessage:{to:{type:"String",required:!0},conversationType:{type:"String",required:!0},payload:{type:"Object",required:!0,validator:function(e){if(ma(e.file))return console.warn("createImageMessage payload.file 不能为 undefined。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createImageMessage"),!1;if(bs){if(!(e.file instanceof HTMLInputElement||la(e.file)))return console.warn("createImageMessage payload.file 的类型必须是 HTMLInputElement 或 File。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createImageMessage"),!1;if(e.file instanceof HTMLInputElement&&0===e.file.files.length)return console.warn("createImageMessage 您没有选择文件，无法发送。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createImageMessage"),!1}return !0},onProgress:{type:"Function",required:!1,validator:function(e){return ma(e)&&console.warn("createImageMessage 没有 onProgress 回调，您将无法获取图片上传进度。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createImageMessage"),!0}}}},createAudioMessage:{to:{type:"String",required:!0},conversationType:{type:"String",required:!0},payload:{type:"Object",required:!0},onProgress:{type:"Function",required:!1,validator:function(e){return ma(e)&&console.warn("createAudioMessage 没有 onProgress 回调，您将无法获取音频上传进度。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createAudioMessage"),!0}}},createVideoMessage:{to:{type:"String",required:!0},conversationType:{type:"String",required:!0},payload:{type:"Object",required:!0,validator:function(e){if(ma(e.file))return console.warn("createVideoMessage payload.file 不能为 undefined。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createVideoMessage"),!1;if(bs){if(!(e.file instanceof HTMLInputElement||la(e.file)))return console.warn("createVideoMessage payload.file 的类型必须是 HTMLInputElement 或 File。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createVideoMessage"),!1;if(e.file instanceof HTMLInputElement&&0===e.file.files.length)return console.warn("createVideoMessage 您没有选择文件，无法发送。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createVideoMessage"),!1}return !0}},onProgress:{type:"Function",required:!1,validator:function(e){return ma(e)&&console.warn("createVideoMessage 没有 onProgress 回调，您将无法获取视频上传进度。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createVideoMessage"),!0}}},createFaceMessage:{to:{type:"String",required:!0},conversationType:{type:"String",required:!0},payload:{type:"Object",required:!0,validator:function(e){return !!da(e)&&(pa(e.index)?!!fa(e.data)||(console.warn("createFaceMessage payload.data 类型必须为 String！"),!1):(console.warn("createFaceMessage payload.index 类型必须为 Number！"),!1))}}},createFileMessage:{to:{type:"String",required:!0},conversationType:{type:"String",required:!0},payload:{type:"Object",required:!0,validator:function(e){if(ma(e.file))return console.warn("createFileMessage payload.file 不能为 undefined。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createFileMessage"),!1;if(bs){if(!(e.file instanceof HTMLInputElement||la(e.file)))return console.warn("createFileMessage payload.file 的类型必须是 HTMLInputElement 或 File。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createFileMessage"),!1;if(e.file instanceof HTMLInputElement&&0===e.file.files.length)return console.warn("createFileMessage 您没有选择文件，无法发送。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createFileMessage"),!1}return !0}},onProgress:{type:"Function",required:!1,validator:function(e){return ma(e)&&console.warn("createFileMessage 没有 onProgress 回调，您将无法获取文件上传进度。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createFileMessage"),!0}}},revokeMessage:[{name:"message",type:"Object",required:!0,validator:function(e){return e instanceof Vh?e.conversationType===pn.CONV_SYSTEM?(console.warn("revokeMessage 不能撤回系统会话消息，只能撤回单聊消息或群消息"),!1):!0!==e.isRevoked||(console.warn("revokeMessage 消息已经被撤回，请勿重复操作"),!1):(console.warn("revokeMessage 参数 message 必须为 Message(https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html) 实例。"),!1)}}],getUserProfile:{userIDList:{type:"Array",validator:function(e){return ga(e)?(0===e.length&&console.warn("getUserProfile userIDList 不能为空数组，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#getUserProfile"),!0):(console.warn("getUserProfile userIDList 必须为数组，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#getUserProfile"),!1)}}},updateMyProfile:{profileCustomField:{type:"Array",validator:function(e){return !!ma(e)||(!!ga(e)||(console.warn("updateMyProfile profileCustomField 必须为数组，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#updateMyProfile"),!1))}}}},Yh={login:"login",logout:"logout",on:"on",once:"once",off:"off",setLogLevel:"setLogLevel",downloadLog:"downloadLog",registerPlugin:"registerPlugin",destroy:"destroy",createTextMessage:"createTextMessage",createImageMessage:"createImageMessage",createAudioMessage:"createAudioMessage",createVideoMessage:"createVideoMessage",createCustomMessage:"createCustomMessage",createFaceMessage:"createFaceMessage",createFileMessage:"createFileMessage",sendMessage:"sendMessage",resendMessage:"resendMessage",getMessageList:"getMessageList",setMessageRead:"setMessageRead",revokeMessage:"revokeMessage",getConversationList:"getConversationList",getConversationProfile:"getConversationProfile",deleteConversation:"deleteConversation",getGroupList:"getGroupList",getGroupProfile:"getGroupProfile",createGroup:"createGroup",joinGroup:"joinGroup",updateGroupProfile:"updateGroupProfile",quitGroup:"quitGroup",dismissGroup:"dismissGroup",changeGroupOwner:"changeGroupOwner",searchGroupByID:"searchGroupByID",setMessageRemindType:"setMessageRemindType",handleGroupApplication:"handleGroupApplication",getGroupMemberProfile:"getGroupMemberProfile",getGroupMemberList:"getGroupMemberList",addGroupMember:"addGroupMember",deleteGroupMember:"deleteGroupMember",setGroupMemberNameCard:"setGroupMemberNameCard",setGroupMemberMuteTime:"setGroupMemberMuteTime",setGroupMemberRole:"setGroupMemberRole",setGroupMemberCustomField:"setGroupMemberCustomField",getMyProfile:"getMyProfile",getUserProfile:"getUserProfile",updateMyProfile:"updateMyProfile",getBlacklist:"getBlacklist",addToBlacklist:"addToBlacklist",removeFromBlacklist:"removeFromBlacklist",getFriendList:"getFriendList"},zh="1.7.3",Wh="537048168",Xh="10",Jh="protobuf",Qh="json",Zh={HOST:{TYPE:3,ACCESS_LAYER_TYPES:{SANDBOX:1,TEST:2,PRODUCTION:3},CURRENT:{COMMON:"https://webim.tim.qq.com",PIC:"https://pic.tim.qq.com",COS:"https://yun.tim.qq.com"},PRODUCTION:{COMMON:"https://webim.tim.qq.com",PIC:"https://pic.tim.qq.com",COS:"https://yun.tim.qq.com"},SANDBOX:{COMMON:"https://events.tim.qq.com",PIC:"https://pic.tim.qq.com",COS:"https://yun.tim.qq.com"},TEST:{COMMON:"https://test.tim.qq.com",PIC:"https://pic.tim.qq.com",COS:"https://test.tim.qq.com"},setCurrent:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3;switch(e){case this.ACCESS_LAYER_TYPES.SANDBOX:this.CURRENT=this.SANDBOX,this.TYPE=this.ACCESS_LAYER_TYPES.SANDBOX;break;case this.ACCESS_LAYER_TYPES.TEST:this.CURRENT=this.TEST,this.TYPE=this.ACCESS_LAYER_TYPES.TEST;break;default:this.CURRENT=this.PRODUCTION,this.TYPE=this.ACCESS_LAYER_TYPES.PRODUCTION;}}},NAME:{OPEN_IM:"openim",GROUP:"group_open_http_svc",FRIEND:"sns",PROFILE:"profile",RECENT_CONTACT:"recentcontact",PIC:"openpic",BIG_GROUP_NO_AUTH:"group_open_http_noauth_svc",BIG_GROUP_LONG_POLLING_NO_AUTH:"group_open_long_polling_http_noauth_svc",IM_OPEN_STAT:"imopenstat",WEB_IM:"webim",IM_COS_SIGN:"im_cos_sign_svr"},CMD:{ACCESS_LAYER:"accesslayer",LOGIN:"login",LOGOUT_LONG_POLL:"longpollinglogout",LOGOUT_ALL:"logout",PORTRAIT_GET:"portrait_get_all",PORTRAIT_SET:"portrait_set",GET_LONG_POLL_ID:"getlongpollingid",LONG_POLL:"longpolling",AVCHATROOM_LONG_POLL:"get_msg",FRIEND_ADD:"friend_add",FRIEND_GET_ALL:"friend_get_all",FRIEND_DELETE:"friend_delete",RESPONSE_PENDENCY:"friend_response",GET_PENDENCY:"pendency_get",DELETE_PENDENCY:"pendency_delete",GET_GROUP_PENDENCY:"get_pendency",GET_BLACKLIST:"black_list_get",ADD_BLACKLIST:"black_list_add",DELETE_BLACKLIST:"black_list_delete",CREATE_GROUP:"create_group",GET_JOINED_GROUPS:"get_joined_group_list",SEND_MESSAGE:"sendmsg",REVOKE_C2C_MESSAGE:"msgwithdraw",SEND_GROUP_MESSAGE:"send_group_msg",REVOKE_GROUP_MESSAGE:"group_msg_recall",GET_GROUP_INFO:"get_group_info",GET_GROUP_MEMBER_INFO:"get_specified_group_member_info",GET_GROUP_MEMBER_LIST:"get_group_member_info",QUIT_GROUP:"quit_group",CHANGE_GROUP_OWNER:"change_group_owner",DESTROY_GROUP:"destroy_group",ADD_GROUP_MEMBER:"add_group_member",DELETE_GROUP_MEMBER:"delete_group_member",SEARCH_GROUP_BY_ID:"get_group_public_info",APPLY_JOIN_GROUP:"apply_join_group",HANDLE_APPLY_JOIN_GROUP:"handle_apply_join_group",MODIFY_GROUP_INFO:"modify_group_base_info",MODIFY_GROUP_MEMBER_INFO:"modify_group_member_info",DELETE_GROUP_SYSTEM_MESSAGE:"deletemsg",GET_CONVERSATION_LIST:"get",PAGING_GET_CONVERSATION_LIST:"page_get",DELETE_CONVERSATION:"delete",GET_MESSAGES:"getmsg",GET_C2C_ROAM_MESSAGES:"getroammsg",GET_GROUP_ROAM_MESSAGES:"group_msg_get",SET_C2C_MESSAGE_READ:"msgreaded",SET_GROUP_MESSAGE_READ:"msg_read_report",FILE_READ_AND_WRITE_AUTHKEY:"authkey",FILE_UPLOAD:"pic_up",COS_SIGN:"cos",TIM_WEB_REPORT:"tim_web_report",BIG_DATA_HALLWAY_AUTH_KEY:"authkey"},CHANNEL:{SOCKET:1,XHR:2,AUTO:0},NAME_VERSION:{openim:"v4",group_open_http_svc:"v4",sns:"v4",profile:"v4",recentcontact:"v4",openpic:"v4",group_open_http_noauth_svc:"v1",group_open_long_polling_http_noauth_svc:"v1",imopenstat:"v4",im_cos_sign_svr:"v4",webim:"v4"}};Zh.HOST.setCurrent(Zh.HOST.ACCESS_LAYER_TYPES.PRODUCTION);var ed={request:{toAccount:"To_Account",fromAccount:"From_Account",to:"To_Account",from:"From_Account",groupID:"GroupId",avatar:"FaceUrl"},response:{GroupId:"groupID",Member_Account:"userID",MsgList:"messageList",SyncFlag:"syncFlag",To_Account:"to",From_Account:"from",MsgSeq:"sequence",MsgRandom:"random",MsgTimeStamp:"time",MsgContent:"content",MsgBody:"elements",GroupWithdrawInfoArray:"revokedInfos",WithdrawC2cMsgNotify:"c2cMessageRevokedNotify",C2cWithdrawInfoArray:"revokedInfos",MsgRand:"random",MsgType:"type",MsgShow:"messageShow",NextMsgSeq:"nextMessageSeq",FaceUrl:"avatar",ProfileDataMod:"profileModify",Profile_Account:"userID",ValueBytes:"value",ValueNum:"value",NoticeSeq:"noticeSequence",NotifySeq:"notifySequence",MsgFrom_AccountExtraInfo:"messageFromAccountExtraInformation",Operator_Account:"operatorID",OpType:"operationType",ReportType:"operationType",UserId:"userID",User_Account:"userID",List_Account:"userIDList",MsgOperatorMemberExtraInfo:"operatorInfo",MsgMemberExtraInfo:"memberInfoList",ImageUrl:"avatar",NickName:"nick",MsgGroupNewInfo:"newGroupProfile",MsgAppDefinedData:"groupCustomField",Owner_Account:"ownerID",GroupName:"name",GroupFaceUrl:"avatar",GroupIntroduction:"introduction",GroupNotification:"notification",GroupApplyJoinOption:"joinOption",MsgKey:"messageKey",GroupInfo:"groupProfile",ShutupTime:"muteTime",Desc:"description",Ext:"extension"},ignoreKeyWord:["C2C","ID","USP"]},td="_contextWasUpdated",nd="_contextWasReset",rd="_a2KeyAndTinyIDUpdated",od="_specifiedConfigUpdated",id="_noticeIsSynchronizing",sd="_noticeIsSynchronized",ad="_messageSent",ud="_syncMessageProcessing",cd="_syncMessageFinished",ld="_receiveInstantMessage",pd="_receiveGroupInstantMessage",fd="_receveGroupSystemNotice",hd="_messageRevoked",dd="_longPollGetIDFailed",gd="_longPollRequestFailed",md="_longPollResponseOK",vd="_longPollFastStart",yd="_longPollSlowStart",_d="_longPollKickedOut",Cd="_longPollMitipuleDeviceKickedOut",Id="_longPollGetNewC2CNotice",Md="_longPollGetNewGroupMessages",Sd="_longPollGetNewGroupTips",Td="_longPollGetNewGroupNotice",Ed="_longPollGetNewFriendMessages",Dd="_longPollProfileModified",kd="_longPollNoticeReceiveSystemOrders",wd=" _longpollGroupMessageRevoked",Ad="_longpollC2CMessageRevoked",bd="_avlongPollRequestFailed",Rd="_avlongPollResponseOK",Od="_onGroupListUpdated",Ld="_loginSuccess",Nd="_signLogoutExcuting",Pd="_logoutSuccess",Gd="_a2keyExpired",xd="_errorHasBeenDetected",Ud="_onConversationListUpdated",qd="_onConversationListProfileUpdated",Fd="_conversationDeleted",jd="onProfileUpdated",Bd="joinAVChatRoomSuccess",Hd="joinAVChatRoomSuccessNoAuth",Vd="_sdkStateReady",Kd=Ve.filter,$d=yn("filter"),Yd=We("filter");Ae({target:"Array",proto:!0,forced:!$d||!Yd},{filter:function(e){return Kd(this,e,arguments.length>1?arguments[1]:void 0)}}),Ae({target:"Object",stat:!0,forced:Object.assign!==Bu},{assign:Bu});var zd=Kr.trim;function Wd(e,t){if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");t=Object.assign({pascalCase:!1},t);var n;return 0===(e=Array.isArray(e)?e.map((function(e){return e.trim()})).filter((function(e){return e.length})).join("-"):e.trim()).length?"":1===e.length?t.pascalCase?e.toUpperCase():e.toLowerCase():(e!==e.toLowerCase()&&(e=Xd(e)),e=e.replace(/^[_.\- ]+/,"").toLowerCase().replace(/[_.\- ]+(\w|$)/g,(function(e,t){return t.toUpperCase()})).replace(/\d+(\w|$)/g,(function(e){return e.toUpperCase()})),n=e,t.pascalCase?n.charAt(0).toUpperCase()+n.slice(1):n)}Ae({target:"String",proto:!0,forced:function(e){return o((function(){return !!Fr[e]()||"​᠎"!="​᠎"[e]()||Fr[e].name!==e}))}("trim")},{trim:function(){return zd(this)}});var Xd=function(e){for(var t=!1,n=!1,r=!1,o=0;o<e.length;o++){var i=e[o];t&&/[a-zA-Z]/.test(i)&&i.toUpperCase()===i?(e=e.slice(0,o)+"-"+e.slice(o),t=!1,r=n,n=!0,o++):n&&r&&/[a-zA-Z]/.test(i)&&i.toLowerCase()===i?(e=e.slice(0,o-1)+"-"+e.slice(o-1),r=n,n=!1,t=!0):(t=i.toLowerCase()===i&&i.toUpperCase()!==i,r=n,n=i.toUpperCase()===i&&i.toLowerCase()!==i);}return e};function Jd(e,t,n){var r=[],o=0,i=function e(t,n){if(++o>10)return o--,t;if(ga(t)){var i=t.map((function(t){return ha(t)?e(t,n):t}));return o--,i}if(ha(t)){var s=(a=t,u=function(e,t){if(!Ia(t))return !1;if((s=t)!==Wd(s)){for(var o=!0,i=0;i<ed.ignoreKeyWord.length;i++)if(t.includes(ed.ignoreKeyWord[i])){o=!1;break}o&&r.push(t);}var s;return ma(n[t])?function(e){return "OPPOChannelID"===e?e:e[0].toUpperCase()+Wd(e).slice(1)}(t):n[t]},c=Object.create(null),Object.keys(a).forEach((function(e){var t=u(a[e],e);t&&(c[t]=a[e]);})),c);return s=qa(s,(function(t,r){return ga(t)||ha(t)?e(t,n):t})),o--,s}var a,u,c;}(e,t=On({},ed.request,{},t));return r.length>0&&n.innerEmitter.emit(xd,{code:Tf,message:Oh}),i}function Qd(e,t){if(t=On({},ed.response,{},t),ga(e))return e.map((function(e){return ha(e)?Qd(e,t):e}));if(ha(e)){var n=(r=e,o=function(e,n){return ma(t[n])?Wd(n):t[n]},i={},Object.keys(r).forEach((function(e){i[o(r[e],e)]=r[e];})),i);return n=qa(n,(function(e){return ga(e)||ha(e)?Qd(e,t):e}))}var r,o,i;}var Zd=function(){function e(t){var n=this;kn(this,e),this.url="",this.requestData=null,this.method=t.method||"POST",this.callback=function(e){return Qd(e=t.decode(e),n._getResponseMap(t))},this._initializeServerMap(),this._initializeURL(t),this._initializeRequestData(t);}return An(e,[{key:"_initializeServerMap",value:function(){this._serverMap=Object.create(null);var e="";for(var t in Zh.NAME)if(Object.prototype.hasOwnProperty.call(Zh.NAME,t))switch(e=Zh.NAME[t]){case Zh.NAME.PIC:this._serverMap[e]=Zh.HOST.CURRENT.PIC;break;case Zh.NAME.IM_COS_SIGN:this._serverMap[e]=Zh.HOST.CURRENT.COS;break;default:this._serverMap[e]=Zh.HOST.CURRENT.COMMON;}}},{key:"_getHost",value:function(e){if(void 0!==this._serverMap[e])return this._serverMap[e];throw new Ip({code:If,message:Ah})}},{key:"_initializeURL",value:function(e){var t=e.serverName,n=e.cmd,r=this._getHost(t),o="".concat(r,"/").concat(Zh.NAME_VERSION[t],"/").concat(t,"/").concat(n);o+="?".concat(this._getQueryString(e.queryString)),this.url=o;}},{key:"getUrl",value:function(){return this.url.replace(/&reqtime=(\d+)/,"&reqtime=".concat(Math.ceil(+new Date/1e3)))}},{key:"_initializeRequestData",value:function(e){var t,n=e.requestData;t=this._requestDataCleaner(n),this.requestData=e.encode(t);}},{key:"_requestDataCleaner",value:function(e){var t=Array.isArray(e)?[]:Object.create(null);for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&Ia(n)&&null!==e[n]&&("object"!==Dn(e[n])?t[n]=e[n]:t[n]=this._requestDataCleaner.bind(this)(e[n]));return t}},{key:"_getQueryString",value:function(e){var t=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&("function"!=typeof e[n]?t.push("".concat(n,"=").concat(e[n])):t.push("".concat(n,"=").concat(e[n]())));return t.join("&")}},{key:"_getResponseMap",value:function(e){if(e.keyMaps&&e.keyMaps.response&&Object.keys(e.keyMaps.response).length>0)return e.keyMaps.response}}]),e}(),eg=[].slice,tg=/MSIE .\./.test(fn),ng=function(e){return function(t,n){var r=arguments.length>2,o=r?eg.call(arguments,2):void 0;return e(r?function(){("function"==typeof t?t:Function(t)).apply(this,o);}:t,n)}};function rg(e){this.mixin(e);}Ae({global:!0,bind:!0,forced:tg},{setTimeout:ng(r.setTimeout),setInterval:ng(r.setInterval)}),rg.mixin=function(e){var t=e.prototype||e;t._isReady=!1,t.ready=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(e)return this._isReady?void(t?e.call(this):setTimeout(e,1)):(this._readyQueue=this._readyQueue||[],void this._readyQueue.push(e))},t.triggerReady=function(){var e=this;this._isReady=!0,setTimeout((function(){var t=e._readyQueue;e._readyQueue=[],t&&t.length>0&&t.forEach((function(e){e.call(this);}),e);}),1);},t.resetReady=function(){this._isReady=!1,this._readyQueue=[];},t.isReady=function(){return this._isReady};};var og=function(){function e(t){kn(this,e),rg.mixin(this),this.tim=t;}return An(e,[{key:"isLoggedIn",value:function(){return this.tim.context.login===Nu.IS_LOGIN||!!this.tim.context.a2Key}},{key:"createTransportCapsule",value:function(e){var t=this.tim.packageConfig.get(e);return t?new Zd(t):null}},{key:"request",value:function(e){var t=this.createTransportCapsule(e);return t||ca.error("unknown transport capsule, please check!",e),this.tim.connectionController.request(t)}},{key:"emitInnerEvent",value:function(e,t){this.tim.innerEmitter.emit(e,t);}},{key:"emitOuterEvent",value:function(e,t){this.tim.outerEmitter.emit(e,t);}},{key:"reset",value:function(){ca.warn(["method: IMController.reset() method must be implemented"].join());}},{key:"probeNetwork",value:function(){return this.tim.netMonitor.probe()}},{key:"getNetworkType",value:function(){return this.tim.netMonitor.getNetworkType()}},{key:"getPlatform",value:function(){var e="web";return Bs?e="wechat":Rs&&(e="wxmp"),e}}]),e}(),ig=function(){function e(t,n){kn(this,e),this.data=t,this._innerEmitter=n,this.defaultData={},Object.assign(this.defaultData,t),this.initGetterAndSetter();}return An(e,[{key:"initGetterAndSetter",value:function(){var e=this,t=function(t){Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){return e.data[t]},set:function(n){e.data[t]!==n&&(e.data[t]=n,e.onChange.bind(e)(t,n));}});};for(var n in e.data)Object.prototype.hasOwnProperty.call(e.data,n)&&t(n);}},{key:"onChange",value:function(e,t){this._innerEmitter.emit(td,{key:e,value:t});}},{key:"reset",value:function(){for(var e in ca.log("Context.reset"),this.data)Object.prototype.hasOwnProperty.call(this.data,e)&&(this.data[e]=this.defaultData.hasOwnProperty(e)?this.defaultData[e]:null);}}]),e}(),sg=function(e){Ln(n,e);var t=jn(n);function n(e){var r;kn(this,n);var o=(r=t.call(this,e)).tim.loginInfo;return r._context=new ig({login:Nu.IS_NOT_LOGIN,SDKAppID:o.SDKAppID,appIDAt3rd:null,accountType:o.accountType,identifier:o.identifier,tinyID:null,identifierNick:o.identifierNick,userSig:o.userSig,a2Key:null,contentType:"json",apn:1},r.tim.innerEmitter),r._initListener(),r}return An(n,[{key:"reset",value:function(){this._context.reset(),this.emitInnerEvent(nd);}},{key:"_initListener",value:function(){this.tim.innerEmitter.on(td,this._onContextMemberChange,this),this.tim.innerEmitter.on(Ld,this._updateA2KeyAndTinyID,this);}},{key:"_updateA2KeyAndTinyID",value:function(e){var t=e.data,n=t.a2Key,r=t.tinyID;this._context.a2Key=n,this._context.tinyID=r,this.emitInnerEvent(rd),this.triggerReady();}},{key:"getContext",value:function(){return this._context}},{key:"_onContextMemberChange",value:function(e){var t=e.data,n=t.key,r=t.value;("tinyID"===n||"a2Key"===n)&&(r.length<=0?this._context.login=Nu.IS_NOT_LOGIN:this._context.login=null!==this._context.a2Key?Nu.IS_LOGIN:Nu.IS_NOT_LOGIN);}}]),n}(og),ag=function e(t){kn(this,e),this.code=0,this.data=t||{};},ug=null,cg=function(e){ug=e;},lg=function(e){return e instanceof ag?(ca.warn("IMPromise.resolve 此函数会自动用options创建IMResponse实例，调用侧不需创建，建议修改！"),Promise.resolve(e)):Promise.resolve(new ag(e))},pg=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(e instanceof Ip)return t&&null!==ug&&ug.emit(ln.ERROR,e),Promise.reject(e);if(e instanceof Error){var n=new Ip({code:kf,message:e.message});return t&&null!==ug&&ug.emit(ln.ERROR,n),Promise.reject(n)}if(ma(e)||ma(e.code)||ma(e.message))ca.error("IMPromise.reject 必须指定code(错误码)和message(错误信息)!!!");else {if(pa(e.code)&&fa(e.message)){var r=new Ip(e);return t&&null!==ug&&ug.emit(ln.ERROR,r),Promise.reject(r)}ca.error("IMPromise.reject code(错误码)必须为数字，message(错误信息)必须为字符串!!!");}},fg="sdkReady",hg="login",dg="longpolling",gg="longpollingAV",mg="sendMessage",vg="messageReceived",yg="messageReceivedAV",_g="initConversationList",Cg="initGroupList",Ig="upload",Mg=function(){function e(){kn(this,e),this.SDKAppID="",this.version="",this.tinyID="",this.userID="",this.platform="",this.method="",this.time="",this.startts=0,this.endts=0,this.timespan=0,this.codeint=0,this.message="",this.text="",this.msgType="",this.networkType="",this.platform="",this._sentFlag=!1;}return An(e,[{key:"setCommonInfo",value:function(e,t,n,r,o){this.SDKAppID="".concat(e),this.version="".concat(t),this.tinyID=n,this.userID=r,this.platform=o,this.time=Da(),this.startts&&this.endts&&!this.timespan&&(this.timespan=Math.abs(this.endts-this.startts));}},{key:"setMethod",value:function(e){return this.method=e,this}},{key:"setStart",value:function(){this.startts=Date.now();}},{key:"setEnd",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this._sentFlag||(this.endts=Date.now(),t?(this._sentFlag=!0,this._eventStatController.pushIn(this)):setTimeout((function(){e._sentFlag=!0,e._eventStatController.pushIn(e);}),0));}},{key:"setError",value:function(e,t,n){return e instanceof Error?(this._sentFlag||(this.setNetworkType(n),t?(e.code&&this.setCode(e.code),e.message&&this.setMessage(e.message)):(this.setCode(Sf),this.setMessage(Rh))),this):(ca.warn("SSOLogData.setError value not instanceof Error, please check!"),this)}},{key:"setCode",value:function(e){return ma(e)||this._sentFlag||("ECONNABORTED"===e&&(this.codeint=103),pa(e)?this.codeint=e:ca.warn("SSOLogData.setCode value not a number, please check!",e,Dn(e))),this}},{key:"setMessage",value:function(e){return ma(e)||this._sentFlag?this:fa(e)?(this.message=e,this):this}},{key:"setText",value:function(e){return pa(e)?this.text=e.toString():fa(e)&&(this.text=e),this}},{key:"setMessageType",value:function(e){return this.msgType=e,this}},{key:"setNetworkType",value:function(e){return ma(e)?ca.warn("SSOLogData.setNetworkType value is undefined, please check!"):this.networkType=e,this}}],[{key:"bindController",value:function(t){e.prototype._eventStatController=t;}}]),e}(),Sg="sdkConstruct",Tg="sdkReady",Eg="accessLayer",Dg="login",kg="logout",wg="kickedOut",Ag="registerPlugin",bg="getCosAuthKey",Rg="upload",Og="sendMessage",Lg="getC2CRoamingMessages",Ng="getGroupRoamingMessages",Pg="revokeMessage",Gg="setC2CMessageRead",xg="setGroupMessageRead",Ug="emptyMessageBody",qg="getConversationList",Fg="getConversationProfile",jg="deleteConversation",Bg="getConversationListInStorage",Hg="syncConversationList",Vg="createGroup",Kg="applyJoinGroup",$g="quitGroup",Yg="searchGroupByID",zg="changeGroupOwner",Wg="handleGroupApplication",Xg="setMessageRemindType",Jg="dismissGroup",Qg="updateGroupProfile",Zg="getGroupList",em="getGroupProfile",tm="getGroupListInStorage",nm="getGroupLastSequence",rm="getGroupMemberList",om="getGroupMemberProfile",im="addGroupMember",sm="deleteGroupMember",am="setGroupMemberMuteTime",um="setGroupMemberNameCard",cm="setGroupMemberRole",lm="setGroupMemberCustomField",pm="getLongPollID",fm="longPollingError",hm="networkJitter",dm="fastStart",gm="slowStart",mm="messageLoss",vm="getUserProfile",ym="updateMyProfile",_m="getBlacklist",Cm="addToBlacklist",Im="removeFromBlacklist",Mm="mpHideToShow",Sm="callbackFunctionError",Tm="exceptionError",Em=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e))._initializeListener(),r}return An(n,[{key:"login",value:function(e){if(this.isLoggedIn()){var t="您已经登录账号".concat(e.identifier,"！如需切换账号登录，请先调用 logout 接口登出，再调用 login 接口登录。");return ca.warn(t),lg({actionStatus:"OK",errorCode:0,errorInfo:t,repeatLogin:!0})}ca.log("SignController.login userID=",e.identifier),ca.time(hg);var n=this._checkLoginInfo(e);return ja(n)?(this.tim.context.identifier=e.identifier,this.tim.context.userSig=e.userSig,this.tim.context.identifier&&this.tim.context.userSig?this._accessLayer():void 0):pg(n)}},{key:"_isLoginCurrentUser",value:function(e){return this.tim.context.identifier===e}},{key:"_initializeListener",value:function(){var e=this.tim.innerEmitter;e.on(_d,this._onMultipleAccountKickedOut,this),e.on(Cd,this._onMultipleDeviceKickedOut,this),e.on(Gd,this._onUserSigExpired,this);}},{key:"_accessLayer",value:function(){var e=this,t=new Mg;return t.setMethod(Eg).setStart(),ca.log("SignController._accessLayer."),this.request({name:"accessLayer",action:"query"}).then((function(n){return t.setCode(0).setNetworkType(e.getNetworkType()).setText(n.data.webImAccessLayer).setEnd(),ca.log("SignController._accessLayer ok. webImAccessLayer=".concat(n.data.webImAccessLayer)),1===n.data.webImAccessLayer&&Zh.HOST.setCurrent(n.data.webImAccessLayer),e._login()})).catch((function(n){return e.probeNetwork().then((function(r){var o=Bn(r,2),i=o[0],s=o[1];t.setError(n,i,s).setEnd(!0),e.tim.eventStatController.reportAtOnce();})),ca.error("SignController._accessLayer failed. error:".concat(n)),pg(n)}))}},{key:"_login",value:function(){var e=this,t=new Mg;return t.setMethod(Dg).setStart(),this.request({name:"login",action:"query"}).then((function(n){var r=null;if(!n.data.tinyID)throw r=new Ip({code:Dp,message:xf}),t.setError(r,!0,e.getNetworkType()).setEnd(),r;if(!n.data.a2Key)throw r=new Ip({code:kp,message:Uf}),t.setError(r,!0,e.getNetworkType()).setEnd(),r;return t.setCode(0).setNetworkType(e.getNetworkType()).setText("".concat(e.tim.loginInfo.identifier)).setEnd(),ca.log("SignController.login ok. userID=".concat(e.tim.loginInfo.identifier," loginCost=").concat(ca.timeEnd(hg),"ms")),e.emitInnerEvent(Ld,{a2Key:n.data.a2Key,tinyID:n.data.tinyID}),lg(n.data)})).catch((function(n){return e.probeNetwork().then((function(e){var r=Bn(e,2),o=r[0],i=r[1];t.setError(n,o,i).setEnd(!0);})),ca.error("SignController.login failed. error:".concat(n)),pg(n)}))}},{key:"logout",value:function(){var e=new Mg;return e.setMethod(kg).setStart(),e.setCode(0).setNetworkType(this.getNetworkType()).setText("userID=".concat(this.tim.loginInfo.identifier," type=").concat("longPollLogout")).setEnd(!0),ca.info("SignController.logout"),this.emitInnerEvent(Nd),this._logout(np).then(this._emitLogoutSuccess.bind(this)).catch(this._emitLogoutSuccess.bind(this))}},{key:"_logout",value:function(e){var t=this.tim.notificationController,n=e===tp?"logout":"longPollLogout",r=e===tp?{name:n,action:"query"}:{name:n,action:"query",param:{longPollID:t.getLongPollID()}};return this.request(r).catch((function(e){return ca.error("SignController._logout error:",e),pg(e)}))}},{key:"_checkLoginInfo",value:function(e){var t=0,n="";return null===e.SDKAppID?(t=Mp,n=Lf):null===e.accountType?(t=Sp,n=Nf):null===e.identifier?(t=Tp,n=Pf):null===e.userSig&&(t=Ep,n=Gf),ja(t)||ja(n)?{}:{code:t,message:n}}},{key:"_emitLogoutSuccess",value:function(){return this.emitInnerEvent(Pd),lg({})}},{key:"_onMultipleAccountKickedOut",value:function(){var e=this,t=new Mg;t.setMethod(wg).setStart(),t.setCode(0).setNetworkType(this.getNetworkType()).setText(pn.KICKED_OUT_MULT_ACCOUNT).setEnd(!0),ca.warn("SignController._onMultipleAccountKickedOut kicked out. userID=".concat(this.tim.loginInfo.identifier)),this.tim.logout().then((function(){e.emitOuterEvent(ln.KICKED_OUT,{type:pn.KICKED_OUT_MULT_ACCOUNT});}));}},{key:"_onMultipleDeviceKickedOut",value:function(){var e=this,t=new Mg;t.setMethod(wg).setStart(),t.setCode(0).setNetworkType(this.getNetworkType()).setText(pn.KICKED_OUT_MULT_DEVICE).setEnd(!0),ca.warn("SignController._onMultipleDeviceKickedOut kicked out. userID=".concat(this.tim.loginInfo.identifier)),this.tim.logout().then((function(){e.emitOuterEvent(ln.KICKED_OUT,{type:pn.KICKED_OUT_MULT_DEVICE});}));}},{key:"_onUserSigExpired",value:function(){var e=new Mg;e.setMethod(wg).setStart(),e.setCode(0).setNetworkType(this.getNetworkType()).setText(pn.KICKED_OUT_USERSIG_EXPIRED).setEnd(!0),ca.warn("SignController._onUserSigExpired: userSig 签名过期被踢下线"),this.emitOuterEvent(ln.KICKED_OUT,{type:pn.KICKED_OUT_USERSIG_EXPIRED}),this.tim.resetSDK();}},{key:"reset",value:function(){ca.info("SignController.reset");}}]),n}(og),Dm=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}},km=Object.prototype.toString;function wm(e){return "[object Array]"===km.call(e)}function Am(e){return void 0===e}function bm(e){return null!==e&&"object"==typeof e}function Rm(e){return "[object Function]"===km.call(e)}function Om(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),wm(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e);}var Lm={isArray:wm,isArrayBuffer:function(e){return "[object ArrayBuffer]"===km.call(e)},isBuffer:function(e){return null!==e&&!Am(e)&&null!==e.constructor&&!Am(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){return "undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return "undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return "string"==typeof e},isNumber:function(e){return "number"==typeof e},isObject:bm,isUndefined:Am,isDate:function(e){return "[object Date]"===km.call(e)},isFile:function(e){return "[object File]"===km.call(e)},isBlob:function(e){return "[object Blob]"===km.call(e)},isFunction:Rm,isStream:function(e){return bm(e)&&Rm(e.pipe)},isURLSearchParams:function(e){return "undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return ("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:Om,merge:function e(){var t={};function n(n,r){"object"==typeof t[r]&&"object"==typeof n?t[r]=e(t[r],n):t[r]=n;}for(var r=0,o=arguments.length;r<o;r++)Om(arguments[r],n);return t},deepMerge:function e(){var t={};function n(n,r){"object"==typeof t[r]&&"object"==typeof n?t[r]=e(t[r],n):t[r]="object"==typeof n?e({},n):n;}for(var r=0,o=arguments.length;r<o;r++)Om(arguments[r],n);return t},extend:function(e,t,n){return Om(t,(function(t,r){e[r]=n&&"function"==typeof t?Dm(t,n):t;})),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}};function Nm(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var Pm=function(e,t,n){if(!t)return e;var r;if(n)r=n(t);else if(Lm.isURLSearchParams(t))r=t.toString();else {var o=[];Lm.forEach(t,(function(e,t){null!=e&&(Lm.isArray(e)?t+="[]":e=[e],Lm.forEach(e,(function(e){Lm.isDate(e)?e=e.toISOString():Lm.isObject(e)&&(e=JSON.stringify(e)),o.push(Nm(t)+"="+Nm(e));})));})),r=o.join("&");}if(r){var i=e.indexOf("#");-1!==i&&(e=e.slice(0,i)),e+=(-1===e.indexOf("?")?"?":"&")+r;}return e};function Gm(){this.handlers=[];}Gm.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},Gm.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null);},Gm.prototype.forEach=function(e){Lm.forEach(this.handlers,(function(t){null!==t&&e(t);}));};var xm=Gm,Um=function(e,t,n){return Lm.forEach(n,(function(n){e=n(e,t);})),e},qm=function(e){return !(!e||!e.__CANCEL__)};function Fm(){throw new Error("setTimeout has not been defined")}function jm(){throw new Error("clearTimeout has not been defined")}var Bm=Fm,Hm=jm;function Vm(e){if(Bm===setTimeout)return setTimeout(e,0);if((Bm===Fm||!Bm)&&setTimeout)return Bm=setTimeout,setTimeout(e,0);try{return Bm(e,0)}catch(t){try{return Bm.call(null,e,0)}catch(t){return Bm.call(this,e,0)}}}"function"==typeof ta.setTimeout&&(Bm=setTimeout),"function"==typeof ta.clearTimeout&&(Hm=clearTimeout);var Km,$m=[],Ym=!1,zm=-1;function Wm(){Ym&&Km&&(Ym=!1,Km.length?$m=Km.concat($m):zm=-1,$m.length&&Xm());}function Xm(){if(!Ym){var e=Vm(Wm);Ym=!0;for(var t=$m.length;t;){for(Km=$m,$m=[];++zm<t;)Km&&Km[zm].run();zm=-1,t=$m.length;}Km=null,Ym=!1,function(e){if(Hm===clearTimeout)return clearTimeout(e);if((Hm===jm||!Hm)&&clearTimeout)return Hm=clearTimeout,clearTimeout(e);try{Hm(e);}catch(t){try{return Hm.call(null,e)}catch(t){return Hm.call(this,e)}}}(e);}}function Jm(e,t){this.fun=e,this.array=t;}Jm.prototype.run=function(){this.fun.apply(null,this.array);};function Qm(){}var Zm=Qm,ev=Qm,tv=Qm,nv=Qm,rv=Qm,ov=Qm,iv=Qm;var sv=ta.performance||{},av=sv.now||sv.mozNow||sv.msNow||sv.oNow||sv.webkitNow||function(){return (new Date).getTime()};var uv=new Date;var cv={nextTick:function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];$m.push(new Jm(e,t)),1!==$m.length||Ym||Vm(Xm);},title:"browser",browser:!0,env:{},argv:[],version:"",versions:{},on:Zm,addListener:ev,once:tv,off:nv,removeListener:rv,removeAllListeners:ov,emit:iv,binding:function(e){throw new Error("process.binding is not supported")},cwd:function(){return "/"},chdir:function(e){throw new Error("process.chdir is not supported")},umask:function(){return 0},hrtime:function(e){var t=.001*av.call(sv),n=Math.floor(t),r=Math.floor(t%1*1e9);return e&&(n-=e[0],(r-=e[1])<0&&(n--,r+=1e9)),[n,r]},platform:"browser",release:{},config:{},uptime:function(){return (new Date-uv)/1e3}},lv=function(e,t){Lm.forEach(e,(function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r]);}));},pv=function(e,t,n,r,o){return function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e.isAxiosError=!0,e.toJSON=function(){return {message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}(new Error(e),t,n,r,o)},fv=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"],hv=Lm.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function r(e){var r=e;return t&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return e=r(window.location.href),function(t){var n=Lm.isString(t)?r(t):t;return n.protocol===e.protocol&&n.host===e.host}}():function(){return !0},dv=Lm.isStandardBrowserEnv()?{write:function(e,t,n,r,o,i){var s=[];s.push(e+"="+encodeURIComponent(t)),Lm.isNumber(n)&&s.push("expires="+new Date(n).toGMTString()),Lm.isString(r)&&s.push("path="+r),Lm.isString(o)&&s.push("domain="+o),!0===i&&s.push("secure"),document.cookie=s.join("; ");},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5);}}:{write:function(){},read:function(){return null},remove:function(){}},gv=function(e){return new Promise((function(t,n){var r=e.data,o=e.headers;Lm.isFormData(r)&&delete o["Content-Type"];var i=new XMLHttpRequest;if(e.auth){var s=e.auth.username||"",a=e.auth.password||"";o.Authorization="Basic "+btoa(s+":"+a);}var u,c,l=(u=e.baseURL,c=e.url,u&&!/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(c)?function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}(u,c):c);if(i.open(e.method.toUpperCase(),Pm(l,e.params,e.paramsSerializer),!0),i.timeout=e.timeout,i.onreadystatechange=function(){if(i&&4===i.readyState&&(0!==i.status||i.responseURL&&0===i.responseURL.indexOf("file:"))){var r="getAllResponseHeaders"in i?function(e){var t,n,r,o={};return e?(Lm.forEach(e.split("\n"),(function(e){if(r=e.indexOf(":"),t=Lm.trim(e.substr(0,r)).toLowerCase(),n=Lm.trim(e.substr(r+1)),t){if(o[t]&&fv.indexOf(t)>=0)return;o[t]="set-cookie"===t?(o[t]?o[t]:[]).concat([n]):o[t]?o[t]+", "+n:n;}})),o):o}(i.getAllResponseHeaders()):null,o={data:e.responseType&&"text"!==e.responseType?i.response:i.responseText,status:i.status,statusText:i.statusText,headers:r,config:e,request:i};!function(e,t,n){var r=n.config.validateStatus;!r||r(n.status)?e(n):t(pv("Request failed with status code "+n.status,n.config,null,n.request,n));}(t,n,o),i=null;}},i.onabort=function(){i&&(n(pv("Request aborted",e,"ECONNABORTED",i)),i=null);},i.onerror=function(){n(pv("Network Error",e,null,i)),i=null;},i.ontimeout=function(){var t="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),n(pv(t,e,"ECONNABORTED",i)),i=null;},Lm.isStandardBrowserEnv()){var p=dv,f=(e.withCredentials||hv(l))&&e.xsrfCookieName?p.read(e.xsrfCookieName):void 0;f&&(o[e.xsrfHeaderName]=f);}if("setRequestHeader"in i&&Lm.forEach(o,(function(e,t){void 0===r&&"content-type"===t.toLowerCase()?delete o[t]:i.setRequestHeader(t,e);})),Lm.isUndefined(e.withCredentials)||(i.withCredentials=!!e.withCredentials),e.responseType)try{i.responseType=e.responseType;}catch(h){if("json"!==e.responseType)throw h}"function"==typeof e.onDownloadProgress&&i.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&i.upload&&i.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){i&&(i.abort(),n(e),i=null);})),void 0===r&&(r=null),i.send(r);}))},mv={"Content-Type":"application/x-www-form-urlencoded"};function vv(e,t){!Lm.isUndefined(e)&&Lm.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t);}var yv,_v={adapter:(("undefined"!=typeof XMLHttpRequest||void 0!==cv&&"[object process]"===Object.prototype.toString.call(cv))&&(yv=gv),yv),transformRequest:[function(e,t){return lv(t,"Accept"),lv(t,"Content-Type"),Lm.isFormData(e)||Lm.isArrayBuffer(e)||Lm.isBuffer(e)||Lm.isStream(e)||Lm.isFile(e)||Lm.isBlob(e)?e:Lm.isArrayBufferView(e)?e.buffer:Lm.isURLSearchParams(e)?(vv(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):Lm.isObject(e)?(vv(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e);}catch(t){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};_v.headers={common:{Accept:"application/json, text/plain, */*"}},Lm.forEach(["delete","get","head"],(function(e){_v.headers[e]={};})),Lm.forEach(["post","put","patch"],(function(e){_v.headers[e]=Lm.merge(mv);}));var Cv=_v;function Iv(e){e.cancelToken&&e.cancelToken.throwIfRequested();}var Mv=function(e){return Iv(e),e.headers=e.headers||{},e.data=Um(e.data,e.headers,e.transformRequest),e.headers=Lm.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),Lm.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t];})),(e.adapter||Cv.adapter)(e).then((function(t){return Iv(e),t.data=Um(t.data,t.headers,e.transformResponse),t}),(function(t){return qm(t)||(Iv(e),t&&t.response&&(t.response.data=Um(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))},Sv=function(e,t){t=t||{};var n={},r=["url","method","params","data"],o=["headers","auth","proxy"],i=["baseURL","url","transformRequest","transformResponse","paramsSerializer","timeout","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","maxContentLength","validateStatus","maxRedirects","httpAgent","httpsAgent","cancelToken","socketPath"];Lm.forEach(r,(function(e){void 0!==t[e]&&(n[e]=t[e]);})),Lm.forEach(o,(function(r){Lm.isObject(t[r])?n[r]=Lm.deepMerge(e[r],t[r]):void 0!==t[r]?n[r]=t[r]:Lm.isObject(e[r])?n[r]=Lm.deepMerge(e[r]):void 0!==e[r]&&(n[r]=e[r]);})),Lm.forEach(i,(function(r){void 0!==t[r]?n[r]=t[r]:void 0!==e[r]&&(n[r]=e[r]);}));var s=r.concat(o).concat(i),a=Object.keys(t).filter((function(e){return -1===s.indexOf(e)}));return Lm.forEach(a,(function(r){void 0!==t[r]?n[r]=t[r]:void 0!==e[r]&&(n[r]=e[r]);})),n};function Tv(e){this.defaults=e,this.interceptors={request:new xm,response:new xm};}Tv.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=Sv(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=[Mv,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach((function(e){t.unshift(e.fulfilled,e.rejected);})),this.interceptors.response.forEach((function(e){t.push(e.fulfilled,e.rejected);}));t.length;)n=n.then(t.shift(),t.shift());return n},Tv.prototype.getUri=function(e){return e=Sv(this.defaults,e),Pm(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},Lm.forEach(["delete","get","head","options"],(function(e){Tv.prototype[e]=function(t,n){return this.request(Lm.merge(n||{},{method:e,url:t}))};})),Lm.forEach(["post","put","patch"],(function(e){Tv.prototype[e]=function(t,n,r){return this.request(Lm.merge(r||{},{method:e,url:t,data:n}))};}));var Ev=Tv;function Dv(e){this.message=e;}Dv.prototype.toString=function(){return "Cancel"+(this.message?": "+this.message:"")},Dv.prototype.__CANCEL__=!0;var kv=Dv;function wv(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e;}));var n=this;e((function(e){n.reason||(n.reason=new kv(e),t(n.reason));}));}wv.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},wv.source=function(){var e;return {token:new wv((function(t){e=t;})),cancel:e}};var Av=wv;function bv(e){var t=new Ev(e),n=Dm(Ev.prototype.request,t);return Lm.extend(n,Ev.prototype,t),Lm.extend(n,t),n}var Rv=bv(Cv);Rv.Axios=Ev,Rv.create=function(e){return bv(Sv(Rv.defaults,e))},Rv.Cancel=kv,Rv.CancelToken=Av,Rv.isCancel=qm,Rv.all=function(e){return Promise.all(e)},Rv.spread=function(e){return function(t){return e.apply(null,t)}};var Ov=Rv,Lv=Rv;Ov.default=Lv;var Nv=Ov,Pv=Nv.create({timeout:3e4,headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"}});Pv.interceptors.response.use((function(e){var t=e.data,n=t.error_code,r=t.ErrorCode;return pa(n)&&(r=n),r!==Lu.SUCCESS&&(e.data.ErrorCode=Number(r)),e}),(function(e){return "Network Error"===e.message&&(!0===Pv.defaults.withCredentials&&ca.warn("Network Error, try to close `IMAxios.defaults.withCredentials` to false. (IMAxios.js)"),Pv.defaults.withCredentials=!1),Promise.reject(e)}));var Gv=function(){function e(){kn(this,e);}return An(e,[{key:"request",value:function(e){console.warn("请注意： ConnectionBase.request() 方法必须被派生类重写:"),console.log("参数如下：\n    * @param {String} options.url string 是 开发者服务器接口地址\n    * @param {*} options.data - string/object/ArrayBuffer 否 请求的参数\n    * @param {Object} options.header - Object 否 设置请求的 header，\n    * @param {String} options.method - string GET 否 HTTP 请求方法\n    * @param {String} options.dataType - string json 否 返回的数据格式\n    * @param {String} options.responseType - string text 否 响应的数据类型\n    * @param {Boolean} isRetry - string text false 是否为重试的请求\n   ");}},{key:"_checkOptions",value:function(e){if(!1==!!e.url)throw new Ip({code:Cf,message:wh})}},{key:"_initOptions",value:function(e){e.method=["POST","GET","PUT","DELETE","OPTION"].indexOf(e.method)>=0?e.method:"POST",e.dataType=e.dataType||"json",e.responseType=e.responseType||"json";}}]),e}(),xv=function(e){Ln(n,e);var t=jn(n);function n(){var e;return kn(this,n),(e=t.call(this)).retry=2,e}return An(n,[{key:"request",value:function(e){return this._checkOptions(e),this._initOptions(e),this._requestWithRetry({url:e.url,data:e.data,method:e.method})}},{key:"_requestWithRetry",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Pv(e).catch((function(r){return t.retry&&n<t.retry?t._requestWithRetry(e,++n):pg(new Ip({code:r.code||"",message:r.message||""}))}))}}]),n}(Gv),Uv=[],qv=[],Fv="undefined"!=typeof Uint8Array?Uint8Array:Array,jv=!1;function Bv(){jv=!0;for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t=0,n=e.length;t<n;++t)Uv[t]=e[t],qv[e.charCodeAt(t)]=t;qv["-".charCodeAt(0)]=62,qv["_".charCodeAt(0)]=63;}function Hv(e,t,n){for(var r,o,i=[],s=t;s<n;s+=3)r=(e[s]<<16)+(e[s+1]<<8)+e[s+2],i.push(Uv[(o=r)>>18&63]+Uv[o>>12&63]+Uv[o>>6&63]+Uv[63&o]);return i.join("")}function Vv(e){var t;jv||Bv();for(var n=e.length,r=n%3,o="",i=[],s=0,a=n-r;s<a;s+=16383)i.push(Hv(e,s,s+16383>a?a:s+16383));return 1===r?(t=e[n-1],o+=Uv[t>>2],o+=Uv[t<<4&63],o+="=="):2===r&&(t=(e[n-2]<<8)+e[n-1],o+=Uv[t>>10],o+=Uv[t>>4&63],o+=Uv[t<<2&63],o+="="),i.push(o),i.join("")}function Kv(e,t,n,r,o){var i,s,a=8*o-r-1,u=(1<<a)-1,c=u>>1,l=-7,p=n?o-1:0,f=n?-1:1,h=e[t+p];for(p+=f,i=h&(1<<-l)-1,h>>=-l,l+=a;l>0;i=256*i+e[t+p],p+=f,l-=8);for(s=i&(1<<-l)-1,i>>=-l,l+=r;l>0;s=256*s+e[t+p],p+=f,l-=8);if(0===i)i=1-c;else {if(i===u)return s?NaN:Infinity*(h?-1:1);s+=Math.pow(2,r),i-=c;}return (h?-1:1)*s*Math.pow(2,i-r)}function $v(e,t,n,r,o,i){var s,a,u,c=8*i-o-1,l=(1<<c)-1,p=l>>1,f=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,h=r?0:i-1,d=r?1:-1,g=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||Infinity===t?(a=isNaN(t)?1:0,s=l):(s=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-s))<1&&(s--,u*=2),(t+=s+p>=1?f/u:f*Math.pow(2,1-p))*u>=2&&(s++,u/=2),s+p>=l?(a=0,s=l):s+p>=1?(a=(t*u-1)*Math.pow(2,o),s+=p):(a=t*Math.pow(2,p-1)*Math.pow(2,o),s=0));o>=8;e[n+h]=255&a,h+=d,a/=256,o-=8);for(s=s<<o|a,c+=o;c>0;e[n+h]=255&s,h+=d,s/=256,c-=8);e[n+h-d]|=128*g;}var Yv={}.toString,zv=Array.isArray||function(e){return "[object Array]"==Yv.call(e)};function Wv(){return Jv.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function Xv(e,t){if(Wv()<t)throw new RangeError("Invalid typed array length");return Jv.TYPED_ARRAY_SUPPORT?(e=new Uint8Array(t)).__proto__=Jv.prototype:(null===e&&(e=new Jv(t)),e.length=t),e}function Jv(e,t,n){if(!(Jv.TYPED_ARRAY_SUPPORT||this instanceof Jv))return new Jv(e,t,n);if("number"==typeof e){if("string"==typeof t)throw new Error("If encoding is specified then the first argument must be a string");return ey(this,e)}return Qv(this,e,t,n)}function Qv(e,t,n,r){if("number"==typeof t)throw new TypeError('"value" argument must not be a number');return "undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer?function(e,t,n,r){if(t.byteLength,n<0||t.byteLength<n)throw new RangeError("'offset' is out of bounds");if(t.byteLength<n+(r||0))throw new RangeError("'length' is out of bounds");t=void 0===n&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,n):new Uint8Array(t,n,r);Jv.TYPED_ARRAY_SUPPORT?(e=t).__proto__=Jv.prototype:e=ty(e,t);return e}(e,t,n,r):"string"==typeof t?function(e,t,n){"string"==typeof n&&""!==n||(n="utf8");if(!Jv.isEncoding(n))throw new TypeError('"encoding" must be a valid string encoding');var r=0|oy(t,n),o=(e=Xv(e,r)).write(t,n);o!==r&&(e=e.slice(0,o));return e}(e,t,n):function(e,t){if(ry(t)){var n=0|ny(t.length);return 0===(e=Xv(e,n)).length||t.copy(e,0,0,n),e}if(t){if("undefined"!=typeof ArrayBuffer&&t.buffer instanceof ArrayBuffer||"length"in t)return "number"!=typeof t.length||(r=t.length)!=r?Xv(e,0):ty(e,t);if("Buffer"===t.type&&zv(t.data))return ty(e,t.data)}var r;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(e,t)}function Zv(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number');if(e<0)throw new RangeError('"size" argument must not be negative')}function ey(e,t){if(Zv(t),e=Xv(e,t<0?0:0|ny(t)),!Jv.TYPED_ARRAY_SUPPORT)for(var n=0;n<t;++n)e[n]=0;return e}function ty(e,t){var n=t.length<0?0:0|ny(t.length);e=Xv(e,n);for(var r=0;r<n;r+=1)e[r]=255&t[r];return e}function ny(e){if(e>=Wv())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+Wv().toString(16)+" bytes");return 0|e}function ry(e){return !(null==e||!e._isBuffer)}function oy(e,t){if(ry(e))return e.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(e)||e instanceof ArrayBuffer))return e.byteLength;"string"!=typeof e&&(e=""+e);var n=e.length;if(0===n)return 0;for(var r=!1;;)switch(t){case"ascii":case"latin1":case"binary":return n;case"utf8":case"utf-8":case void 0:return by(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return Ry(e).length;default:if(r)return by(e).length;t=(""+t).toLowerCase(),r=!0;}}function iy(e,t,n){var r=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return "";if((void 0===n||n>this.length)&&(n=this.length),n<=0)return "";if((n>>>=0)<=(t>>>=0))return "";for(e||(e="utf8");;)switch(e){case"hex":return _y(this,t,n);case"utf8":case"utf-8":return my(this,t,n);case"ascii":return vy(this,t,n);case"latin1":case"binary":return yy(this,t,n);case"base64":return gy(this,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Cy(this,t,n);default:if(r)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),r=!0;}}function sy(e,t,n){var r=e[t];e[t]=e[n],e[n]=r;}function ay(e,t,n,r,o){if(0===e.length)return -1;if("string"==typeof n?(r=n,n=0):n>2147483647?n=2147483647:n<-2147483648&&(n=-2147483648),n=+n,isNaN(n)&&(n=o?0:e.length-1),n<0&&(n=e.length+n),n>=e.length){if(o)return -1;n=e.length-1;}else if(n<0){if(!o)return -1;n=0;}if("string"==typeof t&&(t=Jv.from(t,r)),ry(t))return 0===t.length?-1:uy(e,t,n,r,o);if("number"==typeof t)return t&=255,Jv.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(e,t,n):Uint8Array.prototype.lastIndexOf.call(e,t,n):uy(e,[t],n,r,o);throw new TypeError("val must be string, number or Buffer")}function uy(e,t,n,r,o){var i,s=1,a=e.length,u=t.length;if(void 0!==r&&("ucs2"===(r=String(r).toLowerCase())||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(e.length<2||t.length<2)return -1;s=2,a/=2,u/=2,n/=2;}function c(e,t){return 1===s?e[t]:e.readUInt16BE(t*s)}if(o){var l=-1;for(i=n;i<a;i++)if(c(e,i)===c(t,-1===l?0:i-l)){if(-1===l&&(l=i),i-l+1===u)return l*s}else -1!==l&&(i-=i-l),l=-1;}else for(n+u>a&&(n=a-u),i=n;i>=0;i--){for(var p=!0,f=0;f<u;f++)if(c(e,i+f)!==c(t,f)){p=!1;break}if(p)return i}return -1}function cy(e,t,n,r){n=Number(n)||0;var o=e.length-n;r?(r=Number(r))>o&&(r=o):r=o;var i=t.length;if(i%2!=0)throw new TypeError("Invalid hex string");r>i/2&&(r=i/2);for(var s=0;s<r;++s){var a=parseInt(t.substr(2*s,2),16);if(isNaN(a))return s;e[n+s]=a;}return s}function ly(e,t,n,r){return Oy(by(t,e.length-n),e,n,r)}function py(e,t,n,r){return Oy(function(e){for(var t=[],n=0;n<e.length;++n)t.push(255&e.charCodeAt(n));return t}(t),e,n,r)}function fy(e,t,n,r){return py(e,t,n,r)}function hy(e,t,n,r){return Oy(Ry(t),e,n,r)}function dy(e,t,n,r){return Oy(function(e,t){for(var n,r,o,i=[],s=0;s<e.length&&!((t-=2)<0);++s)n=e.charCodeAt(s),r=n>>8,o=n%256,i.push(o),i.push(r);return i}(t,e.length-n),e,n,r)}function gy(e,t,n){return 0===t&&n===e.length?Vv(e):Vv(e.slice(t,n))}function my(e,t,n){n=Math.min(e.length,n);for(var r=[],o=t;o<n;){var i,s,a,u,c=e[o],l=null,p=c>239?4:c>223?3:c>191?2:1;if(o+p<=n)switch(p){case 1:c<128&&(l=c);break;case 2:128==(192&(i=e[o+1]))&&(u=(31&c)<<6|63&i)>127&&(l=u);break;case 3:i=e[o+1],s=e[o+2],128==(192&i)&&128==(192&s)&&(u=(15&c)<<12|(63&i)<<6|63&s)>2047&&(u<55296||u>57343)&&(l=u);break;case 4:i=e[o+1],s=e[o+2],a=e[o+3],128==(192&i)&&128==(192&s)&&128==(192&a)&&(u=(15&c)<<18|(63&i)<<12|(63&s)<<6|63&a)>65535&&u<1114112&&(l=u);}null===l?(l=65533,p=1):l>65535&&(l-=65536,r.push(l>>>10&1023|55296),l=56320|1023&l),r.push(l),o+=p;}return function(e){var t=e.length;if(t<=4096)return String.fromCharCode.apply(String,e);var n="",r=0;for(;r<t;)n+=String.fromCharCode.apply(String,e.slice(r,r+=4096));return n}(r)}Jv.TYPED_ARRAY_SUPPORT=void 0===ta.TYPED_ARRAY_SUPPORT||ta.TYPED_ARRAY_SUPPORT,Jv.poolSize=8192,Jv._augment=function(e){return e.__proto__=Jv.prototype,e},Jv.from=function(e,t,n){return Qv(null,e,t,n)},Jv.TYPED_ARRAY_SUPPORT&&(Jv.prototype.__proto__=Uint8Array.prototype,Jv.__proto__=Uint8Array),Jv.alloc=function(e,t,n){return function(e,t,n,r){return Zv(t),t<=0?Xv(e,t):void 0!==n?"string"==typeof r?Xv(e,t).fill(n,r):Xv(e,t).fill(n):Xv(e,t)}(null,e,t,n)},Jv.allocUnsafe=function(e){return ey(null,e)},Jv.allocUnsafeSlow=function(e){return ey(null,e)},Jv.isBuffer=function(e){return null!=e&&(!!e._isBuffer||Ly(e)||function(e){return "function"==typeof e.readFloatLE&&"function"==typeof e.slice&&Ly(e.slice(0,0))}(e))},Jv.compare=function(e,t){if(!ry(e)||!ry(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var n=e.length,r=t.length,o=0,i=Math.min(n,r);o<i;++o)if(e[o]!==t[o]){n=e[o],r=t[o];break}return n<r?-1:r<n?1:0},Jv.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return !0;default:return !1}},Jv.concat=function(e,t){if(!zv(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return Jv.alloc(0);var n;if(void 0===t)for(t=0,n=0;n<e.length;++n)t+=e[n].length;var r=Jv.allocUnsafe(t),o=0;for(n=0;n<e.length;++n){var i=e[n];if(!ry(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(r,o),o+=i.length;}return r},Jv.byteLength=oy,Jv.prototype._isBuffer=!0,Jv.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)sy(this,t,t+1);return this},Jv.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)sy(this,t,t+3),sy(this,t+1,t+2);return this},Jv.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)sy(this,t,t+7),sy(this,t+1,t+6),sy(this,t+2,t+5),sy(this,t+3,t+4);return this},Jv.prototype.toString=function(){var e=0|this.length;return 0===e?"":0===arguments.length?my(this,0,e):iy.apply(this,arguments)},Jv.prototype.equals=function(e){if(!ry(e))throw new TypeError("Argument must be a Buffer");return this===e||0===Jv.compare(this,e)},Jv.prototype.inspect=function(){var e="";return this.length>0&&(e=this.toString("hex",0,50).match(/.{2}/g).join(" "),this.length>50&&(e+=" ... ")),"<Buffer "+e+">"},Jv.prototype.compare=function(e,t,n,r,o){if(!ry(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===n&&(n=e?e.length:0),void 0===r&&(r=0),void 0===o&&(o=this.length),t<0||n>e.length||r<0||o>this.length)throw new RangeError("out of range index");if(r>=o&&t>=n)return 0;if(r>=o)return -1;if(t>=n)return 1;if(this===e)return 0;for(var i=(o>>>=0)-(r>>>=0),s=(n>>>=0)-(t>>>=0),a=Math.min(i,s),u=this.slice(r,o),c=e.slice(t,n),l=0;l<a;++l)if(u[l]!==c[l]){i=u[l],s=c[l];break}return i<s?-1:s<i?1:0},Jv.prototype.includes=function(e,t,n){return -1!==this.indexOf(e,t,n)},Jv.prototype.indexOf=function(e,t,n){return ay(this,e,t,n,!0)},Jv.prototype.lastIndexOf=function(e,t,n){return ay(this,e,t,n,!1)},Jv.prototype.write=function(e,t,n,r){if(void 0===t)r="utf8",n=this.length,t=0;else if(void 0===n&&"string"==typeof t)r=t,n=this.length,t=0;else {if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t|=0,isFinite(n)?(n|=0,void 0===r&&(r="utf8")):(r=n,n=void 0);}var o=this.length-t;if((void 0===n||n>o)&&(n=o),e.length>0&&(n<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");for(var i=!1;;)switch(r){case"hex":return cy(this,e,t,n);case"utf8":case"utf-8":return ly(this,e,t,n);case"ascii":return py(this,e,t,n);case"latin1":case"binary":return fy(this,e,t,n);case"base64":return hy(this,e,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return dy(this,e,t,n);default:if(i)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),i=!0;}},Jv.prototype.toJSON=function(){return {type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function vy(e,t,n){var r="";n=Math.min(e.length,n);for(var o=t;o<n;++o)r+=String.fromCharCode(127&e[o]);return r}function yy(e,t,n){var r="";n=Math.min(e.length,n);for(var o=t;o<n;++o)r+=String.fromCharCode(e[o]);return r}function _y(e,t,n){var r=e.length;(!t||t<0)&&(t=0),(!n||n<0||n>r)&&(n=r);for(var o="",i=t;i<n;++i)o+=Ay(e[i]);return o}function Cy(e,t,n){for(var r=e.slice(t,n),o="",i=0;i<r.length;i+=2)o+=String.fromCharCode(r[i]+256*r[i+1]);return o}function Iy(e,t,n){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>n)throw new RangeError("Trying to access beyond buffer length")}function My(e,t,n,r,o,i){if(!ry(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>o||t<i)throw new RangeError('"value" argument is out of bounds');if(n+r>e.length)throw new RangeError("Index out of range")}function Sy(e,t,n,r){t<0&&(t=65535+t+1);for(var o=0,i=Math.min(e.length-n,2);o<i;++o)e[n+o]=(t&255<<8*(r?o:1-o))>>>8*(r?o:1-o);}function Ty(e,t,n,r){t<0&&(t=4294967295+t+1);for(var o=0,i=Math.min(e.length-n,4);o<i;++o)e[n+o]=t>>>8*(r?o:3-o)&255;}function Ey(e,t,n,r,o,i){if(n+r>e.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("Index out of range")}function Dy(e,t,n,r,o){return o||Ey(e,0,n,4),$v(e,t,n,r,23,4),n+4}function ky(e,t,n,r,o){return o||Ey(e,0,n,8),$v(e,t,n,r,52,8),n+8}Jv.prototype.slice=function(e,t){var n,r=this.length;if((e=~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),(t=void 0===t?r:~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e),Jv.TYPED_ARRAY_SUPPORT)(n=this.subarray(e,t)).__proto__=Jv.prototype;else {var o=t-e;n=new Jv(o,void 0);for(var i=0;i<o;++i)n[i]=this[i+e];}return n},Jv.prototype.readUIntLE=function(e,t,n){e|=0,t|=0,n||Iy(e,t,this.length);for(var r=this[e],o=1,i=0;++i<t&&(o*=256);)r+=this[e+i]*o;return r},Jv.prototype.readUIntBE=function(e,t,n){e|=0,t|=0,n||Iy(e,t,this.length);for(var r=this[e+--t],o=1;t>0&&(o*=256);)r+=this[e+--t]*o;return r},Jv.prototype.readUInt8=function(e,t){return t||Iy(e,1,this.length),this[e]},Jv.prototype.readUInt16LE=function(e,t){return t||Iy(e,2,this.length),this[e]|this[e+1]<<8},Jv.prototype.readUInt16BE=function(e,t){return t||Iy(e,2,this.length),this[e]<<8|this[e+1]},Jv.prototype.readUInt32LE=function(e,t){return t||Iy(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},Jv.prototype.readUInt32BE=function(e,t){return t||Iy(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},Jv.prototype.readIntLE=function(e,t,n){e|=0,t|=0,n||Iy(e,t,this.length);for(var r=this[e],o=1,i=0;++i<t&&(o*=256);)r+=this[e+i]*o;return r>=(o*=128)&&(r-=Math.pow(2,8*t)),r},Jv.prototype.readIntBE=function(e,t,n){e|=0,t|=0,n||Iy(e,t,this.length);for(var r=t,o=1,i=this[e+--r];r>0&&(o*=256);)i+=this[e+--r]*o;return i>=(o*=128)&&(i-=Math.pow(2,8*t)),i},Jv.prototype.readInt8=function(e,t){return t||Iy(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},Jv.prototype.readInt16LE=function(e,t){t||Iy(e,2,this.length);var n=this[e]|this[e+1]<<8;return 32768&n?4294901760|n:n},Jv.prototype.readInt16BE=function(e,t){t||Iy(e,2,this.length);var n=this[e+1]|this[e]<<8;return 32768&n?4294901760|n:n},Jv.prototype.readInt32LE=function(e,t){return t||Iy(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},Jv.prototype.readInt32BE=function(e,t){return t||Iy(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},Jv.prototype.readFloatLE=function(e,t){return t||Iy(e,4,this.length),Kv(this,e,!0,23,4)},Jv.prototype.readFloatBE=function(e,t){return t||Iy(e,4,this.length),Kv(this,e,!1,23,4)},Jv.prototype.readDoubleLE=function(e,t){return t||Iy(e,8,this.length),Kv(this,e,!0,52,8)},Jv.prototype.readDoubleBE=function(e,t){return t||Iy(e,8,this.length),Kv(this,e,!1,52,8)},Jv.prototype.writeUIntLE=function(e,t,n,r){(e=+e,t|=0,n|=0,r)||My(this,e,t,n,Math.pow(2,8*n)-1,0);var o=1,i=0;for(this[t]=255&e;++i<n&&(o*=256);)this[t+i]=e/o&255;return t+n},Jv.prototype.writeUIntBE=function(e,t,n,r){(e=+e,t|=0,n|=0,r)||My(this,e,t,n,Math.pow(2,8*n)-1,0);var o=n-1,i=1;for(this[t+o]=255&e;--o>=0&&(i*=256);)this[t+o]=e/i&255;return t+n},Jv.prototype.writeUInt8=function(e,t,n){return e=+e,t|=0,n||My(this,e,t,1,255,0),Jv.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[t]=255&e,t+1},Jv.prototype.writeUInt16LE=function(e,t,n){return e=+e,t|=0,n||My(this,e,t,2,65535,0),Jv.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):Sy(this,e,t,!0),t+2},Jv.prototype.writeUInt16BE=function(e,t,n){return e=+e,t|=0,n||My(this,e,t,2,65535,0),Jv.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):Sy(this,e,t,!1),t+2},Jv.prototype.writeUInt32LE=function(e,t,n){return e=+e,t|=0,n||My(this,e,t,4,4294967295,0),Jv.TYPED_ARRAY_SUPPORT?(this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e):Ty(this,e,t,!0),t+4},Jv.prototype.writeUInt32BE=function(e,t,n){return e=+e,t|=0,n||My(this,e,t,4,4294967295,0),Jv.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):Ty(this,e,t,!1),t+4},Jv.prototype.writeIntLE=function(e,t,n,r){if(e=+e,t|=0,!r){var o=Math.pow(2,8*n-1);My(this,e,t,n,o-1,-o);}var i=0,s=1,a=0;for(this[t]=255&e;++i<n&&(s*=256);)e<0&&0===a&&0!==this[t+i-1]&&(a=1),this[t+i]=(e/s>>0)-a&255;return t+n},Jv.prototype.writeIntBE=function(e,t,n,r){if(e=+e,t|=0,!r){var o=Math.pow(2,8*n-1);My(this,e,t,n,o-1,-o);}var i=n-1,s=1,a=0;for(this[t+i]=255&e;--i>=0&&(s*=256);)e<0&&0===a&&0!==this[t+i+1]&&(a=1),this[t+i]=(e/s>>0)-a&255;return t+n},Jv.prototype.writeInt8=function(e,t,n){return e=+e,t|=0,n||My(this,e,t,1,127,-128),Jv.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),e<0&&(e=255+e+1),this[t]=255&e,t+1},Jv.prototype.writeInt16LE=function(e,t,n){return e=+e,t|=0,n||My(this,e,t,2,32767,-32768),Jv.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):Sy(this,e,t,!0),t+2},Jv.prototype.writeInt16BE=function(e,t,n){return e=+e,t|=0,n||My(this,e,t,2,32767,-32768),Jv.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):Sy(this,e,t,!1),t+2},Jv.prototype.writeInt32LE=function(e,t,n){return e=+e,t|=0,n||My(this,e,t,4,2147483647,-2147483648),Jv.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24):Ty(this,e,t,!0),t+4},Jv.prototype.writeInt32BE=function(e,t,n){return e=+e,t|=0,n||My(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),Jv.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):Ty(this,e,t,!1),t+4},Jv.prototype.writeFloatLE=function(e,t,n){return Dy(this,e,t,!0,n)},Jv.prototype.writeFloatBE=function(e,t,n){return Dy(this,e,t,!1,n)},Jv.prototype.writeDoubleLE=function(e,t,n){return ky(this,e,t,!0,n)},Jv.prototype.writeDoubleBE=function(e,t,n){return ky(this,e,t,!1,n)},Jv.prototype.copy=function(e,t,n,r){if(n||(n=0),r||0===r||(r=this.length),t>=e.length&&(t=e.length),t||(t=0),r>0&&r<n&&(r=n),r===n)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw new RangeError("sourceStart out of bounds");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),e.length-t<r-n&&(r=e.length-t+n);var o,i=r-n;if(this===e&&n<t&&t<r)for(o=i-1;o>=0;--o)e[o+t]=this[o+n];else if(i<1e3||!Jv.TYPED_ARRAY_SUPPORT)for(o=0;o<i;++o)e[o+t]=this[o+n];else Uint8Array.prototype.set.call(e,this.subarray(n,n+i),t);return i},Jv.prototype.fill=function(e,t,n,r){if("string"==typeof e){if("string"==typeof t?(r=t,t=0,n=this.length):"string"==typeof n&&(r=n,n=this.length),1===e.length){var o=e.charCodeAt(0);o<256&&(e=o);}if(void 0!==r&&"string"!=typeof r)throw new TypeError("encoding must be a string");if("string"==typeof r&&!Jv.isEncoding(r))throw new TypeError("Unknown encoding: "+r)}else "number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<n)throw new RangeError("Out of range index");if(n<=t)return this;var i;if(t>>>=0,n=void 0===n?this.length:n>>>0,e||(e=0),"number"==typeof e)for(i=t;i<n;++i)this[i]=e;else {var s=ry(e)?e:by(new Jv(e,r).toString()),a=s.length;for(i=0;i<n-t;++i)this[i+t]=s[i%a];}return this};var wy=/[^+\/0-9A-Za-z-_]/g;function Ay(e){return e<16?"0"+e.toString(16):e.toString(16)}function by(e,t){var n;t=t||Infinity;for(var r=e.length,o=null,i=[],s=0;s<r;++s){if((n=e.charCodeAt(s))>55295&&n<57344){if(!o){if(n>56319){(t-=3)>-1&&i.push(239,191,189);continue}if(s+1===r){(t-=3)>-1&&i.push(239,191,189);continue}o=n;continue}if(n<56320){(t-=3)>-1&&i.push(239,191,189),o=n;continue}n=65536+(o-55296<<10|n-56320);}else o&&(t-=3)>-1&&i.push(239,191,189);if(o=null,n<128){if((t-=1)<0)break;i.push(n);}else if(n<2048){if((t-=2)<0)break;i.push(n>>6|192,63&n|128);}else if(n<65536){if((t-=3)<0)break;i.push(n>>12|224,n>>6&63|128,63&n|128);}else {if(!(n<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;i.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128);}}return i}function Ry(e){return function(e){var t,n,r,o,i,s;jv||Bv();var a=e.length;if(a%4>0)throw new Error("Invalid string. Length must be a multiple of 4");i="="===e[a-2]?2:"="===e[a-1]?1:0,s=new Fv(3*a/4-i),r=i>0?a-4:a;var u=0;for(t=0,n=0;t<r;t+=4,n+=3)o=qv[e.charCodeAt(t)]<<18|qv[e.charCodeAt(t+1)]<<12|qv[e.charCodeAt(t+2)]<<6|qv[e.charCodeAt(t+3)],s[u++]=o>>16&255,s[u++]=o>>8&255,s[u++]=255&o;return 2===i?(o=qv[e.charCodeAt(t)]<<2|qv[e.charCodeAt(t+1)]>>4,s[u++]=255&o):1===i&&(o=qv[e.charCodeAt(t)]<<10|qv[e.charCodeAt(t+1)]<<4|qv[e.charCodeAt(t+2)]>>2,s[u++]=o>>8&255,s[u++]=255&o),s}(function(e){if((e=function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}(e).replace(wy,"")).length<2)return "";for(;e.length%4!=0;)e+="=";return e}(e))}function Oy(e,t,n,r){for(var o=0;o<r&&!(o+n>=t.length||o>=e.length);++o)t[o+n]=e[o];return o}function Ly(e){return !!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}var Ny=function(e){Ln(n,e);var t=jn(n);function n(){var e;return kn(this,n),(e=t.call(this)).retry=2,e._request=e.promisify(wx.request),e}return An(n,[{key:"request",value:function(e){return this._checkOptions(e),this._initOptions(e),e=On({},e,{responseType:"text"}),this._requestWithRetry(e)}},{key:"_requestWithRetry",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this._request(e).then(this._handleResolve).catch((function(r){if(fa(r.errMsg)){if(r.errMsg.includes("abort"))return lg({});if(r.errMsg.includes("timeout"))return t.retry>0&&n<t.retry?t._requestWithRetry(e,++n):pg(new Ip({code:_f,message:r.errMsg}));if(r.errMsg.includes("fail"))return t.retry>0&&n<t.retry?t._requestWithRetry(e,++n):pg(new Ip({code:yf,message:r.errMsg}))}return pg(new Ip(On({code:kf,message:r.message},r)))}))}},{key:"_handleResolve",value:function(e){var t=e.data,n=t.error_code,r=t.ErrorCode;return "number"==typeof n&&(r=n),r!==Lu.SUCCESS&&(e.data.ErrorCode=Number("".concat(r))),e}},{key:"promisify",value:function(e){return function(t){return new Promise((function(n,r){var o=e(Object.assign({},t,{success:n,fail:r}));t.updateAbort&&t.updateAbort((function(){o&&ya(o.abort)&&o.abort();}));}))}}}]),n}(Gv),Py=function(){function e(){kn(this,e),this.request=0,this.success=0,this.fail=0,this.reportRate=10,this.requestTimeCost=[];}return An(e,[{key:"report",value:function(){if(1!==this.request){if(this.request%this.reportRate!=0)return null;var e=this.avgRequestTime(),t="runLoop reports: success=".concat(this.success,",fail=").concat(this.fail,",total=").concat(this.request,",avg=").concat(e,",cur=").concat(this.requestTimeCost[this.requestTimeCost.length-1],",max=").concat(Math.max.apply(null,this.requestTimeCost),",min=").concat(Math.min.apply(null,this.requestTimeCost));ca.log(t);}}},{key:"setRequestTime",value:function(e,t){var n=Math.abs(t-e);100===this.requestTimeCost.length&&this.requestTimeCost.shift(),this.requestTimeCost.push(n);}},{key:"avgRequestTime",value:function(){for(var e,t=this.requestTimeCost.length,n=0,r=0;r<t;r++)n+=this.requestTimeCost[r];return e=n/t,Math.round(100*e)/100}}]),e}(),Gy=Nv.create({timeout:6e3,headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"}});Gy.interceptors.response.use((function(e){var t=e.data,n=t.error_code,r=t.ErrorCode;return pa(n)&&(r=n),r!==Lu.SUCCESS&&(e.data.ErrorCode=Number(r)),e}),(function(e){return "Network Error"===e.message&&(!0===Gy.defaults.withCredentials&&ca.warn("Network Error, try to close `IMAxiosAVChatroom.defaults.withCredentials` to false. (IMAxiosAVChatroom.js)"),Gy.defaults.withCredentials=!1),Promise.reject(e)}));var xy=Nv.CancelToken,Uy=function(){function e(t){kn(this,e),this._initializeOptions(t),this._initializeMembers(),this.status=new Py;}return An(e,[{key:"destructor",value:function(){clearTimeout(this._seedID);var e=this._index();for(var t in this)Object.prototype.hasOwnProperty.call(this,t)&&(this[t]=null);return e}},{key:"setIndex",value:function(e){this._index=e;}},{key:"getIndex",value:function(){return this._index}},{key:"isRunning",value:function(){return !this._stoped}},{key:"_initializeOptions",value:function(e){this.options=e;}},{key:"_initializeMembers",value:function(){this._index=-1,this._seedID=0,this._requestStatus=!1,this._stoped=!1,this._intervalTime=0,this._intervalIncreaseStep=1e3,this._intervalDecreaseStep=1e3,this._intervalTimeMax=5e3,this._protectTimeout=3e3,this._getNoticeSeq=this.options.getNoticeSeq,this._retryCount=0,this._responseTime=Date.now(),this._responseTimeThreshold=2e3,this.options.isAVChatRoomLoop?this.requestor=Gy:this.requestor=Pv,ca.log("XHRRunLoop._initializeMembers isAVChatRoomLoop=".concat(!!this.options.isAVChatRoomLoop)),this.abort=null;}},{key:"start",value:function(){0===this._seedID?(this._stoped=!1,this._send()):ca.log('XHRRunLoop.start(), XHRRunLoop is running now, if you want to restart runLoop , please run "stop()" first.');}},{key:"_reset",value:function(){ca.log("XHRRunLoop._reset(), reset long poll _intervalTime",this._intervalTime),this.stop(),this.start();}},{key:"_intervalTimeIncrease",value:function(){this._intervalTime!==this._responseTimeThreshold&&(this._intervalTime<this._responseTimeThreshold&&(this._intervalTime+=this._intervalIncreaseStep),this._intervalTime>this._responseTimeThreshold&&(this._intervalTime=this._responseTimeThreshold));}},{key:"_intervalTimeDecrease",value:function(){0!==this._intervalTime&&(this._intervalTime>0&&(this._intervalTime-=this._intervalDecreaseStep),this._intervalTime<0&&(this._intervalTime=0));}},{key:"_intervalTimeAdjustment",value:function(){var e=Date.now();100*Math.floor((e-this._responseTime)/100)<=this._responseTimeThreshold?this._intervalTimeIncrease():this._intervalTimeDecrease(),this._responseTime=e;}},{key:"_intervalTimeAdjustmentBaseOnResponseData",value:function(e){e.ErrorCode===Lu.SUCCESS?this._intervalTimeDecrease():this._intervalTimeIncrease();}},{key:"_send",value:function(){var e=this;if(!0!==this._requestStatus){this._requestStatus=!0,this.status.request++,"function"==typeof this.options.before&&this.options.before(this.options.pack.requestData);var t=Date.now(),n=0;this.requestor.request({url:this.options.pack.getUrl(),data:this.options.pack.requestData,method:this.options.pack.method,cancelToken:new xy((function(t){e.abort=t;}))}).then((function(r){if(e._intervalTimeAdjustmentBaseOnResponseData.bind(e)(r.data),e._retryCount>0&&(e._retryCount=0),e.status.success++,n=Date.now(),e.status.setRequestTime(t,n),r.data.timecost=n-t,"function"==typeof e.options.success)try{e.options.success({pack:e.options.pack,error:!1,data:e.options.pack.callback(r.data)});}catch(o){ca.warn("XHRRunLoop._send(), error:",o);}e._requestStatus=!1,!1===e._stoped&&(e._seedID=setTimeout(e._send.bind(e),e._intervalTime)),e.status.report();})).catch((function(r){if(e.status.fail++,e._retryCount++,e._intervalTimeAdjustment.bind(e)(),!1===e._stoped&&(e._seedID=setTimeout(e._send.bind(e),e._intervalTime)),e._requestStatus=!1,"function"==typeof e.options.fail&&void 0!==r.request)try{e.options.fail({pack:e.options.pack,error:r,data:!1});}catch(o){ca.warn("XHRRunLoop._send(), fail callback error:"),ca.error(o);}n=Date.now(),e.status.setRequestTime(t,n),e.status.report();}));}}},{key:"stop",value:function(){this._clearAllTimeOut(),this._stoped=!0;}},{key:"_clearAllTimeOut",value:function(){clearTimeout(this._seedID),this._seedID=0;}}]),e}(),qy=function(){function e(t){kn(this,e),this._initializeOptions(t),this._initializeMembers(),this.status=new Py;}return An(e,[{key:"destructor",value:function(){clearTimeout(this._seedID);var e=this._index();for(var t in this)Object.prototype.hasOwnProperty.call(this,t)&&(this[t]=null);return e}},{key:"setIndex",value:function(e){this._index=e;}},{key:"isRunning",value:function(){return !this._stoped}},{key:"getIndex",value:function(){return this._index}},{key:"_initializeOptions",value:function(e){this.options=e;}},{key:"_initializeMembers",value:function(){this._index=-1,this._seedID=0,this._requestStatus=!1,this._stoped=!1,this._intervalTime=0,this._intervalIncreaseStep=1e3,this._intervalDecreaseStep=1e3,this._intervalTimeMax=5e3,this._protectTimeout=3e3,this._getNoticeSeq=this.options.getNoticeSeq,this._retryCount=0,this._responseTime=Date.now(),this._responseTimeThreshold=2e3,this.requestor=new Ny,this.abort=null;}},{key:"start",value:function(){0===this._seedID?(this._stoped=!1,this._send()):ca.log('WXRunLoop.start(): WXRunLoop is running now, if you want to restart runLoop , please run "stop()" first.');}},{key:"_reset",value:function(){ca.log("WXRunLoop.reset(), long poll _intervalMaxRate",this._intervalMaxRate),this.stop(),this.start();}},{key:"_intervalTimeIncrease",value:function(){this._intervalTime!==this._responseTimeThreshold&&(this._intervalTime<this._responseTimeThreshold&&(this._intervalTime+=this._intervalIncreaseStep),this._intervalTime>this._responseTimeThreshold&&(this._intervalTime=this._responseTimeThreshold));}},{key:"_intervalTimeDecrease",value:function(){0!==this._intervalTime&&(this._intervalTime>0&&(this._intervalTime-=this._intervalDecreaseStep),this._intervalTime<0&&(this._intervalTime=0));}},{key:"_intervalTimeAdjustment",value:function(){var e=Date.now();100*Math.floor((e-this._responseTime)/100)<=this._responseTimeThreshold?this._intervalTimeIncrease():this._intervalTimeDecrease(),this._responseTime=e;}},{key:"_intervalTimeAdjustmentBaseOnResponseData",value:function(e){e.ErrorCode===Lu.SUCCESS?this._intervalTimeDecrease():this._intervalTimeIncrease();}},{key:"_send",value:function(){var e=this;if(!0!==this._requestStatus){var t=this;this._requestStatus=!0,this.status.request++,"function"==typeof this.options.before&&this.options.before(t.options.pack.requestData);var n=Date.now(),r=0;this.requestor.request({url:t.options.pack.getUrl(),data:t.options.pack.requestData,method:t.options.pack.method,updateAbort:function(t){e.abort=t;}}).then((function(o){if(t._intervalTimeAdjustmentBaseOnResponseData.bind(e)(o.data),t._retryCount>0&&(t._retryCount=0),e.status.success++,r=Date.now(),e.status.setRequestTime(n,r),o.data.timecost=r-n,"function"==typeof t.options.success)try{e.options.success({pack:e.options.pack,error:!1,data:e.options.pack.callback(o.data)});}catch(i){ca.warn("WXRunLoop._send(), error:",i);}t._requestStatus=!1,!1===t._stoped&&(t._seedID=setTimeout(t._send.bind(t),t._intervalTime)),e.status.report();})).catch((function(o){if(e.status.fail++,t._retryCount++,t._intervalTimeAdjustment.bind(e)(),!1===t._stoped&&(t._seedID=setTimeout(t._send.bind(t),t._intervalTime)),t._requestStatus=!1,"function"==typeof t.options.fail)try{e.options.fail({pack:e.options.pack,error:o,data:!1});}catch(i){ca.warn("WXRunLoop._send(), fail callback error:"),ca.error(i);}r=Date.now(),e.status.setRequestTime(n,r),e.status.report();}));}}},{key:"stop",value:function(){this._clearAllTimeOut(),this._stoped=!0;}},{key:"_clearAllTimeOut",value:function(){clearTimeout(this._seedID),this._seedID=0;}}]),e}(),Fy=function(){function e(t){kn(this,e),this.tim=t,this.httpConnection=Rs?new Ny:new xv,this.keepAliveConnections=[];}return An(e,[{key:"initializeListener",value:function(){this.tim.innerEmitter.on(Nd,this._stopAllRunLoop,this);}},{key:"request",value:function(e){var t={url:e.url,data:e.requestData,method:e.method,callback:e.callback};return this.httpConnection.request(t).then((function(t){return t.data=e.callback(t.data),t.data.errorCode!==Lu.SUCCESS?pg(new Ip({code:t.data.errorCode,message:t.data.errorInfo})):t}))}},{key:"createRunLoop",value:function(e){var t=this.createKeepAliveConnection(e);return t.setIndex(this.keepAliveConnections.push(t)-1),t}},{key:"stopRunLoop",value:function(e){e.stop();}},{key:"_stopAllRunLoop",value:function(){for(var e=this.keepAliveConnections.length,t=0;t<e;t++)this.keepAliveConnections[t].stop();}},{key:"destroyRunLoop",value:function(e){e.stop();var t=e.destructor();this.keepAliveConnections.slice(t,1);}},{key:"startRunLoopExclusive",value:function(e){for(var t=e.getIndex(),n=0;n<this.keepAliveConnections.length;n++)n!==t&&this.keepAliveConnections[n].stop();e.start();}},{key:"createKeepAliveConnection",value:function(e){return Rs?new qy(e):(this.tim.options.runLoopNetType===ep||this.tim.options.runLoopNetType,new Uy(e))}},{key:"clearAll",value:function(){this.conn.cancelAll();}},{key:"reset",value:function(){this.keepAliveConnections=[];}}]),e}(),jy=function(){function e(t){kn(this,e),this.tim=t,this.tim.innerEmitter.on(xd,this._onErrorDetected,this);}return An(e,[{key:"_onErrorDetected",value:function(e){var t=e.data,n=new Mg;n.setMethod(Tm).setStart(),n.setCode(0).setText("code=".concat(t.code," message=").concat(t.message)).setNetworkType(this.tim.netMonitor.getNetworkType()).setEnd(),t.code?ca.warn("Oops! code:".concat(t.code," message:").concat(t.message)):ca.warn("Oops! message:".concat(t.message," stack:").concat(t.stack)),this.tim.outerEmitter.emit(ln.ERROR,t);}}]),e}(),By=function(){function e(t){var n=this;kn(this,e),ja(t)||(this.userID=t.userID||"",this.nick=t.nick||"",this.gender=t.gender||"",this.birthday=t.birthday||0,this.location=t.location||"",this.selfSignature=t.selfSignature||"",this.allowType=t.allowType||pn.ALLOW_TYPE_ALLOW_ANY,this.language=t.language||0,this.avatar=t.avatar||"",this.messageSettings=t.messageSettings||0,this.adminForbidType=t.adminForbidType||pn.FORBID_TYPE_NONE,this.level=t.level||0,this.role=t.role||0,this.lastUpdatedTime=0,this.profileCustomField=[],ja(t.profileCustomField)||t.profileCustomField.forEach((function(e){n.profileCustomField.push({key:e.key,value:e.value});})));}return An(e,[{key:"validate",value:function(e){var t=!0,n="";if(ja(e))return {valid:!1,tips:"empty options"};if(e.profileCustomField)for(var r=e.profileCustomField.length,o=null,i=0;i<r;i++){if(o=e.profileCustomField[i],!fa(o.key)||-1===o.key.indexOf("Tag_Profile_Custom"))return {valid:!1,tips:"自定义资料字段的前缀必须是 Tag_Profile_Custom"};if(!fa(o.value))return {valid:!1,tips:"自定义资料字段的 value 必须是字符串"}}for(var s in e)if(Object.prototype.hasOwnProperty.call(e,s)){if("profileCustomField"===s)continue;if(ja(e[s])&&!fa(e[s])&&!pa(e[s])){n="key:"+s+", invalid value:"+e[s],t=!1;continue}switch(s){case"nick":fa(e[s])||(n="nick should be a string",t=!1),ka(e[s])>500&&(n="nick name limited: must less than or equal to ".concat(500," bytes, current size: ").concat(ka(e[s])," bytes"),t=!1);break;case"gender":Ra(op,e.gender)||(n="key:gender, invalid value:"+e.gender,t=!1);break;case"birthday":pa(e.birthday)||(n="birthday should be a number",t=!1);break;case"location":fa(e.location)||(n="location should be a string",t=!1);break;case"selfSignature":fa(e.selfSignature)||(n="selfSignature should be a string",t=!1);break;case"allowType":Ra(sp,e.allowType)||(n="key:allowType, invalid value:"+e.allowType,t=!1);break;case"language":pa(e.language)||(n="language should be a number",t=!1);break;case"avatar":fa(e.avatar)||(n="avatar should be a string",t=!1);break;case"messageSettings":0!==e.messageSettings&&1!==e.messageSettings&&(n="messageSettings should be 0 or 1",t=!1);break;case"adminForbidType":Ra(ip,e.adminForbidType)||(n="key:adminForbidType, invalid value:"+e.adminForbidType,t=!1);break;case"level":pa(e.level)||(n="level should be a number",t=!1);break;case"role":pa(e.role)||(n="role should be a number",t=!1);break;default:n="unknown key:"+s+"  "+e[s],t=!1;}}return {valid:t,tips:n}}}]),e}(),Hy=function(){function e(t){kn(this,e),this.userController=t,this.TAG="profile",this.Actions={Q:"query",U:"update"},this.accountProfileMap=new Map,this.expirationTime=864e5;}return An(e,[{key:"setExpirationTime",value:function(e){this.expirationTime=e;}},{key:"getUserProfile",value:function(e){var t=this,n=e.userIDList;e.fromAccount=this.userController.getMyAccount(),n.length>100&&(ca.warn("ProfileHandler.getUserProfile 获取用户资料人数不能超过100人"),n.length=100);for(var r,o=[],i=[],s=0,a=n.length;s<a;s++)r=n[s],this.userController.isMyFriend(r)&&this._containsAccount(r)?i.push(this._getProfileFromMap(r)):o.push(r);if(0===o.length)return lg(i);e.toAccount=o;var u=e.bFromGetMyProfile||!1,c=[];e.toAccount.forEach((function(e){c.push({toAccount:e,standardSequence:0,customSequence:0});})),e.userItem=c;var l=new Mg;l.setMethod(vm).setText(n.length>5?"userIDList.length=".concat(n.length):"userIDList=".concat(n)).setStart();var p=this.userController.generateConfig(this.TAG,this.Actions.Q,e);return this.userController.request(p).then((function(e){l.setCode(0).setNetworkType(t.userController.getNetworkType()).setEnd(),ca.info("ProfileHandler.getUserProfile ok");var n=t._handleResponse(e).concat(i);return u?(t.userController.onGotMyProfile(),new ag(n[0])):new ag(n)})).catch((function(e){return t.userController.probeNetwork().then((function(t){var n=Bn(t,2),r=n[0],o=n[1];l.setError(e,r,o).setEnd();})),ca.error("ProfileHandler.getUserProfile error:",e),pg(e)}))}},{key:"getMyProfile",value:function(){var e=this.userController.getMyAccount();if(ca.log("ProfileHandler.getMyProfile myAccount="+e),this._fillMap(),this._containsAccount(e)){var t=this._getProfileFromMap(e);return ca.debug("ProfileHandler.getMyProfile from cache, myProfile:"+JSON.stringify(t)),this.userController.onGotMyProfile(),lg(t)}return this.getUserProfile({fromAccount:e,userIDList:[e],bFromGetMyProfile:!0})}},{key:"_handleResponse",value:function(e){for(var t,n,r=Sa.now(),o=e.data.userProfileItem,i=[],s=0,a=o.length;s<a;s++)"@TLS#NOT_FOUND"!==o[s].to&&""!==o[s].to&&(t=o[s].to,n=this._updateMap(t,this._getLatestProfileFromResponse(t,o[s].profileItem)),i.push(n));return ca.log("ProfileHandler._handleResponse cost "+(Sa.now()-r)+" ms"),i}},{key:"_getLatestProfileFromResponse",value:function(e,t){var n={};if(n.userID=e,n.profileCustomField=[],!ja(t))for(var r=0,o=t.length;r<o;r++)if(t[r].tag.indexOf("Tag_Profile_Custom")>-1)n.profileCustomField.push({key:t[r].tag,value:t[r].value});else switch(t[r].tag){case rp.NICK:n.nick=t[r].value;break;case rp.GENDER:n.gender=t[r].value;break;case rp.BIRTHDAY:n.birthday=t[r].value;break;case rp.LOCATION:n.location=t[r].value;break;case rp.SELFSIGNATURE:n.selfSignature=t[r].value;break;case rp.ALLOWTYPE:n.allowType=t[r].value;break;case rp.LANGUAGE:n.language=t[r].value;break;case rp.AVATAR:n.avatar=t[r].value;break;case rp.MESSAGESETTINGS:n.messageSettings=t[r].value;break;case rp.ADMINFORBIDTYPE:n.adminForbidType=t[r].value;break;case rp.LEVEL:n.level=t[r].value;break;case rp.ROLE:n.role=t[r].value;break;default:ca.warn("ProfileHandler._handleResponse unkown tag->",t[r].tag,t[r].value);}return n}},{key:"updateMyProfile",value:function(e){var t=this,n=new Mg;n.setMethod(ym).setText(JSON.stringify(e)).setStart();var r=(new By).validate(e);if(!r.valid)return n.setCode(hf).setMessage("ProfileHandler.updateMyProfile info:".concat(r.tips)).setNetworkType(this.userController.getNetworkType()).setEnd(),ca.error("ProfileHandler.updateMyProfile info:".concat(r.tips,"，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#updateMyProfile")),pg({code:hf,message:Sh});var o=[];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&("profileCustomField"===i?e.profileCustomField.forEach((function(e){o.push({tag:e.key,value:e.value});})):o.push({tag:rp[i.toUpperCase()],value:e[i]}));if(0===o.length)return n.setCode(df).setMessage(Th).setNetworkType(this.userController.getNetworkType()).setEnd(),ca.error("ProfileHandler.updateMyProfile info:".concat(Th,"，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#updateMyProfile")),pg({code:df,message:Th});var s=this.userController.generateConfig(this.TAG,this.Actions.U,{fromAccount:this.userController.getMyAccount(),profileItem:o});return this.userController.request(s).then((function(r){n.setCode(0).setNetworkType(t.userController.getNetworkType()).setEnd(),ca.info("ProfileHandler.updateMyProfile ok");var o=t._updateMap(t.userController.getMyAccount(),e);return t.userController.emitOuterEvent(ln.PROFILE_UPDATED,[o]),lg(o)})).catch((function(e){return t.userController.probeNetwork().then((function(t){var r=Bn(t,2),o=r[0],i=r[1];n.setError(e,o,i).setEnd();})),ca.error("ProfileHandler.updateMyProfile error:",e),pg(e)}))}},{key:"onProfileModified",value:function(e){var t=e.data;if(!ja(t)){var n,r,o=t.length;ca.info("ProfileHandler.onProfileModified length="+o);for(var i=[],s=0;s<o;s++)n=t[s].userID,r=this._updateMap(n,this._getLatestProfileFromResponse(n,t[s].profileList)),i.push(r);this.userController.emitInnerEvent(jd,i),this.userController.emitOuterEvent(ln.PROFILE_UPDATED,i);}}},{key:"_fillMap",value:function(){if(0===this.accountProfileMap.size){for(var e=this._getCachedProfiles(),t=Date.now(),n=0,r=e.length;n<r;n++)t-e[n].lastUpdatedTime<this.expirationTime&&this.accountProfileMap.set(e[n].userID,e[n]);ca.log("ProfileHandler._fillMap from cache, map.size="+this.accountProfileMap.size);}}},{key:"_updateMap",value:function(e,t){var n,r=Date.now();return this._containsAccount(e)?(n=this._getProfileFromMap(e),t.profileCustomField&&Pa(n.profileCustomField,t.profileCustomField),Ta(n,t,["profileCustomField"]),n.lastUpdatedTime=r):(n=new By(t),(this.userController.isMyFriend(e)||e===this.userController.getMyAccount())&&(n.lastUpdatedTime=r,this.accountProfileMap.set(e,n))),this._flushMap(e===this.userController.getMyAccount()),n}},{key:"_flushMap",value:function(e){var t=Hn(this.accountProfileMap.values()),n=this.userController.tim.storage;ca.debug("ProfileHandler._flushMap length=".concat(t.length," flushAtOnce=").concat(e)),n.setItem(this.TAG,t,e);}},{key:"_containsAccount",value:function(e){return this.accountProfileMap.has(e)}},{key:"_getProfileFromMap",value:function(e){return this.accountProfileMap.get(e)}},{key:"_getCachedProfiles",value:function(){var e=this.userController.tim.storage.getItem(this.TAG);return ja(e)?[]:e}},{key:"onConversationsProfileUpdated",value:function(e){for(var t,n,r,o=[],i=0,s=e.length;i<s;i++)n=(t=e[i]).userID,this.userController.isMyFriend(n)&&(this._containsAccount(n)?(r=this._getProfileFromMap(n),Ta(r,t)>0&&o.push(n)):o.push(t.userID));0!==o.length&&(ca.info("ProfileHandler.onConversationsProfileUpdated toAccount:",o),this.getUserProfile({userIDList:o}));}},{key:"reset",value:function(){this._flushMap(!0),this.accountProfileMap.clear();}}]),e}();Ae({target:"String",proto:!0},{repeat:kr});var Vy=function(){function e(t){kn(this,e),this.options=t?t.options:{enablePointer:!0},this.pointsList={},this.reportText={},this.maxNameLen=0,this.gapChar="-",this.log=console.log,this.currentTask="";}return An(e,[{key:"newTask",value:function(e){!1!==this.options.enablePointer&&(e||(e=["task",this._timeFormat()].join("-")),this.pointsList[e]=[],this.currentTask=e,console.log("Pointer new Task : ".concat(this.currentTask)));}},{key:"deleteTask",value:function(e){!1!==this.options.enablePointer&&(e||(e=this.currentTask),this.pointsList[e].length=0,delete this.pointsList[e]);}},{key:"dot",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1?arguments[1]:void 0;if(!1!==this.options.enablePointer){t=t||this.currentTask;var n=+new Date;this.maxNameLen=this.maxNameLen<e.length?e.length:this.maxNameLen,this.flen=this.maxNameLen+10,this.pointsList[t].push({pointerName:e,time:n});}}},{key:"_analisys",value:function(e){if(!1!==this.options.enablePointer){e=e||this.currentTask;for(var t=this.pointsList[e],n=t.length,r=[],o=[],i=0;i<n;i++)0!==i&&(o=this._analisysTowPoints(t[i-1],t[i]),r.push(o.join("")));return o=this._analisysTowPoints(t[0],t[n-1],!0),r.push(o.join("")),r.join("")}}},{key:"_analisysTowPoints",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!1!==this.options.enablePointer){var r=this.flen,o=t.time-e.time,i=o.toString(),s=e.pointerName+this.gapChar.repeat(r-e.pointerName.length),a=t.pointerName+this.gapChar.repeat(r-t.pointerName.length),u=this.gapChar.repeat(4-i.length)+i,c=n?["%c",s,a,u,"ms\n%c"]:[s,a,u,"ms\n"];return c}}},{key:"report",value:function(e){if(!1!==this.options.enablePointer){e=e||this.currentTask;var t=this._analisys(e);this.pointsList=[];var n=this._timeFormat(),r="Pointer[".concat(e,"(").concat(n,")]"),o=4*this.maxNameLen,i=(o-r.length)/2;console.log(["-".repeat(i),r,"-".repeat(i)].join("")),console.log("%c"+t,"color:#66a","color:red","color:#66a"),console.log("-".repeat(o));}}},{key:"_timeFormat",value:function(){var e=new Date,t=this.zeroFix(e.getMonth()+1,2),n=this.zeroFix(e.getDate(),2);return "".concat(t,"-").concat(n," ").concat(e.getHours(),":").concat(e.getSeconds(),":").concat(e.getMinutes(),"~").concat(e.getMilliseconds())}},{key:"zeroFix",value:function(e,t){return ("000000000"+e).slice(-t)}},{key:"reportAll",value:function(){if(!1!==this.options.enablePointer)for(var e in this.pointsList)Object.prototype.hasOwnProperty.call(this.pointsList,e)&&this.eport(e);}}]),e}(),Ky=function e(t,n){kn(this,e),this.userID=t;var r={};if(r.userID=t,!ja(n))for(var o=0,i=n.length;o<i;o++)switch(n[o].tag){case rp.NICK:r.nick=n[o].value;break;case rp.GENDER:r.gender=n[o].value;break;case rp.BIRTHDAY:r.birthday=n[o].value;break;case rp.LOCATION:r.location=n[o].value;break;case rp.SELFSIGNATURE:r.selfSignature=n[o].value;break;case rp.ALLOWTYPE:r.allowType=n[o].value;break;case rp.LANGUAGE:r.language=n[o].value;break;case rp.AVATAR:r.avatar=n[o].value;break;case rp.MESSAGESETTINGS:r.messageSettings=n[o].value;break;case rp.ADMINFORBIDTYPE:r.adminForbidType=n[o].value;break;case rp.LEVEL:r.level=n[o].value;break;case rp.ROLE:r.role=n[o].value;break;default:ca.debug("snsProfileItem unkown tag->",n[o].tag);}this.profile=new By(r);},$y=function(){function e(t){kn(this,e),this.userController=t,this.TAG="friend",this.Actions={G:"get",D:"delete"},this.friends=new Map,this.pointer=new Vy;}return An(e,[{key:"isMyFriend",value:function(e){var t=this.friends.has(e);return t||ca.debug("FriendHandler.isMyFriend "+e+" is not my friend"),t}},{key:"_transformFriendList",value:function(e){if(!ja(e)&&!ja(e.infoItem)){ca.info("FriendHandler._transformFriendList friendNum="+e.friendNum);for(var t,n,r=e.infoItem,o=0,i=r.length;o<i;o++)n=r[o].infoAccount,t=new Ky(n,r[o].snsProfileItem),this.friends.set(n,t);}}},{key:"_friends2map",value:function(e){var t=new Map;for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.set(n,e[n]);return t}},{key:"getFriendList",value:function(){var e=this,t={};t.fromAccount=this.userController.getMyAccount(),ca.info("FriendHandler.getFriendList myAccount="+t.fromAccount);var n=this.userController.generateConfig(this.TAG,this.Actions.G,t);return this.userController.request(n).then((function(t){ca.info("FriendHandler.getFriendList ok"),e._transformFriendList(t.data);var n=Hn(e.friends.values());return lg(n)})).catch((function(e){return ca.error("FriendHandler.getFriendList error:",JSON.stringify(e)),pg(e)}))}},{key:"deleteFriend",value:function(e){if(!Array.isArray(e.toAccount))return ca.error("FriendHandler.deleteFriend options.toAccount 必需是数组"),pg({code:ff,message:Mh});e.toAccount.length>1e3&&(ca.warn("FriendHandler.deleteFriend 删除好友人数不能超过1000人"),e.toAccount.length=1e3);var t=this.userController.generateConfig(this.TAG,this.Actions.D,e);return this.userController.request(t).then((function(e){return ca.info("FriendHandler.deleteFriend ok"),lg()})).catch((function(e){return ca.error("FriendHandler.deleteFriend error:",e),pg(e)}))}}]),e}(),Yy=function e(t){kn(this,e),ja||(this.userID=t.userID||"",this.timeStamp=t.timeStamp||0);},zy=function(){function e(t){kn(this,e),this.userController=t,this.TAG="blacklist",this.Actions={G:"get",C:"create",D:"delete"},this.blacklistMap=new Map,this.startIndex=0,this.maxLimited=100,this.curruentSequence=0;}return An(e,[{key:"getBlacklist",value:function(){var e=this,t={};t.fromAccount=this.userController.getMyAccount(),t.maxLimited=this.maxLimited,t.startIndex=0,t.lastSequence=this.curruentSequence;var n=new Mg;n.setMethod(_m).setStart();var r=this.userController.generateConfig(this.TAG,this.Actions.G,t);return this.userController.request(r).then((function(t){var r=ja(t.data.blackListItem)?0:t.data.blackListItem.length;return n.setCode(0).setNetworkType(e.userController.getNetworkType()).setText(r).setEnd(),ca.info("BlacklistHandler.getBlacklist ok"),e.curruentSequence=t.data.curruentSequence,e._handleResponse(t.data.blackListItem,!0),e._onBlacklistUpdated()})).catch((function(t){return e.userController.probeNetwork().then((function(e){var r=Bn(e,2),o=r[0],i=r[1];n.setError(t,o,i).setEnd();})),ca.error("BlacklistHandler.getBlacklist error:",t),pg(t)}))}},{key:"addBlacklist",value:function(e){var t=this,n=new Mg;if(n.setMethod(Cm).setStart(),!ga(e.userIDList))return n.setCode(gf).setMessage("BlacklistHandler.addBlacklist options.userIDList 必需是数组").setNetworkType(this.userController.getNetworkType()).setEnd(),ca.error("BlacklistHandler.addBlacklist options.userIDList 必需是数组"),pg({code:gf,message:Eh});var r=this.userController.tim.loginInfo.identifier;if(1===e.userIDList.length&&e.userIDList[0]===r)return n.setCode(vf).setMessage(kh).setNetworkType(this.userController.getNetworkType()).setEnd(),ca.error("BlacklistHandler.addBlacklist 不能把自己拉黑"),pg({code:vf,message:kh});e.userIDList.includes(r)&&(e.userIDList=e.userIDList.filter((function(e){return e!==r})),ca.warn("BlacklistHandler.addBlacklist 不能把自己拉黑，已过滤")),e.fromAccount=this.userController.getMyAccount(),e.toAccount=e.userIDList;var o=this.userController.generateConfig(this.TAG,this.Actions.C,e);return this.userController.request(o).then((function(r){return n.setCode(0).setNetworkType(t.userController.getNetworkType()).setText(e.userIDList.length>5?"userIDList.length=".concat(e.userIDList.length):"userIDList=".concat(e.userIDList)).setEnd(),ca.info("BlacklistHandler.addBlacklist ok"),t._handleResponse(r.data.resultItem,!0),t._onBlacklistUpdated()})).catch((function(e){return t.userController.probeNetwork().then((function(t){var r=Bn(t,2),o=r[0],i=r[1];n.setError(e,o,i).setEnd();})),ca.error("BlacklistHandler.addBlacklist error:",e),pg(e)}))}},{key:"_handleResponse",value:function(e,t){if(!ja(e))for(var n,r,o,i=0,s=e.length;i<s;i++)r=e[i].to,o=e[i].resultCode,(ma(o)||0===o)&&(t?((n=this.blacklistMap.has(r)?this.blacklistMap.get(r):new Yy).userID=r,!ja(e[i].addBlackTimeStamp)&&(n.timeStamp=e[i].addBlackTimeStamp),this.blacklistMap.set(r,n)):this.blacklistMap.has(r)&&(n=this.blacklistMap.get(r),this.blacklistMap.delete(r)));ca.log("BlacklistHandler._handleResponse total="+this.blacklistMap.size+" bAdd="+t);}},{key:"deleteBlacklist",value:function(e){var t=this,n=new Mg;if(n.setMethod(Im).setStart(),!ga(e.userIDList))return n.setCode(mf).setMessage("BlacklistHandler.deleteBlacklist options.userIDList 必需是数组").setNetworkType(this.userController.getNetworkType()).setEnd(),ca.error("BlacklistHandler.deleteBlacklist options.userIDList 必需是数组"),pg({code:mf,message:Dh});e.fromAccount=this.userController.getMyAccount(),e.toAccount=e.userIDList;var r=this.userController.generateConfig(this.TAG,this.Actions.D,e);return this.userController.request(r).then((function(r){return n.setCode(0).setNetworkType(t.userController.getNetworkType()).setText(e.userIDList.length>5?"userIDList.length=".concat(e.userIDList.length):"userIDList=".concat(e.userIDList)).setEnd(),ca.info("BlacklistHandler.deleteBlacklist ok"),t._handleResponse(r.data.resultItem,!1),t._onBlacklistUpdated()})).catch((function(e){return t.userController.probeNetwork().then((function(t){var r=Bn(t,2),o=r[0],i=r[1];n.setError(e,o,i).setEnd();})),ca.error("BlacklistHandler.deleteBlacklist error:",e),pg(e)}))}},{key:"_onBlacklistUpdated",value:function(){var e=Hn(this.blacklistMap.keys());return this.userController.emitOuterEvent(ln.BLACKLIST_UPDATED,e),lg(e)}},{key:"handleBlackListDelAccount",value:function(e){for(var t,n=[],r=0,o=e.length;r<o;r++)t=e[r],this.blacklistMap.has(t)&&(this.blacklistMap.delete(t),n.push(t));n.length>0&&(ca.log("BlacklistHandler.handleBlackListDelAccount delCount="+n.length+" : "+n.join(",")),this.userController.emitOuterEvent(ln.BLACKLIST_UPDATED,Hn(this.blacklistMap.keys())));}},{key:"handleBlackListAddAccount",value:function(e){for(var t,n=[],r=0,o=e.length;r<o;r++)t=e[r],this.blacklistMap.has(t)||(this.blacklistMap.set(t,new Yy({userID:t})),n.push(t));n.length>0&&(ca.log("BlacklistHandler.handleBlackListAddAccount addCount="+n.length+" : "+n.join(",")),this.userController.emitOuterEvent(ln.BLACKLIST_UPDATED,Hn(this.blacklistMap.keys())));}},{key:"reset",value:function(){this.blacklistMap.clear(),this.startIndex=0,this.maxLimited=100,this.curruentSequence=0;}}]),e}(),Wy=function(){function e(t){kn(this,e),this.userController=t,this.TAG="applyC2C",this.Actions={C:"create",G:"get",D:"delete",U:"update"};}return An(e,[{key:"applyAddFriend",value:function(e){var t=this,n=this.userController.generateConfig(this.TAG,this.Actions.C,e),r=this.userController.request(n);return r.then((function(e){t.userController.isActionSuccessful("applyAddFriend",t.Actions.C,e);})).catch((function(e){})),r}},{key:"getPendency",value:function(e){var t=this,n=this.userController.generateConfig(this.TAG,this.Actions.G,e),r=this.userController.request(n);return r.then((function(e){t.userController.isActionSuccessful("getPendency",t.Actions.G,e);})).catch((function(e){})),r}},{key:"deletePendency",value:function(e){var t=this,n=this.userController.generateConfig(this.TAG,this.Actions.D,e),r=this.userController.request(n);return r.then((function(e){t.userController.isActionSuccessful("deletePendency",t.Actions.D,e);})).catch((function(e){})),r}},{key:"replyPendency",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=this.userController.generateConfig(this.TAG,this.Actions.U,t),r=this.userController.request(n);return r.then((function(t){e.userController.isActionSuccessful("replyPendency",e.Actions.U,t);})).catch((function(e){})),r}}]),e}(),Xy=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e)).profileHandler=new Hy(qn(r)),r.friendHandler=new $y(qn(r)),r.blacklistHandler=new zy(qn(r)),r.applyC2CHandler=new Wy(qn(r)),r._initializeListener(),r}return An(n,[{key:"_initializeListener",value:function(e){var t=this.tim.innerEmitter;t.on(rd,this.onContextUpdated,this),t.on(Dd,this.onProfileModified,this),t.on(Ed,this.onNewFriendMessages,this),t.on(qd,this.onConversationsProfileUpdated,this);}},{key:"onContextUpdated",value:function(e){var t=this.tim.context;!1!=!!t.a2Key&&!1!=!!t.tinyID&&(this.profileHandler.getMyProfile(),this.friendHandler.getFriendList(),this.blacklistHandler.getBlacklist());}},{key:"onGotMyProfile",value:function(){this.triggerReady();}},{key:"onProfileModified",value:function(e){this.profileHandler.onProfileModified(e);}},{key:"onNewFriendMessages",value:function(e){ca.debug("onNewFriendMessages",JSON.stringify(e.data)),ja(e.data.blackListDelAccount)||this.blacklistHandler.handleBlackListDelAccount(e.data.blackListDelAccount),ja(e.data.blackListAddAccount)||this.blacklistHandler.handleBlackListAddAccount(e.data.blackListAddAccount);}},{key:"onConversationsProfileUpdated",value:function(e){this.profileHandler.onConversationsProfileUpdated(e.data);}},{key:"getMyAccount",value:function(){return this.tim.context.identifier}},{key:"isMyFriend",value:function(e){return this.friendHandler.isMyFriend(e)}},{key:"generateConfig",value:function(e,t,n){return {name:e,action:t,param:n}}},{key:"getMyProfile",value:function(){return this.profileHandler.getMyProfile()}},{key:"getUserProfile",value:function(e){return this.profileHandler.getUserProfile(e)}},{key:"updateMyProfile",value:function(e){return this.profileHandler.updateMyProfile(e)}},{key:"getFriendList",value:function(){return this.friendHandler.getFriendList()}},{key:"deleteFriend",value:function(e){return this.friendHandler.deleteFriend(e)}},{key:"getBlacklist",value:function(){return this.blacklistHandler.getBlacklist()}},{key:"addBlacklist",value:function(e){return this.blacklistHandler.addBlacklist(e)}},{key:"deleteBlacklist",value:function(e){return this.blacklistHandler.deleteBlacklist(e)}},{key:"applyAddFriend",value:function(e){return this.applyC2CHandler.applyAddFriend(e)}},{key:"getPendency",value:function(e){return this.applyC2CHandler.getPendency(e)}},{key:"deletePendency",value:function(e){return this.applyC2CHandler.deletePendency(e)}},{key:"replyPendency",value:function(e){return this.applyC2CHandler.replyPendency(e)}},{key:"reset",value:function(){ca.info("UserController.reset"),this.resetReady(),this.profileHandler.reset(),this.blacklistHandler.reset(),this.checkTimes=0;}}]),n}(og),Jy=[],Qy=Jy.sort,Zy=o((function(){Jy.sort(void 0);})),e_=o((function(){Jy.sort(null);})),t_=Ke("sort");Ae({target:"Array",proto:!0,forced:Zy||!e_||!t_},{sort:function(e){return void 0===e?Qy.call(Oe(this)):Qy.call(Oe(this),be(e))}});var n_=["groupID","name","avatar","type","introduction","notification","ownerID","selfInfo","createTime","infoSequence","lastInfoTime","lastMessage","nextMessageSeq","memberNum","maxMemberNum","memberList","joinOption","groupCustomField","muteAllMembers"],r_=function(){function e(t){kn(this,e),this.groupID="",this.name="",this.avatar="",this.type="",this.introduction="",this.notification="",this.ownerID="",this.createTime="",this.infoSequence="",this.lastInfoTime="",this.selfInfo={messageRemindType:"",joinTime:"",nameCard:"",role:""},this.lastMessage={lastTime:"",lastSequence:"",fromAccount:"",messageForShow:""},this.nextMessageSeq="",this.memberNum="",this.maxMemberNum="",this.joinOption="",this.groupCustomField=[],this.muteAllMembers=void 0,this._initGroup(t);}return An(e,[{key:"_initGroup",value:function(e){for(var t in e)n_.indexOf(t)<0||("selfInfo"!==t?this[t]=e[t]:this.updateSelfInfo(e[t]));}},{key:"updateGroup",value:function(e){e.lastMsgTime&&(this.lastMessage.lastTime=e.lastMsgTime),ma(e.muteAllMembers)||("On"===e.muteAllMembers?e.muteAllMembers=!0:e.muteAllMembers=!1),e.groupCustomField&&Pa(this.groupCustomField,e.groupCustomField),Ta(this,e,["members","errorCode","lastMsgTime","groupCustomField"]);}},{key:"updateSelfInfo",value:function(e){var t=e.nameCard,n=e.joinTime,r=e.role,o=e.messageRemindType;Ta(this.selfInfo,{nameCard:t,joinTime:n,role:r,messageRemindType:o},[],["",null,void 0,0,NaN]);}},{key:"setSelfNameCard",value:function(e){this.selfInfo.nameCard=e;}}]),e}(),o_=function(e,t){if(ma(t))return "";switch(e){case pn.MSG_TEXT:return t.text;case pn.MSG_IMAGE:return "[图片]";case pn.MSG_GEO:return "[位置]";case pn.MSG_AUDIO:return "[语音]";case pn.MSG_VIDEO:return "[视频]";case pn.MSG_FILE:return "[文件]";case pn.MSG_CUSTOM:return "[自定义消息]";case pn.MSG_GRP_TIP:return "[群提示消息]";case pn.MSG_GRP_SYS_NOTICE:return "[群系统通知]";case pn.MSG_FACE:return "[动画表情]";default:return ""}},i_=function(){function e(t){var n;kn(this,e),this.conversationID=t.conversationID||"",this.unreadCount=t.unreadCount||0,this.type=t.type||"",this.lastMessage=(n=t.lastMessage,ma(n)?{lastTime:0,lastSequence:0,fromAccount:0,messageForShow:"",payload:null,type:"",isRevoked:!1}:n instanceof Vh?{lastTime:n.time||0,lastSequence:n.sequence||0,fromAccount:n.from||"",messageForShow:o_(n.type,n.payload),payload:n.payload||null,type:n.type||null,isRevoked:!1}:On({},n,{isRevoked:!1,messageForShow:o_(n.type,n.payload)})),t.lastMsgTime&&(this.lastMessage.lastTime=t.lastMsgTime),this._isInfoCompleted=!1,this._initProfile(t);}return An(e,[{key:"_initProfile",value:function(e){var t=this;Object.keys(e).forEach((function(n){switch(n){case"userProfile":t.userProfile=e.userProfile;break;case"groupProfile":t.groupProfile=e.groupProfile;}})),ma(this.userProfile)&&this.type===pn.CONV_C2C?this.userProfile=new By({userID:e.conversationID.replace("C2C","")}):ma(this.groupProfile)&&this.type===pn.CONV_GROUP&&(this.groupProfile=new r_({groupID:e.conversationID.replace("GROUP","")}));}},{key:"updateUnreadCount",value:function(e,t){ma(e)||(this.subType===pn.GRP_CHATROOM||xa(this.subType)?this.unreadCount=0:t&&this.type===pn.CONV_GROUP?this.unreadCount=e:this.unreadCount=this.unreadCount+e);}},{key:"reduceUnreadCount",value:function(){this.unreadCount>=1&&(this.unreadCount-=1);}},{key:"isLastMessageRevoked",value:function(e){var t=e.sequence,n=e.time;return this.type===pn.CONV_C2C&&t===this.lastMessage.lastSequence&&n===this.lastMessage.lastTime||this.type===pn.CONV_GROUP&&t===this.lastMessage.lastSequence}},{key:"setLastMessageRevoked",value:function(e){this.lastMessage.isRevoked=e;}},{key:"toAccount",get:function(){return this.conversationID.replace("C2C","").replace("GROUP","")}},{key:"subType",get:function(){return this.groupProfile?this.groupProfile.type:""}}]),e}(),s_=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e)).pagingStatus=Gu.NOT_START,r.pagingTimeStamp=0,r.conversationMap=new Map,r.tempGroupList=[],r._initListeners(),r}return An(n,[{key:"hasLocalConversationMap",value:function(){return this.conversationMap.size>0}},{key:"createLocalConversation",value:function(e){return this.conversationMap.has(e)?this.conversationMap.get(e):new i_({conversationID:e,type:e.slice(0,3)===pn.CONV_C2C?pn.CONV_C2C:pn.CONV_GROUP})}},{key:"hasLocalConversation",value:function(e){return this.conversationMap.has(e)}},{key:"getConversationList",value:function(){var e=this;ca.log("ConversationController.getConversationList."),this.pagingStatus===Gu.REJECTED&&(ca.log("ConversationController.getConversationList. continue to sync conversationList"),this._syncConversationList());var t=new Mg;return t.setMethod(qg).setStart(),this.request({name:"conversation",action:"query"}).then((function(n){var r=n.data.conversations,o=void 0===r?[]:r,i=e._getConversationOptions(o);return e._updateLocalConversationList(i,!0),e._setStorageConversationList(),t.setCode(0).setText(o.length).setNetworkType(e.getNetworkType()).setEnd(),ca.log("ConversationController.getConversationList ok."),lg({conversationList:e.getLocalConversationList()})})).catch((function(n){return e.probeNetwork().then((function(e){var r=Bn(e,2),o=r[0],i=r[1];t.setError(n,o,i).setEnd();})),ca.error("ConversationController.getConversationList error:",n),pg(n)}))}},{key:"_syncConversationList",value:function(){var e=this,t=new Mg;return t.setMethod(Hg).setStart(),this.pagingStatus===Gu.NOT_START&&this.conversationMap.clear(),this._autoPagingSyncConversationList().then((function(n){return e.pagingStatus=Gu.RESOLVED,e._setStorageConversationList(),t.setCode(0).setText("".concat(e.conversationMap.size)).setNetworkType(e.getNetworkType()).setEnd(),n})).catch((function(n){return e.pagingStatus=Gu.REJECTED,t.setText(e.pagingTimeStamp),e.probeNetwork().then((function(e){var r=Bn(e,2),o=r[0],i=r[1];t.setError(n,o,i).setEnd();})),pg(n)}))}},{key:"_autoPagingSyncConversationList",value:function(){var e=this;return this.pagingStatus=Gu.PENDING,this.request({name:"conversation",action:"pagingQuery",param:{fromAccount:this.tim.context.identifier,timeStamp:this.pagingTimeStamp,orderType:1}}).then((function(t){var n=t.data,r=n.completeFlag,o=n.conversations,i=void 0===o?[]:o,s=n.timeStamp;if(ca.log("ConversationController._autoPagingSyncConversationList completeFlag=".concat(r," nums=").concat(i.length)),i.length>0){var a=e._getConversationOptions(i);e._updateLocalConversationList(a,!0);}return e._isReady?e._emitConversationUpdate():e.triggerReady(),e.pagingTimeStamp=s,1!==r?e._autoPagingSyncConversationList():lg()}))}},{key:"getConversationProfile",value:function(e){var t=this,n=this.conversationMap.has(e)?this.conversationMap.get(e):this.createLocalConversation(e);if(n._isInfoCompleted||n.type===pn.CONV_SYSTEM)return lg({conversation:n});var r=new Mg;return r.setMethod(Fg).setStart(),ca.log("ConversationController.getConversationProfile. conversationID:",e),this._updateUserOrGroupProfileCompletely(n).then((function(n){return r.setCode(0).setNetworkType(t.getNetworkType()).setText("conversationID=".concat(e," unreadCount=").concat(n.data.conversation.unreadCount)).setEnd(),ca.log("ConversationController.getConversationProfile ok. conversationID:",e),n})).catch((function(n){return t.probeNetwork().then((function(t){var o=Bn(t,2),i=o[0],s=o[1];r.setError(n,i,s).setText("conversationID=".concat(e)).setEnd();})),ca.error("ConversationController.getConversationProfile error:",n),pg(n)}))}},{key:"deleteConversation",value:function(e){var t=this,n={};if(!this.conversationMap.has(e)){var r=new Ip({code:zp,message:ih});return pg(r)}switch(this.conversationMap.get(e).type){case pn.CONV_C2C:n.type=1,n.toAccount=e.slice(3);break;case pn.CONV_GROUP:n.type=2,n.toGroupID=e.slice(5);break;case pn.CONV_SYSTEM:return this.tim.groupController.deleteGroupSystemNotice({messageList:this.tim.messageController.getLocalMessageList(e)}),this.deleteLocalConversation(e),lg({conversationID:e});default:var o=new Ip({code:Xp,message:ah});return pg(o)}var i=new Mg;return i.setMethod(jg).setText("conversationID=".concat(e)).setStart(),ca.log("ConversationController.deleteConversation. conversationID:",e),this.tim.setMessageRead({conversationID:e}).then((function(){return t.request({name:"conversation",action:"delete",param:n})})).then((function(){return i.setCode(0).setNetworkType(t.getNetworkType()).setEnd(),ca.log("ConversationController.deleteConversation ok. conversationID:",e),t.deleteLocalConversation(e),lg({conversationID:e})})).catch((function(e){return t.probeNetwork().then((function(t){var n=Bn(t,2),r=n[0],o=n[1];i.setError(e,r,o).setEnd();})),ca.error("ConversationController.deleteConversation error:",e),pg(e)}))}},{key:"getLocalConversationList",value:function(){return Hn(this.conversationMap.values())}},{key:"getLocalConversation",value:function(e){return this.conversationMap.get(e)}},{key:"_initLocalConversationList",value:function(){var e=new Mg;e.setMethod(Bg).setStart(),ca.time(_g),ca.log("ConversationController._initLocalConversationList init");var t=this._getStorageConversationList();if(t){for(var n=t.length,r=0;r<n;r++)this.conversationMap.set(t[r].conversationID,new i_(t[r]));this._emitConversationUpdate(!0,!1),e.setCode(0).setNetworkType(this.getNetworkType()).setText(n).setEnd();}else e.setCode(0).setNetworkType(this.getNetworkType()).setText(0).setEnd();this._syncConversationList();}},{key:"_getStorageConversationList",value:function(){return this.tim.storage.getItem("conversationMap")}},{key:"_setStorageConversationList",value:function(){var e=this.getLocalConversationList().slice(0,20).map((function(e){return {conversationID:e.conversationID,type:e.type,subType:e.subType,lastMessage:e.lastMessage,groupProfile:e.groupProfile,userProfile:e.userProfile}}));this.tim.storage.setItem("conversationMap",e);}},{key:"_initListeners",value:function(){var e=this;this.tim.innerEmitter.once(rd,this._initLocalConversationList,this),this.tim.innerEmitter.on(ad,this._onSendOrReceiveMessage,this),this.tim.innerEmitter.on(ud,this._handleSyncMessages,this),this.tim.innerEmitter.on(cd,this._handleSyncMessages,this),this.tim.innerEmitter.on(ld,this._onSendOrReceiveMessage,this),this.tim.innerEmitter.on(pd,this._onSendOrReceiveMessage,this),this.tim.innerEmitter.on(fd,this._onSendOrReceiveMessage,this),this.tim.innerEmitter.on(Od,this._onGroupListUpdated,this),this.tim.innerEmitter.on(jd,this._updateConversationUserProfile,this),this.tim.innerEmitter.on(hd,this._onMessageRevoked,this),this.ready((function(){e.tempGroupList.length>0&&(e._updateConversationGroupProfile(e.tempGroupList),e.tempGroupList.length=0);}));}},{key:"_onGroupListUpdated",value:function(e){this._updateConversationGroupProfile(e.data);}},{key:"_updateConversationGroupProfile",value:function(e){var t=this;ga(e)&&0===e.length||(this.hasLocalConversationMap()?(e.forEach((function(e){var n="GROUP".concat(e.groupID);if(t.conversationMap.has(n)){var r=t.conversationMap.get(n);r.groupProfile=e,r.lastMessage.lastSequence<e.nextMessageSeq&&(r.lastMessage.lastSequence=e.nextMessageSeq-1),r.subType||(r.subType=e.type);}})),this._emitConversationUpdate(!0,!1)):this.tempGroupList=e);}},{key:"_updateConversationUserProfile",value:function(e){var t=this;e.data.forEach((function(e){var n="C2C".concat(e.userID);t.conversationMap.has(n)&&(t.conversationMap.get(n).userProfile=e);})),this._emitConversationUpdate(!0,!1);}},{key:"_onMessageRevoked",value:function(e){var t=this,n=e.data;if(0!==n.length){var r=null,o=!1;n.forEach((function(e){(r=t.conversationMap.get(e.conversationID))&&r.isLastMessageRevoked(e)&&(o=!0,r.setLastMessageRevoked(!0));})),o&&this._emitConversationUpdate(!0,!1);}}},{key:"_handleSyncMessages",value:function(e){this._onSendOrReceiveMessage(e,!0);}},{key:"_onSendOrReceiveMessage",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=e.data.eventDataList;this._isReady?0!==r.length&&(this._updateLocalConversationList(r,!1,n),this._setStorageConversationList(),this._emitConversationUpdate()):this.ready((function(){t._onSendOrReceiveMessage(e,n);}));}},{key:"_updateLocalConversationList",value:function(e,t,n){var r;r=this._updateTempConversations(e,t,n),this.conversationMap=new Map(this._sortConversations([].concat(Hn(r.conversations),Hn(this.conversationMap)))),t||this._updateUserOrGroupProfile(r.newerConversations);}},{key:"_updateTempConversations",value:function(e,t,n){for(var r=[],o=[],i=0,s=e.length;i<s;i++){var a=new i_(e[i]),u=this.conversationMap.get(a.conversationID);if(this.conversationMap.has(a.conversationID)){var c=["unreadCount","allowType","adminForbidType","payload"];n&&c.push("lastMessage"),Ta(u,a,c,[null,void 0,"",0,NaN]),u.updateUnreadCount(a.unreadCount,t),n||(u.lastMessage.payload=e[i].lastMessage.payload),this.conversationMap.delete(u.conversationID),r.push([u.conversationID,u]);}else {if(a.type===pn.CONV_GROUP){var l=a.groupProfile.groupID,p=this.tim.groupController.getLocalGroupProfile(l);p&&(a.groupProfile=p,a.updateUnreadCount(0));}o.push(a),r.push([a.conversationID,a]);}}return {conversations:r,newerConversations:o}}},{key:"_sortConversations",value:function(e){return e.sort((function(e,t){return t[1].lastMessage.lastTime-e[1].lastMessage.lastTime}))}},{key:"_updateUserOrGroupProfile",value:function(e){var t=this;if(0!==e.length){var n=[],r=[];e.forEach((function(e){if(e.type===pn.CONV_C2C)n.push(e.toAccount);else if(e.type===pn.CONV_GROUP){var o=e.toAccount;t.tim.groupController.hasLocalGroup(o)?e.groupProfile=t.tim.groupController.getLocalGroupProfile(o):r.push(o);}})),n.length>0&&this.tim.getUserProfile({userIDList:n}).then((function(e){var n=e.data;ga(n)?n.forEach((function(e){t.conversationMap.get("C2C".concat(e.userID)).userProfile=e;})):t.conversationMap.get("C2C".concat(n.userID)).userProfile=n;})),r.length>0&&this.tim.groupController.getGroupProfileAdvance({groupIDList:r,responseFilter:{groupBaseInfoFilter:["Type","Name","FaceUrl"]}}).then((function(e){e.data.successGroupList.forEach((function(e){var n="GROUP".concat(e.groupID);if(t.conversationMap.has(n)){var r=t.conversationMap.get(n);Ta(r.groupProfile,e,[],[null,void 0,"",0,NaN]),!r.subType&&e.type&&(r.subType=e.type);}}));}));}}},{key:"_updateUserOrGroupProfileCompletely",value:function(e){var t=this;return e.type===pn.CONV_C2C?this.tim.getUserProfile({userIDList:[e.toAccount]}).then((function(n){var r=n.data;return 0===r.length?pg(new Ip({code:Wp,message:sh})):(e.userProfile=r[0],e._isInfoCompleted=!0,t._unshiftConversation(e),lg({conversation:e}))})):this.tim.getGroupProfile({groupID:e.toAccount}).then((function(n){return e.groupProfile=n.data.group,e._isInfoCompleted=!0,t._unshiftConversation(e),lg({conversation:e})}))}},{key:"_unshiftConversation",value:function(e){e instanceof i_&&!this.conversationMap.has(e.conversationID)&&(this.conversationMap=new Map([[e.conversationID,e]].concat(Hn(this.conversationMap))),this._setStorageConversationList(),this._emitConversationUpdate(!0,!1));}},{key:"deleteLocalConversation",value:function(e){return this.conversationMap.delete(e),this._setStorageConversationList(),this.emitInnerEvent(Fd,e),this._emitConversationUpdate(!0,!1),this.conversationMap.has(e)}},{key:"_getConversationOptions",value:function(e){var t=[],n=e.filter((function(e){var t=e.lastMsg;return da(t)})).map((function(e){if(1===e.type){var n={userID:e.userID,nick:e.c2CNick,avatar:e.c2CImage};return t.push(n),{conversationID:"C2C".concat(e.userID),type:"C2C",lastMessage:{lastTime:e.time,lastSequence:e.sequence,fromAccount:e.lastC2CMsgFromAccount,messageForShow:e.messageShow,type:e.lastMsg.elements[0]?e.lastMsg.elements[0].type:null,payload:e.lastMsg.elements[0]?e.lastMsg.elements[0].content:null},userProfile:new By(n)}}return {conversationID:"GROUP".concat(e.groupID),type:"GROUP",lastMessage:{lastTime:e.time,lastSequence:e.messageReadSeq+e.unreadCount,fromAccount:e.msgGroupFromAccount,messageForShow:e.messageShow,type:e.lastMsg.elements[0]?e.lastMsg.elements[0].type:null,payload:e.lastMsg.elements[0]?e.lastMsg.elements[0].content:null},groupProfile:new r_({groupID:e.groupID,name:e.groupNick,avatar:e.groupImage}),unreadCount:e.unreadCount}}));return t.length>0&&this.emitInnerEvent(qd,t),n}},{key:"_emitConversationUpdate",value:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=Hn(this.conversationMap.values());t&&this.emitInnerEvent(Ud,n),e&&this.emitOuterEvent(ln.CONVERSATION_LIST_UPDATED,n);}},{key:"_conversationMapTreeShaking",value:function(e){var t=this,n=new Map(Hn(this.conversationMap));e.forEach((function(e){return n.delete(e.conversationID)})),n.has(pn.CONV_SYSTEM)&&n.delete(pn.CONV_SYSTEM);var r=this.tim.groupController.getJoinedAVChatRoom();r&&n.delete("".concat(pn.CONV_GROUP).concat(r.groupID)),Hn(n.keys()).forEach((function(e){return t.conversationMap.delete(e)}));}},{key:"reset",value:function(){this.pagingStatus=Gu.NOT_START,this.pagingTimeStamp=0,this.conversationMap.clear(),this.resetReady(),this.tim.innerEmitter.once(rd,this._initLocalConversationList,this);}}]),n}(og),a_=1..toFixed,u_=Math.floor,c_=function(e,t,n){return 0===t?n:t%2==1?c_(e,t-1,n*e):c_(e*e,t/2,n)},l_=a_&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!o((function(){a_.call({});}));Ae({target:"Number",proto:!0,forced:l_},{toFixed:function(e){var t,n,r,o,i=function(e){if("number"!=typeof e&&"Number"!=p(e))throw TypeError("Incorrect invocation");return +e}(this),s=ie(e),a=[0,0,0,0,0,0],u="",c="0",l=function(e,t){for(var n=-1,r=t;++n<6;)r+=e*a[n],a[n]=r%1e7,r=u_(r/1e7);},f=function(e){for(var t=6,n=0;--t>=0;)n+=a[t],a[t]=u_(n/e),n=n%e*1e7;},h=function(){for(var e=6,t="";--e>=0;)if(""!==t||0===e||0!==a[e]){var n=String(a[e]);t=""===t?n:t+kr.call("0",7-n.length)+n;}return t};if(s<0||s>20)throw RangeError("Incorrect fraction digits");if(i!=i)return "NaN";if(i<=-1e21||i>=1e21)return String(i);if(i<0&&(u="-",i=-i),i>1e-21)if(n=(t=function(e){for(var t=0,n=e;n>=4096;)t+=12,n/=4096;for(;n>=2;)t+=1,n/=2;return t}(i*c_(2,69,1))-69)<0?i*c_(2,-t,1):i/c_(2,t,1),n*=4503599627370496,(t=52-t)>0){for(l(0,n),r=s;r>=7;)l(1e7,0),r-=7;for(l(c_(10,r,1),0),r=t-1;r>=23;)f(1<<23),r-=23;f(1<<r),l(1,1),f(2),c=h();}else l(0,n),l(1<<-t,0),c=h()+kr.call("0",s);return c=s>0?u+((o=c.length)<=s?"0."+kr.call("0",s-o)+c:c.slice(0,o-s)+"."+c.slice(o-s)):u+c}});var p_=[].push,f_=Math.min,h_=!o((function(){return !RegExp(4294967295,"y")}));ps("split",2,(function(e,t,n){var r;return r="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(e,n){var r=String(d(this)),o=void 0===n?4294967295:n>>>0;if(0===o)return [];if(void 0===e)return [r];if(!ns(e))return t.call(r,e,o);for(var i,s,a,u=[],c=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),l=0,p=new RegExp(e.source,c+"g");(i=Xi.call(p,r))&&!((s=p.lastIndex)>l&&(u.push(r.slice(l,i.index)),i.length>1&&i.index<r.length&&p_.apply(u,i.slice(1)),a=i[0].length,l=s,u.length>=o));)p.lastIndex===i.index&&p.lastIndex++;return l===r.length?!a&&p.test("")||u.push(""):u.push(r.slice(l)),u.length>o?u.slice(0,o):u}:"0".split(void 0,0).length?function(e,n){return void 0===e&&0===n?[]:t.call(this,e,n)}:t,[function(t,n){var o=d(this),i=null==t?void 0:t[e];return void 0!==i?i.call(t,o,n):r.call(String(o),t,n)},function(e,o){var i=n(r,e,this,o,r!==t);if(i.done)return i.value;var s=D(e),a=String(this),u=ko(s,RegExp),c=s.unicode,l=(s.ignoreCase?"i":"")+(s.multiline?"m":"")+(s.unicode?"u":"")+(h_?"y":"g"),p=new u(h_?s:"^(?:"+s.source+")",l),f=void 0===o?4294967295:o>>>0;if(0===f)return [];if(0===a.length)return null===ds(p,a)?[a]:[];for(var h=0,d=0,g=[];d<a.length;){p.lastIndex=h_?d:0;var m,v=ds(p,h_?a:a.slice(d));if(null===v||(m=f_(ae(p.lastIndex+(h_?0:d)),a.length))===h)d=hs(a,d,c);else {if(g.push(a.slice(h,d)),g.length===f)return g;for(var y=1;y<=v.length-1;y++)if(g.push(v[y]),g.length===f)return g;d=h=m;}}return g.push(a.slice(h)),g}]}),!h_);var d_=function(){function e(t){if(kn(this,e),void 0===t)throw new Ip({code:bp,message:jf});if(void 0===t.tim)throw new Ip({code:bp,message:"".concat(jf,".tim")});this.list=new Map,this.tim=t.tim,this._initializeOptions(t);}return An(e,[{key:"getLocalOldestMessageByConversationID",value:function(e){if(!e)return null;if(!this.list.has(e))return null;var t=this.list.get(e).values();return t?t.next().value:null}},{key:"_initializeOptions",value:function(e){this.options={};var t={memory:{maxDatasPerKey:100,maxBytesPerData:256,maxKeys:0},cache:{maxDatasPerKey:10,maxBytesPerData:256,maxKeys:0}};for(var n in t)if(Object.prototype.hasOwnProperty.call(t,n)){if(void 0===e[n]){this.options[n]=t[n];continue}var r=t[n];for(var o in r)if(Object.prototype.hasOwnProperty.call(r,o)){if(void 0===e[n][o]){this.options[n][o]=r[o];continue}this.options[n][o]=e[n][o];}}}},{key:"pushIn",value:function(e){var t=e.conversationID,n=e.ID,r=!0;return this.list.has(t)||this.list.set(t,new Map),this.list.has(t)&&this.list.get(t).has(n)?r=!1:this.list.get(t).set(n,e),r}},{key:"unshift",value:function(e){ga(e)?e.length>0&&this._unshiftMultipleMessages(e):this._unshiftSingleMessage(e);}},{key:"_unshiftSingleMessage",value:function(e){var t=e.conversationID,n=e.ID;if(!this.list.has(t))return this.list.set(t,new Map),void this.list.get(t).set(n,e);var r=Array.from(this.list.get(t));r.unshift([n,e]),this.list.set(t,new Map(r));}},{key:"_unshiftMultipleMessages",value:function(e){for(var t=e.length,n=[],r=e[0].conversationID,o=this.list.has(r)?Array.from(this.list.get(r)):[],i=0;i<t;i++)n.push([e[i].ID,e[i]]);this.list.set(r,new Map(n.concat(o)));}},{key:"remove",value:function(e){var t=e.conversationID,n=e.ID;this.list.has(t)&&this.list.get(t).delete(n);}},{key:"revoke",value:function(e,t,n){if(ca.debug("revoke message",e,t,n),this.list.has(e)){var r,o=$n(this.list.get(e));try{for(o.s();!(r=o.n()).done;){var i=Bn(r.value,2)[1];if(i.sequence===t&&!i.isRevoked&&(ma(n)||i.random===n))return i.isRevoked=!0,i}}catch(s){o.e(s);}finally{o.f();}}return null}},{key:"removeByConversationID",value:function(e){this.list.has(e)&&this.list.delete(e);}},{key:"hasLocalMessageList",value:function(e){return this.list.has(e)}},{key:"getLocalMessageList",value:function(e){return this.hasLocalMessageList(e)?Hn(this.list.get(e).values()):[]}},{key:"hasLocalMessage",value:function(e,t){return !!this.hasLocalMessageList(e)&&this.list.get(e).has(t)}},{key:"getLocalMessage",value:function(e,t){return this.hasLocalMessage(e,t)?this.list.get(e).get(t):null}},{key:"reset",value:function(){this.list.clear();}}]),e}(),g_=function(){function e(t){kn(this,e),this.tim=t;}return An(e,[{key:"setMessageRead",value:function(e){var t=e.conversationID,n=e.messageID,r=this.tim.conversationController.getLocalConversation(t);if(ca.log("ReadReportHandler.setMessageRead conversationID=".concat(t," unreadCount=").concat(r?r.unreadCount:0)),!r||0===r.unreadCount)return lg();var o=n?this.tim.messageController.getLocalMessage(t,n):null;switch(r.type){case pn.CONV_C2C:return this._setC2CMessageRead({conversationID:t,lastMessageTime:o?o.time:r.lastMessage.lastTime});case pn.CONV_GROUP:return this._setGroupMessageRead({conversationID:t,lastMessageSeq:o?o.sequence:r.lastMessage.lastSequence});case pn.CONV_SYSTEM:return r.unreadCount=0,lg();default:return lg()}}},{key:"_setC2CMessageRead",value:function(e){var t=this,n=e.conversationID,r=e.lastMessageTime;ca.log("ReadReportHandler._setC2CMessageRead conversationID=".concat(n," lastMessageTime=").concat(r)),pa(r)||ca.warn("ReadReportHandler._setC2CMessageRead 请勿修改 Conversation.lastMessage.lastTime，否则可能会导致已读上报结果不准确");var o=new Mg;return o.setMethod(Gg).setText("".concat(n,"-").concat(r)).setStart(),this.tim.messageController.request({name:"conversation",action:"setC2CMessageRead",param:{C2CMsgReaded:{cookie:"",C2CMsgReadedItem:[{toAccount:n.replace("C2C",""),lastMessageTime:r}]}}}).then((function(){return o.setCode(0).setNetworkType(t.tim.netMonitor.getNetworkType()).setEnd(),ca.log("ReadReportHandler._setC2CMessageRead ok."),t._updateIsReadAfterReadReport({conversationID:n,lastMessageTime:r}),t._updateUnreadCount(n),new ag})).catch((function(e){return t.tim.netMonitor.probe().then((function(t){var n=Bn(t,2),r=n[0],i=n[1];o.setError(e,r,i).setEnd();})),ca.log("ReadReportHandler._setC2CMessageRead failed. ".concat(Ea(e))),pg(e)}))}},{key:"_setGroupMessageRead",value:function(e){var t=this,n=e.conversationID,r=e.lastMessageSeq;ca.log("ReadReportHandler._setGroupMessageRead conversationID=".concat(n," lastMessageSeq=").concat(r)),pa(r)||ca.warn("ReadReportHandler._setGroupMessageRead 请勿修改 Conversation.lastMessage.lastSequence，否则可能会导致已读上报结果不准确");var o=new Mg;return o.setMethod(xg).setText("".concat(n,"-").concat(r)).setStart(),this.tim.messageController.request({name:"conversation",action:"setGroupMessageRead",param:{groupID:n.replace("GROUP",""),messageReadSeq:r}}).then((function(){return o.setCode(0).setNetworkType(t.tim.netMonitor.getNetworkType()).setEnd(),ca.log("ReadReportHandler._setGroupMessageRead ok."),t._updateIsReadAfterReadReport({conversationID:n,lastMessageSeq:r}),t._updateUnreadCount(n),new ag})).catch((function(e){return t.tim.netMonitor.probe().then((function(t){var n=Bn(t,2),r=n[0],i=n[1];o.setError(e,r,i).setEnd();})),ca.log("ReadReportHandler._setGroupMessageRead failed. ".concat(Ea(e))),pg(e)}))}},{key:"_updateUnreadCount",value:function(e){var t=this.tim,n=t.conversationController,r=t.messageController,o=n.getLocalConversation(e),i=r.getLocalMessageList(e);o&&(o.unreadCount=i.filter((function(e){return !e.isRead})).length,ca.log("ReadReportHandler._updateUnreadCount conversationID=".concat(o.conversationID," unreadCount=").concat(o.unreadCount)));}},{key:"_updateIsReadAfterReadReport",value:function(e){var t=e.conversationID,n=e.lastMessageSeq,r=e.lastMessageTime,o=this.tim.messageController.getLocalMessageList(t);if(0!==o.length)for(var i,s=o.length-1;s>=0;s--)if(i=o[s],!(r&&i.time>r||n&&i.sequence>n)){if("in"===i.flow&&i.isRead)break;i.setIsRead(!0);}}},{key:"updateIsRead",value:function(e){var t=this.tim,n=t.conversationController,r=t.messageController,o=n.getLocalConversation(e),i=r.getLocalMessageList(e);if(o&&0!==i.length&&!Ua(o.type)){for(var s=[],a=0;a<i.length;a++)"in"!==i[a].flow?"out"!==i[a].flow||i[a].isRead||i[a].setIsRead(!0):s.push(i[a]);var u=0;if(o.type===pn.CONV_C2C){var c=s.slice(-o.unreadCount).filter((function(e){return e.isRevoked})).length;u=s.length-o.unreadCount-c;}else u=s.length-o.unreadCount;for(var l=0;l<u&&!s[l].isRead;l++)s[l].setIsRead(!0);}}}]),e}(),m_=Ve.findIndex,v_=!0,y_=We("findIndex");"findIndex"in[]&&Array(1).findIndex((function(){v_=!1;})),Ae({target:"Array",proto:!0,forced:v_||!y_},{findIndex:function(e){return m_(this,e,arguments.length>1?arguments[1]:void 0)}}),ir("findIndex");var __=function(){function e(t){var n=t.tim,r=t.messageController;kn(this,e),this.tim=n,this.messageController=r,this.completedMap=new Map,this._initListener();}return An(e,[{key:"getMessageList",value:function(e){var t=this,n=e.conversationID,r=e.nextReqMessageID,o=e.count;if(this.tim.groupController.checkJoinedAVChatRoomByID(n.replace("GROUP","")))return ca.log("GetMessageHandler.getMessageList not available in avchatroom. conversationID=".concat(n)),lg({messageList:[],nextReqMessageID:"",isCompleted:!0});(ma(o)||o>15)&&(o=15);var i=this._computeLeftCount({conversationID:n,nextReqMessageID:r});return ca.log("GetMessageHandler.getMessageList. conversationID=".concat(n," leftCount=").concat(i," count=").concat(o," nextReqMessageID=").concat(r)),this._needGetHistory({conversationID:n,leftCount:i,count:o})?this.messageController.getHistoryMessages({conversationID:n,count:20}).then((function(){return i=t._computeLeftCount({conversationID:n,nextReqMessageID:r}),new ag(t._computeResult({conversationID:n,nextReqMessageID:r,count:o,leftCount:i}))})):(ca.log("GetMessageHandler.getMessageList. get messagelist from memory"),lg(this._computeResult({conversationID:n,nextReqMessageID:r,count:o,leftCount:i})))}},{key:"setCompleted",value:function(e){ca.log("GetMessageHandler.setCompleted. conversationID=".concat(e)),this.completedMap.set(e,!0);}},{key:"deleteCompletedItem",value:function(e){ca.log("GetMessageHandler.deleteCompletedItem. conversationID=".concat(e)),this.completedMap.delete(e);}},{key:"_initListener",value:function(){var e=this;this.tim.innerEmitter.on(Vd,(function(){e.setCompleted(pn.CONV_SYSTEM);})),this.tim.innerEmitter.on(Bd,(function(t){var n=t.data;e.setCompleted("".concat(pn.CONV_GROUP).concat(n));}));}},{key:"_getMessageListSize",value:function(e){return this.messageController.getLocalMessageList(e).length}},{key:"_needGetHistory",value:function(e){var t=e.conversationID,n=e.leftCount,r=e.count,o=this.tim.conversationController.getLocalConversation(t),i=!!o&&o.type===pn.CONV_SYSTEM,s=!!o&&o.subType===pn.GRP_AVCHATROOM;return !i&&!s&&(n<r&&!this.completedMap.has(t))}},{key:"_computeResult",value:function(e){var t=e.conversationID,n=e.nextReqMessageID,r=e.count,o=e.leftCount,i=this._computeMessageList({conversationID:t,nextReqMessageID:n,count:r}),s=this._computeIsCompleted({conversationID:t,leftCount:o,count:r}),a=this._computeNextReqMessageID({messageList:i,isCompleted:s,conversationID:t});return ca.log("GetMessageHandler._computeResult. conversationID=".concat(t," leftCount=").concat(o," count=").concat(r," nextReqMessageID=").concat(a," nums=").concat(i.length," isCompleted=").concat(s)),{messageList:i,nextReqMessageID:a,isCompleted:s}}},{key:"_computeNextReqMessageID",value:function(e){var t=e.messageList,n=e.isCompleted,r=e.conversationID;if(!n)return 0===t.length?"":t[0].ID;var o=this.messageController.getLocalMessageList(r);return 0===o.length?"":o[0].ID}},{key:"_computeMessageList",value:function(e){var t=e.conversationID,n=e.nextReqMessageID,r=e.count,o=this.messageController.getLocalMessageList(t),i=this._computeIndexEnd({nextReqMessageID:n,messageList:o}),s=this._computeIndexStart({indexEnd:i,count:r});return o.slice(s,i)}},{key:"_computeIndexEnd",value:function(e){var t=e.messageList,n=void 0===t?[]:t,r=e.nextReqMessageID;return r?n.findIndex((function(e){return e.ID===r})):n.length}},{key:"_computeIndexStart",value:function(e){var t=e.indexEnd,n=e.count;return t>n?t-n:0}},{key:"_computeLeftCount",value:function(e){var t=e.conversationID,n=e.nextReqMessageID;return n?this.messageController.getLocalMessageList(t).findIndex((function(e){return e.ID===n})):this._getMessageListSize(t)}},{key:"_computeIsCompleted",value:function(e){var t=e.conversationID;return !!(e.leftCount<=e.count&&this.completedMap.has(t))}},{key:"reset",value:function(){ca.log("GetMessageHandler.reset"),this.completedMap.clear();}}]),e}(),C_=function e(t){kn(this,e),this.value=t,this.next=null;},I_=function(){function e(t){kn(this,e),this.MAX_LENGTH=t,this.pTail=null,this.pNodeToDel=null,this.map=new Map,ca.log("SinglyLinkedList init MAX_LENGTH=".concat(this.MAX_LENGTH));}return An(e,[{key:"pushIn",value:function(e){var t=new C_(e);if(this.map.size<this.MAX_LENGTH)null===this.pTail?(this.pTail=t,this.pNodeToDel=t):(this.pTail.next=t,this.pTail=t),this.map.set(e,1);else {var n=this.pNodeToDel;this.pNodeToDel=this.pNodeToDel.next,this.map.delete(n.value),n.next=null,n=null,this.pTail.next=t,this.pTail=t,this.map.set(e,1);}}},{key:"has",value:function(e){return this.map.has(e)}},{key:"tail",value:function(){return this.pTail}},{key:"size",value:function(){return this.map.size}},{key:"data",value:function(){return Array.from(this.map.keys())}},{key:"reset",value:function(){for(var e;null!==this.pNodeToDel;)e=this.pNodeToDel,this.pNodeToDel=this.pNodeToDel.next,e.next=null,e=null;this.pTail=null,this.map.clear();}}]),e}(),M_=function(){function e(t){kn(this,e),this.tim=t;}return An(e,[{key:"upload",value:function(e){switch(e.type){case pn.MSG_IMAGE:return this._uploadImage(e);case pn.MSG_FILE:return this._uploadFile(e);case pn.MSG_AUDIO:return this._uploadAudio(e);case pn.MSG_VIDEO:return this._uploadVideo(e);default:return Promise.resolve()}}},{key:"_uploadImage",value:function(e){var t=this.tim,n=t.uploadController,r=t.messageController,o=e.getElements()[0],i=r.getMessageOptionByID(e.messageID);return n.uploadImage({file:i.payload.file,to:i.to,onProgress:function(e){if(o.updatePercent(e),ya(i.onProgress))try{i.onProgress(e);}catch(t){return pg(new Ip({code:Np,message:"".concat(Kf)}))}}}).then((function(e){var t,n=e.location,r=e.fileType,i=e.fileSize,s=Na(n);return o.updateImageFormat(r),o.updateImageInfoArray({size:i,url:s}),t=o._imageMemoryURL,Rs?new Promise((function(e,n){wx.getImageInfo({src:t,success:function(t){e({width:t.width,height:t.height});},fail:function(){e({width:0,height:0});}});})):qs&&9===Fs?Promise.resolve({width:0,height:0}):new Promise((function(e,n){var r=new Image;r.onload=function(){e({width:this.width,height:this.height}),r=null;},r.onerror=function(){e({width:0,height:0}),r=null;},r.src=t;}))})).then((function(t){var n=t.width,r=t.height;return o.updateImageInfoArray({width:n,height:r}),e}))}},{key:"_uploadFile",value:function(e){var t=this.tim,n=t.uploadController,r=t.messageController,o=e.getElements()[0],i=r.getMessageOptionByID(e.messageID);return n.uploadFile({file:i.payload.file,to:i.to,onProgress:function(e){if(o.updatePercent(e),ya(i.onProgress))try{i.onProgress(e);}catch(t){return pg(new Ip({code:Np,message:"".concat(Kf)}))}}}).then((function(t){var n=t.location,r=Na(n);return o.updateFileUrl(r),e}))}},{key:"_uploadAudio",value:function(e){var t=this.tim,n=t.uploadController,r=t.messageController,o=e.getElements()[0],i=r.getMessageOptionByID(e.messageID);return n.uploadAudio({file:i.payload.file,to:i.to,onProgress:function(e){if(o.updatePercent(e),ya(i.onProgress))try{i.onProgress(e);}catch(t){return pg(new Ip({code:Np,message:"".concat(Kf)}))}}}).then((function(t){var n=t.location,r=Na(n);return o.updateAudioUrl(r),e}))}},{key:"_uploadVideo",value:function(e){var t=this.tim,n=t.uploadController,r=t.messageController,o=e.getElements()[0],i=r.getMessageOptionByID(e.messageID);return n.uploadVideo({file:i.payload.file,to:i.to,onProgress:function(e){if(o.updatePercent(e),ya(i.onProgress))try{i.onProgress(e);}catch(t){return pg(new Ip({code:Np,message:"".concat(Kf)}))}}}).then((function(t){var n=Na(t.location);return o.updateVideoUrl(n),e}))}}]),e}(),S_=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e))._initializeMembers(),r._initializeListener(),r._initialzeHandlers(),r.messageOptionMap=new Map,r}return An(n,[{key:"_initializeMembers",value:function(){this.messagesList=new d_({tim:this.tim}),this.currentMessageKey={},this.singlyLinkedList=new I_(100);}},{key:"_initialzeHandlers",value:function(){this.readReportHandler=new g_(this.tim,this),this.getMessageHandler=new __({messageController:this,tim:this.tim}),this.uploadFileHandler=new M_(this.tim);}},{key:"reset",value:function(){this.messagesList.reset(),this.currentMessageKey={},this.getMessageHandler.reset(),this.singlyLinkedList.reset(),this.messageOptionMap.clear();}},{key:"_initializeListener",value:function(){var e=this.tim.innerEmitter;e.on(Id,this._onReceiveC2CMessage,this),e.on(id,this._onSyncMessagesProcessing,this),e.on(sd,this._onSyncMessagesFinished,this),e.on(Md,this._onReceiveGroupMessage,this),e.on(Sd,this._onReceiveGroupTips,this),e.on(Td,this._onReceiveSystemNotice,this),e.on(wd,this._onReceiveGroupMessageRevokedNotice,this),e.on(Ad,this._onReceiveC2CMessageRevokedNotice,this),e.on(Fd,this._clearConversationMessages,this);}},{key:"sendMessageInstance",value:function(e,t){var n,r=this,o=this.tim.sumStatController,i=null;switch(e.conversationType){case pn.CONV_C2C:i=this._handleOnSendC2CMessageSuccess.bind(this);break;case pn.CONV_GROUP:i=this._handleOnSendGroupMessageSuccess.bind(this);break;default:return pg(new Ip({code:Op,message:Hf}))}return this.singlyLinkedList.pushIn(e.random),this.uploadFileHandler.upload(e).then((function(){var i=null;return e.isSendable()?(o.addTotalCount(mg),n=Date.now(),e.conversationType===pn.CONV_C2C?i=r._createC2CMessagePack(e,t):e.conversationType===pn.CONV_GROUP&&(i=r._createGroupMessagePack(e,t)),r.request(i)):pg({code:Yp,message:oh})})).then((function(t){return o.addSuccessCount(mg),o.addCost(mg,Math.abs(Date.now()-n)),e.conversationType===pn.CONV_GROUP&&(e.sequence=t.data.sequence,e.time=t.data.time,e.generateMessageID(r.tim.context.identifier)),r.messagesList.pushIn(e),i(e,t.data),r.messageOptionMap.delete(e.messageID),r.emitInnerEvent(ad,{eventDataList:[{conversationID:e.conversationID,unreadCount:0,type:e.conversationType,subType:e.conversationSubType,lastMessage:e}]}),new ag({message:e})})).catch((function(t){e.status=Pu.FAIL;var n=new Mg;return n.setMethod(Og).setMessageType(e.type).setText("".concat(r._generateTjgID(e),"-").concat(e.type,"-").concat(e.from,"-").concat(e.to)).setStart(),r.probeNetwork().then((function(e){var r=Bn(e,2),o=r[0],i=r[1];n.setError(t,o,i).setEnd();})),ca.error("MessageController.sendMessageInstance error:",t),pg(new Ip({code:t&&t.code?t.code:Ap,message:t&&t.message?t.message:Ff,data:{message:e}}))}))}},{key:"resendMessage",value:function(e){return e.isResend=!0,e.status=Pu.UNSEND,this.sendMessageInstance(e)}},{key:"_isFileLikeMessage",value:function(e){return [pn.MSG_IMAGE,pn.MSG_FILE,pn.MSG_AUDIO,pn.MSG_VIDEO].indexOf(e.type)>=0}},{key:"_resendBinaryTypeMessage",value:function(){}},{key:"_canIUseOnlineOnlyFlag",value:function(e){var t=this.tim.groupController.getJoinedAVChatRoom();return !t||t.groupID!==e.to||e.conversationType!==pn.CONV_GROUP}},{key:"_createC2CMessagePack",value:function(e,t){var n=0,r=null;return t&&(t.offlinePushInfo&&(r=t.offlinePushInfo),!0===t.onlineUserOnly&&(n=1,r?r.disablePush=!0:r={disablePush:!0})),{name:"c2cMessage",action:"create",tjgID:this._generateTjgID(e),param:{toAccount:e.to,msgBody:e.getElements(),msgSeq:e.sequence,msgRandom:e.random,msgLifeTime:this._canIUseOnlineOnlyFlag(e)&&n?0:void 0,offlinePushInfo:r?{pushFlag:!0===r.disablePush?1:0,title:r.title||"",desc:r.description||"",ext:r.extension||"",apnsInfo:{badgeMode:!0===r.ignoreIOSBadge?1:0},androidInfo:{OPPOChannelID:r.androidOPPOChannelID||""}}:void 0}}}},{key:"_handleOnSendC2CMessageSuccess",value:function(e,t){e.status=Pu.SUCCESS,e.time=t.time;}},{key:"_createGroupMessagePack",value:function(e,t){var n=0,r=null;return t&&(!0===t.onlineUserOnly&&(n=1),t.offlinePushInfo&&(r=t.offlinePushInfo)),{name:"groupMessage",action:"create",tjgID:this._generateTjgID(e),param:{groupID:e.to,msgBody:e.getElements(),random:e.random,priority:e.priority,clientSequence:e.clientSequence,onlineOnlyFlag:this._canIUseOnlineOnlyFlag(e)?n:0,offlinePushInfo:r?{pushFlag:!0===r.disablePush?1:0,title:r.title||"",desc:r.description||"",ext:r.extension||"",apnsInfo:{badgeMode:!0===r.ignoreIOSBadge?1:0},androidInfo:{OPPOChannelID:r.androidOPPOChannelID||""}}:void 0}}}},{key:"_handleOnSendGroupMessageSuccess",value:function(e,t){e.sequence=t.sequence,e.time=t.time,e.status=Pu.SUCCESS;}},{key:"_onReceiveC2CMessage",value:function(e){ca.debug("MessageController._onReceiveC2CMessage nums=".concat(e.data.length));var t=Date.now(),n=this._newC2CMessageStoredAndSummary({notifiesList:e.data,type:pn.CONV_C2C,C2CRemainingUnreadList:e.C2CRemainingUnreadList}),r=n.eventDataList,o=n.result;if(r.length>0&&this.emitInnerEvent(ld,{eventDataList:r,result:o}),o.length>0){var i=this.tim.sumStatController;i.addTotalCount(vg),i.addSuccessCount(vg),i.addCost(vg,Date.now()-t),this.emitOuterEvent(ln.MESSAGE_RECEIVED,o);}}},{key:"_onReceiveGroupMessage",value:function(e){ca.debug("MessageController._onReceiveGroupMessage nums=".concat(e.data.length));var t=Date.now(),n=this.newGroupMessageStoredAndSummary(e.data),r=n.eventDataList,o=n.result;if(r.length>0&&this.emitInnerEvent(pd,{eventDataList:r,result:o,isGroupTip:!1}),o.length>0){var i=this.tim.sumStatController;i.addTotalCount(vg),i.addSuccessCount(vg),i.addCost(vg,Date.now()-t),this.emitOuterEvent(ln.MESSAGE_RECEIVED,o);}}},{key:"_onReceiveGroupTips",value:function(e){var t=Date.now(),n=e.data;ca.debug("MessageController._onReceiveGroupTips nums=".concat(n.length));var r=this.newGroupTipsStoredAndSummary(n),o=r.eventDataList,i=r.result;if(o.length>0&&this.emitInnerEvent(pd,{eventDataList:o,result:i,isGroupTip:!0}),i.length>0){var s=this.tim.sumStatController;s.addTotalCount(vg),s.addSuccessCount(vg),s.addCost(vg,Date.now()-t),this.emitOuterEvent(ln.MESSAGE_RECEIVED,i);}}},{key:"_onReceiveSystemNotice",value:function(e){var t=Date.now(),n=e.data,r=n.groupSystemNotices,o=n.type;ca.debug("MessageController._onReceiveSystemNotice nums=".concat(r.length));var i=this.newSystemNoticeStoredAndSummary({notifiesList:r,type:o}),s=i.eventDataList,a=i.result;if(s.length>0&&this.emitInnerEvent(fd,{eventDataList:s,result:a,type:o}),a.length>0&&"poll"===o){var u=this.tim.sumStatController;u.addTotalCount(vg),u.addSuccessCount(vg),u.addCost(vg,Date.now()-t),this.emitOuterEvent(ln.MESSAGE_RECEIVED,a);}}},{key:"_onReceiveGroupMessageRevokedNotice",value:function(e){var t=this;ca.debug("MessageController._onReceiveGroupMessageRevokedNotice nums=".concat(e.data.length));var n=[],r=null;e.data.forEach((function(e){e.elements.revokedInfos.forEach((function(e){(r=t.messagesList.revoke("GROUP".concat(e.groupID),e.sequence))&&n.push(r);}));})),0!==n.length&&(this.emitInnerEvent(hd,n),this.emitOuterEvent(ln.MESSAGE_REVOKED,n));}},{key:"_onReceiveC2CMessageRevokedNotice",value:function(e){var t=this;ca.debug("MessageController._onReceiveC2CMessageRevokedNotice nums=".concat(e.data.length));var n=[],r=null;e.data.forEach((function(e){e.c2cMessageRevokedNotify.revokedInfos.forEach((function(e){var o=t.tim.context.identifier===e.from?"C2C".concat(e.to):"C2C".concat(e.from);(r=t.messagesList.revoke(o,e.sequence,e.random))&&n.push(r);}));})),0!==n.length&&(this.emitInnerEvent(hd,n),this.emitOuterEvent(ln.MESSAGE_REVOKED,n));}},{key:"_clearConversationMessages",value:function(e){var t=e.data;this.messagesList.removeByConversationID(t),this.getMessageHandler.deleteCompletedItem(t);}},{key:"_pushIntoNoticeResult",value:function(e,t){return !(!this.messagesList.pushIn(t)||this.singlyLinkedList.has(t.random))&&(e.push(t),!0)}},{key:"_newC2CMessageStoredAndSummary",value:function(e){for(var t=e.notifiesList,n=e.type,r=e.C2CRemainingUnreadList,o=e.isFromSync,i=null,s=[],a=[],u={},c=this.tim.bigDataHallwayController,l=0,p=t.length;l<p;l++){var f=t[l];if(f.currentUser=this.tim.context.identifier,f.conversationType=n,f.isSystemMessage=!!f.isSystemMessage,i=new Vh(f),f.elements=c.parseElements(f.elements,f.from),i.setElement(f.elements),!o)if(!this._pushIntoNoticeResult(a,i))continue;void 0===u[i.conversationID]?u[i.conversationID]=s.push({conversationID:i.conversationID,unreadCount:"out"===i.flow?0:1,type:i.conversationType,subType:i.conversationSubType,lastMessage:i})-1:(s[u[i.conversationID]].type=i.conversationType,s[u[i.conversationID]].subType=i.conversationSubType,s[u[i.conversationID]].lastMessage=i,"in"===i.flow&&s[u[i.conversationID]].unreadCount++);}if(ga(r))for(var h=function(e,t){var n=s.find((function(t){return t.conversationID==="C2C".concat(r[e].from)}));n?n.unreadCount+=r[e].count:s.push({conversationID:"C2C".concat(r[e].from),unreadCount:r[e].count,type:pn.CONV_C2C,lastMsgTime:r[e].lastMsgTime});},d=0,g=r.length;d<g;d++)h(d);return {eventDataList:s,result:a}}},{key:"newGroupMessageStoredAndSummary",value:function(e){var t=null,n=[],r={},o=[],i=pn.CONV_GROUP,s=this.tim.bigDataHallwayController,a=e.length;a>1&&e.sort((function(e,t){return e.sequence-t.sequence}));for(var u=0;u<a;u++){var c=e[u];if(c.currentUser=this.tim.context.identifier,c.conversationType=i,c.isSystemMessage=!!c.isSystemMessage,t=new Vh(c),c.elements=s.parseElements(c.elements,c.from),t.setElement(c.elements),!this._isMessageFromAVChatroom(t))this._pushIntoNoticeResult(o,t)&&(void 0===r[t.conversationID]?r[t.conversationID]=n.push({conversationID:t.conversationID,unreadCount:"out"===t.flow?0:1,type:t.conversationType,subType:t.conversationSubType,lastMessage:t})-1:(n[r[t.conversationID]].type=t.conversationType,n[r[t.conversationID]].subType=t.conversationSubType,n[r[t.conversationID]].lastMessage=t,"in"===t.flow&&n[r[t.conversationID]].unreadCount++));}return {eventDataList:n,result:o}}},{key:"_isMessageFromAVChatroom",value:function(e){var t=e.conversationID.slice(5);return this.tim.groupController.checkJoinedAVChatRoomByID(t)}},{key:"newGroupTipsStoredAndSummary",value:function(e){for(var t=null,n=[],r=[],o={},i=0,s=e.length;i<s;i++){var a=e[i];if(a.currentUser=this.tim.context.identifier,a.conversationType=pn.CONV_GROUP,(t=new Vh(a)).setElement({type:pn.MSG_GRP_TIP,content:On({},a.elements,{groupProfile:a.groupProfile})}),t.isSystemMessage=!1,!this._isMessageFromAVChatroom(t))this._pushIntoNoticeResult(r,t)&&(void 0===o[t.conversationID]?o[t.conversationID]=n.push({conversationID:t.conversationID,unreadCount:"out"===t.flow?0:1,type:t.conversationType,subType:t.conversationSubType,lastMessage:t})-1:(n[o[t.conversationID]].type=t.conversationType,n[o[t.conversationID]].subType=t.conversationSubType,n[o[t.conversationID]].lastMessage=t,"in"===t.flow&&n[o[t.conversationID]].unreadCount++));}return {eventDataList:n,result:r}}},{key:"newSystemNoticeStoredAndSummary",value:function(e){var t=e.notifiesList,n=e.type,r=null,o=t.length,i=0,s=[],a={conversationID:pn.CONV_SYSTEM,unreadCount:0,type:pn.CONV_SYSTEM,subType:null,lastMessage:null};for(i=0;i<o;i++){var u=t[i];if(u.elements.operationType!==Ql)u.currentUser=this.tim.context.identifier,u.conversationType=pn.CONV_SYSTEM,u.conversationID=pn.CONV_SYSTEM,(r=new Vh(u)).setElement({type:pn.MSG_GRP_SYS_NOTICE,content:On({},u.elements,{groupProfile:u.groupProfile})}),r.isSystemMessage=!0,(1===r.sequence&&1===r.random||2===r.sequence&&2===r.random)&&(r.sequence=wa(),r.random=wa(),r.generateMessageID(u.currentUser),ca.log("MessageController.newSystemNoticeStoredAndSummary sequence and random maybe duplicated, regenerate. ID=".concat(r.ID))),this._pushIntoNoticeResult(s,r)&&("poll"===n?a.unreadCount++:"sync"===n&&r.setIsRead(!0),a.subType=r.conversationSubType);}return a.lastMessage=s[s.length-1],{eventDataList:s.length>0?[a]:[],result:s}}},{key:"_onSyncMessagesProcessing",value:function(e){var t=this._newC2CMessageStoredAndSummary({notifiesList:e.data,type:pn.CONV_C2C,isFromSync:!0,C2CRemainingUnreadList:e.C2CRemainingUnreadList}),n=t.eventDataList,r=t.result;this.emitInnerEvent(ud,{eventDataList:n,result:r});}},{key:"_onSyncMessagesFinished",value:function(e){this.triggerReady();var t=this._newC2CMessageStoredAndSummary({notifiesList:e.data.messageList,type:pn.CONV_C2C,isFromSync:!0,C2CRemainingUnreadList:e.data.C2CRemainingUnreadList}),n=t.eventDataList,r=t.result;this.emitInnerEvent(cd,{eventDataList:n,result:r});}},{key:"getHistoryMessages",value:function(e){if(e.conversationID===pn.CONV_SYSTEM)return lg();!e.count&&(e.count=15),e.count>20&&(e.count=20);var t=this.messagesList.getLocalOldestMessageByConversationID(e.conversationID);t||((t={}).time=0,t.sequence=0,0===e.conversationID.indexOf(pn.CONV_C2C)?(t.to=e.conversationID.replace(pn.CONV_C2C,""),t.conversationType=pn.CONV_C2C):0===e.conversationID.indexOf(pn.CONV_GROUP)&&(t.to=e.conversationID.replace(pn.CONV_GROUP,""),t.conversationType=pn.CONV_GROUP));var n="";switch(t.conversationType){case pn.CONV_C2C:return n=e.conversationID.replace(pn.CONV_C2C,""),this.getC2CRoamMessages({conversationID:e.conversationID,peerAccount:n,count:e.count,lastMessageTime:void 0===this.currentMessageKey[e.conversationID]?0:t.time});case pn.CONV_GROUP:return this.getGroupRoamMessages({conversationID:e.conversationID,groupID:t.to,count:e.count,sequence:t.sequence-1});default:return lg()}}},{key:"getC2CRoamMessages",value:function(e){var t=this,n=void 0!==this.currentMessageKey[e.conversationID]?this.currentMessageKey[e.conversationID]:"";ca.log("MessageController.getC2CRoamMessages toAccount=".concat(e.peerAccount," count=").concat(e.count||15," lastMessageTime=").concat(e.lastMessageTime||0," messageKey=").concat(n));var r=new Mg;return r.setMethod(Lg).setStart(),this.request({name:"c2cMessage",action:"query",param:{peerAccount:e.peerAccount,count:e.count||15,lastMessageTime:e.lastMessageTime||0,messageKey:n}}).then((function(o){var i=o.data,s=i.complete,a=i.messageList;ma(a)?ca.log("MessageController.getC2CRoamMessages ok. complete=".concat(s," but messageList is undefined!")):ca.log("MessageController.getC2CRoamMessages ok. complete=".concat(s," nums=").concat(a.length)),r.setCode(0).setNetworkType(t.getNetworkType()).setText("".concat(e.peerAccount,"-").concat(e.count||15,"-").concat(e.lastMessageTime||0,"-").concat(n,"-").concat(s,"-").concat(a?a.length:"undefined")).setEnd(),1===s&&t.getMessageHandler.setCompleted(e.conversationID);var u=t._roamMessageStore(a,pn.CONV_C2C,e.conversationID);return t.readReportHandler.updateIsRead(e.conversationID),t.currentMessageKey[e.conversationID]=o.data.messageKey,u})).catch((function(o){return t.probeNetwork().then((function(t){var i=Bn(t,2),s=i[0],a=i[1];r.setError(o,s,a).setText("".concat(e.peerAccount,"-").concat(e.count||15,"-").concat(e.lastMessageTime||0,"-").concat(n)).setEnd();})),ca.warn("MessageController.getC2CRoamMessages failed. ".concat(o)),pg(o)}))}},{key:"_computeLastSequence",value:function(e){return e.sequence>=0?Promise.resolve(e.sequence):this.tim.groupController.getGroupLastSequence(e.groupID)}},{key:"getGroupRoamMessages",value:function(e){var t=this,n=new Mg,r=0;return this._computeLastSequence(e).then((function(o){return r=o,ca.log("MessageController.getGroupRoamMessages groupID=".concat(e.groupID," lastSequence=").concat(r)),n.setMethod(Ng).setStart(),t.request({name:"groupMessage",action:"query",param:{groupID:e.groupID,count:21,sequence:r}})})).then((function(o){var i=o.data,s=i.messageList,a=i.complete;ma(s)?ca.log("MessageController.getGroupRoamMessages ok. complete=".concat(a," but messageList is undefined!")):ca.log("MessageController.getGroupRoamMessages ok. complete=".concat(a," nums=").concat(s.length)),n.setCode(0).setNetworkType(t.getNetworkType()).setText("".concat(e.groupID,"-").concat(r,"-").concat(a,"-").concat(s?s.length:"undefined")).setEnd();var u="GROUP".concat(e.groupID);if(2===a||ja(s))return t.getMessageHandler.setCompleted(u),[];var c=t._roamMessageStore(s,pn.CONV_GROUP,u);return t.readReportHandler.updateIsRead(u),c})).catch((function(o){return t.probeNetwork().then((function(t){var i=Bn(t,2),s=i[0],a=i[1];n.setError(o,s,a).setText("".concat(e.groupID,"-").concat(r)).setEnd();})),ca.warn("MessageController.getGroupRoamMessages failed. ".concat(o)),pg(o)}))}},{key:"_roamMessageStore",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0,r=null,o=[],i=0,s=e.length,a=null,u=t===pn.CONV_GROUP,c=this.tim.bigDataHallwayController,l=function(){i=u?e.length-1:0,s=u?0:e.length;},p=function(){u?--i:++i;},f=function(){return u?i>=s:i<s};for(l();f();p())if(u&&1===e[i].sequence&&this.getMessageHandler.setCompleted(n),1!==e[i].isPlaceMessage)if((r=new Vh(e[i])).to=e[i].to,r.isSystemMessage=!!e[i].isSystemMessage,r.conversationType=t,e[i].event===Bl.JSON.TYPE.GROUP.TIP?a={type:pn.MSG_GRP_TIP,content:On({},e[i].elements,{groupProfile:e[i].groupProfile})}:(e[i].elements=c.parseElements(e[i].elements,e[i].from),a=e[i].elements),ja(a)){var h=new Mg;h.setMethod(Ug).setText("from:".concat(r.from," to:").concat(r.to," sequence:").concat(r.sequence," event:").concat(e[i].event)).setStart(),h.setCode(0).setNetworkType(this.getNetworkType()).setEnd();}else r.setElement(a),r.reInitialize(this.tim.context.identifier),o.push(r);return this.messagesList.unshift(o),l=p=f=null,o}},{key:"getLocalMessageList",value:function(e){return this.messagesList.getLocalMessageList(e)}},{key:"getLocalMessage",value:function(e,t){return this.messagesList.getLocalMessage(e,t)}},{key:"hasLocalMessage",value:function(e,t){return this.messagesList.hasLocalMessage(e,t)}},{key:"deleteLocalMessage",value:function(e){e instanceof Vh&&this.messagesList.remove(e);}},{key:"revokeMessage",value:function(e){var t,n=this;e.conversationType===pn.CONV_C2C?t={name:"c2cMessageWillBeRevoked",action:"create",param:{msgInfo:{fromAccount:e.from,toAccount:e.to,msgSeq:e.sequence,msgRandom:e.random,msgTimeStamp:e.time}}}:e.conversationType===pn.CONV_GROUP&&(t={name:"groupMessageWillBeRevoked",action:"create",param:{to:e.to,msgSeqList:[{msgSeq:e.sequence}]}});var r=new Mg;return r.setMethod(Pg).setMessageType(e.type).setText("".concat(this._generateTjgID(e),"-").concat(e.type,"-").concat(e.from,"-").concat(e.to)).setStart(),this.request(t).then((function(t){var o=t.data.recallRetList;if(!ja(o)&&0!==o[0].retCode){var i=new Ip({code:o[0].retCode,message:Cp[o[0].retCode]||$f,data:{message:e}});return r.setCode(i.code).setMessage(i.message).setEnd(),pg(i)}return ca.info("MessageController.revokeMessage ok. ID=".concat(e.ID)),e.isRevoked=!0,r.setCode(0).setEnd(),n.emitInnerEvent(hd,[e]),new ag({message:e})})).catch((function(t){n.probeNetwork().then((function(e){var n=Bn(e,2),o=n[0],i=n[1];r.setError(t,o,i).setEnd();}));var o=new Ip({code:t&&t.code?t.code:Pp,message:t&&t.message?t.message:$f,data:{message:e}});return ca.warn("MessageController.revokeMessage failed. ID=".concat(e.ID," code=").concat(o.code," message=").concat(o.message)),pg(o)}))}},{key:"setMessageRead",value:function(e){var t=this;return new Promise((function(n,r){t.ready((function(){t.readReportHandler.setMessageRead(e).then(n).catch(r);}));}))}},{key:"getMessageList",value:function(e){return this.getMessageHandler.getMessageList(e)}},{key:"createTextMessage",value:function(e){e.currentUser=this.tim.context.identifier;var t=new Vh(e),n="string"==typeof e.payload?e.payload:e.payload.text,r=new xu({text:n});return t.setElement(r),t}},{key:"createCustomMessage",value:function(e){e.currentUser=this.tim.context.identifier;var t=new Vh(e),n=new Fh({data:e.payload.data,description:e.payload.description,extension:e.payload.extension});return t.setElement(n),t}},{key:"createImageMessage",value:function(e){e.currentUser=this.tim.context.identifier;var t=new Vh(e);if(Rs){var n=e.payload.file;if(la(n))return void ca.warn("微信小程序环境下调用 createImageMessage 接口时，payload.file 不支持传入 File 对象");var r=n.tempFilePaths[0],o={url:r,name:r.slice(r.lastIndexOf("/")+1),size:n.tempFiles[0].size,type:r.slice(r.lastIndexOf(".")+1).toLowerCase()};e.payload.file=o;}else if(bs&&la(e.payload.file)){var i=e.payload.file;e.payload.file={files:[i]};}var s=new ap({imageFormat:"UNKNOWN",uuid:this._generateUUID(),file:e.payload.file});return t.setElement(s),this.messageOptionMap.set(t.messageID,e),t}},{key:"createFileMessage",value:function(e){if(!Rs){if(bs&&la(e.payload.file)){var t=e.payload.file;e.payload.file={files:[t]};}e.currentUser=this.tim.context.identifier;var n=new Vh(e),r=new qh({uuid:this._generateUUID(),file:e.payload.file});return n.setElement(r),this.messageOptionMap.set(n.messageID,e),n}ca.warn("微信小程序目前不支持选择文件， createFileMessage 接口不可用！");}},{key:"createAudioMessage",value:function(e){if(Rs){var t=e.payload.file;if(Rs){var n={url:t.tempFilePath,name:t.tempFilePath.slice(t.tempFilePath.lastIndexOf("/")+1),size:t.fileSize,second:parseInt(t.duration)/1e3,type:t.tempFilePath.slice(t.tempFilePath.lastIndexOf(".")+1).toLowerCase()};e.payload.file=n;}e.currentUser=this.tim.context.identifier;var r=new Vh(e),o=new cp({second:Math.floor(t.duration/1e3),size:t.fileSize,url:t.tempFilePath,uuid:this._generateUUID()});return r.setElement(o),this.messageOptionMap.set(r.messageID,e),r}ca.warn("createAudioMessage 目前只支持微信小程序发语音消息");}},{key:"createVideoMessage",value:function(e){e.currentUser=this.tim.context.identifier,e.payload.file.thumbUrl="https://webim-1252463788.cos.ap-shanghai.myqcloud.com/assets/images/transparent.png",e.payload.file.thumbSize=1668;var t={};if(Rs){if(la(e.payload.file))return void ca.warn("微信小程序环境下调用 createVideoMessage 接口时，payload.file 不支持传入 File 对象");var n=e.payload.file;t.url=n.tempFilePath,t.name=n.tempFilePath.slice(n.tempFilePath.lastIndexOf("/")+1),t.size=n.size,t.second=n.duration,t.type=n.tempFilePath.slice(n.tempFilePath.lastIndexOf(".")+1).toLowerCase();}else if(bs){if(la(e.payload.file)){var r=e.payload.file;e.payload.file.files=[r];}var o=e.payload.file;t.url=window.URL.createObjectURL(o.files[0]),t.name=o.files[0].name,t.size=o.files[0].size,t.second=o.files[0].duration||0,t.type=o.files[0].type.split("/")[1];}e.payload.file.videoFile=t;var i=new Vh(e),s=new jh({videoFormat:t.type,videoSecond:Number(t.second.toFixed(0)),videoSize:t.size,remoteVideoUrl:"",videoUrl:t.url,videoUUID:this._generateUUID(),thumbUUID:this._generateUUID(),thumbWidth:e.payload.file.width||200,thumbHeight:e.payload.file.height||200,thumbUrl:e.payload.file.thumbUrl,thumbSize:e.payload.file.thumbSize,thumbFormat:e.payload.file.thumbUrl.slice(e.payload.file.thumbUrl.lastIndexOf(".")+1).toLowerCase()});return i.setElement(s),this.messageOptionMap.set(i.messageID,e),i}},{key:"createFaceMessage",value:function(e){e.currentUser=this.tim.context.identifier;var t=new Vh(e),n=new up(e.payload);return t.setElement(n),t}},{key:"_generateUUID",value:function(){var e=this.tim.context;return "".concat(e.SDKAppID,"-").concat(e.identifier,"-").concat(function(){for(var e="",t=32;t>0;--t)e+=Aa[Math.floor(Math.random()*ba)];return e}())}},{key:"_generateTjgID",value:function(e){return this.tim.context.tinyID+"-"+e.random}},{key:"getMessageOptionByID",value:function(e){return this.messageOptionMap.get(e)}},{key:"isMessageSentByCurrentInstance",value:function(e){return !(!this.messagesList.hasLocalMessage(e.conversationID,e.ID)&&!this.singlyLinkedList.has(e.random))}}]),n}(og),T_=function(){function e(t){kn(this,e),this.userID="",this.avatar="",this.nick="",this.role="",this.joinTime="",this.lastSendMsgTime="",this.nameCard="",this.muteUntil=0,this.memberCustomField=[],this._initMember(t);}return An(e,[{key:"_initMember",value:function(e){this.updateMember(e);}},{key:"updateMember",value:function(e){var t=[null,void 0,"",0,NaN];e.memberCustomField&&Pa(this.memberCustomField,e.memberCustomField),Ta(this,e,["memberCustomField"],t);}},{key:"updateRole",value:function(e){["Owner","Admin","Member"].indexOf(e)<0||(this.role=e);}},{key:"updateMuteUntil",value:function(e){ma(e)||(this.muteUntil=Math.floor((Date.now()+1e3*e)/1e3));}},{key:"updateNameCard",value:function(e){ma(e)||(this.nameCard=e);}},{key:"updateMemberCustomField",value:function(e){e&&Pa(this.memberCustomField,e);}}]),e}(),E_=function(){function e(t){kn(this,e),this.tim=t.tim,this.groupController=t.groupController,this._initListeners();}return An(e,[{key:"_initListeners",value:function(){this.tim.innerEmitter.on(pd,this._onReceivedGroupTips,this);}},{key:"_onReceivedGroupTips",value:function(e){var t=this,n=e.data,r=n.result;n.isGroupTip&&r.forEach((function(e){switch(e.payload.operationType){case 1:t._onNewMemberComeIn(e);break;case 2:t._onMemberQuit(e);break;case 3:t._onMemberKickedOut(e);break;case 4:t._onMemberSetAdmin(e);break;case 5:t._onMemberCancelledAdmin(e);break;case 6:t._onGroupProfileModified(e);break;case 7:t._onMemberInfoModified(e);break;default:ca.warn("GroupTipsHandler._onReceivedGroupTips Unhandled groupTips. operationType=",e.payload.operationType);}}));}},{key:"_onNewMemberComeIn",value:function(e){var t=e.payload,n=t.memberNum,r=t.groupProfile.groupID,o=this.groupController.getLocalGroupProfile(r);o&&pa(n)&&(o.memberNum=n);}},{key:"_onMemberQuit",value:function(e){var t=e.payload,n=t.memberNum,r=t.groupProfile.groupID,o=this.groupController.getLocalGroupProfile(r);o&&pa(n)&&(o.memberNum=n),this.groupController.deleteLocalGroupMembers(r,e.payload.userIDList);}},{key:"_onMemberKickedOut",value:function(e){var t=e.payload,n=t.memberNum,r=t.groupProfile.groupID,o=this.groupController.getLocalGroupProfile(r);o&&pa(n)&&(o.memberNum=n),this.groupController.deleteLocalGroupMembers(r,e.payload.userIDList);}},{key:"_onMemberSetAdmin",value:function(e){var t=this,n=e.payload.groupProfile.groupID;e.payload.userIDList.forEach((function(e){var r=t.groupController.getLocalGroupMemberInfo(n,e);r&&r.updateRole(pn.GRP_MBR_ROLE_ADMIN);}));}},{key:"_onMemberCancelledAdmin",value:function(e){var t=this,n=e.payload.groupProfile.groupID;e.payload.userIDList.forEach((function(e){var r=t.groupController.getLocalGroupMemberInfo(n,e);r&&r.updateRole(pn.GRP_MBR_ROLE_MEMBER);}));}},{key:"_onGroupProfileModified",value:function(e){var t=this,n=e.payload.newGroupProfile,r=e.payload.groupProfile.groupID,o=this.groupController.getLocalGroupProfile(r);Object.keys(n).forEach((function(e){switch(e){case"ownerID":t._ownerChaged(o,n);break;default:o[e]=n[e];}})),this.groupController.emitGroupListUpdate(!0,!0);}},{key:"_ownerChaged",value:function(e,t){var n=e.groupID,r=this.groupController.getLocalGroupProfile(n),o=this.tim.context.identifier;if(o===t.ownerID){r.updateGroup({selfInfo:{role:pn.GRP_MBR_ROLE_OWNER}});var i=this.groupController.getLocalGroupMemberInfo(n,o),s=this.groupController.getLocalGroupProfile(n).ownerID,a=this.groupController.getLocalGroupMemberInfo(n,s);i&&i.updateRole(pn.GRP_MBR_ROLE_OWNER),a&&a.updateRole(pn.GRP_MBR_ROLE_MEMBER);}}},{key:"_onMemberInfoModified",value:function(e){var t=this,n=e.payload.groupProfile.groupID;e.payload.memberList.forEach((function(e){var r=t.groupController.getLocalGroupMemberInfo(n,e.userID);r&&e.muteTime&&r.updateMuteUntil(e.muteTime);}));}}]),e}(),D_=function(){function e(t){kn(this,e),this.groupController=t.groupController,this.tim=t.tim,this.pendencyMap=new Map,this._initLiceners();}return An(e,[{key:"_initLiceners",value:function(){this.tim.innerEmitter.on(fd,this._onReceivedGroupSystemNotice,this),this.tim.innerEmitter.on(sd,this._clearGroupSystemNotice,this);}},{key:"_clearGroupSystemNotice",value:function(){var e=this;this.getPendencyList().then((function(t){t.forEach((function(t){e.pendencyMap.set("".concat(t.from,"_").concat(t.groupID,"_").concat(t.to),t);}));var n=e.tim.messageController.getLocalMessageList(pn.CONV_SYSTEM),r=[];n.forEach((function(t){var n=t.payload,o=n.operatorID,i=n.operationType,s=n.groupProfile;if(i===Hl){var a="".concat(o,"_").concat(s.groupID,"_").concat(s.to),u=e.pendencyMap.get(a);u&&pa(u.handled)&&0!==u.handled&&r.push(t);}})),e.groupController.deleteGroupSystemNotice({messageList:r});}));}},{key:"getPendencyList",value:function(e){var t=this;return this.groupController.request({name:"group",action:"getGroupPendency",param:{startTime:e&&e.startTime?e.startTime:0,limit:e&&e.limit?e.limit:10,handleAccount:this.tim.context.identifier}}).then((function(e){var n=e.data,r=n.pendencyList;return 0!==n.nextStartTime?t.getPendencyList({startTime:n.nextStartTime}).then((function(e){return [].concat(Hn(r),Hn(e))})):r}))}},{key:"_onReceivedGroupSystemNotice",value:function(e){var t=this,n=e.data,r=n.result;"sync"!==n.type&&r.forEach((function(e){switch(e.payload.operationType){case 1:t._onApplyGroupRequest(e);break;case 2:t._onApplyGroupRequestAgreed(e);break;case 3:t._onApplyGroupRequestRefused(e);break;case 4:t._onMemberKicked(e);break;case 5:t._onGroupDismissed(e);break;case 6:break;case 7:t._onInviteGroup(e);break;case 8:t._onQuitGroup(e);break;case 9:t._onSetManager(e);break;case 10:t._onDeleteManager(e);break;case 11:case 12:case 15:break;case 255:t.groupController.emitOuterEvent(ln.GROUP_SYSTEM_NOTICE_RECEIVED,{message:e,type:Zl});}}));}},{key:"_onApplyGroupRequest",value:function(e){this.groupController.emitOuterEvent(ln.GROUP_SYSTEM_NOTICE_RECEIVED,{message:e,type:Hl});}},{key:"_onApplyGroupRequestAgreed",value:function(e){var t=this,n=e.payload.groupProfile.groupID;this.groupController.hasLocalGroup(n)||this.groupController.getGroupProfile({groupID:n}).then((function(e){var n=e.data.group;n&&(t.groupController.updateGroupMap([n]),t.groupController.emitGroupListUpdate());})),this.groupController.emitOuterEvent(ln.GROUP_SYSTEM_NOTICE_RECEIVED,{message:e,type:Vl});}},{key:"_onApplyGroupRequestRefused",value:function(e){this.groupController.emitOuterEvent(ln.GROUP_SYSTEM_NOTICE_RECEIVED,{message:e,type:Kl});}},{key:"_onMemberKicked",value:function(e){var t=e.payload.groupProfile.groupID;this.groupController.hasLocalGroup(t)&&this.groupController.deleteLocalGroupAndConversation(t),this.groupController.emitOuterEvent(ln.GROUP_SYSTEM_NOTICE_RECEIVED,{message:e,type:$l});}},{key:"_onGroupDismissed",value:function(e){var t=e.payload.groupProfile.groupID,n=this.groupController.hasLocalGroup(t),r=this.groupController.AVChatRoomHandler;n&&this.groupController.deleteLocalGroupAndConversation(t),r.checkJoinedAVChatRoomByID(t)&&r.reset(),this.groupController.emitOuterEvent(ln.GROUP_SYSTEM_NOTICE_RECEIVED,{message:e,type:Yl});}},{key:"_onInviteGroup",value:function(e){var t=this,n=e.payload.groupProfile.groupID;this.groupController.hasLocalGroup(n)||this.groupController.getGroupProfile({groupID:n}).then((function(e){var n=e.data.group;n&&(t.groupController.updateGroupMap([n]),t.groupController.emitGroupListUpdate());})),this.groupController.emitOuterEvent(ln.GROUP_SYSTEM_NOTICE_RECEIVED,{message:e,type:zl});}},{key:"_onQuitGroup",value:function(e){var t=e.payload.groupProfile.groupID;this.groupController.hasLocalGroup(t)&&this.groupController.deleteLocalGroupAndConversation(t),this.groupController.emitOuterEvent(ln.GROUP_SYSTEM_NOTICE_RECEIVED,{message:e,type:Wl});}},{key:"_onSetManager",value:function(e){var t=e.payload.groupProfile,n=t.to,r=t.groupID,o=this.groupController.getLocalGroupMemberInfo(r,n);o&&o.updateRole(pn.GRP_MBR_ROLE_ADMIN),this.groupController.emitOuterEvent(ln.GROUP_SYSTEM_NOTICE_RECEIVED,{message:e,type:Xl});}},{key:"_onDeleteManager",value:function(e){var t=e.payload.groupProfile,n=t.to,r=t.groupID,o=this.groupController.getLocalGroupMemberInfo(r,n);o&&o.updateRole(pn.GRP_MBR_ROLE_MEMBER),this.groupController.emitOuterEvent(ln.GROUP_SYSTEM_NOTICE_RECEIVED,{message:e,type:Jl});}},{key:"reset",value:function(){this.pendencyMap.clear();}}]),e}(),k_={3:!0,4:!0,5:!0,6:!0},w_=function(){function e(t){var n=t.tim,r=t.groupController;kn(this,e),this.tim=n,this.groupController=r,this.AVChatRoomLoop=null,this.key="",this.startSeq=0,this.group={},this.sequencesLinkedList=new I_(100),this.receivedMessageCount=0;}return An(e,[{key:"hasJoinedAVChatRoom",value:function(){return !(!this.group||ma(this.group.groupID))}},{key:"checkJoinedAVChatRoomByID",value:function(e){return !(!this.group&&ma(this.group.groupID))&&e===this.group.groupID}},{key:"getJoinedAVChatRoom",value:function(){return this.hasJoinedAVChatRoom()?this.group:null}},{key:"_updateProperties",value:function(e){var t=this;Object.keys(e).forEach((function(n){t[n]=e[n];}));}},{key:"start",value:function(){var e={key:this.key,startSeq:this.startSeq};if(null===this.AVChatRoomLoop){var t=this.groupController.createTransportCapsule({name:"AVChatRoom",action:"startLongPoll",param:e});this.AVChatRoomLoop=this.tim.connectionController.createRunLoop({pack:t,before:this._updateRequestData.bind(this),success:this._handleSuccess.bind(this),fail:this._handleFailure.bind(this),isAVChatRoomLoop:!0}),this.AVChatRoomLoop.start(),ca.log("AVChatRoomHandler.start message channel started");}else this.AVChatRoomLoop.isRunning()||this.AVChatRoomLoop.start();}},{key:"stop",value:function(){null!==this.AVChatRoomLoop&&this.AVChatRoomLoop.isRunning()&&(this.AVChatRoomLoop.abort(),this.AVChatRoomLoop.stop(),ca.log("AVChatRoomHandler.stop message channel stopped"));}},{key:"startRunLoop",value:function(e){var t=this;return this._precheck().then((function(){var n=e.longPollingKey,r=e.group;return t._updateProperties({key:n,startSeq:0,group:r||{}}),t.groupController.updateGroupMap([r]),t.groupController.emitGroupListUpdate(!0,!1),t.start(),t.groupController.isLoggedIn()?lg({status:Ou.SUCCESS,group:r}):lg({status:Ou.SUCCESS})}))}},{key:"joinWithoutAuth",value:function(e){var t=this;return this.groupController.request({name:"group",action:"applyJoinAVChatRoom",param:e}).then((function(n){var r=n.data.longPollingKey;if(ma(r))return pg(new Ip({code:of,message:gh}));ca.log("AVChatRoomHandler.joinWithoutAuth ok. groupID:",e.groupID),t.groupController.emitInnerEvent(Hd),t.groupController.emitInnerEvent(Bd,e.groupID);var o=new r_({groupID:e.groupID});return t.startRunLoop({group:o,longPollingKey:r}),new ag({status:Ou.SUCCESS})})).catch((function(t){return ca.error("AVChatRoomHandler.joinWithoutAuth error:".concat(t.message,". groupID:").concat(e.groupID)),pg(t)}))}},{key:"_precheck",value:function(){if(!this.hasJoinedAVChatRoom())return Promise.resolve();if(this.groupController.isLoggedIn()){if(!(this.group.selfInfo.role===pn.GRP_MBR_ROLE_OWNER||this.group.ownerID===this.tim.loginInfo.identifier))return this.groupController.quitGroup(this.group.groupID);this.groupController.deleteLocalGroupAndConversation(this.group.groupID);}else this.groupController.deleteLocalGroupAndConversation(this.group.groupID);return this.reset(),Promise.resolve()}},{key:"_updateRequestData",value:function(e){e.StartSeq=this.startSeq,e.Key=this.key,this.tim.sumStatController.addTotalCount(gg);}},{key:"_handleSuccess",value:function(e){this.tim.sumStatController.addSuccessCount(gg),this.tim.sumStatController.addCost(gg,e.data.timecost),this.startSeq=e.data.nextSeq,this.key=e.data.key,Array.isArray(e.data.rspMsgList)&&e.data.rspMsgList.forEach((function(e){e.to=e.groupID;})),e.data.rspMsgList&&e.data.rspMsgList.length>0&&this._dispatchNotice(e.data.rspMsgList),this.groupController.emitInnerEvent(Rd);}},{key:"_handleFailure",value:function(e){if(e.error)if("ECONNABORTED"===e.error.code||e.error.code===_f)if(e.error.config){var t=e.error.config.url,n=e.error.config.data;ca.log("AVChatRoomHandler._handleFailure request timed out. url=".concat(t," data=").concat(n));}else ca.log("AVChatRoomHandler._handleFailure request timed out");else ca.log("AVChatRoomHandler._handleFailure request failed due to network error");this.groupController.emitInnerEvent(bd);}},{key:"_dispatchNotice",value:function(e){if(ga(e)&&0!==e.length){var t=Date.now(),n=null,r=[],o=[],i=e.length;i>1&&e.sort((function(e,t){return e.sequence-t.sequence}));for(var s=0;s<i;s++)if(k_[e[s].event]){this.receivedMessageCount+=1;var a=(n=this.packMessage(e[s],e[s].event)).conversationID;if(this.receivedMessageCount%40==0&&this.tim.messageLossController.detectMessageLoss(a,this.sequencesLinkedList.data()),null!==this.sequencesLinkedList.tail()){var u=this.sequencesLinkedList.tail().value,c=n.sequence-u;c>1&&c<=20?this.tim.messageLossController.onMessageMaybeLost(a,u+1,c-1):c<-1&&c>=-20&&this.tim.messageLossController.onMessageMaybeLost(a,n.sequence+1,Math.abs(c)-1);}this.sequencesLinkedList.pushIn(n.sequence),this._isMessageSentByCurrentInstance(n)||(n.conversationType===pn.CONV_SYSTEM&&o.push(n),r.push(n));}else ca.warn("AVChatRoomHandler._dispatchMessage 未处理的 event 类型：",e[s].event);if(o.length>0&&this.groupController.emitInnerEvent(fd,{result:o,eventDataList:[],type:"poll"}),0!==r.length){var l=this.packConversationOption(r);l.length>0&&this.groupController.emitInnerEvent(pd,{eventDataList:l,type:"poll"}),ca.debug("AVChatRoomHandler._dispatchNotice nums=".concat(r.length));var p=this.tim.sumStatController;p.addTotalCount(yg),p.addSuccessCount(yg),p.addCost(yg,Date.now()-t),this.groupController.emitOuterEvent(ln.MESSAGE_RECEIVED,r);}}}},{key:"_isMessageSentByCurrentInstance",value:function(e){return !!this.tim.messageController.isMessageSentByCurrentInstance(e)}},{key:"packMessage",value:function(e,t){e.currentUser=this.tim.context.identifier,e.conversationType=5===t?pn.CONV_SYSTEM:pn.CONV_GROUP,e.isSystemMessage=!!e.isSystemMessage;var n=new Vh(e),r=this.packElements(e,t);return n.setElement(r),n}},{key:"packElements",value:function(e,t){return 4===t||6===t?{type:pn.MSG_GRP_TIP,content:On({},e.elements,{groupProfile:e.groupProfile})}:5===t?{type:pn.MSG_GRP_SYS_NOTICE,content:On({},e.elements,{groupProfile:e.groupProfile})}:this.tim.bigDataHallwayController.parseElements(e.elements,e.from)}},{key:"packConversationOption",value:function(e){for(var t=new Map,n=0;n<e.length;n++){var r=e[n],o=r.conversationID;if(t.has(o)){var i=t.get(o);i.lastMessage=r,"in"===r.flow&&i.unreadCount++;}else t.set(o,{conversationID:r.conversationID,unreadCount:"out"===r.flow?0:1,type:r.conversationType,subType:r.conversationSubType,lastMessage:r});}return Hn(t.values())}},{key:"reset",value:function(){null!==this.AVChatRoomLoop&&(ca.log("AVChatRoomHandler.reset"),this.stop(),this.AVChatRoomLoop=null,this.key="",this.startSeq=0,this.group={},this.sequencesLinkedList.reset(),this.receivedMessageCount=0);}}]),e}(),A_=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e)).groupMap=new Map,r.groupMemberListMap=new Map,r.groupNoticeHandler=new D_({tim:e,groupController:qn(r)}),r.groupTipsHandler=new E_({tim:e,groupController:qn(r)}),r.AVChatRoomHandler=new w_({tim:e,groupController:qn(r)}),r._initListeners(),r}return An(n,[{key:"createGroup",value:function(e){var t=this;if(!["Public","Private","ChatRoom","AVChatRoom"].includes(e.type)){var n=new Ip({code:Jp,message:uh});return pg(n)}xa(e.type)&&!ma(e.memberList)&&e.memberList.length>0&&(ca.warn("GroupController.createGroup 创建AVChatRoom时不能添加群成员，自动忽略该字段"),e.memberList=void 0),Ga(e.type)||ma(e.joinOption)||(ca.warn("GroupController.createGroup 创建Private/ChatRoom/AVChatRoom群时不能设置字段：joinOption，自动忽略该字段"),e.joinOption=void 0);var r=new Mg;return r.setMethod(Vg).setStart(),ca.log("GroupController.createGroup."),this.request({name:"group",action:"create",param:e}).then((function(n){if(r.setCode(0).setNetworkType(t.getNetworkType()).setText("groupType=".concat(e.type," groupID=").concat(n.data.groupID)).setEnd(),ca.log("GroupController.createGroup ok. groupID:",n.data.groupID),e.type===pn.GRP_AVCHATROOM)return t.getGroupProfile({groupID:n.data.groupID});t.updateGroupMap([On({},e,{groupID:n.data.groupID})]);var o=t.tim.createCustomMessage({to:n.data.groupID,conversationType:pn.CONV_GROUP,payload:{data:"group_create",extension:"".concat(t.tim.context.identifier,"创建群组")}});return t.tim.sendMessage(o),t.emitGroupListUpdate(),t.getGroupProfile({groupID:n.data.groupID})})).then((function(e){var t=e.data.group;return t.selfInfo.messageRemindType=pn.MSG_REMIND_ACPT_AND_NOTE,t.selfInfo.role=pn.GRP_MBR_ROLE_OWNER,e})).catch((function(n){return r.setText("groupType=".concat(e.type)),t.probeNetwork().then((function(e){var t=Bn(e,2),o=t[0],i=t[1];r.setError(n,o,i).setEnd();})),ca.error("GroupController.createGroup error:",n),pg(n)}))}},{key:"joinGroup",value:function(e){if(this.hasLocalGroup(e.groupID)){var t={status:pn.JOIN_STATUS_ALREADY_IN_GROUP};return lg(t)}if(e.type===pn.GRP_PRIVATE){var n=new Ip({code:Qp,message:ch});return pg(n)}return ca.log("GroupController.joinGroup. groupID:",e.groupID),this.isLoggedIn()?this.applyJoinGroup(e):this.AVChatRoomHandler.joinWithoutAuth(e)}},{key:"quitGroup",value:function(e){var t=this;ca.log("GroupController.quitGroup. groupID:",e);var n=this.AVChatRoomHandler.checkJoinedAVChatRoomByID(e);if(n&&!this.isLoggedIn())return ca.log("GroupController.quitGroup anonymously ok. groupID:",e),this.deleteLocalGroupAndConversation(e),this.AVChatRoomHandler.reset(),lg({groupID:e});var r=new Mg;return r.setMethod($g).setStart(),this.request({name:"group",action:"quitGroup",param:{groupID:e}}).then((function(){return r.setCode(0).setNetworkType(t.getNetworkType()).setText("groupID=".concat(e)).setEnd(),ca.log("GroupController.quitGroup ok. groupID:",e),n&&t.AVChatRoomHandler.reset(),t.deleteLocalGroupAndConversation(e),new ag({groupID:e})})).catch((function(n){return r.setText("groupID=".concat(e)),t.probeNetwork().then((function(e){var t=Bn(e,2),o=t[0],i=t[1];r.setError(n,o,i).setEnd();})),ca.error("GroupController.quitGroup error.  error:".concat(n,". groupID:").concat(e)),pg(n)}))}},{key:"changeGroupOwner",value:function(e){var t=this;if(this.hasLocalGroup(e.groupID)&&this.getLocalGroupProfile(e.groupID).type===pn.GRP_AVCHATROOM)return pg(new Ip({code:Zp,message:lh}));if(e.newOwnerID===this.tim.loginInfo.identifier)return pg(new Ip({code:ef,message:ph}));var n=new Mg;return n.setMethod(zg).setStart(),ca.log("GroupController.changeGroupOwner. groupID:",e.groupID),this.request({name:"group",action:"changeGroupOwner",param:e}).then((function(){n.setCode(0).setNetworkType(t.getNetworkType()).setText("groupID=".concat(e.groupID)).setEnd(),ca.log("GroupController.changeGroupOwner ok. groupID:",e.groupID);var r=e.groupID,o=e.newOwnerID;t.groupMap.get(r).ownerID=o;var i=t.groupMemberListMap.get(r);if(i instanceof Map){var s=i.get(t.tim.loginInfo.identifier);ma(s)||(s.updateRole("Member"),t.groupMap.get(r).selfInfo.role="Member");var a=i.get(o);ma(a)||a.updateRole("Owner");}return t.emitGroupListUpdate(!0,!1),new ag({group:t.groupMap.get(r)})})).catch((function(r){return n.setText("groupID=".concat(e.groupID)),t.probeNetwork().then((function(e){var t=Bn(e,2),o=t[0],i=t[1];n.setError(r,o,i).setEnd();})),ca.error("GroupController.changeGroupOwner error:".concat(r,". groupID:").concat(e.groupID)),pg(r)}))}},{key:"dismissGroup",value:function(e){var t=this;if(this.hasLocalGroup(e)&&this.getLocalGroupProfile(e).type===pn.GRP_PRIVATE)return pg(new Ip({code:tf,message:fh}));var n=new Mg;return n.setMethod(Jg).setStart(),ca.log("GroupController.dismissGroup. groupID:".concat(e)),this.request({name:"group",action:"destroyGroup",param:{groupID:e}}).then((function(){return n.setCode(0).setNetworkType(t.getNetworkType()).setText("groupID=".concat(e)).setEnd(),ca.log("GroupController.dismissGroup ok. groupID:".concat(e)),t.deleteLocalGroupAndConversation(e),t.checkJoinedAVChatRoomByID(e)&&t.AVChatRoomHandler.reset(),new ag({groupID:e})})).catch((function(r){return n.setText("groupID=".concat(e)),t.probeNetwork().then((function(e){var t=Bn(e,2),o=t[0],i=t[1];n.setError(r,o,i).setEnd();})),ca.error("GroupController.dismissGroup error:".concat(r,". groupID:").concat(e)),pg(r)}))}},{key:"updateGroupProfile",value:function(e){var t=this;!this.hasLocalGroup(e.groupID)||Ga(this.getLocalGroupProfile(e.groupID).type)||ma(e.joinOption)||(ca.warn("GroupController.updateGroupProfile Private/ChatRoom/AVChatRoom群不能设置字段：joinOption，自动忽略该字段"),e.joinOption=void 0),ma(e.muteAllMembers)||(e.muteAllMembers?e.muteAllMembers="On":e.muteAllMembers="Off");var n=new Mg;return n.setMethod(Qg).setStart(),n.setText(JSON.stringify(e)),ca.log("GroupController.updateGroupProfile. groupID:",e.groupID),this.request({name:"group",action:"updateGroupProfile",param:e}).then((function(){(n.setCode(0).setNetworkType(t.getNetworkType()).setEnd(),ca.log("GroupController.updateGroupProfile ok. groupID:",e.groupID),t.hasLocalGroup(e.groupID))&&(t.groupMap.get(e.groupID).updateGroup(e),t._setStorageGroupList());return new ag({group:t.groupMap.get(e.groupID)})})).catch((function(r){return t.probeNetwork().then((function(e){var t=Bn(e,2),o=t[0],i=t[1];n.setError(r,o,i).setEnd();})),ca.log("GroupController.updateGroupProfile failed. error:".concat(Ea(r)," groupID:").concat(e.groupID)),pg(r)}))}},{key:"setGroupMemberRole",value:function(e){var t=this,n=e.groupID,r=e.userID,o=e.role,i=this.groupMap.get(n);if(i.selfInfo.role!==pn.GRP_MBR_ROLE_OWNER)return pg(new Ip({code:af,message:vh}));if([pn.GRP_PRIVATE,pn.GRP_AVCHATROOM].includes(i.type))return pg(new Ip({code:uf,message:yh}));if([pn.GRP_MBR_ROLE_ADMIN,pn.GRP_MBR_ROLE_MEMBER].indexOf(o)<0)return pg(new Ip({code:cf,message:_h}));if(r===this.tim.loginInfo.identifier)return pg(new Ip({code:lf,message:Ch}));var s=new Mg;return s.setMethod(cm).setStart(),s.setText("groupID=".concat(n," userID=").concat(r," role=").concat(o)),ca.log("GroupController.setGroupMemberRole. groupID:".concat(n,". userID: ").concat(r)),this._modifyGroupMemberInfo({groupID:n,userID:r,role:o}).then((function(e){return s.setCode(0).setNetworkType(t.getNetworkType()).setEnd(),ca.log("GroupController.setGroupMemberRole ok. groupID:".concat(n,". userID: ").concat(r)),new ag({group:i,member:e})})).catch((function(e){return t.probeNetwork().then((function(t){var n=Bn(t,2),r=n[0],o=n[1];s.setError(e,r,o).setEnd();})),ca.error("GroupController.setGroupMemberRole error:".concat(e,". groupID:").concat(n,". userID:").concat(r)),pg(e)}))}},{key:"setGroupMemberMuteTime",value:function(e){var t=this,n=e.groupID,r=e.userID,o=e.muteTime;if(r===this.tim.loginInfo.identifier)return pg(new Ip({code:pf,message:Ih}));ca.log("GroupController.setGroupMemberMuteTime. groupID:".concat(n,". userID: ").concat(r));var i=new Mg;return i.setMethod(am).setStart(),i.setText("groupID=".concat(n," userID=").concat(r," muteTime=").concat(o)),this._modifyGroupMemberInfo({groupID:n,userID:r,muteTime:o}).then((function(e){return i.setCode(0).setNetworkType(t.getNetworkType()).setEnd(),ca.log("GroupController.setGroupMemberMuteTime ok. groupID:".concat(n,". userID: ").concat(r)),new ag({group:t.getLocalGroupProfile(n),member:e})})).catch((function(e){return t.probeNetwork().then((function(t){var n=Bn(t,2),r=n[0],o=n[1];i.setError(e,r,o).setEnd();})),ca.error("GroupController.setGroupMemberMuteTime error:".concat(e,". groupID:").concat(n,". userID:").concat(r)),pg(e)}))}},{key:"setMessageRemindType",value:function(e){var t=this,n=new Mg;n.setMethod(Xg).setStart(),n.setText("groupID=".concat(e.groupID," userID=").concat(e.userID||this.tim.loginInfo.identifier)),ca.log("GroupController.setMessageRemindType. groupID:".concat(e.groupID,". userID: ").concat(e.userID||this.tim.loginInfo.identifier));var r=e.groupID,o=e.messageRemindType;return this._modifyGroupMemberInfo({groupID:r,messageRemindType:o,userID:this.tim.loginInfo.identifier}).then((function(){n.setCode(0).setNetworkType(t.getNetworkType()).setEnd(),ca.log("GroupController.setMessageRemindType ok. groupID:".concat(e.groupID,". userID: ").concat(e.userID||t.tim.loginInfo.identifier));var r=t.getLocalGroupProfile(e.groupID);return r&&(r.selfInfo.messageRemindType=o),new ag({group:r})})).catch((function(r){return t.probeNetwork().then((function(e){var t=Bn(e,2),o=t[0],i=t[1];n.setError(r,o,i).setEnd();})),ca.error("GroupController.setMessageRemindType error:".concat(r,". groupID:").concat(e.groupID,". userID:").concat(e.userID||t.tim.loginInfo.identifier)),pg(r)}))}},{key:"setGroupMemberNameCard",value:function(e){var t=this,n=e.groupID,r=e.userID,o=void 0===r?this.tim.loginInfo.identifier:r,i=e.nameCard;ca.log("GroupController.setGroupMemberNameCard. groupID:".concat(n,". userID: ").concat(o));var s=new Mg;return s.setMethod(um).setStart(),s.setText("groupID=".concat(n," userID=").concat(o," nameCard=").concat(i)),this._modifyGroupMemberInfo({groupID:n,userID:o,nameCard:i}).then((function(e){ca.log("GroupController.setGroupMemberNameCard ok. groupID:".concat(n,". userID: ").concat(o)),s.setCode(0).setNetworkType(t.getNetworkType()).setEnd();var r=t.getLocalGroupProfile(n);return o===t.tim.loginInfo.identifier&&r&&r.setSelfNameCard(i),new ag({group:r,member:e})})).catch((function(e){return t.probeNetwork().then((function(t){var n=Bn(t,2),r=n[0],o=n[1];s.setError(e,r,o).setEnd();})),ca.error("GroupController.setGroupMemberNameCard error:".concat(e,". groupID:").concat(n,". userID:").concat(o)),pg(e)}))}},{key:"setGroupMemberCustomField",value:function(e){var t=this,n=e.groupID,r=e.userID,o=void 0===r?this.tim.loginInfo.identifier:r,i=e.memberCustomField;ca.log("GroupController.setGroupMemberCustomField. groupID:".concat(n,". userID: ").concat(o));var s=new Mg;return s.setMethod(lm).setStart(),s.setText("groupID=".concat(n," userID=").concat(o," memberCustomField=").concat(i)),this._modifyGroupMemberInfo({groupID:n,userID:o,memberCustomField:i}).then((function(e){return s.setCode(0).setNetworkType(t.getNetworkType()).setEnd(),ca.log("GroupController.setGroupMemberCustomField ok. groupID:".concat(n,". userID: ").concat(o)),new ag({group:t.groupMap.get(n),member:e})})).catch((function(e){return t.probeNetwork().then((function(t){var n=Bn(t,2),r=n[0],o=n[1];s.setError(e,r,o).setEnd();})),ca.error("GroupController.setGroupMemberCustomField error:".concat(e,". groupID:").concat(n,". userID:").concat(o)),pg(e)}))}},{key:"getGroupList",value:function(e){var t=this,n=new Mg;n.setMethod(Zg).setStart(),ca.log("GroupController.getGroupList");var r={introduction:"Introduction",notification:"Notification",createTime:"CreateTime",ownerID:"Owner_Account",lastInfoTime:"LastInfoTime",memberNum:"MemberNum",maxMemberNum:"MaxMemberNum",joinOption:"ApplyJoinOption",muteAllMembers:"ShutUpAllMember"},o=["Type","Name","FaceUrl","NextMsgSeq","LastMsgTime"];return e&&e.groupProfileFilter&&e.groupProfileFilter.forEach((function(e){r[e]&&o.push(r[e]);})),this.request({name:"group",action:"list",param:{responseFilter:{groupBaseInfoFilter:o,selfInfoFilter:["Role","JoinTime","MsgFlag"]}}}).then((function(e){var r=e.data.groups;return n.setCode(0).setNetworkType(t.getNetworkType()).setText(r.length).setEnd(),ca.log("GroupController.getGroupList ok. nums=".concat(r.length)),t._groupListTreeShaking(r),t.updateGroupMap(r),t.tempConversationList&&(ca.log("GroupController.getGroupList update last message with tempConversationList, nums=".concat(t.tempConversationList.length)),t._handleUpdateGroupLastMessage({data:t.tempConversationList}),t.tempConversationList=null),t.emitGroupListUpdate(),new ag({groupList:t.getLocalGroups()})})).catch((function(e){return t.probeNetwork().then((function(t){var r=Bn(t,2),o=r[0],i=r[1];n.setError(e,o,i).setEnd();})),ca.error("GroupController.getGroupList error: ",e),pg(e)}))}},{key:"getGroupMemberList",value:function(e){var t=this,n=e.groupID,r=e.offset,o=void 0===r?0:r,i=e.count,s=void 0===i?15:i,a=new Mg;a.setMethod(rm).setStart(),ca.log("GroupController.getGroupMemberList groupID: ".concat(n," offset: ").concat(o," count: ").concat(s));var u=[];return this.request({name:"group",action:"getGroupMemberList",param:{groupID:n,offset:o,limit:s>100?100:s,memberInfoFilter:["Role","NameCard","ShutUpUntil"]}}).then((function(e){var r=e.data,o=r.members,i=r.memberNum;return ga(o)&&0!==o.length?(t.hasLocalGroup(n)&&(t.getLocalGroupProfile(n).memberNum=i),u=t._updateLocalGroupMemberMap(n,o),t.tim.getUserProfile({userIDList:o.map((function(e){return e.userID})),tagList:[rp.NICK,rp.AVATAR]})):Promise.resolve([])})).then((function(e){var r=e.data;if(!ga(r)||0===r.length)return lg({memberList:[]});var i=r.map((function(e){return {userID:e.userID,nick:e.nick,avatar:e.avatar}}));return t._updateLocalGroupMemberMap(n,i),a.setCode(0).setNetworkType(t.getNetworkType()).setText("groupID=".concat(n," offset=").concat(o," count=").concat(s)).setEnd(),ca.log("GroupController.getGroupMemberList ok."),new ag({memberList:u})})).catch((function(e){return t.probeNetwork().then((function(t){var n=Bn(t,2),r=n[0],o=n[1];a.setError(e,r,o).setEnd();})),ca.error("GroupController.getGroupMemberList error: ",e),pg(e)}))}},{key:"getLocalGroups",value:function(){return Hn(this.groupMap.values())}},{key:"getLocalGroupProfile",value:function(e){return this.groupMap.get(e)}},{key:"hasLocalGroup",value:function(e){return this.groupMap.has(e)}},{key:"getLocalGroupMemberInfo",value:function(e,t){return this.groupMemberListMap.has(e)?this.groupMemberListMap.get(e).get(t):null}},{key:"setLocalGroupMember",value:function(e,t){if(this.groupMemberListMap.has(e))this.groupMemberListMap.get(e).set(t.userID,t);else {var n=(new Map).set(t.userID,t);this.groupMemberListMap.set(e,n);}}},{key:"hasLocalGroupMember",value:function(e,t){return this.groupMemberListMap.has(e)&&this.groupMemberListMap.get(e).has(t)}},{key:"hasLocalGroupMemberMap",value:function(e){return this.groupMemberListMap.has(e)}},{key:"getGroupProfile",value:function(e){var t=this,n=new Mg;n.setMethod(em).setStart(),ca.log("GroupController.getGroupProfile. groupID:",e.groupID);var r=e.groupID,o=e.groupCustomFieldFilter,i={groupIDList:[r],responseFilter:{groupBaseInfoFilter:["Type","Name","Introduction","Notification","FaceUrl","Owner_Account","CreateTime","InfoSeq","LastInfoTime","LastMsgTime","MemberNum","MaxMemberNum","ApplyJoinOption","NextMsgSeq","ShutUpAllMember"],groupCustomFieldFilter:o}};return this.getGroupProfileAdvance(i).then((function(o){var i,s=o.data,a=s.successGroupList,u=s.failureGroupList;return ca.log("GroupController.getGroupProfile ok. groupID:",e.groupID),u.length>0?pg(u[0]):(xa(a[0].type)&&!t.hasLocalGroup(r)?i=new r_(a[0]):(t.updateGroupMap(a),i=t.getLocalGroupProfile(r)),n.setCode(0).setNetworkType(t.getNetworkType()).setText("groupID=".concat(i.groupID," type=").concat(i.type," muteAllMembers=").concat(i.muteAllMembers," ownerID=").concat(i.ownerID)).setEnd(),i&&i.selfInfo&&!i.selfInfo.nameCard?t.updateSelfInfo(i).then((function(e){return new ag({group:e})})):new ag({group:i}))})).catch((function(r){return t.probeNetwork().then((function(t){var o=Bn(t,2),i=o[0],s=o[1];n.setError(r,i,s).setText("groupID=".concat(e.groupID)).setEnd();})),ca.error("GroupController.getGroupProfile error:".concat(Ea(r),". groupID:").concat(e.groupID)),pg(r)}))}},{key:"getGroupMemberProfile",value:function(e){var t=this,n=new Mg;n.setMethod(om).setText(e.userIDList.length>5?"userIDList.length=".concat(e.userIDList.length):"userIDList=".concat(e.userIDList)).setStart(),ca.log("GroupController.getGroupMemberProfile groupID:".concat(e.groupID," userIDList:").concat(e.userIDList.join(","))),e.userIDList.length>50&&(e.userIDList=e.userIDList.slice(0,50));var r=e.groupID,o=e.userIDList;return this._getGroupMemberProfileAdvance(On({},e,{userIDList:o})).then((function(e){var n=e.data.members;return ga(n)&&0!==n.length?(t._updateLocalGroupMemberMap(r,n),t.tim.getUserProfile({userIDList:n.map((function(e){return e.userID})),tagList:[rp.NICK,rp.AVATAR]})):lg([])})).then((function(e){var i=e.data.map((function(e){return {userID:e.userID,nick:e.nick,avatar:e.avatar}}));t._updateLocalGroupMemberMap(r,i);var s=o.filter((function(e){return t.hasLocalGroupMember(r,e)})).map((function(e){return t.getLocalGroupMemberInfo(r,e)}));return n.setCode(0).setNetworkType(t.getNetworkType()).setEnd(),new ag({memberList:s})}))}},{key:"_getGroupMemberProfileAdvance",value:function(e){return this.request({name:"group",action:"getGroupMemberProfile",param:On({},e,{memberInfoFilter:e.memberInfoFilter?e.memberInfoFilter:["Role","JoinTime","NameCard","ShutUpUntil"]})})}},{key:"updateSelfInfo",value:function(e){var t=e.groupID;ca.log("GroupController.updateSelfInfo groupID:",t);var n={groupID:t,userIDList:[this.tim.loginInfo.identifier]};return this.getGroupMemberProfile(n).then((function(n){var r=n.data.memberList;return ca.log("GroupController.updateSelfInfo ok. groupID:",t),e&&0!==r.length&&e.updateSelfInfo(r[0]),e}))}},{key:"addGroupMember",value:function(e){var t=this,n=new Mg;n.setMethod(im).setText("groupID=".concat(e.groupID)).setStart();var r=this.getLocalGroupProfile(e.groupID);if(xa(r.type)){var o=new Ip({code:rf,message:dh});return n.setCode(rf).setMessage(dh).setNetworkType(this.getNetworkType()).setText("groupID=".concat(e.groupID," groupType=").concat(r.type)).setEnd(),pg(o)}return e.userIDList=e.userIDList.map((function(e){return {userID:e}})),ca.log("GroupController.addGroupMember. groupID:",e.groupID),this.request({name:"group",action:"addGroupMember",param:e}).then((function(o){var i=o.data.members;n.setCode(0).setNetworkType(t.getNetworkType()).setText("groupID=".concat(e.groupID)).setEnd(),ca.log("GroupController.addGroupMember ok. groupID:",e.groupID);var s=i.filter((function(e){return 1===e.result})).map((function(e){return e.userID})),a=i.filter((function(e){return 0===e.result})).map((function(e){return e.userID})),u=i.filter((function(e){return 2===e.result})).map((function(e){return e.userID}));return 0===s.length?new ag({successUserIDList:s,failureUserIDList:a,existedUserIDList:u}):(r.memberNum+=s.length,new ag({successUserIDList:s,failureUserIDList:a,existedUserIDList:u,group:r}))})).catch((function(r){return t.probeNetwork().then((function(t){var o=Bn(t,2),i=o[0],s=o[1];n.setError(r,i,s).setText("groupID=".concat(e.groupID)).setEnd();})),ca.error("GroupController.addGroupMember error:".concat(r,", groupID:").concat(e.groupID)),pg(r)}))}},{key:"deleteGroupMember",value:function(e){var t=this,n=new Mg;n.setMethod(sm).setText(e.userIDList.length>5?"userIDList.length=".concat(e.userIDList.length):"userIDList=".concat(e.userIDList)).setStart(),ca.log("GroupController.deleteGroupMember groupID:".concat(e.groupID," userIDList:").concat(e.userIDList));var r=this.getLocalGroupProfile(e.groupID);return r.type===pn.GRP_AVCHATROOM?pg(new Ip({code:sf,message:mh})):this.request({name:"group",action:"deleteGroupMember",param:e}).then((function(){return n.setCode(0).setNetworkType(t.getNetworkType()).setEnd(),ca.log("GroupController.deleteGroupMember ok"),r.memberNum--,t.deleteLocalGroupMembers(e.groupID,e.userIDList),new ag({group:r,userIDList:e.userIDList})})).catch((function(r){return t.probeNetwork().then((function(t){var o=Bn(t,2),i=o[0],s=o[1];n.setError(r,i,s).setText("groupID=".concat(e.groupID)).setEnd();})),ca.error("GroupController.deleteGroupMember error:".concat(r.code,", groupID:").concat(e.groupID)),pg(r)}))}},{key:"searchGroupByID",value:function(e){var t=this,n={groupIDList:[e]},r=new Mg;return r.setMethod(Yg).setText("groupID=".concat(e)).setStart(),ca.log("GroupController.searchGroupByID. groupID:".concat(e)),this.request({name:"group",action:"searchGroupByID",param:n}).then((function(n){var o=n.data.groupProfile;if(o[0].errorCode!==Lu.SUCCESS)throw new Ip({code:o[0].errorCode,message:o[0].errorInfo});return r.setCode(0).setNetworkType(t.getNetworkType()).setEnd(),ca.log("GroupController.searchGroupByID ok. groupID:".concat(e)),new ag({group:new r_(o[0])})})).catch((function(n){return t.probeNetwork().then((function(e){var t=Bn(e,2),o=t[0],i=t[1];r.setError(n,o,i).setEnd();})),ca.warn("GroupController.searchGroupByID error:".concat(Ea(n),", groupID:").concat(e)),pg(n)}))}},{key:"applyJoinGroup",value:function(e){var t=this,n=new Mg;return n.setMethod(Kg).setStart(),this.request({name:"group",action:"applyJoinGroup",param:e}).then((function(r){var o=r.data,i=o.joinedStatus,s=o.longPollingKey;switch(n.setCode(0).setNetworkType(t.getNetworkType()).setText("groupID=".concat(e.groupID," joinedStatus=").concat(i)).setEnd(),ca.log("GroupController.joinGroup ok. groupID:",e.groupID),i){case Ou.WAIT_APPROVAL:return new ag({status:Ou.WAIT_APPROVAL});case Ou.SUCCESS:return t.getGroupProfile({groupID:e.groupID}).then((function(n){var r=n.data.group,o={status:Ou.SUCCESS,group:r};return ma(s)?new ag(o):(t.emitInnerEvent(Bd,e.groupID),t.AVChatRoomHandler.startRunLoop({longPollingKey:s,group:r}))}));default:var a=new Ip({code:nf,message:hh});return ca.error("GroupController.joinGroup error:".concat(a,". groupID:").concat(e.groupID)),pg(a)}})).catch((function(r){return n.setText("groupID=".concat(e.groupID)),t.probeNetwork().then((function(e){var t=Bn(e,2),o=t[0],i=t[1];n.setError(r,o,i).setEnd();})),ca.error("GroupController.joinGroup error:".concat(r,". groupID:").concat(e.groupID)),pg(r)}))}},{key:"applyJoinAVChatRoom",value:function(e){return this.AVChatRoomHandler.applyJoinAVChatRoom(e)}},{key:"handleGroupApplication",value:function(e){var t=this,n=e.message.payload,r=n.groupProfile.groupID,o=n.authentication,i=n.messageKey,s=n.operatorID,a=new Mg;return a.setMethod(Wg).setText("groupID=".concat(r)).setStart(),ca.log("GroupController.handleApplication. groupID:",r),this.request({name:"group",action:"handleApplyJoinGroup",param:On({},e,{applicant:s,groupID:r,authentication:o,messageKey:i})}).then((function(){return a.setCode(0).setNetworkType(t.getNetworkType()).setEnd(),ca.log("GroupController.handleApplication ok. groupID:",r),t.deleteGroupSystemNotice({messageList:[e.message]}),new ag({group:t.getLocalGroupProfile(r)})})).catch((function(e){return t.probeNetwork().then((function(t){var n=Bn(t,2),r=n[0],o=n[1];a.setError(e,r,o).setEnd();})),ca.error("GroupController.handleApplication error.  error:".concat(e,". groupID:").concat(r)),pg(e)}))}},{key:"deleteGroupSystemNotice",value:function(e){var t=this;return ga(e.messageList)&&0!==e.messageList.length?(ca.log("GroupController.deleteGroupSystemNotice "+e.messageList.map((function(e){return e.ID}))),this.request({name:"group",action:"deleteGroupSystemNotice",param:{messageListToDelete:e.messageList.map((function(e){return {from:pn.CONV_SYSTEM,messageSeq:e.clientSequence,messageRandom:e.random}}))}}).then((function(){return ca.log("GroupController.deleteGroupSystemNotice ok"),e.messageList.forEach((function(e){t.tim.messageController.deleteLocalMessage(e);})),new ag})).catch((function(e){return ca.error("GroupController.deleteGroupSystemNotice error:",e),pg(e)}))):lg()}},{key:"getGroupProfileAdvance",value:function(e){return ga(e.groupIDList)&&e.groupIDList.length>50&&(ca.warn("GroupController.getGroupProfileAdvance 获取群资料的数量不能超过50个"),e.groupIDList.length=50),ca.log("GroupController.getGroupProfileAdvance. groupIDList:",e.groupIDList),this.request({name:"group",action:"query",param:e}).then((function(e){ca.log("GroupController.getGroupProfileAdvance ok.");var t=e.data.groups,n=t.filter((function(e){return ma(e.errorCode)||e.errorCode===Lu.SUCCESS})),r=t.filter((function(e){return e.errorCode&&e.errorCode!==Lu.SUCCESS})).map((function(e){return new Ip({code:Number("500".concat(e.errorCode)),message:e.errorInfo,data:{groupID:e.groupID}})}));return new ag({successGroupList:n,failureGroupList:r})})).catch((function(t){return ca.error("GroupController.getGroupProfileAdvance error:".concat(Ea(t),". groupIDList:").concat(e.groupIDList)),pg(t)}))}},{key:"_deleteLocalGroup",value:function(e){return this.groupMap.delete(e),this.groupMemberListMap.delete(e),this._setStorageGroupList(),this.groupMap.has(e)&&this.groupMemberListMap.has(e)}},{key:"_initGroupList",value:function(){var e=this,t=new Mg;t.setMethod(tm).setStart(),ca.time(Cg),ca.log("GroupController._initGroupList");var n=this._getStorageGroupList();ga(n)&&n.length>0?(n.forEach((function(t){e.groupMap.set(t.groupID,new r_(t));})),this.emitGroupListUpdate(!0,!1),t.setCode(0).setNetworkType(this.getNetworkType()).setText(this.groupMap.size).setEnd()):t.setCode(0).setNetworkType(this.getNetworkType()).setText(0).setEnd(),this.triggerReady(),ca.log("GroupController._initGroupList ok. initCost=".concat(ca.timeEnd(Cg),"ms")),this.getGroupList();}},{key:"_initListeners",value:function(){var e=this.tim.innerEmitter;e.once(rd,this._initGroupList,this),e.on(Ud,this._handleUpdateGroupLastMessage,this),e.on(pd,this._handleReceivedGroupMessage,this),e.on(jd,this._handleProfileUpdated,this);}},{key:"emitGroupListUpdate",value:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=this.getLocalGroups();t&&this.emitInnerEvent(Od,n),e&&this.emitOuterEvent(ln.GROUP_LIST_UPDATED,n);}},{key:"_handleReceivedGroupMessage",value:function(e){var t=this,n=e.data.eventDataList;Array.isArray(n)&&n.forEach((function(e){var n=e.conversationID.replace(pn.CONV_GROUP,"");t.groupMap.has(n)&&(t.groupMap.get(n).nextMessageSeq=e.lastMessage.sequence+1);}));}},{key:"_onReceivedGroupSystemNotice",value:function(e){var t=e.data;this.groupNoticeHandler._onReceivedGroupNotice(t);}},{key:"_handleUpdateGroupLastMessage",value:function(e){var t=e.data;if(ca.log("GroupController._handleUpdateGroupLastMessage convNums=".concat(t.length," groupNums=").concat(this.groupMap.size)),0!==this.groupMap.size){for(var n,r,o,i=!1,s=0,a=t.length;s<a;s++)(n=t[s]).conversationID&&n.type!==pn.CONV_GROUP&&(r=n.conversationID.split(/^GROUP/)[1],(o=this.getLocalGroupProfile(r))&&(o.lastMessage=n.lastMessage,i=!0));i&&(this.groupMap=this._sortLocalGroupList(this.groupMap),this.emitGroupListUpdate(!0,!1));}else this.tempConversationList=t;}},{key:"_sortLocalGroupList",value:function(e){var t=Hn(e).filter((function(e){var t=Bn(e,2);t[0];return !ja(t[1].lastMessage)}));return t.sort((function(e,t){return t[1].lastMessage.lastTime-e[1].lastMessage.lastTime})),new Map([].concat(Hn(t),Hn(e)))}},{key:"_getStorageGroupList",value:function(){return this.tim.storage.getItem("groupMap")}},{key:"_setStorageGroupList",value:function(){var e=this.getLocalGroups().filter((function(e){var t=e.type;return !xa(t)})).slice(0,20).map((function(e){return {groupID:e.groupID,name:e.name,avatar:e.avatar,type:e.type}}));this.tim.storage.setItem("groupMap",e);}},{key:"updateGroupMap",value:function(e){var t=this;e.forEach((function(e){t.groupMap.has(e.groupID)?t.groupMap.get(e.groupID).updateGroup(e):t.groupMap.set(e.groupID,new r_(e));})),this._setStorageGroupList();}},{key:"_updateLocalGroupMemberMap",value:function(e,t){var n=this;return ga(t)&&0!==t.length?t.map((function(t){return n.hasLocalGroupMember(e,t.userID)?n.getLocalGroupMemberInfo(e,t.userID).updateMember(t):n.setLocalGroupMember(e,new T_(t)),n.getLocalGroupMemberInfo(e,t.userID)})):[]}},{key:"deleteLocalGroupMembers",value:function(e,t){var n=this.groupMemberListMap.get(e);n&&t.forEach((function(e){n.delete(e);}));}},{key:"_modifyGroupMemberInfo",value:function(e){var t=this,n=e.groupID,r=e.userID;return this.request({name:"group",action:"modifyGroupMemberInfo",param:e}).then((function(){if(t.hasLocalGroupMember(n,r)){var o=t.getLocalGroupMemberInfo(n,r);return ma(e.muteTime)||o.updateMuteUntil(e.muteTime),ma(e.role)||o.updateRole(e.role),ma(e.nameCard)||o.updateNameCard(e.nameCard),ma(e.memberCustomField)||o.updateMemberCustomField(e.memberCustomField),o}return t.getGroupMemberProfile({groupID:n,userIDList:[r]}).then((function(e){return Bn(e.data.memberList,1)[0]}))}))}},{key:"_groupListTreeShaking",value:function(e){for(var t=new Map(Hn(this.groupMap)),n=0,r=e.length;n<r;n++)t.delete(e[n].groupID);this.AVChatRoomHandler.hasJoinedAVChatRoom()&&t.delete(this.AVChatRoomHandler.group.groupID);for(var o=Hn(t.keys()),i=0,s=o.length;i<s;i++)this.groupMap.delete(o[i]);}},{key:"_handleProfileUpdated",value:function(e){for(var t=this,n=e.data,r=function(e){var r=n[e];t.groupMemberListMap.forEach((function(e){e.has(r.userID)&&e.get(r.userID).updateMember({nick:r.nick,avatar:r.avatar});}));},o=0;o<n.length;o++)r(o);}},{key:"getJoinedAVChatRoom",value:function(){return this.AVChatRoomHandler.getJoinedAVChatRoom()}},{key:"deleteLocalGroupAndConversation",value:function(e){this._deleteLocalGroup(e),this.tim.conversationController.deleteLocalConversation("GROUP".concat(e)),this.emitGroupListUpdate(!0,!1);}},{key:"checkJoinedAVChatRoomByID",value:function(e){return this.AVChatRoomHandler.checkJoinedAVChatRoomByID(e)}},{key:"getGroupLastSequence",value:function(e){var t=this,n=new Mg;n.setMethod(nm).setStart();var r=0;if(this.hasLocalGroup(e)){var o=this.getLocalGroupProfile(e);if(o.lastMessage.lastSequence>0)return r=o.lastMessage.lastSequence,ca.log("GroupController.getGroupLastSequence got lastSequence=".concat(r," from local group profile[lastMessage.lastSequence]. groupID=").concat(e)),n.setCode(0).setNetworkType(this.getNetworkType()).setText("got lastSequence=".concat(r," from local group profile[lastMessage.lastSequence]. groupID=").concat(e)).setEnd(),Promise.resolve(r);if(o.nextMessageSeq>1)return r=o.nextMessageSeq-1,ca.log("GroupController.getGroupLastSequence got lastSequence=".concat(r," from local group profile[nextMessageSeq]. groupID=").concat(e)),n.setCode(0).setNetworkType(this.getNetworkType()).setText("got lastSequence=".concat(r," from local group profile[nextMessageSeq]. groupID=").concat(e)).setEnd(),Promise.resolve(r)}var i="GROUP".concat(e),s=this.tim.conversationController.getLocalConversation(i);if(s&&s.lastMessage.lastSequence)return r=s.lastMessage.lastSequence,ca.log("GroupController.getGroupLastSequence got lastSequence=".concat(r," from local conversation profile[lastMessage.lastSequence]. groupID=").concat(e)),n.setCode(0).setNetworkType(this.getNetworkType()).setText("got lastSequence=".concat(r," from local conversation profile[lastMessage.lastSequence]. groupID=").concat(e)).setEnd(),Promise.resolve(r);var a={groupIDList:[e],responseFilter:{groupBaseInfoFilter:["NextMsgSeq"]}};return this.getGroupProfileAdvance(a).then((function(o){var i=o.data.successGroupList;return ja(i)?ca.log("GroupController.getGroupLastSequence successGroupList is empty. groupID=".concat(e)):(r=i[0].nextMessageSeq-1,ca.log("GroupController.getGroupLastSequence got lastSequence=".concat(r," from getGroupProfileAdvance. groupID=").concat(e))),n.setCode(0).setNetworkType(t.getNetworkType()).setText("got lastSequence=".concat(r," from getGroupProfileAdvance. groupID=").concat(e)).setEnd(),r})).catch((function(r){return t.probeNetwork().then((function(t){var o=Bn(t,2),i=o[0],s=o[1];n.setError(r,i,s).setText("get lastSequence failed from getGroupProfileAdvance. groupID=".concat(e)).setEnd();})),ca.warn("GroupController.getGroupLastSequence failed. ".concat(r)),pg(r)}))}},{key:"reset",value:function(){this.groupMap.clear(),this.groupMemberListMap.clear(),this.resetReady(),this.groupNoticeHandler.reset(),this.AVChatRoomHandler.reset(),this.tim.innerEmitter.once(rd,this._initGroupList,this);}}]),n}(og),b_=function(e){Ln(n,e);var t=jn(n);function n(e){var r;kn(this,n),(r=t.call(this,e)).REALTIME_MESSAGE_TIMEOUT=11e4,r.LONGPOLLING_ID_TIMEOUT=3e5,r._currentState=pn.NET_STATE_CONNECTED,r._status={OPENIM:{lastResponseReceivedTime:0,jitterCount:0,failedCount:0},AVCHATROOM:{lastResponseReceivedTime:0,jitterCount:0,failedCount:0}};var o=r.tim.innerEmitter;return o.on(dd,r._onGetLongPollIDFailed,qn(r)),o.on(md,r._onOpenIMResponseOK,qn(r)),o.on(gd,r._onOpenIMRequestFailed,qn(r)),o.on(Rd,r._onAVChatroomResponseOK,qn(r)),o.on(bd,r._onAVChatroomRequestFailed,qn(r)),r}return An(n,[{key:"_onGetLongPollIDFailed",value:function(){this._currentState!==pn.NET_STATE_DISCONNECTED&&this._emitNetStateChangeEvent(pn.NET_STATE_DISCONNECTED);}},{key:"_onOpenIMResponseOK",value:function(){this._onResponseOK("OPENIM");}},{key:"_onOpenIMRequestFailed",value:function(){this._onRequestFailed("OPENIM");}},{key:"_onAVChatroomResponseOK",value:function(){this.isLoggedIn()||this._onResponseOK("AVCHATROOM");}},{key:"_onAVChatroomRequestFailed",value:function(){this.isLoggedIn()||this._onRequestFailed("AVCHATROOM");}},{key:"_onResponseOK",value:function(e){var t=this._status[e],n=Date.now();if(0!==t.lastResponseReceivedTime){var r=n-t.lastResponseReceivedTime;if(ca.debug("StatusController._onResponseOK key=".concat(e," currentState=").concat(this._currentState," interval=").concat(r," failedCount=").concat(t.failedCount," jitterCount=").concat(t.jitterCount)),t.failedCount>0&&(t.failedCount=0,t.jitterCount+=1,this._currentState!==pn.NET_STATE_CONNECTED&&this._emitNetStateChangeEvent(pn.NET_STATE_CONNECTED)),r<=this.REALTIME_MESSAGE_TIMEOUT){if(t.jitterCount>=3){var o=new Mg;o.setMethod(hm).setStart(),o.setCode(0).setText("".concat(e,"-").concat(r,"-").concat(t.jitterCount)).setNetworkType(this.getNetworkType()).setEnd(),t.jitterCount=0;}}else if(r>=this.REALTIME_MESSAGE_TIMEOUT&&r<this.LONGPOLLING_ID_TIMEOUT){var i=new Mg;i.setMethod(dm).setStart(),i.setCode(0).setText("".concat(e,"-").concat(r)).setNetworkType(this.getNetworkType()).setEnd(),ca.warn("StatusController._onResponseOK, fast start. key=".concat(e," interval=").concat(r," ms")),this.emitInnerEvent(vd);}else if(r>=this.LONGPOLLING_ID_TIMEOUT){var s=new Mg;s.setMethod(gm).setStart(),s.setCode(0).setText("".concat(e,"-").concat(r)).setNetworkType(this.getNetworkType()).setEnd(),ca.warn("StatusController._onResponseOK, slow start. key=".concat(e," interval=").concat(r," ms")),this.emitInnerEvent(yd);}t.lastResponseReceivedTime=n;}else t.lastResponseReceivedTime=n;}},{key:"_onRequestFailed",value:function(e){var t=this,n=this._status[e];Date.now()-n.lastResponseReceivedTime>=this.LONGPOLLING_ID_TIMEOUT?this._currentState!==pn.NET_STATE_DISCONNECTED&&(ca.warn("StatusController._onRequestFailed, disconnected, longpolling unavailable more than 5min. key=".concat(e," networkType=").concat(this.getNetworkType())),this._emitNetStateChangeEvent(pn.NET_STATE_DISCONNECTED)):(n.failedCount+=1,n.failedCount>5?this.probeNetwork().then((function(r){var o=Bn(r,2),i=o[0],s=o[1];i?(t._currentState!==pn.NET_STATE_CONNECTING&&t._emitNetStateChangeEvent(pn.NET_STATE_CONNECTING),ca.warn("StatusController._onRequestFailed, connecting, network jitter. key=".concat(e," networkType=").concat(s))):(t._currentState!==pn.NET_STATE_DISCONNECTED&&t._emitNetStateChangeEvent(pn.NET_STATE_DISCONNECTED),ca.warn("StatusController._onRequestFailed, disconnected, longpolling unavailable. key=".concat(e," networkType=").concat(s))),n.failedCount=0,n.jitterCount=0;})):this._currentState===pn.NET_STATE_CONNECTED&&this._emitNetStateChangeEvent(pn.NET_STATE_CONNECTING));}},{key:"_emitNetStateChangeEvent",value:function(e){ca.log("StatusController._emitNetStateChangeEvent net state changed from ".concat(this._currentState," to ").concat(e)),this._currentState=e,this.emitOuterEvent(ln.NET_STATE_CHANGE,{state:e});}},{key:"reset",value:function(){ca.log("StatusController.reset"),this._currentState=pn.NET_STATE_CONNECTED,this._status={OPENIM:{lastResponseReceivedTime:0,jitterCount:0,failedCount:0},AVCHATROOM:{lastResponseReceivedTime:0,jitterCount:0,failedCount:0}};}}]),n}(og);function R_(){return null}var O_=function(){function e(t){kn(this,e),this.tim=t,this.isWX=Rs,this.storageQueue=new Map,this.checkTimes=0,this.checkTimer=setInterval(this._onCheckTimer.bind(this),1e3),this._errorTolerantHandle();}return An(e,[{key:"_errorTolerantHandle",value:function(){!this.isWX&&ma(window.localStorage)&&(this.getItem=R_,this.setItem=R_,this.removeItem=R_,this.clear=R_);}},{key:"_onCheckTimer",value:function(){if(this.checkTimes++,this.checkTimes%20==0){if(0===this.storageQueue.size)return;this._doFlush();}}},{key:"_doFlush",value:function(){try{var e,t=$n(this.storageQueue);try{for(t.s();!(e=t.n()).done;){var n=Bn(e.value,2),r=n[0],o=n[1];this.isWX?wx.setStorageSync(this._getKey(r),o):localStorage.setItem(this._getKey(r),JSON.stringify(o));}}catch(i){t.e(i);}finally{t.f();}this.storageQueue.clear();}catch(mC){ca.warn("Storage._doFlush error",mC);}}},{key:"_getPrefix",value:function(){var e=this.tim.loginInfo,t=e.SDKAppID,n=e.identifier;return "TIM_".concat(t,"_").concat(n,"_")}},{key:"getItem",value:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];try{var n=t?this._getKey(e):e;return this.isWX?wx.getStorageSync(n):JSON.parse(localStorage.getItem(n))}catch(mC){ca.warn("Storage.getItem error:",mC);}}},{key:"setItem",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];if(n){var o=r?this._getKey(e):e;this.isWX?wx.setStorageSync(o,t):localStorage.setItem(o,JSON.stringify(t));}else this.storageQueue.set(e,t);}},{key:"clear",value:function(){try{this.isWX?wx.clearStorageSync():localStorage.clear();}catch(mC){ca.warn("Storage.clear error:",mC);}}},{key:"removeItem",value:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];try{var n=t?this._getKey(e):e;this.isWX?wx.removeStorageSync(n):localStorage.removeItem(n);}catch(mC){ca.warn("Storage.removeItem error:",mC);}}},{key:"getSize",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"b";try{var r={size:0,limitSize:5242880,unit:n};if(Object.defineProperty(r,"leftSize",{enumerable:!0,get:function(){return r.limitSize-r.size}}),this.isWX&&(r.limitSize=1024*wx.getStorageInfoSync().limitSize),e)r.size=JSON.stringify(this.getItem(e)).length+this._getKey(e).length;else if(this.isWX){var o=wx.getStorageInfoSync(),i=o.keys;i.forEach((function(e){r.size+=JSON.stringify(wx.getStorageSync(e)).length+t._getKey(e).length;}));}else for(var s in localStorage)localStorage.hasOwnProperty(s)&&(r.size+=localStorage.getItem(s).length+s.length);return this._convertUnit(r)}catch(mC){ca.warn("Storage.getSize error:",mC);}}},{key:"_convertUnit",value:function(e){var t={},n=e.unit;for(var r in t.unit=n,e)"number"==typeof e[r]&&("kb"===n.toLowerCase()?t[r]=Math.round(e[r]/1024):"mb"===n.toLowerCase()?t[r]=Math.round(e[r]/1024/1024):t[r]=e[r]);return t}},{key:"_getKey",value:function(e){return "".concat(this._getPrefix()).concat(e)}},{key:"reset",value:function(){this._doFlush(),this.checkTimes=0;}}]),e}(),L_=t((function(e){var t=Object.prototype.hasOwnProperty,n="~";function r(){}function o(e,t,n){this.fn=e,this.context=t,this.once=n||!1;}function i(e,t,r,i,s){if("function"!=typeof r)throw new TypeError("The listener must be a function");var a=new o(r,i||e,s),u=n?n+t:t;return e._events[u]?e._events[u].fn?e._events[u]=[e._events[u],a]:e._events[u].push(a):(e._events[u]=a,e._eventsCount++),e}function s(e,t){0==--e._eventsCount?e._events=new r:delete e._events[t];}function a(){this._events=new r,this._eventsCount=0;}Object.create&&(r.prototype=Object.create(null),(new r).__proto__||(n=!1)),a.prototype.eventNames=function(){var e,r,o=[];if(0===this._eventsCount)return o;for(r in e=this._events)t.call(e,r)&&o.push(n?r.slice(1):r);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(e)):o},a.prototype.listeners=function(e){var t=n?n+e:e,r=this._events[t];if(!r)return [];if(r.fn)return [r.fn];for(var o=0,i=r.length,s=new Array(i);o<i;o++)s[o]=r[o].fn;return s},a.prototype.listenerCount=function(e){var t=n?n+e:e,r=this._events[t];return r?r.fn?1:r.length:0},a.prototype.emit=function(e,t,r,o,i,s){var a=n?n+e:e;if(!this._events[a])return !1;var u,c,l=this._events[a],p=arguments.length;if(l.fn){switch(l.once&&this.removeListener(e,l.fn,void 0,!0),p){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,t),!0;case 3:return l.fn.call(l.context,t,r),!0;case 4:return l.fn.call(l.context,t,r,o),!0;case 5:return l.fn.call(l.context,t,r,o,i),!0;case 6:return l.fn.call(l.context,t,r,o,i,s),!0}for(c=1,u=new Array(p-1);c<p;c++)u[c-1]=arguments[c];l.fn.apply(l.context,u);}else {var f,h=l.length;for(c=0;c<h;c++)switch(l[c].once&&this.removeListener(e,l[c].fn,void 0,!0),p){case 1:l[c].fn.call(l[c].context);break;case 2:l[c].fn.call(l[c].context,t);break;case 3:l[c].fn.call(l[c].context,t,r);break;case 4:l[c].fn.call(l[c].context,t,r,o);break;default:if(!u)for(f=1,u=new Array(p-1);f<p;f++)u[f-1]=arguments[f];l[c].fn.apply(l[c].context,u);}}return !0},a.prototype.on=function(e,t,n){return i(this,e,t,n,!1)},a.prototype.once=function(e,t,n){return i(this,e,t,n,!0)},a.prototype.removeListener=function(e,t,r,o){var i=n?n+e:e;if(!this._events[i])return this;if(!t)return s(this,i),this;var a=this._events[i];if(a.fn)a.fn!==t||o&&!a.once||r&&a.context!==r||s(this,i);else {for(var u=0,c=[],l=a.length;u<l;u++)(a[u].fn!==t||o&&!a[u].once||r&&a[u].context!==r)&&c.push(a[u]);c.length?this._events[i]=1===c.length?c[0]:c:s(this,i);}return this},a.prototype.removeAllListeners=function(e){var t;return e?(t=n?n+e:e,this._events[t]&&s(this,t)):(this._events=new r,this._eventsCount=0),this},a.prototype.off=a.prototype.removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=n,a.EventEmitter=a,e.exports=a;})),N_=function(e){var t,n,r,o,i;return ja(e.context)?(t="",n=0,r=0,o=0,i=1):(t=e.context.a2Key,n=e.context.tinyID,r=e.context.SDKAppID,o=e.context.contentType,i=e.context.apn),{platform:Xh,websdkappid:Wh,v:zh,a2:t,tinyid:n,sdkappid:r,contentType:o,apn:i,reqtime:function(){return +new Date}}},P_=function(){function e(t){kn(this,e),this.tim=t,this.tim.innerEmitter.on(td,this._update,this),this.tim.innerEmitter.on(nd,this._update,this),this.tim.innerEmitter.on(od,this._updateSpecifiedConfig,this),this._initConfig();}return An(e,[{key:"_update",value:function(e){this._initConfig();}},{key:"_updateSpecifiedConfig",value:function(e){var t=this;e.data.forEach((function(e){t._set(e);}));}},{key:"get",value:function(e){var t=e.name,n=e.action,r=e.param,o=e.tjgID;if(ma(this.config[t])||ma(this.config[t][n]))throw new Ip({code:Mf,message:"".concat(bh,": PackageConfig.").concat(t)});var i=function e(t){if(0===Object.getOwnPropertyNames(t).length)return Object.create(null);var n=Array.isArray(t)?[]:Object.create(null),r="";for(var o in t)null!==t[o]?void 0!==t[o]?(r=Dn(t[o]),["string","number","function","boolean"].indexOf(r)>=0?n[o]=t[o]:n[o]=e(t[o])):n[o]=void 0:n[o]=null;return n}(this.config[t][n]);return i.requestData=this._initRequestData(r,i),i.encode=this._initEncoder(i),i.decode=this._initDecoder(i),o&&(i.queryString.tjg_id=o),i}},{key:"_set",value:function(e){var t=e.key,n=e.value;if(!1!=!!t){var r=t.split(".");if(!(r.length<=0)){!function e(t,n,r,o){var i=n[r];"object"===Dn(t[i])?e(t[i],n,r+1,o):t[i]=o;}(this.config,r,0,n);}}}},{key:"_initConfig",value:function(){var e;this.config={},this.config.accessLayer=(e=this.tim,{create:null,query:{serverName:Zh.NAME.WEB_IM,cmd:Zh.CMD.ACCESS_LAYER,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:{platform:Xh,identifier:e.context.identifier,usersig:e.context.userSig,contentType:e.context.contentType,apn:null!==e.context?e.context.apn:1,websdkappid:Wh,v:zh},requestData:{}},update:null,delete:null}),this.config.login=function(e){return {create:null,query:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.LOGIN,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:{websdkappid:Wh,v:zh,platform:Xh,identifier:e.loginInfo.identifier,usersig:e.loginInfo.userSig,sdkappid:e.loginInfo.SDKAppID,accounttype:e.loginInfo.accountType,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:1,reqtime:+new Date/1e3},requestData:{state:"Online"},keyMaps:{request:{tinyID:"tinyId"},response:{TinyId:"tinyID"}}},update:null,delete:null}}(this.tim),this.config.logout=function(e){return {create:null,query:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.LOGOUT_ALL,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:{websdkappid:Wh,v:zh,platform:Xh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:"",sdkappid:null!==e.loginInfo?e.loginInfo.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:"",reqtime:+new Date/1e3},requestData:{}},update:null,delete:null}}(this.tim),this.config.longPollLogout=function(e){return {create:null,query:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.LOGOUT_LONG_POLL,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:{websdkappid:Wh,v:zh,platform:Xh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:1,reqtime:function(){return Date.now()}},requestData:{longPollID:""},keyMaps:{request:{longPollID:"LongPollingId"}}},update:null,delete:null}}(this.tim),this.config.profile=function(e){var t=N_(e),n=Zh.NAME.PROFILE,r=Zh.CHANNEL.XHR,o=Qh;return {query:{serverName:n,cmd:Zh.CMD.PORTRAIT_GET,channel:r,protocol:o,method:"POST",queryString:t,requestData:{fromAccount:"",userItem:[]},keyMaps:{request:{toAccount:"To_Account",standardSequence:"StandardSequence",customSequence:"CustomSequence"}}},update:{serverName:n,cmd:Zh.CMD.PORTRAIT_SET,channel:r,protocol:o,method:"POST",queryString:t,requestData:{fromAccount:"",profileItem:[{tag:rp.NICK,value:""},{tag:rp.GENDER,value:""},{tag:rp.ALLOWTYPE,value:""},{tag:rp.AVATAR,value:""}]}}}}(this.tim),this.config.group=function(e){var t={websdkappid:Wh,v:zh,platform:Xh,a2:null!==e.context&&e.context.a2Key?e.context.a2Key:void 0,tinyid:null!==e.context&&e.context.tinyID?e.context.tinyID:void 0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,accounttype:null!==e.context?e.context.accountType:0},n={request:{ownerID:"Owner_Account",userID:"Member_Account",newOwnerID:"NewOwner_Account",maxMemberNum:"MaxMemberCount",groupCustomField:"AppDefinedData",memberCustomField:"AppMemberDefinedData",groupCustomFieldFilter:"AppDefinedDataFilter_Group",memberCustomFieldFilter:"AppDefinedDataFilter_GroupMember",messageRemindType:"MsgFlag",userIDList:"MemberList",groupIDList:"GroupIdList",applyMessage:"ApplyMsg",muteTime:"ShutUpTime",muteAllMembers:"ShutUpAllMember",joinOption:"ApplyJoinOption"},response:{GroupIdList:"groups",MsgFlag:"messageRemindType",AppDefinedData:"groupCustomField",AppMemberDefinedData:"memberCustomField",AppDefinedDataFilter_Group:"groupCustomFieldFilter",AppDefinedDataFilter_GroupMember:"memberCustomFieldFilter",InfoSeq:"infoSequence",MemberList:"members",GroupInfo:"groups",ShutUpUntil:"muteUntil",ShutUpAllMember:"muteAllMembers",ApplyJoinOption:"joinOption"}};return {create:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.CREATE_GROUP,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{type:pn.GRP_PRIVATE,name:void 0,groupID:void 0,ownerID:e.loginInfo.identifier,introduction:void 0,notification:void 0,avatar:void 0,maxMemberNum:void 0,joinOption:void 0,memberList:void 0,groupCustomField:void 0},keyMaps:n},list:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.GET_JOINED_GROUPS,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{userID:e.loginInfo.identifier,limit:void 0,offset:void 0,groupType:void 0,responseFilter:void 0},keyMaps:n},query:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.GET_GROUP_INFO,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupIDList:void 0,responseFilter:void 0},keyMaps:n},getGroupMemberProfile:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.GET_GROUP_MEMBER_INFO,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0,userIDList:void 0,memberInfoFilter:void 0,memberCustomFieldFilter:void 0},keyMaps:{request:On({},n.request,{userIDList:"Member_List_Account"}),response:n.response}},getGroupMemberList:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.GET_GROUP_MEMBER_LIST,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0,limit:0,offset:0,memberRoleFilter:void 0,memberInfoFilter:void 0},keyMaps:n},quitGroup:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.QUIT_GROUP,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0}},changeGroupOwner:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.CHANGE_GROUP_OWNER,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0,newOwnerID:void 0},keyMaps:n},destroyGroup:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.DESTROY_GROUP,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0}},updateGroupProfile:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.MODIFY_GROUP_INFO,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0,name:void 0,introduction:void 0,notification:void 0,avatar:void 0,maxMemberNum:void 0,joinOption:void 0,groupCustomField:void 0,muteAllMembers:void 0},keyMaps:{request:On({},n.request,{groupCustomField:"AppDefinedData"}),response:n.response}},modifyGroupMemberInfo:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.MODIFY_GROUP_MEMBER_INFO,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0,userID:void 0,messageRemindType:void 0,nameCard:void 0,role:void 0,memberCustomField:void 0,muteTime:void 0},keyMaps:n},addGroupMember:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.ADD_GROUP_MEMBER,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0,silence:void 0,userIDList:void 0},keyMaps:n},deleteGroupMember:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.DELETE_GROUP_MEMBER,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0,userIDList:void 0,reason:void 0},keyMaps:{request:{userIDList:"MemberToDel_Account"}}},searchGroupByID:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.SEARCH_GROUP_BY_ID,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupIDList:void 0,responseFilter:{groupBasePublicInfoFilter:["Type","Name","Introduction","Notification","FaceUrl","CreateTime","Owner_Account","LastInfoTime","LastMsgTime","NextMsgSeq","MemberNum","MaxMemberNum","ApplyJoinOption"]}},keyMaps:{request:{groupIDList:"GroupIdList"}}},applyJoinGroup:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.APPLY_JOIN_GROUP,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0,applyMessage:void 0,userDefinedField:void 0},keyMaps:n},applyJoinAVChatRoom:{serverName:Zh.NAME.BIG_GROUP_NO_AUTH,cmd:Zh.CMD.APPLY_JOIN_GROUP,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:{websdkappid:Wh,v:zh,platform:Xh,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,accounttype:null!==e.context?e.context.accountType:0},requestData:{groupID:void 0,applyMessage:void 0,userDefinedField:void 0},keyMaps:n},handleApplyJoinGroup:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.HANDLE_APPLY_JOIN_GROUP,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{groupID:void 0,applicant:void 0,handleAction:void 0,handleMessage:void 0,authentication:void 0,messageKey:void 0,userDefinedField:void 0},keyMaps:{request:{applicant:"Applicant_Account",handleAction:"HandleMsg",handleMessage:"ApprovalMsg",messageKey:"MsgKey"},response:{MsgKey:"messageKey"}}},deleteGroupSystemNotice:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.DELETE_GROUP_SYSTEM_MESSAGE,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{messageListToDelete:void 0},keyMaps:{request:{messageListToDelete:"DelMsgList",messageSeq:"MsgSeq",messageRandom:"MsgRandom"}}},getGroupPendency:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.GET_GROUP_PENDENCY,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:t,requestData:{startTime:void 0,limit:void 0,handleAccount:void 0},keyMaps:{request:{handleAccount:"Handle_Account"}}}}}(this.tim),this.config.longPollID=function(e){return {create:{},query:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.GET_LONG_POLL_ID,channel:Zh.CHANNEL.XHR,protocol:Qh,queryString:{websdkappid:Wh,v:zh,platform:Xh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:1,reqtime:+new Date/1e3},requestData:{},keyMaps:{response:{LongPollingId:"longPollingID"}}},update:{},delete:{}}}(this.tim),this.config.longPoll=function(e){var t={websdkappid:Wh,v:zh,platform:Xh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,accounttype:null!==e.context?e.loginInfo.accountType:0,apn:null!==e.context?e.context.apn:1,reqtime:Math.ceil(+new Date/1e3)};return {create:{},query:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.LONG_POLL,channel:Zh.CHANNEL.AUTO,protocol:Qh,queryString:t,requestData:{timeout:null,cookie:{notifySeq:0,noticeSeq:0,longPollingID:0}},keyMaps:{response:{C2cMsgArray:"C2CMessageArray",GroupMsgArray:"groupMessageArray",GroupTips:"groupTips",C2cNotifyMsgArray:"C2CNotifyMessageArray",ClientSeq:"clientSequence",MsgPriority:"priority",NoticeSeq:"noticeSequence",MsgContent:"content",MsgType:"type",MsgBody:"elements",ToGroupId:"to",Desc:"description",Ext:"extension"}}},update:{},delete:{}}}(this.tim),this.config.applyC2C=function(e){var t=N_(e),n=Zh.NAME.FRIEND,r=Zh.CHANNEL.XHR,o=Qh;return {create:{serverName:n,cmd:Zh.CMD.FRIEND_ADD,channel:r,protocol:o,queryString:t,requestData:{fromAccount:"",addFriendItem:[]}},get:{serverName:n,cmd:Zh.CMD.GET_PENDENCY,channel:r,protocol:o,queryString:t,requestData:{fromAccount:"",pendencyType:"Pendency_Type_ComeIn"}},update:{serverName:n,cmd:Zh.CMD.RESPONSE_PENDENCY,channel:r,protocol:o,queryString:t,requestData:{fromAccount:"",responseFriendItem:[]}},delete:{serverName:n,cmd:Zh.CMD.DELETE_PENDENCY,channel:r,protocol:o,queryString:t,requestData:{fromAccount:"",toAccount:[],pendencyType:"Pendency_Type_ComeIn"}}}}(this.tim),this.config.friend=function(e){var t=N_(e),n=Zh.NAME.FRIEND,r=Zh.CHANNEL.XHR,o=Qh;return {get:{serverName:n,cmd:Zh.CMD.FRIEND_GET_ALL,channel:r,protocol:o,method:"POST",queryString:t,requestData:{fromAccount:"",timeStamp:0,tagList:[rp.NICK,"Tag_SNS_IM_Remark",rp.AVATAR]},keyMaps:{request:{},response:{}}},delete:{serverName:n,cmd:Zh.CMD.FRIEND_DELETE,channel:r,protocol:o,method:"POST",queryString:t,requestData:{fromAccount:"",toAccount:[],deleteType:"Delete_Type_Single"}}}}(this.tim),this.config.blacklist=function(e){var t=N_(e);return {create:{serverName:Zh.NAME.FRIEND,cmd:Zh.CMD.ADD_BLACKLIST,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{fromAccount:"",toAccount:[]}},get:{serverName:Zh.NAME.FRIEND,cmd:Zh.CMD.GET_BLACKLIST,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{fromAccount:"",startIndex:0,maxLimited:30,lastSequence:0}},delete:{serverName:Zh.NAME.FRIEND,cmd:Zh.CMD.DELETE_BLACKLIST,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{fromAccount:"",toAccount:[]}},update:{}}}(this.tim),this.config.c2cMessage=function(e){var t={platform:Xh,websdkappid:Wh,v:zh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:1,reqtime:function(){return +new Date}},n={request:{fromAccount:"From_Account",toAccount:"To_Account",msgTimeStamp:"MsgTimeStamp",msgSeq:"MsgSeq",msgRandom:"MsgRandom",msgBody:"MsgBody",count:"MaxCnt",lastMessageTime:"LastMsgTime",messageKey:"MsgKey",peerAccount:"Peer_Account",data:"Data",description:"Desc",extension:"Ext",type:"MsgType",content:"MsgContent",sizeType:"Type",uuid:"UUID",imageUrl:"URL",fileUrl:"Url",remoteAudioUrl:"Url",remoteVideoUrl:"VideoUrl",thumbUUID:"ThumbUUID",videoUUID:"VideoUUID",videoUrl:"",downloadFlag:"Download_Flag"},response:{MsgContent:"content",MsgTime:"time",Data:"data",Desc:"description",Ext:"extension",MsgKey:"messageKey",MsgType:"type",MsgBody:"elements",Download_Flag:"downloadFlag",ThumbUUID:"thumbUUID",VideoUUID:"videoUUID"}};return {create:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.SEND_MESSAGE,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{fromAccount:e.loginInfo.identifier,toAccount:"",msgTimeStamp:Math.ceil(+new Date/1e3),msgSeq:0,msgRandom:0,msgBody:[],msgLifeTime:void 0,offlinePushInfo:{pushFlag:0,title:"",desc:"",ext:"",apnsInfo:{badgeMode:0},androidInfo:{OPPOChannelID:""}}},keyMaps:n},query:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.GET_C2C_ROAM_MESSAGES,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{peerAccount:"",count:15,lastMessageTime:0,messageKey:"",withRecalledMsg:1},keyMaps:n},update:null,delete:null}}(this.tim),this.config.c2cMessageWillBeRevoked=function(e){var t={platform:Xh,websdkappid:Wh,v:zh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:1,reqtime:function(){return +new Date}};return {create:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.REVOKE_C2C_MESSAGE,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{msgInfo:{fromAccount:"",toAccount:"",msgTimeStamp:Math.ceil(+new Date/1e3),msgSeq:0,msgRandom:0}},keyMaps:{request:{msgInfo:"MsgInfo",fromAccount:"From_Account",toAccount:"To_Account",msgTimeStamp:"MsgTimeStamp",msgSeq:"MsgSeq",msgRandom:"MsgRandom",msgBody:"MsgBody"}}}}}(this.tim),this.config.groupMessage=function(e){var t={platform:Xh,websdkappid:Wh,v:zh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:1,reqtime:function(){return +new Date}},n={request:{to:"GroupId",extension:"Ext",data:"Data",description:"Desc",random:"Random",sequence:"ReqMsgSeq",count:"ReqMsgNumber",type:"MsgType",priority:"MsgPriority",content:"MsgContent",elements:"MsgBody",sizeType:"Type",uuid:"UUID",imageUrl:"URL",fileUrl:"Url",remoteAudioUrl:"Url",remoteVideoUrl:"VideoUrl",thumbUUID:"ThumbUUID",videoUUID:"VideoUUID",videoUrl:"",downloadFlag:"Download_Flag",clientSequence:"ClientSeq"},response:{Random:"random",MsgTime:"time",MsgSeq:"sequence",ReqMsgSeq:"sequence",RspMsgList:"messageList",IsPlaceMsg:"isPlaceMessage",IsSystemMsg:"isSystemMessage",ToGroupId:"to",EnumFrom_AccountType:"fromAccountType",EnumTo_AccountType:"toAccountType",GroupCode:"groupCode",MsgPriority:"priority",MsgBody:"elements",MsgType:"type",MsgContent:"content",IsFinished:"complete",Download_Flag:"downloadFlag",ClientSeq:"clientSequence",ThumbUUID:"thumbUUID",VideoUUID:"videoUUID"}};return {create:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.SEND_GROUP_MESSAGE,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{groupID:"",fromAccount:e.loginInfo.identifier,random:0,clientSequence:0,priority:"",msgBody:[],onlineOnlyFlag:0,offlinePushInfo:{pushFlag:0,title:"",desc:"",ext:"",apnsInfo:{badgeMode:0},androidInfo:{OPPOChannelID:""}}},keyMaps:n},query:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.GET_GROUP_ROAM_MESSAGES,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{withRecalledMsg:1,groupID:"",count:15,sequence:""},keyMaps:n},update:null,delete:null}}(this.tim),this.config.groupMessageWillBeRevoked=function(e){var t={platform:Xh,websdkappid:Wh,v:zh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:1,reqtime:function(){return +new Date}};return {create:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.REVOKE_GROUP_MESSAGE,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{to:"",msgSeqList:[]},keyMaps:{request:{to:"GroupId",msgSeqList:"MsgSeqList",msgSeq:"MsgSeq"}}}}}(this.tim),this.config.conversation=function(e){var t={platform:Xh,websdkappid:Wh,v:zh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:1};return {query:{serverName:Zh.NAME.RECENT_CONTACT,cmd:Zh.CMD.GET_CONVERSATION_LIST,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{fromAccount:e.loginInfo.identifier,count:0},keyMaps:{request:{},response:{SessionItem:"conversations",ToAccount:"groupID",To_Account:"userID",UnreadMsgCount:"unreadCount",MsgGroupReadedSeq:"messageReadSeq"}}},pagingQuery:{serverName:Zh.NAME.RECENT_CONTACT,cmd:Zh.CMD.PAGING_GET_CONVERSATION_LIST,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{fromAccount:void 0,timeStamp:void 0,orderType:void 0},keyMaps:{request:{},response:{SessionItem:"conversations",ToAccount:"groupID",To_Account:"userID",UnreadMsgCount:"unreadCount",MsgGroupReadedSeq:"messageReadSeq"}}},delete:{serverName:Zh.NAME.RECENT_CONTACT,cmd:Zh.CMD.DELETE_CONVERSATION,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{fromAccount:e.loginInfo.identifier,toAccount:void 0,type:1,toGroupID:void 0},keyMaps:{request:{toGroupID:"ToGroupid"}}},setC2CMessageRead:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.SET_C2C_MESSAGE_READ,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{C2CMsgReaded:void 0},keyMaps:{request:{lastMessageTime:"LastedMsgTime"}}},setGroupMessageRead:{serverName:Zh.NAME.GROUP,cmd:Zh.CMD.SET_GROUP_MESSAGE_READ,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{groupID:void 0,messageReadSeq:void 0},keyMaps:{request:{messageReadSeq:"MsgReadedSeq"}}}}}(this.tim),this.config.syncMessage=function(e){var t={platform:Xh,websdkappid:Wh,v:zh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:1,reqtime:function(){return [Math.ceil(+new Date),Math.random()].join("")}};return {create:null,query:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.GET_MESSAGES,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{cookie:"",syncFlag:0,needAbstract:1},keyMaps:{request:{fromAccount:"From_Account",toAccount:"To_Account",from:"From_Account",to:"To_Account",time:"MsgTimeStamp",sequence:"MsgSeq",random:"MsgRandom",elements:"MsgBody"},response:{MsgList:"messageList",SyncFlag:"syncFlag",To_Account:"to",From_Account:"from",ClientSeq:"clientSequence",MsgSeq:"sequence",NoticeSeq:"noticeSequence",NotifySeq:"notifySequence",MsgRandom:"random",MsgTimeStamp:"time",MsgContent:"content",ToGroupId:"groupID",MsgKey:"messageKey",GroupTips:"groupTips",MsgBody:"elements",MsgType:"type",C2CRemainingUnreadCount:"C2CRemainingUnreadList"}}},update:null,delete:null}}(this.tim),this.config.AVChatRoom=function(e){return {startLongPoll:{serverName:Zh.NAME.BIG_GROUP_LONG_POLLING_NO_AUTH,cmd:Zh.CMD.AVCHATROOM_LONG_POLL,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:{websdkappid:Wh,v:zh,platform:Xh,sdkappid:e.loginInfo.SDKAppID,accounttype:"792",apn:null!==e.context?e.context.apn:1,reqtime:function(){return +new Date}},requestData:{USP:1,startSeq:1,holdTime:90,key:void 0},keyMaps:{request:{USP:"USP"},response:{ToGroupId:"groupID",MsgPriority:"priority"}}}}}(this.tim),this.config.cosUpload=function(e){var t={platform:Xh,websdkappid:Wh,v:zh,a2:null!==e.context?e.context.a2Key:"",tinyid:null!==e.context?e.context.tinyID:0,sdkappid:null!==e.context?e.context.SDKAppID:0,contentType:null!==e.context?e.context.contentType:0,apn:null!==e.context?e.context.apn:1,reqtime:function(){return Date.now()}};return {create:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.FILE_UPLOAD,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{appVersion:"2.1",fromAccount:"",toAccount:"",sequence:0,time:function(){return Math.ceil(Date.now()/1e3)},random:function(){return wa()},fileStrMd5:"",fileSize:"",serverVer:1,authKey:"",busiId:1,pkgFlag:1,sliceOffset:0,sliceSize:0,sliceData:"",contentType:"application/x-www-form-urlencoded"},keyMaps:{request:{},response:{}}},update:null,delete:null}}(this.tim),this.config.cosSig=function(e){var t={sdkappid:function(){return e.loginInfo.SDKAppID},identifier:function(){return e.loginInfo.identifier},userSig:function(){return e.context.userSig}};return {create:null,query:{serverName:Zh.NAME.IM_COS_SIGN,cmd:Zh.CMD.COS_SIGN,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:t,requestData:{cmd:"open_im_cos_svc",subCmd:"get_cos_token",duration:300,version:2},keyMaps:{request:{userSig:"usersig",subCmd:"sub_cmd",cmd:"cmd",duration:"duration",version:"version"},response:{expired_time:"expiredTime",bucket_name:"bucketName",session_token:"sessionToken",tmp_secret_id:"secretId",tmp_secret_key:"secretKey"}}},update:null,delete:null}}(this.tim),this.config.bigDataHallwayAuthKey=function(e){return {create:null,query:{serverName:Zh.NAME.OPEN_IM,cmd:Zh.CMD.BIG_DATA_HALLWAY_AUTH_KEY,channel:Zh.CHANNEL.XHR,protocol:Qh,method:"POST",queryString:{websdkappid:Wh,v:zh,platform:Xh,sdkappid:e.loginInfo.SDKAppID,accounttype:"792",apn:null!==e.context?e.context.apn:1,reqtime:function(){return +new Date}},requestData:{}}}}(this.tim),this.config.ssoEventStat=function(e){var t={sdkappid:e.loginInfo.SDKAppID,reqtime:Math.ceil(+new Date/1e3)};return {create:{serverName:Zh.NAME.IM_OPEN_STAT,cmd:Zh.CMD.TIM_WEB_REPORT,channel:Zh.CHANNEL.AUTO,protocol:Qh,queryString:t,requestData:{table:"",report:[]},keyMaps:{request:{table:"table",report:"report",SDKAppID:"sdkappid",version:"version",tinyID:"tinyid",userID:"userid",platform:"platform",method:"method",time:"time",start:"start",end:"end",cost:"cost",status:"status",codeint:"codeint",message:"message",pointer:"pointer",text:"text",msgType:"msgtype",networkType:"networktype",startts:"startts",endts:"endts",timespan:"timespan"}}},query:{},update:{},delete:{}}}(this.tim),this.config.ssoSumStat=function(e){var t=null;null!==e.context&&(t={sdkappid:e.context.SDKAppID,reqtime:Math.ceil(+new Date/1e3)});return {create:{serverName:Zh.NAME.IM_OPEN_STAT,cmd:Zh.CMD.TIM_WEB_REPORT,channel:Zh.CHANNEL.AUTO,protocol:Qh,queryString:t,requestData:{table:"",report:[]},keyMaps:{request:{table:"table",report:"report",SDKAppID:"sdkappid",version:"version",tinyID:"tinyid",userID:"userid",item:"item",lpID:"lpid",platform:"platform",networkType:"networktype",total:"total",successRate:"successrate",avg:"avg",timespan:"timespan",time:"time"}}},query:{},update:{},delete:{}}}(this.tim);}},{key:"_initRequestData",value:function(e,t){if(void 0===e)return Jd(t.requestData,this._getRequestMap(t),this.tim);var n=t.requestData,r=Object.create(null);for(var o in n)if(Object.prototype.hasOwnProperty.call(n,o)){if(r[o]="function"==typeof n[o]?n[o]():n[o],void 0===e[o])continue;r[o]=e[o];}return r=Jd(r,this._getRequestMap(t),this.tim)}},{key:"_getRequestMap",value:function(e){if(e.keyMaps&&e.keyMaps.request&&Object.keys(e.keyMaps.request).length>0)return e.keyMaps.request}},{key:"_initEncoder",value:function(e){switch(e.protocol){case Qh:return function(e){if("string"===Dn(e))try{return JSON.parse(e)}catch(mC){return e}return e};case Jh:return function(e){return e};default:return function(e){return ca.warn("PackageConfig._initEncoder(), unknow response type, data: ",JSON.stringify(e)),e}}}},{key:"_initDecoder",value:function(e){switch(e.protocol){case Qh:return function(e){if("string"===Dn(e))try{return JSON.parse(e)}catch(mC){return e}return e};case Jh:return function(e){return e};default:return function(e){return ca.warn("PackageConfig._initDecoder(), unknow response type, data: ",e),e}}}}]),e}(),G_=Math.floor;Ae({target:"Number",stat:!0},{isInteger:function(e){return !m(e)&&isFinite(e)&&G_(e)===e}});var x_=function(){for(var e=[],t=U_(arguments),n=0;n<arguments.length;n++)Number.isInteger(arguments[n])?e.push(arguments[n]):e.push(!0==!!arguments[n]?"1":"0");return e.join(t)},U_=function(e){var t=e.length,n=e[t-1];if("string"!=typeof n)return "";if(n.length>1)return "";var r=e[t-1];return delete e[t-1],e.length-=t===e.length?1:0,r},q_={C2CMessageArray:1,groupMessageArray:1,groupTips:1,C2CNotifyMessageArray:1,profileModify:1,friendListMod:1},F_=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e))._initialization(),r}return An(n,[{key:"_initialization",value:function(){this._syncOffset="",this._syncNoticeList=[],this._syncEventArray=[],this._syncMessagesIsRunning=!1,this._syncMessagesFinished=!1,this._isLongPoll=!1,this._longPollID=0,this._noticeSequence=0,this._initializeListener(),this._runLoop=null,this._initShuntChannels();}},{key:"_initShuntChannels",value:function(){this._shuntChannels=Object.create(null),this._shuntChannels.C2CMessageArray=this._C2CMessageArrayChannel.bind(this),this._shuntChannels.groupMessageArray=this._groupMessageArrayChannel.bind(this),this._shuntChannels.groupTips=this._groupTipsChannel.bind(this),this._shuntChannels.C2CNotifyMessageArray=this._C2CNotifyMessageArrayChannel.bind(this),this._shuntChannels.profileModify=this._profileModifyChannel.bind(this),this._shuntChannels.friendListMod=this._friendListModChannel.bind(this);}},{key:"_C2CMessageArrayChannel",value:function(e,t,n){this.emitInnerEvent(Id,t);}},{key:"_groupMessageArrayChannel",value:function(e,t,n){this.emitInnerEvent(Md,t);}},{key:"_groupTipsChannel",value:function(e,t,n){var r=this;switch(e){case 4:case 6:this.emitInnerEvent(Sd,t);break;case 5:t.forEach((function(e){ga(e.elements.revokedInfos)?r.emitInnerEvent(wd,t):r.emitInnerEvent(Td,{groupSystemNotices:t,type:n});}));break;default:ca.log("NotificationController._groupTipsChannel unknown event=".concat(e," type=").concat(n),t);}}},{key:"_C2CNotifyMessageArrayChannel",value:function(e,t,n){this._isKickedoutNotice(t)?this.emitInnerEvent(Cd):this._isSysCmdMsgNotify(t)?this.emitInnerEvent(kd):this._isC2CMessageRevokedNotify(t)&&this.emitInnerEvent(Ad,t);}},{key:"_profileModifyChannel",value:function(e,t,n){this.emitInnerEvent(Dd,t);}},{key:"_friendListModChannel",value:function(e,t,n){this.emitInnerEvent(Ed,t);}},{key:"_dispatchNotice",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"poll";if(ga(e))for(var n=null,r=null,o="",i="",s="",a=0,u=0,c=e.length;u<c;u++)a=(n=e[u]).event,o=Object.keys(n).find((function(e){return void 0!==q_[e]})),ya(this._shuntChannels[o])?(r=n[o],"poll"===t&&this._updatenoticeSequence(r),this._shuntChannels[o](a,r,t)):("poll"===t&&this._updatenoticeSequence(),i="".concat(Ef),s="".concat(Lh,": ").concat(a,", ").concat(o),this.emitInnerEvent(xd,new Ip({code:i,message:s,data:{payloadName:o,event:a}})),i="",s="");}},{key:"getLongPollID",value:function(){return this._longPollID}},{key:"_IAmReady",value:function(){this.triggerReady();}},{key:"reset",value:function(){this._noticeSequence=0,this._resetSync(),this.closeNoticeChannel();}},{key:"_resetSync",value:function(){this._syncOffset="",this._syncNoticeList=[],this._syncEventArray=[],this._syncMessagesIsRunning=!1,this._syncMessagesFinished=!1;}},{key:"_setNoticeSeqInRequestData",value:function(e){e.Cookie.NoticeSeq=this._noticeSequence,this.tim.sumStatController.addTotalCount(dg);}},{key:"_updatenoticeSequence",value:function(e){if(e){var t=e[e.length-1].noticeSequence;t&&"number"==typeof t?t<=this._noticeSequence||(this._noticeSequence=t):this._noticeSequence++;}else this._noticeSequence++;}},{key:"_initializeListener",value:function(){var e=this.tim.innerEmitter;e.on(rd,this._startSyncMessages,this),e.on(Pd,this.closeNoticeChannel,this),e.on(vd,this._onFastStart,this);}},{key:"openNoticeChannel",value:function(){ca.log("NotificationController.openNoticeChannel"),this._getLongPollID();}},{key:"closeNoticeChannel",value:function(){ca.log("NotificationController.closeNoticeChannel"),(this._runLoop instanceof Uy||this._runLoop instanceof qy)&&(this._runLoop.abort(),this._runLoop.stop()),this._longPollID=0,this._isLongPoll=!1;}},{key:"_getLongPollID",value:function(){var e=this;if(0===this._longPollID){var t=new Mg;t.setMethod(pm).setStart(),this.request({name:"longPollID",action:"query"}).then((function(n){var r=n.data.longPollingID;e._onGetLongPollIDSuccess(r),t.setCode(0).setText("longPollingID=".concat(r)).setNetworkType(e.getNetworkType()).setEnd();})).catch((function(n){var r=new Ip({code:n.code||wf,message:n.message||Ph});e.emitInnerEvent(dd),e.emitInnerEvent(xd,r),e.probeNetwork().then((function(e){var n=Bn(e,2),o=n[0],i=n[1];t.setError(r,o,i).setEnd();}));}));}else this._onGetLongPollIDSuccess(this._longPollID);}},{key:"_onGetLongPollIDSuccess",value:function(e){this.emitInnerEvent(od,[{key:"long_poll_logout.query.requestData.longPollingID",value:e},{key:"longPoll.query.requestData.cookie.longPollingID",value:e}]),this._longPollID=e,this._startLongPoll(),this._IAmReady(),this.tim.sumStatController.recordLongPollingID(this._longPollID);}},{key:"_startLongPoll",value:function(){if(!0!==this._isLongPoll){ca.log("NotificationController._startLongPoll...");var e=this.tim.connectionController,t=this.createTransportCapsule({name:"longPoll",action:"query"});this._isLongPoll=!0,this._runLoop=e.createRunLoop({pack:t,before:this._setNoticeSeqInRequestData.bind(this),success:this._onNoticeReceived.bind(this),fail:this._onNoticeFail.bind(this)}),this._runLoop.start();}else ca.log("NotificationController._startLongPoll is running...");}},{key:"_onFastStart",value:function(){this.closeNoticeChannel(),this.syncMessage();}},{key:"_onNoticeReceived",value:function(e){var t=e.data;if(t.errorCode!==Lu.SUCCESS){var n=new Mg;n.setMethod(fm).setStart(),n.setMessage(t.errorInfo||JSON.stringify(t)).setCode(t.errorCode).setNetworkType(this.getNetworkType()).setEnd(!0),this._onResponseError(t);}else this.emitInnerEvent(md);this.tim.sumStatController.addSuccessCount(dg),this.tim.sumStatController.addCost(dg,t.timecost),e.data.eventArray&&this._dispatchNotice(e.data.eventArray);}},{key:"_onResponseError",value:function(e){switch(e.errorCode){case bf:ca.warn("NotificationController._onResponseError, longPollingID=".concat(this._longPollID," was kicked out")),this.emitInnerEvent(_d),this.closeNoticeChannel();break;case Rf:case Of:this.emitInnerEvent(Gd);break;default:ma(e.errorCode)||ma(e.errorInfo)?ca.log("NotificationController._onResponseError, errorCode or errorInfo undefined!",e):this.emitInnerEvent(xd,new Ip({code:e.errorCode,message:e.errorInfo}));}}},{key:"_onNoticeFail",value:function(e){if(e.error)if("ECONNABORTED"===e.error.code||e.error.code===_f)if(e.error.config){var t=e.error.config.url,n=e.error.config.data;ca.log("NotificationController._onNoticeFail request timed out. url=".concat(t," data=").concat(n));}else ca.log("NotificationController._onNoticeFail request timed out.");else ca.log("NotificationController._onNoticeFail request failed due to network error");this.emitInnerEvent(gd);}},{key:"_isKickedoutNotice",value:function(e){return !!e[0].hasOwnProperty("kickoutMsgNotify")}},{key:"_isSysCmdMsgNotify",value:function(e){if(!e[0])return !1;var t=e[0];return !!Object.prototype.hasOwnProperty.call(t,"sysCmdMsgNotify")}},{key:"_isC2CMessageRevokedNotify",value:function(e){var t=e[0];return !!Object.prototype.hasOwnProperty.call(t,"c2cMessageRevokedNotify")}},{key:"_startSyncMessages",value:function(e){!0!==this._syncMessagesFinished&&this.syncMessage();}},{key:"syncMessage",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this._syncMessagesIsRunning=!0,this.request({name:"syncMessage",action:"query",param:{cookie:t,syncFlag:n}}).then((function(t){var n=t.data;switch(x_(n.cookie,n.syncFlag)){case"00":case"01":e.emitInnerEvent(xd,{code:Df,message:Nh});break;case"10":case"11":n.eventArray&&e._dispatchNotice(n.eventArray,"sync"),e._syncNoticeList=e._syncNoticeList.concat(n.messageList),e.emitInnerEvent(id,{data:n.messageList,C2CRemainingUnreadList:n.C2CRemainingUnreadList}),e._syncOffset=n.cookie,e.syncMessage(n.cookie,n.syncFlag);break;case"12":n.eventArray&&e._dispatchNotice(n.eventArray,"sync"),e.openNoticeChannel(),e._syncNoticeList=e._syncNoticeList.concat(n.messageList),e.emitInnerEvent(sd,{messageList:n.messageList,C2CRemainingUnreadList:n.C2CRemainingUnreadList}),e._syncOffset=n.cookie,e._syncNoticeList=[],e._syncMessagesIsRunning=!1,e._syncMessagesFinished=!0;}})).catch((function(t){e._syncMessagesIsRunning=!1,ca.error("NotificationController.syncMessage failed. error:".concat(t));}));}}]),n}(og),j_=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e)).COSSDK=null,r._cosUploadMethod=null,r.expiredTimeLimit=300,r.appid=0,r.bucketName="",r.ciUrl="",r.directory="",r.downloadUrl="",r.uploadUrl="",r.expiredTimeOut=r.expiredTimeLimit,r.region="ap-shanghai",r.cos=null,r.cosOptions={secretId:"",secretKey:"",sessionToken:"",expiredTime:0},r._timer=0,r.tim.innerEmitter.on(rd,r._init,qn(r)),r.triggerReady(),r}return An(n,[{key:"_expiredTimer",value:function(){var e=this;this._timer=setInterval((function(){Math.ceil(Date.now()/1e3)>=e.cosOptions.expiredTime-60&&(e._getAuthorizationKey(),clearInterval(e._timer));}),3e4);}},{key:"_init",value:function(){var e=Rs?"cos-wx-sdk":"cos-js-sdk";this.COSSDK=this.tim.getPlugin(e),this.COSSDK?this._getAuthorizationKey():ca.warn("UploadController._init 没有检测到上传插件，将无法发送图片、音频、视频、文件等类型的消息。详细请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#registerPlugin");}},{key:"_getAuthorizationKey",value:function(){var e=this,t=Math.ceil(Date.now()/1e3),n=new Mg;n.setMethod(bg).setStart(),this.request({name:"cosSig",action:"query",param:{duration:this.expiredTimeLimit}}).then((function(r){ca.log("UploadController._getAuthorizationKey ok. data:",r.data);var o=r.data,i=o.expiredTime-t;n.setCode(0).setText("timeout=".concat(i,"s")).setNetworkType(e.getNetworkType()).setEnd(),e.appid=o.appid,e.bucketName=o.bucketName,e.ciUrl=o.ciUrl,e.directory=o.directory,e.downloadUrl=o.downloadUrl,e.uploadUrl=o.uploadUrl,e.expiredTimeOut=i,e.cosOptions={secretId:o.secretId,secretKey:o.secretKey,sessionToken:o.sessionToken,expiredTime:o.expiredTime},e._initUploaderMethod(),e._expiredTimer();})).catch((function(t){e.probeNetwork().then((function(n){var r=Bn(n,2),o=r[0],i=r[1];e.setError(t,o,i).setEnd();})),ca.warn("UploadController._getAuthorizationKey failed. error:",t);}));}},{key:"_initUploaderMethod",value:function(){var e=this;this.appid&&(this.cos=Rs?new this.COSSDK({ForcePathStyle:!0,getAuthorization:this._getAuthorization.bind(this)}):new this.COSSDK({getAuthorization:this._getAuthorization.bind(this)}),this._cosUploadMethod=Rs?function(t,n){e.cos.postObject(t,n);}:function(t,n){e.cos.uploadFiles(t,n);});}},{key:"_getAuthorization",value:function(e,t){t({TmpSecretId:this.cosOptions.secretId,TmpSecretKey:this.cosOptions.secretKey,XCosSecurityToken:this.cosOptions.sessionToken,ExpiredTime:this.cosOptions.expiredTime});}},{key:"uploadImage",value:function(e){if(!e.file)return pg(new Ip({code:Gp,message:Yf}));var t=this._checkImageType(e.file);if(!0!==t)return t;var n=this._checkImageMime(e.file);if(!0!==n)return n;var r=this._checkImageSize(e.file);return !0!==r?r:this.upload(e)}},{key:"_checkImageType",value:function(e){var t="";return t=Rs?e.url.slice(e.url.lastIndexOf(".")+1):e.files[0].name.slice(e.files[0].name.lastIndexOf(".")+1),xh.indexOf(t.toLowerCase())>=0||pg(new Ip({coe:xp,message:zf}))}},{key:"_checkImageMime",value:function(e){return !0}},{key:"_checkImageSize",value:function(e){var t=0;return 0===(t=Rs?e.size:e.files[0].size)?pg(new Ip({code:Lp,message:"".concat(Vf)})):t<20971520||pg(new Ip({coe:Up,message:"".concat(Wf)}))}},{key:"uploadFile",value:function(e){var t=null;return e.file?e.file.files[0].size>104857600?(t=new Ip({code:$p,message:rh}),pg(t)):0===e.file.files[0].size?(t=new Ip({code:Lp,message:"".concat(Vf)}),pg(t)):this.upload(e):(t=new Ip({code:Kp,message:nh}),pg(t))}},{key:"uploadVideo",value:function(e){return e.file.videoFile.size>104857600?pg(new Ip({code:Bp,message:"".concat(Zf)})):0===e.file.videoFile.size?pg(new Ip({code:Lp,message:"".concat(Vf)})):-1===Uh.indexOf(e.file.videoFile.type)?pg(new Ip({code:Hp,message:"".concat(eh)})):Rs?this.handleVideoUpload({file:e.file.videoFile}):bs?this.handleVideoUpload(e):void 0}},{key:"handleVideoUpload",value:function(e){var t=this;return new Promise((function(n,r){t.upload(e).then((function(e){n(e);})).catch((function(){t.upload(e).then((function(e){n(e);})).catch((function(){r(new Ip({code:jp,message:Qf}));}));}));}))}},{key:"uploadAudio",value:function(e){return e.file?e.file.size>20971520?pg(new Ip({code:Fp,message:"".concat(Jf)})):0===e.file.size?pg(new Ip({code:Lp,message:"".concat(Vf)})):this.upload(e):pg(new Ip({code:qp,message:Xf}))}},{key:"upload",value:function(e){var t=this;if(!ya(this._cosUploadMethod))return ca.warn("UploadController.upload 没有检测到上传插件，将无法发送图片、音频、视频、文件等类型的消息。详细请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#registerPlugin"),pg(new Ip({code:wp,message:qf}));var n=new Mg;n.setMethod(Rg).setStart(),ca.time(Ig);var r=Rs?e.file:e.file.files[0];return new Promise((function(o,i){var s=Rs?t._createCosOptionsWXMiniApp(e):t._createCosOptionsWeb(e),a=t;t._cosUploadMethod(s,(function(e,s){var u=Object.create(null);if(s){if(e||ga(s.files)&&s.files[0].error){var c=new Ip({code:Vp,message:th});return n.setError(c,!0,t.getNetworkType()).setEnd(),ca.log("UploadController.upload failed, error:",s.files[0].error),403===s.files[0].error.statusCode&&(ca.warn("UploadController.upload failed. cos AccessKeyId was invalid, regain auth key!"),t._getAuthorizationKey()),void i(c)}u.fileName=r.name,u.fileSize=r.size,u.fileType=r.type.slice(r.type.indexOf("/")+1).toLowerCase(),u.location=Rs?s.Location:s.files[0].data.Location;var l=ca.timeEnd(Ig),p=a._formatFileSize(r.size),f=a._formatSpeed(1e3*r.size/l),h="size=".concat(p,",time=").concat(l,"ms,speed=").concat(f);return ca.log("UploadController.upload success name=".concat(r.name,",").concat(h)),o(u),void n.setCode(0).setNetworkType(t.getNetworkType()).setText(h).setEnd()}var d=new Ip({code:Vp,message:th});n.setError(d,!0,a.getNetworkType()).setEnd(),ca.warn("UploadController.upload failed, error:",e),403===e.statusCode&&(ca.warn("UploadController.upload failed. cos AccessKeyId was invalid, regain auth key!"),t._getAuthorizationKey()),i(d);}));}))}},{key:"_formatFileSize",value:function(e){return e<1024?e+"B":e<1048576?Math.floor(e/1024)+"KB":Math.floor(e/1048576)+"MB"}},{key:"_formatSpeed",value:function(e){return e<=1048576?(e/1024).toFixed(1)+"KB/s":(e/1048576).toFixed(1)+"MB/s"}},{key:"_createCosOptionsWeb",value:function(e){var t=this.tim.context.identifier,n=this._genFileName(t,e.to,e.file.files[0].name);return {files:[{Bucket:"".concat(this.bucketName,"-").concat(this.appid),Region:this.region,Key:"".concat(this.directory,"/").concat(n),Body:e.file.files[0]}],SliceSize:1048576,onProgress:function(t){if("function"==typeof e.onProgress)try{e.onProgress(t.percent);}catch(n){ca.warn("onProgress callback error:"),ca.error(n);}},onFileFinish:function(e,t,n){}}}},{key:"_createCosOptionsWXMiniApp",value:function(e){var t=this.tim.context.identifier,n=this._genFileName(t,e.to,e.file.name),r=e.file.url;return {Bucket:"".concat(this.bucketName,"-").concat(this.appid),Region:this.region,Key:"".concat(this.directory,"/").concat(n),FilePath:r,onProgress:function(t){if(ca.log(JSON.stringify(t)),"function"==typeof e.onProgress)try{e.onProgress(t.percent);}catch(n){ca.warn("onProgress callback error:"),ca.error(n);}}}}},{key:"_genFileName",value:function(e,t,n){return "".concat(e,"-").concat(t,"-").concat(wa(99999),"-").concat(n)}},{key:"reset",value:function(){this._timer&&(clearInterval(this._timer),this._timer=0);}}]),n}(og),B_=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e)).FILETYPE={SOUND:2106,FILE:2107,VIDEO:2113},r._bdh_download_server="grouptalk.c2c.qq.com",r._BDHBizID=10001,r._authKey="",r._expireTime=0,r.tim.innerEmitter.on(rd,r._getAuthKey,qn(r)),r}return An(n,[{key:"_getAuthKey",value:function(){var e=this;this.request({name:"bigDataHallwayAuthKey",action:"query"}).then((function(t){t.data.authKey&&(e._authKey=t.data.authKey,e._expireTime=parseInt(t.data.expireTime));}));}},{key:"_isFromOlderVersion",value:function(e){return 2!==e.content.downloadFlag}},{key:"parseElements",value:function(e,t){if(!ga(e)||!t)return [];for(var n=[],r=null,o=0;o<e.length;o++)r=e[o],this._needParse(r)?n.push(this._parseElement(r,t)):n.push(e[o]);return n}},{key:"_needParse",value:function(e){return !(!this._isFromOlderVersion(e)||e.type!==pn.MSG_AUDIO&&e.type!==pn.MSG_FILE&&e.type!==pn.MSG_VIDEO)}},{key:"_parseElement",value:function(e,t){switch(e.type){case pn.MSG_AUDIO:return this._parseAudioElement(e,t);case pn.MSG_FILE:return this._parseFileElement(e,t);case pn.MSG_VIDEO:return this._parseVideoElement(e,t)}}},{key:"_parseAudioElement",value:function(e,t){return e.content.url=this._genAudioUrl(e.content.uuid,t),e}},{key:"_parseFileElement",value:function(e,t){return e.content.url=this._genFileUrl(e.content.uuid,t,e.content.fileName),e}},{key:"_parseVideoElement",value:function(e,t){return e.content.url=this._genVideoUrl(e.content.uuid,t),e}},{key:"_genAudioUrl",value:function(e,t){return ""===this._authKey?(ca.warn("BigDataHallwayController._genAudioUrl no authKey!"),""):"https://".concat(this._bdh_download_server,"/asn.com/stddownload_common_file?authkey=").concat(this._authKey,"&bid=").concat(this._BDHBizID,"&subbid=").concat(this.tim.context.SDKAppID,"&fileid=").concat(e,"&filetype=").concat(this.FILETYPE.SOUND,"&openid=").concat(t,"&ver=0")}},{key:"_genFileUrl",value:function(e,t,n){return ""===this._authKey?(ca.warn("BigDataHallwayController._genFileUrl no authKey!"),""):(n||(n="".concat(Math.floor(1e5*Math.random()),"-").concat(Date.now())),"https://".concat(this._bdh_download_server,"/asn.com/stddownload_common_file?authkey=").concat(this._authKey,"&bid=").concat(this._BDHBizID,"&subbid=").concat(this.tim.context.SDKAppID,"&fileid=").concat(e,"&filetype=").concat(this.FILETYPE.FILE,"&openid=").concat(t,"&ver=0&filename=").concat(encodeURIComponent(n)))}},{key:"_genVideoUrl",value:function(e,t){return ""===this._authKey?(ca.warn("BigDataHallwayController._genVideoUrl no authKey!"),""):"https://".concat(this._bdh_download_server,"/asn.com/stddownload_common_file?authkey=").concat(this._authKey,"&bid=").concat(this._BDHBizID,"&subbid=").concat(this.tim.context.SDKAppID,"&fileid=").concat(e,"&filetype=").concat(this.FILETYPE.VIDEO,"&openid=").concat(t,"&ver=0")}},{key:"reset",value:function(){this._authKey="",this.expireTime=0;}}]),n}(og),H_={app_id:"",event_id:"",api_base:"https://pingtas.qq.com/pingd",prefix:"_mta_",version:"1.3.9",stat_share_app:!1,stat_pull_down_fresh:!1,stat_reach_bottom:!1,stat_param:!0};function V_(){try{var e="s"+K_();return wx.setStorageSync(H_.prefix+"ssid",e),e}catch(t){}}function K_(e){for(var t=[0,1,2,3,4,5,6,7,8,9],n=10;1<n;n--){var r=Math.floor(10*Math.random()),o=t[r];t[r]=t[n-1],t[n-1]=o;}for(n=r=0;5>n;n++)r=10*r+t[n];return (e||"")+(r+"")+ +new Date}function $_(){try{var e=getCurrentPages(),t="/";return 0<e.length&&(t=e.pop().__route__),t}catch(n){console.log("get current page path error:"+n);}}function Y_(){var e,t={dm:"wechat.apps.xx",url:encodeURIComponent($_()+X_(J_.Data.pageQuery)),pvi:"",si:"",ty:0};return t.pvi=((e=function(){try{return wx.getStorageSync(H_.prefix+"auid")}catch(t){}}())||(e=function(){try{var t=K_();return wx.setStorageSync(H_.prefix+"auid",t),t}catch(e){}}(),t.ty=1),e),t.si=function(){var e=function(){try{return wx.getStorageSync(H_.prefix+"ssid")}catch(e){}}();return e||(e=V_()),e}(),t}function z_(){var e=function(){var e=wx.getSystemInfoSync();return {adt:encodeURIComponent(e.model),scl:e.pixelRatio,scr:e.windowWidth+"x"+e.windowHeight,lg:e.language,fl:e.version,jv:encodeURIComponent(e.system),tz:encodeURIComponent(e.platform)}}();return function(e){wx.getNetworkType({success:function(t){e(t.networkType);}});}((function(e){try{wx.setStorageSync(H_.prefix+"ntdata",e);}catch(t){}})),e.ct=wx.getStorageSync(H_.prefix+"ntdata")||"4g",e}function W_(){var e,t=J_.Data.userInfo,n=[];for(e in t)t.hasOwnProperty(e)&&n.push(e+"="+t[e]);return t=n.join(";"),{r2:H_.app_id,r4:"wx",ext:"v="+H_.version+(null!==t&&""!==t?";ui="+encodeURIComponent(t):"")}}function X_(e){if(!H_.stat_param||!e)return "";e=function(e){if(1>H_.ignore_params.length)return e;var t,n={};for(t in e)0<=H_.ignore_params.indexOf(t)||(n[t]=e[t]);return n}(e);var t,n=[];for(t in e)n.push(t+"="+e[t]);return 0<n.length?"?"+n.join("&"):""}var J_={App:{init:function(e){"appID"in e&&(H_.app_id=e.appID),"eventID"in e&&(H_.event_id=e.eventID),"statShareApp"in e&&(H_.stat_share_app=e.statShareApp),"statPullDownFresh"in e&&(H_.stat_pull_down_fresh=e.statPullDownFresh),"statReachBottom"in e&&(H_.stat_reach_bottom=e.statReachBottom),"ignoreParams"in e&&(H_.ignore_params=e.ignoreParams),"statParam"in e&&(H_.stat_param=e.statParam),V_();try{"lauchOpts"in e&&(J_.Data.lanchInfo=e.lauchOpts,J_.Data.lanchInfo.landing=1);}catch(t){}"autoReport"in e&&e.autoReport&&function(){var e=Page;Page=function(t){var n=t.onLoad;t.onLoad=function(e){n&&n.call(this,e),J_.Data.lastPageQuery=J_.Data.pageQuery,J_.Data.pageQuery=e,J_.Data.lastPageUrl=J_.Data.pageUrl,J_.Data.pageUrl=$_(),J_.Data.show=!1,J_.Page.init();},e(t);};}();}},Page:{init:function(){var e,t=getCurrentPages()[getCurrentPages().length-1];t.onShow&&(e=t.onShow,t.onShow=function(){if(!0===J_.Data.show){var t=J_.Data.lastPageQuery;J_.Data.lastPageQuery=J_.Data.pageQuery,J_.Data.pageQuery=t,J_.Data.lastPageUrl=J_.Data.pageUrl,J_.Data.pageUrl=$_();}J_.Data.show=!0,J_.Page.stat(),e.apply(this,arguments);}),H_.stat_pull_down_fresh&&t.onPullDownRefresh&&function(){var e=t.onPullDownRefresh;t.onPullDownRefresh=function(){J_.Event.stat(H_.prefix+"pulldownfresh",{url:t.__route__}),e.apply(this,arguments);};}(),H_.stat_reach_bottom&&t.onReachBottom&&function(){var e=t.onReachBottom;t.onReachBottom=function(){J_.Event.stat(H_.prefix+"reachbottom",{url:t.__route__}),e.apply(this,arguments);};}(),H_.stat_share_app&&t.onShareAppMessage&&function(){var e=t.onShareAppMessage;t.onShareAppMessage=function(){return J_.Event.stat(H_.prefix+"shareapp",{url:t.__route__}),e.apply(this,arguments)};}();},multiStat:function(e,t){if(1==t)J_.Page.stat(e);else {var n=getCurrentPages()[getCurrentPages().length-1];n.onShow&&function(){var t=n.onShow;n.onShow=function(){J_.Page.stat(e),t.call(this,arguments);};}();}},stat:function(e){if(""!=H_.app_id){var t=[],n=W_();if(e&&(n.r2=e),e=[Y_(),n,z_()],J_.Data.lanchInfo){e.push({ht:J_.Data.lanchInfo.scene}),J_.Data.pageQuery&&J_.Data.pageQuery._mta_ref_id&&e.push({rarg:J_.Data.pageQuery._mta_ref_id});try{1==J_.Data.lanchInfo.landing&&(n.ext+=";lp=1",J_.Data.lanchInfo.landing=0);}catch(i){}}e.push({rdm:"/",rurl:0>=J_.Data.lastPageUrl.length?J_.Data.pageUrl+X_(J_.Data.lastPageQuery):encodeURIComponent(J_.Data.lastPageUrl+X_(J_.Data.lastPageQuery))}),e.push({rand:+new Date}),n=0;for(var r=e.length;n<r;n++)for(var o in e[n])e[n].hasOwnProperty(o)&&t.push(o+"="+(void 0===e[n][o]?"":e[n][o]));wx.request({url:H_.api_base+"?"+t.join("&").toLowerCase()});}}},Event:{stat:function(e,t){if(""!=H_.event_id){var n=[],r=Y_(),o=W_();r.dm="wxapps.click",r.url=e,o.r2=H_.event_id;var i,s=void 0===t?{}:t,a=[];for(i in s)s.hasOwnProperty(i)&&a.push(encodeURIComponent(i)+"="+encodeURIComponent(s[i]));for(s=a.join(";"),o.r5=s,s=0,o=(r=[r,o,z_(),{rand:+new Date}]).length;s<o;s++)for(var u in r[s])r[s].hasOwnProperty(u)&&n.push(u+"="+(void 0===r[s][u]?"":r[s][u]));wx.request({url:H_.api_base+"?"+n.join("&").toLowerCase()});}}},Data:{userInfo:null,lanchInfo:null,pageQuery:null,lastPageQuery:null,pageUrl:"",lastPageUrl:"",show:!1}},Q_=J_,Z_=function(){function e(){kn(this,e),this.cache=[],this.MtaWX=null,this._init();}return An(e,[{key:"report",value:function(e,t){var n=this;try{bs?window.MtaH5?(window.MtaH5.clickStat(e,t),this.cache.forEach((function(e){var t=e.name,r=e.param;window.MtaH5.clickStat(t,r),n.cache.shift();}))):this.cache.push({name:e,param:t}):Rs&&(this.MtaWX?(this.MtaWX.Event.stat(e,t),this.cache.forEach((function(e){var t=e.name,r=e.param;n.MtaWX.stat(t,r),n.cache.shift();}))):this.cache.push({name:e,param:t}));}catch(mC){}}},{key:"stat",value:function(){try{bs&&window.MtaH5?window.MtaH5.pgv():Rs&&this.MtaWX&&this.MtaWX.Page.stat();}catch(mC){}}},{key:"_init",value:function(){try{if(bs){window._mtac={autoReport:0};var e=document.createElement("script"),t=La();e.src="".concat(t,"//pingjs.qq.com/h5/stats.js?v2.0.4"),e.setAttribute("name","MTAH5"),e.setAttribute("sid","500690998"),e.setAttribute("cid","500691017");var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n);}else Rs&&(this.MtaWX=Q_,this.MtaWX.App.init({appID:"500690995",eventID:"500691014",autoReport:!1,statParam:!0}));}catch(mC){}}}]),e}(),eC=function(e){Ln(n,e);var t=jn(n);function n(e){var r;kn(this,n),(r=t.call(this,e)).MTA=new Z_;var o=r.tim.innerEmitter;return o.on(Vd,r._stat,qn(r)),o.on(Hd,r._stat,qn(r)),r}return An(n,[{key:"_stat",value:function(){this.MTA.report("sdkappid",{value:this.tim.context.SDKAppID}),this.MTA.report("version",{value:gC.VERSION}),this.MTA.stat();}}]),n}(og),tC=function(){function e(t){kn(this,e),this._table="timwebii",this._report=[];}return An(e,[{key:"pushIn",value:function(e){ca.debug("SSOLogBody.pushIn",this._report.length,e),this._report.push(e);}},{key:"backfill",value:function(e){var t;ga(e)&&0!==e.length&&(ca.debug("SSOLogBody.backfill",this._report.length,e.length),(t=this._report).unshift.apply(t,Hn(e)));}},{key:"getLogsNumInMemory",value:function(){return this._report.length}},{key:"isEmpty",value:function(){return 0===this._report.length}},{key:"_reset",value:function(){this._report.length=0,this._report=[];}},{key:"getTable",value:function(){return this._table}},{key:"getLogsInMemory",value:function(){var e=this._report.slice();return this._reset(),e}}]),e}(),nC=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e)).TAG="im-ssolog-event",r._reportBody=new tC,r._version="2.6.6",r.MIN_THRESHOLD=20,r.MAX_THRESHOLD=100,r.WAITING_TIME=6e4,r.INTERVAL=2e4,r._timerID=0,r._resetLastReportTime(),r._startReportTimer(),r._retryCount=0,r.MAX_RETRY_COUNT=3,r.tim.innerEmitter.on(Ld,r._onLoginSuccess,qn(r)),r}return An(n,[{key:"reportAtOnce",value:function(){ca.debug("EventStatController.reportAtOnce"),this._report();}},{key:"_onLoginSuccess",value:function(){var e=this,t=this.tim.storage,n=t.getItem(this.TAG,!1);ja(n)||(ca.log("EventStatController._onLoginSuccess get ssolog in storage, nums="+n.length),n.forEach((function(t){e._reportBody.pushIn(t);})),t.removeItem(this.TAG,!1));}},{key:"pushIn",value:function(e){e instanceof Mg&&(e.setCommonInfo(this.tim.context.SDKAppID,this._version,this.tim.context.tinyID,this.tim.loginInfo.identifier,this.getPlatform()),this._reportBody.pushIn(e),this._reportBody.getLogsNumInMemory()>=this.MIN_THRESHOLD&&this._report());}},{key:"_resetLastReportTime",value:function(){this._lastReportTime=Date.now();}},{key:"_startReportTimer",value:function(){var e=this;this._timerID=setInterval((function(){Date.now()<e._lastReportTime+e.WAITING_TIME||e._reportBody.isEmpty()||e._report();}),this.INTERVAL);}},{key:"_stopReportTimer",value:function(){this._timerID>0&&(clearInterval(this._timerID),this._timerID=0);}},{key:"_report",value:function(){var e=this;if(!this._reportBody.isEmpty()){var t=this._reportBody.getLogsInMemory();this.request({name:"ssoEventStat",action:"create",param:{table:this._reportBody.getTable(),report:t}}).then((function(){e._resetLastReportTime(),e._retryCount>0&&(ca.debug("EventStatController.report retry success"),e._retryCount=0);})).catch((function(n){if(ca.warn("EventStatController.report, online:".concat(e.getNetworkType()," error:").concat(n)),e._reportBody.backfill(t),e._reportBody.getLogsNumInMemory()>e.MAX_THRESHOLD||e._retryCount===e.MAX_RETRY_COUNT||0===e._timerID)return e._retryCount=0,void e._flushAtOnce();e._retryCount+=1;}));}}},{key:"_flushAtOnce",value:function(){var e=this.tim.storage,t=e.getItem(this.TAG,!1),n=this._reportBody.getLogsInMemory();if(ja(t))ca.log("EventStatController._flushAtOnce nums="+n.length),e.setItem(this.TAG,n,!0,!1);else {var r=n.concat(t);r.length>this.MAX_THRESHOLD&&(r=r.slice(0,this.MAX_THRESHOLD)),ca.log("EventStatController._flushAtOnce nums="+r.length),e.setItem(this.TAG,r,!0,!1);}}},{key:"reset",value:function(){ca.log("EventStatController.reset"),this._stopReportTimer(),this._report();}}]),n}(og),rC="none",oC="online",iC=function(){function e(){kn(this,e),this._networkType="",this.maxWaitTime=3e3;}return An(e,[{key:"start",value:function(){var e=this;Rs?(wx.getNetworkType({success:function(t){e._networkType=t.networkType,t.networkType===rC?ca.warn("NetMonitor no network, please check!"):ca.info("NetMonitor networkType:".concat(t.networkType));}}),wx.onNetworkStatusChange(this._onWxNetworkStatusChange.bind(this))):this._networkType=oC;}},{key:"_onWxNetworkStatusChange",value:function(e){this._networkType=e.networkType,e.isConnected?ca.info("NetMonitor networkType:".concat(e.networkType)):ca.warn("NetMonitor no network, please check!");}},{key:"probe",value:function(){var e=this;return new Promise((function(t,n){if(Rs)wx.getNetworkType({success:function(n){e._networkType=n.networkType,n.networkType===rC?(ca.warn("NetMonitor no network, please check!"),t([!1,n.networkType])):(ca.info("NetMonitor networkType:".concat(n.networkType)),t([!0,n.networkType]));}});else if(window&&window.fetch)fetch("".concat(La(),"//webim-1252463788.file.myqcloud.com/assets/test/speed.xml?random=").concat(Math.random())).then((function(e){e.ok?t([!0,oC]):t([!1,rC]);})).catch((function(e){t([!1,rC]);}));else {var r=new XMLHttpRequest,o=setTimeout((function(){ca.warn("NetMonitor fetch timeout. Probably no network, please check!"),r.abort(),e._networkType=rC,t([!1,rC]);}),e.maxWaitTime);r.onreadystatechange=function(){4===r.readyState&&(clearTimeout(o),200===r.status||304===r.status?(this._networkType=oC,t([!0,oC])):(ca.warn("NetMonitor fetch status:".concat(r.status,". Probably no network, please check!")),this._networkType=rC,t([!1,rC])));},r.open("GET","".concat(La(),"//webim-1252463788.file.myqcloud.com/assets/test/speed.xml?random=").concat(Math.random())),r.send();}}))}},{key:"getNetworkType",value:function(){return this._networkType}},{key:"reset",value:function(){this._networkType="";}}]),e}(),sC=function(){function e(t){var n=this;kn(this,e),ga(t)?(this._map=new Map,t.forEach((function(e){n._map.set(e,[]);}))):ca.warn("AverageCalculator.constructor need keys");}return An(e,[{key:"push",value:function(e,t){return !(ma(e)||!this._map.has(e)||!pa(t))&&(this._map.get(e).push(t),!0)}},{key:"getSize",value:function(e){return ma(e)||!this._map.has(e)?-1:this._map.get(e).length}},{key:"getAvg",value:function(e){if(ma(e)||!this._map.has(e))return -1;var t=this._map.get(e),n=t.length;if(0===n)return 0;var r=0;return t.forEach((function(e){r+=e;})),t.length=0,this._map.set(e,[]),parseInt(r/n)}},{key:"getMax",value:function(e){return ma(e)||!this._map.has(e)?-1:Math.max.apply(null,this._map.get(e))}},{key:"getMin",value:function(e){return ma(e)||!this._map.has(e)?-1:Math.min.apply(null,this._map.get(e))}},{key:"reset",value:function(){this._map.forEach((function(e){e.length=0;}));}}]),e}(),aC=function(){function e(t){var n=this;kn(this,e),ga(t)?(this._map=new Map,t.forEach((function(e){n._map.set(e,{totalCount:0,successCount:0});}))):ca.warn("SuccessRateCalculator.constructor need keys");}return An(e,[{key:"addTotalCount",value:function(e){return !(ma(e)||!this._map.has(e))&&(this._map.get(e).totalCount+=1,!0)}},{key:"addSuccessCount",value:function(e){return !(ma(e)||!this._map.has(e))&&(this._map.get(e).successCount+=1,!0)}},{key:"getSuccessRate",value:function(e){if(ma(e)||!this._map.has(e))return -1;var t=this._map.get(e);if(0===t.totalCount)return 1;var n=parseFloat((t.successCount/t.totalCount).toFixed(2));return t.totalCount=t.successCount=0,n}},{key:"getTotalCount",value:function(e){return ma(e)||!this._map.has(e)?-1:this._map.get(e).totalCount}},{key:"reset",value:function(){this._map.forEach((function(e){e.totalCount=0,e.successCount=0;}));}}]),e}(),uC=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e)).TABLE="timwebsum",r.TAG="im-ssolog-sumstat",r._items=[dg,gg,mg,vg,yg],r._thresholdMap=new Map,r._thresholdMap.set(dg,100),r._thresholdMap.set(gg,150),r._thresholdMap.set(mg,15),r._thresholdMap.set(vg,50),r._thresholdMap.set(yg,50),r._lpID="",r._platform=r.getPlatform(),r._lastReportTime=0,r._statInfoArr=[],r._retryCount=0,r._avgCalc=new sC(r._items),r._successRateCalc=new aC(r._items),r.tim.innerEmitter.on(Ld,r._onLoginSuccess,qn(r)),r}return An(n,[{key:"_onLoginSuccess",value:function(){var e=this,t=this.tim.storage,n=t.getItem(this.TAG,!1);ja(n)||(ca.log("SumStatController._onLoginSuccess get sumstatlog in storage, nums="+n.length),n.forEach((function(t){e._statInfoArr.pushIn(t);})),t.removeItem(this.TAG,!1));}},{key:"recordLongPollingID",value:function(e){this._lpID=e;}},{key:"addTotalCount",value:function(e){this._successRateCalc.addTotalCount(e)?1===this._successRateCalc.getTotalCount(e)&&(this._lastReportTime=Date.now()):ca.warn("SumStatController.addTotalCount invalid key:",e);}},{key:"addSuccessCount",value:function(e){this._successRateCalc.addSuccessCount(e)||ca.warn("SumStatController.addSuccessCount invalid key:",e);}},{key:"addCost",value:function(e,t){this._avgCalc.push(e,t)?(ca.debug("SumStatController.addCost",e,t,this._avgCalc.getSize(e)),this._avgCalc.getSize(e)>=this._thresholdMap.get(e)&&this._report(e)):ca.warn("SumStatController.addCost invalid key or cost:",e,t);}},{key:"_getItemNum",value:function(e){switch(e){case dg:return 1;case gg:return 2;case mg:return 3;case vg:return 4;case yg:return 5;default:return 100}}},{key:"_getStatInfo",value:function(e){var t=null;return this._avgCalc.getSize(e)>0&&(t={SDKAppID:"".concat(this.tim.context.SDKAppID),version:"".concat("2.6.6"),tinyID:this.tim.context.tinyID,userID:this.tim.loginInfo.identifier,item:this._getItemNum(e),lpID:e===dg?this._lpID:"",platform:this._platform,networkType:this.getNetworkType(),total:this._successRateCalc.getTotalCount(e),successRate:this._successRateCalc.getSuccessRate(e),avg:this._avgCalc.getAvg(e),timespan:Date.now()-this._lastReportTime,time:Da()}),t}},{key:"_report",value:function(e){var t=this,n=[],r=null;ma(e)?this._items.forEach((function(e){null!==(r=t._getStatInfo(e))&&n.push(r);})):null!==(r=this._getStatInfo(e))&&n.push(r),ca.debug("SumStatController._report",n),this._statInfoArr.length>0&&(n=n.concat(this.statInfoArr),this._statInfoArr=[]),this._doReport(n);}},{key:"_doReport",value:function(e){var t=this;ja(e)?ca.warn("SumStatController._doReport statInfoArr is empty, do nothing"):this.request({name:"ssoSumStat",action:"create",param:{table:this.TABLE,report:e}}).then((function(){t._lastReportTime=Date.now(),t._retryCount>0&&(ca.debug("SumStatController._doReport retry success"),t._retryCount=0);})).catch((function(n){ca.warn("SumStatController._doReport, online:".concat(t.getNetworkType()," error:"),n,e),t._retryCount<=1?setTimeout((function(){ca.info("SumStatController._doReport retry",e),t._retryCount+=1,t._doReport(e);}),5e3):(t._retryCount=0,t._statInfoArr=t._statInfoArr.concat(e),t._flusgAtOnce());}));}},{key:"_flushAtOnce",value:function(){var e=this.tim.storage,t=e.getItem(this.TAG,!1),n=this._statInfoArr;if(ja(t))ca.log("SumStatController._flushAtOnce nums="+n.length),e.setItem(this.TAG,n,!0,!1);else {var r=n.concat(t);r.length>10&&(r=r.slice(0,10)),ca.log("SumStatController._flushAtOnce nums="+r.length),e.setItem(this.TAG,r,!0,!1);}this._statInfoArr=[];}},{key:"reset",value:function(){ca.info("SumStatController.reset"),this._report(),this._avgCalc.reset(),this._successRateCalc.reset();}}]),n}(og),cC=function(){function e(){kn(this,e),this._funcMap=new Map;}return An(e,[{key:"defense",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;if("string"!=typeof e)return null;if(0===e.length)return null;if("function"!=typeof t)return null;if(this._funcMap.has(e)&&this._funcMap.get(e).has(t))return this._funcMap.get(e).get(t);this._funcMap.has(e)||this._funcMap.set(e,new Map);var r=null;return this._funcMap.get(e).has(t)?r=this._funcMap.get(e).get(t):(r=this._pack(e,t,n),this._funcMap.get(e).set(t,r)),r}},{key:"defenseOnce",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;return "function"!=typeof t?null:this._pack(e,t,n)}},{key:"find",value:function(e,t){return "string"!=typeof e||0===e.length||"function"!=typeof t?null:this._funcMap.has(e)?this._funcMap.get(e).has(t)?this._funcMap.get(e).get(t):(ca.log("SafetyCallback.find: 找不到 func —— ".concat(e,"/").concat(""!==t.name?t.name:"[anonymous]")),null):(ca.log("SafetyCallback.find: 找不到 eventName-".concat(e," 对应的 func")),null)}},{key:"delete",value:function(e,t){return "function"==typeof t&&(!!this._funcMap.has(e)&&(!!this._funcMap.get(e).has(t)&&(this._funcMap.get(e).delete(t),0===this._funcMap.get(e).size&&this._funcMap.delete(e),!0)))}},{key:"_pack",value:function(e,t,n){return function(){try{t.apply(n,Array.from(arguments));}catch(o){var r=new Mg;r.setMethod(Sm).setText("eventName=".concat(e)).setStart(),r.setCode(0).setMessage(o.message).setEnd();}}}}]),e}(),lC=function(e){Ln(n,e);var t=jn(n);function n(e){var r;return kn(this,n),(r=t.call(this,e))._maybeLostSequencesMap=new Map,r}return An(n,[{key:"onMessageMaybeLost",value:function(e,t,n){this._maybeLostSequencesMap.has(e)||this._maybeLostSequencesMap.set(e,[]);for(var r=this._maybeLostSequencesMap.get(e),o=0;o<n;o++)r.push(t+o);ca.debug("MessageLossController.onMessageMaybeLost. maybeLostSequences:".concat(r));}},{key:"detectMessageLoss",value:function(e,t){var n=this._maybeLostSequencesMap.get(e);if(!ja(n)&&!ja(t)){var r=t.filter((function(e){return -1!==n.indexOf(e)}));if(ca.debug("MessageLossController.detectMessageLoss. matchedSequences:".concat(r)),n.length===r.length)ca.info("MessageLossController.detectMessageLoss no message loss. conversationID=".concat(e));else {var o,i=n.filter((function(e){return -1===r.indexOf(e)})),s=i.length;s<=5?o=e+"-"+i.join("-"):(i.sort((function(e,t){return e-t})),o=e+" start:"+i[0]+" end:"+i[s-1]+" count:"+s);var a=new Mg;a.setMethod(mm).setStart(),a.setCode(0).setText(o).setNetworkType(this.getNetworkType()).setEnd(),ca.warn("MessageLossController.detectMessageLoss message loss detected. conversationID:".concat(e," lostSequences:").concat(i));}n.length=0;}}},{key:"reset",value:function(){ca.log("MessageLossController.reset"),this._maybeLostSequencesMap.clear();}}]),n}(og),pC=function(){function e(t){kn(this,e);var n=new Mg;n.setMethod(Sg).setStart(),rg.mixin(this),this._initOptions(t),this._initMemberVariables(),this._initControllers(),this._initListener(),Mg.bindController(this.eventStatController),n.setCode(0).setText("mp=".concat(Rs,"-ua=").concat(Os)).setEnd(),ca.info("SDK inWxMiniApp:".concat(Rs,", SDKAppID:").concat(t.SDKAppID,", UserAgent:").concat(Os)),this._safetyCallbackFactory=new cC;}return An(e,[{key:"login",value:function(e){return ca.time(fg),this._ssoLog=new Mg,this._ssoLog.setMethod(Tg).setStart(),this.netMonitor.start(),this.loginInfo.identifier=e.identifier||e.userID,this.loginInfo.userSig=e.userSig,this.signController.login(this.loginInfo)}},{key:"logout",value:function(){var e=this.signController.logout();return this.resetSDK(),e}},{key:"on",value:function(e,t,n){e===ln.GROUP_SYSTEM_NOTICE_RECEIVED&&ca.warn("！！！TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED v2.6.0起弃用，为了更好的体验，请在 TIM.EVENT.MESSAGE_RECEIVED 事件回调内接收处理群系统通知，详细请参考：https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html#.GroupSystemNoticePayload"),ca.debug("on","eventName:".concat(e)),this.outerEmitter.on(e,this._safetyCallbackFactory.defense(e,t,n),n);}},{key:"once",value:function(e,t,n){ca.debug("once","eventName:".concat(e)),this.outerEmitter.once(e,this._safetyCallbackFactory.defenseOnce(e,t,n),n||this);}},{key:"off",value:function(e,t,n,r){ca.debug("off","eventName:".concat(e));var o=this._safetyCallbackFactory.find(e,t);null!==o&&(this.outerEmitter.off(e,o,n,r),this._safetyCallbackFactory.delete(e,t));}},{key:"registerPlugin",value:function(e){var t=this;this.plugins||(this.plugins={}),Object.keys(e).forEach((function(n){t.plugins[n]=e[n];}));var n=new Mg;n.setMethod(Ag).setStart(),n.setCode(0).setText("key=".concat(Object.keys(e))).setEnd();}},{key:"getPlugin",value:function(e){return this.plugins[e]||void 0}},{key:"setLogLevel",value:function(e){if(e<=0){console.log([""," ________  ______  __       __  __       __  ________  _______","|        \\|      \\|  \\     /  \\|  \\  _  |  \\|        \\|       \\"," \\$$$$$$$$ \\$$$$$$| $$\\   /  $$| $$ / \\ | $$| $$$$$$$$| $$$$$$$\\","   | $$     | $$  | $$$\\ /  $$$| $$/  $\\| $$| $$__    | $$__/ $$","   | $$     | $$  | $$$$\\  $$$$| $$  $$$\\ $$| $$  \\   | $$    $$","   | $$     | $$  | $$\\$$ $$ $$| $$ $$\\$$\\$$| $$$$$   | $$$$$$$\\","   | $$    _| $$_ | $$ \\$$$| $$| $$$$  \\$$$$| $$_____ | $$__/ $$","   | $$   |   $$ \\| $$  \\$ | $$| $$$    \\$$$| $$     \\| $$    $$","    \\$$    \\$$$$$$ \\$$      \\$$ \\$$      \\$$ \\$$$$$$$$ \\$$$$$$$","",""].join("\n")),console.log("%cIM 智能客服，随时随地解决您的问题 →_→ https://cloud.tencent.com/act/event/smarty-service?from=im-doc","color:#ff0000");console.log(["","参考以下文档，会更快解决问题哦！(#^.^#)\n","SDK 更新日志: https://cloud.tencent.com/document/product/269/38492\n","SDK 接口文档: https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html\n","常见问题: https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/tutorial-01-faq.html\n","反馈问题？戳我提 issue: https://github.com/tencentyun/TIMSDK/issues\n","如果您需要在生产环境关闭上面的日志，请 tim.setLogLevel(1)\n"].join("\n"));}ca.setLevel(e);}},{key:"downloadLog",value:function(){var e=document.createElement("a"),t=new Date,n=new Blob(this.getLog());e.download="TIM-"+t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+"-"+this.loginInfo.SDKAppID+"-"+this.context.identifier+".txt",e.href=URL.createObjectURL(n),e.click(),URL.revokeObjectURL(n);}},{key:"destroy",value:function(){this.logout(),this.outerEmitter.emit(ln.SDK_DESTROY,{SDKAppID:this.loginInfo.SDKAppID});}},{key:"createTextMessage",value:function(e){return this.messageController.createTextMessage(e)}},{key:"createImageMessage",value:function(e){return this.messageController.createImageMessage(e)}},{key:"createAudioMessage",value:function(e){return this.messageController.createAudioMessage(e)}},{key:"createVideoMessage",value:function(e){return this.messageController.createVideoMessage(e)}},{key:"createCustomMessage",value:function(e){return this.messageController.createCustomMessage(e)}},{key:"createFaceMessage",value:function(e){return this.messageController.createFaceMessage(e)}},{key:"createFileMessage",value:function(e){return this.messageController.createFileMessage(e)}},{key:"sendMessage",value:function(e,t){return e instanceof Vh?this.messageController.sendMessageInstance(e,t):pg(new Ip({code:Rp,message:Bf}))}},{key:"revokeMessage",value:function(e){return this.messageController.revokeMessage(e)}},{key:"resendMessage",value:function(e){return this.messageController.resendMessage(e)}},{key:"getMessageList",value:function(e){return this.messageController.getMessageList(e)}},{key:"setMessageRead",value:function(e){return this.messageController.setMessageRead(e)}},{key:"getConversationList",value:function(){return this.conversationController.getConversationList()}},{key:"getConversationProfile",value:function(e){return this.conversationController.getConversationProfile(e)}},{key:"deleteConversation",value:function(e){return this.conversationController.deleteConversation(e)}},{key:"getMyProfile",value:function(){return this.userController.getMyProfile()}},{key:"getUserProfile",value:function(e){return this.userController.getUserProfile(e)}},{key:"updateMyProfile",value:function(e){return this.userController.updateMyProfile(e)}},{key:"getFriendList",value:function(){return this.userController.getFriendList()}},{key:"deleteFriend",value:function(e){return this.userController.deleteFriend(e)}},{key:"getBlacklist",value:function(){return this.userController.getBlacklist()}},{key:"addToBlacklist",value:function(e){return this.userController.addBlacklist(e)}},{key:"removeFromBlacklist",value:function(e){return this.userController.deleteBlacklist(e)}},{key:"getGroupList",value:function(e){return this.groupController.getGroupList(e)}},{key:"getGroupProfile",value:function(e){return this.groupController.getGroupProfile(e)}},{key:"createGroup",value:function(e){return this.groupController.createGroup(e)}},{key:"dismissGroup",value:function(e){return this.groupController.dismissGroup(e)}},{key:"updateGroupProfile",value:function(e){return this.groupController.updateGroupProfile(e)}},{key:"joinGroup",value:function(e){return this.groupController.joinGroup(e)}},{key:"quitGroup",value:function(e){return this.groupController.quitGroup(e)}},{key:"searchGroupByID",value:function(e){return this.groupController.searchGroupByID(e)}},{key:"changeGroupOwner",value:function(e){return this.groupController.changeGroupOwner(e)}},{key:"handleGroupApplication",value:function(e){return this.groupController.handleGroupApplication(e)}},{key:"setMessageRemindType",value:function(e){return this.groupController.setMessageRemindType(e)}},{key:"getGroupMemberList",value:function(e){return this.groupController.getGroupMemberList(e)}},{key:"getGroupMemberProfile",value:function(e){return this.groupController.getGroupMemberProfile(e)}},{key:"addGroupMember",value:function(e){return this.groupController.addGroupMember(e)}},{key:"deleteGroupMember",value:function(e){return this.groupController.deleteGroupMember(e)}},{key:"setGroupMemberMuteTime",value:function(e){return this.groupController.setGroupMemberMuteTime(e)}},{key:"setGroupMemberRole",value:function(e){return this.groupController.setGroupMemberRole(e)}},{key:"setGroupMemberNameCard",value:function(e){return this.groupController.setGroupMemberNameCard(e)}},{key:"setGroupMemberCustomField",value:function(e){return this.groupController.setGroupMemberCustomField(e)}},{key:"_initOptions",value:function(e){this.plugins={};var t=e.SDKAppID||0,n=wa();this.context={SDKAppID:t,accountType:n},this.loginInfo={SDKAppID:t,accountType:n,identifier:null,userSig:null},this.options={runLoopNetType:e.runLoopNetType||ep,enablePointer:e.enablePointer||!1};}},{key:"_initMemberVariables",value:function(){this.innerEmitter=new L_,this.outerEmitter=new L_,cg(this.outerEmitter),this.packageConfig=new P_(this),this.storage=new O_(this),this.netMonitor=new iC,this.outerEmitter._emit=this.outerEmitter.emit,this.outerEmitter.emit=function(e,t){var n=arguments[0],r=[n,{name:arguments[0],data:arguments[1]}];ca.debug("emit outer event:".concat(n),r[1]),this.outerEmitter._emit.apply(this.outerEmitter,r);}.bind(this),this.innerEmitter._emit=this.innerEmitter.emit,this.innerEmitter.emit=function(e,t){var n;da(arguments[1])&&arguments[1].data?(ca.warn("inner eventData has data property, please check!"),n=[e,{name:arguments[0],data:arguments[1].data}]):n=[e,{name:arguments[0],data:arguments[1]}],ca.debug("emit inner event:".concat(e),n[1]),this.innerEmitter._emit.apply(this.innerEmitter,n);}.bind(this);}},{key:"_initControllers",value:function(){this.exceptionController=new jy(this),this.connectionController=new Fy(this),this.contextController=new sg(this),this.context=this.contextController.getContext(),this.signController=new Em(this),this.messageController=new S_(this),this.conversationController=new s_(this),this.userController=new Xy(this),this.groupController=new A_(this),this.notificationController=new F_(this),this.bigDataHallwayController=new B_(this),this.statusController=new b_(this),this.uploadController=new j_(this),this.messageLossController=new lC(this),this.eventStatController=new nC(this),this.sumStatController=new uC(this),this.mtaReportController=new eC(this),this._initReadyListener();}},{key:"_initListener",value:function(){var e=this;if(this.innerEmitter.on(yd,this._onSlowStart,this),Rs&&"function"==typeof wx.onAppShow&&"function"==typeof wx.onAppHide){var t=null;wx.onAppHide((function(){(t=new Mg).setMethod(Mm).setStart();})),wx.onAppShow((function(){null!==t&&t.setCode(0).setNetworkType(e.netMonitor.getNetworkType()).setEnd();}));}}},{key:"_initReadyListener",value:function(){for(var e=this,t=this.readyList,n=0,r=t.length;n<r;n++)this[t[n]].ready((function(){return e._readyHandle()}));}},{key:"_onSlowStart",value:function(){ca.log("slow start longpolling..."),this.resetSDK(),this.login(this.loginInfo);}},{key:"resetSDK",value:function(){var e=this;this.initList.forEach((function(t){e[t].reset&&e[t].reset();})),this.netMonitor.reset(),this.storage.reset(),this.resetReady(),this._initReadyListener(),this.outerEmitter.emit(ln.SDK_NOT_READY);}},{key:"_readyHandle",value:function(){for(var e=this.readyList,t=!0,n=0,r=e.length;n<r;n++)if(!this[e[n]].isReady()){t=!1;break}if(t){var o=ca.timeEnd(fg);ca.warn("SDK is ready. cost=".concat(o,"ms")),this.triggerReady(),this.innerEmitter.emit(Vd),this.outerEmitter.emit(ln.SDK_READY),this._ssoLog.setCode(0).setNetworkType(this.netMonitor.getNetworkType()).setText(o).setEnd();}}}]),e}();pC.prototype.readyList=["conversationController"],pC.prototype.initList=["exceptionController","connectionController","signController","contextController","messageController","conversationController","userController","groupController","notificationController","eventStatController","sumStatController","messageLossController","statusController"];var fC={login:"login",on:"on",off:"off",ready:"ready",setLogLevel:"setLogLevel",joinGroup:"joinGroup",quitGroup:"quitGroup",registerPlugin:"registerPlugin"};function hC(e,t){return !(!e.isReady()&&void 0===fC[t])||(e.innerEmitter.emit(xd,new Ip({code:Af,message:"".concat(t," ").concat(Gh,"，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/module-EVENT.html#.SDK_READY")})),!1)}var dC={},gC={};return gC.create=function(e){if(e.SDKAppID&&dC[e.SDKAppID])return dC[e.SDKAppID];ca.log("TIM.create");var t=new pC(e);t.on(ln.SDK_DESTROY,(function(e){dC[e.data.SDKAppID]=null,delete dC[e.data.SDKAppID];}));var n=function(e){var t=Object.create(null);return Object.keys(Yh).forEach((function(n){if(e[n]){var r=Yh[n],o=new Yn;t[r]=function(){var t=Array.from(arguments);return o.use((function(t,r){if(hC(e,n))return r()})).use((function(e,t){if(!0===Ba(e,$h[n],r))return t()})).use((function(t,r){return e[n].apply(e,t)})),o.run(t)};}})),t}(t);return dC[e.SDKAppID]=n,ca.log("TIM.create ok"),n},gC.TYPES=pn,gC.EVENT=ln,gC.VERSION="2.6.6",ca.log("TIM.VERSION: ".concat(gC.VERSION)),gC}));
	});

	/**
	 * 类型常量， 消息类型、会话类型...
	 *
	 */

	/**
	 * SDK 中的类型常量。
	 * @memberof SDK
	 * @exports TYPES
	 * @module TYPES
	 */
	var TYPES = {
	  /**
	   * @description 群消息高优先级。建议选择该优先级的消息类型：红包消息和礼物消息
	   * @memberof module:TYPES
	   */
	  MSG_PRIORITY_HIGH: 'High',

	  /**
	   * @description 群消息普通优先级。建议选择该优先级的消息类型：普通文本消息
	   * @memberof module:TYPES
	   */
	  MSG_PRIORITY_NORMAL: 'Normal',

	  /**
	   * @description 群消息低优先级。建议选择该优先级的消息类型：点赞消息
	   * @memberof module:TYPES
	   */
	  MSG_PRIORITY_LOW: 'Low',

	  /**
	   * @description 群消息最低优先级。建议选择该优先级的消息类型：最不重要的消息
	   * @memberof module:TYPES
	   */
	  MSG_PRIORITY_LOWEST: 'Lowest',

	  /**
	   * @description 被踢类型：多账号登录被踢
	   * @memberOf module:TYPES
	   */
	  KICKED_OUT_MULT_ACCOUNT: 'multipleAccount',

	  /**
	   * @description 被踢类型：多终端登录被踢
	   * @memberOf module:TYPES
	   */
	  KICKED_OUT_MULT_DEVICE: 'multipleDevice',

	  /**
	   * @description 被踢类型：签名过期
	   * @memberOf module:TYPES
	   */
	  KICKED_OUT_USERSIG_EXPIRED: 'userSigExpired',

	  /**
	   * @description 网络状态：已接入网络
	   * @memberOf module:TYPES
	   */
	  NET_STATE_CONNECTED: 'connected',

	  /**
	   * @description 网络状态：连接中
	   * @memberOf module:TYPES
	   */
	  NET_STATE_CONNECTING: 'connecting',

	  /**
	   * @description 网络状态：未接入网络
	   * @memberOf module:TYPES
	   */
	  NET_STATE_DISCONNECTED: 'disconnected',

	  /**
	   * @description 加入直播间成功
	   * @memberOf module:TYPES
	   */
	  ENTER_ROOM_SUCCESS: 'JoinedSuccess',

	  /**
	   * @description 已在直播间内
	   * @memberOf module:TYPES
	   */
	  ALREADY_IN_ROOM: 'AlreadyInGroup'
	};

	/**
	 * 封装 MTA SDK，兼容 Web 和 小程序
	 * {@link https://mta.qq.com/docs/h5.html MTA Web接入}
	 * @class MTA
	 * @author rychouwei
	 */

	var MTA = /*#__PURE__*/function () {
	  function MTA() {
	    _classCallCheck(this, MTA);

	    this.cache = []; // 缓存队列。Web端的MTA是异步加载的，若 MTA 没加载完成，触发了 report，则先进入缓存队列。下次 report 时再上报。

	    this._init();
	  }
	  /**
	   * 手动上报事件，具体配置参考
	   * {@link https://mta.qq.com/h5/visitor/ctr_custom_param_config?custom_id=246778&app_id=500690998 Web}
	   * {@link https://mta.qq.com/wechat_mini/custom/ctr_custom_param_config?app_id=500690995&custom_id=246775 小程序}
	   * @param {String} name
	   * @param {Object} param
	   * @memberof MTA
	   * @example
	   * tim.mta.report('sendmessage', { send: true })
	   */


	  _createClass(MTA, [{
	    key: "report",
	    value: function report(name, param) {
	      var _this = this;

	      try {
	        // Web
	        if (IN_BROWSER) {
	          if (window.MtaH5) {
	            window.MtaH5.clickStat(name, param); // 上报缓存队列的事件

	            this.cache.forEach(function (_ref) {
	              var name = _ref.name,
	                  param = _ref.param;
	              window.MtaH5.clickStat(name, param);

	              _this.cache.shift();
	            });
	          } else {
	            // 将事件缓存
	            this.cache.push({
	              name: name,
	              param: param
	            });
	          }
	        }
	      } catch (error) {} // 拦截错误即可，不做处理

	    }
	    /**
	     * 统计上报，统计PV等数据
	     * @memberof MTA
	     */

	  }, {
	    key: "stat",
	    value: function stat() {
	      try {
	        if (IN_BROWSER && window.MtaH5) {
	          window.MtaH5.pgv();
	        }
	      } catch (error) {} // 拦截错误即可，不做处理

	    }
	    /**
	     * 初始化
	     * @private
	     * @memberof MTA
	     */

	  }, {
	    key: "_init",
	    value: function _init() {
	      try {
	        if (IN_BROWSER) {
	          window._mtac = {
	            autoReport: 0
	          };
	          var mta = document.createElement('script');
	          var proto = getPageProtocol();
	          mta.src = "".concat(proto, "//pingjs.qq.com/h5/stats.js?v2.0.4");
	          mta.setAttribute('name', 'MTAH5');
	          mta.setAttribute('sid', '500720070');
	          mta.setAttribute('cid', '500720078');
	          var s = document.getElementsByTagName('script')[0];
	          s.parentNode.insertBefore(mta, s);
	        }
	      } catch (error) {}
	    }
	  }]);

	  return MTA;
	}();

	/**
	 * @description 腾讯云 Web 直播组件入口类。<br/>
	 * 接入前，您需要在 [云通信控制台]{@link https://console.cloud.tencent.com/avc} 中创建一个云通信应用，并取得 `SDKAppID`。<br/>
	 * @param {Object} options 配置
	 * @param {Number} options.SDKAppID - 云通信应用的 `SDKAppID`
	 * @param {String} options.domID - 播放器容器 ID
	 * @param {String} options.m3u8 - 原画 M3U8 播放 URL
	 * @param {String} options.flv - 原画 FLV 播放 URL
	 * @example
	 * <div id="id_test_video" style="width:100%; height:auto;"></div>
	 * <script>
	 * let options = {
	 *   SDKAppID: 0 // 接入时需要将0替换为您的云通信应用的 SDKAppID
	 *   domID: "id_test_video",
	 *   m3u8: "http://200002949.vod.myqcloud.com/200002949_b6ffc.f0.m3u8",//请替换成实际可用的播放地址
	 *   flv: "http://200002949.vod.myqcloud.com/200002949_b6ffc.f0.flv"
	 * };
	 * let tweblive = new TWebLive(options);
	 * </script>
	 * @returns {Object} SDK 实例
	 */

	var TWebLive = /*#__PURE__*/function () {
	  function TWebLive(config) {
	    _classCallCheck(this, TWebLive);

	    logger.info("TWebLive version:".concat(version$1));

	    if (isEmpty(config)) {
	      logger.error('TWebLive config is empty!');
	      return;
	    }

	    this._outerEmitter = new EventEmitter();
	    this._outerEmitter._emit = this._outerEmitter.emit;

	    this._outerEmitter.emit = function (eventName, eventData) {
	      var _eventName = arguments[0];
	      var args = [_eventName, {
	        name: arguments[0],
	        data: arguments[1]
	      }];

	      this._outerEmitter._emit.apply(this._outerEmitter, args);
	    }.bind(this);

	    logger.log("TWebLive config:".concat(JSON.stringify(config))); // create player

	    this._player = new TcPlayerModule2_3_2_1(config.domID, _objectSpread2({
	      listener: this._playerListener.bind(this),
	      flash: false,
	      live: true,
	      h5_flv: true
	    }, config)); // create im

	    if (config.SDKAppID) {
	      this._imSDKAppID = config.SDKAppID;
	      this._tim = timJs.create({
	        SDKAppID: config.SDKAppID
	      });

	      this._initListeners();
	    } else {
	      logger.error('TWebLive cannot create IM without SDKAppID');
	    }

	    this._safetyCallbackFactory = new SafetyCallback();
	    this._MTA = new MTA();
	    this._isAnonymousUser = true; // 登录前都认为是匿名用户
	  }

	  _createClass(TWebLive, [{
	    key: "_initListeners",
	    value: function _initListeners() {
	      // im ready
	      this._tim.on(timJs.EVENT.SDK_READY, this._onIMReady, this); // im not ready


	      this._tim.on(timJs.EVENT.SDK_NOT_READY, this._onIMNotReady, this); // message received


	      this._tim.on(timJs.EVENT.MESSAGE_RECEIVED, this._onMessageReceived, this); // kicked out


	      this._tim.on(timJs.EVENT.KICKED_OUT, this._onKickedOut, this); // netstate change


	      this._tim.on(timJs.EVENT.NET_STATE_CHANGE, this._onNetStateChange, this);
	    }
	  }, {
	    key: "_playerListener",
	    value: function _playerListener(event) {
	      logger.debug('TWebLive._playerListener', event.type);

	      switch (event.type) {
	        case 'ended':
	          this._outerEmitter.emit(EVENT.ENDED);

	          break;

	        case 'error':
	          this._outerEmitter.emit(EVENT.ERROR, event.detail);

	          break;

	        case 'play': // fall through

	        case 'playing':
	          this._outerEmitter.emit(EVENT.PLAYING);

	          break;

	        case 'pause':
	          this._outerEmitter.emit(EVENT.PAUSE);

	          break;

	        case 'waiting':
	          this._outerEmitter.emit(EVENT.WAITING);

	          break;

	        case 'timeupdate':
	          this._outerEmitter.emit(EVENT.TIMEUPDATE, event.ts);

	          break;
	      }
	    }
	  }, {
	    key: "_stat",
	    value: function _stat() {
	      // 统计 SDKAppID
	      this._MTA.report('sdkappid', {
	        value: this._imSDKAppID
	      }); // 统计组件版本号


	      this._MTA.report('tweblive_version', {
	        value: version$1
	      }); // 统计是否匿名用户加入直播间


	      this._MTA.report('is_anonymous_user', {
	        value: this._isAnonymousUser ? 1 : 0
	      }); // 统计 PV


	      this._MTA.stat();
	    }
	  }, {
	    key: "_onIMReady",
	    value: function _onIMReady(event) {
	      // im ready时统计 sdkappid version pv
	      this._stat();

	      this._outerEmitter.emit(EVENT.IM_READY);
	    }
	  }, {
	    key: "_onIMNotReady",
	    value: function _onIMNotReady(event) {
	      this._outerEmitter.emit(EVENT.IM_NOT_READY);
	    }
	  }, {
	    key: "_onMessageReceived",
	    value: function _onMessageReceived(event) {
	      var messages = event.data;
	      var textMessages = messages.filter(function (message) {
	        return message.type === timJs.TYPES.MSG_TEXT;
	      });

	      if (!isEmpty(textMessages)) {
	        this._outerEmitter.emit(EVENT.TEXT_MESSAGE_RECEIVED, textMessages);
	      }

	      var customMessages = messages.filter(function (message) {
	        return message.type === timJs.TYPES.MSG_CUSTOM;
	      });

	      if (!isEmpty(customMessages)) {
	        this._outerEmitter.emit(EVENT.CUSTOM_MESSAGE_RECEIVED, customMessages);
	      }

	      var remoteUserJoinTips = messages.filter(function (message) {
	        return message.type === timJs.TYPES.MSG_GRP_TIP && message.payload.operationType === timJs.TYPES.GRP_TIP_MBR_JOIN;
	      });

	      if (!isEmpty(remoteUserJoinTips)) {
	        this._outerEmitter.emit(EVENT.REMOTE_USER_JOIN, remoteUserJoinTips);
	      }

	      var remoteUserLeaveTips = messages.filter(function (message) {
	        return message.type === timJs.TYPES.MSG_GRP_TIP && message.payload.operationType === timJs.TYPES.GRP_TIP_MBR_QUIT;
	      });

	      if (!isEmpty(remoteUserLeaveTips)) {
	        this._outerEmitter.emit(EVENT.REMOTE_USER_LEAVE, remoteUserLeaveTips);
	      }
	    }
	  }, {
	    key: "_onKickedOut",
	    value: function _onKickedOut(event) {
	      this._outerEmitter.emit(EVENT.KICKED_OUT, event.data.type);
	    }
	  }, {
	    key: "_onNetStateChange",
	    value: function _onNetStateChange(event) {
	      this._outerEmitter.emit(EVENT.NET_STATE_CHANGE, event.data.state);
	    } // ---------- player ----------

	    /**
	     * 通过视频地址加载视频
	     * @param {String} url 视频地址
	     * @example
	     * tweblive.load("http://200002949.vod.myqcloud.com/200002949_b6ffc.f0.flv");
	     */

	  }, {
	    key: "load",
	    value: function load(url) {
	      if (this._player) {
	        this._player.load(url);
	      }
	    }
	    /**
	     * 开始播放视频
	     * @example
	     * tweblive.play();
	     */

	  }, {
	    key: "play",
	    value: function play() {
	      if (this._player) {
	        this._player.play();
	      }
	    }
	    /**
	     * 暂停播放视频
	     * @example
	     * tweblive.pause();
	     */

	  }, {
	    key: "pause",
	    value: function pause() {
	      this._player.pause();
	    }
	    /**
	     * 静音播放器
	     * @example
	     * tweblive.mutePlayer();
	     */

	  }, {
	    key: "mutePlayer",
	    value: function mutePlayer() {
	      this._player.mute(true);
	    }
	    /**
	     * 取消静音播放器
	     * @example
	     * tweblive.unmutePlayer();
	     */

	  }, {
	    key: "unmutePlayer",
	    value: function unmutePlayer() {
	      this._player.mute(false);
	    }
	    /**
	     * 设置播放器音量
	     * @param {Number} value 音量值，范围：0到1
	     * @example
	     * tweblive.setVolume(0.7);
	     */

	  }, {
	    key: "setVolume",
	    value: function setVolume(value) {
	      this._player.volume(value);
	    }
	    /**
	     * 请求浏览器（user agent）将播放器（甚至延伸到它的后代元素）置为全屏模式，隐去屏幕上的浏览器所有 UI 元素，以及其它应用
	     * @example
	     * tweblive.requestFullscreen();
	     */

	  }, {
	    key: "requestFullscreen",
	    value: function requestFullscreen() {
	      this._player.fullscreen(true);
	    }
	    /**
	     * 从全屏模式切换到窗口模式
	     * @example
	     * tweblive.exitFullscreen();
	     */

	  }, {
	    key: "exitFullscreen",
	    value: function exitFullscreen() {
	      this._player.fullscreen(false);
	    }
	    /**
	     * 获取当前播放视频的时间
	     * @returns {Number}
	     * @example
	     * console.log('currentTime', tweblive.getCurrentTime());
	     */

	  }, {
	    key: "getCurrentTime",
	    value: function getCurrentTime() {
	      return this._player.currentTime();
	    }
	    /**
	     * 销毁播放器
	     * @example
	     * tweblive.destroyPlayer();
	     */

	  }, {
	    key: "destroyPlayer",
	    value: function destroyPlayer() {
	      this._player.destroy();
	    } // ---------- im ----------

	    /**
	     * @description 设置日志级别，低于 level 的日志将不会输出。
	     * @param {Number} level - 日志级别
	     * - 0 普通级别，日志量较多，接入时建议使用
	     * - 1 release级别，SDK 输出关键信息，生产环境时建议使用
	     * - 2 告警级别，SDK 只输出告警和错误级别的日志
	     * - 3 错误级别，SDK 只输出错误级别的日志
	     * - 4 无日志级别，SDK 将不打印任何日志
	     * @example
	     * tweblive.setLogLevel(0);
	     */

	  }, {
	    key: "setLogLevel",
	    value: function setLogLevel(level) {
	      logger.setLevel(level);

	      if (this._tim) {
	        this._tim.setLogLevel(level);
	      }
	    }
	    /**
	     * @description 监听事件。
	     * >注意：请在调用 login 接口前调用此接口监听事件，避免漏掉 SDK 派发的事件。
	     * @param {String} eventName
	     *        事件名称。所有的事件名称都存放在 `TWebLive.EVENT` 变量中，如需要查看可以使用 `console.log(TWebLive.EVENT)` 把所有的事件显示出来。{@link module:EVENT 事件列表}
	     * @param {Function} handler
	     *        处理事件的方法，当事件触发时，会调用此handler进行处理。
	     * @param {*} [context] 期望 handler 执行时的上下文
	     * @example
	     * let onTextMessageReceived = function(event) {
	     *   event.data.forEach(function(message) {
	     *     console.log('demo ' + (message.from || message.nick) + ' : ', message.payload.text);
	     *   });
	     * };
	     * tweblive.on(TWebLive.EVENT.TEXT_MESSAGE_RECEIVED, onTextMessageReceived);
	     */

	  }, {
	    key: "on",
	    value: function on(eventName, handler, context) {
	      logger.debug('on', "eventName:".concat(eventName));

	      this._outerEmitter.on(eventName, this._safetyCallbackFactory.defense(eventName, handler, context), context);
	    }
	    /**
	     * @description 取消监听事件。
	     * @param {String} eventName
	     *        事件名称。所有的事件名称都存放在 `TWebLive.EVENT` 变量中，如需要查看可以使用 `console.log(TWebLive.EVENT)` 把所有的事件显示出来。{@link module:EVENT 事件列表}
	     * @param {Function} handler
	     *        处理事件的方法，当事件触发时，会调用此handler进行处理。
	     * @param {*} [context] 期望 handler 执行时的上下文
	     * @example
	     * tweblive.off(TWebLive.EVENT.TEXT_MESSAGE_RECEIVED, onTextMessageReceived);
	     */

	  }, {
	    key: "off",
	    value: function off(eventName, handler, context) {
	      logger.debug('off', "eventName:".concat(eventName));

	      var safeFunc = this._safetyCallbackFactory.find(eventName, handler);

	      if (safeFunc !== null) {
	        this._outerEmitter.off(eventName, safeFunc, context);

	        this._safetyCallbackFactory["delete"](eventName, handler);
	      }
	    }
	    /**
	     * 加入直播间
	     * @param {String} roomID 直播间ID
	     * @returns {Promise}
	     * @example
	     * let promise = tweblive.enterRoom('AV1');
	     * promise.then(function(imResponse) {
	     *   switch (imResponse.data.status) {
	     *     case TWebLive.TYPES.ENTER_ROOM_SUCCESS: // 加入直播间成功
	     *       break;
	     *     case TWebLive.TYPES.ALREADY_IN_ROOM: // 已经在直播间内
	     *       break;
	     *     default:
	     *       break;
	     *   }
	     * }).catch(function(imError){
	     *   console.warn('enterRoom error:', imError); // 加入直播间失败的相关信息
	     * });
	     */

	  }, {
	    key: "enterRoom",
	    value: function enterRoom(roomID) {
	      var _this = this;

	      if (this._tim) {
	        return this._tim.joinGroup({
	          groupID: roomID
	        }).then(function () {
	          logger.log("TWebLive.enterRoom ok. isAnonymousUser=".concat(_this._isAnonymousUser)); // 匿名加群不会触发 SDK_READY 事件，但也需要计算一次pv

	          if (_this._isAnonymousUser) {
	            _this._stat();
	          }
	        });
	      }
	    }
	    /**
	     * 离开直播间
	     * @param {String} roomID 直播间ID
	     * @returns {Promise}
	     * @example
	     * let promise = tweblive.exitRoom('AV1');
	     * promise.then(function(imResponse) {
	     *   // 退出直播间成功
	     * }).catch(function(imError){
	     *   console.warn('exitRoom error:', imError); // 退出直播间失败的相关信息
	     * });
	     */

	  }, {
	    key: "exitRoom",
	    value: function exitRoom(roomID) {
	      if (this._tim) {
	        return this._tim.quitGroup(roomID);
	      }
	    }
	    /**
	     * 登录
	     * @param {Object} options 登录参数
	     * @param {String} options.userID 用户 ID
	     * @param {String} options.userSig 用户登录即时通信 IM 的密码，其本质是对 UserID 等信息加密后得到的密文。<br/>具体生成方法请参见{@link https://cloud.tencent.com/document/product/269/32688 生成 UserSig}。
	     * @returns {Promise}
	     * @example
	     * let promise = tweblive.login({userID: 'your userID', userSig: 'your userSig'});
	     * promise.then(function(res) {
	     *   console.log(res.data); // 登录成功
	     *   if (res.data.repeatLogin === true) {
	     *     // 标识账号已登录，本次登录操作为重复登录
	     *     console.log(imResponse.data.errorInfo);
	     *   }
	     * }).catch(function(imError) {
	     *   console.warn('login error:', imError); // 登录失败的相关信息
	     * });
	     */

	  }, {
	    key: "login",
	    value: function login(options) {
	      var _this2 = this;

	      if (this._tim) {
	        return this._tim.login(options).then(function () {
	          _this2._isAnonymousUser = false;
	        });
	      }
	    }
	    /**
	     * 登出
	     * @returns {Promise}
	     * @example
	     * let promise = tweblive.logout();
	     * promise.then(function(imResponse) {
	     *   console.log(imResponse.data); // 登出成功
	     * }).catch(function(imError) {
	     *   console.warn('logout error:', imError);
	     * });
	     */

	  }, {
	    key: "logout",
	    value: function logout() {
	      var _this3 = this;

	      if (this._tim) {
	        return this._tim.logout().then(function () {
	          _this3._isAnonymousUser = true;
	        });
	      }
	    }
	    /**
	     * 设置个人资料，如昵称和头像
	     * @param {Object} options 参数
	     * @returns {Promise}
	     * @example
	     * // 设置个人昵称和头像
	     * let promise = tweblive.setMyProfile({
	     *   nick: '我的昵称',
	     *   avatar: 'http(s)://url/to/image.jpg',
	     * });
	     * promise.then(function(imResponse) {
	     *   console.log(imResponse.data); // 成功
	     * }).catch(function(imError) {
	     *   console.warn('setMyProfile error:', imError); // 设置资料失败的相关信息
	     * });
	     */

	  }, {
	    key: "setMyProfile",
	    value: function setMyProfile(options) {
	      if (this._tim) {
	        return this._tim.updateMyProfile(options);
	      }
	    }
	    /**
	     * 获取个人资料，如昵称和头像
	     * @returns {Promise}
	     * @example
	     * let promise = tweblive.getMyProfile();
	     * promise.then(function(imResponse) {
	     *   console.log('昵称：', imResponse.data.nick, '头像：', imResponse.data.avatar); // 个人资料 - Profile 实例
	     * }).catch(function(imError) {
	     *   console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
	     * });
	     */

	  }, {
	    key: "getMyProfile",
	    value: function getMyProfile() {
	      if (this._tim) {
	        return this._tim.getMyProfile().then(function (res) {
	          return {
	            code: 0,
	            data: {
	              nick: res.data.nick,
	              avatar: res.data.avatar
	            }
	          };
	        });
	      }
	    }
	    /**
	     * 聊天互动，在直播间发送文本消息
	     * @param {Object} options 消息参数
	     * @param {String} options.roomID 直播间ID
	     * @param {String} options.priority 消息优先级
	     * @param {String} options.text 文本消息内容
	     * @returns {Promise}
	     * @example
	     * let promise = tweblive.sendTextMessage({
	     *   roomID: 'AV1',
	     *   priority: TWebLive.TYPES.MSG_PRIORITY_NORMAL,
	     *   text: 'hello from TWebLive'
	     * });
	     * promise.then(function(imResponse) {
	     *   console.log('demo sendTextMessage OK', imResponse);
	     * }).catch(function(imError) {
	     *   console.log('demo sendTextMessage failed', imError);
	     * });
	     */

	  }, {
	    key: "sendTextMessage",
	    value: function sendTextMessage(options) {
	      if (this._tim) {
	        var message = this._tim.createTextMessage({
	          to: options.roomID,
	          conversationType: timJs.TYPES.CONV_GROUP,
	          priority: options.priority || timJs.TYPES.MSG_PRIORITY_NORMAL,
	          payload: {
	            text: options.text
	          }
	        });

	        return this._tim.sendMessage(message);
	      }
	    }
	    /**
	     * 在直播间发送自定义消息，如点赞、送礼等
	     * @param {Object} options 消息参数
	     * @param {String} options.roomID 直播间ID
	     * @param {String} options.priority 消息优先级
	     * @param {String} options.payload.data - 自定义消息的数据字段
	     * @param {String} options.payload.description - 自定义消息的说明字段
	     * @param {String} options.payload.extension - 自定义消息的扩展字段
	     * @returns {Promise}
	     * @example
	     * let promise = tweblive.sendCustomMessage({
	     *   roomID: 'AV1',
	     *   priority：TWebLive.TYPES.MSG_PRIORITY_LOW, // 低优先级
	     *   data: 'dianzan', // 用于标识该消息是点赞类型的自定义消息
	     *   description: '',
	     *   extension: ''
	     * });
	     * promise.then(function(imResponse) {
	     *   console.log('demo sendCustomMessage OK', imResponse);
	     * }).catch(function(imError) {
	     *   console.log('demo sendCustomMessage failed', imError);
	     * });
	     */

	  }, {
	    key: "sendCustomMessage",
	    value: function sendCustomMessage(options) {
	      if (this._tim) {
	        var message = this._tim.createCustomMessage({
	          to: options.roomID,
	          conversationType: timJs.TYPES.CONV_GROUP,
	          priority: options.priority || timJs.TYPES.MSG_PRIORITY_NORMAL,
	          payload: {
	            data: options.data || '',
	            description: options.description || '',
	            extension: options.extension || ''
	          }
	        });

	        return this._tim.sendMessage(message);
	      }
	    }
	  }], [{
	    key: "EVENT",
	    get: function get() {
	      return EVENT;
	    }
	  }, {
	    key: "TYPES",
	    get: function get() {
	      return TYPES;
	    }
	  }]);

	  return TWebLive;
	}();

	return TWebLive;

})));
