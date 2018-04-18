const http = require('http');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write('hello');

    setTimeout(() => {
        res.write(' world!');
        res.end();
    }, 2000);
});

server.listen(3000);
