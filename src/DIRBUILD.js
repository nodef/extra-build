const path = require('path');

// Gets root directory.
const DIRBUILD = __dirname.endsWith('src')? path.dirname(__dirname) : __dirname;
module.exports = DIRBUILD;
