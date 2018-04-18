const child_process = require('child_process');

const argv = process.execArgv;

console.log('parent execArgv: ', argv);

const child = child_process.fork('./child', {
    execArgv: argv
});






