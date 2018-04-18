# 网络编程

Node 提供了 net、dgram、http、https 这四个模块分别用来处理 TCP、UDP、HTTP、HTTPS。

## 简介

net 模块是 node 的核心模块。

从组成看，net 模块主要包含两个部分：

+   net.Server: TCP Server，内部通告 socket 实现和客户端的通信
+   net.Socket: tcp / 本地 socket 的 node 版实现，它实现了双工的 stream 接口

## 简单的 server + client 例子

tcp server 端：

```javascript
const net = require('net');

const PORT = 3000;
const HOST = '127.0.0.1';

const server = net.createServer((socket) => {
    // createServer 的回调是在每一个请求连接 connection 时触发
    console.log('服务端：与客户端的连接建立');
    socket.on('data', function (data) {
        console.log('服务端：收到客户端数据，内容为{' + data + '}');

        // 给客户端返回数据
        socket.write('你好，我是服务端');
    });

    socket.on('close', function () {
        console.log('服务端：客户端连接断开');
    });
});

server.listen(PORT, HOST, () => {
    console.log('服务端：开始监听来自客户端的请求');
});
```

tcp 客户端：

```javascript
const net = require('net');

const PORT = 3000;
const HOST = '127.0.0.1';

const client = net.createConnection(PORT, HOST);

client.on('connect', () => {
    console.log('客户端：已经与服务端建立连接');
});

client.on('data', function (data) {
    console.log('客户端：收到服务端数据，内容为{' + data + '}');
});

client.on('close', function (data) {
    console.log('客户端：连接断开');
});

client.end('你好，我是客户端');
```

运行服务端、客户端，结果如下：

服务端：

```
服务端：开始监听来自客户端的请求
服务端：收到来自客户端的请求
服务端：收到客户端数据，内容为{你好，我是客户端}
服务端：客户端连接断开
```

客户端：

```
客户端：已经与服务端建立连接
客户端：收到服务端数据，内容为{你好，我是服务端}
客户端：连接断开
```

## 服务端 server

+   `server.address()`

    返回服务端的地址信息

+   `server.close([callback])`

    关闭服务，停止接收新的请求。需要注意：

    +   对正在处理中的客户端请求，服务器会等待它们处理完（或超时），然后再正式关闭
    +   正常关闭的同时，callback 会被执行，同时会触发 close 事件
    +   异常关闭的同时，callback 也会执行，同时将对应的 error 作为参数传入。（比如还没调用 `server.listen(port)` 之前，就调用了 `server.close()`）

+   事件：listening / connection / error
 
    +   listening: 调用 `server.listen()`，正式开始监听请求的时候触发
    +   connection: 当有新的请求进来时触发，参数为请求相关的 socket
    +   close: 服务端关闭的时候触发
    +   error: 服务出错的时候触发，比如监听了已经监听的端口

    从测试的结果看，当有新的客户端连接产生时，`net.createServer(callback)` 中的 callback 函数会触发，同时 connection 事件也会被触发。

    事实上，net.createServer(callback) 中的 callback 在node内部实现中 也是加入了做为 connection事件 的监听函数。感兴趣的可以看下 node 的源码。

    举例：

    ```
    const net = require('net');
    const PORT = 3000;
    const HOST = '127.0.0.1';
    const noop = function(){};

    // tcp服务端
    const server = net.createServer(function(socket){
        socket.write('1. connection 触发\n');
    });

    server.on('connection', function(socket){
        socket.end('2. connection 触发\n');
    });

    server.listen(PORT, HOST);
    ```

    通过下面命令测试下效果：

    ```
    curl http://127.0.0.1:3000
    ```

    输出：

    ```
    1. connection 触发
    2. connection 触发
    ```

## 客户端 socket

单从node官方文档来看的话，感觉 net.Socket 比 net.Server 要复杂很多，有更多的API、事件、属性。但实际上，把 net.Socket 相关的 API、事件、属性 进行归类下，会发现，其实也不是特别复杂。

API todo...

## 参考

+   https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/net.md