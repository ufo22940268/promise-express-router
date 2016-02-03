# promise-express-router

[![Build Status](https://travis-ci.org/ufo22940268/promise-express-router.svg?branch=master)](https://travis-ci.org/ufo22940268/promise-express-router)
[![npm version](https://badge.fury.io/js/promise-express-router.svg)](https://badge.fury.io/js/promise-express-router)

Promisify express router. Let you return a promise from router handler and it will convert to a json formatted response.
The response format is obey to [http-api-design](https://github.com/interagent/http-api-design),

## Document
[wiki](https://github.com/ufo22940268/promise-express-router/wiki)


## How to use

### Install

    npm install promise-express-router

### Normal response

- __Code__

```javascript
const app = require('express')();
const PromiseRouter = require('promise-express-router');
const promiseRouter = new PromiseRouter();
promiseRouter.getAsync('/test', (req, locals) => {
  return Promise.resolve({name: 'lilei'});
});
app.use(promiseRouter.toExpressRouter());
```

- __Response__

```json
{
  "result": {
    "name": "lilei"
  },
  "ok": true
}
```


### Error response

- __Code__

```javascript
const app = require('express')();
const PromiseRouter = require('promise-express-router');
const promiseRouter = new PromiseRouter();
promiseRouter.getAsync('/test', (req, locals) => {
  return Promise.reject(new Error('new error'));
});
app.use(promiseRouter.toExpressRouter());
```

- __Response__

```json
{
  "message": "Error .....",
  "ok": false
}
```

### Response fields

- `ok` If server error happens, it will be false. Or it's true.
- `result` Result data.
- `message` A human readable error message.
- `code` Error code.


### Customize response format

You can also customize response format.

```javascript
promiseRouter = new PromiseRouter({
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
```

## Example

[Here](./example)

## Compatibility


- Node 4.x
- Node 5.x

## License
MIT
