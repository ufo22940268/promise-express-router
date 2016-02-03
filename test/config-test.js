/**
 * Created by cc on 2/1/16.
 *
 * Test route configuration.
 *
 */
"use strict";

const PromiseRouter = require('../');
const express = require('express');
const request = require('supertest');
const expect = require("chai").expect;

describe('PromiseRouter', function () {
  let app;
  let promiseRouter;

  function onRouterCreated(router) {
    router.getAsync('/test', (req, locals) => {
      return Promise.resolve({a: 1});
    });
    router.getAsync('/error', (req, locals) => {
      return Promise.reject(new Error());
    });
    app.use(router.create());
  }

  beforeEach(function () {
    app = express();
    console.log(1)
  });

  describe('Using configuration 1', function () {

    beforeEach(function () {
      promiseRouter = new PromiseRouter((obj)=> {
        return {
          data: obj.result,
          error_code: obj.code,
          stacktrace: obj.trace,
          normal: obj.ok
        }
      });
      onRouterCreated(promiseRouter);
      console.log(2)
    });

    it("Should get normal result ", function (done) {
      request(app)
        .get('/test')
        .expect({data: {a: 1}, ok: true})
        .end(done);
    });

    it("Should response with error stacktrace", function (done) {
      request(app)
        .get('/error')
        .expect(200)
        .end(function (error, res) {
          expect(res.body).to.have.property('stacktrace');
          expect(res.body).to.have.property('normal');
          expect(res.body).to.have.property('error_code');
          done();
        });
    })
  });
});