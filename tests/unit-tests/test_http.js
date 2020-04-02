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

const axios = require("axios");
const moxios = require("moxios");
const chai = require("chai");
const sinon = require("sinon");
var expect = chai.expect;

const httpApi = require("../../src/http.js");

const time = () => Math.floor(new Date() / 1000);

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
    it("should throw if no host specified", function(done) {
      try {
        const api = new httpApi();
        done("error: should have thrown");
      } catch (e) {
        done();
      }
    });
    it("should throw if host invalid", function(done) {
      try {
        const api = new httpApi({
          host: "what even is this"
        });
        done("error: should have thrown");
      } catch (e) {
        done();
      }
    });
  });

  describe("_get()", function() {
    it("should resolve data", function(done) {
      const thenSpy = sinon.spy();
      const catchSpy = sinon.spy();

      const api = new httpApi({
        host: "https://www.testurl.com",
        timeout: 1337
      });

      api
        ._get()
        .then(thenSpy)
        .catch(catchSpy);

      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: "alrighty"
          })
          .then(function() {
            try {
              expect(thenSpy).to.have.been.calledOnceWith("alrighty");
              expect(api.cache[""].data).to.eql("alrighty");
              expect(thenSpy).to.not.have.been.calledTwice;
              expect(catchSpy).to.not.have.been.called;
              done();
            } catch (e) {
              done(`unfulfilled assertions: ${e}`);
            }
          });
      });
    });

    it("should resolve cached data", function() {
      const api = new httpApi({
        host: "https://www.testurl.com"
      });

      api.cache.testendpoint = {
        expire: time() + 1337,
        data: "cached data"
      };

      return api._get("testendpoint").then(r => {
        expect(r).to.eql("cached data");
      });
    });

    it("cache should expire", function(done) {
      const thenSpy = sinon.spy();
      const catchSpy = sinon.spy();

      const api = new httpApi({
        host: "https://www.testurl.com",
        cachetime: 1
      });

      api.cache.testendpoint = {
        expire: time() - 1337,
        data: "cached data"
      };

      api
        ._get("testendpoint")
        .then(thenSpy)
        .catch(catchSpy);

      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: "alrighty"
          })
          .then(function() {
            try {
              expect(thenSpy).to.have.been.calledOnceWith("alrighty");
              expect(api.cache.testendpoint.data).to.eql("alrighty");
              expect(thenSpy).to.not.have.been.calledTwice;
              expect(catchSpy).to.not.have.been.called;
              done();
            } catch (e) {
              done(`unfulfilled assertions: ${e}`);
            }
          });
      });
    });
  });
});
