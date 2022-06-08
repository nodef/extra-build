Common build tools for extra-* packages.<br>
📦 [NPM](https://www.npmjs.com/package/extra-build),
📜 [Files](https://unpkg.com/extra-build/),
📰 [Docs](https://nodef.github.io/extra-build/).

> Stability: [Experimental](https://www.youtube.com/watch?v=L1j93RnIxEo).

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
| [error] | Print error message to stderr with newline. |
| [warn] | Print warning message to stderr with newline. |
| [log] | Print log message to stdout with newline. |
| [info] | Print info message to stdout with newline. |
| [exec] | Execute command with output, and print the command. |
| [execStr] | Execute command and get its output as string. |
| [readFileText] | Read file text with Unix EOL. |
| [writeFileText] | Write file text with system EOL. |
| [readJson] | Read JSON file as object. |
| [writeJson] | Write object to JSON file. |
| [readDocument] | Read document. |
| [writeDocument] | Write document. |
| [gitCommitPush] | Commit new changes and push to remote. |
| [gitSetupBranch] | Setup new branch and push to remote. |
| [addBanner] | Add banner (header comment) to script text. |
| [bundleScript] | Bundle a script file with config. |
| [webifyScript] | Webify an script file. |
| [parseGithubUrl] | Get details from GitHub URL. |
| [updateGithubRepoDetails] | Update GitHub repository details. |
| [readMetadata] | Read package.json data. |
| [writeMetadata] | Write package.json data. |
| [registry] | Get current registry. |
| [setRegistry] | Set current registry. |
| [latestVersion] | Get latest package version. |
| [nextUnpublishedVersion] | Get next unpublished version for package. |
| [publishGithub] | Publish package to GitHub. |
| [generateDocs] | Generate docs using typedoc. |
| [publishDocs] | Publish docs to gh-pages. |
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
| [wikiCodeReference] | Get reference code block for wiki. |
| [wikiCodeExample] | Get example code block for wiki. |
| [wikiMarkdown] | Get markdown text for wiki. |
| [wikiUpdateIndex] | Update the "Index" (property, description) table in markdown text. |
| [wikiUpdateLinkReferences] | Update link references in markdown text. |
| [publish] | Publish package to NPM. |

<br>
<br>

[![](https://img.youtube.com/vi/BCxhQpS5fQ0/maxresdefault.jpg)](https://www.youtube.com/watch?v=BCxhQpS5fQ0)

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
