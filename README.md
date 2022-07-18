Common build tools for extra-* packages.<br>
📦 [NPM](https://www.npmjs.com/package/extra-build),
📜 [Files](https://unpkg.com/extra-build/),
📰 [Docs](https://nodef.github.io/extra-build/).

**Why** do packages need to be **built**? For [TypeScript]-based source
libraries (such as this) our main priority is to **generate JavaScript file(s)**
which can be imported from the runtime ([Node.js]), and **publish** them to a
**package registry** such as [NPM]. In addition we might like to generate
associated [type declarations] (`.d.ts` file), which is one of the reasons
behind choosing to write in TypeScript. We might also like to **bundle** all
scripts (and type declarations) into a single file to help reduce package size,
dependencies, or eliminate unused code.

**Documentation** plays a key role in reducing the amount of time spent on
[Stack Overflow], and thus must be maintained at all costs. Instead of manually
updating it, most developers choose to **generate** this from **documentation**
**comments** in the code. An `Index` can be added to the `README` file that
**links to documention**. Thus we have a new build step. In addition, we might
like to **update package metadata** (in `package.json` or *GitHub repo*), build
source files for **another platform** (such as the *web*), **update package**
**version** automatically, **generate wiki files** (for code examples), or
**publish** to [GitHub packages].

This package provides utility functions for all of these operations, and more.
The previous version of this package provided a [CLI] for all of these
operations, but was inflexible in its design (it could only be used when the
source code was arranged is a very specific way). This redesigned version
provides a **JavaScipt API** instead that allows for **significant**
**customization**, in addition to providing a number of helper functions commonly
used in build steps. Build steps can be written in a script file, say
`build.js`, and executed on a *CI system* such as [GitHub Actions] using
`.github/workflows/*.yml`.

Standalone **symbol name** of a package, such as `@package/submodule`, can be
obtained with [symbolname] (i.e., `package_submodule`). This is necessary when
*webifying* (making it accessible with a `script` tag) a package. **Keyword**
**name** for an identifier can be procured with [keywordname], which can then be
used to set the *keywords of a package* in the *metadata file* `package.json`.

**Logging** of *error*, *warning*, *log*, and *info* messages with *colors* is
provided with [error], [warn], [log], and [info] respectively. A *shell command*
can be executed (displaying the command and its output) with [exec]. The
*output* of a command can be obtained as a `string` with [execStr].
Reading/writing of *text/JSON* files is possible with convenience methods
[readFileText], [writeFileText], [readJson], and [writeJson]. To save the
*status* and *contents* of a file (*without* having to do any *existence check*)
is possible with [readDocument] and [writeDocument]. They are useful when it is
required to update a file *temporarily* and *restore* it later (if it exists, or
remove if it did not exist).

Helper `git` commands for *commit+push*, and setting up a *new branch* and
*pushing* *to remote* (for `gh-pages`) is available as [gitCommitPush] and
[gitSetupBranch]. A JavaScript file can be *bundled* (to a single file) with
[bundleScript], and *webified* (for access on the web) with [webifyScript]. A
*banner* can be added to the generated script with [addBanner]. To parse a
*GitHub URL* (for example from the `repository.url` field in `package.json`)
[parseGithubUrl] can be used. *GitHub repository* *details* can be updated (by
default from `package.json`) with [updateGithubRepoDetails].

The *metadata file* of a package (`package.json`) can be read/written with
[readMetadata] and [writeMetadata] respectively. The *current registry* being
used for publishing to *NPM* (in `.npmrc` file) can be obtained with [registry],
and modified with [setRegistry]. The *latest version* of a package can be
obtained with [latestVersion], and the *next unpublished version* (based on the
latest package version, and the `version` mentioned in `package.json`) can be
obtained with [nextUnpublishedVersion].

**JsDoc** for a package can be *generated* with [generateDocs], and published
with [publishDocs]. **Reflection information** of *docs* can be obtained from
the *source file* (through `typedoc`) with [loadDocs]. This can then used to
obtain detailed information on *exported* *symbols* using [docsName],
[docsLocation], [docsFlags], [docsKind], [docsChildCount], [docsParameterCount],
[docsSignatureCount], [docsType], [docsDescription], and [docsReturns]. For
*reference symbols*, the *referred to* *symbol* (which has all the type
information) can be obtained with [docsRefer]. *Simplified details* of a
*reflection (symbol)* can be obtained with [docsDetails] and [docsReferDetails]
(get details of *referred to symbol*).

*Reference code block* for `wiki` can be generated with [wikiCodeReference],
*example code block* can be generated with [wikiCodeExample], and *full*
*markdown text* can be generated with [wikiMarkdown]. The *"Index"* table of
`wiki` or `README.md` can be updated (using *simplified details of exported*
*symbols*) with [wikiUpdateIndex], and *link references* (named links in
markdown) can be updated with [wikiUpdateLinkReferences]. Finally a package can
be published to *NPM* with [publish], and to *GitHub* with [publishGithub].

Behind the dial, these are the gears that make this package tick. TypeScript is
compiled with [tsc], bundled with [rollup], webified with [browserify] and
[terser]. Documentation is generated with [typedoc], which is also used to
obtain `DocsDetails` in order to update index table in `README` using
[extra-markdown-text], generate wiki files, and update package metadata locally
and on *GitHub* repo using [@octokit/rest]. Updating of package versions is
achieved with [npm view] and [semver]. To spice up the console with colors,
[kleur] is used.

The **goals** for the future include generating example file for [RunKit],
linking wiki from JsDoc, and duplicating example code from wiki to JsDoc. Did
you find a bug? Or have a feature request?

> Stability: [Experimental](https://www.youtube.com/watch?v=L1j93RnIxEo).

[Node.js]: https://nodejs.org/en/
[NPM]: https://www.npmjs.com
[CLI]: https://en.wikipedia.org/wiki/Command-line_interface
[TypeScript]: https://www.typescriptlang.org
[type declarations]: https://www.typescriptlang.org/docs/handbook/2/type-declarations.html
[Stack Overflow]: https://stackoverflow.com
[GitHub packages]: https://github.com/features/packages
[GitHub Actions]: https://github.com/features/actions
[tsc]: https://www.npmjs.com/package/typescript
[rollup]: https://www.npmjs.com/package/rollup
[browserify]: https://www.npmjs.com/package/browserify
[terser]: https://www.npmjs.com/package/terser
[typedoc]: https://www.npmjs.com/package/typedoc
[extra-markdown-text]: https://www.npmjs.com/package/extra-markdown-text
[@octokit/rest]: https://www.npmjs.com/package/@octokit/rest
[npm view]: https://docs.npmjs.com/cli/v7/commands/npm-view
[semver]: https://www.npmjs.com/package/semver
[kleur]: https://www.npmjs.com/package/kleur
[RunKit]: https://runkit.com/home

<br>

```javascript
const build = require('extra-build');


// 1. Set version and publish package.
var m = build.readMetadata('.');
// → {name, version, description, ...}
m.version = '2.0.0';
build.writeMetadata('.', m);
build.publish('.');
build.publishGithub('.', 'owner');


// 2. Publish next version, update github details.
var m   = build.readMetadata('.');
var ver = build.nextUnpublishedVersion(m.name, m.version);
m.version = ver;
build.writeMetadata('.', m);
build.publish('.');
build.publishGithub('.', 'owner');
build.updateGithubRepoDetails();


// 3. Update keywords for package.
var m  = build.readMetadata('.');
var p  = build.loadDocs(['src/index.ts']);
var ds = p.children.map(build.docsDetails);
var s = new Set([...m.keywords, ...ds.map(d => d.name)]);
m.keywords = Array.from(s);
build.writeMetadata('.', m);


// 4. Restore package.json after publishing with updated version.
var _package = build.readDocument('package.json');
var m = build.readMetadata('.');
m.version = '2.0.0';
build.writeMetadata('.', m);
build.publish('.');
build.writeDocument(_package);


// 5. Update README index table.
var owner = 'owner', repo = 'repo';
var p  = build.loadDocs(['src/index.ts']);
var ds = p.children.map(build.docsDetails);
var re = /namespace|function/i;
var dm = new Map(ds.map(d => [d.name, d]));
var txt = build.readFileText('README.md');
txt = build.wikiUpdateIndex(txt, dm, d => re.test(d.kind));
txt = build.wikiUpdateLinkReferences(txt, dm, {owner, repo});
build.writeFileText('README.md', txt);
```

<br>
<br>


## Index

| Property | Description |
|  ----  |  ----  |
| [symbolname] | Get symbol name for file. |
| [keywordname] | Get keyword name for file. |
|  |  |
| [error] | Print error message to stderr with newline. |
| [warn] | Print warning message to stderr with newline. |
| [log] | Print log message to stdout with newline. |
| [info] | Print info message to stdout with newline. |
|  |  |
| [exec] | Execute command with output, and print the command. |
| [execStr] | Execute command and get its output as string. |
|  |  |
| [readFileText] | Read file text with Unix EOL. |
| [writeFileText] | Write file text with system EOL. |
| [readJson] | Read JSON file as object. |
| [writeJson] | Write object to JSON file. |
| [readDocument] | Read document. |
| [writeDocument] | Write document. |
|  |  |
| [gitCommitPush] | Commit new changes and push to remote. |
| [gitSetupBranch] | Setup new branch and push to remote. |
|  |  |
| [addBanner] | Add banner (header comment) to script text. |
| [bundleScript] | Bundle a script file with config. |
| [webifyScript] | Webify a script file. |
| [jsdocifyScript] | Transform JSDocs in a script file. |
|  |  |
| [parseGithubUrl] | Get details from GitHub URL. |
| [updateGithubRepoDetails] | Update GitHub repository details. |
|  |  |
| [readMetadata] | Read package.json data. |
| [writeMetadata] | Write package.json data. |
| [registry] | Get current registry. |
| [setRegistry] | Set current registry. |
| [latestVersion] | Get latest package version. |
| [nextUnpublishedVersion] | Get next unpublished version for package. |
|  |  |
| [publish] | Publish package to NPM. |
| [publishGithub] | Publish package to GitHub. |
|  |  |
| [generateDocs] | Generate docs using typedoc. |
| [publishDocs] | Publish docs to gh-pages. |
|  |  |
| [docsRefer] | Get the reflection that is referred to. |
| [docsName] | Get name of a reflection. |
| [docsLocation] | Get location of reflection. |
| [docsFlags] | Get flags of a reflection. |
| [docsKind] | Get kind name of a reflection. |
| [docsChildCount] | Get child count of a reflection. |
| [docsParameterCount] | Get parameter count of a reflection (function). |
| [docsSignatureCount] | Get signature count of a reflection. |
| [docsType] | Get type name of a reflection. |
| [docsDescription] | Get description of a reflection. |
| [docsReturns] | Get returns description of a reflection (function). |
| [docsDetails] | Get details of a reflection. |
| [docsReferDetails] | Get details of a reflection, referring the necessary details. |
| [loadDocs] | Load docs from source file. |
|  |  |
| [wikiCodeReference] | Generate reference code block for wiki. |
| [wikiCodeExample] | Generate example code block for wiki. |
| [wikiMarkdown] | Generate markdown text for wiki. |
| [wikiUpdateIndex] | Update the "Index" (property, description) table in markdown text. |
| [wikiUpdateLinkReferences] | Update link references in markdown text. |

<br>
<br>

[![](https://img.youtube.com/vi/BCxhQpS5fQ0/maxresdefault.jpg)](https://www.youtube.com/watch?v=BCxhQpS5fQ0)
[![DOI](https://zenodo.org/badge/254083559.svg)](https://zenodo.org/badge/latestdoi/254083559)


[symbolname]: https://nodef.github.io/extra-build/modules.html#symbolname
[keywordname]: https://nodef.github.io/extra-build/modules.html#keywordname
[error]: https://nodef.github.io/extra-build/modules.html#error
[warn]: https://nodef.github.io/extra-build/modules.html#warn
[log]: https://nodef.github.io/extra-build/modules.html#log
[info]: https://nodef.github.io/extra-build/modules.html#info
[exec]: https://nodef.github.io/extra-build/modules.html#exec
[execStr]: https://nodef.github.io/extra-build/modules.html#execStr
[readFileText]: https://nodef.github.io/extra-build/modules.html#readFileText
[writeFileText]: https://nodef.github.io/extra-build/modules.html#writeFileText
[readJson]: https://nodef.github.io/extra-build/modules.html#readJson
[writeJson]: https://nodef.github.io/extra-build/modules.html#writeJson
[readDocument]: https://nodef.github.io/extra-build/modules.html#readDocument
[writeDocument]: https://nodef.github.io/extra-build/modules.html#writeDocument
[gitCommitPush]: https://nodef.github.io/extra-build/modules.html#gitCommitPush
[gitSetupBranch]: https://nodef.github.io/extra-build/modules.html#gitSetupBranch
[addBanner]: https://nodef.github.io/extra-build/modules.html#addBanner
[bundleScript]: https://nodef.github.io/extra-build/modules.html#bundleScript
[webifyScript]: https://nodef.github.io/extra-build/modules.html#webifyScript
[parseGithubUrl]: https://nodef.github.io/extra-build/modules.html#parseGithubUrl
[updateGithubRepoDetails]: https://nodef.github.io/extra-build/modules.html#updateGithubRepoDetails
[readMetadata]: https://nodef.github.io/extra-build/modules.html#readMetadata
[writeMetadata]: https://nodef.github.io/extra-build/modules.html#writeMetadata
[registry]: https://nodef.github.io/extra-build/modules.html#registry
[setRegistry]: https://nodef.github.io/extra-build/modules.html#setRegistry
[latestVersion]: https://nodef.github.io/extra-build/modules.html#latestVersion
[nextUnpublishedVersion]: https://nodef.github.io/extra-build/modules.html#nextUnpublishedVersion
[publish]: https://nodef.github.io/extra-build/modules.html#publish
[publishGithub]: https://nodef.github.io/extra-build/modules.html#publishGithub
[generateDocs]: https://nodef.github.io/extra-build/modules.html#generateDocs
[publishDocs]: https://nodef.github.io/extra-build/modules.html#publishDocs
[docsRefer]: https://nodef.github.io/extra-build/modules.html#docsRefer
[docsName]: https://nodef.github.io/extra-build/modules.html#docsName
[docsLocation]: https://nodef.github.io/extra-build/modules.html#docsLocation
[docsFlags]: https://nodef.github.io/extra-build/modules.html#docsFlags
[docsKind]: https://nodef.github.io/extra-build/modules.html#docsKind
[docsChildCount]: https://nodef.github.io/extra-build/modules.html#docsChildCount
[docsParameterCount]: https://nodef.github.io/extra-build/modules.html#docsParameterCount
[docsSignatureCount]: https://nodef.github.io/extra-build/modules.html#docsSignatureCount
[docsType]: https://nodef.github.io/extra-build/modules.html#docsType
[docsDescription]: https://nodef.github.io/extra-build/modules.html#docsDescription
[docsReturns]: https://nodef.github.io/extra-build/modules.html#docsReturns
[docsDetails]: https://nodef.github.io/extra-build/modules.html#docsDetails
[docsReferDetails]: https://nodef.github.io/extra-build/modules.html#docsReferDetails
[loadDocs]: https://nodef.github.io/extra-build/modules.html#loadDocs
[wikiCodeReference]: https://nodef.github.io/extra-build/modules.html#wikiCodeReference
[wikiCodeExample]: https://nodef.github.io/extra-build/modules.html#wikiCodeExample
[wikiMarkdown]: https://nodef.github.io/extra-build/modules.html#wikiMarkdown
[wikiUpdateIndex]: https://nodef.github.io/extra-build/modules.html#wikiUpdateIndex
[wikiUpdateLinkReferences]: https://nodef.github.io/extra-build/modules.html#wikiUpdateLinkReferences
[jsdocifyScript]: https://nodef.github.io/extra-build/modules.html#jsdocifyScript
