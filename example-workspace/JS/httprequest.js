"use strict";
// This module turns Zabbix Duktape HttpRequest into a Node.js module
// It recreates the HttpRequest object and its methods in Node.js
// All the methods are fully synchronous to work within the Zabbix Duktape environment
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var sync_request_1 = __importDefault(require("sync-request"));
var HttpRequest = /** @class */ (function () {
    function HttpRequest() {
        this.headers = {};
        this.proxy = null;
        this.auth = null;
        this.lastStatus = null;
    }
    /**
     * Adds an HTTP header field to the request. This field is used for all following requests until cleared with the `clearHeader()` method.
     * The total length of header fields that can be added to a single HttpRequest object is limited to 128 Kbytes (including special characters and header names).
     *
     * @param value - The header field to add, in the format "Key: Value".
     *
     * @throws {Error} If the total header size exceeds 128 Kbytes.
     *
     * @example
     * request.addHeader("Content-Type: application/json");
     * request.addHeader("Authorization: Basic " + params.authentication);
     */
    HttpRequest.prototype.addHeader = function (value) {
        // Adds HTTP header field. This field is used for all following requests until cleared with the clearHeader() method.
        // The total length of header fields that can be added to a single HttpRequest object is limited to 128 Kbytes (special characters and header names included).
        // Example: request.addHeader("Content-Type: application/json");
        // Example: request.addHeader("Authorization Basic ' + params.authentication);
        var _a = value.split(': '), key = _a[0], val = _a[1];
        var newHeaderSize = Buffer.byteLength(value, 'utf-8');
        var currentHeadersSize = Object.entries(this.headers).reduce(function (acc, _a) {
            var k = _a[0], v = _a[1];
            return acc + Buffer.byteLength("".concat(k, ": ").concat(v), 'utf-8');
        }, 0);
        if (currentHeadersSize + newHeaderSize > 128 * 1024) {
            throw new Error('Total header size exceeds 128 Kbytes');
        }
        this.headers[key] = val;
    };
    /**
     * Clears all HTTP headers.
     *
     * If no header fields are set, `HttpRequest` will set `Content-Type` to `application/json`
     * if the data being posted is JSON-formatted; `text/plain` otherwise.
     */
    HttpRequest.prototype.clearHeader = function () {
        // Clears HTTP header. If no header fields are set, HttpRequest will set Content-Type to application/json if the data being posted is JSON-formatted; text/plain otherwise.
        this.headers = {};
    };
    /**
     * Sends an HTTP CONNECT request to the specified URL and returns the response.
     *
     * @param url - The URL to which the CONNECT request is sent.
     * @returns The response from the CONNECT request.
     */
    HttpRequest.prototype.connect = function (url) {
        // Sends HTTP CONNECT request to the URL and returns the response.
        return this.customRequest('CONNECT', url, '');
    };
    /**
     * Sends a custom HTTP request using the specified method, URL, and data.
     *
     * @param method - The HTTP method to use for the request (e.g., 'GET', 'POST').
     * @param url - The URL to which the request is sent.
     * @param data - The data to be sent in the request body.
     * @returns The response data as a string.
     *
     * @throws Will throw an error if the request encounters an error.
     */
    HttpRequest.prototype.customRequest = function (method, url, data) {
        if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE'].includes(method)) {
            throw new Error("Invalid HTTP method: ".concat(method));
        }
        var httpVerb = method;
        var parsedUrl = new url_1.URL(url);
        var options = {
            method: method,
            headers: this.headers,
            auth: this.auth ? "".concat(this.auth.username, ":").concat(this.auth.password) : undefined,
        };
        if (this.proxy) {
            var proxyUrl = new url_1.URL(this.proxy);
            options.hostname = proxyUrl.hostname;
            options.port = proxyUrl.port;
            options.path = parsedUrl.href;
            options.headers = __assign(__assign({}, this.headers), { Host: parsedUrl.hostname });
            if (proxyUrl.username || proxyUrl.password) {
                options.headers['Proxy-Authorization'] = 'Basic ' + Buffer.from("".concat(proxyUrl.username, ":").concat(proxyUrl.password)).toString('base64');
            }
        }
        else {
            options.hostname = parsedUrl.hostname;
            options.port = parsedUrl.port;
            options.path = parsedUrl.pathname + parsedUrl.search;
        }
        // make the request, with the options set
        // accept any http error codes
        var res;
        try {
            res = (0, sync_request_1.default)(httpVerb, url, {
                headers: this.headers,
                body: data,
            });
        }
        catch (error) {
            if (error instanceof Error && 'response' in error) {
                res = error.response;
                this.lastStatus = res.statusCode;
            }
            else {
                throw error;
            }
        }
        this.lastStatus = res.statusCode;
        this.headers = res.headers;
        var returnData = res.body.toString();
        return returnData;
    };
    /**
     * Sends an HTTP DELETE request to the specified URL with an optional data payload.
     *
     * @param url - The URL to send the DELETE request to.
     * @param data - The optional data payload to include in the DELETE request.
     * @returns The response from the DELETE request.
     */
    HttpRequest.prototype.delete = function (url, data) {
        // Sends HTTP DELETE request to the URL with optional data payload and returns the response.
        return this.customRequest('DELETE', url, data);
    };
    /**
     * Returns the object of received HTTP header fields.
     *
     * @param asArray - If set to `true`, the received HTTP header field values will be returned as arrays;
     * this should be used to retrieve the field values of multiple same-name headers.
     * If not set or set to `false`, the received HTTP header field values will be returned as strings.
     *
     * @returns An object containing the HTTP header fields. If `asArray` is `true`, the values will be arrays of strings.
     * Otherwise, the values will be strings.
     */
    HttpRequest.prototype.getHeaders = function (asArray) {
        // Returns the object of received HTTP header fields.
        // The asArray parameter may be set to "true" (e.g., getHeaders(true)), "false" or be undefined. 
        // If set to "true", the received HTTP header field values will be returned as arrays; this should be used to retrieve the field values of multiple same-name headers.
        // If not set or set to "false", the received HTTP header field values will be returned as strings.
        if (asArray) {
            var headersArray = {};
            for (var _i = 0, _a = Object.entries(this.headers); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                headersArray[key] = Array.isArray(value) ? value : [value];
            }
            return headersArray;
        }
        else {
            return this.headers;
        }
    };
    /**
     * Sends an HTTP GET request to the specified URL with an optional data payload and returns the response.
     *
     * @param url - The URL to send the GET request to.
     * @param data - Optional data payload to include in the request.
     * @returns The response from the GET request.
     */
    HttpRequest.prototype.get = function (url, data) {
        // Sends HTTP GET request to the URL with optional data payload and returns the response.
        return this.customRequest('GET', url, data !== null && data !== void 0 ? data : '');
    };
    /**
     * Sends an HTTP HEAD request to the specified URL and returns the response.
     *
     * @param url - The URL to which the HEAD request is sent.
     * @returns The response from the HEAD request.
     */
    HttpRequest.prototype.head = function (url) {
        // Sends HTTP HEAD request to the URL and returns the response.
        return this.customRequest('HEAD', url, '');
    };
    /**
     * Sends an HTTP OPTIONS request to the specified URL and returns the response.
     *
     * @param url - The URL to which the OPTIONS request is sent.
     * @returns The response from the OPTIONS request.
     */
    HttpRequest.prototype.options = function (url) {
        // Sends HTTP OPTIONS request to the URL and returns the response.
        return this.customRequest('OPTIONS', url, '');
    };
    /**
     * Sends an HTTP PATCH request to the specified URL with an optional data payload and returns the response.
     *
     * @param url - The URL to which the PATCH request is sent.
     * @param data - The optional data payload to include in the PATCH request.
     * @returns The response from the PATCH request.
     */
    HttpRequest.prototype.patch = function (url, data) {
        // Sends HTTP PATCH request to the URL with optional data payload and returns the response.
        return this.customRequest('PATCH', url, data);
    };
    /**
     * Sends an HTTP PUT request to the specified URL with the provided data payload.
     *
     * @param url - The URL to which the PUT request is sent.
     * @param data - The data payload to include in the PUT request.
     * @returns The response from the server.
     */
    HttpRequest.prototype.put = function (url, data) {
        // Sends HTTP PUT request to the URL with optional data payload and returns the response.
        return this.customRequest('PUT', url, data);
    };
    /**
     * Sends an HTTP POST request to the specified URL with the provided data payload.
     *
     * @param url - The URL to which the POST request is sent.
     * @param data - The data payload to include in the POST request.
     * @returns The response from the HTTP POST request.
     *
     * @example
     * # Typescript example
     * const fields = { some fields };
     * const resp = req.post('https://jira.example.com/rest/api/2/issue/', JSON.stringify({ "fields": fields }));
     */
    HttpRequest.prototype.post = function (url, data) {
        // Sends HTTP POST request to the URL with optional data payload and returns the response.
        // Example:
        // resp = req.post('https://jira.example.com/rest/api/2/issue/', JSON.stringify({"fields": fields}));
        return this.customRequest('POST', url, data);
    };
    /**
     * Retrieves the HTTP status code of the last request.
     *
     * @returns {number} The HTTP status code of the last request.
     */
    HttpRequest.prototype.getStatus = function () {
        var _a;
        // Returns the HTTP status code of the last request.
        return (_a = this.lastStatus) !== null && _a !== void 0 ? _a : 0;
    };
    /**
     * Sets the HTTP proxy to the specified value.
     *
     * @param proxy - The proxy URL in the format: `http://username:password@proxy:port`.
     *                If this parameter is empty, then no proxy is used.
     */
    HttpRequest.prototype.setProxy = function (proxy) {
        // Sets HTTP proxy to "proxy" value. If this parameter is empty, then no proxy is used.
        // The "proxy" parameter should be in the following format: http://username:password@proxy:port
        this.proxy = proxy;
    };
    /**
     * Sets HTTP authentication credentials.
     *
     * @param bitmask - A bitmask representing the authentication methods to use. The bitmask is a sum of the following values:
     * - `1` (HTTPAUTH_BASIC): Basic authentication
     * - `2` (HTTPAUTH_DIGEST): Digest authentication
     * - `4` (HTTPAUTH_NEGOTIATE): Negotiate authentication
     * - `8` (HTTPAUTH_NTLM): NTLM authentication
     * - `16` (HTTPAUTH_NONE): Any authentication or none
     *
     * @param username - The username for authentication.
     * @param password - The password for authentication.
     *
     * @example
     * ```typescript
     * // Set NTLM and Basic authentication
     * request.setHttpAuth(HTTPAUTH_NTLM | HTTPAUTH_BASIC, "username", "password");
     *
     * // Set no specific authentication
     * request.setHttpAuth(HTTPAUTH_NONE, "username", "password");
     * ```
     */
    HttpRequest.prototype.setHttpAuth = function (bitmask, username, password) {
        // Sets HTTP authentication to "username" and "password" values. The bitmask parameter is a sum of the following values:
        // 1 - basic authentication, HTTPAUTH_BASIC
        // 2 - digest authentication, HTTPAUTH_DIGEST
        // 4 - negotiate authentication, HTTPAUTH_NEGOTIATE
        // 8 - NTLM authentication, HTTPAUTH_NTLM
        // 16 - any authentication or none, HTTPAUTH_NONE
        // Examples:
        // request.setHttpAuth(HTTPAUTH_NTLM | HTTPAUTH_BASIC, "username", "password");
        // request.setHttpAuth(HTTPAUTH_NONE, "username", "password");
        this.auth = { bitmask: bitmask, username: username, password: password };
    };
    /**
     * Sends an HTTP TRACE request to the specified URL with an optional data payload and returns the response.
     *
     * @param url - The URL to send the TRACE request to.
     * @param data - The optional data payload to include in the TRACE request.
     * @returns The response from the TRACE request.
     */
    HttpRequest.prototype.trace = function (url, data) {
        // Sends HTTP TRACE request to the URL with optional data payload and returns the response.
        return this.customRequest('TRACE', url, data);
    };
    return HttpRequest;
}());
exports.default = HttpRequest;
module.exports = HttpRequest;
//# sourceMappingURL=httprequest.js.map