# 子进程 child_process

在 node 模块中，child_process 非常重要，掌握了它，等于在 node 的世界打开了一扇大门。

举个例子：

```js
const spawn = require('child_process').spawn;
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
```

## 几种创建子进程的方式

+   异步：`.exec()`、`.execFile()`、`.fork()`。它们都有各自的同步版本。
+   同步：`.execSync()`、`execFileSync()`、`.forkSync()`

注意：

+   上述方法内部都是通过 `.spawn()` 实现的
+   `.exec()`、`.execSync()` 额外提供了回调，当子进程停止的时候执行

## child_process.exec(command[, options][, callback])

创建一个 shell，然后在 shell 里执行命令。执行完成后，将 stdout、stderr 作为参数传入回调函数。

+   举例

    ```js
    const exec = require('child_process').exec;

    exec('ls -al', (error, stdout, stderr) => {
        if (error) {
            console.error('error: ', error);
            return;
        }

        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);
    });

    exec('ls hello.txt', (error, stdout, stderr) => {
        if (error) {
            console.error('error: ', error);
            return;
        }

        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);
    });
    ```

+   `options` 参数说明：

    +   cwd：当前工作路径。
    +   env：环境变量。
    +   encoding：编码，默认是 utf8。
    +   shell：用来执行命令的 shell，unix 上默认是 `/bin/sh`，windows 上默认是 `cmd.exe`。
    +   timeout：默认是 0。
    +   killSignal：默认是 SIGTERM。
    +   uid：执行进程的 uid。
    +   gid：执行进程的 gid。
    +   maxBuffer： 标准输出、错误输出最大允许的数据量（单位为字节），如果超出的话，子进程就会被杀死。默认是200*1024（就是200k啦）

    备注：

    如果 timeout 大于0，那么，当子进程运行超过 timeout 毫秒，那么，就会给进程发送 killSignal 指定的信号（比如 SIGTERM）。
    如果运行没有出错，那么 error 为 null。如果运行出错，那么，error.code 就是退出代码（exist code），error.signal 会被设置成终止进程的信号。（比如 CTRL+C 时发送的 SIGINT）

+   风险项

    传入的命令，如果是用户输入的，可能有类似 sql 注入的风险。

    ```js
    exec('ls hello.txt; rm -rf *', (error, stdout, stderr) => {
        if (error) {
            console.error('error: ' + error);
            // return;
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });
    ```

## child_process.execFile(file[, args][, options][, callback])

和 `.exec()` 相似，不同点在于没有创建一个新的 shell。至少有两点影响：

+   比 `child_process.exec()` 效率高一些。（实际待测试）
+   一些操作，比如I/O重定向，文件glob等不支持。

`file` 为可执行文件的名字或路径。

```js
const child_process = require('child_process');

child_process.execFile('node', ['--version'], function (error, stdout, stderr) {
    if (error) {
        throw error;
    }
    console.log(stdout);
});

child_process.execFile('/Users/lyy/.nvm/versions/node/v8.9.1/bin/node', ['--version'], function (error, stdout, stderr) {
    if (error) {
        throw error;
    }
    console.log(stdout);
});
```

## child_process.fork(modulePath[, args][, options])

+   参数介绍
    +   `modulePath` 子进程运行的模块
    +   `options`
        +   `execPath`： 用来创建子进程的可执行文件，默认是 /usr/local/bin/node。也就是说，你可通过 execPath 来指定具体的 node 可执行文件路径。（比如多个 node 版本）
        +   `execArgv`： 传给可执行文件的字符串参数列表。默认是 process.execArgv，跟父进程保持一致。
        +   `silent`： 默认是 false，即子进程的 stdio 从父进程继承。如果是 true，则直接 pipe 向子进程的 child.stdin、child.stdout 等。
        +   `stdio`： 如果声明了 stdio，则会覆盖 silent 选项的设置。

+   关于 `silent`：

    parent.js

    ```js
    const child_process = require('child_process');

    // silent 为 false 的话（默认），子进程的 stdout 等从父进程继承
    const child1 = child_process.fork('./child', {
        silent: false // 默认
    });

    // silent 为 true 的话，子进程的 stdout pipe 向父进程
    const child2 = child_process.fork('./child', {
        silent: true
    });

    child2.stdout.setEncoding('utf8');
    child2.stdout.on('data', function (data) {
        console.log(data);
    });
    ```

    child.js

    ```js
    console.log('child console.log');
    ```

+   关于 ipc

    parent.js

    ```js
    const child_process = require('child_process');

    const child = child_process.fork('./child');

    child.on('message', (m) => {
        console.log('message from child: ', m);
    });

    child.send({
        from: 'parent'
    });
    ```

    child.js

    ```js
    process.on('message', (m) => {
        console.log('message from parent: ', m);
    });

    process.send({
        from: 'child'
    });
    ```

    运行 `node parent` 结果：

    ```
    message from parent:  { from: 'parent' }
    message from child:  { from: 'child' }
    ```

+   execArgv

    设置 execArgv 的目的一般是让子进程和父进程保持相同的环境。

    比如，父进程指定了 `--harmony`，那么可以通过 execArgv 的方式让子进程继承这个指定。

    parent.js

    ```js
    const child_process = require('child_process');

    const argv = process.execArgv;

    console.log('parent execArgv: ', argv);

    const child = child_process.fork('./child', {
        execArgv: argv
    });
    ```

    child.js

    ```js
    console.log('child execArgv: ', process.execArgv);
    ```

    运行 `node --harmony parent` 结果：

    ```
    parent execArgv: --harmony
    child execArgv:  [ '--harmony' ]
    ```
