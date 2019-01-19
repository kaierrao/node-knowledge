# console

## 常用 API

+   `console.log(msg)`：普通日志打印。
+   `console.error(msg)`：错误日志打印。
+   `console.info(msg)`：等同于 `console.log(msg)`
+   `console.warn(msg)`：等同于 `console.error(msg)`

## 自定义 stdout

可以通过 `new console.Console(stdout, stderr)` 来创建自定义的 console 实例，这个功能很实用。

比如你想将调试信息打印到本地文件，那么，就可以通过如下代码实现。

```js
const fs = require('fs');
const file = fs.createWriteStream('./stdout.txt');

const logger = new console.Console(file, file);

logger.log('hello');
logger.log('word');

// 备注：内容输出到 stdout.txt里，而不是打印到控制台
```

## 计时

通过 `console.time(label)` 和 `console.timeEnd(label)`，来打印出两个时间点之间的时间差，单位是毫秒，例子如下。

```js
cosnt timeLabel = 'hello';

console.time(timeLabel);

setTimeout(console.timeEnd, 1000, timeLabel);
// 输入出入：
// hello: 1005.505ms
```

## 打印错误堆栈 console.trace(msg)

将 msg 打印到标准错误输出流里，包含当前代码的位置和堆栈信息。

```js
console.trace('trace is called');
```

输出：

```
Trace: trace is called
    at Object.<anonymous> (/Users/lyy/Downloads/code/github/node-knowledge/test.js:1:71)
    at Module._compile (module.js:643:30)
    at Object.Module._extensions..js (module.js:654:10)
    at Module.load (module.js:556:32)
    at tryModuleLoad (module.js:499:12)
    at Function.Module._load (module.js:491:3)
    at Function.Module.runMain (module.js:684:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
```

## 深层打印

很少关注 `console.dir(obj)`，因为大部分时候表现跟 `console.log(obj)` 差不多，看例子

```js
const obj = {
    nick: 'lyy'
};

console.log(obj);  // 输出：{ nick: 'lyy' }
console.dir(obj);  // 输出：{ nick: 'lyy' }
```

但当 obj 的层级比较深时，用处就出来了。可以通过 depth 自定义打印的层级数，默认是2，这对于调试很有帮助。

```js
const obj2 = {
    human: {
        man: {
            info: {
                nick: 'lyy'
            }
        }
    }
};

console.log(obj2);  // 输出：{ human: { man: { info: [Object] } } }
console.dir(obj2);  // 输出：{ human: { man: { info: [Object] } } }

console.dir(obj2, {depth: 3});  // 输出：{ human: { man: { info: { nick: 'lyy' } } } }
```

## 参考

+   官方文档：https://nodejs.org/api/console.html
+   https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/console.md