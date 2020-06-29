function wikiLink(nam, o) {
  return `https://github.com/${o.org}/${o.package_root}/wiki/${nam}`;
}
module.exports = wikiLink;
