# util

## util.debuglog(sectionString)

很有用的调试方法。可以通过 `util.debuglog(name)` 来创建一个调试 fn，这个 fn 的特点是，只有在运行程序时候，声明环境变量 `NODE_DEBUG=name`，才会打印出调试信息。

可以看下面的例子，直接运行 `node debuglog.js`，没有任何输出。需要 `NODE_DEBUG=foo`，才会有打印信息.

```js
const util = require('util');
const logger = util.debuglog('foo');
logger('hello');
```

输出：

```
FOO 97051: hello
```

也可以一次指定多个 `name`，通过逗号分隔。

```js
const util = require('util');
const logger1 = util.debuglog('foo1');
const logger2 = util.debuglog('foo2');
const logger3 = util.debuglog('foo3');
logger1('hello');
logger2('hello');
logger3('hello');
```

执行 `NODE_DEBUG=foo1,foo2,foo3 node debuglog.js`

输出：

```
FOO1 97306: hello
FOO2 97306: hello
FOO3 97306: hello
```

## 将方法标识为作废：util.desprecate(fn, str)

将 `fn` 包裹一层，并返回一个新的函数 `fn2`。调用 `fn2` 时，同样完成 `fn` 原有的功能，但同时会打印出错误日志，提示方法已作废，具体的提示信息就是第二个参数 `str`。

```js
const util = require('util');

const fn = () => {
    console.log('foo');
};
const fn2 = util.deprecate(fn, 'foo is deprecate');

fn2();
```

输出：

```
foo
(node:97466) DeprecationWarning: foo is deprecate
```

如果嫌错误提示信息烦人，可以通过 `--no-deprecation` 参数禁掉。

## 调试方法 util.inspect(obj[, options])

这是非常常用的一个方法，参数说明如下：

+   `obj`：js 原始值，或者对象。
+   `options`：配置参数，包含下面选项
    +   `showHidden`：如果是 true 的话，obj 的非枚举属性也会被展示出来。默认是 false。
    +   `depth`：如果 obj 是对象，那么，depth 限制对象递归展示的层级，这对可读性有一定的好处，默认是2。如果设置为 null，则不做限制。
    +   `colors`：自定义配色方案。
    +   `maxArrayLength`：如果 obj 是数组，那么限制最大可展示的数组个数。默认是 100，如果设置为 null，则不做限制。如果设置为 0 或负数，则一个都不展示。

举例：

```js
const util = require('util');
const obj = {};

Object.defineProperty(obj, 'nick', {
    enumerable: false,
    value: 'lyy'
});

console.log(util.inspect(obj));

console.log(util.inspect(obj, {
    showHidden: true
}));
```

输出：

```
{}
{ [nick]: 'lyy' }
```