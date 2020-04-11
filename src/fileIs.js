function fileIs(f) {
  if(f.endsWith('.md')) return /^\.|^_|^Home\./.test(f)===false;
  else return /^\.|^_|^index\./.test(f)===false;
}
module.exports = fileIs;
