const path = require('path');

// Gets root directory.
const buildRoot = __dirname.endsWith('src')? path.dirname(__dirname) : __dirname;
module.exports = buildRoot;
