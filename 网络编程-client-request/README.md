# Client Reuest

## 简介

当调用 `http.request(options)` 时，会返回 ClientRequest 实例，主要用来创建 HTTP 客户端请求。

http 模块也有以下内容：

+   `http.Server`
+   `http.ServerResponse`
+   `http.IncomingMessage`

下面介绍一些简单的例子：

## 简单的 GET 请求

下面构造一个简单的 get 请求，访问 http://id.qq.com/，并在终端显示出来

```js
const http = require('http');

const option = {
    protocol: 'http:',
    hostname: 'id.qq.com',
    port: '80',
    path: '/',
    method: 'GET'
};

const client = http.request(option, (res) => {
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
```

也可以用便捷方法 `http.get(options)` 重写：

```js
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
```

## 简单的post请求

TODO...

## 参考

+   https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/http.client.md
