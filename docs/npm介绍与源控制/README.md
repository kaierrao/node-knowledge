# npm

## 简介

NPM（node package manager），通常称为node包管理器。顾名思义，它的主要功能就是管理node包，包括：安装、卸载、更新、查看、搜索、发布等。

npm官网：https://npmjs.org/

npm官方文档：https://npmjs.org/doc/README.html

安装好 Node 之后，同时会安装好 npm，并生成一个全局命令：`npm`

## 查看 npm 版本

```bash
npm -v
```

## 初始化项目

npm 初始化过的目录会生成一个文件：`package.json`，用来管理项目的各种依赖。

```bash
npm init
```

## package.json

package.json 位于模块的目录下，用于定义包的属性。

package.json 属性说明：

+   `name`: 包名。
+   `version`: 包的版本号。
+   `description`: 包的描述。
+   `homepage`: 包的官网 url 。
+   `author`: 包的作者姓名。 
+   `contributors`: 包的其他贡献者姓名。
+   `dependencies`: 依赖包列表。如果依赖包没有安装，npm 会自动将依赖包安装在 node_module 目录下。
+   `repository`: 包代码存放的地方的类型，可以是 git 或 svn，git 可在 Github 上。
+   `main`: main 字段指定了程序的主入口文件，require('moduleName') 就会加载这个文件。这个字段的默认值是模块根目录下面的 index.js。
+   `keywords`: 关键字

## 全局安装与本地安装

npm 的包安装分为本地安装（local）、全局安装（global）两种，从敲的命令行来看，差别只是有没有 `-g` 而已，比如

```
npm install express      # 本地安装
npm install express -g   # 全局安装
```

+   本地安装
    +   将安装包放在 `./node_modules` 下（运行 npm 命令时所在的目录），如果没有 node_modules 目录，会在当前执行 npm 命令的目录下生成 node_modules 目录。
    +   可以通过 `require()` 来引入本地安装的包

+   全局安装
    +   将安装包放在 `/usr/local` 下或者你 node 的安装目录
    +   可以直接在命令行里使用


提示：`npm i`

该命令没有包的名称。

该命令会读取 `package.json` 中的 `dependencies` 和 `devDependencies` 字段，并安装该字段内的所有依赖到当前目录

## 全局卸载与本地卸载

npm 的包卸载分为本地卸载（local）、全局卸载（global）两种，从敲的命令行来看，差别只是有没有 `-g` 而已，比如

```
npm uninstall express      # 本地卸载
npm uninstall express -g   # 全局卸载
```

## 更新模块

```
npm update express
```

## 查看安装信息

```bash
npm list -g
```

结果如下：

```
├─┬ cnpm@4.3.2
│ ├── auto-correct@1.0.0
│ ├── bagpipe@0.3.5
│ ├── colors@1.1.2
│ ├─┬ commander@2.9.0
│ │ └── graceful-readlink@1.0.1
│ ├─┬ cross-spawn@0.2.9
│ │ └── lru-cache@2.7.3
```

如果要查看某个模块的版本号，可以使用命令如下：

```
npm list grunt
```

输出如下：

```
projectName@projectVersion /path/to/project/folder
└── grunt@0.4.1
```

## 发布 npm 包

有些时候当开发者在本地开发好一个模块，想同步到社区，可以发布 npm 包，命令是：

```bash
npm publish
```

部分情况下可能需要联系源管理员添加发布权限。

## npm scripts

package.json 中有个字段 `scripts`，用于开发者自定义脚本，比如：

```js
"scripts": {
    "dev": "node index.js"
}
```

执行 `npm run <script>`，可以执行 shell 命令，比如上面的：`npm run dev`

另外，scripts 内部可以临时使用 node_modules 中的命令行安装包，比如通过 `npm i webpack-cli` 安装了 webpack 命令行，那么就可以在 scripts 中使用 webpack 命令了。

```js
"scripts": {
    "build": "webpack index.js"
}
```

`npm run build` 命令会执行 `webpack index.js`。

## 管理 npm 源

npm 默认使用官方源：https://registry.npmjs.org/

npm 通过该源下载各种依赖包。

npm 源可以重新设定，以满足日常需要。

设置方式：`npm set registry <registry>`，比如设置为淘宝源：`npm set registry https://registry.npm.taobao.org`

但这种方式不是很方便。日常使用中，我们使用 nrm 管理 npm 源：

```
npm install nrm -g
```

几条常用命令：

```
nrm ls    //查看可选的源列表:
     npm ---- https://registry.npmjs.org/
     cnpm --- http://r.cnpmjs.org/
   * taobao - https://registry.npm.taobao.org/
```

```
nrm use taobao    //切换源(前面*号表示正在使用的源)
```

```
nrm add     //添加源
```

```
nrm del     //删除源
```

## 参考

+   npm 介绍：http://www.runoob.com/nodejs/nodejs-npm.html
+   npm scripts 使用：http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html