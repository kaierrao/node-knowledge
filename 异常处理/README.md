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

index.js

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

## 对回调的异常处理

+   同步回调：捕获异常较方便

    用 `try...catch...` 即可

+   异步回调：难以捕获异常

    异步回调中，回调函数的执行栈与原函数分离开，导致外部无法抓住异常。

    **我们下面用 setTimeout 模拟异步**

    ```js
    function fetch(callback) {
        setTimeout(() => {
            throw Error('请求失败')
        })
    }

    try {
        fetch(() => {
            console.log('请求处理') // 永远不会执行
        })
    } catch (error) {
        console.log('触发异常', error) // 永远不会执行
    }
    ```

    输出：

    ```bash
    throw Error('请求失败')
            ^

    Error: 请求失败
        at Timeout.setTimeout [as _onTimeout] (/Users/lyy/Downloads/code/github/node-knowledge/demo/index.js:3:15)
        at ontimeout (timers.js:475:11)
        at tryOnTimeout (timers.js:310:5)
        at Timer.listOnTimeout (timers.js:270:5)
    ```

    此时，异步回调中的错误并没有被 `catch` 到，而是抛向了外部。

+   未被调用的回调

    ```js
    function fetch(callback) {
        setTimeout(() => {
            console.log('请求失败')
        })
    }

    fetch(() => {
        throw Error('请求处理') // 永远不会执行
    })
    ```

    也就是说，回调有可能不执行，在回调中做异常处理是不可靠的。

+   总结

    也就是说，业务方在遇到回调函数的时候，处理异常是比较耗费精力的。而且，异常必须被处理掉，否则程序就挂了，精神负担比较大。

## 对 Promise 的异常处理

这里不详细解释 Promise，如需了解可查看 [异步编程](https://github.com/hoperyy/node-knowledge/tree/master/%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B) 的 Promsie 部分。

+   简单补充下事件循环的知识
    
    js 事件循环分为 macrotask 和 microtask。

    microtask 会被插入到每一个 macrotask 的尾部，所以 microtask 总会优先执行，哪怕 macrotask 因为 js 进程繁忙被 hung 住。

    比如 setTimeout setInterval 会插入到 macrotask 中。

    +   如果 promise 对象的状态是 `resolved`，那么 `then` 函数的第一个参数就会立即调入 `microtask` 中。

        ```js
        const promiseA = new Promise((resolve, reject) => {
            resolve('ok')
        })
        promiseA.then(result => {
            console.log(result) // ok
        })
        ```

    +   如果 promise 对象的状态是 `rejected`，那么 then 函数的第二个回调会立即插入 microtask 队列。

        ```js
        const promiseB = new Promise((resolve, reject) => {
            reject('no')
        })
        promiseB.then(result => {
            console.log(result) // 永远不会执行
        }, error => {
            console.log(error) // no
        })
        ```

    +   如果一直不决议，此 promise 将处于 pending 状态。

        ```js
        const promiseC = new Promise((resolve, reject) => {
            // nothing
        })
        promiseC.then(result => {
            console.log(result) // 永远不会执行
        }, error => {
            console.log(error) // 永远不会执行
        })
        ```

+   未捕获的 reject 会传到末尾，通过 catch 接住

    ```js
    const promiseD = new Promise((resolve, reject) => {
        reject('no');
    })
    promiseD.then(result => {
        console.log(result); // 永远不会执行
    }).catch(error => {
        console.log(error); // no
    })
    ```

+   不仅是 reject，抛出的异常也会被作为拒绝状态被 Promise 捕获

    ```js
    function fetch(callback) {
        return new Promise((resolve, reject) => {
            throw Error('用户不存在')
        })
    }

    fetch().then(result => {
        console.log('请求处理', result) // 永远不会执行
    }).catch(error => {
        console.log('请求处理异常', error) // 请求处理异常 用户不存在
    })
    ```

+   Promise 无法捕获的异常

    但是，永远不要在 macrotask 队列中抛出异常，因为 macrotask 队列脱离了运行上下文环境，异常无法被当前作用域捕获。

    ```js
    function fetch(callback) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                throw Error('用户不存在') // 会被抛到全局
            })
        })
    }

    fetch().then(result => {
        console.log('请求处理', result) // 永远不会执行
    }).catch(error => {
        console.log('请求处理异常', error) // 永远不会执行
    })
    ```

    不过 microtask 中抛出的异常可以被捕获，说明 microtask 队列并没有离开当前作用域，我们通过以下例子来证明：

    ```js
    Promise.resolve(true).then((resolve, reject)=> {
        throw Error('microtask 中的异常')
    }).catch(error => {
        console.log('捕获异常', error) // 捕获异常 Error: microtask 中的异常
    })
    ```

    至此，Promise 的异常处理有了比较清晰的答案，只要注意在 macrotask 级别回调中使用 reject，就没有抓不住的异常。

## 对 async await 的异常处理

+   使用 `try...catch...` 处理异常

    ```js
    function fetch(callback) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('no');
            })
        })
    }

    async function main() {
        try {
            const result = await fetch()
            console.log('请求处理', result); // 永远不会执行
        } catch (error) {
            console.log('异常', error) // 异常 no
        }
    }

    main();
    ```

+   async await 无法捕获的异常

    和 Promise 中某些错误无法捕获的原因一样，这也是 await 的软肋，如：

    ```js
    function fetch(callback) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                throw Error('no');
            })
        })
    }

    async function main() {
        try {
            const result = await fetch()
            console.log('请求处理', result); // 永远不会执行
        } catch (error) {
            console.log('异常', error) // 永远不会执行
        }
    }

    main();
    ```

    错误会被直接抛向全局。

## 参考

+   [Callback Promise Generator Async-Await 和异常处理的演进](https://www.jianshu.com/p/78dfb38ac3d7)