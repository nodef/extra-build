const initCi = require('./initCi');
const initGitignore = require('./initGitignore');
const initNpmignore = require('./initNpmignore');
const initWiki = require('./initWiki');


function init(o={}) {
  console.log('init:', o);
  initCi(o);
  initGitignore(o);
  initNpmignore(o);
  initWiki(o);
}
module.exports = init;
