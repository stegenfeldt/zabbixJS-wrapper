---
weight: 11
title: "zabbixJS-wrapper.[js|ts]"
description: "Dissecting the wrapper script"
icon: "article"
date: "2025-03-18T08:51:35+01:00"
lastmod: "2025-03-18T08:51:35+01:00"
draft: false
toc: true
---

The `zabbixJS-wrapper.js` or `zabbixJS-wrapper.ts` is just a starting point, or a container that is prepared for writing more advanced scripts with the ability to properly debug them in VS Code. 

I would strongly suggest not mixing and matching JS and TS. Pick the version you want to work with and stick to it.

The core parts are the same, and I will explain them using the basic JS version here; they are very similar in TS.

## Environment and Global Setup
Since the Duktape engine uses a slightly limited ES5.1 feature-set in Zabbix, we have to keep it old-school. 

```js
"use strict";
var HttpRequest = require('./httprequest');
```
An LLM-based helper-bot, like copilot, may suggest that you use `imports` instead, but in this case that won't work. It has to be a `var`, and you have to use the old style `require()` function to load the httprequest module. 

To be fully compatible with Zabbix duktape JS, the global variable must be named `HttpRequest`.

## Wrapper function

```js
function zabbixJS(value) {
    // script goes here
}
```

You can name this function whatever you want, the important part is that the input parameter is named `value`, because that's how Zabbix will pass on your configured parameters to your script. 

### Receiving script-item parameters
These parameters will be passed as a JSON-string in a variable named *value*, so parsing them into an object is very helpful. 

```js
var params = JSON.parse(value);
```

Now, if you've configured a script-item parameter named *url* you can reference it like this.
```js
params.url
```
### Building your script
Within this wrapper function you can build your script pretty much however you want, with a few caveats. 
- Imports won't work
- You have to stick to ES5 language features
  - use only `var` variable declarations
  - `await/async` doesn't work
  - *arrow functions* don't work
- For HTTP(S) communication, you're limited to the [Zabbix HttpRequest](https://www.zabbix.com/documentation/current/en/manual/config/items/preprocessing/javascript/javascript_objects#httprequest) object.

There are some additional objects and functions available that you can read about in the [Zabbix documentation](https://www.zabbix.com/documentation/7.0/en/manual/config/items/preprocessing/javascript/javascript_objects).

### Returning data to script-item

At the end of your script (the wrapper function) you need to return your accumulated data to the script-item for processing by the Zabbix servers. 

The return data can be formatted however you like, but it will always be a string. 

My suggestion is to use some sort of structured data, like JSON. That way it's easy to parse and pre-process using the, fairly extensive, JSON-query features built into Zabbix. 

I tend to create a `returnData` object fairly early on in the script, that I keep building up during the script run. Here you can add whatever data you need for your monitoring, including collected error messages.
```js
var returnData = {};
```

Then finally I stringify the JSON object into a JSON-string and return it to the script item. 
```js
return (JSON.stringify(returnData));
```

## Example Javascript

```js
"use strict";
// the Zabbix Duktape engine is only able to run ES5 JavaScript
// do not use any modern features of TypeScript that are not compatible with ES5
// like async/await, Promises, arrow functions, etc.
// this is because the Zabbis server will always use the HttpRequest name to call the module
// if the name is altered, the Zabbix server will not be able to find the object
var HttpRequest = require('./httprequest');
// zabbix JS wrapper function
// zabbix will take the parameters defined in the UI and pass them into 
// this function as a JSON-string
function zabbixJS(value) {
    /////////////////
    // BEGIN SCRIPT //
    /////////////////
    // the parameters are passed as a JSON string, so we need to parse them
    var params = JSON.parse(value);
    // create a json object to store the results
    var returnData = {};
    // do the stuff here, for example:
    // Use HttpRequest object to query a simple example API that requires no 
    // API key or authentication
    var request = new HttpRequest();
    request.addHeader('Application: application/json');
    // make a GET request to the URL provided in the parameters
    var response = request.get(params.url);
    //make returnData (already JSON) the response
    returnData = JSON.parse(response);
    // output the results in a JSON format
    return (JSON.stringify(returnData));
    /////////////////
    // END SCRIPT //
    /////////////////
}
// prepare the parameters for the script
var parameters = {
    "url": "https://jsonplaceholder.typicode.com/todos/1",
    "etc": "etc",
};
var parameterString = JSON.stringify(parameters);
// this is the entry point for the script
// you do not have to save the result, unless you want to print it out in your tests
var result = zabbixJS(parameterString);
// very optional console.log()
console.log(result);
```

## Example Typescript
{{< alert context="info" text="The Typescript example specifically uses let, and const, to demonstrate that the typescript compiler with the provided configuration corrects such errors.<br />The Javascript example is in fact generated by this typescript example." />}}

```typescript
// the Zabbix Duktape engine is only able to run ES5 JavaScript
// so we need to transpile the TypeScript to ES5
// this is done using the TypeScript compiler
// the TypeScript compiler can be installed using npm
// npm install
// npm install -g typescript
// the TypeScript compiler can be run using the tsc command
// tsc
// tsc -w
// the TypeScript compiler can be configured using the tsconfig.json file
// the included tsconfig.json has a fairly compatible configuration 
// for the Zabbix Duktape engine
// and when transpiled to ES5 it will correct most of the incompatibilities 
// if you accidentally use any modern features of TypeScript that are not
// compatible with ES5
// but try to not use any more modern features of Typescript like
// async/await, Promises, arrow functions, etc. to be safe

// we specifically use the 'require' syntax to make sure that TS does not alter 
// the name of the imported module
// this is because the Zabbis server will always use the HttpRequest name 
// to call the module
// if the name is altered, the Zabbix server will not be able to find the module
const HttpRequest = require('./httprequest');

// zabbix JS wrapper function
// zabbix will take the parameters defined in the UI and pass them into 
// this function as a JSON-string
function zabbixJS(value: string) {
    /////////////////
    // BEGIN SCRIPT //
    /////////////////
    
    // the parameters are passed as a JSON string, so we need to parse them
    let params = JSON.parse(value);

    // create a json object to store the results
    let returnData = {};

    // do the stuff here, for example:
    // Use HttpRequest object to query a simple example API that requires no 
    // API key or authentication
    var request = new HttpRequest();
    request.addHeader('Application: application/json');
    // make a GET request to the URL provided in the parameters
    let response = request.get(params.url);
    //make returnData the response
    returnData = JSON.parse(response);

    // output the results in a JSON format
    return(JSON.stringify(returnData));

    /////////////////
    // END SCRIPT //
    /////////////////
}

// prepare the parameters for the script
const parameters = {
    "url": "https://jsonplaceholder.typicode.com/todos/1",
    "etc": "etc",
};
const parameterString: string = JSON.stringify(parameters);

// this is the entry point for the script
let result: string = zabbixJS(parameterString);
// saving and printint the result is optional
console.log(result);
```