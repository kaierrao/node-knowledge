# node 的模块机制

## CommonJS 规范

http://javascript.ruanyifeng.com/nodejs/module.html

## 其他

由于存在缓存机制，在程序中两次 `require(xx)` 的结果是一样的，即使第二次 require 之前模块的内容发生了变化，结果也和第一次一致。如果需要临时清除该模块的缓存，可以使用：

```
delete require.cache('xx');
```
