const jsonRead = require('./jsonRead');

/**
 * Current package name.
 */
const PACKAGE = jsonRead().name;
module.exports = PACKAGE;
