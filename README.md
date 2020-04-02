# UBports API node module

[![Build Status](https://travis-ci.org/ubports/ubports-api-node-module.svg?branch=master)](https://travis-ci.org/ubports/ubports-api-node-module) [![Coverage Status](https://coveralls.io/repos/github/ubports/ubports-api-node-module/badge.svg?branch=master)](https://coveralls.io/github/ubports/ubports-api-node-module?branch=master)

This is a nodejs module to talk to ubports apis and services, built using modern javascript.

## Docs

This package combines modules for different modules to access different APIs:

- Devices: (**DEPRECATED**) Access basic information about every device
- Installer: Access the UBports Installer API

### Basic usage example

```javascript
const UbpApi = require("./src/module.js");

const installer = new UbpApi.Installer();
installer.getDevices().then(console.log);
```
