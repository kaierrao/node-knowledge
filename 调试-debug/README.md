# 调试 - debug

## 简述

node 断点调试，目前主要由三种方式：

+   node 内置调试工具
+   IDE debug：vscode、webstorm 等
+   node-inspector

三者本质上差不多，更多区别在用户体验。

## node 内置调试工具

测试脚本 `index.js` 代码如下：

```js
function foo() {
    const c = 3;
    return c;
}

const a = 1;
console.log(a);

const b = 2;
console.log(b);

foo();
console.log('done');
```

+   进入调试模式：`node debug index.js`

    +   在第一行断点：默认就是第一行
    +   在第三行断点
        +   方式一：通过 debugger。在命令行交互中输入：`cont` 跳到第一个 debugger 断点
        +   方式二：通过 `sb(lineNumber)`。如：`sb(3)`
    +   执行下一步：通过 `next` 命令
    +   调到下一个断点：`cont`
    +   查看某个变量的值：输入 `repl`，然后输入变量名，就可以看到变量的值，然后按 `ctrl + c` 退出

    其他 TODO...

## 通过 IDE 调试

+   vscode
    
    首先，在 vscode 里打开项目

    

    然后，添加调试配置。主要需要修改的是可执行文件的路径。

    ![](https://camo.githubusercontent.com/ba148a860d0e2e344e284210850de4f013f42f45/68747470733a2f2f7365676d656e746661756c742e636f6d2f696d672f6256434e466d)

    点击代码左侧添加断点

    ![](https://camo.githubusercontent.com/4163c78a1300e30f51062250d8631353e4e701c7/68747470733a2f2f7365676d656e746661756c742e636f6d2f696d672f6256434e4670)

    开始调试

    ![](https://camo.githubusercontent.com/4fb98f38e38919dfcdccc413ed2ad6f0ee15c4ea/68747470733a2f2f7365676d656e746661756c742e636f6d2f696d672f6256434e4672)

    顺利断点，左侧的变量、监视对象，右侧的调试工具栏，用过chrome dev tool的同学应该很熟悉，不赘述。

    ![](https://camo.githubusercontent.com/a83555cda12d1e15ba0f836a042f62e172b94dfe/68747470733a2f2f7365676d656e746661756c742e636f6d2f696d672f6256434e4673)


## node-inspector

TODO...