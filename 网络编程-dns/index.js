const dns = require('dns');

dns.resolve4('www.qq.com', (err, address, family) => {
    if (err) {
        throw err;
    }
    console.log(address);
});