const cpExec = require('./cpExec');
const pathSplit = require('./pathSplit');
const jsDecomment = require('./jsDecomment');
const fs = require('fs');

const OPTIONS = {
  config: true,
  format: 'es',
  input: 'src/index.js'
};


function updateMain(pth, o) {
  var pth = pth||'index.js';
  var o = Object.assign({output: pth}, OPTIONS, o);
  console.log('updateMain:', pth, o);
  if(o.config) cpExec(`.rollup -c`);
  else cpExec(`.rollup -f ${o.format} --file=${o.output} -- "${o.input}"`);
  var [dir, fil,] = pathSplit(pth);
  var dts1 = path.join(dir, fil+'.d.ts');
  if(fs.existsSync(dts1)) {
    var d = fs.readFileSync(pth, 'utf8');
    d = jsDecomment(d);
    fs.writeFileSync(pth, d);
  }
}
module.exports = updateMain;
