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