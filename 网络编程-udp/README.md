# 网络编程

Node 提供了 net、dgram、http、https 这四个模块分别用来处理 TCP、UDP、HTTP、HTTPS。

## 简介

dgram 是对 UDP socket 的一层封装，相对 net 来说简单很多，下面是一个例子：

## 简单的 server + client 例子

+   server

    ```
    const PORT = 3333;
    const HOST = '127.0.0.1';

    const dgram = require('dgram');
    const server = dgram.createSocket('udp4');

    // 注册事件
    server.on('listening', () => {
        const address = server.address();
        // address.address 输出的是 0.0.0.0
        console.log('UDP Server listening on ' + address.address + ': ' + address.port);
    });

    // 注册事件
    server.on('message', (message, remote) => {
        // remote.port 每个重新启动的客户端是不同的
        console.log(remote.address + ':' + remote.port + '-' + message);
    });

    // 启动服务
    server.bind(PORT);
    ```

+   client

    ```
    const PORT = 3333;
    const HOST = '127.0.0.1';

    const dgram = require('dgram');
    const message = Buffer.from('My KungFu is good!');

    const client = dgram.createSocket('udp4');

    client.send(message, PORT, HOST, (err, bytes) => {
        if (err) {
            throw err;
        }

        console.log('UDP message sent to ' + HOST + ':' + PORT);
        client.close();
    });
    ```

+   测试

    执行 `node server` 和 `node client`

    server 端输出

    ```
    UDP Server listening on 0.0.0.0: 3333
    127.0.0.1:53088-My KungFu is good!
    ```

## 广播

通过 dgram 实现广播很简单

server.js

```
const PORT = 3333;
const HOST = '127.0.0.1';

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

// 注册事件
server.on('message', (message, remote) => {
    console.log('server got message from: ' + remote.address + ':' + remote.port);
});

// 启动服务
server.bind(PORT);
```

client.js

```
const PORT = 3333;
const HOST = '255.255.255.255';

const dgram = require('dgram');
const message = Buffer.from('Hello World');

const client = dgram.createSocket('udp4');

client.bind(() => {
    client.setBroadcast(true);

    // send 方法有回调函数
    client.send(message, PORT, HOST, (err) => {
        if (err) {
            throw err;
        }
        console.log('message has been sent');
        client.close();
    });
});
```

执行 `node server`，多次执行  `node client`，server 端输出为：

```
server got message from: 172.19.32.201:54813
server got message from: 172.19.32.201:63902
server got message from: 172.19.32.201:64776
server got message from: 172.19.32.201:52798
server got message from: 172.19.32.201:52595
```

## 参考

+   https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/net.md