# node 的模块机制

## 模块载入机制

这里列下node模块的载入及缓存机制：

+   载入缓存模块
+   载入内置模块（A Core Module）
+   载入文件模块（A File Module）
+   载入文件目录模块（A Folder Module）
+   载入node_modules里的模块

## 载入缓存模块

对于已加载的模块 Node 会缓存下来，而不必每次都重新搜索。下面是一个示例

modA.js

```js
console.log('mod 开始加载...')
exports = function() {
    console.log('Hi')
}
console.log('mod 加载完毕')
```

index.js

```js
const mod1 = require('./mod');
const mod2 = require('./mod');
console.log(mod1 === mod2);
```

命令行执行：

```
node index.js 
```

输出如下：

```
mod 开始加载...
mod 加载完毕
true
```

可以看到虽然 require 了两次，但 mod.js 仍然只执行了一次。mod1 和 mod2 是相同的，即两个引用都指向了同一个模块对象。

与前端浏览器会缓存静态脚本文件以提高性能一样，Node 对引入过的模块都会进行缓存，不论是核心模块还是文件模块，不同之处是核心模块的缓存检查会优先于文件模块的缓存检查。

## 载入内置模块

Node的内置模块被编译为二进制形式，引用时直接使用名字而非文件路径。当第三方的模块和内置模块同名时，内置模块将覆盖第三方同名模块。因此命名时需要注意不要和内置模块同名。如获取一个 http 模块：

```js
const http = require('http');
```

返回的 http 即是实现了 HTTP 功能 Node 的内置模块。

## 载入文件模块

绝对路径的

```js
const myMod = require('/home/base/my_mod');
```

或相对路径的

```js
const myMod = require('./my_mod');
```

注意，这里忽略了扩展名 `.js`，以下是对等的

```js
const myMod = require('./my_mod')
const myMod = require('./my_mod.js')
```

## 载入文件目录模块

可以直接 require 一个目录，假设有一个目录名为 folder，如

```js
const myMod = require('./folder');
```

此时，Node将搜索整个 folder 目录

+   Node 会假设folder为一个包并试图找到包定义文件 package.json，然后找到 `main` 字段定义的入口文件
+   如果 folder 目录里没有包含package.json文件，Node 会假设默认主文件为index.js，即会加载 index.js
+   如果 index.js 也不存在，那么加载将失败

假设 package.json 定义如下：

```js
{
    "name": "pack",
    "main": "modA.js"
}
```

此时 `require('./folder')` 将返回模块 modA.js。如果 package.json 不存在，那么将返回模块index.js。如果index.js也不存在，那么将发生载入异常。

## 载入 node_modules 里的模块

如果模块名不是路径，也不是内置模块，Node 将试图去当前目录的 node_modules 文件夹里搜索。如果当前目录的 node_modules 里没有找到，Node 会从父目录的 node_modules 里搜索，这样递归下去直到根目录（全局 `-g` 安装的包或 node 自带的包）。

不必担心，npm 命令可让我们很方便的去安装，卸载，更新 node_modules 目录。


## 其他

由于存在缓存机制，在程序中两次 `require(xx)` 的结果是一样的，即使第二次 require 之前模块的内容发生了变化，结果也和第一次一致。如果需要临时清除该模块的缓存，可以使用：

```
delete require.cache('xx');
```

## 参考

+   CommonJS 规范：http://javascript.ruanyifeng.com/nodejs/module.html