const jsdocParse = require('./jsdocParse');


// Reads JSDocs in js file.
function jsJsdocs(js) {
  var a = new Map();
  var rjsdoc = /(\/\*\*.*?\*\/).*?(function\*?|const|var|let)\s+([\w$]+)([^\{]*)/gs, m = null;
  while((m=rjsdoc.exec(js))!=null) {
    var [, com,, name, def] = m;
    a.set(name, jsdocParse(com, def||''));
  }
  return a;
}
module.exports = jsJsdocs;
