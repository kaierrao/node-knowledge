# 进程 - 多进程

## 服务模型的变迁

+   同步

    该模式是一次只为一次请求服务，所有请求按照次序等待服务。也就是，除了当前请求之外，其余请求都处于耽误的状态。

    很显然，这种方式已经不符合现在的业务需求了。

+   复制进程

    为了解决同步架构的并发问题，一个简单的改进是，每个连接复制一个进程进行服务，但这样的开销巨大。

+   多线程

    为了解决进程复制过程中的浪费问题，多线程被引入，让一个线程处理一个请求。虽然线程的开销小很多，线程之间可以共享数据。

    但同样有内存开销、线程切换上下文时间长等问题。

+   事件驱动

    多线程/多进程模型，遇到高并发的情况时，内存消耗的问题就暴露了出来，这是著名的 C10k 问题。

    为了解决高并发问题，基于事件驱动的服务模型出现了。Node 和 Nginx 都是基于事件驱动的方式实现的，采用单线程避免了不必要的内存开销和上下文切换的问题。

    但基于事件的服务器模型的问题主要有两个：CPU 的利用率和进程的健壮性。

    由于所有处理都在单线程执行，影响事件驱动服务模型性能的点就在于 CPU 的计算能力。

## 多进程架构

面对单进程单线程对多核使用不足的问题，前人的经验是启动多进程即可。

理想状态下是每个进程各自利用一个 CPU，以实现多核 CPU 的利用。Node 提供了 child_process 模块，并提供了 `child_process.fork()` 方法为我们实现进程的复制。

master.js

```js
const fork = require('child_process').fork;
const cpus = require('os').cpus();

for (let i = 0; i < cpus.length; i++) {
    fork('./child.js');
}
```

child.js

```js
const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!');
}).listen(Math.round(1 + Math.random()) * 1000, '127.0.0.1');
```

## 创建子进程

这部分在 [进程 - child_process](../进程-child_process) 讲过，此处跳过

## 进程间通信

Node 父子进程之间，通过 `'message'` 事件和 `send()` 方法实现互相通信。

举例：

parent.js

```js
const child_process = require('child_process');

const child = child_process.fork('./child.js');

// 主进程接收信息
child.on('message', (message) => {
    console.log('parent got message: ', message);
});

child.send({ hello: 'world' });
```

child.js

```js
process.on('message', (m) => {
    console.log('child got message', m);
});

process.send({ foo: 'bar' });
```

## 进程间通信原理


