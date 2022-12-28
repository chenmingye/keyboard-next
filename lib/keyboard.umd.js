(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["keyboard"] = factory(require("vue"));
	else
		root["keyboard"] = factory(root["Vue"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__7203__) {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9669:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(1609);

/***/ }),

/***/ 5448:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var settle = __webpack_require__(6026);
var cookies = __webpack_require__(4372);
var buildURL = __webpack_require__(5327);
var buildFullPath = __webpack_require__(4097);
var parseHeaders = __webpack_require__(4109);
var isURLSameOrigin = __webpack_require__(7985);
var createError = __webpack_require__(5061);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 1609:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var bind = __webpack_require__(1849);
var Axios = __webpack_require__(321);
var mergeConfig = __webpack_require__(7185);
var defaults = __webpack_require__(5655);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(5263);
axios.CancelToken = __webpack_require__(4972);
axios.isCancel = __webpack_require__(6502);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(8713);

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(6268);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ 5263:
/***/ (function(module) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 4972:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(5263);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 6502:
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 321:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var buildURL = __webpack_require__(5327);
var InterceptorManager = __webpack_require__(782);
var dispatchRequest = __webpack_require__(3572);
var mergeConfig = __webpack_require__(7185);
var validator = __webpack_require__(4875);

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 782:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 4097:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(1793);
var combineURLs = __webpack_require__(7303);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 5061:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(481);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 3572:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var transformData = __webpack_require__(8527);
var isCancel = __webpack_require__(6502);
var defaults = __webpack_require__(5655);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 481:
/***/ (function(module) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ 7185:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ 6026:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(5061);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 8527:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var defaults = __webpack_require__(5655);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ 5655:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var normalizeHeaderName = __webpack_require__(6016);
var enhanceError = __webpack_require__(481);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(5448);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(5448);
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ 1849:
/***/ (function(module) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 5327:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 7303:
/***/ (function(module) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 4372:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 1793:
/***/ (function(module) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 6268:
/***/ (function(module) {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ 7985:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 6016:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 4109:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 8713:
/***/ (function(module) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 4875:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var pkg = __webpack_require__(8593);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ 4867:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(1849);

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ 9662:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var tryToString = __webpack_require__(6330);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 9670:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 1318:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(5656);
var toAbsoluteIndex = __webpack_require__(1400);
var lengthOfArrayLike = __webpack_require__(6244);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 3658:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9781);
var isArray = __webpack_require__(3157);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ 4326:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 9920:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(2597);
var ownKeys = __webpack_require__(3887);
var getOwnPropertyDescriptorModule = __webpack_require__(1236);
var definePropertyModule = __webpack_require__(3070);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 8880:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var definePropertyModule = __webpack_require__(3070);
var createPropertyDescriptor = __webpack_require__(9114);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 9114:
/***/ (function(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 8052:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var definePropertyModule = __webpack_require__(3070);
var makeBuiltIn = __webpack_require__(6339);
var defineGlobalProperty = __webpack_require__(3072);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 3072:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 5117:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var tryToString = __webpack_require__(6330);

var $TypeError = TypeError;

module.exports = function (O, P) {
  if (!delete O[P]) throw $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
};


/***/ }),

/***/ 9781:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ 4154:
/***/ (function(module) {

var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};


/***/ }),

/***/ 317:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 7207:
/***/ (function(module) {

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ 8113:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ 7392:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var userAgent = __webpack_require__(8113);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 748:
/***/ (function(module) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 2109:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var getOwnPropertyDescriptor = (__webpack_require__(1236).f);
var createNonEnumerableProperty = __webpack_require__(8880);
var defineBuiltIn = __webpack_require__(8052);
var defineGlobalProperty = __webpack_require__(3072);
var copyConstructorProperties = __webpack_require__(9920);
var isForced = __webpack_require__(4705);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 7293:
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 4374:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 6916:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(4374);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 6530:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var hasOwn = __webpack_require__(2597);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 1702:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(4374);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 5005:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 8173:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(9662);
var isNullOrUndefined = __webpack_require__(8554);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 7854:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 2597:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var toObject = __webpack_require__(7908);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 3501:
/***/ (function(module) {

module.exports = {};


/***/ }),

/***/ 4664:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);
var createElement = __webpack_require__(317);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ 8361:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var fails = __webpack_require__(7293);
var classof = __webpack_require__(4326);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 2788:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var isCallable = __webpack_require__(614);
var store = __webpack_require__(5465);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 9909:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(4811);
var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);
var createNonEnumerableProperty = __webpack_require__(8880);
var hasOwn = __webpack_require__(2597);
var shared = __webpack_require__(5465);
var sharedKey = __webpack_require__(6200);
var hiddenKeys = __webpack_require__(3501);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 3157:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(4326);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ }),

/***/ 614:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $documentAll = __webpack_require__(4154);

var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 4705:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 8554:
/***/ (function(module) {

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 111:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var $documentAll = __webpack_require__(4154);

var documentAll = $documentAll.all;

module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 1913:
/***/ (function(module) {

module.exports = false;


/***/ }),

/***/ 2190:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);
var isCallable = __webpack_require__(614);
var isPrototypeOf = __webpack_require__(7976);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 6244:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toLength = __webpack_require__(7466);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 6339:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);
var hasOwn = __webpack_require__(2597);
var DESCRIPTORS = __webpack_require__(9781);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(6530).CONFIGURABLE);
var inspectSource = __webpack_require__(2788);
var InternalStateModule = __webpack_require__(9909);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 4758:
/***/ (function(module) {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 3070:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var IE8_DOM_DEFINE = __webpack_require__(4664);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(3353);
var anObject = __webpack_require__(9670);
var toPropertyKey = __webpack_require__(4948);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 1236:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var call = __webpack_require__(6916);
var propertyIsEnumerableModule = __webpack_require__(5296);
var createPropertyDescriptor = __webpack_require__(9114);
var toIndexedObject = __webpack_require__(5656);
var toPropertyKey = __webpack_require__(4948);
var hasOwn = __webpack_require__(2597);
var IE8_DOM_DEFINE = __webpack_require__(4664);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 8006:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 5181:
/***/ (function(__unused_webpack_module, exports) {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 7976:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 6324:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var hasOwn = __webpack_require__(2597);
var toIndexedObject = __webpack_require__(5656);
var indexOf = (__webpack_require__(1318).indexOf);
var hiddenKeys = __webpack_require__(3501);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 5296:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 2140:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 3887:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);
var uncurryThis = __webpack_require__(1702);
var getOwnPropertyNamesModule = __webpack_require__(8006);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var anObject = __webpack_require__(9670);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 4488:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isNullOrUndefined = __webpack_require__(8554);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 6200:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(2309);
var uid = __webpack_require__(9711);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 5465:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var defineGlobalProperty = __webpack_require__(3072);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ 2309:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var IS_PURE = __webpack_require__(1913);
var store = __webpack_require__(5465);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.27.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.27.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 6293:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(7392);
var fails = __webpack_require__(7293);

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 1400:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(9303);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 5656:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(8361);
var requireObjectCoercible = __webpack_require__(4488);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 9303:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var trunc = __webpack_require__(4758);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 7466:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(9303);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 7908:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(4488);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 7593:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var isObject = __webpack_require__(111);
var isSymbol = __webpack_require__(2190);
var getMethod = __webpack_require__(8173);
var ordinaryToPrimitive = __webpack_require__(2140);
var wellKnownSymbol = __webpack_require__(5112);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 4948:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(7593);
var isSymbol = __webpack_require__(2190);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 6330:
/***/ (function(module) {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 9711:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 3307:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(6293);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 3353:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ 4811:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 5112:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var shared = __webpack_require__(2309);
var hasOwn = __webpack_require__(2597);
var uid = __webpack_require__(9711);
var NATIVE_SYMBOL = __webpack_require__(6293);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 7658:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var toObject = __webpack_require__(7908);
var lengthOfArrayLike = __webpack_require__(6244);
var setArrayLength = __webpack_require__(3658);
var doesNotExceedSafeInteger = __webpack_require__(7207);
var fails = __webpack_require__(7293);

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 and Safari <= 15.4, FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var SILENT_ON_NON_WRITABLE_LENGTH = !function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
}();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: INCORRECT_TO_LENGTH || SILENT_ON_NON_WRITABLE_LENGTH }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ }),

/***/ 541:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var toObject = __webpack_require__(7908);
var lengthOfArrayLike = __webpack_require__(6244);
var setArrayLength = __webpack_require__(3658);
var deletePropertyOrThrow = __webpack_require__(5117);
var doesNotExceedSafeInteger = __webpack_require__(7207);

// IE8-
var INCORRECT_RESULT = [].unshift(0) !== 1;

// V8 ~ Chrome < 71 and Safari <= 15.4, FF < 23 throws InternalError
var SILENT_ON_NON_WRITABLE_LENGTH = !function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).unshift();
  } catch (error) {
    return error instanceof TypeError;
  }
}();

// `Array.prototype.unshift` method
// https://tc39.es/ecma262/#sec-array.prototype.unshift
$({ target: 'Array', proto: true, arity: 1, forced: INCORRECT_RESULT || SILENT_ON_NON_WRITABLE_LENGTH }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  unshift: function unshift(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    if (argCount) {
      doesNotExceedSafeInteger(len + argCount);
      var k = len;
      while (k--) {
        var to = k + argCount;
        if (k in O) O[to] = O[k];
        else deletePropertyOrThrow(O, to);
      }
      for (var j = 0; j < argCount; j++) {
        O[j] = arguments[j];
      }
    } return setArrayLength(O, len + argCount);
  }
});


/***/ }),

/***/ 9824:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function (global, factory) {
	 true ? module.exports = factory() :
	0;
}(this, (function () { 'use strict';

var SpriteSymbol = function SpriteSymbol(ref) {
  var id = ref.id;
  var viewBox = ref.viewBox;
  var content = ref.content;

  this.id = id;
  this.viewBox = viewBox;
  this.content = content;
};

/**
 * @return {string}
 */
SpriteSymbol.prototype.stringify = function stringify () {
  return this.content;
};

/**
 * @return {string}
 */
SpriteSymbol.prototype.toString = function toString () {
  return this.stringify();
};

SpriteSymbol.prototype.destroy = function destroy () {
    var this$1 = this;

  ['id', 'viewBox', 'content'].forEach(function (prop) { return delete this$1[prop]; });
};

/**
 * @param {string} content
 * @return {Element}
 */
var parse = function (content) {
  var hasImportNode = !!document.importNode;
  var doc = new DOMParser().parseFromString(content, 'image/svg+xml').documentElement;

  /**
   * Fix for browser which are throwing WrongDocumentError
   * if you insert an element which is not part of the document
   * @see http://stackoverflow.com/a/7986519/4624403
   */
  if (hasImportNode) {
    return document.importNode(doc, true);
  }

  return doc;
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var deepmerge = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (false) {} else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {

function isMergeableObject(val) {
    var nonNullObject = val && typeof val === 'object';

    return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]'
}

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {}
}

function cloneIfNecessary(value, optionsArgument) {
    var clone = optionsArgument && optionsArgument.clone === true;
    return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}

function defaultArrayMerge(target, source, optionsArgument) {
    var destination = target.slice();
    source.forEach(function(e, i) {
        if (typeof destination[i] === 'undefined') {
            destination[i] = cloneIfNecessary(e, optionsArgument);
        } else if (isMergeableObject(e)) {
            destination[i] = deepmerge(target[i], e, optionsArgument);
        } else if (target.indexOf(e) === -1) {
            destination.push(cloneIfNecessary(e, optionsArgument));
        }
    });
    return destination
}

function mergeObject(target, source, optionsArgument) {
    var destination = {};
    if (isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
            destination[key] = cloneIfNecessary(target[key], optionsArgument);
        });
    }
    Object.keys(source).forEach(function (key) {
        if (!isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneIfNecessary(source[key], optionsArgument);
        } else {
            destination[key] = deepmerge(target[key], source[key], optionsArgument);
        }
    });
    return destination
}

function deepmerge(target, source, optionsArgument) {
    var array = Array.isArray(source);
    var options = optionsArgument || { arrayMerge: defaultArrayMerge };
    var arrayMerge = options.arrayMerge || defaultArrayMerge;

    if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
    } else {
        return mergeObject(target, source, optionsArgument)
    }
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
    if (!Array.isArray(array) || array.length < 2) {
        throw new Error('first argument should be an array with at least two elements')
    }

    // we are sure there are at least 2 values, so it is safe to have no initial value
    return array.reduce(function(prev, next) {
        return deepmerge(prev, next, optionsArgument)
    })
};

return deepmerge

}));
});

var namespaces_1 = createCommonjsModule(function (module, exports) {
var namespaces = {
  svg: {
    name: 'xmlns',
    uri: 'http://www.w3.org/2000/svg'
  },
  xlink: {
    name: 'xmlns:xlink',
    uri: 'http://www.w3.org/1999/xlink'
  }
};

exports.default = namespaces;
module.exports = exports.default;
});

/**
 * @param {Object} attrs
 * @return {string}
 */
var objectToAttrsString = function (attrs) {
  return Object.keys(attrs).map(function (attr) {
    var value = attrs[attr].toString().replace(/"/g, '&quot;');
    return (attr + "=\"" + value + "\"");
  }).join(' ');
};

var svg = namespaces_1.svg;
var xlink = namespaces_1.xlink;

var defaultAttrs = {};
defaultAttrs[svg.name] = svg.uri;
defaultAttrs[xlink.name] = xlink.uri;

/**
 * @param {string} [content]
 * @param {Object} [attributes]
 * @return {string}
 */
var wrapInSvgString = function (content, attributes) {
  if ( content === void 0 ) content = '';

  var attrs = deepmerge(defaultAttrs, attributes || {});
  var attrsRendered = objectToAttrsString(attrs);
  return ("<svg " + attrsRendered + ">" + content + "</svg>");
};

var BrowserSpriteSymbol = (function (SpriteSymbol$$1) {
  function BrowserSpriteSymbol () {
    SpriteSymbol$$1.apply(this, arguments);
  }

  if ( SpriteSymbol$$1 ) BrowserSpriteSymbol.__proto__ = SpriteSymbol$$1;
  BrowserSpriteSymbol.prototype = Object.create( SpriteSymbol$$1 && SpriteSymbol$$1.prototype );
  BrowserSpriteSymbol.prototype.constructor = BrowserSpriteSymbol;

  var prototypeAccessors = { isMounted: {} };

  prototypeAccessors.isMounted.get = function () {
    return !!this.node;
  };

  /**
   * @param {Element} node
   * @return {BrowserSpriteSymbol}
   */
  BrowserSpriteSymbol.createFromExistingNode = function createFromExistingNode (node) {
    return new BrowserSpriteSymbol({
      id: node.getAttribute('id'),
      viewBox: node.getAttribute('viewBox'),
      content: node.outerHTML
    });
  };

  BrowserSpriteSymbol.prototype.destroy = function destroy () {
    if (this.isMounted) {
      this.unmount();
    }
    SpriteSymbol$$1.prototype.destroy.call(this);
  };

  /**
   * @param {Element|string} target
   * @return {Element}
   */
  BrowserSpriteSymbol.prototype.mount = function mount (target) {
    if (this.isMounted) {
      return this.node;
    }

    var mountTarget = typeof target === 'string' ? document.querySelector(target) : target;
    var node = this.render();
    this.node = node;

    mountTarget.appendChild(node);

    return node;
  };

  /**
   * @return {Element}
   */
  BrowserSpriteSymbol.prototype.render = function render () {
    var content = this.stringify();
    return parse(wrapInSvgString(content)).childNodes[0];
  };

  BrowserSpriteSymbol.prototype.unmount = function unmount () {
    this.node.parentNode.removeChild(this.node);
  };

  Object.defineProperties( BrowserSpriteSymbol.prototype, prototypeAccessors );

  return BrowserSpriteSymbol;
}(SpriteSymbol));

return BrowserSpriteSymbol;

})));


/***/ }),

/***/ 3772:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9824);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5348);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new (_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default())({
  "id": "icon-back",
  "use": "icon-back-usage",
  "viewBox": "0 0 58.6 35.1",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 58.6 35.1\" id=\"icon-back\">\n<style type=\"text/css\">\n\t#icon-back .st0{stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}\n\t#icon-back .st1{stroke-width:2.1499;stroke-miterlimit:10;}\n\t#icon-back .st2{stroke-width:3.2571;stroke-miterlimit:10;}\n</style>\n<g>\n\t<path class=\"st0\" d=\"M8.4,8.8h37.1c6.7,0,12.2,5.4,12.2,12.2l0,0c0,7.2-5.8,13.1-13.1,13.1c0,0,0,0,0,0h-24\" />\n\t<g>\n\t\t<path class=\"st1\" d=\"M3,9.1l8.6,6.9c0.1,0.1,0.3,0,0.3-0.1V2c0-0.2-0.2-0.2-0.3-0.1L3,8.8C2.9,8.9,2.9,9,3,9.1z\" />\n\t\t<path class=\"st2\" d=\"M10.4,4.8c0,0-5.4,4.1-5.4,4s5.6,3.8,5.6,3.8L10.4,4.8z\" />\n\t</g>\n</g>\n</symbol>"
});
var result = _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default().add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ 8654:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9824);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5348);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new (_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default())({
  "id": "icon-close",
  "use": "icon-close-usage",
  "viewBox": "0 0 50 35.93",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 50 35.93\" id=\"icon-close\">\n\t<defs>\n\t\t<style>\n\t\t\t#icon-close .cls-2,#icon-close .cls-3,#icon-close .cls-4{stroke-width:2px;}#icon-close .cls-3,#icon-close .cls-4{stroke-linecap:round;}#icon-close .cls-3{stroke-dasharray:3 4;}#icon-close .cls-5,#icon-close .cls-6{stroke-miterlimit:10;}#icon-close .cls-5{stroke-width:2.2px;}#icon-close .cls-6{stroke-width:3.39px;}\n\t\t</style>\n\t</defs>\n\t<g id=\"icon-close_图层_2\" data-name=\"图层 2\">\n\t\t<g id=\"icon-close_图层_1-2\" data-name=\"图层 1\">\n\t\t\t<g id=\"icon-close_组_98\" data-name=\"组 98\">\n\t\t\t\t<g id=\"icon-close_矩形_60\" data-name=\"矩形 60\">\n\t\t\t\t\t<rect class=\"cls-1\" width=\"50\" height=\"27\" rx=\"5\" />\n\t\t\t\t\t<rect class=\"cls-2\" x=\"1\" y=\"1\" width=\"48\" height=\"25\" rx=\"4\" />\n\t\t\t\t</g>\n\t\t\t\t<g id=\"icon-close_组_97\" data-name=\"组 97\">\n\t\t\t\t\t<path id=\"icon-close_路径_85\" data-name=\"路径 85\" class=\"cls-3\" d=\"M9.5,8H40.18\" />\n\t\t\t\t\t<path id=\"icon-close_路径_86\" data-name=\"路径 86\" class=\"cls-3\" d=\"M9.5,13.5H40.18\" />\n\t\t\t\t\t<path id=\"icon-close_路径_87\" data-name=\"路径 87\" class=\"cls-3\" d=\"M9.5,19h3.17\" />\n\t\t\t\t\t<path id=\"icon-close_路径_89\" data-name=\"路径 89\" class=\"cls-4\" d=\"M16.5,19h17\" />\n\t\t\t\t\t<path id=\"icon-close_路径_88\" data-name=\"路径 88\" class=\"cls-3\" d=\"M37.5,19h2.68\" />\n\t\t\t\t</g>\n\t\t\t</g>\n\t\t\t<path class=\"cls-5\" d=\"M25.18,34.82l5.32-4.25a.07.07,0,0,0,0-.12H19.83a.07.07,0,0,0,0,.12l5.31,4.25A.06.06,0,0,0,25.18,34.82Z\" />\n\t\t\t<circle class=\"cls-6\" cx=\"25.14\" cy=\"32.58\" r=\"1\" />\n\t\t</g>\n\t</g>\n</symbol>"
});
var result = _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default().add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ 2884:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9824);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5348);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new (_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default())({
  "id": "icon-delete",
  "use": "icon-delete-usage",
  "viewBox": "0 0 66.467 28.8",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 66.467 28.8\" id=\"icon-delete\">\n  <g id=\"icon-delete_delet\" transform=\"translate(-1618 -633)\">\n    <path id=\"icon-delete_路径_2\" data-name=\"路径 2\" d=\"M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z\" transform=\"translate(788.837 157.084)\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"2\" />\n    <line id=\"icon-delete_直线_3\" data-name=\"直线 3\" x2=\"7.743\" y2=\"7.743\" transform=\"translate(1651.233 644.027)\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"2\" />\n    <line id=\"icon-delete_直线_4\" data-name=\"直线 4\" x1=\"7.743\" y2=\"7.743\" transform=\"translate(1651.233 644.027)\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"2\" />\n  </g>\n</symbol>"
});
var result = _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default().add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ 1046:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9824);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5348);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new (_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default())({
  "id": "icon-drag",
  "use": "icon-drag-usage",
  "viewBox": "0 0 28 29.526",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 29.526\" id=\"icon-drag\">\n  <g id=\"icon-drag_drag\" transform=\"translate(-1623.5 -915.5)\">\n    <line id=\"icon-drag_直线_5\" data-name=\"直线 5\" y2=\"22.015\" transform=\"translate(1637.049 919.566)\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"3\" />\n    <line id=\"icon-drag_直线_6\" data-name=\"直线 6\" x1=\"22.015\" transform=\"translate(1626.041 930.574)\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"3\" />\n    <path id=\"icon-drag_路径_15\" data-name=\"路径 15\" d=\"M728.456,559.625l3.888-3.887,3.885,3.885\" transform=\"translate(904.603 361.262)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" />\n    <path id=\"icon-drag_路径_16\" data-name=\"路径 16\" d=\"M736.229,568.465l-3.888,3.888-3.885-3.885\" transform=\"translate(904.603 371.172)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" />\n    <path id=\"icon-drag_路径_17\" data-name=\"路径 17\" d=\"M735.8,561.184l3.888,3.888-3.885,3.885\" transform=\"translate(910.317 365.503)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" />\n    <path id=\"icon-drag_路径_18\" data-name=\"路径 18\" d=\"M727.813,568.957l-3.888-3.888,3.885-3.885\" transform=\"translate(901.075 365.503)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" />\n  </g>\n</symbol>"
});
var result = _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default().add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ 6262:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9824);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5348);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new (_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default())({
  "id": "icon-handwrite",
  "use": "icon-handwrite-usage",
  "viewBox": "0 0 24.784 33.44",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24.784 33.44\" id=\"icon-handwrite\">\n  <g id=\"icon-handwrite_Handwriting\" transform=\"translate(-783.997 -761.616)\">\n    <rect id=\"icon-handwrite_矩形_4\" data-name=\"矩形 4\" width=\"7.324\" height=\"23.712\" rx=\"1.136\" transform=\"matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"2\" />\n    <rect id=\"icon-handwrite_矩形_5\" data-name=\"矩形 5\" width=\"7.324\" height=\"4.946\" rx=\"1.136\" transform=\"matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"2\" />\n    <path id=\"icon-handwrite_路径_3\" data-name=\"路径 3\" d=\"M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z\" transform=\"translate(36.075 289.183)\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"2\" />\n  </g>\n</symbol>"
});
var result = _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default().add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ 676:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9824);
/* harmony import */ var _node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5348);
/* harmony import */ var _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new (_node_modules_svg_baker_runtime_browser_symbol_js__WEBPACK_IMPORTED_MODULE_0___default())({
  "id": "icon-upper",
  "use": "icon-upper-usage",
  "viewBox": "0 0 24.37 32.991",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24.37 32.991\" id=\"icon-upper\">\n  <g id=\"icon-upper_capslock\" transform=\"translate(-437.841 -757.875)\">\n    <path id=\"icon-upper_路径_1\" data-name=\"路径 1\" d=\"M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z\" transform=\"translate(-339.747 296.701)\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"2\" />\n    <line id=\"icon-upper_直线_2\" data-name=\"直线 2\" x2=\"13.938\" transform=\"translate(442.92 789.865)\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"2\" />\n  </g>\n</symbol>"
});
var result = _node_modules_svg_sprite_loader_runtime_browser_sprite_build_js__WEBPACK_IMPORTED_MODULE_1___default().add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ 5348:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function (global, factory) {
	 true ? module.exports = factory() :
	0;
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var deepmerge = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (false) {} else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {

function isMergeableObject(val) {
    var nonNullObject = val && typeof val === 'object';

    return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]'
}

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {}
}

function cloneIfNecessary(value, optionsArgument) {
    var clone = optionsArgument && optionsArgument.clone === true;
    return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}

function defaultArrayMerge(target, source, optionsArgument) {
    var destination = target.slice();
    source.forEach(function(e, i) {
        if (typeof destination[i] === 'undefined') {
            destination[i] = cloneIfNecessary(e, optionsArgument);
        } else if (isMergeableObject(e)) {
            destination[i] = deepmerge(target[i], e, optionsArgument);
        } else if (target.indexOf(e) === -1) {
            destination.push(cloneIfNecessary(e, optionsArgument));
        }
    });
    return destination
}

function mergeObject(target, source, optionsArgument) {
    var destination = {};
    if (isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
            destination[key] = cloneIfNecessary(target[key], optionsArgument);
        });
    }
    Object.keys(source).forEach(function (key) {
        if (!isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneIfNecessary(source[key], optionsArgument);
        } else {
            destination[key] = deepmerge(target[key], source[key], optionsArgument);
        }
    });
    return destination
}

function deepmerge(target, source, optionsArgument) {
    var array = Array.isArray(source);
    var options = optionsArgument || { arrayMerge: defaultArrayMerge };
    var arrayMerge = options.arrayMerge || defaultArrayMerge;

    if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
    } else {
        return mergeObject(target, source, optionsArgument)
    }
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
    if (!Array.isArray(array) || array.length < 2) {
        throw new Error('first argument should be an array with at least two elements')
    }

    // we are sure there are at least 2 values, so it is safe to have no initial value
    return array.reduce(function(prev, next) {
        return deepmerge(prev, next, optionsArgument)
    })
};

return deepmerge

}));
});

//      
// An event handler can take an optional event argument
// and should not return a value
                                          
// An array of all currently registered event handlers for a type
                                            
// A map of event types and their corresponding event handlers.
                        
                                   
  

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
function mitt(all                 ) {
	all = all || Object.create(null);

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on: function on(type        , handler              ) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
		 * @param  {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off: function off(type        , handler              ) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked after type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
		 * @memberof mitt
		 */
		emit: function emit(type        , evt     ) {
			(all[type] || []).map(function (handler) { handler(evt); });
			(all['*'] || []).map(function (handler) { handler(type, evt); });
		}
	};
}

var namespaces_1 = createCommonjsModule(function (module, exports) {
var namespaces = {
  svg: {
    name: 'xmlns',
    uri: 'http://www.w3.org/2000/svg'
  },
  xlink: {
    name: 'xmlns:xlink',
    uri: 'http://www.w3.org/1999/xlink'
  }
};

exports.default = namespaces;
module.exports = exports.default;
});

/**
 * @param {Object} attrs
 * @return {string}
 */
var objectToAttrsString = function (attrs) {
  return Object.keys(attrs).map(function (attr) {
    var value = attrs[attr].toString().replace(/"/g, '&quot;');
    return (attr + "=\"" + value + "\"");
  }).join(' ');
};

var svg = namespaces_1.svg;
var xlink = namespaces_1.xlink;

var defaultAttrs = {};
defaultAttrs[svg.name] = svg.uri;
defaultAttrs[xlink.name] = xlink.uri;

/**
 * @param {string} [content]
 * @param {Object} [attributes]
 * @return {string}
 */
var wrapInSvgString = function (content, attributes) {
  if ( content === void 0 ) content = '';

  var attrs = deepmerge(defaultAttrs, attributes || {});
  var attrsRendered = objectToAttrsString(attrs);
  return ("<svg " + attrsRendered + ">" + content + "</svg>");
};

var svg$1 = namespaces_1.svg;
var xlink$1 = namespaces_1.xlink;

var defaultConfig = {
  attrs: ( obj = {
    style: ['position: absolute', 'width: 0', 'height: 0'].join('; '),
    'aria-hidden': 'true'
  }, obj[svg$1.name] = svg$1.uri, obj[xlink$1.name] = xlink$1.uri, obj )
};
var obj;

var Sprite = function Sprite(config) {
  this.config = deepmerge(defaultConfig, config || {});
  this.symbols = [];
};

/**
 * Add new symbol. If symbol with the same id exists it will be replaced.
 * @param {SpriteSymbol} symbol
 * @return {boolean} `true` - symbol was added, `false` - replaced
 */
Sprite.prototype.add = function add (symbol) {
  var ref = this;
    var symbols = ref.symbols;
  var existing = this.find(symbol.id);

  if (existing) {
    symbols[symbols.indexOf(existing)] = symbol;
    return false;
  }

  symbols.push(symbol);
  return true;
};

/**
 * Remove symbol & destroy it
 * @param {string} id
 * @return {boolean} `true` - symbol was found & successfully destroyed, `false` - otherwise
 */
Sprite.prototype.remove = function remove (id) {
  var ref = this;
    var symbols = ref.symbols;
  var symbol = this.find(id);

  if (symbol) {
    symbols.splice(symbols.indexOf(symbol), 1);
    symbol.destroy();
    return true;
  }

  return false;
};

/**
 * @param {string} id
 * @return {SpriteSymbol|null}
 */
Sprite.prototype.find = function find (id) {
  return this.symbols.filter(function (s) { return s.id === id; })[0] || null;
};

/**
 * @param {string} id
 * @return {boolean}
 */
Sprite.prototype.has = function has (id) {
  return this.find(id) !== null;
};

/**
 * @return {string}
 */
Sprite.prototype.stringify = function stringify () {
  var ref = this.config;
    var attrs = ref.attrs;
  var stringifiedSymbols = this.symbols.map(function (s) { return s.stringify(); }).join('');
  return wrapInSvgString(stringifiedSymbols, attrs);
};

/**
 * @return {string}
 */
Sprite.prototype.toString = function toString () {
  return this.stringify();
};

Sprite.prototype.destroy = function destroy () {
  this.symbols.forEach(function (s) { return s.destroy(); });
};

var SpriteSymbol = function SpriteSymbol(ref) {
  var id = ref.id;
  var viewBox = ref.viewBox;
  var content = ref.content;

  this.id = id;
  this.viewBox = viewBox;
  this.content = content;
};

/**
 * @return {string}
 */
SpriteSymbol.prototype.stringify = function stringify () {
  return this.content;
};

/**
 * @return {string}
 */
SpriteSymbol.prototype.toString = function toString () {
  return this.stringify();
};

SpriteSymbol.prototype.destroy = function destroy () {
    var this$1 = this;

  ['id', 'viewBox', 'content'].forEach(function (prop) { return delete this$1[prop]; });
};

/**
 * @param {string} content
 * @return {Element}
 */
var parse = function (content) {
  var hasImportNode = !!document.importNode;
  var doc = new DOMParser().parseFromString(content, 'image/svg+xml').documentElement;

  /**
   * Fix for browser which are throwing WrongDocumentError
   * if you insert an element which is not part of the document
   * @see http://stackoverflow.com/a/7986519/4624403
   */
  if (hasImportNode) {
    return document.importNode(doc, true);
  }

  return doc;
};

var BrowserSpriteSymbol = (function (SpriteSymbol$$1) {
  function BrowserSpriteSymbol () {
    SpriteSymbol$$1.apply(this, arguments);
  }

  if ( SpriteSymbol$$1 ) BrowserSpriteSymbol.__proto__ = SpriteSymbol$$1;
  BrowserSpriteSymbol.prototype = Object.create( SpriteSymbol$$1 && SpriteSymbol$$1.prototype );
  BrowserSpriteSymbol.prototype.constructor = BrowserSpriteSymbol;

  var prototypeAccessors = { isMounted: {} };

  prototypeAccessors.isMounted.get = function () {
    return !!this.node;
  };

  /**
   * @param {Element} node
   * @return {BrowserSpriteSymbol}
   */
  BrowserSpriteSymbol.createFromExistingNode = function createFromExistingNode (node) {
    return new BrowserSpriteSymbol({
      id: node.getAttribute('id'),
      viewBox: node.getAttribute('viewBox'),
      content: node.outerHTML
    });
  };

  BrowserSpriteSymbol.prototype.destroy = function destroy () {
    if (this.isMounted) {
      this.unmount();
    }
    SpriteSymbol$$1.prototype.destroy.call(this);
  };

  /**
   * @param {Element|string} target
   * @return {Element}
   */
  BrowserSpriteSymbol.prototype.mount = function mount (target) {
    if (this.isMounted) {
      return this.node;
    }

    var mountTarget = typeof target === 'string' ? document.querySelector(target) : target;
    var node = this.render();
    this.node = node;

    mountTarget.appendChild(node);

    return node;
  };

  /**
   * @return {Element}
   */
  BrowserSpriteSymbol.prototype.render = function render () {
    var content = this.stringify();
    return parse(wrapInSvgString(content)).childNodes[0];
  };

  BrowserSpriteSymbol.prototype.unmount = function unmount () {
    this.node.parentNode.removeChild(this.node);
  };

  Object.defineProperties( BrowserSpriteSymbol.prototype, prototypeAccessors );

  return BrowserSpriteSymbol;
}(SpriteSymbol));

var defaultConfig$1 = {
  /**
   * Should following options be automatically configured:
   * - `syncUrlsWithBaseTag`
   * - `locationChangeAngularEmitter`
   * - `moveGradientsOutsideSymbol`
   * @type {boolean}
   */
  autoConfigure: true,

  /**
   * Default mounting selector
   * @type {string}
   */
  mountTo: 'body',

  /**
   * Fix disappearing SVG elements when <base href> exists.
   * Executes when sprite mounted.
   * @see http://stackoverflow.com/a/18265336/796152
   * @see https://github.com/everdimension/angular-svg-base-fix
   * @see https://github.com/angular/angular.js/issues/8934#issuecomment-56568466
   * @type {boolean}
   */
  syncUrlsWithBaseTag: false,

  /**
   * Should sprite listen custom location change event
   * @type {boolean}
   */
  listenLocationChangeEvent: true,

  /**
   * Custom window event name which should be emitted to update sprite urls
   * @type {string}
   */
  locationChangeEvent: 'locationChange',

  /**
   * Emit location change event in Angular automatically
   * @type {boolean}
   */
  locationChangeAngularEmitter: false,

  /**
   * Selector to find symbols usages when updating sprite urls
   * @type {string}
   */
  usagesToUpdate: 'use[*|href]',

  /**
   * Fix Firefox bug when gradients and patterns don't work if they are within a symbol.
   * Executes when sprite is rendered, but not mounted.
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=306674
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=353575
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1235364
   * @type {boolean}
   */
  moveGradientsOutsideSymbol: false
};

/**
 * @param {*} arrayLike
 * @return {Array}
 */
var arrayFrom = function (arrayLike) {
  return Array.prototype.slice.call(arrayLike, 0);
};

var browser = {
  isChrome: function () { return /chrome/i.test(navigator.userAgent); },
  isFirefox: function () { return /firefox/i.test(navigator.userAgent); },

  // https://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx
  isIE: function () { return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent); },
  isEdge: function () { return /edge/i.test(navigator.userAgent); }
};

/**
 * @param {string} name
 * @param {*} data
 */
var dispatchEvent = function (name, data) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent(name, false, false, data);
  window.dispatchEvent(event);
};

/**
 * IE doesn't evaluate <style> tags in SVGs that are dynamically added to the page.
 * This trick will trigger IE to read and use any existing SVG <style> tags.
 * @see https://github.com/iconic/SVGInjector/issues/23
 * @see https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10898469/
 *
 * @param {Element} node DOM Element to search <style> tags in
 * @return {Array<HTMLStyleElement>}
 */
var evalStylesIEWorkaround = function (node) {
  var updatedNodes = [];

  arrayFrom(node.querySelectorAll('style'))
    .forEach(function (style) {
      style.textContent += '';
      updatedNodes.push(style);
    });

  return updatedNodes;
};

/**
 * @param {string} [url] If not provided - current URL will be used
 * @return {string}
 */
var getUrlWithoutFragment = function (url) {
  return (url || window.location.href).split('#')[0];
};

/* global angular */
/**
 * @param {string} eventName
 */
var locationChangeAngularEmitter = function (eventName) {
  angular.module('ng').run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$locationChangeSuccess', function (e, newUrl, oldUrl) {
      dispatchEvent(eventName, { oldUrl: oldUrl, newUrl: newUrl });
    });
  }]);
};

var defaultSelector = 'linearGradient, radialGradient, pattern, mask, clipPath';

/**
 * @param {Element} svg
 * @param {string} [selector]
 * @return {Element}
 */
var moveGradientsOutsideSymbol = function (svg, selector) {
  if ( selector === void 0 ) selector = defaultSelector;

  arrayFrom(svg.querySelectorAll('symbol')).forEach(function (symbol) {
    arrayFrom(symbol.querySelectorAll(selector)).forEach(function (node) {
      symbol.parentNode.insertBefore(node, symbol);
    });
  });
  return svg;
};

/**
 * @param {NodeList} nodes
 * @param {Function} [matcher]
 * @return {Attr[]}
 */
function selectAttributes(nodes, matcher) {
  var attrs = arrayFrom(nodes).reduce(function (acc, node) {
    if (!node.attributes) {
      return acc;
    }

    var arrayfied = arrayFrom(node.attributes);
    var matched = matcher ? arrayfied.filter(matcher) : arrayfied;
    return acc.concat(matched);
  }, []);

  return attrs;
}

/**
 * @param {NodeList|Node} nodes
 * @param {boolean} [clone=true]
 * @return {string}
 */

var xLinkNS = namespaces_1.xlink.uri;
var xLinkAttrName = 'xlink:href';

// eslint-disable-next-line no-useless-escape
var specialUrlCharsPattern = /[{}|\\\^\[\]`"<>]/g;

function encoder(url) {
  return url.replace(specialUrlCharsPattern, function (match) {
    return ("%" + (match[0].charCodeAt(0).toString(16).toUpperCase()));
  });
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

/**
 * @param {NodeList} nodes
 * @param {string} startsWith
 * @param {string} replaceWith
 * @return {NodeList}
 */
function updateReferences(nodes, startsWith, replaceWith) {
  arrayFrom(nodes).forEach(function (node) {
    var href = node.getAttribute(xLinkAttrName);
    if (href && href.indexOf(startsWith) === 0) {
      var newUrl = href.replace(startsWith, replaceWith);
      node.setAttributeNS(xLinkNS, xLinkAttrName, newUrl);
    }
  });

  return nodes;
}

/**
 * List of SVG attributes to update url() target in them
 */
var attList = [
  'clipPath',
  'colorProfile',
  'src',
  'cursor',
  'fill',
  'filter',
  'marker',
  'markerStart',
  'markerMid',
  'markerEnd',
  'mask',
  'stroke',
  'style'
];

var attSelector = attList.map(function (attr) { return ("[" + attr + "]"); }).join(',');

/**
 * Update URLs in svg image (like `fill="url(...)"`) and update referencing elements
 * @param {Element} svg
 * @param {NodeList} references
 * @param {string|RegExp} startsWith
 * @param {string} replaceWith
 * @return {void}
 *
 * @example
 * const sprite = document.querySelector('svg.sprite');
 * const usages = document.querySelectorAll('use');
 * updateUrls(sprite, usages, '#', 'prefix#');
 */
var updateUrls = function (svg, references, startsWith, replaceWith) {
  var startsWithEncoded = encoder(startsWith);
  var replaceWithEncoded = encoder(replaceWith);

  var nodes = svg.querySelectorAll(attSelector);
  var attrs = selectAttributes(nodes, function (ref) {
    var localName = ref.localName;
    var value = ref.value;

    return attList.indexOf(localName) !== -1 && value.indexOf(("url(" + startsWithEncoded)) !== -1;
  });

  attrs.forEach(function (attr) { return attr.value = attr.value.replace(new RegExp(escapeRegExp(startsWithEncoded), 'g'), replaceWithEncoded); });
  updateReferences(references, startsWithEncoded, replaceWithEncoded);
};

/**
 * Internal emitter events
 * @enum
 * @private
 */
var Events = {
  MOUNT: 'mount',
  SYMBOL_MOUNT: 'symbol_mount'
};

var BrowserSprite = (function (Sprite$$1) {
  function BrowserSprite(cfg) {
    var this$1 = this;
    if ( cfg === void 0 ) cfg = {};

    Sprite$$1.call(this, deepmerge(defaultConfig$1, cfg));

    var emitter = mitt();
    this._emitter = emitter;
    this.node = null;

    var ref = this;
    var config = ref.config;

    if (config.autoConfigure) {
      this._autoConfigure(cfg);
    }

    if (config.syncUrlsWithBaseTag) {
      var baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
      emitter.on(Events.MOUNT, function () { return this$1.updateUrls('#', baseUrl); });
    }

    var handleLocationChange = this._handleLocationChange.bind(this);
    this._handleLocationChange = handleLocationChange;

    // Provide way to update sprite urls externally via dispatching custom window event
    if (config.listenLocationChangeEvent) {
      window.addEventListener(config.locationChangeEvent, handleLocationChange);
    }

    // Emit location change event in Angular automatically
    if (config.locationChangeAngularEmitter) {
      locationChangeAngularEmitter(config.locationChangeEvent);
    }

    // After sprite mounted
    emitter.on(Events.MOUNT, function (spriteNode) {
      if (config.moveGradientsOutsideSymbol) {
        moveGradientsOutsideSymbol(spriteNode);
      }
    });

    // After symbol mounted into sprite
    emitter.on(Events.SYMBOL_MOUNT, function (symbolNode) {
      if (config.moveGradientsOutsideSymbol) {
        moveGradientsOutsideSymbol(symbolNode.parentNode);
      }

      if (browser.isIE() || browser.isEdge()) {
        evalStylesIEWorkaround(symbolNode);
      }
    });
  }

  if ( Sprite$$1 ) BrowserSprite.__proto__ = Sprite$$1;
  BrowserSprite.prototype = Object.create( Sprite$$1 && Sprite$$1.prototype );
  BrowserSprite.prototype.constructor = BrowserSprite;

  var prototypeAccessors = { isMounted: {} };

  /**
   * @return {boolean}
   */
  prototypeAccessors.isMounted.get = function () {
    return !!this.node;
  };

  /**
   * Automatically configure following options
   * - `syncUrlsWithBaseTag`
   * - `locationChangeAngularEmitter`
   * - `moveGradientsOutsideSymbol`
   * @param {Object} cfg
   * @private
   */
  BrowserSprite.prototype._autoConfigure = function _autoConfigure (cfg) {
    var ref = this;
    var config = ref.config;

    if (typeof cfg.syncUrlsWithBaseTag === 'undefined') {
      config.syncUrlsWithBaseTag = typeof document.getElementsByTagName('base')[0] !== 'undefined';
    }

    if (typeof cfg.locationChangeAngularEmitter === 'undefined') {
        config.locationChangeAngularEmitter = typeof window.angular !== 'undefined';
    }

    if (typeof cfg.moveGradientsOutsideSymbol === 'undefined') {
      config.moveGradientsOutsideSymbol = browser.isFirefox();
    }
  };

  /**
   * @param {Event} event
   * @param {Object} event.detail
   * @param {string} event.detail.oldUrl
   * @param {string} event.detail.newUrl
   * @private
   */
  BrowserSprite.prototype._handleLocationChange = function _handleLocationChange (event) {
    var ref = event.detail;
    var oldUrl = ref.oldUrl;
    var newUrl = ref.newUrl;
    this.updateUrls(oldUrl, newUrl);
  };

  /**
   * Add new symbol. If symbol with the same id exists it will be replaced.
   * If sprite already mounted - `symbol.mount(sprite.node)` will be called.
   * @fires Events#SYMBOL_MOUNT
   * @param {BrowserSpriteSymbol} symbol
   * @return {boolean} `true` - symbol was added, `false` - replaced
   */
  BrowserSprite.prototype.add = function add (symbol) {
    var sprite = this;
    var isNewSymbol = Sprite$$1.prototype.add.call(this, symbol);

    if (this.isMounted && isNewSymbol) {
      symbol.mount(sprite.node);
      this._emitter.emit(Events.SYMBOL_MOUNT, symbol.node);
    }

    return isNewSymbol;
  };

  /**
   * Attach to existing DOM node
   * @param {string|Element} target
   * @return {Element|null} attached DOM Element. null if node to attach not found.
   */
  BrowserSprite.prototype.attach = function attach (target) {
    var this$1 = this;

    var sprite = this;

    if (sprite.isMounted) {
      return sprite.node;
    }

    /** @type Element */
    var node = typeof target === 'string' ? document.querySelector(target) : target;
    sprite.node = node;

    // Already added symbols needs to be mounted
    this.symbols.forEach(function (symbol) {
      symbol.mount(sprite.node);
      this$1._emitter.emit(Events.SYMBOL_MOUNT, symbol.node);
    });

    // Create symbols from existing DOM nodes, add and mount them
    arrayFrom(node.querySelectorAll('symbol'))
      .forEach(function (symbolNode) {
        var symbol = BrowserSpriteSymbol.createFromExistingNode(symbolNode);
        symbol.node = symbolNode; // hack to prevent symbol mounting to sprite when adding
        sprite.add(symbol);
      });

    this._emitter.emit(Events.MOUNT, node);

    return node;
  };

  BrowserSprite.prototype.destroy = function destroy () {
    var ref = this;
    var config = ref.config;
    var symbols = ref.symbols;
    var _emitter = ref._emitter;

    symbols.forEach(function (s) { return s.destroy(); });

    _emitter.off('*');
    window.removeEventListener(config.locationChangeEvent, this._handleLocationChange);

    if (this.isMounted) {
      this.unmount();
    }
  };

  /**
   * @fires Events#MOUNT
   * @param {string|Element} [target]
   * @param {boolean} [prepend=false]
   * @return {Element|null} rendered sprite node. null if mount node not found.
   */
  BrowserSprite.prototype.mount = function mount (target, prepend) {
    if ( target === void 0 ) target = this.config.mountTo;
    if ( prepend === void 0 ) prepend = false;

    var sprite = this;

    if (sprite.isMounted) {
      return sprite.node;
    }

    var mountNode = typeof target === 'string' ? document.querySelector(target) : target;
    var node = sprite.render();
    this.node = node;

    if (prepend && mountNode.childNodes[0]) {
      mountNode.insertBefore(node, mountNode.childNodes[0]);
    } else {
      mountNode.appendChild(node);
    }

    this._emitter.emit(Events.MOUNT, node);

    return node;
  };

  /**
   * @return {Element}
   */
  BrowserSprite.prototype.render = function render () {
    return parse(this.stringify());
  };

  /**
   * Detach sprite from the DOM
   */
  BrowserSprite.prototype.unmount = function unmount () {
    this.node.parentNode.removeChild(this.node);
  };

  /**
   * Update URLs in sprite and usage elements
   * @param {string} oldUrl
   * @param {string} newUrl
   * @return {boolean} `true` - URLs was updated, `false` - sprite is not mounted
   */
  BrowserSprite.prototype.updateUrls = function updateUrls$1 (oldUrl, newUrl) {
    if (!this.isMounted) {
      return false;
    }

    var usages = document.querySelectorAll(this.config.usagesToUpdate);

    updateUrls(
      this.node,
      usages,
      ((getUrlWithoutFragment(oldUrl)) + "#"),
      ((getUrlWithoutFragment(newUrl)) + "#")
    );

    return true;
  };

  Object.defineProperties( BrowserSprite.prototype, prototypeAccessors );

  return BrowserSprite;
}(Sprite));

var ready$1 = createCommonjsModule(function (module) {
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  { module.exports = definition(); }

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);


  if (!loaded)
  { doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener);
    loaded = 1;
    while (listener = fns.shift()) { listener(); }
  }); }

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn);
  }

});
});

var spriteNodeId = '__SVG_SPRITE_NODE__';
var spriteGlobalVarName = '__SVG_SPRITE__';
var isSpriteExists = !!window[spriteGlobalVarName];

// eslint-disable-next-line import/no-mutable-exports
var sprite;

if (isSpriteExists) {
  sprite = window[spriteGlobalVarName];
} else {
  sprite = new BrowserSprite({
    attrs: {
      id: spriteNodeId,
      'aria-hidden': 'true'
    }
  });
  window[spriteGlobalVarName] = sprite;
}

var loadSprite = function () {
  /**
   * Check for page already contains sprite node
   * If found - attach to and reuse it's content
   * If not - render and mount the new sprite
   */
  var existing = document.getElementById(spriteNodeId);

  if (existing) {
    sprite.attach(existing);
  } else {
    sprite.mount(document.body, true);
  }
};

if (document.body) {
  loadSprite();
} else {
  ready$1(loadSprite);
}

var sprite$1 = sprite;

return sprite$1;

})));


/***/ }),

/***/ 3744:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
// runtime helper for setting properties on components
// in a tree-shakable way
exports.Z = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
        target[key] = val;
    }
    return target;
};


/***/ }),

/***/ 7290:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./back.svg": 3772,
	"./close.svg": 8654,
	"./delete.svg": 2884,
	"./drag.svg": 1046,
	"./handwrite.svg": 6262,
	"./upper.svg": 676
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 7290;

/***/ }),

/***/ 7203:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__7203__;

/***/ }),

/***/ 8593:
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ entry_lib; }
});

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
/* eslint-disable no-var */
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (false) { var getCurrentScript; }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__(7203);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/index.vue?vue&type=template&id=b63f1f08&ts=true

const _hoisted_1 = {
  class: "key-board-container"
};
const _hoisted_2 = {
  class: "key-board-area"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Result = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.resolveComponent)("Result");
  const _component_DefaultBoard = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.resolveComponent)("DefaultBoard");
  const _component_HandBoard = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.resolveComponent)("HandBoard");
  const _component_svg_icon = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.resolveComponent)("svg-icon");
  const _directive_handleDrag = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.resolveDirective)("handleDrag");
  return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_.Transition, {
    name: _ctx.animateClass || 'move-bottom-to-top'
  }, {
    default: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.withCtx)(() => [_ctx.visible ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", {
      key: 0,
      class: "key-board",
      onMousedown: _cache[0] || (_cache[0] = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.withModifiers)(() => {}, ["prevent"]))
    }, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("div", _hoisted_1, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_.createVNode)(_component_Result, {
      data: _ctx.resultVal,
      onChange: _ctx.change
    }, null, 8, ["data", "onChange"]), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("div", _hoisted_2, [_ctx.showMode === 'default' ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createBlock)(_component_DefaultBoard, {
      key: 0,
      ref: "defaultBoardRef",
      onTrigger: _ctx.trigger,
      onChange: _ctx.change,
      onTranslate: _ctx.translate
    }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createCommentVNode)("", true), _ctx.showMode === 'handwrite' ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createBlock)(_component_HandBoard, {
      key: 1,
      onTrigger: _ctx.trigger,
      onChange: _ctx.change
    }, null, 8, ["onTrigger", "onChange"])) : (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createCommentVNode)("", true)])]), _ctx.showHandleBar ? (0,external_commonjs_vue_commonjs2_vue_root_Vue_.withDirectives)(((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", {
      key: 0,
      class: "key-board-drag-handle",
      style: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.normalizeStyle)({
        color: _ctx.color
      })
    }, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("span", null, (0,external_commonjs_vue_commonjs2_vue_root_Vue_.toDisplayString)(_ctx.dargHandleText || '将键盘拖到您喜欢的位置'), 1), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createVNode)(_component_svg_icon, {
      "icon-class": "drag"
    })], 4)), [[_directive_handleDrag]]) : (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createCommentVNode)("", true)], 32)) : (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createCommentVNode)("", true)]),
    _: 1
  }, 8, ["name"]);
}
;// CONCATENATED MODULE: ./packages/index.vue?vue&type=template&id=b63f1f08&ts=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(7658);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
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
;// CONCATENATED MODULE: ./packages/hooks/useEventEmitter.ts


class EventEmitter {
  constructor() {
    _defineProperty(this, "listeners", void 0);
    this.listeners = {};
  }
  on(type, cb) {
    let cbs = this.listeners[type];
    if (!cbs) {
      cbs = [];
    }
    cbs.push(cb);
    this.listeners[type] = cbs;
    return () => {
      this.remove(type, cb);
    };
  }
  emit(type, ...args) {
    const cbs = this.listeners[type];
    if (Array.isArray(cbs)) {
      for (let i = 0; i < cbs.length; i++) {
        const cb = cbs[i];
        if (typeof cb === 'function') {
          cb(...args);
        }
      }
    }
  }
  remove(type, cb) {
    if (cb) {
      let cbs = this.listeners[type];
      if (!cbs) return;
      cbs = cbs.filter(eMap => eMap !== cb);
      this.listeners[type] = cbs;
    } else {
      this.listeners[type] = null;
      delete this.listeners[type];
    }
  }
}
/* harmony default export */ var useEventEmitter = (new EventEmitter());
;// CONCATENATED MODULE: ./packages/directive/drag.ts


const handleDrag = {
  mounted(target, binding, vnode) {
    const targetParent = target.parentNode;
    // PC端
    target.onmousedown = e => {
      //算出鼠标相对元素的位置
      const disX = e.clientX - targetParent.offsetLeft;
      const disY = e.clientY - targetParent.offsetTop;
      document.onmousemove = e => {
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const left = e.clientX - disX;
        const top = e.clientY - disY;
        //移动当前元素
        targetParent.style.left = left + 'px';
        targetParent.style.top = top + 'px';
      };
      document.onmouseup = () => {
        (0,external_commonjs_vue_commonjs2_vue_root_Vue_.nextTick)(() => {
          useEventEmitter.emit("updateBound");
        });
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
    // 兼容移动端
    target.ontouchstart = e => {
      //算出鼠标相对元素的位置
      const clientX = e.touches[0].pageX;
      const clientY = e.touches[0].pageY;
      const disX = clientX - targetParent.offsetLeft;
      const disY = clientY - targetParent.offsetTop;
      document.ontouchmove = e => {
        const clientX = e.touches[0].pageX;
        const clientY = e.touches[0].pageY;
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const left = clientX - disX;
        const top = clientY - disY;
        //移动当前元素
        targetParent.style.left = left + 'px';
        targetParent.style.top = top + 'px';
      };
      document.ontouchend = () => {
        (0,external_commonjs_vue_commonjs2_vue_root_Vue_.nextTick)(() => {
          useEventEmitter.emit("updateBound");
        });
        document.ontouchmove = null;
        document.ontouchend = null;
      };
    };
  }
};
/* harmony default export */ var drag = (handleDrag);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/result/index.vue?vue&type=template&id=02e63132&scoped=true&ts=true

const _withScopeId = n => (_pushScopeId("data-v-02e63132"), n = n(), _popScopeId(), n);
const resultvue_type_template_id_02e63132_scoped_true_ts_true_hoisted_1 = {
  key: 0,
  class: "key-board-code-show"
};
const resultvue_type_template_id_02e63132_scoped_true_ts_true_hoisted_2 = {
  class: "key-board-result-show"
};
const _hoisted_3 = {
  class: "key-board-result-show-container"
};
const _hoisted_4 = ["onClick"];
const _hoisted_5 = {
  key: 0,
  class: "key-board-result-show-more"
};
function resultvue_type_template_id_02e63132_scoped_true_ts_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.status === 'CN' || _ctx.status === 'handwrite' ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", {
    key: 0,
    class: "key-board-result",
    style: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.normalizeStyle)({
      color: _ctx.color
    })
  }, [_ctx.status === 'CN' ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", resultvue_type_template_id_02e63132_scoped_true_ts_true_hoisted_1, (0,external_commonjs_vue_commonjs2_vue_root_Vue_.toDisplayString)(_ctx.data.code), 1)) : (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createCommentVNode)("", true), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("div", resultvue_type_template_id_02e63132_scoped_true_ts_true_hoisted_2, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("div", _hoisted_3, [((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(true), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_.Fragment, null, (0,external_commonjs_vue_commonjs2_vue_root_Vue_.renderList)(_ctx.showList[_ctx.showIndex], (key, index) => {
    return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("span", {
      key: index,
      onClick: $event => _ctx.selectWord(key)
    }, (0,external_commonjs_vue_commonjs2_vue_root_Vue_.toDisplayString)(index + 1) + "." + (0,external_commonjs_vue_commonjs2_vue_root_Vue_.toDisplayString)(key), 9, _hoisted_4);
  }), 128))]), _ctx.valueList.length > 11 ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", _hoisted_5, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("span", {
    style: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.normalizeStyle)(_ctx.getStyle),
    onClick: _cache[0] || (_cache[0] =
    //@ts-ignore
    (...args) => _ctx.upper && _ctx.upper(...args))
  }, null, 4), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("span", {
    style: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.normalizeStyle)(_ctx.getStyle),
    onClick: _cache[1] || (_cache[1] =
    //@ts-ignore
    (...args) => _ctx.lower && _ctx.lower(...args))
  }, null, 4)])) : (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createCommentVNode)("", true)])], 4)) : (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createCommentVNode)("", true);
}
;// CONCATENATED MODULE: ./packages/components/result/index.vue?vue&type=template&id=02e63132&scoped=true&ts=true

;// CONCATENATED MODULE: ./packages/utils/index.ts

/**
 * @description 按特定长度切割数组
 * @param {T[]} array 需要分组的数组
 * @param {number} subGroupLength 切割长度
 * @returns {T[][]} 切割后的数组
 */
const groupSplitArray = (array, subGroupLength) => {
  let index = 0;
  const newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
};
;// CONCATENATED MODULE: ./packages/context/keyboardContext.ts

const KEYBOARD_CONTEXT = Symbol("KEYBOARD_CONTEXT");
const getProvide = parmas => {
  (0,external_commonjs_vue_commonjs2_vue_root_Vue_.provide)(KEYBOARD_CONTEXT, parmas);
};
const getInject = () => {
  return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.inject)(KEYBOARD_CONTEXT);
};
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/result/index.vue?vue&type=script&lang=ts




/* harmony default export */ var resultvue_type_script_lang_ts = ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.defineComponent)({
  props: {
    data: Object
  },
  emits: ["change"],
  setup(props, {
    emit
  }) {
    const injectData = getInject();
    const getStyle = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.computed)(() => ({
      borderTopColor: injectData?.color
    }));
    const resultData = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.reactive)({
      status: "",
      valueList: [],
      showList: [],
      showIndex: 0
    });
    /**
     * @description 上一页
     */
    function upper() {
      if (resultData.showIndex === 0) return;
      resultData.showIndex -= 1;
    }
    /**
     * @description 下一页
     */
    function lower() {
      if (resultData.showIndex === resultData.showList.length - 1) return;
      resultData.showIndex += 1;
    }
    /**
     * @description 重置
     */
    function reset() {
      resultData.showIndex = 0;
      resultData.showList = [];
      resultData.valueList = [];
      useEventEmitter.emit("resultReset");
    }
    /**
     * @description 上一页
     */
    function selectWord(word) {
      reset();
      emit("change", word);
    }
    // 监听data的变化
    (0,external_commonjs_vue_commonjs2_vue_root_Vue_.watch)(() => props.data, newVal => {
      resultData.showIndex = 0;
      resultData.valueList = newVal?.value?.split("") || [];
      if (resultData.valueList.length === 0) {
        resultData.showList = [];
        return;
      }
      resultData.showList = groupSplitArray(resultData.valueList, 11);
    }, {
      immediate: true
    });
    (0,external_commonjs_vue_commonjs2_vue_root_Vue_.onMounted)(() => {
      useEventEmitter.on("keyBoardChange", status => {
        // 会引起高度变化 需要重新计算画板
        useEventEmitter.emit("updateBound");
        resultData.status = status;
        reset();
      });
      useEventEmitter.on("getWordsFromServer", serverData => {
        const _valueList = Array.from(new Set(serverData.replace(/\s+/g, "").split("")));
        resultData.valueList = _valueList;
        resultData.showList = groupSplitArray(_valueList, 11);
      });
    });
    (0,external_commonjs_vue_commonjs2_vue_root_Vue_.onUnmounted)(() => {
      useEventEmitter.remove("keyBoardChange");
      useEventEmitter.remove("getWordsFromServer");
    });
    return {
      color: injectData?.color,
      upper,
      lower,
      getStyle,
      selectWord,
      ...(0,external_commonjs_vue_commonjs2_vue_root_Vue_.toRefs)(resultData)
    };
  }
}));
;// CONCATENATED MODULE: ./packages/components/result/index.vue?vue&type=script&lang=ts
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-78.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-78.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/@vue/cli-service/node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-78.use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-78.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/result/index.vue?vue&type=style&index=0&id=02e63132&scoped=true&lang=less
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./packages/components/result/index.vue?vue&type=style&index=0&id=02e63132&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(3744);
;// CONCATENATED MODULE: ./packages/components/result/index.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(resultvue_type_script_lang_ts, [['render',resultvue_type_template_id_02e63132_scoped_true_ts_true_render],['__scopeId',"data-v-02e63132"]])

/* harmony default export */ var result = (__exports__);
// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__(9669);
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);
;// CONCATENATED MODULE: ./packages/helper/axiosConfig.ts

// 超时时间
const TIMEOUT = 15000;
/**
 * @description axiso 配置
 * @param {string} url
 */
const axiosConfig = url => {
  // 设置axios 接口
  (axios_default()).defaults.baseURL = url;
  (axios_default()).defaults.timeout = TIMEOUT;
  (axios_default()).defaults.headers.post["Content-Type"] = 'application/json;charset=UTF-8';
};
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/svgIcon/svgIcon.vue?vue&type=template&id=719ce671&ts=true

const svgIconvue_type_template_id_719ce671_ts_true_hoisted_1 = ["xlink:href"];
function svgIconvue_type_template_id_719ce671_ts_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("svg", {
    class: "svg-icon",
    style: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.normalizeStyle)({
      stroke: _ctx.color
    })
  }, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("use", {
    "xlink:href": _ctx.iconName
  }, null, 8, svgIconvue_type_template_id_719ce671_ts_true_hoisted_1)], 4);
}
;// CONCATENATED MODULE: ./packages/components/svgIcon/svgIcon.vue?vue&type=template&id=719ce671&ts=true

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/svgIcon/svgIcon.vue?vue&type=script&lang=ts


/* harmony default export */ var svgIconvue_type_script_lang_ts = ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.defineComponent)({
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const injectData = getInject();
    const iconName = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.computed)(() => `#icon-${props.iconClass}`);
    return {
      color: injectData?.color,
      iconName
    };
  }
}));
;// CONCATENATED MODULE: ./packages/components/svgIcon/svgIcon.vue?vue&type=script&lang=ts
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-78.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-78.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/@vue/cli-service/node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-78.use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-78.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/svgIcon/svgIcon.vue?vue&type=style&index=0&id=719ce671&lang=less
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./packages/components/svgIcon/svgIcon.vue?vue&type=style&index=0&id=719ce671&lang=less

;// CONCATENATED MODULE: ./packages/components/svgIcon/svgIcon.vue




;


const svgIcon_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(svgIconvue_type_script_lang_ts, [['render',svgIconvue_type_template_id_719ce671_ts_true_render]])

/* harmony default export */ var svgIcon = (svgIcon_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/handBoards/index.vue?vue&type=template&id=0f3f3147&scoped=true&ts=true

const handBoardsvue_type_template_id_0f3f3147_scoped_true_ts_true_withScopeId = n => (_pushScopeId("data-v-0f3f3147"), n = n(), _popScopeId(), n);
const handBoardsvue_type_template_id_0f3f3147_scoped_true_ts_true_hoisted_1 = {
  class: "hand-write-board"
};
const handBoardsvue_type_template_id_0f3f3147_scoped_true_ts_true_hoisted_2 = {
  class: "hand-write-board-opers"
};
function handBoardsvue_type_template_id_0f3f3147_scoped_true_ts_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PaintBoard = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.resolveComponent)("PaintBoard");
  const _component_KeyCodeButton = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.resolveComponent)("KeyCodeButton");
  return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", handBoardsvue_type_template_id_0f3f3147_scoped_true_ts_true_hoisted_1, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_.createVNode)(_component_PaintBoard, {
    lib: _ctx.isCn ? 'CN' : 'EN'
  }, null, 8, ["lib"]), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("div", handBoardsvue_type_template_id_0f3f3147_scoped_true_ts_true_hoisted_2, [((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(true), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_.Fragment, null, (0,external_commonjs_vue_commonjs2_vue_root_Vue_.renderList)(_ctx.handBoardOperList, key => {
    return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createBlock)(_component_KeyCodeButton, {
      key: key.type,
      type: key.type,
      data: key.data,
      isCn: _ctx.isCn,
      onClick: _ctx.click
    }, null, 8, ["type", "data", "isCn", "onClick"]);
  }), 128))])]);
}
;// CONCATENATED MODULE: ./packages/components/handBoards/index.vue?vue&type=template&id=0f3f3147&scoped=true&ts=true

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/handBoards/paintBoard.vue?vue&type=template&id=69382e5a&ts=true

const paintBoardvue_type_template_id_69382e5a_ts_true_hoisted_1 = {
  class: "paint-board"
};
const paintBoardvue_type_template_id_69382e5a_ts_true_hoisted_2 = ["width", "height"];
function paintBoardvue_type_template_id_69382e5a_ts_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", paintBoardvue_type_template_id_69382e5a_ts_true_hoisted_1, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("canvas", {
    ref: "canvasRef",
    width: _ctx.width,
    height: _ctx.height,
    onTouchstart: _cache[0] || (_cache[0] =
    //@ts-ignore
    (...args) => _ctx.down && _ctx.down(...args)),
    onTouchmove: _cache[1] || (_cache[1] =
    //@ts-ignore
    (...args) => _ctx.move && _ctx.move(...args)),
    onTouchend: _cache[2] || (_cache[2] =
    //@ts-ignore
    (...args) => _ctx.mouseup && _ctx.mouseup(...args)),
    onMousedown: _cache[3] || (_cache[3] =
    //@ts-ignore
    (...args) => _ctx.down && _ctx.down(...args)),
    onMousemove: _cache[4] || (_cache[4] =
    //@ts-ignore
    (...args) => _ctx.move && _ctx.move(...args)),
    onMouseup: _cache[5] || (_cache[5] =
    //@ts-ignore
    (...args) => _ctx.mouseup && _ctx.mouseup(...args)),
    onMouseleave: _cache[6] || (_cache[6] =
    //@ts-ignore
    (...args) => _ctx.mouseup && _ctx.mouseup(...args))
  }, null, 40, paintBoardvue_type_template_id_69382e5a_ts_true_hoisted_2)]);
}
;// CONCATENATED MODULE: ./packages/components/handBoards/paintBoard.vue?vue&type=template&id=69382e5a&ts=true

;// CONCATENATED MODULE: ./packages/server/index.ts

/**
 * @description axiso 配置
 * @param {number[]} lpXis 轨迹X
 * @param {number[]} lpYis 轨迹Y
 * @param {number[]} lpCis 轨迹标志位
 * @param {string} lib 中英文
 */
const getWordFromHandWrite = async (lpXis, lpYis, lpCis, lib) => await axios_default().post('', {
  lib,
  lpXis,
  lpYis,
  lpCis
});
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/handBoards/paintBoard.vue?vue&type=script&lang=ts





// canvas上下文
let ctx;
// 定时器id
let timer;
/* harmony default export */ var paintBoardvue_type_script_lang_ts = ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.defineComponent)({
  name: "PaintBoard",
  props: {
    lib: String
  },
  setup(props) {
    const injectData = getInject();
    const paintBoardData = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.reactive)({
      // 宽
      width: 0,
      // 高
      height: 0,
      // 是否按下
      isMouseDown: false,
      // 当前canvas相距左上角x
      x: 0,
      // 当前canvas相距左上角y
      y: 0,
      // 旧x坐标
      oldX: 0,
      // 旧y坐标
      oldY: 0,
      //轨迹X
      clickX: [],
      //轨迹Y
      clickY: [],
      //轨迹标志位，为1则是终点
      clickC: []
    });
    const canvasRef = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.ref)(null);
    /**
     * @description 获取手写板书写文字
     */
    async function getWords() {
      const {
        data
      } = await getWordFromHandWrite(paintBoardData.clickX, paintBoardData.clickY, paintBoardData.clickC, props.lib);
      useEventEmitter.emit("getWordsFromServer", data?.v || "");
    }
    /**
     * @description canvas重置
     */
    function reload() {
      if (!canvasRef.value || !ctx) return;
      paintBoardData.clickX = [];
      paintBoardData.clickY = [];
      paintBoardData.clickC = [];
      ctx.clearRect(0, 0, paintBoardData.width, paintBoardData.height);
    }
    /**
     * @description 获取x坐标
     */
    function getCx(event) {
      // mouse事件
      if (event.type.includes("mouse")) {
        const _event = event;
        return Math.floor(_event.clientX - paintBoardData.x);
      } else if (event.type.includes("touch")) {
        // touch事件
        const _event = event;
        return Math.floor(_event.targetTouches[0]?.clientX - paintBoardData.x);
      }
      return 0;
    }
    /**
     * @description 获取y坐标
     */
    function getCy(event) {
      // mouse事件
      if (event.type.includes("mouse")) {
        const _event = event;
        return Math.floor(_event.clientY - paintBoardData.y);
      } else if (event.type.includes("touch")) {
        // touch事件
        const _event = event;
        return Math.floor(_event.targetTouches[0]?.clientY - paintBoardData.y);
      }
      return 0;
    }
    /**
     * @description 按下
     */
    function down(event) {
      if (!ctx) return;
      paintBoardData.isMouseDown = true;
      const cx = getCx(event);
      const cy = getCy(event);
      clearTimeout(timer);
      paintBoardData.oldX = cx;
      paintBoardData.oldY = cy;
      ctx.beginPath();
    }
    /**
     * @description 移动
     */
    function move(event) {
      if (!ctx) return;
      event.preventDefault();
      if (paintBoardData.isMouseDown) {
        const cx = getCx(event);
        const cy = getCy(event);
        paintBoardData.clickX.push(cx);
        paintBoardData.clickY.push(cy);
        paintBoardData.clickC.push(0);
        //画图
        ctx.strokeStyle = injectData?.color;
        ctx.fillStyle = injectData?.color;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.moveTo(paintBoardData.oldX, paintBoardData.oldY);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        paintBoardData.oldX = cx;
        paintBoardData.oldY = cy;
      }
    }
    /**
     * @description 松开
     */
    function mouseup() {
      if (paintBoardData.isMouseDown) {
        paintBoardData.isMouseDown = false;
        timer = setTimeout(() => {
          reload();
        }, 1500);
        //标记最后一点为终点
        paintBoardData.clickC.pop();
        paintBoardData.clickC.push(1);
        getWords();
      }
    }
    /**
     * @description 更新尺寸以及位置
     */
    function updateBound() {
      (0,external_commonjs_vue_commonjs2_vue_root_Vue_.nextTick)(() => {
        if (!document.querySelector(".paint-board")) return;
        const bound = document.querySelector(".paint-board").getBoundingClientRect();
        paintBoardData.x = bound.x;
        paintBoardData.y = bound.y;
        paintBoardData.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width);
        paintBoardData.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
      });
    }
    /**
     * @description 画板初始化
     */
    function paintBoardInit() {
      ctx = canvasRef.value?.getContext("2d");
      reload();
      updateBound();
      window.addEventListener("animationend", updateBound);
      window.addEventListener("resize", updateBound);
      window.addEventListener("scroll", updateBound);
    }
    (0,external_commonjs_vue_commonjs2_vue_root_Vue_.onMounted)(() => {
      // 面板初始化
      paintBoardInit();
      // 拖动键盘需要
      useEventEmitter.on("updateBound", () => {
        updateBound();
      });
    });
    (0,external_commonjs_vue_commonjs2_vue_root_Vue_.onUnmounted)(() => {
      window.removeEventListener("animationend", updateBound);
      window.removeEventListener("resize", updateBound);
      window.removeEventListener("scroll", updateBound);
      useEventEmitter.remove("updateBound");
    });
    return {
      ...(0,external_commonjs_vue_commonjs2_vue_root_Vue_.toRefs)(paintBoardData),
      move,
      down,
      mouseup,
      canvasRef
    };
  }
}));
;// CONCATENATED MODULE: ./packages/components/handBoards/paintBoard.vue?vue&type=script&lang=ts
 
;// CONCATENATED MODULE: ./packages/components/handBoards/paintBoard.vue




;
const paintBoard_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(paintBoardvue_type_script_lang_ts, [['render',paintBoardvue_type_template_id_69382e5a_ts_true_render]])

/* harmony default export */ var paintBoard = (paintBoard_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/keyCodeButtton/index.vue?vue&type=template&id=69c558ad&ts=true

const keyCodeButttonvue_type_template_id_69c558ad_ts_true_hoisted_1 = ["innerHTML"];
function keyCodeButttonvue_type_template_id_69c558ad_ts_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_svg_icon = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.resolveComponent)("svg-icon");
  return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("button", {
    class: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.normalizeClass)(['key-board-button', `key-board-button-${_ctx.type}`, {
      'key-board-button-active': _ctx.isUpper && _ctx.type === 'upper' || _ctx.isNum && _ctx.type === 'change2num' || _ctx.isSymbol && _ctx.type === '#+='
    }]),
    style: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.normalizeStyle)(_ctx.getStyle),
    onClick: _cache[0] || (_cache[0] =
    //@ts-ignore
    (...args) => _ctx.click && _ctx.click(...args)),
    onMouseenter: _cache[1] || (_cache[1] = $event => _ctx.isHoverStatus = true),
    onMouseleave: _cache[2] || (_cache[2] = $event => _ctx.isHoverStatus = false)
  }, [_ctx.type === 'upper' || _ctx.type === 'delete' || _ctx.type === 'handwrite' || _ctx.type === 'close' || _ctx.type === 'back' ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createBlock)(_component_svg_icon, {
    key: 0,
    "icon-class": _ctx.type
  }, null, 8, ["icon-class"])) : ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("span", {
    key: 1,
    innerHTML: _ctx.getCode
  }, null, 8, keyCodeButttonvue_type_template_id_69c558ad_ts_true_hoisted_1))], 38);
}
;// CONCATENATED MODULE: ./packages/components/keyCodeButtton/index.vue?vue&type=template&id=69c558ad&ts=true

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/keyCodeButtton/index.vue?vue&type=script&lang=ts



/* harmony default export */ var keyCodeButttonvue_type_script_lang_ts = ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.defineComponent)({
  name: "KeyCodeButton",
  components: {
    SvgIcon: svgIcon
  },
  props: {
    type: String,
    data: String,
    isCn: Boolean,
    isNum: Boolean,
    isUpper: Boolean,
    isSymbol: Boolean
  },
  emits: ["click"],
  setup(props, {
    emit
  }) {
    const injectData = getInject();
    const isHoverStatus = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.ref)(false);
    // computed
    const getCode = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.computed)(() => {
      if (props.type === "change2lang") {
        return props.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中";
      }
      return props.isUpper ? props.data.toUpperCase() : props.data;
    });
    const getStyle = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.computed)(() => {
      if (props.isUpper && props.type === "upper" || props.isNum && props.type === "change2num" || props.isSymbol && props.type === "#+=" || isHoverStatus.value) {
        return {
          color: "#f5f5f5",
          background: injectData?.color
        };
      } else {
        return {
          color: injectData?.color,
          background: "#f5f5f5"
        };
      }
    });
    /**
     * @description 按钮点击
     * @param {MouseEvent} event
     */
    function click(event) {
      event.preventDefault();
      emit("click", {
        data: props.isUpper ? props.data.toUpperCase() : props.data,
        type: props.type
      });
    }
    return {
      isHoverStatus,
      getStyle,
      getCode,
      click
    };
  }
}));
;// CONCATENATED MODULE: ./packages/components/keyCodeButtton/index.vue?vue&type=script&lang=ts
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-78.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-78.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/@vue/cli-service/node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-78.use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-78.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/keyCodeButtton/index.vue?vue&type=style&index=0&id=69c558ad&lang=less
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./packages/components/keyCodeButtton/index.vue?vue&type=style&index=0&id=69c558ad&lang=less

;// CONCATENATED MODULE: ./packages/components/keyCodeButtton/index.vue




;


const keyCodeButtton_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(keyCodeButttonvue_type_script_lang_ts, [['render',keyCodeButttonvue_type_template_id_69c558ad_ts_true_render]])

/* harmony default export */ var keyCodeButtton = (keyCodeButtton_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/handBoards/index.vue?vue&type=script&lang=ts





/* harmony default export */ var handBoardsvue_type_script_lang_ts = ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.defineComponent)({
  name: "PaintPart",
  components: {
    PaintBoard: paintBoard,
    KeyCodeButton: keyCodeButtton
  },
  setup() {
    const injectData = getInject();
    const paintPartData = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.reactive)({
      // 手写板部分按钮列表
      handBoardOperList: [{
        data: "中/EN",
        type: "change2lang"
      }, {
        data: "",
        type: "back"
      }, {
        data: "",
        type: "delete"
      }, {
        data: "",
        type: "close"
      }],
      // 是否中文
      isCn: true
    });
    /**
     * @description 按钮点击
     * @param {IKeyCode} parmas
     */
    function click({
      data,
      type
    }) {
      switch (type) {
        //  关闭
        case "close":
          {
            injectData?.closeKeyBoard();
          }
          break;
        //  回退
        case "back":
          {
            injectData?.changeDefaultBoard();
            useEventEmitter.emit("resultReset");
            useEventEmitter.emit("keyBoardChange", paintPartData.isCn && "CN");
          }
          break;
        //   语言
        case "change2lang":
          {
            paintPartData.isCn = !paintPartData.isCn;
          }
          break;
        // 删除
        case "delete":
          {
            useEventEmitter.emit("trigger", {
              data,
              type
            });
          }
          break;
      }
    }
    return {
      click,
      ...(0,external_commonjs_vue_commonjs2_vue_root_Vue_.toRefs)(paintPartData)
    };
  }
}));
;// CONCATENATED MODULE: ./packages/components/handBoards/index.vue?vue&type=script&lang=ts
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-78.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-78.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/@vue/cli-service/node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-78.use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-78.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/handBoards/index.vue?vue&type=style&index=0&id=0f3f3147&scoped=true&lang=less
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./packages/components/handBoards/index.vue?vue&type=style&index=0&id=0f3f3147&scoped=true&lang=less

;// CONCATENATED MODULE: ./packages/components/handBoards/index.vue




;


const handBoards_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(handBoardsvue_type_script_lang_ts, [['render',handBoardsvue_type_template_id_0f3f3147_scoped_true_ts_true_render],['__scopeId',"data-v-0f3f3147"]])

/* harmony default export */ var handBoards = (handBoards_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[4]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/default/index.vue?vue&type=template&id=4b78e5a1&scoped=true&ts=true

const defaultvue_type_template_id_4b78e5a1_scoped_true_ts_true_withScopeId = n => (_pushScopeId("data-v-4b78e5a1"), n = n(), _popScopeId(), n);
const defaultvue_type_template_id_4b78e5a1_scoped_true_ts_true_hoisted_1 = {
  class: "default-key-board"
};
const defaultvue_type_template_id_4b78e5a1_scoped_true_ts_true_hoisted_2 = {
  class: "line line4"
};
function defaultvue_type_template_id_4b78e5a1_scoped_true_ts_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_KeyCodeButton = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.resolveComponent)("KeyCodeButton");
  return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", defaultvue_type_template_id_4b78e5a1_scoped_true_ts_true_hoisted_1, [((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(true), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_.Fragment, null, (0,external_commonjs_vue_commonjs2_vue_root_Vue_.renderList)(_ctx.lineList, (line, index) => {
    return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", {
      class: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.normalizeClass)(['line', `line${index + 1}`]),
      key: index
    }, [((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(true), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_.Fragment, null, (0,external_commonjs_vue_commonjs2_vue_root_Vue_.renderList)(line, key => {
      return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createBlock)(_component_KeyCodeButton, {
        isUpper: _ctx.isUpper,
        key: key,
        type: key,
        data: key,
        isSymbol: _ctx.isSymbol,
        onClick: _ctx.click
      }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
    }), 128))], 2);
  }), 128)), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementVNode)("div", defaultvue_type_template_id_4b78e5a1_scoped_true_ts_true_hoisted_2, [((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(true), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_.Fragment, null, (0,external_commonjs_vue_commonjs2_vue_root_Vue_.renderList)(_ctx.line4, key => {
    return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createBlock)(_component_KeyCodeButton, {
      key: key.type,
      type: key.type,
      data: key.data,
      isCn: _ctx.isCn,
      isNum: _ctx.isNum,
      onClick: _ctx.click
    }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
  }), 128))])]);
}
;// CONCATENATED MODULE: ./packages/components/default/index.vue?vue&type=template&id=4b78e5a1&scoped=true&ts=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.unshift.js
var es_array_unshift = __webpack_require__(541);
;// CONCATENATED MODULE: ./packages/constants/key_code.ts
// 符号键盘字符
const SYMBOL_CODE = {
  line1: ['[', ']', '{', '}', '+', '-', '*', '/', '%', '='],
  line2: ['_', '—', '|', '~', '^', '《', '》', '$', '&'],
  line3: ['#+=', '……', ',', '?', '!', '.', '’', '\'', "delete"]
};
// 默认键盘字符
const DEFAULT_CODE = {
  line1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  line2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  line3: ['upper', 'z', 'x', 'c', 'v', 'b', 'n', 'm', "delete"]
};
// 数字键盘字符
const NUMBER_CODE = {
  line1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  line2: ['-', '/', ':', '(', ')', '¥', '@', '“', '”'],
  line3: ['#+=', '。', '，', '、', '？', '！', '.', ';', "delete"]
};
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/default/index.vue?vue&type=script&lang=ts






// 默认第四行键码
const defaultLineList = [{
  data: ".?123",
  type: "change2num"
}, {
  data: "",
  type: "change2lang"
}, {
  data: " ",
  type: "space"
}, {
  data: "",
  type: "close"
}];
/* harmony default export */ var defaultvue_type_script_lang_ts = ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.defineComponent)({
  name: "DefaultKeyBoard",
  components: {
    KeyCodeButton: keyCodeButtton
  },
  emits: ["translate", "trigger", "change"],
  setup(props, {
    emit
  }) {
    const injectData = getInject();
    const defaultKeyBoardData = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.reactive)({
      // 前三行不变的键码list
      lineList: [DEFAULT_CODE.line1, DEFAULT_CODE.line2, DEFAULT_CODE.line3],
      // 第四行变动的键码
      line4: [],
      // 是否大写
      isUpper: false,
      //  中英文模式
      isCn: true,
      // 是否显示数字键盘
      isNum: false,
      // 是否显示符号键盘
      isSymbol: false,
      // 上一次存的val值
      oldVal: ""
    });
    /**
     * @description 计算第四行code
     */
    function getLine4Code() {
      defaultKeyBoardData.line4 = JSON.parse(JSON.stringify(defaultLineList));
      // 判定是否存在手写
      if (injectData?.modeList?.find(mode => mode === "handwrite") && injectData?.handApi) {
        defaultKeyBoardData.line4.splice(2, 0, {
          data: "",
          type: "handwrite"
        });
      }
    }
    /**
     * @description 按钮点击事件
     */
    function click({
      data,
      type
    }) {
      switch (type) {
        //  关闭
        case "close":
          {
            defaultKeyBoardData.oldVal = "";
            injectData?.closeKeyBoard();
          }
          break;
        //  大小写
        case "upper":
          {
            defaultKeyBoardData.oldVal = "";
            defaultKeyBoardData.isUpper = !defaultKeyBoardData.isUpper;
          }
          break;
        //   语言
        case "change2lang":
          {
            defaultKeyBoardData.isCn = !defaultKeyBoardData.isCn;
            // 默认键盘状态下
            if (!defaultKeyBoardData.isNum && !defaultKeyBoardData.isSymbol) {
              useEventEmitter.emit("keyBoardChange", defaultKeyBoardData.isCn ? "CN" : "EN");
            }
          }
          break;
        //  数字键盘
        case "change2num":
          {
            defaultKeyBoardData.isNum = !defaultKeyBoardData.isNum;
            defaultKeyBoardData.isSymbol = false;
            if (defaultKeyBoardData.isNum) {
              useEventEmitter.emit("keyBoardChange", "number");
              const numberCodeLine3List = JSON.parse(JSON.stringify(NUMBER_CODE.line3));
              if (!injectData?.modeList?.find(mode => mode === "symbol")) {
                numberCodeLine3List.shift();
                numberCodeLine3List.unshift("+");
              }
              defaultKeyBoardData.lineList = [NUMBER_CODE.line1, NUMBER_CODE.line2, numberCodeLine3List];
            } else {
              useEventEmitter.emit("keyBoardChange", defaultKeyBoardData.isCn ? "CN" : "EN");
              defaultKeyBoardData.lineList = [DEFAULT_CODE.line1, DEFAULT_CODE.line2, DEFAULT_CODE.line3];
            }
          }
          break;
        // 切换符号显示
        case "#+=":
          {
            defaultKeyBoardData.isSymbol = !defaultKeyBoardData.isSymbol;
            if (defaultKeyBoardData.isSymbol) {
              useEventEmitter.emit("keyBoardChange", "symbol");
              defaultKeyBoardData.lineList = [SYMBOL_CODE.line1, SYMBOL_CODE.line2, SYMBOL_CODE.line3];
            } else {
              useEventEmitter.emit("keyBoardChange", "number");
              defaultKeyBoardData.lineList = [NUMBER_CODE.line1, NUMBER_CODE.line2, NUMBER_CODE.line3];
            }
          }
          break;
        // 切换手写板以及删除
        case "handwrite":
        case "delete":
          {
            // 如果是中文模式只删存好的字段
            if (defaultKeyBoardData.isCn && type === "delete" && defaultKeyBoardData.oldVal) {
              defaultKeyBoardData.oldVal = defaultKeyBoardData.oldVal.substr(0, defaultKeyBoardData.oldVal.length - 1);
              emit("translate", defaultKeyBoardData.oldVal);
            } else {
              if (type === "handwrite") {
                useEventEmitter.emit("keyBoardChange", "handwrite");
              }
              emit("trigger", {
                data,
                type
              });
            }
          }
          break;
        default:
          {
            // 中文需要转
            if (defaultKeyBoardData.isCn && !defaultKeyBoardData.isNum && !defaultKeyBoardData.isSymbol) {
              emit("translate", defaultKeyBoardData.oldVal + data);
              defaultKeyBoardData.oldVal = defaultKeyBoardData.oldVal + data;
            } else {
              // 英文直接输出
              emit("change", data);
            }
          }
          break;
      }
    }
    // created
    getLine4Code();
    (0,external_commonjs_vue_commonjs2_vue_root_Vue_.onMounted)(() => {
      useEventEmitter.on("resultReset", () => {
        defaultKeyBoardData.oldVal = "";
      });
    });
    return {
      ...(0,external_commonjs_vue_commonjs2_vue_root_Vue_.toRefs)(defaultKeyBoardData),
      click
    };
  }
}));
;// CONCATENATED MODULE: ./packages/components/default/index.vue?vue&type=script&lang=ts
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-78.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-78.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/@vue/cli-service/node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-78.use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-78.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/components/default/index.vue?vue&type=style&index=0&id=4b78e5a1&scoped=true&lang=less
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./packages/components/default/index.vue?vue&type=style&index=0&id=4b78e5a1&scoped=true&lang=less

;// CONCATENATED MODULE: ./packages/components/default/index.vue




;


const default_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(defaultvue_type_script_lang_ts, [['render',defaultvue_type_template_id_4b78e5a1_scoped_true_ts_true_render],['__scopeId',"data-v-4b78e5a1"]])

/* harmony default export */ var components_default = (default_exports_);
;// CONCATENATED MODULE: ./packages/constants/pinyin_dict_note.ts
/**
 * 收录常用汉字6763个，不支持声调，支持多音字，并按照汉字使用频率由低到高排序
 */
const pinYinNote = {
  "a": "阿啊呵腌嗄吖锕",
  "e": "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭",
  "ai": "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹",
  "ei": "诶",
  "xi": "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰",
  "yi": "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓",
  "an": "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广",
  "han": "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖",
  "ang": "昂仰盎肮",
  "ao": "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱",
  "wa": "瓦挖娃洼袜蛙凹哇佤娲呙腽",
  "yu": "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠",
  "niu": "牛纽扭钮拗妞忸狃",
  "o": "哦噢喔",
  "ba": "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇",
  "pa": "怕帕爬扒趴琶啪葩耙杷钯筢",
  "pi": "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴",
  "bi": "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭",
  "bai": "百白败摆伯拜柏佰掰呗擘捭稗",
  "bo": "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣",
  "bei": "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾",
  "ban": "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍",
  "pan": "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬",
  "bin": "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧",
  "bang": "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡",
  "pang": "旁庞乓磅螃彷滂逄耪",
  "beng": "泵崩蚌蹦迸绷甭嘣甏堋",
  "bao": "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹",
  "bu": "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸",
  "pu": "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤",
  "mian": "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄",
  "po": "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷",
  "fan": "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔",
  "fu": "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆",
  "ben": "本体奔苯笨夯贲锛畚坌",
  "feng": "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪",
  "bian": "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏",
  "pian": "便片篇偏骗翩扁骈胼蹁谝犏缏",
  "zhen": "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈",
  "biao": "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭",
  "piao": "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵",
  "huo": "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉",
  "bie": "别鳖憋瘪蹩",
  "min": "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘",
  "fen": "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼",
  "bing": "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫",
  "geng": "更耕颈庚耿梗埂羹哽赓绠鲠",
  "fang": "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫",
  "xian": "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅",
  "fou": "不否缶",
  "ca": "拆擦嚓礤",
  "cha": "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹",
  "cai": "才采财材菜彩裁蔡猜踩睬",
  "can": "参残餐灿惨蚕掺璨惭粲孱骖黪",
  "shen": "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂",
  "cen": "参岑涔",
  "san": "三参散伞叁糁馓毵",
  "cang": "藏仓苍沧舱臧伧",
  "zang": "藏脏葬赃臧奘驵",
  "chen": "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜",
  "cao": "草操曹槽糙嘈漕螬艚屮",
  "ce": "策测册侧厕栅恻",
  "ze": "责则泽择侧咋啧仄箦赜笮舴昃迮帻",
  "zhai": "债择齐宅寨侧摘窄斋祭翟砦瘵哜",
  "dao": "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉",
  "ceng": "层曾蹭噌",
  "zha": "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄",
  "chai": "差拆柴钗豺侪虿瘥",
  "ci": "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢",
  "zi": "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔",
  "cuo": "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾",
  "chan": "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁",
  "shan": "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟",
  "zhan": "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌",
  "xin": "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡",
  "lian": "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹",
  "chang": "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯",
  "zhang": "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜",
  "chao": "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊",
  "zhao": "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊",
  "zhou": "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮",
  "che": "车彻撤尺扯澈掣坼砗屮",
  "ju": "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵",
  "cheng": "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨",
  "rong": "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾",
  "sheng": "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚",
  "deng": "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥",
  "zhi": "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬",
  "zheng": "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲",
  "tang": "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭",
  "chi": "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺",
  "shi": "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳",
  "qi": "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞",
  "chuai": "揣踹啜搋膪",
  "tuo": "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝",
  "duo": "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳",
  "xue": "学血雪削薛穴靴谑噱鳕踅泶彐",
  "chong": "重种充冲涌崇虫宠忡憧舂茺铳艟",
  "chou": "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱",
  "qiu": "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗",
  "xiu": "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅",
  "chu": "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮",
  "tuan": "团揣湍疃抟彖",
  "zhui": "追坠缀揣椎锥赘惴隹骓缒",
  "chuan": "传川船穿串喘椽舛钏遄氚巛舡",
  "zhuan": "专转传赚砖撰篆馔啭颛",
  "yuan": "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾",
  "cuan": "窜攒篡蹿撺爨汆镩",
  "chuang": "创床窗闯幢疮怆",
  "zhuang": "装状庄壮撞妆幢桩奘僮戆",
  "chui": "吹垂锤炊椎陲槌捶棰",
  "chun": "春纯醇淳唇椿蠢鹑朐莼肫蝽",
  "zhun": "准屯淳谆肫窀",
  "cu": "促趋趣粗簇醋卒蹴猝蹙蔟殂徂",
  "dun": "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅",
  "qu": "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲",
  "xu": "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑",
  "chuo": "辍绰戳淖啜龊踔辶",
  "zu": "组族足祖租阻卒俎诅镞菹",
  "ji": "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜",
  "cong": "从丛匆聪葱囱琮淙枞骢苁璁",
  "zong": "总从综宗纵踪棕粽鬃偬枞腙",
  "cou": "凑辏腠楱",
  "cui": "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱",
  "wei": "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎",
  "cun": "村存寸忖皴",
  "zuo": "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙",
  "zuan": "钻纂攥缵躜",
  "da": "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲",
  "dai": "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨",
  "tai": "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱",
  "ta": "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼",
  "dan": "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕",
  "lu": "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆",
  "tan": "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬",
  "ren": "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽",
  "jie": "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱",
  "yan": "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨",
  "dang": "当党档荡挡宕砀铛裆凼菪谠",
  "tao": "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗",
  "tiao": "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦",
  "te": "特忑忒铽慝",
  "de": "的地得德底锝",
  "dei": "得",
  "di": "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌",
  "ti": "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼",
  "tui": "推退弟腿褪颓蜕忒煺",
  "you": "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑",
  "dian": "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽",
  "tian": "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭",
  "zhu": "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰",
  "nian": "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏",
  "diao": "调掉雕吊钓刁貂凋碉鲷叼铫铞",
  "yao": "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧",
  "die": "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀",
  "she": "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠",
  "ye": "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲",
  "xie": "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞",
  "zhe": "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫",
  "ding": "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵",
  "diu": "丢铥",
  "ting": "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛",
  "dong": "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨",
  "tong": "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼",
  "zhong": "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂",
  "dou": "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼",
  "du": "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑",
  "duan": "断段短端锻缎煅椴簖",
  "dui": "对队追敦兑堆碓镦怼憝",
  "rui": "瑞兑锐睿芮蕊蕤蚋枘",
  "yue": "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖",
  "tun": "吞屯囤褪豚臀饨暾氽",
  "hui": "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕",
  "wu": "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢",
  "ya": "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑",
  "he": "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍",
  "wo": "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪",
  "en": "恩摁蒽",
  "n": "嗯唔",
  "er": "而二尔儿耳迩饵洱贰铒珥佴鸸鲕",
  "fa": "发法罚乏伐阀筏砝垡珐",
  "quan": "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎",
  "fei": "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄",
  "pei": "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫",
  "ping": "平评凭瓶冯屏萍苹乒坪枰娉俜鲆",
  "fo": "佛",
  "hu": "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷",
  "ga": "夹咖嘎尬噶旮伽尕钆尜",
  "ge": "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼",
  "ha": "哈蛤铪",
  "xia": "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙",
  "gai": "改该盖概溉钙丐芥赅垓陔戤",
  "hai": "海还害孩亥咳骸骇氦嗨胲醢",
  "gan": "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉",
  "gang": "港钢刚岗纲冈杠缸扛肛罡戆筻",
  "jiang": "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩",
  "hang": "行航杭巷夯吭桁沆绗颃",
  "gong": "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾",
  "hong": "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨",
  "guang": "广光逛潢犷胱咣桄",
  "qiong": "穷琼穹邛茕筇跫蛩銎",
  "gao": "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔",
  "hao": "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆",
  "li": "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹",
  "jia": "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿",
  "luo": "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃",
  "ke": "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞",
  "qia": "卡恰洽掐髂袷咭葜",
  "gei": "给",
  "gen": "根跟亘艮哏茛",
  "hen": "很狠恨痕哏",
  "gou": "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘",
  "kou": "口扣寇叩抠佝蔻芤眍筘",
  "gu": "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴",
  "pai": "牌排派拍迫徘湃俳哌蒎",
  "gua": "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙",
  "tou": "投头透偷愉骰亠",
  "guai": "怪拐乖",
  "kuai": "会快块筷脍蒯侩浍郐蒉狯哙",
  "guan": "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫",
  "wan": "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢",
  "ne": "呢哪呐讷疒",
  "gui": "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦",
  "jun": "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃",
  "jiong": "窘炯迥炅冂扃",
  "jue": "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝",
  "gun": "滚棍辊衮磙鲧绲丨",
  "hun": "婚混魂浑昏棍珲荤馄诨溷阍",
  "guo": "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘",
  "hei": "黑嘿嗨",
  "kan": "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰",
  "heng": "衡横恒亨哼珩桁蘅",
  "mo": "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘",
  "peng": "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋",
  "hou": "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠",
  "hua": "化华划话花画滑哗豁骅桦猾铧砉",
  "huai": "怀坏淮徊槐踝",
  "huan": "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐",
  "xun": "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯",
  "huang": "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀",
  "nai": "能乃奶耐奈鼐萘氖柰佴艿",
  "luan": "乱卵滦峦鸾栾銮挛孪脔娈",
  "qie": "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊",
  "jian": "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗",
  "nan": "南难男楠喃囡赧腩囝蝻",
  "qian": "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠",
  "qiang": "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣",
  "xiang": "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓",
  "jiao": "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫",
  "zhuo": "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚",
  "qiao": "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲",
  "xiao": "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈",
  "si": "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕",
  "kai": "开凯慨岂楷恺揩锴铠忾垲剀锎蒈",
  "jin": "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺",
  "qin": "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓",
  "jing": "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍",
  "ying": "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆",
  "jiu": "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏",
  "zui": "最罪嘴醉咀蕞觜",
  "juan": "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊",
  "suan": "算酸蒜狻",
  "yun": "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁",
  "qun": "群裙逡麇",
  "ka": "卡喀咖咔咯佧胩",
  "kang": "康抗扛慷炕亢糠伉钪闶",
  "keng": "坑铿吭",
  "kao": "考靠烤拷铐栲尻犒",
  "ken": "肯垦恳啃龈裉",
  "yin": "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙",
  "kong": "空控孔恐倥崆箜",
  "ku": "苦库哭酷裤枯窟挎骷堀绔刳喾",
  "kua": "跨夸垮挎胯侉",
  "kui": "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰",
  "kuan": "款宽髋",
  "kuang": "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩",
  "que": "确却缺雀鹊阙瘸榷炔阕悫",
  "kun": "困昆坤捆琨锟鲲醌髡悃阃",
  "kuo": "扩括阔廓蛞",
  "la": "拉落垃腊啦辣蜡喇剌旯砬邋瘌",
  "lai": "来莱赖睐徕籁涞赉濑癞崃疠铼",
  "lan": "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤",
  "lin": "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔",
  "lang": "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂",
  "liang": "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚",
  "lao": "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢",
  "mu": "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶",
  "le": "了乐勒肋叻鳓嘞仂泐",
  "lei": "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑",
  "sui": "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽",
  "lie": "列烈劣裂猎冽咧趔洌鬣埒捩躐",
  "leng": "冷愣棱楞塄",
  "ling": "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃",
  "lia": "俩",
  "liao": "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩",
  "liu": "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍",
  "lun": "论轮伦仑纶沦抡囵",
  "lv": "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆",
  "lou": "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌",
  "mao": "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀",
  "long": "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃",
  "nong": "农浓弄脓侬哝",
  "shuang": "双爽霜孀泷",
  "shu": "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅",
  "shuai": "率衰帅摔甩蟀",
  "lve": "略掠锊",
  "ma": "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩",
  "me": "么麽",
  "mai": "买卖麦迈脉埋霾荬劢",
  "man": "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔",
  "mi": "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉",
  "men": "们门闷瞒汶扪焖懑鞔钔",
  "mang": "忙盲茫芒氓莽蟒邙硭漭",
  "meng": "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞",
  "miao": "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵",
  "mou": "某谋牟缪眸哞鍪蛑侔厶",
  "miu": "缪谬",
  "mei": "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛",
  "wen": "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌",
  "mie": "灭蔑篾乜咩蠛",
  "ming": "明名命鸣铭冥茗溟酩瞑螟暝",
  "na": "内南那纳拿哪娜钠呐捺衲镎肭",
  "nei": "内那哪馁",
  "nuo": "难诺挪娜糯懦傩喏搦锘",
  "ruo": "若弱偌箬",
  "nang": "囊馕囔曩攮",
  "nao": "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲",
  "ni": "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊",
  "nen": "嫩恁",
  "neng": "能",
  "nin": "您恁",
  "niao": "鸟尿溺袅脲茑嬲",
  "nie": "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧",
  "niang": "娘酿",
  "ning": "宁凝拧泞柠咛狞佞聍甯",
  "nu": "努怒奴弩驽帑孥胬",
  "nv": "女钕衄恧",
  "ru": "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐",
  "nuan": "暖",
  "nve": "虐疟",
  "re": "热若惹喏",
  "ou": "区欧偶殴呕禺藕讴鸥瓯沤耦怄",
  "pao": "跑炮泡抛刨袍咆疱庖狍匏脬",
  "pou": "剖掊裒",
  "pen": "喷盆湓",
  "pie": "瞥撇苤氕丿",
  "pin": "品贫聘频拼拚颦姘嫔榀牝",
  "se": "色塞瑟涩啬穑铯槭",
  "qing": "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦",
  "zan": "赞暂攒堑昝簪糌瓒錾趱拶",
  "shao": "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲",
  "sao": "扫骚嫂梢缫搔瘙臊埽缲鳋",
  "sha": "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃",
  "xuan": "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇",
  "ran": "然染燃冉苒髯蚺",
  "rang": "让壤攘嚷瓤穰禳",
  "rao": "绕扰饶娆桡荛",
  "reng": "仍扔",
  "ri": "日",
  "rou": "肉柔揉糅鞣蹂",
  "ruan": "软阮朊",
  "run": "润闰",
  "sa": "萨洒撒飒卅仨脎",
  "suo": "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃",
  "sai": "思赛塞腮噻鳃",
  "shui": "说水税谁睡氵",
  "sang": "桑丧嗓搡颡磉",
  "sen": "森",
  "seng": "僧",
  "shai": "筛晒",
  "shang": "上商尚伤赏汤裳墒晌垧觞殇熵绱",
  "xing": "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎",
  "shou": "收手受首售授守寿瘦兽狩绶艏扌",
  "shuo": "说数硕烁朔铄妁槊蒴搠",
  "su": "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫",
  "shua": "刷耍唰",
  "shuan": "栓拴涮闩",
  "shun": "顺瞬舜吮",
  "song": "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘",
  "sou": "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍",
  "sun": "损孙笋荪榫隼狲飧",
  "teng": "腾疼藤滕誊",
  "tie": "铁贴帖餮萜",
  "tu": "土突图途徒涂吐屠兔秃凸荼钍菟堍酴",
  "wai": "外歪崴",
  "wang": "王望往网忘亡旺汪枉妄惘罔辋魍",
  "weng": "翁嗡瓮蓊蕹",
  "zhua": "抓挝爪",
  "yang": "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘",
  "xiong": "雄兄熊胸凶匈汹芎",
  "yo": "哟唷",
  "yong": "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁",
  "za": "杂扎咱砸咋匝咂拶",
  "zai": "在再灾载栽仔宰哉崽甾",
  "zao": "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣",
  "zei": "贼",
  "zen": "怎谮",
  "zeng": "增曾综赠憎锃甑罾缯",
  "zhei": "这",
  "zou": "走邹奏揍诹驺陬楱鄹鲰",
  "zhuai": "转拽",
  "zun": "尊遵鳟樽撙",
  "dia": "嗲",
  "nou": "耨"
};
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-87.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./packages/index.vue?vue&type=script&lang=ts

// import "@/libs/flexible.js";











// icon 引入
const requireContext = __webpack_require__(7290);
const importAll = r => r.keys().map(r);
importAll(requireContext);
// 注册键盘绑定的input列表
const inputList = [];
// 当前触发的input
let currentInput = null;
/* harmony default export */ var dist_ruleSet_0_use_0_packagesvue_type_script_lang_ts = ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.defineComponent)({
  name: "KeyBoard",
  inheritAttrs: false,
  props: {
    // 主题色
    color: {
      type: String,
      default: "#eaa050"
    },
    // 显示的模式列表
    modeList: {
      type: Array,
      default: () => ["handwrite", "symbol"]
    },
    // 是否blur状态下自动隐藏
    blurHide: {
      type: Boolean,
      default: true
    },
    // 是否显示拖拽句柄
    showHandleBar: {
      type: Boolean,
      default: true
    },
    // 是否需要遮罩层
    modal: Boolean,
    // 是否可以通过点击modal关闭modal
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    // v-model
    modelValue: String,
    // 手写识别接口  如果不存在则不会显示手写面板
    handApi: String,
    // 动画的className
    animateClass: String,
    // 拖拽句柄文字
    dargHandleText: String
  },
  emits: ["keyChange", "update:modelValue", "change", "closed", "modalClick"],
  directives: {
    handleDrag: drag
  },
  components: {
    Result: result,
    SvgIcon: svgIcon,
    HandBoard: handBoards,
    DefaultBoard: components_default
  },
  setup(props, {
    emit
  }) {
    // 基础数据
    const keyboardData = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.reactive)({
      // 展示模式
      showMode: "default",
      // 显隐
      visible: false,
      // 显示字符
      resultVal: {}
    });
    // 默认键盘ref
    const defaultBoardRef = (0,external_commonjs_vue_commonjs2_vue_root_Vue_.ref)(null);
    /**
     * @description 设置初始化键盘模式
     */
    function setDefaultKeyBoardMode(mode) {
      // 默认设置为中文
      (0,external_commonjs_vue_commonjs2_vue_root_Vue_.nextTick)(() => {
        useEventEmitter.emit("keyBoardChange", "CN");
      });
      switch (mode) {
        // 英文键盘
        case "en":
          keyboardData.showMode = "default";
          (0,external_commonjs_vue_commonjs2_vue_root_Vue_.nextTick)(() => {
            defaultBoardRef.value?.click({
              data: "",
              type: "change2lang"
            });
          });
          break;
        // 数字键盘
        case "number":
          keyboardData.showMode = "default";
          (0,external_commonjs_vue_commonjs2_vue_root_Vue_.nextTick)(() => {
            defaultBoardRef.value?.click({
              data: ".?123",
              type: "change2num"
            });
          });
          break;
        // 手写键盘
        case "handwrite":
          if (props.modeList?.find(mode => mode === "handwrite") && props.handApi) {
            keyboardData.showMode = "handwrite";
            (0,external_commonjs_vue_commonjs2_vue_root_Vue_.nextTick)(() => {
              useEventEmitter.emit("keyBoardChange", "handwrite");
            });
          } else {
            keyboardData.showMode = "default";
          }
          break;
        // 标点键盘
        case "symbol":
          keyboardData.showMode = "default";
          // 如果存在标点键盘才允许切换
          if (props.modeList?.find(mode => mode === "symbol")) {
            (0,external_commonjs_vue_commonjs2_vue_root_Vue_.nextTick)(() => {
              defaultBoardRef.value?.click({
                data: ".?123",
                type: "change2num"
              });
              defaultBoardRef.value?.click({
                data: "#+=",
                type: "#+="
              });
            });
          }
          break;
        // 默认
        default:
          keyboardData.showMode = "default";
          break;
      }
    }
    /**
     * @description 显示键盘
     */
    function showKeyBoard(event) {
      // 显示键盘
      keyboardData.visible = true;
      // 赋值当前事件触发的input
      currentInput = event.target;
      // console.log(currentInput,'currentInput');
      // 设置默认的键盘显示模式
      setDefaultKeyBoardMode(currentInput.getAttribute("data-mode"));
      // 显示遮罩层
      if (document.querySelector(".key-board-modal")) {
        const keyBoardModal = document.querySelector(".key-board-modal");
        keyBoardModal.style.display = "block";
      }
    }
    /**
     * @description 关闭键盘
     */
    function hideKeyBoard() {
      // 输入框触发blur
      currentInput && currentInput.blur();
      currentInput = null;
      keyboardData.visible = false;
      // 如果存在关闭钩子函数则触发
      emit("closed");
      // 重置显示mode
      keyboardData.showMode = "default";
      // 重置中文模式下显示字符
      keyboardData.resultVal = {};
      // 隐藏遮罩层
      if (document.querySelector(".key-board-modal")) {
        const keyBoardModal = document.querySelector(".key-board-modal");
        keyBoardModal.style.display = "none";
      }
    }
    /**
     * @description 点击遮罩层
     */
    function modalTrigger() {
      // 如果点击遮罩层允许关闭则触发键盘隐藏事件
      props.closeOnClickModal && hideKeyBoard();
      emit("modalClick");
    }
    /**
     * @description 新增modal
     */
    function addMoDal() {
      // 如果modal存在的话继续绑定事件 - 此处解决多路由页面切换时造成的bug
      if (document.querySelector(".key-board-modal")) {
        document.querySelector(".key-board-modal")?.addEventListener("click", modalTrigger);
        return;
      }
      // 如果不存在modal则创建一个modal遮罩层
      const modalDom = document.createElement("div");
      modalDom.className = "key-board-modal";
      modalDom.style.display = "none";
      document.querySelector("body")?.appendChild(modalDom);
      modalDom.addEventListener("click", modalTrigger);
    }
    /**
     * @description 注册键盘
     */
    function signUpKeyboard() {
      // 设置baseUrl
      props.handApi && axiosConfig(props.handApi);
      // 给键盘绑定相应input
      [...document.querySelectorAll("input"), ...document.querySelectorAll('textarea')].forEach(input => {
        // 存在data-mode属性的可以注册为键盘input
        if (input.getAttribute("data-mode") !== null) {
          inputList.push(input);
          input.addEventListener("focus", showKeyBoard);
          props.blurHide && input.addEventListener("blur", hideKeyBoard);
        }
      });
    }
    /**
    * @description 删除文字
    * @param curVal
    */
    function deleteText(curVal) {
      if (!currentInput) return '';
      const input = currentInput;
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;
      if (!startPos || !endPos) return '';
      const result = curVal.substring(0, startPos - 1) + curVal.substring(endPos);
      input.value = result;
      input.focus();
      input.selectionStart = startPos - 1;
      input.selectionEnd = startPos - 1;
      return result;
    }
    /**
     * @description 模式切换
     * @param {IKeyCode} {type}
     */
    function trigger({
      type
    }) {
      switch (type) {
        case "handwrite":
          {
            keyboardData.showMode = "handwrite";
          }
          break;
        case "delete":
          {
            if (!currentInput) return;
            let changeValue;
            // v-model exist
            if (props.modelValue) {
              changeValue = deleteText(props.modelValue + '');
              emit("update:modelValue", changeValue);
            } else {
              changeValue = deleteText(currentInput.value);
              currentInput.value = changeValue;
            }
            emit("change", changeValue, currentInput.getAttribute("data-prop") || currentInput);
          }
          break;
      }
    }
    /**
     * @description 插入新文字
     * @param curVal
     * @param insertTxt
     */
    function inputText(curVal, insertTxt) {
      if (!currentInput) return '';
      const input = currentInput;
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;
      // console.log(currentInput,startPos,endPos,'inputText');
      if (!startPos || !endPos) return insertTxt;
      const result = curVal.substring(0, startPos) + insertTxt + curVal.substring(endPos);
      // console.log(result,startPos,endPos,'result');
      input.value = result;
      input.focus();
      input.selectionStart = startPos + insertTxt.length;
      input.selectionEnd = startPos + insertTxt.length;
      return result;
    }
    /**
     * @description 文字改变
     * @param {string} value
     */
    function change(value) {
      // console.log(value,currentInput,currentInput?.onchange,'13123112');
      if (!currentInput) return;
      let changeValue;
      if (props.modelValue) {
        changeValue = inputText(props.modelValue + '', value);
        // inputText(props.modelValue,value)
        emit("update:modelValue", changeValue);
      } else {
        // changeValue = currentInput.value + value;
        // console.log('12312312312313');
        changeValue = inputText(currentInput.value, value);
        currentInput.value = changeValue;
        currentInput.dispatchEvent(new Event('input'));
      }
      emit("change", changeValue, currentInput.getAttribute("data-prop") || currentInput);
      emit("keyChange", value, currentInput.getAttribute("data-prop") || currentInput);
    }
    /**
     * @description 拼音转中文
     * @param {string} value
     */
    function translate(value) {
      const reg = new RegExp(`^${value}\\w*`);
      const keys = Object.keys(pinYinNote).filter(key => reg.test(key)).sort();
      keyboardData.resultVal = {
        code: value,
        value: value ? keys.length > 1 ? keys.reduce((a, b) => a + pinYinNote[b], "") : pinYinNote[keys[0]] : ""
      };
      currentInput && emit("keyChange", value, currentInput.getAttribute("data-prop") || currentInput);
    }
    /**
     * @description 重新注册键盘
     */
    function reSignUp() {
      signUpKeyboard();
    }
    /**
     * @description 获取当前聚焦的输入框
     */
    function getCurrentInput() {
      return currentInput;
    }
    (0,external_commonjs_vue_commonjs2_vue_root_Vue_.onMounted)(() => {
      // 如果需要遮罩添加遮罩层
      props.modal && addMoDal();
      // 注册键盘
      signUpKeyboard();
      useEventEmitter.on("resultReset", () => {
        keyboardData.resultVal = {};
      });
    });
    // 卸载时事件清除
    (0,external_commonjs_vue_commonjs2_vue_root_Vue_.onUnmounted)(() => {
      document.querySelector(".key-board-modal")?.removeEventListener("click", modalTrigger);
      inputList.forEach(input => {
        input.removeEventListener("focus", showKeyBoard);
        input.removeEventListener("blur", hideKeyBoard);
      });
    });
    // 注入到子组件
    getProvide((0,external_commonjs_vue_commonjs2_vue_root_Vue_.reactive)({
      color: props.color,
      modeList: props.modeList,
      handApi: props.handApi,
      closeKeyBoard: () => {
        hideKeyBoard();
      },
      changeDefaultBoard: () => {
        keyboardData.showMode = "default";
      }
    }));
    return {
      ...(0,external_commonjs_vue_commonjs2_vue_root_Vue_.toRefs)(keyboardData),
      defaultBoardRef,
      getCurrentInput,
      translate,
      reSignUp,
      trigger,
      change
    };
  }
}));
;// CONCATENATED MODULE: ./packages/index.vue?vue&type=script&lang=ts
 
;// CONCATENATED MODULE: ./packages/index.vue




;
const packages_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(dist_ruleSet_0_use_0_packagesvue_type_script_lang_ts, [['render',render]])

/* harmony default export */ var packages_0 = (packages_exports_);
;// CONCATENATED MODULE: ./packages/index.ts

packages_0.install = app => {
  app.component(packages_0.name, packages_0);
};
const _KeyBoard = packages_0;
/* harmony default export */ var packages_1 = (_KeyBoard);
;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = (packages_1);


}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});