# 异步编程

Node 将异步作为主要编程方式和设计理念。

当然，随着 ES6/7 等规范在 Node 中的支持，Node 也能很好地支持同步编程。

异步编程有如下几种方式。

+	回调函数
+	事件触发
+	Promise
+	Generator
+	async/await

**异步编程的语法目标，就是怎样让它更像同步编程。**

## 回调函数

所谓回调函数，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。它的英语名字 callback，直译过来就是"重新调用"。

首先，我们思考一个典型的异步编程模型，考虑这样一个题目：读取一个文件，在控制台输出这个文件内容。

```javascript
const fs = require('fs');
fs.readFile('sample.txt', 'utf8', function (err, data) {
	console.log(data);
});
```

看起来很简单，再进一步: 读取两个文件，在控制台输出这两个文件内容。

```javascript
const fs = require('fs');
fs.readFile('sample01.txt', 'utf8', function (err, data) {
	console.log(data);
	fs.readFile('sample02.txt', 'utf8', function (err,data) {
		console.log(data);
	});
});
```

要是读取更多的文件呢?

```javascript
const fs = require('fs');
fs.readFile('sample01.txt', 'utf8', function (err, data) {
	fs.readFile('sample02.txt', 'utf8', function (err,data) {
		fs.readFile('sample03.txt', 'utf8', function (err, data) {
			fs.readFile('sample04.txt', 'utf8', function (err, data) {

			});
		});
	});
});
```

这段代码就是臭名昭著的邪恶金字塔(Pyramid of Doom)。

可以使用 async 和 promise 改善这段代码。

## 事件触发

这里不赘述，如需了解可查看：[事件-events](../事件-events)。

## Promise

请注意下文中的大小写：`Promise` 代表构造函数，`promise` 代表实例。

Node 原生支持 Promise。

+	创建 Promise

	```javascript
	const promise = new Promise((resolve, reject) => {
		if ( /* 操作成功 */ ) {
			resolve();
		} else {
			reject();
		}
	});
	```

	Pomise 对象在实例化时，需要一个回调函数作为参数，否则会报错：

	```bash
	TypeError: Promise resolver undefined is not a function
	```

	**该回调函数会立即执行。**

	`Promise` 回调函数，可以：

	+	没有 `return`，通过 `resolve` 发送信息
	+	`return` 一个 `promise` 实例，后文的 `then` 会基于它的状态运行

+	promise 的状态

	promise 是有状态的，分别是：pending(等待)、fulfilled(成功)、rejected(失败)。

	pending 可以转化为 fulfilled 和 rejected，但fulfilled 和 rejected 不能相互转化。

+	`resolve` 和 `reject` 方法

	`resolve` 方法可以将 pending 状态转化为 fulfilled 状态。

	`reject` 方法可以将 pending 状态转化为 rejected 状态。

+	promise 中的数据传递

	+	promise 实例到 `then/catch/...`，通过 `resolve / reject`
	+	`then` 到后面的链路，通过 `return`
	
		`return 普通值 / return promise`

+	then 方法

	接上面的代码

	```js
	promise.then((data) => {
		// 上面的 resolve 方法会将参数传进成功的回调
	}, (err) => {
		// 上面的 reject 方法会将失败的信息传进失败的回调
	);
	```

	举例：

	```javascript
	const p = new Promise(function(resolve, reject){
		setTimeout(() => {
			let num = Math.random();
			if (num > 0.5) {
				resolve(num);
			}else{
				reject(num);
			}
		}, 1000)
	})
	p.then((num) => {
		console.log('大于0.5的数字：', num);
	}, (num) => {
		console.log('小于等于0.5的数字', num);
	})
	// 运行第一次：小于等于0.5的数字 0.166162996031475
	// 运行第二次：大于0.5的数字： 0.6591451548308984
	```

	**如果执行 then 之前，实例的状态已经是 fulfilled/rejected，则执行 then 的时候，回调函数会立刻执行**

	`then` 的回调方法需要 `return` 传递信息：

	+	可以返回一个普通数据
	+	也可以返回一个新的 `promise` 实例，后续的链式调用会基于该实例的状态运行

+	链式调用

	每一个 `then` 方法都会返回一个新的 Promise 实例，以支持链式调用，并通过 **返回值** 传递给下一个 `then`。

	举例：

	```javascript
	promise.then((num) => {
			return num
		}, (num) => {
			return num
		}).then((num) => {
			console.log('大于0.5的数字：', num)
		}, (num) => {
			console.log('小于等于0.5的数字', num)
		});
	```

+	一些快捷方法

	+	catch 方法

		catch 方法等同于 `.then(null, rejectCallback)`，可以直接指定失败的回调（支持接收上一个 then 发生的错误）。

	+	`Promise.all()` 方法

		这是个很有用的方法，可以统一处理多个 Promise，原理是将多个 Promise 实例包装成一个 Promise 实例。

		举例：

		```js
		const promise1 = new Promise((resolve, reject) => { 
			setTimeout(() => {
				resolve(1);
			}, 1000);
		});
		const promise2 = new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(2);
			}, 2000);
		});
		const promise3 = new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(3);
			}, 3000);
		});

		const promise = Promise.all([promise1, promise2, promise3]);

		promise.then((data) => {
			// 都成功，则成功
			console.log(data); // [1, 2, 3]
		}, (err) => {
			// 只要有一个失败，则失败
		});
		```

	+	`Promise.race()` 方法

		与 all 方法类似，也可以将多个 Promise 实例包装成一个新的 Promise 实例。
		
		不同的是，all 时大 Promise 的状态由多个小 Promise 共同决定，而 race 时由第一个转变状态的小 Promise 的状态决定，第一个是成功态，则转成功态，第一个失败态，则转失败态。

	+	`Promise.resolve()`

		可以生成一个成功态的 promise。

		```javascript
		const promise = Promise.resolve('成功')
		```

		相当于

		```javascript
		const promise = new Promise((resolve, reject) => {
			resolve('成功');
		});
		```

	+	`Promise.reject()`

		可以生成一个失败态的 promise。

		```javascript
		const promise = Promise.reject('出错了')
		```

		相当于

		```javascript
		const promise = new Promise((resolve, reject) => {
			reject('出错了');
		});
		```

+	实现

    https://juejin.im/post/5ab20c58f265da23a228fe0f

	+	实现思路

		+	初始化各种值：`_this.value / _this.status / _this.reason`
		+	`executor` 会立即执行
		+	处理同步的 promise：`then` 方法能够处理 `resolved / rejected` 的状态
		+	处理异步的 promise
			+	初始化队列 `_this.onResolvedCallbacks / _this.onRejectedCallbacks`
			+	`then` 中处理 `pending` 状态，向队列添加处理函数
			+	`resolve / reject` 中执行队列
		+	处理 `executor` 报错的情况
		+	处理链式调用，返回 promise2
			+	promise2 有自己的 `resolve / reject` 变更状态的方法，和之前的 `resolve / reject` 相互隔离
			+	`promise2` 的状态管理
				+	`then` 两个回调方法里，任意一个方法执行报错，`promise2` 的状态就是 `rejected`
				+	否则再根据两个函数其中之一的返回值，决定 `promise2` 的状态
			
					如果返回值是普通值，则直接是 resolve 状态。

					如果返回值是 promise，则 promise2 的状态取决于该 promise 的状态，并且依次向深处递归，**最深处的 promise 决定 promise2 的最终状态。**

					以上动作封装在 `resolvePromise()` 中。

				+	由此可知，promise 的 `then` 的 `onFulfilled(value)` 中 value 一定是一个普通值

	+	实现的注意点

		+   resolve 和 reject 是内部定义的函数，但是会交给用户执行，用户可能同步或异步执行
		+   `resolvePromise`

			+   `promise2` 的状态决定于 `x`（可能是普通值或 promise），因此在递归操作中会继续向下传递 `resolve / reject`
			+   需要防止多次调用 `resolve / reject`

	+	实现代码

		```javascript
		function MyPromise(executor) {
			const undefined = void 0;
			const _this = this;

			// 初始化
			_this.value = undefined;
			_this.reason = undefined;
			_this.status = 'pending';

			_this.onFulfilledCallbacks = [];
			_this.onRejectedCallbacks = [];

			// 改变状态到 resolved
			function resolve(value) {
				if (_this.status === 'pending') {
					_this.value = value;
					_this.status = 'resolved';

					// flush queue
					_this.onFulfilledCallbacks.forEach(function (fn) {
						fn();
					});
				}
			}

			// 改变状态到 rejected
			function reject(reason) {
				if (_this.status === 'pending') {
					_this.reason = reason;
					_this.status = 'rejected';

					console.log('promise rejected!');

					// flush queue
					_this.onRejectedCallbacks.forEach(function (fn) {
						fn();
					});
				}
			}

			try {
				executor(resolve, reject);
			} catch(err) {
				reject(err);
			}
		}

		MyPromise.prototype.then = function(onFulfilled, onRejected) {
			const _this = this;
			let promise2;

			if (_this.status === 'resolved') {
				promise2 = new Promise(function(resolve, reject) {
					try {
						const x = onFulfilled(_this.value);
						resolvePromise(promise2, x, resolve, reject);

					} catch(err) {
						reject(err);
					}
				});
			}

			if (_this.status === 'rejected') {
				promise2 = new Promise(function (resolve, reject) {
					try {
						const x = onRejected(_this.reason);

					} catch (err) {
						reject(err);
					}
				});
			}

			if (_this.status === 'pending') {
				promise2 = new Promise(function(resolve, reject) {
					if (typeof onFulfilled === 'function') {
						_this.onFulfilledCallbacks.push(function () {
							try {
								const x = onFulfilled(_this.value);
								resolvePromise(promise2, x, resolve, reject);
							} catch(err) {
								reject(err);
							}
						});
					}

					if (typeof onRejected === 'function') {
						_this.onRejectedCallbacks.push(function () {
							try {
								const x = onRejected(_this.value);
								resolvePromise(promise2, x, resolve, reject);
							} catch(err) {
								reject(err);
							}
						});
					}
				});
			}

			return promise2;
		};

		function resolvePromise(promise2, x, promise2Resolve, promise2Reject) {
			// 如果返回值就是 promise2，指出重复引用
			if (promise2 === x) {
				promise2Reject(new TypeError('循环引用'));
				return;
			}

			// 防止重复调用
			let called = false;

			if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
				const then = x.then;
				if (typeof then === 'function') {
					try {
						then.call(x, function(y) {
							if (called) {
								return;
							}

							called = true;

							// 不知道 y 的类型，因此需要重新走一遍各种判断逻辑
							resolvePromise(promise2, y, promise2Resolve, promise2Reject);
						}, function(err) {
							if (called) {
								return;
							}

							called = true;
							promise2Reject(err);
						});
					} catch(err) {
						if (called) {
							return;
						}

						called = true;
						promise2Reject(err);
					}
				} else {
					if (called) {
						return;
					}

					called = true;
					promise2Resolve(x);
				}
			} else {
				if (called) {
					return;
				}

				called = true;
				promise2Resolve(x);
			}
		}

		MyPromise.prorotype.catch = function(callback) {
			return this.then(null, callback);
		};

		MyPromise.deferred = function() {
			const dfd = {};

			dfd.promise = new MyPromise(function(resolve, reject) {
				dfd.resolve = resolve;
				dfd.reject = reject;
			});

			return dfd;
		};

		MyPromise.all = function(promises) {
			const result = [];
			const length = promises.length;
			let count = 0;

			return new MyPromise(funtion(resolve, reject) {
				promises.forEach(function (promise) {
					promise.then(function (value) {
						count++;

						result.push(value);

						if (count === length) {
							resolve(result);
						}
					}, reject);
				});
			});
		};

		MyPromise.race = function(promises) {
			return new MyPromise(function(resolve, reject) {
				promises.forEach(function(promise) {
					promise.then(resolve, reject);
				});
			});
		};

		MyPromise.resolve = function(value) {
			return new MyPromise(function(resolve, reject) {
				resolve(value);
			});
		};

		MyPromise.reject = function (err) {
			return new MyPromise(function (resolve, reject) {
				reject(err);
			});
		};

		// test
		let promise = new MyPromise(function(resolve, reject) {
			setTimeout(() => {
				resolve(1);
			}, 1000);
		});

		promise.then(function(value) {
			console.log('resolved: ', value);
		}, function(reason) {
			console.log('rejected: ', reason);
		});
		```

## generator 函数

这几篇文章讲的很好: 

+	Generator 函数的含义与用法: http://www.ruanyifeng.com/blog/2015/04/generator.html
+	Thunk函数的含义与用法: http://www.ruanyifeng.com/blog/2015/04/generator.html
+	co函数库的含义与用法: http://www.ruanyifeng.com/blog/2015/05/co.html

## async

这篇文章讲的很好: https://cnodejs.org/topic/5640b80d3a6aa72c5e0030b6

举例：

```js
const sleep = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('done');
            resolve();
        }, 3000);
    });
};

const run = async () => {
    await sleep();
}

run();
```

Node 最新版本已经支持 `Async/Await`，可以放心使用
