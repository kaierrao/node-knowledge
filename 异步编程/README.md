# 异步编程

Node 将异步作为主要编程方式和设计理念。

当然，随着 ES6/7 等规范在 Node 中的支持，Node 也能很好地支持同步编程。

## 异步编程的几种方式

### 回调函数

首先，我们思考一个典型的异步编程模型，考虑这样一个题目：读取一个文件，在控制台输出这个文件内容。

```javascript
var fs = require('fs');
fs.readFile('sample.txt', 'utf8', function (err, data) {
	console.log(data);
});
```

看起来很简单，再进一步: 读取两个文件，在控制台输出这两个文件内容。

```javascript
var fs = require('fs');
fs.readFile('sample01.txt', 'utf8', function (err, data) {
	console.log(data);
	fs.readFile('sample02.txt', 'utf8', function (err,data) {
		console.log(data);
	});
});
```

要是读取更多的文件呢?

```javascript
var fs = require('fs');
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

### Promise

使用 promise 替代回调函数：https://github.com/alsotang/node-lessons/tree/master/lesson17

### async

体验异步的终极解决方案- ES7 的 Async/Awai: https://cnodejs.org/topic/5640b80d3a6aa72c5e0030b6

Node 最新版本已经支持 Async/Await，可以放心使用