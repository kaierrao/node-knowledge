# cluster

在之前的几个课程（[进程 - child_process](../进程-child_process)、[进程 - 多进程](../进程-多进程)）提到了很多子进程、多进程集群处理的细节，可以看出，这些处理是很麻烦的。

所以，Node 为我们提供了 cluster 模块，帮助我们快速建立集群环境、解决多核 CPU 的利用率问题，并处理进程的健壮性问题。

集群有以下两种常见的实现方案，而 node 自带的 cluster 模块，采用了方案二。

+   方案一：多个 node 实例+多个端口

    集群内的 node 实例，各自监听不同的端口，再由反向代理实现请求到多个端口的分发。

    优点：实现简单，各实例相对独立，这对服务稳定性有好处。

    缺点：增加端口占用，进程之间通信比较麻烦。

+   方案二：主进程向子进程转发请求

    集群内，创建一个主进程(master)，以及若干个子进程(worker)。由 master 监听客户端连接请求，并根据特定的策略，转发给 worker。

    优点：通常只占用一个端口，通信相对简单，转发策略更灵活。
    
    缺点：实现相对复杂，对主进程的稳定性要求较高。

## 入门

在 cluster 模块中，主进程称为 master，子进程称为 worker。

例子如下，创建与CPU数目相同的服务端实例，来处理客户端请求。注意，它们监听的都是同样的端口。

```js
// server.js
const cluster = require('cluster');
const cpuNums = require('os').cpus().length;
const http = require('http');

if (cluster.isMaster) {
  for (let i = 0; i < cpuNums; i++) {
    cluster.fork();
  }
} else {
  http.createServer((req, res) => {
    res.end(`response from worker ${process.pid}`);
  }).listen(3000);

  console.log(`Worker ${process.pid} started`);
}
```

创建批处理脚本：`./req.sh`。

```bash
#!/bin/bash

# req.sh
for((i=1;i<=4;i++)); do   
  curl http://127.0.0.1:3000
  echo ""
done 
```

输出如下。可以看到，响应来自不同的进程。

```
response from worker 23735
response from worker 23731
response from worker 23729
response from worker 23730
```

## cluster 模块实现原理

TODO...