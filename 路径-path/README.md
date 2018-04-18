# Path

path 模块的使用频率很高，有些常用的 API。

下面将 API 分类进行讲解。

## 获取路径名/文件名/扩展名

+   `path.dirname(filepath)`

    获取目录名。

    ```js
    const path = require('path');
    const filepath = '/test/a/b/c.js';
    console.log(path.dirname(filepath));
    ```

    输出：

    ```
    /test/a/b
    ```

+   `path.basename(filepath)`

    常用于获取文件名。

    ```js
    const path = require('path');
    const filepath = '/test/a/b/c.js';
    console.log(path.basename(filepath));
    ```

    输出：

    ```
    c.js
    ```

+   `path.extname(filepath)`

    获取扩展名。

    ```js
    const path = require('path');
    const filepath = '/test/a/b/c.js';
    console.log(path.extname(filepath));
    ```

    输出：

    ```
    .js
    ```

    当然也有更多规则：

    +   从路径的最后一个 `.` 开始截取，直到最后一个字符
    +   如果坏 `c.js` 中不存在 `.`，或者第一个字符就是 `.`，那么返回空字符串

    官方例子：

    ```js
    path.extname('index.html');
    // Returns: '.html'

    path.extname('index.coffee.md');
    // Returns: '.md'

    path.extname('index.');
    // Returns: '.'

    path.extname('index');
    // Returns: ''

    path.extname('.index');
    // Returns: ''
    ```

## 路径组合

+   `path.join([...paths])`

    将 paths 拼接起来。

    ```js
    const path = require('path');
    console.log(path.join('a', 'b'));
    ```

    输出：

    ```
    a/b
    ```

+   `path.resolve([...paths])`

    获取绝对路径。

## 路径解析

+   `path.parse(path)`

    解析路径，返回一个 json 对象。

    ```js
    const path = require('path');
    console.log(path.parse('github/node-knowledge'));
    ```

    输出：

    ```
    {
        root: '',
        dir: 'github',
        base: 'node-knowledge',
        ext: '',
        name: 'node-knowledge'
    }
    ```

+   `path.format(pathObj)`

    `parse.parse(path)` 的反向动作，解析 json 对象，返回路径（不一定是绝对路径）。

    ```js
    const path = require('path');
    console.log(path.format({ 
        root: '', 
        dir: 'github', 
        base: 'node-knowledge', 
        ext: '', 
        name: 'node-knowledge' 
    }));
    ```

    输出：

    ```
    github/node-knowledge
    ```

## 获取相对路径

+   `path.relative(from, to)`

    +   如果 from、to 指向同个路径，那么，返回空字符串。
    +   如果 from、to 中任一者为空，那么，返回当前工作路径。

    举例：

    ```js
    const path = require('path');

    const p1 = path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
    console.log(p1);  // 输出 "../../impl/bbb"

    const p2 = path.relative('/data/demo', '/data/demo');
    console.log(p2);  // 输出 ""

    const p3 = path.relative('/data/demo', '');
    console.log(p3);  // 输出 "../../Users/lyy/Downloads/code/github/node-knowledge"
    ```

## 平台相关

以下属性、接口，都跟平台的具体实现相关。也就是说，同样的属性、接口，在不同平台上的表现不同。

+   `path.posix`：path 相关属性、接口的 linux 实现。
+   `path.win32`：path 相关属性、接口的 win32 实现。
+   `path.sep`：路径分隔符。在 linux 上是 `/`，在 windows 上是 `\`。
+   `path.delimiter`：path 设置的分割符。linux 上是 `:`，windows 上是 `;`。

注意，当使用 `path.win32` 相关接口时，参数同样可以使用 `/` 做分隔符，但接口返回值的分割符只会是 `\`。

```
> path.win32.join('/tmp', 'fuck')
'\\tmp\\fuck'
> path.win32.sep
'\\'
> path.win32.join('\tmp', 'demo')
'\\tmp\\demo'
> path.win32.join('/tmp', 'demo')
'\\tmp\\demo'
```