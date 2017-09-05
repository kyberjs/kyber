const test = require('ava');
const utils = require('../lib');

test.serial('abs filter', async t => {
    let result = '';
    result = await utils.render('{{ -2 | abs }}');
    t.is(result, '2');

    result = await utils.render('{{ -2.345 | abs }}');
    t.is(result, '2.345');
});

test.serial('capitalize filter', async t => {
    let result = '';
    result = await utils.render('{{ value | capitalize }}', {value: 'hello'});
    t.is(result, 'Hello');

    result = await utils.render('{{ value | capitalize }}', {value: null});
    t.is(result, '');
});

test.serial('default filter', async t => {
    let result = '';
    result = await utils.render('{{ value | default("empty", true) }}', {value: null});
    t.is(result, 'empty');

    result = await utils.render('{{ value | default("empty", true) }}', {value: 'string'});
    t.is(result, 'string');

    result = await utils.render('{{ value | default("empty") }}', {value: undefined});
    t.is(result, 'empty');

    result = await utils.render('{{ value | default("empty") }}', {value: 'string'});
    t.is(result, 'string');
});

test.serial('dump filter', async t => {
    let result = '';
    result = await utils.render('{{ value | dump }}', {value: {key: 'string'}}, {autoescape: false});
    t.is(result, '{"key":"string"}');

    result = await utils.render('{{ value | dump(2) }}', {value: {key: 'string'}}, {autoescape: false});
    t.is(result, '{\n  "key": "string"\n}');
});

test.serial('escape filter', async t => {
    let result = '';
    result = await utils.render('{{ value | escape }}', {value: '<br xxx="&\'"/>'}, {autoescape: false});
    t.is(result, '&lt;br xxx=&quot;&amp;&#39;&quot;/&gt;');

    result = await utils.render('{{ value }}', {value: '<br xxx="&\'"/>'});
    t.is(result, '&lt;br xxx=&quot;&amp;&#39;&quot;/&gt;');
});

test.serial('safe filter', async t => {
    let result = '';
    result = await utils.render('{{ value | safe }}', {value: '<br xxx="&\'"/>'});
    t.is(result, '<br xxx="&\'"/>');

    result = await utils.render('{{ value | safe }}', {value: '<br xxx="&\'"/>'}, {autoescape: false});
    t.is(result, '<br xxx="&\'"/>');
});

test.serial('first filter', async t => {
    let result = '';
    result = await utils.render('{{ value | first }}', {value: ['first', 'second']});
    t.is(result, 'first');

    result = await utils.render('{{ value | first }}', {value: 'chars'});
    t.is(result, 'c');
});

test.serial('join filter', async t => {
    let result = '';
    result = await utils.render('{{ value | join }}', {value: ['first', 'second']});
    t.is(result, 'firstsecond');

    result = await utils.render('{{ value | join(",") }}', {value: ['first', 'second']});
    t.is(result, 'first,second');

    result = await utils.render('{{ value | join(",", ["name"]) }}', {value: [{name: 'first'}, {name: 'second'}]});
    t.is(result, 'first,second');
});

test.serial('last filter', async t => {
    let result = '';
    result = await utils.render('{{ value | last }}', {value: ['first', 'second']});
    t.is(result, 'second');

    result = await utils.render('{{ value | last }}', {value: 'chars'});
    t.is(result, 's');
});

test.serial('length filter', async t => {
    let result = '';
    result = await utils.render('{{ value | length }}', {value: ['first', 'second']});
    t.is(result, '2');

    result = await utils.render('{{ value | length }}', {value: 'chars'});
    t.is(result, '5');

    result = await utils.render('{{ value | length }}', {value: new Map([['a', 'first'], ['b', 'second']])});
    t.is(result, '2');

    result = await utils.render('{{ value | length }}', {value: new Set(['first', 'second'])});
    t.is(result, '2');

    result = await utils.render('{{ value | length }}', {value: {a: 'first', b: 'second'}});
    t.is(result, '2');

    result = await utils.render('{{ value | length }}', {});
    t.is(result, '0');
});

test.serial('lower filter', async t => {
    let result = '';
    result = await utils.render('{{ value | lower }}', {value: 'Hello HTTP'});
    t.is(result, 'hello http');
});

test.serial('nl2br filter', async t => {
    let result = '';
    result = await utils.render('{{ value | nl2br | safe }}', {value: 'Hello\nWorld'});
    t.is(result, 'Hello<br />\nWorld');

    result = await utils.render('{{ value | nl2br | safe }}', {value: 'Hello\r\nWorld'});
    t.is(result, 'Hello<br />\nWorld');
});

test.serial('upper filter', async t => {
    let result = '';
    result = await utils.render('{{ value | upper }}', {value: 'Hello World'});
    t.is(result, 'HELLO WORLD');
});

test.serial('wordcount filter', async t => {
    let result = '';
    result = await utils.render('{{ value | wordcount }}', {value: 'Hello World'});
    t.is(result, '2');

    result = await utils.render('{{ value | wordcount }}', {value: null});
    t.is(result, '');
});

test.serial('float filter', async t => {
    let result = '';
    result = await utils.render('{{ value | float }}', {value: '3.12 dollar'});
    t.is(result, '3.12');

    result = await utils.render('{{ value | float(0) }}', {value: 'dollar'});
    t.is(result, '0');
});

test.serial('int filter', async t => {
    let result = '';
    result = await utils.render('{{ value | int }}', {value: '3.12 dollar'});
    t.is(result, '3');

    result = await utils.render('{{ value | int(0) }}', {value: 'dollar'});
    t.is(result, '0');
});
