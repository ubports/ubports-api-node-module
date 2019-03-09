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

const time = () => Math.floor(new Date() / 1000);

// Base http api class
class HttpApi {
  constructor(options) {
    this.cache = {}
    if (options) {
      if (options.host.match(/https?:\/\/(www\.)?[-a-z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-z0-9@:%_\+.~#?&//=]*)/i)) {
        // ensure https
        if (!options.allow_insecure && options.host.includes("http://"))
          throw new Error("Insecure URL! Call with allow_insecure to ignore.");
        // ensure trailing slash
        this.host = options.host + (options.host.slice(-1) != "/" ? "/" : "");
      } else {
        throw new Error("Host is not a valid URL!");
      }
      if (options.port)
        this.port = options.port;
    }

    if (!this.host)
      throw Error("Host option is required.");
  }

  _get(endpoint) {
    if (endpoint === undefined) return;
    const _this = this;
    return new Promise(function(resolve, reject) {
      var now=time();
      if (_this.cache[endpoint] && _this.cache[endpoint]["expire"] > now) {
        resolve(_this.cache[endpoint]["data"]);
        return;
      } else {
        http.get({
          url: _this.host + endpoint,
          json: true
        }, (err, res, bod) => {
          if (err || res.statusCode !== 200) {
            reject(err);
            return;
          } else {
            if (!_this.cache[endpoint])
              _this.cache[endpoint] = {}
            _this.cache[endpoint]["data"] = bod;
            _this.cache[endpoint]["expire"] = time()+180;
            resolve(bod);
            return;
          }
        });
      }
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
