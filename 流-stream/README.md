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

下面一一介绍：

+   Readable Stream

    以下都是常见的 Readable Stream，也有其他的：

    +   `http.IncomingRequest`
    +   `fs.createReadStream()`
    +   `process.stdin`
    +   其他

    例子一：

    ```js
    const fs = require('fs');
    fs.readFile('./sample.txt', 'utf8', function(err, content){
        console.log('文件读取完成，文件内容是 [%s]', content);
    });
    ```

    例子二：

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

    例子三：

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

+   Writable Stream

    例子一：

    ```js
    const fs = require('fs');
    const content = 'hello world';
    const filepath = './sample.txt';

    fs.writeFile(filepath, content);
    ```

    例子二：

    ```js
    const fs = require('fs');
    const content = 'hello world';

    const filepath = './sample.txt';

    const writeStream = fs.createWriteStream(filepath);

    writeStream.write(content);

    writeStream.end();
    ```

+   Duplex Stream

    TODO...

+   Transform Stream

    TODO...

## 参考

+   https://nodejs.org/api/stream.html
+   https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/stream.md
+   (推荐)https://www.cnblogs.com/dolphinX/p/6279805.html