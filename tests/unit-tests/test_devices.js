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

const Devices = require('../../src/module.js').Devices;

const devicesJson = require("../test-data/devices.json")
const deviceBaconJson = require("../test-data/device-bacon.json")
const deviceFP2Json = require("../test-data/device-FP2.json")

describe('Devices module', function() {
  describe("constructor()", function() {
    it("should create default devices-api-client", function() {
      const api = new Devices();
      expect(api.host).to.eql("https://devices.ubports.com/");
    });

    it("should create custom devices-api-client", function() {
      const api = new Devices({ host: "https://devices.example.com/" });
      expect(api.host).to.eql("https://devices.example.com/");
    });

    it("should ensure trailing slash", function() {
      const api = new Devices({ host: "https://devices.example.com" });
      expect(api.host).to.eql("https://devices.example.com/");
    });

    it("should return insecure error", function() {
      try {
        const api = new Devices({ host: "https://devices.example.com/" });
      } catch (err) {
        expect(err.message).to.equal("Insecure URL! Call with allow_insecure to ignore.");
      }
    });

    it("should ensure create insecure devices-api-client", function() {
      const api = new Devices({
        host: "https://devices.example.com/",
        allow_insecure: true
      });
      expect(api.host).to.eql("https://devices.example.com/");
    });

    it("should return invalid url error", function() {
      try {
        const api = new Devices({ host: "definitely not a valid url" });
      } catch (err) {
        expect(err.message).to.equal("Host is not a valid URL!");
      }
    });
  });

  describe("getDevices()", function() {
    it("should return devices", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(false, {statusCode: 200}, devicesJson);
      });

      const api = new Devices();
      return api.getDevices().then((result) => {
        expect(result).to.eql(devicesJson);
        expect(requestStub).to.have.been.calledWith({
          url: "https://devices.ubports.com/api/devices",
          json: true
        });
      });
    });

    it("should return error", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(true, {statusCode: 500}, devicesJson);
      });

      const api = new Devices();
      return api.getDevices().then(() => {}).catch((err) => {
        expect(err).to.eql(true);
        expect(requestStub).to.have.been.calledWith({
          url: "https://devices.ubports.com/api/devices",
          json: true
        });
      });
    });
  });

  describe("getDevice()", function() {
    it("should return devices", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(false, {statusCode: 200}, deviceBaconJson);
      });

      const api = new Devices();
      return api.getDevice("bacon").then((result) => {
        expect(result).to.eql(deviceBaconJson);
        expect(requestStub).to.have.been.calledWith({
          url: "https://devices.ubports.com/api/device/bacon",
          json: true
        });
      });
    });

    it("should return error", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(true, {statusCode: 500}, deviceBaconJson);
      });

      const api = new Devices();
      return api.getDevice("bacon").then(() => {}).catch((err) => {
        expect(err).to.eql(true);
        expect(requestStub).to.have.been.calledWith({
          url: "https://devices.ubports.com/api/device/bacon",
          json: true
        });
      });
    });
  });

  describe("getNotWorking()", function() {
    it("should return an empty array", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(false, {statusCode: 200}, deviceBaconJson);
      });

      const api = new Devices();
      return api.getNotWorking("bacon").then((result) => {
        expect(result).to.eql(false);
        expect(requestStub).to.have.been.calledWith({
          url: "https://devices.ubports.com/api/device/bacon",
          json: true
        });
      });
    });

    it("should return what's not working", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(false, {statusCode: 200}, deviceFP2Json);
      });

      const api = new Devices();
      return api.getNotWorking("FP2").then((result) => {
        expect(result).to.eql(['GPS']);
        expect(requestStub).to.have.been.calledWith({
          url: "https://devices.ubports.com/api/device/FP2",
          json: true
        });
      });
    });

    it("should return error", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(true, {statusCode: 500}, deviceBaconJson);
      });

      const api = new Devices();
      return api.getNotWorking("bacon").then(() => {}).catch((err) => {
        expect(err).to.eql(true);
        expect(requestStub).to.have.been.calledWith({
          url: "https://devices.ubports.com/api/device/bacon",
          json: true
        });
      });
    });
  });
});
