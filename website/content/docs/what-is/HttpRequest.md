---
weight: 10
title: "HttpRequest"
description: "Describes the HttpRequest class and its methods."
icon: "article"
date: "2025-03-18T08:50:40+01:00"
lastmod: "2025-03-18T08:50:40+01:00"
draft: false
toc: true
---

The `HttpRequest` class is a Node.js implementation of the Zabbix Duktape `HttpRequest` object. It provides synchronous HTTP methods to work within the Zabbix Duktape environment.

## How to use `HttpRequest` in code

I have provided working examples in [zabbixJS-wrapper.js](/docs/what-is/zabbixjs-wrapper.js/)

## Methods

### `addHeader(value: string)`
Adds an HTTP header field to the request. This field is used for all following requests until cleared with the `clearHeader()` method.

- **Parameters:**
  - `value` (string): The header field to add, in the format `"Key: Value"`.
- **Throws:** 
  - `Error` if the total header size exceeds 128 Kbytes.
- **Example:**
  ```typescript
  request.addHeader("Content-Type: application/json");
  request.addHeader("Authorization: Basic " + params.authentication);
  ```

---

### `clearHeader()`
Clears all HTTP headers.  
This might be useful since `HttpRequest` will accumulate all headers sent and received between calls and it might be necessary to use `getHeaders()` to store the current headers in a variable, clear the headers, then re-add those needed for the next query.  

This is not always necessary, but some endpoints will try to parse all incoming headers and having too many of them might mess stuff up. 

---

### `connect(url: string)`
Sends an HTTP `CONNECT` request to the specified URL and returns the response.

- **Parameters:**
  - `url` (string): The URL to which the `CONNECT` request is sent.
- **Returns:** The response from the `CONNECT` request.

---

### `customRequest(method: string, url: string, data: string): string`
Sends a custom HTTP request using the specified method, URL, and data.

- **Parameters:**
  - `method` (string): The HTTP method to use (e.g., `'GET'`, `'POST'`).
  - `url` (string): The URL to which the request is sent.
  - `data` (string): The data to be sent in the request body.
- **Returns:** The response data as a string.
- **Throws:** 
  - `Error` if the request encounters an error or if the HTTP method is invalid.

---

### `delete(url: string, data: string)`
Sends an HTTP `DELETE` request to the specified URL with an optional data payload.

- **Parameters:**
  - `url` (string): The URL to send the `DELETE` request to.
  - `data` (string): The optional data payload.
- **Returns:** The response from the `DELETE` request.

---

### `getHeaders(asArray: boolean)`
Returns the object of received HTTP header fields.

- **Parameters:**
  - `asArray` (boolean): If `true`, returns header values as arrays (for multiple same-name headers). Otherwise, returns them as strings.
- **Returns:** An object containing the HTTP header fields.

---

### `get(url: string, data?: string)`
Sends an HTTP `GET` request to the specified URL with an optional data payload.

- **Parameters:**
  - `url` (string): The URL to send the `GET` request to.
  - `data` (string, optional): The optional data payload.
- **Returns:** The response from the `GET` request.

Normally, GET requests normally do not use a data payload, but it's there because it's not against the HTTP specifications to do so.  
In general, all important data in a GET request is within the URI and any data payload should not have any semantic meaning. 

---

### `head(url: string)`
Sends an HTTP `HEAD` request to the specified URL.

- **Parameters:**
  - `url` (string): The URL to which the `HEAD` request is sent.
- **Returns:** The response from the `HEAD` request.

---

### `options(url: string)`
Sends an HTTP `OPTIONS` request to the specified URL.

- **Parameters:**
  - `url` (string): The URL to which the `OPTIONS` request is sent.
- **Returns:** The response from the `OPTIONS` request.

---

### `patch(url: string, data: string)`
Sends an HTTP `PATCH` request to the specified URL with an optional data payload.

- **Parameters:**
  - `url` (string): The URL to which the `PATCH` request is sent.
  - `data` (string): The optional data payload.
- **Returns:** The response from the `PATCH` request.

---

### `put(url: string, data: string)`
Sends an HTTP `PUT` request to the specified URL with the provided data payload.

- **Parameters:**
  - `url` (string): The URL to which the `PUT` request is sent.
  - `data` (string): The data payload.
- **Returns:** The response from the server.

---

### `post(url: string, data: string)`
Sends an HTTP `POST` request to the specified URL with the provided data payload.

- **Parameters:**
  - `url` (string): The URL to which the `POST` request is sent.
  - `data` (string): The data payload.
- **Returns:** The response from the `POST` request.
- **Example:**
  ```typescript
  const fields = { some fields };
  const resp = req.post('https://jira.example.com/rest/api/2/issue/', JSON.stringify({ "fields": fields }));
  ```

---

### `getStatus(): number`
Retrieves the HTTP status code of the last request.

- **Returns:** The HTTP status code of the last request.

---

### `setProxy(proxy: string)`
Sets the HTTP proxy to the specified value.

- **Parameters:**
  - `proxy` (string): The proxy URL in the format `http://username:password@proxy:port`.

---

### `setHttpAuth(bitmask: number, username: string, password: string)`
Sets HTTP authentication credentials.

- **Parameters:**
  - `bitmask` (number): A bitmask representing the authentication methods to use:
    - `1` (HTTPAUTH_BASIC): Basic authentication
    - `2` (HTTPAUTH_DIGEST): Digest authentication
    - `4` (HTTPAUTH_NEGOTIATE): Negotiate authentication
    - `8` (HTTPAUTH_NTLM): NTLM authentication
    - `16` (HTTPAUTH_NONE): Any authentication or none
  - `username` (string): The username for authentication.
  - `password` (string): The password for authentication.
- **Example:**
  ```typescript
  // Set NTLM and Basic authentication
  request.setHttpAuth(HTTPAUTH_NTLM | HTTPAUTH_BASIC, "username", "password");

  // Set no specific authentication
  request.setHttpAuth(HTTPAUTH_NONE, "username", "password");
  ```

---

### `trace(url: string, data: string)`
Sends an HTTP `TRACE` request to the specified URL with an optional data payload.

- **Parameters:**
  - `url` (string): The URL to send the `TRACE` request to.
  - `data` (string): The optional data payload.
- **Returns:** The response from the `TRACE` request.