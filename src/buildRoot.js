const path = require('path');

const buildRoot = __dirname.endsWith('src')? path.dirname(__dirname) : __dirname;
module.exports = buildRoot;
