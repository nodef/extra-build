Common build tools for extra-* packages.

```bash
# Publish JSDoc on gh-pages branch.
$ ebuild jsdoc

# Update all documentation.
$ ebuild docs

# Update exports & generate main file, disable cleanup.
$ ebuild exports+main+exports --cleanup=false
```

```bash
$ ebash [command1+command2+...] [options]

# jsdoc:    publish JSDoc (gh-pages)
# exports:  generate exports file with declarations (src/index.ts)
# main:     generate main files (index.mjs, index.js, index.d.ts)
# metadata: update description, keywords (package.json)
# readme:   update header, table, and links (README.md)
# example:  generate example from README (example.js)
# wiki:     update header, syntax, and links for pages (wiki/)
# github:   update GitHub description, url, topics
# publish:  publish package and subpackages (pkg, @pkg/fn...) (TODO: GitHub)
# code:     same as exports+main
# docs:     same as metadata+readme+example+jsdoc+wiki+github
# all:      all commands above

# --cleanup: cleanup after build complete? (true)
# --org:     organization name (nodef)
```


## References

- Typedoc
- TypeScript
- Rollup
- DTS Bundle Generator
- Asciinema
