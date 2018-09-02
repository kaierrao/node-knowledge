# stream

node 的核心模块，基本都是 stream 的实例，比如 `process.stdout`、`http.clientRequest`。

举例：

```js
const fs = require('fs');
fs.createReadStream('./sample.txt').pipe(process.stdout);
```

## Stream 分类

在 node 中，有 4 种 Stream 类型：

+   Readable: 用来读取数据，比如 `fs.createReadStream()`
+   Writable: 用来写数据，比如 `fs.createWriteStream()`
+   Duplex: 可读 + 可写，比如 `net.Socket()`
+   Transform: 在读写的过程中，可以对数据进行修改，比如 `zlib.createDeflate()`（数据压缩/解压）

## Readable Stream

```javascript
const Readable = require('stream').Readable;
```

+   以下都是常见的 Readable Stream，也有其他的：
    +   `http.IncomingRequest`
    +   `fs.createReadStream()`
    +   `process.stdin`

+   涉及的事件
    +   `data`
    +   `end`

+   涉及的方法
    +   `pause()` / `resume()`
    +   `read()` / `push()`

+   可读流的两种模式

    +   暂停模式（默认）切换到流动模式
        +   `resume()`
        +   监听 `data` 事件
        +   调用 `pipe()` 方法
    +   流动模式切换到暂停模式
        +   `pause()`
        +   `pipe()` 时，需要移除所有 `data` 事件的监听，再调用 `unpipe()` 方法

    +   流动模式：`data` 事件
    +   暂停模式：`read()` 方法

+   举例

    例子 1：

    ```js
    const fs = require('fs');

    const readStream = fs.createReadStream('./sample.txt');
    const content = '';

    readStream.setEncoding('utf8');

    readStream.on('data', function(chunk){
        content += chunk;
    });

    readStream.on('end', function(chunk){
        console.log('文件读取完成，文件内容是 [%s]', content);
    });
    ```

    例子 2：

    ```js
    const fs = require('fs');

    fs.createReadStream('./sample.txt').pipe(process.stdout);
    ```

    这里是原封不动地输出到控制台。

    下面加点东西。

    ```js
    const fs = require('fs');

    const onEnd = function(){
        process.stdout.write(']');	
    };

    const fileStream = fs.createReadStream('./sample.txt');
    fileStream.on('end', onEnd)

    fileStream.pipe(process.stdout);

    process.stdout.write('文件读取完成，文件内容是[');
    ```

+   自定义 Readable Stream

    +   继承 `Readable`
    +   复写 `_read`

        ```javascript
        class RandomNumberStream extends Readable {
            constructor(max) {
                super();
                this.max = max;
            }

            _read() {
                const ctx = this;

                setTimeout(() => {
                    ctx.max--;

                    if (ctx.max < 0) {
                        ctx.push(null);
                    } else {
                        const randomNumber = parseInt(Math.random() * 10000);
                        ctx.push(`${randomNumber}`);
                    }
                }, 100);
            }
        }
        ```

    +   通过 `this.push` 推入 `read` 流
    +   `this.push(null)` 标志 `read` 流结束

## Writable Stream

```javascript
const Writable = require('stream').Writable;
```

+   最简单的例子

    ```javascript
    process.stdin.pipe(process.stdout);
    ```

+   事件

    +   `pipe`: 可读流调用 `pipe()` 方法向可写流传输数据的时候会触发
    +   `unpipe`: 可读流调用 `unpipe()` 方法移除数据传递的时候会触发
    +   `drain`: 处理完积压数据，可以写入新数据的时候触发
    +   `error`
    +   `finish`: `end()` 方法触发

+   方法

    +   `writable.write(chunk[, encoding, callback])`

        写入的数据大于可写流的 highWaterMark 时，其会返回 `false`，否则返回 `true`

    +   `writable.end()`

+   自定义 Writable Stream

    ```javascript
    class WriteStream extends Writable {
        _write(chunk, enc, done) {
            process.stdout.write(chunk.toString().toUpperCase());
            setTimeout(done, 1000);
        }
    }
    ```

    其中 `done()` 用于通知此次写入完成。

    实例化可用的参数：

    +   `objectMode` 默认是 `false`， 设置成 `true` 后 `writable.write()` 方法除了写入 `string` 和 `buffer` 外，还可以写入任意 JavaScript 对象。
    +   `highWaterMark` 每次最多写入的数据量， `Buffer` 的时候默认值 16kb， `objectMode` 时默认值 16
    +   `decodeStrings` 是否把传入的数据转成 `Buffer`，默认是 `true`

+   举例

    例子 1：

    ```js
    const fs = require('fs');
    const content = 'hello world';
    const filepath = './sample.txt';

    fs.writeFile(filepath, content);
    ```

    例子 2：

    ```js
    const fs = require('fs');
    const content = 'hello world';

    const filepath = './sample.txt';

    const writeStream = fs.createWriteStream(filepath);

    writeStream.write(content);

    writeStream.end();
    ```

## 综合案例，如何处理读写数据流积压的问题

```javascript
const Writable = require('stream').Writable;
const Readable = require('stream').Readable;

class WriteStream extends Writable {
    _write(chunk, enc, done) {
        process.stdout.write(chunk.toString().toUpperCase());
        setTimeout(done, 1000);
    }
}

class RandomNumberStream extends Readable {
    constructor(max) {
        super();
        this.max = max;
    }

    _read() {
        const ctx = this;

        setTimeout(() => {
            ctx.max--;

            if (ctx.max < 0) {
                ctx.push(null);
            } else {
                const randomNumber = parseInt(Math.random() * 10000);
                ctx.push(`${randomNumber}`);
            }
        }, 100);
    }
}

const rs = new RandomNumberStream(100);
const ws = new WriteStream({
    highWaterMark: 8
});

rs.on('data', (chunk) => {
    console.log('end');
    if (ws.write(chunk) === false) {
        console.log('pause');
        rs.pause();
    }
});

ws.on('drain', () => {
    console.log('drain');
    rs.resume();
});
```

## Duplex

```javascript
const Duplex = require('stream').Duplex;
```

+   自定义 Duplex

    ```javascript
    const myDuplex = new Duplex({
        read(size) {
            // ...
        },
        write(chunk, encoding, callback) {
            // ...
        }
    });
    ```

    和读写流一样

+   常用场景

    +   TCP Socket
    +   Zlib
    +   Crypto

## Transform

和 Duplex 的区别是 Duplex 的读写流是相互独立的；Tansform 的可读流可以写入可写流。

在平时使用的时候，当一个流同时面向生产者和消费者服务的时候我们会选择 Duplex，当只是对数据做一些转换工作的时候我们便会选择使用 Tranform。

## 参考

+   https://nodejs.org/api/stream.html
+   https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/stream.md
+   (推荐)https://www.cnblogs.com/dolphinX/p/6279805.html