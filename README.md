# KyberJS

[![NPM][npm-version-image]][npm-version-url] [![travis][travis-image]][travis-url]

A directive template engine for Node.js

[中文文档](./README_zh-CN.md)

## Fetures

- Front-end HTML DOM directive driver;
- Templates support asynchronous functions based on `async`, `await`;
- Built-in support for HTML minify;
- Friendly APIs, flexible extensions, support for custom directives, filters, tags;

## Support

- Node 8+

## Install

- Use `npm` to install

```bash
npm install --save kyber
```

## Usage

Simple for file rendering;

```javascript
const kyber = require('kyber');

const init = async function init() {
    const res = await kyber.render('template.html', {list: ['<hr/>', 'foo', 'bar'], title: 'Hello Kyber'});
    console.log(res);
};

init();
```

Use with Koa

```javascript
const Koa = require('koa');
const kyber = require('kyber');

const app = new Koa();

app.use(async ctx => {
    ctx.body = await kyber.render('index.html');
});

app.listen(3000);
```

## API and template syntax

See [here](./document.md);

## Contribute

`KyberJS` is still in development, and if you have problems using `KyberJS`, or if you have a good suggestion, please open a Issue or make a Pull Request.

## License

MIT

[npm-version-image]: https://img.shields.io/npm/v/kyber.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/kyber
[travis-image]: https://img.shields.io/travis/kyberjs/kyber/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/kyberjs/kyber
