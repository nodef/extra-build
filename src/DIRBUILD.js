const path = require('path');

// TODO
const DIRBUILD = __dirname.endsWith('src')? path.dirname(__dirname) : __dirname;
module.exports = DIRBUILD;
