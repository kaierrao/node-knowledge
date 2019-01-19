const http = require('http');

const server = http.createServer((req, res) => {
    res.end('您访问的地址是：' + req.url);
});

server.listen(3000);