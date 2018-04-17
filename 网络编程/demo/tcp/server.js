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
