const DIRBUILD = require('./DIRBUILD');
const path = require('path');

const FILECI = path.join(DIRBUILD, 'data', 'travis.yml.txt');
module.exports = FILECI;
