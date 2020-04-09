function fileIs(f) {
  return /^\.|^_|^index\.|^Home\./.test(f)===false;
}
module.exports = fileIs;
