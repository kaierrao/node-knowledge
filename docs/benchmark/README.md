# benchmark

benchmark 用来测试 js 代码的运行性能

[benchmark github](https://github.com/bestiejs/benchmark.js)

安装官方文档执行即可

当然，也可以按照以下步骤实现一个 demo

+   `mkdir benchmark-test`
+   `npm init`
+   `npm i benchmark microtime -S`
+   新增 `index.js`

    ```js
    const Benchmark = require('benchmark');

    const suite = new Benchmark.Suite;

    // add tests
    suite.add('RegExp#test', () => {
        /o/.test('Hello World!');
    })
        .add('String#indexOf', () => {
            'Hello World!'.indexOf('o') > -1;
        })
        // add listeners
        .on('cycle', (event) => {
            console.log(String(event.target));
        })
        .on('complete', function() {
            console.log('Fastest is ' + this.filter('fastest').map('name'));
        })
        // run async
        .run({ 'async': true });
    ```

    然后执行：

    ```bash
    node index
    ```

    输出为：

    ```bash
    RegExp#test x 27,577,443 ops/sec ±1.19% (87 runs sampled)
    String#indexOf x 837,347,809 ops/sec ±0.51% (90 runs sampled)
    Fastest is String#indexOf
    ```
