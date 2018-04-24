## 介绍

Node.js 是一种 JavaScript 的运行环境，能够使得 JavaScript 脱离浏览器运行。

Node.js 建立在 [Chrome V8 JavaScript](https://developers.google.com/v8/)  引擎上。

这个项目介绍了 Node 相关的各类知识，持续更新中。

该项目对 Windows 不友好，对 Mac 友好

[node api 中文文档](http://nodejs.cn/api/)

[node api docs](https://nodejs.org/en/docs/)

## Node.js 能做什么

+   服务器开发：[express](https://github.com/expressjs/express) / [koa](https://github.com/koajs/koa) 等
+   im 即时聊天：socket.io
+   前端构建工具：[webpack](https://github.com/webpack) / [gulp](https://github.com/gulpjs/gulp) / [grunt](https://github.com/gruntjs/grunt) …
+   写操作系统：[NodeOS](https://github.com/NodeOS/NodeOS)
+   命令行工具：比如 [bio](https://github.com/weidian-inc/bio-cli)
+   IDE：[vscode](https://github.com/Microsoft/vscode) / [atom](https://github.com/atom/atom) 等

## Node 知识图谱

### 准备阶段

+   Node 安装与配置
    +   [搭建 Node.js 开发环境与版本控制](./搭建Node.js开发环境与版本控制)
    +   [npm 介绍与源控制](./npm介绍与源控制)
    +   [node 的模块机制](./node的模块机制)
+   Node 语言编程特点
    +   [ECMAScript 6/7](http://es6.ruanyifeng.com/)
    +   OO（面向对象）
    +   [异步编程](./异步编程)
+   调试
    +   [调试 - console](./调试-console)
    +   [调试 - debug](./调试-debug)

### 功能模块

+   [文件操作 - fs](./文件操作-fs)
+   [路径 - path](./路径-path)
+   [流 - stream](./流-stream)
+   [工具 - util](./工具-util)
+   [事件 - events](./事件-events)
+   网络
    +   [网络编程 - tcp](./网络编程-tcp)
    +   [网络编程 - udp](./网络编程-udp)
    +   [网络编程 - dns](./网络编程-dns)
    +   [网络编程 - http](./网络编程-http)
    +   [网络编程 - req](./网络编程-req)
    +   [网络编程 - res](./网络编程-res)
    +   [网络编程 - client request](./网络编程-client-request)
    +   [url 解析 - url 模块](./url解析-url模块)
    +   [url 解析 - querystring 模块](./url解析-querystring模块)
+   进程
    +   [进程 - process](./进程-process)
    +   [进程 - child_process](./进程-child_process)
    +   [进程 - 多进程](./进程-多进程)
    +   [进程 - cluster](./进程-cluster)
+   [压缩 - zip](./压缩-zip)
+   [命令行交互](./命令行交互)

### 质量

+   [异常处理](./异常处理)
+   [单元测试](./单元测试)
+   性能优化
    +   [内存控制](./内存控制)
    +   [benchmark](./benchmark)

### 框架

+   [express](./express)
+   [koa](./koa)

## 参考资料

+   [ECMAScript 6 入门](http://es6.ruanyifeng.com/)
+   [《深入浅出 Node.JS》](https://www.amazon.cn/dp/B00GOM5IL4/ref=sr_1_1?ie=UTF8&qid=1523943449&sr=8-1&keywords=%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnode.js)
+   [Node.js 包教不包会](https://github.com/alsotang/node-lessons)
+   [Node learning guide](https://github.com/chyingp/nodejs-learning-guide/blob/master/README.md)