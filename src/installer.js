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

const DEFAULT_HOST = "https://raw.githubusercontent.com/ubports/installer-configs/master/";

class Installer extends HttpApi {
  constructor(options) {
    if (!options)
      options = {};
    if (!options.host)
      options.host = DEFAULT_HOST;
    super(options);
  }

  getDevices() {
    return this._get("index.json");
  }

  getDeviceSelects() {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this.getDevices().then((devices) => {
        var devicesAppend = [];
        Object.entries(devices).forEach((device) => {
          devicesAppend.push("<option name=\"" + device[0] + "\">" + device[1] + "</option>");
        });
        resolve(devicesAppend.join(''));
      }).catch(reject);
    });
  }

  getAliases() {
    return this._get("aliases.json");
  }

  resolveAlias(codename) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this.getAliases().then((aliases) => {
        resolve(aliases[codename] || codename);
      }).catch(reject);
    });
  }
}

module.exports = Installer;
