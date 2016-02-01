# promise-express-router

Promisify express route. Let you return a promise from router handler and it will convert to a json formatted response.
The response format is obey [http-api-design](https://github.com/interagent/http-api-design),

## How to use

### Install

    npm install promise-express-router

### Normal response

__Code__

```
    const PromiseRouter = require('promise-express-router');
    promiseRouter.getAsync('/test', (req, locals) => {
      return Promise.resolve({name: 'lilei'});
    });
```

__Response__

```
{
  result: {
    name: 'lilei'
  },
  ok: true
}
```


### Error response

__Code__

```
    const PromiseRouter = require('promise-express-router');
    promiseRouter.getAsync('/test', (req, locals) => {
      return Promise.reject(new Error('new error'));
    });
```

__Response__

```
{
  message: 'Error .....',
  ok: false
}
```


### Compatibility

- Node 4.x
- Node 5.x

### License
MIT
