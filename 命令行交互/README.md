+   基本例子

    ```js
    /*
    * 功能: 在终端构建与用户交互效果，展示文件夹目录结构
    * 使用: node index
    *
    * method:  fs.readdir(), 读取目录， 返回 files 数组，内容为文件/文件夹的名字
    * method:  fs.stat(), 读取文件/文件夹状态
    * method:  stat.isDirectory()
    * method:  fs.readFile() 如果是文件，返回文件内容；如果是文件夹，返回的内容是 undefined
    * method:  process.stdout.write(string) 构建输入框
    * method:  process.stdin.resume() 等待用户输入
    * method:  process.stdin.setEncoding('utf8') 设置流编码为 utf8，以便支持特殊字符
    * method:  process.stdin.pause()
    * event:   process.stdin.on('data', callback) 响应用户输入后 enter 事件
    */

    var fs = require('fs');
    var stdin = process.stdin;
    var stdout = process.stdout;

    fs.readdir(process.cwd(), function(err, files) {

        console.log(''); // 美化交互效果，占用一个空行

        if (!files.length) {
            return console.log('    \033[31m No files to show!\033[39m\n');
        }

        console.log('    Select which file or directory you want to see\n');

        // 记录多个文件/文件夹的状态
        var stats = [];

        function file(i) {
            var filename = files[i];

            fs.stat(__dirname + '/' + filename, function (err, stat) {

                stats.push(stat);

                if (stat.isDirectory()) {
                    console.log('   ' + i + '   \033[36m' + filename + '/\033[39m');
                } else {
                    console.log('   ' + i + '   \033[90m' + filename + '\033[39m');
                }

                i++;

                if (i === files.length) {
                    read();
                } else {
                    file(i);
                }

            });
        }

        function read() {
            console.log('');
            stdout.write('   \033[33mEnter your choice: \033[39m');
            stdin.resume();
            stdin.setEncoding('utf8');

            stdin.on('data', option);
        }

        function option(data) {

            var currentIndex = Number(data);
            var filename = files[currentIndex];

            if (!filename) {
                stdout.write('   \033[31mEnter your choice: \033[39m');
            } else {
                stdin.pause();

                if (stats[currentIndex].isDirectory()) {
                    fs.readdir(__dirname + '/' + filename, function(err, files) {
                        console.log('')
                        console.log('   (' + files.length + ' files).');
                        files.forEach(function(file) {
                            console.log('   - ' + file);
                        });

                        console.log('');
                    });
                } else {
                    fs.readFile(__dirname + '/' + filename, 'utf8', function(err, data) {
                        console.log('');
                        console.log('\033[90m' + data.replace(/(.*)/g, '   $1') + '\033[39m');
                    });
                }

            }
        }

        file(0);
    });
    ```

+   基于 Telnet 的聊天室

    ```js
    /*
    * 建立一个 Telnet 的聊天室
    * 知识点:
    *  1. 终端 Telnet 输入的任何信息都会立刻发送到服务器，按回车键是为了输入 \n 字符，在 Node 服务器，通过 \n 来判断消息是否已经完全到达
    *  2. net.createServer(callback) 每当客户端连接时会触发回调函数执行
    *  3. conn.setEncoding('utf8') 设置接收到客户端发送的信息为 utf8 而不是默认的 buffer
    *  4. conn.write('message') 服务器向客户端推送消息
    *
    * 使用：
    *  1. 服务器: node index.js
    *  2. 客户端: telnet 127.0.0.1 3000
    */

    var net = require('net');

    var count = 0;
    var users = {};

    // 客户端连接时会触发回调
    var server = net.createServer(function(conn) {

        // onData 中的 Data 会是 utf8 而不是 buffer 格式
        conn.setEncoding('utf8');

        var nickname;

        console.log('\033[90m   new connection!\033[39m');

        // 向客户端推送消息
        conn.write(
            '\n > welcome to \033[92mnode-chat\033[39m'
            + '\n > ' + count + ' other people are connected at this time.'
            + '\n > please write your name and press enter: '
        );

        count++;

        function broadcast(msg, exceptMyself) {
            for (var i in users) {
                if (!exceptMyself || i !== nickname) {
                    users[i].write(msg);
                }
            }
        }

        conn.on('close', function () {
            count--;
            delete users[nickname];
            broadcast('\033[96m > ' + nickname + ' leave \033[39m \n', true);
        });

        // 客户端输入字符后 enter，会向服务器发送数据包，触发回调函数
        conn.on('data', function (data) {

            // 用户在终端 enter 会带入回车字符
            data = data.replace('\r\n', '');

            if (!nickname) {
                if (users[data]) {
                    conn.write('\033]93m> nickname already in use. try again:\033[39m ');
                    return;
                } else {
                    nickname = data;
                    users[nickname] = conn;

                    for (var i in users) {
                        users[i].write('\033[90m > ' + nickname + ' joined the room\033[39m\n');
                    }
                }
                // 否则视为聊天消息
            } else {
                broadcast('\033[96m > ' + nickname + ':\033[39m ' + data + '\n', true);
            }

        });
    });

    server.listen(3000, function () {
        console.log('\033[96m   server listening on *:3000!\033[39m');
    });
    ```