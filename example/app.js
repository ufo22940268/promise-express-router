/**
 * Created by cc on 2/2/16.
 */
"use strict";
const app = require('express')();
const PromiseRouter = require('../');
const promiseRouter = new PromiseRouter({
  standard: (obj)=> {
    return {
      data: obj.result,
      status: obj.ok
    }
  },
  error: (obj) => {
    return {
      error_code: obj.code,
      stacktrace: obj.msg,
      normal: obj.ok
    }
  }
});

promiseRouter.getAsync('/', (req, locals) => {
  return Promise.resolve({say: 'hello world'});
});

promiseRouter.getAsync('/error', (req, locals) => {
  return Promise.reject(new Error('New error'));
});
app.use(promiseRouter.toExpressRouter());

console.log(`Open browser http://127.0.0.1:3000`);
app.listen(3000);
