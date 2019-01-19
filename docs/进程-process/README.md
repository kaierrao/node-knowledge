# Process

process 是 node 中非常重要的一个模块，它是一个全局模块，可以在代码中直接使用。

可以通过它来获取 node 进程相关的信息，比如获取命令行的参数。或设置进程相关的信息，比如设置环境变量。

## process.env

我们经常需要判断 node 服务运行的环境，如下所示：

```js
if (process.env.NODE_ENV === 'production') {
    console.log('生产环境');
} else {
    console.log('非生产环境');
}
```

启动方式是：

```
NODE_ENV=production node index.js
```

输出为：

```
生产环境
```

## 异步 process.nextTick(callback)

使用频率很高，通常用在异步的场景，举例：

```js
console.log(1);
process.nextTick(() => {
    console.log(3);
});
console.log(2);
```

输出如下：

```
1
2
3
```

`process.nextTick(callback)` 和 `setTimeout(callback, 0)` 很像，但实际有实现及性能上的差异，我们先记住几个点：

+   `process.nextTick(callback)` 将 callback 放到 node 事件循环的 下一个 tick 里
+   `process.nextTick(callback)` 比 `setTimetout(callback, 0)` 性能高

资料：[事件循环](../事件循环)

## 获取命令行参数

`process.argv` 返回一个数组，数组元素分别如下：

+   元素 1：`'node'`
+   元素 2：可执行文件的绝对路径
+   元素 x：其他，比如参数等

举例：

```js
process.argv.forEach((val, index, array) => {
    console.log('参数' + index + ': ' + val);
});
```

运行命令 `NODE_ENV=dev node index.js --env production`， 输出如下：

```
参数0: /Users/lyy/.tnvm/versions/node/v8.9.4/bin/node
参数1: /Users/lyy/Downloads/code/github/node-knowledge/fs
参数2: --env
参数3: production
```

## 获取 node 内置参数：process.execArgv

和 `process.argv` 看着像，但差异很大。

先看几个例子：

index.js

```js
process.argv.forEach((val, index, array) => {
    console.log('process.argv: ' + index + ': ' + val);
});

process.execArgv.forEach((val, index, array) => {
    console.log('process.execArgv: ' + index + ': ' + val);
});
```

运行几个命令：

+   `node --harmony index.js --nick lyy`

    输出：

    ```
    process.argv: 0: /Users/lyy/.tnvm/versions/node/v8.9.4/bin/node
    process.argv: 1: /Users/lyy/Downloads/code/github/node-knowledge/test
    process.argv: 2: --nick
    process.argv: 3: lyy
    process.execArgv: 0: --harmony
    ```

    **process.execArgv 数组有 '--harmony'**

    **process.argv 数组中没有 '--harmony'**

+   `node index.js --harmony --nick lyy`

    输出：

    ```
    process.argv: 0: /Users/lyy/.tnvm/versions/node/v8.9.4/bin/node
    process.argv: 1: /Users/lyy/Downloads/code/github/node-knowledge/test
    process.argv: 2: --harmony
    process.argv: 3: --nick
    process.argv: 4: lyy
    ```

    **process.execArgv 是空数组**

    **process.argv 数组中有 '--harmony'**

## 当前工作路径：process.cwd() vs process.chdir(directory)

+   `process.cwd()`：返回当前路径
+   `process.chdir(directory)`：切换当前工作路径

举例：

index.js

```js
console.log('current directory: ', process.cwd());

try {
    process.chdir('./test');
    console.log('changed directory: ', process.cwd());
} catch(err) {
    throw err;
}
```

执行 `node index`，输出：

```
current directory:  /Users/lyy/Downloads/code/github/node-knowledge
changed directory:  /Users/lyy/Downloads/code/github/node-knowledge/test
```

## IPC 相关

+   `process.connected`: 如果当前进程是子进程，且与父进程有 IPC 通道连接，则为 true
+   `process.disconnect()`: 断开与父进程之间的 IPC 通道，此时将会使 `process.connected` 置为 false

举例：

parent.js

```js
const child_process = require('child_process');

child_process.fork('./child', {
    stdio: 'inherit'
});
```

child.js

```js
console.log('process.connected before: ', process.connected);

process.disconnect();

console.log('process.connected after: ', process.connected);
```

执行 `node parent`，输出：

```
process.connected before:  true
process.connected after:  false
```

## 标准输入/输出：process.stdin、process.stdout

`process.stdin`、`process.stdout`、`process.stderr` 分别代表进程的标准输入、标准输出、标准错误输出。

举例：

```js
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
    // 每次用户输入，均会触发该回调
    var chunk = process.stdin.read();
    if (chunk !== null) {
        process.stdout.write(`data: ${chunk}`);
    }
});

process.stdin.on('end', () => {
    process.stdout.write('end');
});
```

## 当前进程信息

+   `process.pid`：返回当前进程 id
+   `process.title`：可以用它来修正进程的名字，当用 `ps` 命令，同时有多个 node 进程在跑的时候，作用就体现出来了

## 运行/资源占用情况

+   `process.uptime()`：当前进程运行的时间
+   `process.memoryUsage()`：返回进程占用的内存，单位为字节

    输出为：

    ```
    { 
        rss: 21516288,
        heapTotal: 7708672, // V8 占用的内存
        heapUsed: 4413584, // V8 实际使用了的内存
        external: 8224
    }
    ```

+   `process.cpuUsage([previousValue])`：CPU 使用时间耗时，单位为毫秒

    ```js
    const startUsage = process.cpuUsage();

    console.log(startUsage);

    const now = Date.now();
    while (Date.now() - now < 500);

    const endUsage = process.cpuUsage(startUsage);
    console.log(endUsage);
    ```

    输出为：

    ```
    { user: 71205, system: 24068 }
    { user: 495437, system: 3949 }
    ```

    `user` 代表用户程序代码运行占用的时间

    `system` 代表系统占用的时间

    如果当前进程占用多个内核来执行任务，那么数值会比实际感知的要大。

## process.hrtime()

一般用于性能基准测试。返回一个数组（[seconds, nanoseconds]），举例：

```js
const time = process.hrtime();

setInterval(() => {
    const diff = process.hrtime(time);

    console.log(`Benchmark took ${diff[0] * 1e9 + diff[1]} nanoseconds`);
}, 1000);
```

输出为：

```
Benchmark took 1007984510 nanoseconds
[ 1, 7984510 ]
Benchmark took 2019061679 nanoseconds
[ 2, 19061679 ]
Benchmark took 3019745256 nanoseconds
[ 3, 19745256 ]
Benchmark took 4024155909 nanoseconds
[ 4, 24155909 ]
```

注意，这里返回的值，是相对于过去一个随机的时间，所以本身没什么意义。仅当你将上一次调用返回的值做为参数传入，才有实际意义。

## node 可执行程序相关的信息

+   `process.version`：返回当前的 node 版本，如 `v8.9.4`
+   `process.versions`：返回 node 的版本，以及依赖库的版本。如：

    ```
    {
        http_parser: '2.7.0',
        node: '8.9.4',
        v8: '6.1.534.50',
        uv: '1.15.0',
        zlib: '1.2.11',
        ares: '1.10.1-DEV',
        modules: '57',
        nghttp2: '1.25.0',
        openssl: '1.0.2n',
        icu: '59.1',
        unicode: '9.0',
        cldr: '31.0.1',
        tz: '2017b'
    }
    ```

+   `process.release`：返回当前 node 版本发行版本的信息，大部分时候不会用到，具体含义看 [这里](https://nodejs.org/api/process.html#process_process_release)

    ```
    {
        name: 'node',
        lts: 'Carbon',
        sourceUrl: 'https://nodejs.org/download/release/v8.9.4/node-v8.9.4.tar.gz',
        headersUrl: 'https://nodejs.org/download/release/v8.9.4/node-v8.9.4-headers.tar.gz'
    }
    ```

+   `process.config`：返回当前 node 版本编译时的参数，很少会用到，一般用来排查问题

+   `process.execPath`: node 可执行程序的绝对路径，比如 `'/usr/local/bin/node'`

## node 运行所在环境

+   `process.arch`：返回当前系统的处理器架构（字符串），比如 `arm`、`x64`
+   `process.platform`：返回平台描述的字符串，如 `darwin`

## 警告信息：process.emitWarning(warning)

v6.0.0 新增的接口，可以用来抛出警告信息。

+   举例一

    ```js
    process.emitWarning('Something happened!');
    ```

    输出：

    ```
    (node:92959) Warning: Something happened!
    ```

+   举例二：`warning` 也可以是 Error 对象

    ```js
    const err = new Error('Something happened!');
    err.name = 'My name';
    process.emitWarning(err);
    ```

    输出：

    ```
    (node:93082) My name: Something happened!
    ```

+   举例三：也可以对其监听

    ```js
    process.emitWarning('Something Happened!', 'My Name');

    process.on('warning', (warning) => {
        console.warn(warning.name);
        console.warn(warning.message);
        console.warn(warning.stack);
    });
    ```

    输出：

    ```
    (node:93170) My Name: Something Happened!
    My Name
    Something Happened!
    My Name: Something Happened!
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

## 向进程发送信号：process.kill(pid, signal)

`process.kill` 这个名字比较让人费解，它不是用来杀死进程，而是用来向进程发送信号。举例：

```js
console.log('hello');

process.kill(process.pid, 'SIGHUP');

console.log('world');
```

输出为：

```
hello
[1]    93337 hangup     node index.js
```

可以通过监听 SIGHUP 事件，来阻止它的默认行为：

```js
process.on('SIGHUP', () => {
    console.log('Got SIGHUP signal');
});

console.log('hello');

process.kill(process.pid, 'SIGHUP');

console.log('world');
```

但是输出有些意外：

```
hello
world
```

事件并没有触发。猜测是因为写标准输出被推到下一个事件循环导致，改下代码：

```js
process.on('SIGHUP', () => {
    console.log('Got SIGHUP signal');
});

setTimeout(() => {
    console.log('exiting');
}, 0);

console.log('hello');

process.kill(process.pid, 'SIGHUP');

console.log('world');
```

输出为：

```
hello
world
exiting
Got SIGHUP signal
```

## 终止进程：process.exit([exitCode])、process.exitCode

+   `process.exit([exitCode])` 可以用来立即退出进程。即使当前有操作没有执行完，也会立即退出。
+   写数据到 `process.stdout` 之后，立即调用 `process.exit()` 是不保险的，因为在 node 里面，往 stdout 写数据是非阻塞的，可以跨越多个事件循环。于是，可能写到一半就跪了。比较保险的做法是，通过`process.exitCode` 设置退出码，然后等进程自动退出。
+   如果程序出现异常，必须退出不可，那么，可以抛出一个未被捕获的 error，来终止进程，这个比 process.exit() 安全。

举例：

```js
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

**备注：整个 process.exit() 的接口说明，都在告诉我们 process.exit() 不可靠**

## 事件

+   `beforeExit`：进程退出之前触发，参数为 exitCode，此时 EventLoop 已经空了

    如果是显式调用 `process.exit()` 退出，或者未捕获的异常导致退出，则该事件不会触发。

## 参考

+   https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/process.md
+   [Understanding process.nextTick](https://howtonode.org/understanding-process-next-tick)
+   [nodejs 异步之 Timer &Tick; 篇](https://cnodejs.org/topic/4f16442ccae1f4aa2700109b)