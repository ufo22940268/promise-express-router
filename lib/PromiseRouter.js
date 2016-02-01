/**
 * Created by cc on 2/1/16.
 */
"use strict";

var Router = require('express').Router;

class PromiseRouter {

  constructor() {
    this.router = new Router();
  }

  /**
   * Example
   *    getAsync(path, middleware, middleware, handler);
   */
  getAsync() {
    this.handleAsync('get', arguments);
  }

  /**
   * Example
   *    postAsync(path, middleware, middleware, handler);
   */
  postAsync() {
    this.handleAsync('post', arguments);
  }

  /**
   *
   * @param method
   * @param args {Array} - All arguments from `getAsync` and `postAsync`.
   */
  handleAsync(method, args) {
    let argObj = this._parseArguments(args);
    let handler = argObj.handler;
    let path = argObj.path;
    if (typeof handler !== 'function') throw new Error(`${handler} need to be a function`);
    var newHandler = (req, res, next) => {
      var p = handler(req, res.locals);
      if (!PromiseRouter._isPromise(p)) throw new Error('Must return a promise.');
      p.then(data=> res.json(PromiseRouter._formatData(data)), err=> res.json(PromiseRouter._formatError(err)));
    };

    let routerArgs = [];
    routerArgs.push(path);
    //routerArgs = routerArgs.concat(argObj.middleware);
    routerArgs.push(newHandler);
    this.router[method].apply(this, routerArgs);
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

  _parseArguments(args) {
    args = Array.from(args);
    if (args.length < 2) throw new Error('You must at least provide path and an handler');

    var obj = {
      path: args[0],
      handler: args[args.length - 1]
    };
    obj.middleware = args.length > 2 ? args.slice(1, args.length - 1) : [];
    return obj;
  }
}

module.exports = PromiseRouter;