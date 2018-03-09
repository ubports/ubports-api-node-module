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

const DEFAULT_HOST = "https://api.ubports.com/v1/devices/";

class Devices extends HttpApi {
  constructor(options) {
    if (!options)
      options = {};
    if (!options.host)
      options.host = DEFAULT_HOST;
    super(options);
  }

  getDevices() {
    return this._get("");
  }

  getDevice(device) {
    return this._get(device);
  }

  getNotWorking(device) {
    return this.getDevice(device).then((ret) => {
      var whatsWorking = ret.whatIsWorking;
      var notWorking = [];
      for (var i in whatsWorking) {
        if (!whatsWorking[i].works)
          notWorking.push(whatsWorking[i].feature);
      }
      if (notWorking.length === 0)
        return false;
      return notWorking;
    });
  }
}

/*
 * TODO
 * - Primitive Functions
 *  - Admin
 *   - accept key in constructor
 *   - createDevice()
 *   - deleteDevice()
 *   - editDevice()
 *   - setImage()
 * - Convenience Functions
 *  - User
 *   - getPicture()
 */

module.exports = Devices;
