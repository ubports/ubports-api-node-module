"use strict";
/*
 * Copyright (C) 2017 Marius Gripsgard <marius@ubports.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const HttpApi = require("./http.js");

const DEFAULT_HOST = "https://devices.ubports.com/";

class Installer extends HttpApi {
  constructor(options) {
    if (!options)
      options = {};
    if (!options.host)
      options.host = DEFAULT_HOST;
    super(options);
  }

  getDevices() {
    return this._get("api/installer/devices");
  }

  getDevice(device) {
    return this._get("api/installer/devices/"+device);
  }

  getInstallInstructs(device) {
    return this._get("api/installer/"+device);
  }
}

module.exports = Installer;
