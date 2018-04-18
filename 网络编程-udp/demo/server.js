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
