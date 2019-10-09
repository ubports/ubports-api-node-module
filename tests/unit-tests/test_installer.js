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
      expect(api.host).to.eql("https://raw.githubusercontent.com/ubports/installer-configs/master/");
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

  describe("getDevices()", function() {
    it("should return devices", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(false, {statusCode: 200}, {codename_1: "Name 1", codename_2: "Name 2"});
      });

      const api = new Installer();
      return api.getDevices().then((result) => {
        expect(result).to.eql({codename_1: "Name 1", codename_2: "Name 2"});
        expect(requestStub).to.have.been.calledWith({
          url: "https://raw.githubusercontent.com/ubports/installer-configs/master/index.json",
          json: true
        });
      });
    });

    it("should return error", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(true, {statusCode: 500}, null);
      });

      const api = new Installer();
      return api.getDevices().then(() => {}).catch((err) => {
        expect(err).to.eql(true);
        expect(requestStub).to.have.been.calledWith({
          url: "https://raw.githubusercontent.com/ubports/installer-configs/master/index.json",
          json: true
        });
      });
    });
  });

  describe("getDeviceSelects()", function() {
    it("should return device selects", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(false, {statusCode: 200}, {codename_1: "Name 1", codename_2: "Name 2"});
      });

      const api = new Installer();
      return api.getDeviceSelects().then((result) => {
        expect(result).to.eql('<option name="codename_1">Name 1</option><option name="codename_2">Name 2</option>');
        expect(requestStub).to.have.been.calledWith({
          url: "https://raw.githubusercontent.com/ubports/installer-configs/master/index.json",
          json: true
        });
      });
    });

    it("should return error", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(true, {statusCode: 500}, null);
      });

      const api = new Installer();
      return api.getDeviceSelects().then(() => {}).catch((err) => {
        expect(err).to.eql(true);
        expect(requestStub).to.have.been.calledWith({
          url: "https://raw.githubusercontent.com/ubports/installer-configs/master/index.json",
          json: true
        });
      });
    });
  });

  describe("getAliases()", function() {
    it("should return aliases", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(false, {statusCode: 200}, {alias_1: "codename_1", alias_2: "codename_2"});
      });

      const api = new Installer();
      return api.getAliases().then((result) => {
        expect(result).to.eql({alias_1: "codename_1", alias_2: "codename_2"});
        expect(requestStub).to.have.been.calledWith({
          url: "https://raw.githubusercontent.com/ubports/installer-configs/master/aliases.json",
          json: true
        });
      });
    });

    it("should return error", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(true, {statusCode: 500}, null);
      });

      const api = new Installer();
      return api.getAliases().then(() => {}).catch((err) => {
        expect(err).to.eql(true);
        expect(requestStub).to.have.been.calledWith({
          url: "https://raw.githubusercontent.com/ubports/installer-configs/master/aliases.json",
          json: true
        });
      });
    });
  });

  describe("resolveAlias()", function() {
    it("should resolve alias", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(false, {statusCode: 200}, {alias_1: "codename_1", alias_2: "codename_2"});
      });

      const api = new Installer();
      return api.resolveAlias("alias_1").then((result) => {
        expect(result).to.eql("codename_1");
        expect(requestStub).to.have.been.calledWith({
          url: "https://raw.githubusercontent.com/ubports/installer-configs/master/aliases.json",
          json: true
        });
      });
    });

    it("should not resolve valid codename", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(false, {statusCode: 200}, {alias_1: "codename_1", alias_2: "codename_2"});
      });

      const api = new Installer();
      return api.resolveAlias("codename_1").then((result) => {
        expect(result).to.eql("codename_1");
        expect(requestStub).to.have.been.calledWith({
          url: "https://raw.githubusercontent.com/ubports/installer-configs/master/aliases.json",
          json: true
        });
      });
    });
  });

});
