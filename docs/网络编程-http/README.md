# HTTP

## 简介

借助 http 模块，开发者用几行代码就可以很方便地实现一个迷你的 web server。

## 举例

举一个简单的例子，创建一个服务器、一个客户端：

+   服务器：接收来自客户端的请求，并返回请求的 url
+   客户端：向服务端发送请求，并将服务端的返回内容打印到控制台

代码如下：

Server

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.end('您访问的地址是：' + req.url);
});

server.listen(3000);
```

Client

```javascript
const http = require('http');

const client = http.get('http://127.0.0.1:3000', (res) => {
    res.pipe(process.stdout);
});
```

## 解析案例

上面这个例子里，涉及了 4 个实例，大部分时候，server 代码中的 req、res 才是主角：

+   server: http.Server 的实例，用来提供服务，处理客户端的请求
+   client: http.ClientRequest 实例，用来向服务器发送请求
+   (server)req / (client)res: 都是 http.IncomingMessage 的实例。

    (server)req 用来处理客户端的请求，如 Request Header 等

    (client)res 用来处理服务端的返回信息，如 Response Header 等

+   (server)res: http.ServerResponse 的实例

## 关于 http.ServerResponse 和 http.IncomingMessage

+   http.ServerResponse 实例

    服务端通过 http.ServerResponse 实例，来给请求方发送数据，包括发送响应头，发送响应主体等。

+   http.IncomingMessage 实例

    +   server 端

        获取请求的发送方信息，比如请求方法、路径、传递的数据等

        其中，method 属性只在 server 端的实例有，即 (server)`res.method`

    +   client 端

        获取 server 端发送的信息，比如请求方法、路径、传递的数据等

        其中，statusCode/statusMessage 只在 client 端有，即 (client)`res.statusCode`、`res.statusMessage`

## 继承与扩展

TODO...

## 参考

+   https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/http.md