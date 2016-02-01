/**
 * Created by cc on 2/1/16.
 */
"use strict";

const PromiseRouter = require('../');
const express = require('express');
const request = require('supertest');
const expect = require("chai").expect;

describe('PromiseRouter', function () {
  let app;
  let promiseRouter;

  beforeEach(function () {
    app = express();
    promiseRouter = new PromiseRouter();
    app.use(promiseRouter.create());
  });

  describe('Get', function () {
    it("Should get promise result 1", function (done) {
      promiseRouter.getAsync('/test', (req, locals) => {
        return Promise.resolve({a: 1});
      });

      request(app)
        .get('/test')
        .expect({result: {a: 1}, ok: true})
        .end(done);
    });

    it("Should response with error stacktrace", function (done) {
      promiseRouter.getAsync('/error', (req, locals) => {
        return Promise.reject(new Error());
      });

      request(app)
        .get('/error')
        .expect(200)
        .end(function (error, res) {
          expect(res.body).to.have.property('msg');
          expect(res.body).to.have.property('ok', false);
          expect(res.body).to.have.property('code');
          done();
        });
    })
  });

  describe('Post', function () {
    it("Should post promise result 1", function (done) {
      promiseRouter.postAsync('/test', (req, locals) => {
        return Promise.resolve({a: 1});
      });

      request(app)
        .post('/test')
        .expect({result: {a: 1}, ok: true})
        .end(done);
    });

    it("Should response with error stacktrace", function (done) {
      promiseRouter.postAsync('/error', (req, locals) => {
        return Promise.reject(new Error());
      });

      request(app)
        .post('/error')
        .expect(200)
        .end(function (error, res) {
          expect(res.body).to.have.property('msg');
          expect(res.body).to.have.property('ok', false);
          expect(res.body).to.have.property('code');
          done();
        });
    })
  });

  describe('Middleware', function () {

    function createMiddleware(obj) {
      return (req, res, next) => {
        Object.assign(res.locals || {}, obj);
      }
    }

    it("All handlers should support inserting middleware", function (done) {
      promiseRouter.postAsync('/middleware', createMiddleware({a: 1}), (req, locals)=> Promise.resolve(locals));
      request(app).post('/middleware')
        .expect({result: {a: 1}, ok: true})
        .end(done);
    })
  })
});