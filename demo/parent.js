const child1 = require('child_process').fork('./child.js');
const child2 = require('child_process').fork('./child.js');

const server = require('net').createServer();

server.listen(1337, () => {
    child1.send('server', server);
    child2.send('server', server);

    server.close();
});
