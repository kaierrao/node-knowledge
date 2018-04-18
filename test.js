process.argv.forEach((val, index, array) => {
    console.log('process.argv: ' + index + ': ' + val);
});

process.execArgv.forEach((val, index, array) => {
    console.log('process.execArgv: ' + index + ': ' + val);
});