---
title: "What is zabbixJS-wrapper?"
description: "Short description of the zabbixJS-wrapper, what it is, and what it is not."
icon: "article"
draft: false
toc: true
weight: 1
---

## 1. The Workspace

The workspace is a super-simple workspace definition for VS Code with some extension recommentations and packages.  
It has the HttpRequest module, config files and a template `.ts` script file to get going with the development of Zabbix script-items.

## 2. The HttpRequest module

Since Zabbix script-items uses the embedded duktape JS engine for execution, it is not possible to load or import modules like normal JS applications.  

To make web development easier (or rather, possible), Zabbix have included a global [HttpRequest](https://www.zabbix.com/documentation/7.0/en/manual/config/items/preprocessing/javascript/javascript_objects#httprequest) object based on libcurl for basic http-requests. One that I have (mostly) replicated the functionality of in a Node.js-compatible [`HttpRequest`](/docs/what-is/HttpRequest/)-class.

So I made a very rudimentary wrapper for an existing, and synchronous, module that is included in the workspace example. This allows for easier development with proper debugging, breakpoints and variable inspections in VS Code.

## 3. The Typescript config

One of my biggest annoyances when developing script-items, especially when it comes to more advanced ones -- Azure Logic Apps monitoring, for one -- is the lack of live debugging with breakpoints as well as varible inspection. I also very much like to work in somewhat type-safe languages and Typescript is... decently thus.

The embedded Duktape engine used by Zabbix is also not compatible with ES6+ and many of the more modern JS features, so I've made the `.tsconfig` file in the workspace somewhat decent at correcting my habits of using `let`, or `const` to ensure proper scope for my variables.  
It is configured to compile the Typescript code into ES5 and commonJS compatible code, which is mostly supported by Zabbix script-items.