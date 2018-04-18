const http = require('http');

http.get('http://127.0.0.1:3000?nick=chyingp&hello=world', (res) => {
    // console.log(res.httpVersion);
    // console.log(res.statusCode);
    // console.log(res.statusMessage);

    res.pipe(process.stdout);
});