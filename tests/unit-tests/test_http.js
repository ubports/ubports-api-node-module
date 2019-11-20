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

const request = require("request");
const chai = require("chai");
var expect = chai.expect;

const httpApi = require("../../src/http.js");

describe("Http Module", function() {
  describe("constructor()", function() {
    it("should throw error if URL is insecure", function() {
      try {
        const api = new httpApi({
          host: "http://devices.example.com/"
        });
      } catch (err) {
        expect(err.message).to.eql(
          "Insecure URL! Call with allow_insecure to ignore."
        );
      }
    });
    it("should return the host if connection is secure", function() {
      const api = new httpApi({
        host: "https://devices.example.com/"
      });
      expect(api).to.not.null;
      expect(api.host).to.eql("https://devices.example.com/");
    });
    it("should create host with port when specified", function() {
      const api = new httpApi({
        host: "https://devices.example.com/",
        port: "8080"
      });
      expect(api.port).to.eql("8080");
    });
  });

  describe("_get()", function() {
    it("should resolve data", function() {
      const requestStub = this.sandbox
        .stub(request, "get")
        .callsFake(function(url, cb) {
          cb(false, { statusCode: 200 }, "seems ok");
        });

      const api = new httpApi({
        host: "https://www.testurl.com"
      });
      return api._get("testendpoint").then(result => {
        expect(result).to.eql("seems ok");
        expect(requestStub).to.have.been.calledWith({
          url: "https://www.testurl.com/testendpoint",
          json: true,
          timeout: 2000
        });
      });
    });
    it("should resolve cached data", function() {
      const requestStub = this.sandbox
        .stub(request, "get")
        .callsFake(function(url, cb) {
          cb(false, { statusCode: 200 }, "seems ok");
        });

      const api = new httpApi({
        host: "https://www.testurl.com"
      });
      return Promise.all([
        api._get("testendpoint"),
        api._get("testendpoint")
      ]).then(results => {
        expect(results[0]).to.eql("seems ok");
        expect(results[1]).to.eql("seems ok");
        expect(requestStub).to.have.been.calledWith({
          url: "https://www.testurl.com/testendpoint",
          json: true,
          timeout: 2000
        });
        expect(requestStub).to.not.have.been.calledTwice;
      });
    });

    it("should respect cache time", function() {
      let i = 0;
      const requestStub = this.sandbox
        .stub(request, "get")
        .callsFake(function(url, cb) {
          cb(false, { statusCode: 200 }, "request " + i++ + " ok");
        });

      const api = new httpApi({
        host: "https://www.testurl.com",
        cachetime: -1
      });
      return Promise.all([
        api._get("testendpoint"),
        api._get("testendpoint")
      ]).then(results => {
        expect(results[0]).to.not.eql(results[1]);
        expect(requestStub).to.have.been.calledWith({
          url: "https://www.testurl.com/testendpoint",
          json: true,
          timeout: 2000
        });
        expect(requestStub).to.have.been.calledTwice;
      });
    });

    it("should time out", function() {
      const requestStub = this.sandbox
        .stub(request, "get")
        .callsFake(function(url, cb) {
          cb({ code: "ETIMEDOUT", connect: true });
        });

      const api = new httpApi({
        host: "https://www.testurl.com",
        timeout: 1
      });
      return api._get("testendpoint").catch(error => {
        expect(error.code).to.eql("ETIMEDOUT");
        expect(requestStub).to.have.been.calledWith({
          url: "https://www.testurl.com/testendpoint",
          json: true,
          timeout: 1
        });
      });
    });
  });
});
