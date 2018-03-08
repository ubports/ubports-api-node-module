# UBports API node module

[![Build Status](https://travis-ci.org/ubports/ubports-api-node-module.svg?branch=master)](https://travis-ci.org/ubports/ubports-api-node-module) [![Coverage Status](https://coveralls.io/repos/github/ubports/ubports-api-node-module/badge.svg?branch=master)](https://coveralls.io/github/ubports/ubports-api-node-module?branch=master)

This is a nodejs module to talk to ubports apis and services, built using modern javascript.

**WIP**: More APIs will be added in the future.

## Docs

This package combines modules for different modules to access different APIs:

- [Devices](#Devices): Access basic information about every device.
- [Installer](#Installer): Access the Installer API.

## Basic usage example

```javascript
const UbpApi = require("./src/module.js");

const devices = new UbpApi.Devices();
const installer = new UbpApi.Installer();

installer.getInstallInstructs("FP2").then((t) => console.log("Device: " + t.name));
devices.getNotWorking("FP2").then((t) => console.log("Not working: " + t));
```

### Devices

The constructor takes an object with optional properties as an argument. The default properties are listed below.

```javascript
{
  host: "https://devices.ubports.com/", // URL of the devices api
  allow_insecure: false                 // allow unencrypted URL
  cache_time: 180                       // time to keep cached files
}
```

#### getDevices



## Installer
