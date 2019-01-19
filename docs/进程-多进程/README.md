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

+   IPC

    IPC 的全称是 Inter-Process Communication，即进程间通信。进程间通信的目的是为了让不同的进程能够互相访问资源并进行协调工作。

    实现进程间通信的技术有很多，如命名管道、匿名管道、socket、信号量、共享内存、消息队列等，Node 中实现 IPC 通道的是管道技术，具体实现细节由 libuv 提供。

    表现在应用层上，进程间通信只有简单的 `message` 事件和 `send()` 方法。

    父进程在实际创建子进程之前，会创建 IPC 通道并监听它，然后才真正创建出子进程，并通过环境变量（NODE_CHANNEL_FD）告诉子进程这个 IPC 通道的文件描述符。

    子进程在启动过程中，会根据文件描述符去连接这个已经存在的 IPC 通道，从而完成父子进程之间的连接。

    **只有启动的子进程是 Node 进程时，子进程才会根据环境变量连接 IPC 通道**

+   句柄传递

    如果多个子进程都监听同一个端口，很显然会报错 `EADDRINUSE`

    也就是说，只有一个进程能够监听某一个端口。

    +   一个解决方案

        就是创建 master + child 父子进程结构，每个 child 进程监听不同的端口，master 进程监听主端口。master 进程对外接收所有的网络请求，再将这些请求分别代理到不同端口的 child 进程上。

        但这种方式的缺点是，进程每接收到一个连接，都会用掉一个文件描述符，上述方案在 master 会用掉一个，child 再用掉一个，对文件描述符过于浪费了。

    +   改进方案

        为了解决上面的问题，Node 在 v0.5.9 版本引入了进程间发送句柄的功能。

        `send()` 方法除了能通过 IPC 发送数据外，还能发送句柄，第二个可选参数就是句柄。

        ```js
        child.send(message[, sendHandle]);
        ```

        句柄：是一种可以标识资源的引用。可以标识一个服务器端 socket 对象、一个客户端 socket 对象、一个 UDP 套接字、一个管道等。

        利用句柄方案，我们改动代码如下：

        +   父进程和一个子进程共同处理请求

            parent.js

            ```js
            const child = require('child_process').fork('./child.js');

            const server = require('net').createServer();

            server.on('connection', (socket) => {
                socket.end('handled by parent');
            });

            server.listen(1337, () => {
                child.send('server', server);
            });
            ```

            child.js

            ```js
            process.on('message', (m, server) => {
                if (m === 'server') {
                    server.on('connection', (socket) => {
                        socket.end('handled by child');
                    });
                }
            });
            ```

            执行 `node parent.js` 启动服务后，我们在终端多次执行 `curl http://127.0.0.1:1337/`，输出会时而 parent 时而 child。

        +   父进程和多个子进程共同处理请求

            parent.js

            ```js
            const child1 = require('child_process').fork('./child.js');
            const child2 = require('child_process').fork('./child.js');

            const server = require('net').createServer();

            server.on('connection', (socket) => {
                socket.end('handled by parent');
            });

            server.listen(1337, () => {
                child1.send('server', server);
                child2.send('server', server);
            });

            ```

            child.js

            ```js
            process.on('message', (m, server) => {
                if (m === 'server') {
                    server.on('connection', (socket) => {
                        socket.end('handled by child: ' + process.pid);
                    });
                }
            });
            ```

            执行 `node parent.js` 启动服务后，我们在终端多次执行 `curl http://127.0.0.1:1337/`，输出会在 parent 和各个 child 之间随机出现。

        +   父进程不处理请求，全部交给多个子进程处理

            parent.js

            ```js
            const child1 = require('child_process').fork('./child.js');
            const child2 = require('child_process').fork('./child.js');

            const server = require('net').createServer();

            server.listen(1337, () => {
                child1.send('server', server);
                child2.send('server', server);

                server.close();
            });
            ```

            child.js

            ```js
            const http = require('http');

            const server = http.createServer((req, res) => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('handled by child ' + process.pid);
            });

            process.on('message', (m, tcp) => {
                if (m === 'server') {
                    tcp.on('connection', (socket) => {
                        server.emit('connection', socket);
                    });
                }
            });
            ```

            执行 `node parent.js` 启动服务后，我们在终端多次执行 `curl http://127.0.0.1:1337/`，输出会在各个 child 之间随机出现。

## 进程间通信方式
+   无名管道( pipe )：管道是一种半双工的通信方式，数据只能单向流动，而且只能在具有亲缘关系的进程间使用。进程的亲缘关系通常是指父子进程关系。
+   高级管道(popen)：将另一个程序当做一个新的进程在当前程序进程中启动，则它算是当前程序的子进程，这种方式我们成为高级管道方式。
+   有名管道 (named pipe) ： 有名管道也是半双工的通信方式，但是它允许无亲缘关系进程间的通信。
+   消息队列( message queue ) ： 消息队列是由消息的链表，存放在内核中并由消息队列标识符标识。消息队列克服了信号传递信息少、管道只能承载无格式字节流以及缓冲区大小受限等缺点。
+   信号量( semophore ) ： 信号量是一个计数器，可以用来控制多个进程对共享资源的访问。它常作为一种锁机制，防止某进程正在访问共享资源时，其他进程也访问该资源。因此，主要作为进程间以及同一进程内不同线程之间的同步手段。
+   信号 ( sinal ) ： 信号是一种比较复杂的通信方式，用于通知接收进程某个事件已经发生。
+   共享内存( shared memory ) ：共享内存就是映射一段能被其他进程所访问的内存，这段共享内存由一个进程创建，但多个进程都可以访问。共享内存是最快的 IPC 方式，它是针对其他进程间通信方式运行效率低而专门设计的。它往往与其他通信机制，如信号两，配合使用，来实现进程间的同步和通信。
+   套接字( socket ) ： 套解口也是一种进程间通信机制，与其他通信机制不同的是，它可用于不同机器间的进程通信。

## 句柄传递的原理

+   句柄发送与还原

    初看来，父进程发送的句柄为对象，子进程接收的句柄也是对象，似乎对象被直接传递了而已。然而事实不是这样。

    目前子进程对象 `send()` 方法可以发送的句柄类型包括如下几种：

    +   net.Socket。TCP 套接字
    +   net.Server。TCP 服务器，任意建立在 TCP 服务上的应用层服务都可以享受到它带来的好处。
    +   net.Native。C++ 层面的 TCP 套接字或 IPC 管道。
    +   dgram.Socket。UDP 套接字。
    +   dgram.Native。C++ 层面的 UDP 套接字。

    `send()` 方法能发送消息和句柄不代表它能发送任意对象。

    句柄被发送时，会通过 `JSON.stringify()` 进行序列化。最终发送到 IPC 通道中的信息都是字符串。

    连接了 IPC 通道的子进程可以读取到父进程发来的消息，将字符串通过 `JSON.parse()` 解析还原为对象后，才出发 message 事件将消息体传递到应用层使用。

    以发送的 TCP 服务器句柄为例，子进程收到消息后的还原过程如下：

    ```js
    function(message, handle, emit) {
        const self = this;

        const server = new net.Server();
        server.listen(handle, () => {
            emit(server);
        });
    }
    ```

+   端口共同监听

    由于独立启动的进程互相之间并不知道文件描述符，所以监听相同端口会失败。

    但对于 `send()` 发送的句柄还原出来的服务而言，它们的文件描述符是相同的，所以监听相同端口不会引起异常。

    多个应用监听相同端口时，文件描述符同一时间只能被某个进程所用。也就是说，网络请求向服务器端发送时，只有一个幸运的进程能够抢到连接，这些进程服务是抢占式的。