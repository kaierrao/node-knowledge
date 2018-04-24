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

	**该回调函数会立即执行**

+	promise 的状态

	promise 是有状态的，分别是：pending(等待)、fulfilled(成功)、rejected(失败)。

	pending 可以转化为 fulfilled 和 rejected，但fulfilled 和 rejected 不能相互转化。

+	`resolve` 和 `reject` 方法

	`resolve` 方法可以将 pending 状态转化为 fulfilled 状态。

	`reject` 方法可以将 pending 状态转化为 rejected 状态。

+	then 方法

	接上面的代码

	```
	promsie.then((data) => { // 上面的 resolve 方法会将参数传进成功的回调

	}, (err) => { // // 上面的 reject 方法会将失败的信息传进失败的回调

	});
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

+	链式调用

	每一个 `then` 方法都会返回一个新的 Promise 实例，以支持链式调用，并通过 **返回值** 传递给下一个 `then`。

	举例：

	```javascript
	promsie.then((num) => {
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

	+	`Promsie.all()` 方法

		这是个很有用的方法，可以统一处理多个 Promsie，原理是将多个 Promise 实例包装成一个 Promsie 实例。

		举例：

		```
		const promsie1 = new Promsie((resolve, reject) => {});
		const promsie2 = new Promsie((resolve, reject) => {});
		const promsie3 = new Promsie((resolve, reject) => {});

		const promsie = Promsie.all([promise1, promise2, promise3]);

		promsie.then((data) => {
			// 都成功，则成功
		}, (err) => {
			// 只要有一个失败，则失败
		});
		```

	+	`Promsie.race()` 方法

		与 all 方法类似，也可以将多个 Promise 实例包装成一个新的 Promise 实例。
		
		不同的是，all 时大 Promise 的状态由多个小 Promise 共同决定，而 race 时由第一个转变状态的小 Promise 的状态决定，第一个是成功态，则转成功态，第一个失败态，则转失败态。

	+	`Promise.resolve()`

		可以生成一个成功态的 promise。

		```javascript
		const promsie = Promise.resolve('成功')
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
		const promsie = Promise.reject('出错了')
		```

		相当于

		```javascript
		const promise = new Promise((resolve, reject) => {
			reject('出错了');
		});
		```

## generator 函数

这几篇文章讲的很好: 

+	Generator 函数的含义与用法: http://www.ruanyifeng.com/blog/2015/04/generator.html
+	Thunk函数的含义与用法: http://www.ruanyifeng.com/blog/2015/04/generator.html
+	co函数库的含义与用法: http://www.ruanyifeng.com/blog/2015/05/co.html

## async

这篇文章讲的很好: https://cnodejs.org/topic/5640b80d3a6aa72c5e0030b6

Node 最新版本已经支持 Async/Await，可以放心使用
