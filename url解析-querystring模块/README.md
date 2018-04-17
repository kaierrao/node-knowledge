# queryString

## 简介

```
const querystring = require('querystring);
```

querystring 模块提供了四个方法，但常用的主要是 2 个：

+   `querystring.parse()`: 对 url 查询参数（字符串）进行解析，并返回 json 格式
+   `querystring.stringify()`: `.parse()` 的反向操作

## 查询参数解析：querystring.parse(str[, sep[, eq[, options]]])

第四个参数几乎不会用到,直接不讨论. 第二个, 第三个其实也很少用到，但某些时候还是可以用一下。

直接看例子：

```
const querystring = require('querystring');
const str = 'nick=casper&age=24';
const obj = querystring.parse(str);
console.log(JSON.stringify(obj, null, 4));
```

输出如下：

```
{
    "nick": "casper",
    "age": "24"
}
```

再来看下 `sep`、`eq` 有什么作用。相当于可以替换 `&`、`=` 为自定义字符，对于下面的场景来说还是挺省事的。

```
const str1 = 'nick=casper&age=24&extra=name-chyingp|country-cn';
const obj1 = querystring.parse(str1);
const obj2 = querystring.parse(obj1.extra, '|', '-');
console.log(JSON.stringify(obj2, null, 4));
```

输出如下：

```
{
    "name": "chyingp",
    "country": "cn"
}
```

## 查询参数拼接：querystring.stringify(obj[, sep[, eq[, options]]])

相当于 parse 的逆向操作。直接看代码：

```javascript
const querystring = require('querystring');

const obj1 = {
    "nick": "casper",
    "age": "24"
};
const str1 = querystring.stringify(obj1);
console.log(str1);

const obj2 = {
    "name": "chyingp",
    "country": "cn"
};
const str2 = querystring.stringify(obj2, '|', '-');
console.log(str2);
```

输出如下：

```
nick=casper&age=24
name-chyingp|country-cn
```

## 参考

+   https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/querystring.md
+   [官方文档](https://nodejs.org/api/querystring.html)
