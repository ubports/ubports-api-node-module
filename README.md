# Ubports API's node module
[![Build Status](https://travis-ci.org/ubports/ubports-api-node-module.svg?branch=master)](https://travis-ci.org/ubports/ubports-api-node-module) [![Coverage Status](https://coveralls.io/repos/github/ubports/ubports-api-node-module/badge.svg?branch=master)](https://coveralls.io/github/ubports/ubports-api-node-module?branch=master)

This is a nodejs module to talk to ubports apis and services, built using modern javascript.

*WIP*

### Example

```javascript
const UbpApi = require("./src/module.js");

const devices = new UbpApi.Devices();
const installer = new UbpApi.Installer();

installer.getInstallInstructs("FP2").then((t) => console.log("Device: " + t.name));
devices.getNotWorking("FP2").then((t) => console.log("Not working: " + t));
```
