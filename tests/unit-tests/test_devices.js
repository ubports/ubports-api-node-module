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

const fs = require("fs");

const chai = require("chai");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

const Devices = require("../../src/module.js").Devices;

const devicesJson = require("../test-data/devices.json");
const deviceBaconJson = require("../test-data/device-bacon.json");
const deviceFP2Json = require("../test-data/device-FP2.json");

describe("Devices module", function() {
  describe("constructor()", function() {
    it("should throw deprecation warning", function(done) {
      try {
        const api = new Devices();
        done("error: should have thrown");
      } catch (e) {
        done();
      }
    });
  });
});
