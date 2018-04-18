# 文件操作

## 文件读取

+   普通读取

    +   同步 `fs.readFileSync`

        ```js
        const fs = require('fs');
        let data;

        try {
            data = fs.readFileSync('./fileForRead.txt', 'utf8');
            console.log('文件内容: ' + data);
        } catch (err) {
            console.error('读取文件出错: ' + err.message);
        }
        ```

    +   异步 `fs.readFile`

        ```js
        const fs = require('fs');

        fs.readFile('./fileForRead.txt', 'utf8', (err, data) => {
            if (err) {
                return console.error('读取文件出错: ' + err.message);
            }
            console.log('文件内容: ' + data);
        });
        ```

+   通过文件流读取：适合读取大文件

    ```js
    const fs = require('fs');
    const readStream = fs.createReadStream('./fileForRead.txt', 'utf8');

    readStream
        .on('data', (chunk) => {
            console.log('读取数据：' + chunk);
        })
        .on('error', (err) => {
            console.log('出错：' + err);
        })
        .on('end', () => {
            console.log('没有数据了');
        })
        .on('end', () => {
            console.log('已经关闭');
        })
    ```

## 文件写入

+   普通写入

    +   同步 `fs.writeFileSync`

        ```js
        const fs = require('fs');

        try {
            fs.writeFileSync('./fileForWrite1.txt', 'hello world', 'utf8');
            console.log('文件写入成功');
        } catch (err){
            throw err;
        }
        ```

    +   异步 `fs.writeFile`

        ```js
        const fs = require('fs');

        fs.writeFile('./fileForWrite.txt', 'hello world', 'utf8', (err) => {
            if(err) throw err;
            console.log('文件写入成功');
        });
        ```
    
+   通过文件流写入

    ```js
    const fs = require('fs');
    const writeFileStream = fs.createWriteStream('./fileForWrite1.txt', 'utf8');

    writeFileStream.on('close', () => {
        console.log('已经关闭');
    });

    writeFileStream.write('hello');
    writeFileStream.write('world');
    writeFileStream.end('');
    ```

## 文件是否存在

**`fs.exists()` 已被废弃**

```js
const fs = require('fs');

fs.access('./fileForRead.txt', (err) => {
    if (err) {
        throw err;
    }

    console.log('文件存在');
});
```

`fs.access` 除了判断文件是否存在（默认模式），还可以判断文件的权限。

## 创建目录

+   同步 `fs.mkdirSync`

    ```js
    const fs = require('fs');

    fs.mkdirSync('./hello');
    ```

+   异步 `fs.mkdir`

    ```js
    const fs = require('fs');

    fs.mkdir('./hello', (err) => {
        if (err) {
            throw err;
        }
        console.log('目录创建成功');
    });
    ```

## 删除文件

+   同步

    ```js
    const fs = require('fs');

    fs.unlinkSync('./fileForUnlink.txt');
    ```

+   异步

    ```js
    const fs = require('fs');

    fs.unlink('./fileForUnlink.txt', (err) => {
        if (err) {
            throw err;
        }
        console.log('文件删除成功');
    });
    ```

## 遍历目录

`fs.readdirSync` 方法用来遍历目录，但它只能遍历一层

## 文件重命名

```js
// fs.rename(oldPath, newPath, callback)
const fs = require('fs');

fs.rename('./hello', './world', function(err){
    if(err) throw err;
    console.log('重命名成功');
});
```

```js
// fs.renameSync(oldPath, newPath)
const fs = require('fs');

fs.renameSync('./world', './hello');
```

## 获取文件状态

+   `fs.stat()` vs `fs.fstat()`：传文件路径 vs 文件句柄。
+   `fs.stat()` vs `fs.lstat()`：如果文件是软链接，那么 `fs.stat()` 返回目标文件的状态，`fs.lstat()` 返回软链接本身的状态。


