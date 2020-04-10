const path = require('path');

const DIRBUILD = __dirname.endsWith('src')? path.dirname(__dirname) : __dirname;
module.exports = DIRBUILD;
