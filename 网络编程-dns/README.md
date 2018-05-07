# 域名解析 dns

## 解析方式一：dns.lookup()

举例：查询 www.qq.com 的域名，可以使用 `dns.lookup()`

```javascript
const dns = require('dns');

dns.lookup('www.qq.com', (err, address, family) => {
    if (err) {
        throw err;
    }

    console.log('www.qq.com 的 ip 为：', address);
});
```

输出为：

```
www.qq.com 的 ip 为： 140.206.160.207
```

如果想查询该域名对应的多个 ip，可以加上一个配置项

```javascript
const dns = require('dns');

dns.lookup('www.qq.com', { all: true }, (err, address, family) => {
    if (err) {
        throw err;
    }

    console.log('www.qq.com 的 ip 为：', address);
});
```

输出为：

```
www.qq.com 的 ip 为： [ { address: '140.206.160.207', family: 4 } ]
```


## 解析方式二：dns.resolve4()

上面的例子也可以用 `dns.resolve4()` 实现

```javascript
const dns = require('dns');

dns.resolve4('www.qq.com', (err, address, family) => {
    if (err) {
        throw err;
    }
    console.log(address);
});
```

输出为：

```
[ '140.206.160.207' ]
```

## dns.lookup() 和 dns.resolve4() 的区别

从上面的例子来看，两个方法都可以查询域名的 ip 列表。那么，它们的区别在什么地方呢？

可能最大的差异就在于，当配置了本地 Host 时，是否会对查询结果产生影响。

+   dns.lookup()：有影响。
+   dns.resolve4()：没有影响。

举例，在 hosts 文件里配置了如下规则。

```
127.0.0.1 www.qq.com
```

运行如下对比示例子，就可以看到区别。

```javascript
const dns = require('dns');

dns.lookup('www.qq.com', function(err, address, family){
    if (err) {
        throw err;
    }
    console.log('配置host后，dns.lookup =>' + address);
});

dns.resolve4('www.qq.com', function(err, address, family){
    if (err) {
        throw err;
    }
    console.log('配置host后，dns.resolve4 =>' + address);
});
```

输出如下

```
配置host后，dns.resolve4 => 140.206.160.207
配置host后，dns.lookup => 127.0.0.1
```

## 参考

+   官方文档：https://nodejs.org/api/dns.html#dns_dns_resolve4_hostname_callback
+   https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/dns.md