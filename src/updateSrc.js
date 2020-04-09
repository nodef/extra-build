const cpExec = require('./cpExec');
const pathSplit = require('./pathSplit');
const stripComments = require('strip-comments');
const fs = require('fs');

const OPTIONS = {
  config: true,
  format: 'es',
  input: 'src/index.js'
};


function updateSrc(dir, o) {
  var dir = dir||'index.js';
  var o = Object.assign({output: dir}, OPTIONS, o);
  console.log('updateSrc:', dir, o);
  if(o.config) cpExec(`.rollup -c`);
  else cpExec(`.rollup -f ${o.format} --file=${o.output} -- "${o.input}"`);
  var [dir, fil,] = pathSplit(dir);
  var dts1 = path.join(dir, fil+'.d.ts');
  if(fs.existsSync(dts1)) {
    var d = fs.readFileSync(dir, 'utf8');
    d = stripComments(d);
    fs.writeFileSync(dir, d);
  }
}
module.exports = updateSrc;
