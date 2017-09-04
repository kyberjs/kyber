# KyberJS

[![NPM][npm-version-image]][npm-version-url] [![travis][travis-image]][travis-url]

指令驱动的 Node.js 服务端模板引擎

## 特性

- 前端 HTML 指令驱动；
- 模板支持基于 `async`, `await` 的异步函数执行；
- 内建支持 HTML 文件压缩；
- 提供友好的 API，灵活的进行扩展，支持自定义指令，过滤器，标签等

## 支持环境

- Node 8+

## 安装

- 推荐使用 npm 安装

```bash
npm install --save kyber
```

## 使用

简单调用进行文件渲染

```javascript
const kyber = require('kyber');

const init = async function init() {
    const res = await kyber.render('template.html', {list: ['<hr/>', 'foo', 'bar'], title: 'Hello Kyber'});
    console.log(res);
};

init();
```

配合 Koa 进行使用

```javascript
const Koa = require('koa');
const kyber = require('kyber');

const app = new Koa();

app.use(async ctx => {
    ctx.body = await kyber.render('index.html');
});

app.listen(3000);
```

## API 和模板语法

See [here](./document.md);

## 贡献

`KyberJS` 现在还处于开发阶段，如果你在使用 `KyberJS` 时遇到问题，或者有好的建议，欢迎给我们提 `Issue` 或 `Pull Request`。

## License

MIT

[npm-version-image]: https://img.shields.io/npm/v/kyber.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/kyber
[travis-image]: https://img.shields.io/travis/kyberjs/kyber/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/kyberjs/kyber
