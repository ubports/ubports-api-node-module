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

const http = require("request");

// Base http api class
class HttpApi {
  constructor(options) {
    if (options) {
      if (options.host)
        this.host = options.host;
      if (options.port)
        this.port = options.port;
    }

    if (!this.host)
      throw Error("Host option is required");
  }

  _get(endpoint) {
    const _this = this;
    return new Promise(function(resolve, reject) {
      http.get({
        url: _this.host + endpoint,
        json: true
      }, (err, res, bod) => {
        if (err || res.statusCode !== 200) {
          reject(err);
          return;
        }
        resolve(bod);
      });
    });
  }

  _post(endpoint, body) {
    const _this = this;
    return new Promise(function(resolve, reject) {
      http.post({
        url: _this.host + endpoint,
        json: true,
        body: body
      }, (err, res, bod) => {
        if (err || res.statusCode !== 200) {
          reject(err);
          return;
        }
        resolve(bod);
      });
    });
  }
}

module.exports = HttpApi;
