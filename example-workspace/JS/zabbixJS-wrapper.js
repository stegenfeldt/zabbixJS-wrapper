"use strict";
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
// the included tsconfig.json has a fairly compatible configuration for the Zabbix Duktape engine
// and when transpiled to ES5 it will correct most of the incompatibilities if you accidentally
// use any modern features of TypeScript that are not compatible with ES5
// but try to not use any more modern features of Typescript like
// async/await, Promises, arrow functions, etc. to be safe
// we specifically use the 'require' syntax to make sure that TS does not alter the name of the imported module
// this is because the Zabbis server will always use the HttpRequest name to call the module
// if the name is altered, the Zabbix server will not be able to find the module
var HttpRequest = require('./httprequest');
// zabbix JS wrapper function
// zabbix will take the parameters defined in the UI and pass them into this function as a JSON-string
function zabbixJS(value) {
    /////////////////
    // BEGIN SCRIPT //
    /////////////////
    // the parameters are passed as a JSON string, so we need to parse them
    var params = JSON.parse(value);
    // create a json object to store the results
    var returnData = {};
    // do the stuff here, for example:
    // Use HttpRequest object to query a simple example API that requires no API key or authentication
    var request = new HttpRequest();
    request.addHeader('Application: application/json');
    // make a GET request to the URL provided in the parameters
    var response = request.get(params.url);
    //make returnData the response
    returnData = JSON.parse(response);
    // output the results in a JSON format
    return (JSON.stringify(returnData));
    /////////////////
    // END SCRIPT //
    /////////////////
}
// prepare the parameters for the script
var parameters = {
    "parameter 1": "value of parameter 1",
    "parameter 2": "value of parameter 2",
    "url": "https://jsonplaceholder.typicode.com/todos/1",
    "etc": "etc",
};
var parameterString = JSON.stringify(parameters);
// this is the entry point for the script
var result = zabbixJS(parameterString);
console.log(result);
//# sourceMappingURL=zabbixJS-wrapper.js.map