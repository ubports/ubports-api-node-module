# UBports API node module

[![Build Status](https://travis-ci.org/ubports/ubports-api-node-module.svg?branch=master)](https://travis-ci.org/ubports/ubports-api-node-module) [![Coverage Status](https://coveralls.io/repos/github/ubports/ubports-api-node-module/badge.svg?branch=master)](https://coveralls.io/github/ubports/ubports-api-node-module?branch=master)

This is a nodejs module to talk to ubports apis and services, built using modern javascript.

**WIP**: More APIs will be added in the future.

## Docs

This package combines modules for different modules to access different APIs:

- [Devices](#Devices): Access basic information about every device.
- [Installer](#Installer): Access the Installer API.

### Basic usage example

```javascript
const UbpApi = require("./src/module.js");

const devices = new UbpApi.Devices();
const installer = new UbpApi.Installer();

devices.getNotWorking("FP2").then((notWorking) => console.log("Not working: " + notWorking));
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
#### Primitive Calls

##### getDevices()

- [Device - Get all core devices](https://api.ubports.com/#api-Device-GetDevices)
- [CommunityDevice - Get all community devices](https://api.ubports.com/#api-CommunityDevice-GetCommunityDevices)

Returns a promise for an array of devices.

```javascript
devices.getDevices().then((devices) => for(device in devices) console.log(device.name));
```

##### getDevice(device)

- [Device - Get core device](https://api.ubports.com/#api-https://api.ubports.com/#api-Device-GetDevice)
- [CommunityDevice - Get community device](https://api.ubports.com/#api-CommunityDevice-GetCommunityDevice)

Returns a promise for a device object.

```javascript
devices.getDevice("bacon").then((device) => console.log(device.info));
```

#### Convenience Functions

##### getNotWorking(device)

Returns a promise for a list of broken features, returns false if no bugs are known.

```javascript
devices.getNotWorking("FP2").then((notWorking) => {
  if (notWorking)
    console.log("Not working: " + device.info);
  else {
    console.log("Everything works").
  }
});
```

## Installer
