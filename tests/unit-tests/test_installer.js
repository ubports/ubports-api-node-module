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

const fs = require('fs');
const request = require('request');

const chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

const Installer = require('../../src/module.js').Installer;

describe('Installer module', function() {
  describe("constructor()", function() {
    it("should create default installer-api-client", function() {
      const api = new Installer();
      expect(api.host).to.eql("https://devices.ubports.com/");
    });

    it("should create custom installer-api-client", function() {
      const api = new Installer({ host: "https://devices.example.com/" });
      expect(api.host).to.eql("https://devices.example.com/");
    });

    it("should ensure trailing slash", function() {
      const api = new Installer({ host: "https://devices.example.com" });
      expect(api.host).to.eql("https://devices.example.com/");
    });

    it("should return insecure error", function() {
      try {
        const api = new Installer({ host: "https://devices.example.com/" });
      } catch (err) {
        expect(err.message).to.equal("Insecure URL! Call with allow_insecure to ignore.");
      }
    });

    it("should ensure create insecure installer-api-client", function() {
      const api = new Installer({
        host: "https://devices.example.com/",
        allow_insecure: true
      });
      expect(api.host).to.eql("https://devices.example.com/");
    });

    it("should return invalid url error", function() {
      try {
        const api = new Installer({ host: "definitely not a valid url" });
      } catch (err) {
        expect(err.message).to.equal("Host is not a valid URL!");
      }
    });
  });
});
