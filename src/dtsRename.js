const fileRead = require('./fileRead')
const fileWrite = require('./fileWrite');
const jsonRead = require('./jsonRead');

const RMODULE = /^declare module ['"](.*?)['"] \{([\s\S]*)\}\s*$/;


function dtsRename(pth, o) {
  var d = fileRead(pth);
  var {name} = jsonRead(o.meta);
  d = d.replace(/export declare/g, 'export');
  d = d.replace(/export default /, 'export = ');
  var m = RMODULE.exec(d)||[];
  d = `declare module "${name}" {\n${m[2]||d}}\n`;
  fileWrite(pth, d);
}
module.exports = dtsRename;
