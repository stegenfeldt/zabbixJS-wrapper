---
weight: 12
title: "tsconfig.json"
description: "Explaining the typescript config."
icon: "code"
date: "2025-03-18T08:52:03+01:00"
lastmod: "2025-03-18T08:52:03+01:00"
draft: false
toc: true
---

The `tsconfig.json` file is a configuration file used by TypeScript to specify the compiler options and project structure. Below is an explanation of the key fields in a typical `tsconfig.json` file:

### `compilerOptions`
This section defines the options for the TypeScript compiler:
- **`outDir`**: Specifies the output directory for compiled JavaScript files.
- **`target`**: Sets the JavaScript version to which TypeScript code will be transpiled (e.g., `ES5`).
- **`module`**: Defines the module system to use (e.g., `commonjs`).
- **`strict`**: Enables all strict type-checking options.
- **`noImplicitAny`**: Disallows variables with an implicit `any` type.
- **`esModuleInterop`**: Ensures compatibility with CommonJS and ES Modules.
- **`forceConsistentCasingInFileNames`**: Enforces consistent casing in file names.
- **`sourceMap`**: Generates source map files for debugging.
- **`lib`**: Specifies the library files to include in the compilation (e.g., `ES5`).
- **`skipLibCheck`**: Skips type checking of declaration files.

### `include`
Defines the files or directories to include in the project. For example, `["./**/*.ts"]` includes all `.ts` files in the project.

### `exclude`
Specifies files or directories to exclude from the project. Common exclusions include `node_modules` and test files like `**/*.spec.ts`.

### Example
Here is an example `tsconfig.json` file:
```jsonc
{
  "compilerOptions": {
    "outDir": "./JS",
    "target": "ES5",
    "module": "commonjs",
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "sourceMap": true,
    "lib": ["ES5"],
    "skipLibCheck": true
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

This configuration ensures that TypeScript compiles the code with strict type-checking and outputs JavaScript files compatible with older environments.

