const fs = require('fs');
const content = 'hello world';

const filepath = './sample.txt';

const writeStream = fs.createWriteStream(filepath);

writeStream.write(content);

writeStream.end();