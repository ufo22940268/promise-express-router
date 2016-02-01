/**
 * Created by cc on 2/1/16.
 */
"use strict";

var Router = require('express').Router;

class PromiseRouter {

  constructor() {
    this.router = new Router();
  }

  getAsync(path, callback) {
    this.handleAsync('get', path, callback);
  }

  postAsync(path, callback) {
    this.handleAsync('post', path, callback);
  }

  handleAsync(method, path, callback) {
    if (typeof callback !== 'function') throw new Error(`${callback} need to be a function`);
    this.router[method](path, (req, res, next) => {
      var p = callback(req, res.locals);
      if (!PromiseRouter._isPromise(p)) throw new Error('Must return a promise.');
      p.then(data=> res.json(PromiseRouter._formatData(data)),
        err=> {
          res.json(PromiseRouter._formatError(err))
        });
    });
  }

  create() {
    return this.router;
  }

  static _isPromise(p) {
    return p && p.then;
  }

  static _formatData(data) {
    return {
      result: data,
      ok: true
    };
  }

  static _formatError(err) {
    let message = err instanceof Error ? err.stack : err.toString();
    return {
      msg: message,
      ok: false,
      code: 'server_error'
    };
  }
}

module.exports = PromiseRouter;