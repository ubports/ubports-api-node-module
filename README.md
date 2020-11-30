# UBports API node module

[![Build Status](https://travis-ci.org/ubports/ubports-api-node-module.svg?branch=master)](https://travis-ci.org/ubports/ubports-api-node-module) [![Coverage Status](https://coveralls.io/repos/github/ubports/ubports-api-node-module/badge.svg?branch=master)](https://coveralls.io/github/ubports/ubports-api-node-module?branch=master)

**DEPRECATION NOTICE**: This module has been deprecated. It's functionality has been re-implemented as a part of the [UBports Installer](https://github.com/ubports/ubports-installer/) source code.

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

## License

Original development by [Marius Gripsgård](http://mariogrip.com/) and [Jan Sprinz](https://spri.nz). Copyright (C) 2017-2020 [UBports Foundation](https://ubports.com).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
