const jsonRead = require('./jsonRead');

const PACKAGE = jsonRead().name;
module.exports = PACKAGE;
