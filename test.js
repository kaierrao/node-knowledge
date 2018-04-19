const http = require('http');

const client = http.get('http://id.qq.com', (res) => {
    let data = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', (chunk) => {
        console.log(data);
    });
});

client.end();