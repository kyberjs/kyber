# 模板语法

## 变量

安全地显示一个变量 `{{ value }}`，或者获取变量属性 `{{ foo.bar }}`、`{{ foo['bar'] }}`，获取函数(async 函数) 的执行结果 `{{ fn() }}`；

对于变量为 undefined、null 将显示为空，无法访问或不存在的变量也会显示为空并且不会报错；

变量使用在 HTML 的文本节点中：`<span>Hello {{ name }}</span>`; 不能用于 HTML 标签内属性中。

## 过滤器

通过通过管道操作符 `|` 调用过滤器，过滤器支持调用参数 `{{ value | upper }}`, `{{ value | default("empty") | lower }}`;

## 内建指令

指令依赖于 HTML 标签，减少了在书写模板时候的嵌套；指令默认前缀为 `kyber-`, 可以通过配置来修改；

### if 分支判断

```html
<div kyber-if="show">Hello World</div>
<div kyber-if="error">Something Wrong</div>
<div kyber-else>OK!</div>
```

```javascript
kyber.render('template.html', {show: true, error: false});
```

渲染结果为

```html
<div>Hello World</div>
<div>OK!</div>
```

### for 循环

```html
<div kyber-for="(item, index) in list">
    <p>{{ index }}. {{ item }}</p>
</div>
<div kyber-for="(key, value) in map" kyber-if="list.length">
    <p>{{ key }} - {{ value }}</p>
</div>
```

```javascript
kyber.render('template.html', {list: ['foo', 'bar'], map: {user: 'join', age: 18}});
```

渲染结果为

```html
<div>
    <p>0. foo</p>
    <p>1. bar</p>
</div>
<div>
    <p>user - join</p>
    <p>age - 18</p>
</div>
```

### class 指令

```html
<div class="main" kyber-class="className">Hello</div>
```

```javascript
kyber.render('template.html', {className: ['foo', 'bar']});
// 或者使用对象表示
kyber.render('template.html', {className: {foo: true, bar: true, others: false}});
```

渲染结果为

```html
<div class="main foo bar">Hello</div>
```

### style 指令

类似于 Class 指令

```html
<p style="font-size: 14px; color: #FFF;" kyber-style="{fontSize: '17px'}">Hello</p>
```

渲染结果为

```html
<p style="font-size: 17px; color: #FFF;">Hello</p>
```

### literal 指令

literal 指令会将 HTML 内部看待为纯文本，忽略 HTML 标签内的渲染；

```html
<div kyber-literal>
    <div kyber-for="item, index in list" xxx='dd'>
        <p>{{index}}. {{ item }}</p>
    </div>
</div>
```

会原样渲染为

```html
<div>
    <div kyber-for="item, index in list" xxx='dd'>
        <p>{{index}}. {{ item }}</p>
    </div>
</div>
```

### strip 指令

strip 指令会忽略模板中空格进行渲染

```html
<title kyber-strip>
    {{ mainTitle }} - {{ subTitle }}
</title>
```


```javascript
kyber.render('template.html', {mainTitle: "site name", subTitle: "page title"});
```

会渲染为

```html
<title>site name - page title</title>
```

### 其他未定义指令

其他未定义指令不会报错，会解析 value 值为表达式

```html
<div kyber-name="name | upper">Hello</div>
```


```javascript
kyber.render('template.html', {name: "button"});
```

会渲染为

```html
<div name="BUTTON">Hello</div>
```

## 内建自定义标签

除了内建的一些指令外，模板继承，模板引用通过自定义标签来实现。自定义标签可以正常使用指令；

### template 标签

`<template>` 标签实现了将内部 HTML 渲染出来而不渲染标签本身；

```html
<div><template kyber-if="true">Hello</template></div>
```

渲染为

```html
<div>Hello</div>
```

### set 标签

`<set>` 标签是一个自闭和标签，可以很方便地在模板内部设置变量

```html
<set hi="Hello" name="everyone"/>
<div>{{ hi }} {{ name }}!</div>
```

渲染为

```html
<div>Hello everyone!</div>
```

### import 标签

`<import>` 标签是一个自闭和标签，可引入其他的模板

```html
<div class="header">
    <import name="title.html"/>
</div>
```

title.html 文件

```html
<h1>Title</h1>
```

渲染为

```html
<div class="header">
    <h1>Title</h1>
</div>
```

### 特殊的 Component

还有可以通过 API 声明一个 Component，在模板中直接使用

```javascript
kyber.component('dialog', 'dialog.html');
```

dialog.html 文件

```html
<h1>Title</h1>
```

然后在模板中使用

```html
<dialog title="warning" kyber-if="true" content="connect service timeout!"/>
```

## 模板继承

模板继承使用 `<extend>` 和 `<block>` 标签来实现

如有一个 base.html 模板

```html
<!doctype HTML>
<html>
    <head>
        <meta charset="utf-8">
        <title kyber-strip>
            <block name="title">Site</block>
        </title>
    </head>
    <body>
        <div class="main">
            <block name="content">base</block>
        </div>
        <block name="footer"><p>&copy; copyright</p></block>
    </body>
</html>
```

page.html 继承 base.html 模板

```html
<extend name="base.html"/>

<block name="title" kyber-strip>
    page - <slot/>
</block>

<block name="content">Content</block>

<block name="footer">
    <div class="footer">
        sitename <slot/>
    </div>
</block>

```

渲染结果为

```html
<!doctype HTML>
<html>
    <head>
        <meta charset="utf-8">
        <title>page - Site</title>
    </head>
    <body>
        <div class="main">
            Content
        </div>
        <div class="footer">
            sitename <p>&copy; copyright</p>
        </div>
    </body>
</html>
```

## 自动转义

默认启用自动转义，所有的变量输出都会转义，如果使用了 safe 过滤器，则不会转义，可以通过配置的 autoescaping 来控制；

```javascipt
{{ foo }}           // &lt;span%gt;
{{ foo | safe }}    // <span>
```

## 内置过滤器

```javascript
capitalize // 首字母大写
lower // 字符串小写
upper // 字符串大写

escape // 对输出的字符转义
safe // 无转义的输出字符串
nl2br // 换行符转换为 '<br>' 标签

first // 数组第一项，字符串第一个字符
join(del, attr) // 数组进行拼接
last // 数组最后一项，字符串最后一个字符

abs // 数字取绝对值
float(def) // 转为浮点数
int(def) // 转为整数

length // 求数组，字符串长度（对象 key 个数）
dump(spaces) // 使用 JSON.stringify 输出对象

wordcount // 字符串单词个数

default(def, bool) // 设置默认值
```

# API 文档

顶层简单单例 API

## render 渲染模板文件

`await kyber.render(name, [context]);`: 将模板 `name` 和数据 `context` 渲染;

```javascript
const res = await kyber.render('home.html');
const res = await kyber.render('home.html', {user: 'Join'});
```

### renderString 渲染字符串

`await kyber.renderString(str, [context]);`: 与 render 类似，将字符串 `str` 和数据 `context` 渲染;

```javascript
const res = await kyber.renderString('Hello {{ user }}', {user: 'Join'});
```

### compile 编译模板文件

`await kyber.compile(name);` 将模板文件 `name` 编译为可以复用的模板对象;

```javascript
const template = await kyber.compile('Hello {{ name }}');
await template.render({name: 'Join'});
await template.render({name: 'Jim'});
```

### component 添加全局使用的组件

`kyber.component(name, tmplName);` 添加名称为 `name` 模板名为 `tmplName` 的组件

```javascript
kyber.component('dialog', 'dialog.html');
```

在模板文件中直接使用

```html
<dialog title="warning" kyber-if="true" content="connect service timeout!"/>
```

### configure 设置模板目录和配置

```
kyber.configure([path], [options]);
```

path 的默认值为当前目录，options 具有以下配置

模板指令

- `prefix`: 指令前缀 (default: 'kyber-');
- `autoescape`: 是否自动转义 (default: true);
- `delimiters`: 变量分隔符 (default: ['{{', '}}']);

模板文件

- `watch`: 是否监听文件改变 (default: false);
- `noCache`: 是否缓存模板 (default: false);
- `extName`: 模板文件后缀 (default: 'html');

压缩配置

- `collapseInlineTagWhitespace`: 去除行内元素多余的空白字符, 依赖 `collapseWhitespace` 生效 (default: true);
- `conservativeCollapse`: 是否合并空白字符 (default: false);
- `collapseWhitespace`: 去除多余的空白字符 (default: true);
- `preserveLineBreaks`: 去除多余的换行符 (default: false);
- `quoteCharacter`: 属性值引号 (default: '"');
- `removeComments`: 去除注释 (default: true);
- `removeEmptyAttributes`: 去除属性值为空的属性 (default: false);
- `useShortDoctype`: 使用 `<!doctype HTML>` 短的 DocType (default: true);
