# 搭建 Node.js 开发环境与版本控制

## 安装 Node.js

有两种方案安装 Node.js

+   直接从官网安装

    打开 https://nodejs.org/en/ 并下载 LTS（Long Time Support）版本

    这样会在本机生成唯一版本的 Node。用命令 `node -v` 可以查看 Node 版本。

+   通过 nvm 对 node 做版本管理

    nvm: https://github.com/creationix/nvm

    nvm 的全称是 **Node Version Manager**，使用这个工具的原因是可能由于各种各样的原因，项目所能兼容的 Node 版本不一致，同时 Node 各个版本自身可能有一些特性变化，需要开发者切换各种版本。

    +   安装 nvm

        ```bash
        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.2/install.sh | bash
        ```

        安装完成后，可以使用下面的命令确认 nvm 是否安装成功

        ```bash
        nvm
        ```

        有输出，则安装成功

    +   用 nvm 安装 Node.js

        使用 nvm 安装 Node.js 最新版（截至 2018/04/17，最新的 LTS 版本为 8.11.1）

        ```bash
        nvm install 8.11.1
        ```

    +   使用某个 Node 版本

        通过下面的命令可以查看已安装的所有 Node 的版本

        ```bash
        nvm ls
        ```

        然后使用某个版本

        ```bash
        nvm use 8.11.1
        ```

        然后查看当前 Node 的版本

        ```bash
        node -v
        ```

    +   解决一个小问题

        使用 nvm 时，有时会出现，当前开启一个新的 shell 窗口时，找不到 node 命令的情况。

        这种情况一般有两个原因：

        +   shell 不知道 nvm 的存在

            解决方案是：

            检查 `~/.profile` 或者 `~/.bash_profile` 中有没有这样两句

            ```bash
            export NVM_DIR="/Users/YOURUSERNAME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
            ```

            没有的话就加进去，这两句会在 bash 启动的时候被调用，然后注册 nvm 命令。

        +   nvm 已经存在，但是没有 default 的 Node.js 版本可用

            解决方案就是设置 default 的 Node 版本。

            查看当前安装的 Node 版本列表：

            ```bash
            nvm ls
            ```

            查看是否有 default 的指示，如果没有，则设置一个

            ```bash
            nvm alias default 8.11.1
            ```

            再

            ```bash
            nvm ls
            ```

            试试看。

## Hello world

很简单，新建一个项目目录，创建 index.js 文件，里面只写一行代码：

```javascript
console.log('Hello World!');
```

然后打开终端进入当前项目目录，执行命令：

```bash
node index
```

此时终端就会打印字符串并退出 Node 程序：

```bash
Hello World!
```

启动 Node 项目就是通过下面的方式：

```bash
node 入口文件
```

其中，node 会为入口文件自动加上 `.js` 后缀。