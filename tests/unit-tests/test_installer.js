"use strict";

/*
 * Copyright (C) 2017-2020 UBports Foundation <info@ubports.com>
 * Copyright (C) 2017 Marius Gripsgard <marius@ubports.com>
 * Copyright (C) 2017-2020 Jan Sprinz <neo@neothethird.de>
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

const chai = require("chai");
const sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

const Installer = require("../../src/module.js").Installer;

describe("Installer module", function() {
  describe("constructor()", function() {
    it("should create default installer-api-client", function() {
      const api = new Installer();
      expect(api.host).to.eql(
        "https://raw.githubusercontent.com/ubports/installer-configs/master/"
      );
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
        new Installer({ host: "https://devices.example.com/" });
      } catch (err) {
        expect(err.message).to.equal(
          "Insecure URL! Call with allow_insecure to ignore."
        );
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
        new Installer({ host: "definitely not a valid url" });
      } catch (err) {
        expect(err.message).to.equal("Host is not a valid URL!");
      }
    });
  });

  describe("getDevices()", function() {
    it("should return devices", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves({
        codename_1: "Name 1",
        codename_2: "Name 2"
      });
      return api.getDevices().then(result => {
        expect(result).to.eql({ codename_1: "Name 1", codename_2: "Name 2" });
      });
    });
  });

  describe("getDeviceSelects()", function() {
    it("should return device selects", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves({
        codename_1: "Name 1",
        codename_2: "Name 2"
      });
      return api.getDeviceSelects().then(result => {
        expect(result).to.eql(
          '<option name="codename_1">Name 1</option><option name="codename_2">Name 2</option>'
        );
      });
    });
  });

  describe("getAliases()", function() {
    it("should return aliases", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves({
        alias_1: "codename_1",
        alias_2: "codename_2"
      });
      return api.getAliases().then(result => {
        expect(result).to.eql({ alias_1: "codename_1", alias_2: "codename_2" });
      });
    });
  });

  describe("resolveAlias()", function() {
    it("should resolve alias", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves({
        alias_1: "codename_1",
        alias_2: "codename_2"
      });
      return api.resolveAlias("alias_1").then(result => {
        expect(result).to.eql("codename_1");
      });
    });

    it("should resolve already valid codename as-is", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves({
        alias_1: "codename_1",
        alias_2: "codename_2"
      });
      return api.resolveAlias("codename_1").then(result => {
        expect(result).to.eql("codename_1");
      });
    });
  });

  describe("getDevice()", function() {
    it("should resolve device", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves("some data");
      return api.getDevice("alias_1").then(result => {
        expect(result).to.eql("some data");
      });
    });
    it("should reject if response empty");
  });

  describe("getDeviceName()", function() {
    it("should resolve device name", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves({
        alias_1: "codename_1",
        name: "This is a name"
      });
      return api.getDeviceName("alias_1").then(result => {
        expect(result).to.eql("This is a name");
      });
    });

    it("should reject if not found", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves({
        something: "weird",
        in_your: "neighborhood"
      });
      return api.getDeviceName("alias_1").catch(err => {
        expect(err).to.eql(undefined);
      });
    });
  });

  describe("getOSs()", function() {
    it("should return operating systems", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves({
        alias_1: "codename_1",
        operating_systems: [
          { name: "name0" },
          { name: "name1" },
          { name: "name2" },
          { name: "name3" }
        ]
      });
      return api.getOSs("alias_1").then(result => {
        expect(result).to.eql(["name0", "name1", "name2", "name3"]);
      });
    });

    it("should reject if nothing available", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves({
        alias_1: "codename_1"
      });
      return api.getOSs("alias_1").catch(error => {
        expect(error).to.eql(undefined);
      });
    });
  });

  describe("getOSSelects()", function() {
    it("should return os selects", function() {
      const api = new Installer();
      api._get = sinon.fake.resolves({
        alias_1: "codename_1",
        operating_systems: [
          { name: "name0" },
          { name: "name1" },
          { name: "name2" },
          { name: "name3" }
        ]
      });
      return api.getOSSelects("alias_1").then(result => {
        expect(result).to.eql([
          '<option name="0">name0</option>',
          '<option name="1">name1</option>',
          '<option name="2">name2</option>',
          '<option name="3">name3</option>'
        ]);
      });
    });
  });
});
