
const UbpApi = require("./src/module.js");

const devices = new UbpApi.Devices();
const installer = new UbpApi.Installer();


devices.getNotWorking("FP2").then((t) => console.log(t));
installer.getInstallInstructs("FP2").then((t) => console.log(t));