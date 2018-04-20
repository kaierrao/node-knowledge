# benchmark

benchmark 用来测试 js 代码的运行性能

[benchmark github](https://github.com/bestiejs/benchmark.js)

安装官方文档执行即可

当然，也可以按照以下步骤实现一个 demo

+   `mkdir benchmark-test`
+   `npm init`
+   `npm i underscore benchmark microtime -S`
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
    .on('complete', () => {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({ 'async': true });
    
    // logs:
    // => RegExp#test x 4,161,532 +-0.99% (59 cycles)
    // => String#indexOf x 6,139,623 +-1.00% (131 cycles)
    // => Fastest is String#indexOf
    ```

    然后执行：

    ```
    node index
    ```
    