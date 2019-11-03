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

const DEFAULT_HOST =
  "https://raw.githubusercontent.com/ubports/installer-configs/master/";

class Installer extends HttpApi {
  constructor(options) {
    if (!options) options = {};
    if (!options.host) options.host = DEFAULT_HOST;
    super(options);
  }

  getDevices() {
    return this._get("index.json");
  }

  getDeviceSelects() {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this
        .getDevices()
        .then(devices => {
          var devicesAppend = [];
          Object.entries(devices)
            .sort((a, b) => a[1].localeCompare(b[1]))
            .forEach(device => {
              devicesAppend.push(
                '<option name="' + device[0] + '">' + device[1] + "</option>"
              );
            });
          resolve(devicesAppend.join(""));
        })
        .catch(reject);
    });
  }

  getAliases() {
    return this._get("aliases.json");
  }

  resolveAlias(codename) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this
        .getAliases()
        .then(aliases => {
          resolve(aliases[codename] || codename);
        })
        .catch(reject);
    });
  }

  getDevice(codename) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this
        .resolveAlias(codename)
        .then(codename => {
          _this
            ._get("v1/" + codename + ".json")
            .then(device => {
              resolve(device);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  getDeviceName(codename) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this
        .getDevice(codename)
        .then(device => {
          if (device && device.name) resolve(device.name);
          else reject();
        })
        .catch(reject);
    });
  }

  getOSs(codename) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this
        .getDevice(codename)
        .then(device => {
          if (device && device.operating_systems) {
            var operatingSystems = [];
            for (var i = 0; i < device.operating_systems.length; i++) {
              operatingSystems.push(device.operating_systems[i].name);
            }
            resolve(operatingSystems);
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  }

  getOSSelects(codename) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      _this
        .getOSs(codename)
        .then(operatingSystems => {
          var osSelects = [];
          for (var i = 0; i < operatingSystems.length; i++) {
            osSelects.push(
              '<option name="' + i + '">' + operatingSystems[i] + "</option>"
            );
          }
          resolve(osSelects);
        })
        .catch(reject);
    });
  }
}

module.exports = Installer;
