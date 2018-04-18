const util = require('util');
const obj = {};

Object.defineProperty(obj, 'nick', {
    enumerable: false,
    value: 'lyy'
});

console.log(util.inspect(obj));

console.log(util.inspect(obj, {
    showHidden: true
}));