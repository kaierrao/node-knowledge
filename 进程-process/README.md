# Process

process 是 node 中非常重要的一个模块，它是一个全局模块，可以在代码中直接使用。

可以通过它来获取 node 进程相关的信息，比如获取命令行的参数。或设置进程相关的信息，比如设置环境变量。

## process.env

我们经常需要判断 node 服务运行的环境，如下所示：

```js
if (process.env.NODE_ENV === 'production') {
    console.log('生产环境');
} else {
    console.log('非生产环境');
}
```

启动方式是：

```
NODE_ENV=production node index.js
```

输出为：

```
生产环境
```

## 异步 process.nextTick(callback)

使用频率很高，通常用在异步的场景，举例：

```js
console.log(1);
process.nextTick(() => {
    console.log(3);
});
console.log(2);
```

输出如下：

```
1
2
3
```

`process.nextTick(callback)` 和 `setTimeout(callback, 0)` 很像，但实际有实现及性能上的差异，我们先记住几个点：

+   `process.nextTick(callback)` 将 callback 放到 node 事件循环的 下一个 tick 里
+   `process.nextTick(callback)` 比 `setTimetout(callback, 0)` 性能高

详细资料，可以了解：https://cnodejs.org/topic/4f16442ccae1f4aa2700109b

## 获取命令行参数