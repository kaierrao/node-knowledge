# Node.js 异常处理

Node 中的异常处理，根据不同的代码写法，有不同的处理方式，总的来说还是挺麻烦的。

下面一一讲解不同的代码写法的异常处理方式，以求在框架层面统一处理异常。

## Node.js 全局捕获异常

直接上代码，全局捕获异常：

```js
process.on('uncaughtException', (error) => {
    console.error('全局捕获 uncaughtException', error);
})

process.on('unhandledRejection', (error) => {
    console.error('全局捕获 unhandledRejection', error);
})
```

举例：

inde.js

```js
process.on('uncaughtException', (error) => {
    console.error('全局捕获 uncaughtException', error);
})

process.on('unhandledRejection', (error) => {
    console.error('全局捕获 unhandledRejection', error);
})

a
```

也就是说，代码中多了一个未定义的 `a`。

执行 `node index.js`，输出：

```bash
全局捕获 uncaughtException ReferenceError: a is not defined
    at Object.<anonymous> (/Users/lyy/Downloads/code/github/node-knowledge/demo/index.js:9:1)
    at Module._compile (module.js:643:30)
    at Object.Module._extensions..js (module.js:654:10)
    at Module.load (module.js:556:32)
    at tryModuleLoad (module.js:499:12)
    at Function.Module._load (module.js:491:3)
    at Function.Module.runMain (module.js:684:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
```

## 回调

如果在回调函数中直接处理了异常，是最不明智的选择，因为业务方完全失去了对异常的控制能力。

下方的函数 请求处理 不但永远不会执行，还无法在异常时做额外的处理，也无法阻止异常产生时笨拙的 `console.log('请求失败')` 行为。

```js
function fetch(callback) {
    setTimeout(() => {
        console.log('请求失败')
    })
}

fetch(() => {
    console.log('请求处理') // 永远不会执行
})
```

## 参考

+   [Callback Promise Generator Async-Await 和异常处理的演进](https://www.jianshu.com/p/78dfb38ac3d7)