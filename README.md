Common build tools for extra-* packages.

```bash
$ ebuild [commands] [options]
# Commands, Options in Index
```

```bash
# Publish JSDoc on gh-pages branch.
$ ebuild jsdoc

# Update all documentation.
$ ebuild docs

# Update exports & generate main file, disable cleanup.
$ ebuild exports+main+exports --cleanup=false
```

<br>
<br>


## Index

| Name      | Action                                           |
| --------- | ------------------------------------------------ |
| [jsdoc]   | Publish JSDoc on gh-pages branch.                |
| [export]  | Generate export file with declarations.          |
| [main]    | Generate main javascript file.                   |
| [meta]    | Update description, keywords in package.json.    |
| [readme]  | Update header, index, and links in README.       |
| [example] | Generate example.js from README.                 |
| [wiki]    | Update Wiki from code.                           |
| [github]  | Update GitHub repo description, url, topics.     |
| [publish] | Publish package to NPM.                          |
| **code**  | Same as 'export+main'.                           |
| **docs**  | Same as 'meta+readme+example+jsdoc+wiki+github'. |
| **all**   | All commands above.                              |

<br>
<br>

[![](https://img.youtube.com/vi/BCxhQpS5fQ0/maxresdefault.jpg)](https://www.youtube.com/watch?v=6mMK6iSZsAs)

[jsdoc]: https://github.com/nodef/extra-build/wiki/jsdoc
[export]: https://github.com/nodef/extra-build/wiki/export
[main]: https://github.com/nodef/extra-build/wiki/main
[meta]: https://github.com/nodef/extra-build/wiki/meta
[readme]: https://github.com/nodef/extra-build/wiki/readme
[example]: https://github.com/nodef/extra-build/wiki/example
[wiki]: https://github.com/nodef/extra-build/wiki/wiki
[github]: https://github.com/nodef/extra-build/wiki/github
[publish]: https://github.com/nodef/extra-build/wiki/publish
