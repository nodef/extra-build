const fileRead = require('')

function dtsRename() {
  var d = fileRead(o.outDts);
  d = d.replace(/export declare/g, 'export');
  d = `declare module '${o.moduleName}' {\n${d}}\n`;
  fileWrite(o.outDts, d);
}
