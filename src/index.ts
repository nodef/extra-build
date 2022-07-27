import {ExecSyncOptions} from "child_process";
import {URL} from "url";
import * as util    from "util";
import * as path    from "path";
import * as cp      from "child_process";
import * as os      from "os";
import * as fs      from "fs";
import * as semver  from "semver";
import kleur        from "kleur";
import {Octokit}    from "@octokit/rest";
import {Reflection} from "typedoc";
import {Comment}             from "typedoc";
import {CommentDisplayPart}  from "typedoc";
import {SignatureReflection} from "typedoc";
import {ProjectReflection}   from "typedoc";
import {ReflectionFlags}     from "typedoc";
import {Jsdoc}         from "extra-jsdoc-text";
import * as typedoc    from "typedoc";
import * as markdown   from "extra-markdown-text";
import * as javascript from "extra-javascript-text";
import * as jsdoc      from "extra-jsdoc-text";




// STRING
// ======

/**
 * Convert string to kebab-case.
 * @param x string
 * @param sep separator [-]
 * @returns string in kebab-case
 */
function kebabCase(x: string, sep: string="-"): string {
  var rdelta = /([^A-Z])([A-Z])|(\D)(\d)/g;
  var rtrim  = /^[^a-zA-Z0-9\.]+|[^a-zA-Z0-9\.]+$/g;
  var rsep   = /[^a-zA-Z0-9\.]+/g;
  x = x.replace(rdelta, `$1$3${sep}$2$4`);
  x = x.replace(rsep, sep);
  x = x.replace(rtrim, "");
  return x.toLowerCase();
}


/**
 * Wrap a string by specified column width.
 * @param x string
 * @param cols column width [0 => unlimited]
 * @returns wrapped string
 */
function wrapText(x: string, cols: number=0): string {
  var a = "", cols = cols || x.length;
  for (var i=0; i<x.length; i+=cols)
    a += x.substring(i, i+cols) + "\n";
  return a.substring(0, a.length-1);
}


/**
 * Indent a string by specified prefix text.
 * @param x string
 * @param pre prefix text []
 * @returns indented text
 */
function indentText(x: string, pre: string=""): string {
  return x.split("\n").map(l => pre + l).join("\n").replace(/[ \t]+\n/g, "\n");
}




// PATH
// ====

/**
 * Get file name without extension.
 * @param pth file path
 * @returns file name
 */
function filename(pth: string): string {
  var f = path.basename(pth);
  return f.replace(/\..*/, "");
}


/**
 * Get symbol name for file.
 * @param pth file path
 */
export function symbolname(pth: string): string {
  return filename(pth).replace(/[^\w$]+/g, "_");
}


/**
 * Get keyword name for file.
 * @param pth file path
 * @returns keyword name
 */
export function keywordname(pth: string): string {
  return kebabCase(filename(pth)).replace(/\W+/g, "-");
}




// CONSOLE
// =======

/**
 * Get formatted data for display to console.
 * @param x data
 * @returns formatted data
 */
function fixup(x?: any): string {
  x = x || "";
  x = typeof x !== "string"? util.inspect(x) : x;
  return x.replace(/^\w+:/, (m: string) => kleur.bold(m));
}


/**
 * Print error message to stderr with newline.
 * @param x data
 */
export function error(x?: any): void {
  console.error(kleur.red(fixup(x)));
}


/**
 * Print warning message to stderr with newline.
 * @param x data
 */
export function warn(x?: any): void {
  console.warn(kleur.yellow(fixup(x)));
}


/**
 * Print log message to stdout with newline.
 * @param x data
 */
export function log(x?: any): void {
  console.log(kleur.cyan(fixup(x)));
}


/**
 * Print info message to stdout with newline.
 * @param x data
 */
export function info(x?: any): void {
  console.info(kleur.grey(fixup(x)));
}




// CHILD-PROCESS
// =============

/** Exec options. */
export interface ExecOptions extends ExecSyncOptions {
  /** Hide command log. */
  commandHide?: boolean,
}


/**
 * Execute command with output, and print the command.
 * @param cmd command to execute
 * @param options exec options
 * @returns command output
 */
export function exec(cmd: string, options?: ExecOptions): string | Buffer {
  var o = Object.assign({stdio: [0, 1, 2]}, options);
  if (!o.commandHide) info(`$ ${cmd}`);
  var a = cp.execSync(cmd, o);
  if (!o.commandHide) info();
  return a;
}


/**
 * Execute command and get its output as string.
 * @param cmd command to execute
 * @param options exec options
 * @returns command output
 */
export function execStr(cmd: string, options?: ExecOptions): string {
  info(`$ ${cmd}`);
  var o = Object.assign({encoding: "utf8"}, options);
  var a = cp.execSync(cmd, o).toString().trim();
  info();
  return a;
}




// FS
// ==

/**
 * Read file text with Unix EOL.
 * @param pth file path
 * @returns file text
 */
export function readFileText(pth: string): string {
  var txt = fs.readFileSync(pth, "utf8");
  return txt.replace(/\r?\n/g, "\n");
}


/**
 * Write file text with system EOL.
 * @param pth file path
 * @param txt file text
 */
export function writeFileText(pth: string, txt: string): void {
  var txt = txt.replace(/\r?\n/g, os.EOL);
  fs.writeFileSync(pth, txt);
}


/**
 * Read JSON file as object.
 * @param pth path of JSON file
 * @returns object
 */
export function readJson(pth: string): any {
  return JSON.parse(readFileText(pth));
}


/**
 * Write object to JSON file.
 * @param pth path of JSON file
 * @param val object
 */
export function writeJson(pth: string, val: any): void {
  writeFileText(pth, JSON.stringify(val, null, 2) + "\n");
}


/** Records file path and data. */
export interface Document {
  /** File path. */
  path: string,
  /** File data.  */
  data: string | Buffer,
}


/**
 * Read document.
 * @param pth file path
 * @returns document {path, data}
 */
 export function readDocument(pth: string): Document {
  var data = fs.existsSync(pth)? fs.readFileSync(pth) : null;
  return {path: pth, data};
}


/**
 * Write document.
 * @param doc document {path, data}
 */
export function writeDocument(doc: Document): void {
  if (doc.data!=null) fs.writeFileSync(doc.path, doc.data);
  else if (fs.existsSync(doc.path)) fs.unlinkSync(doc.path);
}




// GIT
// ===

/**
 * Get get repository"s remote URL.
 * @returns remote URL
 */
function gitRemoteUrl(): string {
  return execStr(`git config --get remote.origin.url`);
}


/**
 * Get current branch of git repository.
 * @returns branch name
 */
function gitBranch(): string {
  return execStr(`git rev-parse --abbrev-ref HEAD`);
}


/**
 * Get diff of a file in git repository.
 * @param pth path of file
 * @returns diff text
 */
function gitDiff(pth: string): string {
  var f   = path.basename(pth);
  var cwd = path.dirname(pth);
  return execStr(`git diff "${f}"`, {cwd});
}


/**
 * Add submodule to git repository.
 * @param url submodule url
 * @param out output directory
 */
function gitAddSubmodule(url: string, out: string): void {
  if (!url) { exec(`git submodule update --remote --merge`); return; }
  exec(`git submodule add ${url} "${out}"`);
  exec(`git submodule update --init`);
}


/** Git commit push options. */
export interface GitCommitPushOptions extends ExecOptions {
  /** Commit options. */
  commit?: string,
  /** Push options. */
  push?: string,
}


/**
 * Commit new changes and push to remote.
 * @param msg commit message (amend if empty)
 * @param options commit options
 */
export function gitCommitPush(msg: string="", options: GitCommitPushOptions=null): void {
  var o = Object.assign({commit: "", push: ""}, options);
  if (msg) o.commit += ` -m "${msg}"`;
  else o.commit += ` --amend --no-edit`;
  if (!msg) o.push += ` -f`;
  exec(`git add .`, o);
  exec(`git commit${o.commit}`, o);
  exec(`git push${o.push}`, o);
}


/** Git setup branch options. */
export interface GitSetupBranchOptions extends ExecOptions {
  /** First file [index.html]. */
  file?: string,
}


/**
 * Setup new branch and push to remote.
 * @param branch branch name
 * @param options setup options
 *
 */
export function gitSetupBranch(branch: string, options: GitSetupBranchOptions=null): void {
  var o = Object.assign({}, options);
  log(`Creating ${branch} branch ...`);
  exec(`git checkout --orphan ${branch}`, o);
  exec(`git rm -rf .`, o);
  exec(`git clean -fxd`, o);
  exec(`touch ${o.file || "index.html"}`, o);
  var co = Object.assign({push: ` --set-upstream origin ${branch}`}, options);
  gitCommitPush("initial commit", co);
}




// BUNDLE / BROWSERIFY
// ===================

/**
 * Add banner (header comment) to script text.
 * @param txt script text
 * @returns script text with banner
 */
export function addBanner(txt: string): string {
  txt = txt.trim();
  if (txt.length===0) return "";
  if (/^\/\/[^\n]*$|^\/\*[\s\S]*?\*\/$/.test(txt)) return `${txt}\n`;
  if (txt.includes("\n")) return `/**\n${txt}\n*/\n`;
  return `/** ${txt} */\n`;
}


/** Bundle options. */
export interface BundleOptions {
  /** Bundle config script [rollup.config.js]. */
  config?: string,
  /** Environment variables for bundle config script. */
  env?: NodeJS.Dict<string>,
}


function bundleEnvArgs(env?: any): string {
  var a = "";
  if (!env) return a;
  for (var k in env)
    a += ` --environment ${k}:${env[k]}`;
  return a;
}


/**
 * Bundle a script file with config.
 * @param src source file
 * @param options bundle options {config, env}
 */
export function bundleScript(src?: string, options?: BundleOptions): void {
  var o = Object.assign({}, options);
  if (src) src = src.replace(/\.ts$/, ".js");
  var cfg = o.config || "rollup.config.js";
  var inp = src? `-i "${src}"` : "";
  var env = bundleEnvArgs(o.env);
  exec(`rollup -c "${cfg}" ${inp} ${env}`);
}


/** Webify options. */
export interface WebifyOptions {
  /** Source script format (cjs, esm) [cjs]. */
  format?: string,
  /** Standalone symbol name. */
  symbol?: string,
  /** Banner text for script. */
  banner?: string,
}


/**
 * Webify a script file.
 * @param src source script file
 * @param dst destination script file
 * @param options webify options
 */
export function webifyScript(src: string, dst: string, options?: WebifyOptions): void {
  var o = Object.assign({}, options);
  var cjs = !o.format || /c?js/i.test(o.format);
  var tfm = o.format==="esm"? "-t babelify" : "";
  var sym = o.symbol? `-s "${o.symbol}"` : "";
  if (cjs) exec(`browserify "${src}" ${tfm} -o "${src}.1" ${sym}`);
  else     exec(`cp "${src}" "${src}.1"`);
  exec(`terser "${src}.1" -o "${src}.2" -c -m`);
  var txt = readFileText(`${src}.2`);
  writeFileText(dst, addBanner(o.banner || "") + txt);
  exec(`rm -f "${src}.1"`);
  exec(`rm -f "${src}.2"`);
}


/** JSDoc details with some symbol details. */
export interface JsdocToken extends Jsdoc {
  /** Symbol name. */
  name: string,
  /** Symbol kind. */
  kind: string,
  /** Symbol is exported? */
  isExported: boolean,
  /** Symbol is default? */
  isDefault: boolean,
}


/**
 * Perform operation on jsdoc token.
 * @param j jsdoc token
 * @returns resulting jsdoc token; or null to keep as-is
 */
export type OnJsdocToken = (j: JsdocToken) => JsdocToken;


/**
 * Transform JSDocs in a script file.
 * @param src source script file
 * @param dst destination script file
 * @param fm jsdoc token transformer (j)
 */
export function jsdocifyScript(src: string, dst: string, fm: OnJsdocToken): void {
  var txt = readFileText(src);
  txt = javascript.replaceJsdocSymbols(txt, (full, txt, name, kind, isExported, isDefault) => {
    var a = fm(Object.assign(jsdoc.parse(txt), {name, kind, isExported, isDefault}));
    return a? full.replace(txt, jsdoc.stringify(a)) : full;
  });
  writeFileText(dst, txt);
}




// GITHUB
// ======

/** GitHub URL details. */
export interface GithubUrlDetails {
  /** Owner name. */
  owner: string,
  /** Repository name. */
  repo: string,
}


/**
 * Get details from GitHub URL.
 * @param url remote url
 * @returns url details
 */
export function parseGithubUrl(url: string): GithubUrlDetails {
  var p = new URL(url).pathname;
  p = p.replace(/^\/|^.*?:/, "");
  p = p.replace(/^git+|\.git$/, "");
  var [owner, repo] = p.split("/");
  return {owner, repo};
}


/** GitHub Repository details. */
export interface GithubRepoDetails {
  /** Authorization token [$GITHUB_TOKEN]. */
  auth?: string,
  /** Owner name. */
  owner?: string,
  /** Repository name. */
  repo?: string,
  /** Repository description. */
  description?: string,
  /** Respoitory homepage URL. */
  homepage?: string,
  /** Repository topics. */
  topics?: string[],
}


function githubTopics(ks: string[]): string[] {
  return ks.map(keywordname).filter(k => k.length<=35).slice(0, 20);
}

/**
 * Update GitHub repository details.
 * @param options repository details
 */
export async function updateGithubRepoDetails(options: GithubRepoDetails=null): Promise<void> {
  var E = process.env;
  var m = readMetadata(".");
  var u = parseGithubUrl(m.repository.url);
  var o = Object.assign({}, options);
  var owner = o.owner || u.owner;
  var repo  = o.repo  || u.repo;
  var description = o.description || m.description;
  var homepage = o.homepage || `https://www.npmjs.com/package/${m.name}`;
  var topics = githubTopics(o.topics || m.keywords);
  var octokit = new Octokit({auth: o.auth || E.GITHUB_TOKEN});
  info("Updating GitHub details:\n");
  info(`Description: ${description}`);
  info(`Website: ${homepage}`);
  info(`Topics: ${(topics || []).join(", ")}`);
  await octokit.repos.update({owner, repo, description, homepage});
  await octokit.repos.replaceAllTopics({owner, repo, names: topics});
}




// PACKAGE
// =======

/**
 * Read package.json data.
 * @param dir package directory
 * @returns package.json data
 */
export function readMetadata(dir: string="."): any {
  var pth = path.join(dir, "package.json");
  return readJson(pth);
}


/**
 * Write package.json data.
 * @param dir package directory
 * @param val package.json data
 */
export function writeMetadata(dir: string, val: any): void {
  var pth = path.join(dir, "package.json");
  writeJson(pth, val);
}


/**
 * Get current registry.
 * @param dir package directory
 * @returns current registry
 */
export function registry(dir: string="."): string {
  var cwd = dir;
  return execStr(`npm config get registry`, {cwd});
}


/**
 * Set current registry.
 * @param dir package directory
 * @param url registry url
 */
export function setRegistry(dir: string, url: string): void {
  var pth = path.join(dir, ".npmrc");
  var txt = fs.existsSync(pth)? readFileText(pth) : "";
  var has = /^registry\s*=/.test(txt);
  if (has) txt = txt.replace(/^registry\s*=.*$/gm, `registry=${url}`);
  else     txt = txt + `\nregistry=${url}`;
  writeFileText(pth, txt.trim() + "\n");
}


/**
 * Get latest package version.
 * @param name package name
 * @returns latest package version
 */
export function latestVersion(name: string): string {
  return execStr(`npm view ${name} version`);
}


/**
 * Get next unpublished version for package.
 * @param name package name
 * @param ver package version
 * @returns next unpublished version
 */
export function nextUnpublishedVersion(name: string, ver: string): string {
  var u = latestVersion(name);
  var d = semver.diff(u, ver);
  if (d==="major" || d==="minor") return ver;
  if (semver.lt(u, ver)) return ver;
  return semver.inc(u, "patch");
}


/**
 * Publish package to NPM.
 * @param dir package directory
 */
export function publish(dir: string="."): void {
  var cwd = dir;
  exec(`npm publish`, {cwd});
}


/**
 * Publish package to GitHub.
 * @param dir package directory
 * @param owner owner name
 */
export function publishGithub(dir: string, owner: string): void {
  var err = null;
  var _package = readDocument(path.join(dir, "package.json"));
  var _npmrc   = readDocument(path.join(dir, ".npmrc"));
  var m   = readMetadata(dir);
  var pkg = m.name.replace("@", "").replace("/", "--");
  m.name  = `@${owner}/${pkg}`;
  writeMetadata(dir, m);
  setRegistry(dir, `https://npm.pkg.github.com/${owner}`);
  try { publish(dir); }
  catch (e) { err = e; }
  writeDocument(_npmrc);
  writeDocument(_package);
  if (err) throw err;
}




// DOCS
// ====

/**
 * Generate docs using typedoc.
 * @param src main source file
 * @param out output directory
 */
export function generateDocs(src: string, out: string=".docs"): void {
  exec(`typedoc "${src}" --out "${out}"`);
}


/**
 * Publish docs to gh-pages.
 * @param dir docs directory
 */
export function publishDocs(dir: string=".docs"): void {
  var url = gitRemoteUrl();
  var cwd = fs.mkdtempSync(path.join(os.tmpdir(), dir));
  exec(`git clone ${url} "${cwd}"`);
  try { exec(`git checkout gh-pages`, {cwd}); }
  catch(e) { gitSetupBranch("gh-pages", {cwd}); }
  exec(`rm -rf "${cwd}"/*`);
  exec(`mv "${dir}"/* "${cwd}"/`);
  gitCommitPush("", {cwd});
  exec(`rm -rf ${cwd}`);
}


/**
 * Get the reflection that is referred to.
 * @param docs docs reflection
 * @param r reflection
 * @returns referred reflection, or the same if nothing is referred
 */
export function docsRefer<T=Reflection>(docs: ProjectReflection, r: T): T {
  // @ts-ignore
  if (!r.target) return r;
  // @ts-ignore
  return docsRefer(docs, docs.getReflectionById(r.target));
}


/**
 * Get name of a reflection.
 * @param r reflection
 * @returns reflection name
 */
export function docsName(r: Reflection): string {
  return r.name;
}


/**
 * Get location of reflection.
 * @param r reflection
 * @returns location of reflection
 */
export function docsLocation(r: Reflection): string {
  var [s] = r.sources || [];
  return s==null? null : s.fileName + ":" + s.line.toString().padStart(6, "0");
}


/**
 * Get flags of a reflection.
 * @param r reflection
 * @returns flags
 */
export function docsFlags(r: Reflection): ReflectionFlags {
  return r.flags;
}


/**
 * Get kind name of a reflection.
 * @param r reflection
 * @returns kind name
 */
export function docsKind(r: Reflection): string {
  return r.kindString;
}


function docsFindSignatures(r: Reflection): SignatureReflection[] {
  // @ts-ignore
  if (r.signatures) return r.signatures;
  // @ts-ignore
  if (r.declaration) return docsFindSignatures(r.declaration);
  // @ts-ignore
  if (r.type) return docsFindSignatures(r.type);
  return [];
}


function docsFindComment(r: Reflection, sig: number=0): Comment {
  if (r==null) return null;
  if (r.comment) return r.comment;
  return docsFindComment(docsFindSignatures(r)[sig]);
}


/**
 * Get child count of a reflection.
 * @param r reflection
 * @returns child count
 */
export function docsChildCount(r: Reflection): number {
  // @ts-ignore
  return r.children? r.children.length : 0;
}


/**
 * Get parameter count of a reflection (function).
 * @param r reflection
 * @returns parameter count
 */
export function docsParameterCount(r: Reflection): number {
  // @ts-ignore
  return r.parameters? r.parameters.length : 0;
}


/**
 * Get signature count of a reflection.
 * @param r reflection
 * @returns signature count
 */
export function docsSignatureCount(r: Reflection): number {
  return docsFindSignatures(r).length;
}


/**
 * Get type name of a reflection.
 * @param r reflection
 * @returns type name
 */
export function docsType(r: Reflection, sig: number=0): string {
  if (r==null) return null;
  // @ts-ignore
  if (r.type) return r.type.toString();
  if (/class|interface|type/i.test(r.kindString)) return r.name;
  return docsType(docsFindSignatures(r)[sig]);
}


function contentText(ps: CommentDisplayPart[]): string {
  var a = "";
  for (var p of ps)
    a += p.text;
  return a;
}

/**
 * Get description of a reflection.
 * @param r reflection
 * @param sig signature index
 * @returns description/comment
 */
export function docsDescription(r: Reflection, sig: number=0): string {
  var c = docsFindComment(r, sig), a = '';
  if (c==null || c.summary==null) return null;
  return contentText(c.summary).trim();
}


/**
 * Get returns description of a reflection (function).
 * @param r reflection
 * @param sig signature index
 * @returns returns description/comment
 */
export function docsReturns(r: Reflection, sig: number=0): string {
  var c = docsFindComment(r, sig);
  if (c==null) return null;
  var t = c.getTag("@returns");
  if (t==null) return null;
  return contentText(t.content);
}


/** Details of a reflection. */
export interface DocsDetails {
  /** Name of a reflection. */
  name: string,
  /** Location of reflection. */
  location?: string,
  /** Flags of a reflection. */
  flags: ReflectionFlags,
  /** Kind name of a reflection */
  kind: string,
  /** Type name of a reflection. */
  type: string,
  /** Description/comment of a reflection. */
  description?: string,
  /** Details of children/signatures/parameters of a reflection. */
  children?: DocsDetails[],
  /** Return details/comment of a reflection (function). */
  returns?: string,
}


/**
 * Get details of a reflection.
 * @param r reflection
 * @returns reflection details {name, kind, type, description, params, returns}
 */
export function docsDetails(r: Reflection): DocsDetails {
  // @ts-ignore
  var s: Reflection[] = r.children || r.parameters || docsFindSignatures(r);
  return {
    name: docsName(r),
    location: docsLocation(r),
    flags: docsFlags(r),
    kind: docsKind(r),
    type: docsType(r),
    description: docsDescription(r),
    children: s? s.map(docsDetails) : null,
    returns: docsReturns(r),
  };
}


/**
 * Get details of a reflection, referring the necessary details.
 * @param docs docs reflection
 * @param r reflection
 * @returns reflection details {name, kind, type, description, params, returns}
 */
export function docsReferDetails(docs: ProjectReflection, r: Reflection): DocsDetails {
  var s = docsRefer(docs, r);
  if (s===r) return docsDetails(r);
  var kind = `${docsKind(r)}/${docsKind(s)}`;
  return Object.assign(docsDetails(s), docsDetails(r), {kind});
}


/**
 * Load docs from source file.
 * @param entryPoints entry source files
 * @returns docs reflection
 */
export function loadDocs(entryPoints?: string[]): ProjectReflection {
  entryPoints = entryPoints || ["src/index.ts"];
  var app = new typedoc.Application();
  app.options.addReader(new typedoc.TSConfigReader());
  app.options.addReader(new typedoc.TypeDocReader());
  app.bootstrap({entryPoints});
  return app.convert();
}




// WIKI
// ====

/** Markdown options. */
export interface MarkdownOptions {
  /** GitHub owner name. [owner] */
  owner?: string,
  /** GitHub repo name. [repo] */
  repo?: string,
  /** Use wiki links? [false] */
  useWiki?: boolean,
  /** Namespace prefix. */
  prefix?: string,
  /** Wrap comment text after. [0 => unlimited] */
  wrapText?: number,
  /** Include types? [false] */
  withType?: boolean,
  /** Include root description? [false] */
  withDescription?: boolean,
}


function wikiText(txt: string, short: boolean=false): string {
  txt = txt.replace(/\{@\w+\s+(.*?)\}/g, "`$1`");
  if (short) txt = txt.replace(/([\?\!\.])\s[\s\S]*/, "$1").replace(/\s*\n\s*/, " ");
  return txt.trim();
}

function wikiDescription(txt: string, cols: number=0): string {
  if (!txt) return "";
  return wrapText(wikiText(txt), cols).split("\n").map(l => `// ${l}`).join("\n") + "\n";
}

function wikiFlagsPrefix(d: DocsDetails): string {
  var a = "", f = d.flags;
  if (f.isAbstract) a += "abstract ";
  if (f.isReadonly) a += "readonly ";
  if (f.isStatic)   a += "static ";
  return a;
}

function wikiVariable(d: DocsDetails, e: DocsDetails, o?: MarkdownOptions): string {
  var text = wikiDescription(e?.description, o?.wrapText), f = d.flags;
  var code = wikiFlagsPrefix(d) + (f.isConst? "const" : "var") + " ";
  code += d.name + (o?.withType? ": "+d.type : "") + "\n";
  return text + code;
}

function wikiProperty(d: DocsDetails, e: DocsDetails, o?: MarkdownOptions): string {
  var text = wikiDescription(e?.description, o?.wrapText);
  var code = wikiFlagsPrefix(d) + d.name + (o?.withType? ": "+d.type : "") + ",\n";
  return text + code;
}

function wikiInterface(d: DocsDetails, e: DocsDetails, o?: MarkdownOptions): string {
  var text = wikiDescription(e?.description, o?.wrapText);
  var code = `interface ${d.name} {\n`;
  for (var c of d.children || [])
    code += indentText(wikiProperty(c, c, o), "  ");
  code += "}\n";
  return text + code;
}

function wikiParameter(d: DocsDetails, e: DocsDetails, o?: MarkdownOptions): string {
  var a = "", f = d.flags;
  if (f.isReadonly) a += "readonly ";
  if (f.isRest)     a += "...";
  a += d.name;
  if (f.isOptional && !f.isRest) a += "?";
  if (o?.withType) a += ": "+d.type;
  return a;
}

function wikiCallSignature(d: DocsDetails, e?: DocsDetails, o?: MarkdownOptions): string {
  var text = wikiDescription(e?.description, o?.wrapText);
  var code = wikiFlagsPrefix(d) + `function ${d.name}(`, children = d.children || [];
  for (var c of children)
    code += wikiParameter(c, c, o) + ", ";
  code = code.endsWith("(")? code : code.substring(0, code.length-2);
  code += ")" + (o?.withType? ": "+d.type : "") + "\n"
  var gap  = Math.max(...children.map(p => p.name.length)) + 2;
  var desc = children.map(p => `// ${(p.name+":").padEnd(gap, " ")}${p.description}`).join("\n") + "\n";
  return text + code + desc;
}

function wikiFunction(d: DocsDetails, e: DocsDetails, o?: MarkdownOptions): string {
  var children = d.children || [], c1 = e==null && children.length===1;
  var code = children.map(c => wikiCallSignature(c, c1? null : c, o)).join("\n\n").trim() + "\n";
  return code;
}

function wikiTypeAlias(d: DocsDetails, e: DocsDetails, o?: MarkdownOptions): string {
  var text = wikiDescription(e?.description, o?.wrapText);
  var code = `type ${d.name} = ${d.type}\n`;
  return text + code;
}

function wikiClass(d: DocsDetails, e: DocsDetails, o?: MarkdownOptions): string {
  var text = wikiDescription(e?.description, o?.wrapText);
  var code = wikiFlagsPrefix(d) + `class ${d.name} {\n`;
  for (var c of d.children || [])
    code += indentText(wikiCodeReference(c, o), "  ") + "\n";
  code += "}\n";
  return text + code;
}


/**
 * Generate reference code block for wiki.
 * @param d docs details
 * @param o markdown options
 * @returns reference code block
 */
export function wikiCodeReference(d: DocsDetails, o?: MarkdownOptions): string {
  var e = o?.withDescription? d : null;
  switch (d.kind) {
    case "Variable":   return wikiVariable(d, e, o);
    case "Interface":  return wikiInterface(d, e, o);
    case "Function":   return wikiFunction(d, e, o);
    case "Type alias": return wikiTypeAlias(d, e, o);
    case "Class":      return wikiClass(d, e, o);
    default: return "ERROR: UNKNOWN KIND!\n";
  }
}


/**
 * Generate example code block for wiki.
 * @param d docs details
 * @param o markdown options
 * @returns example code block
 */
export function wikiCodeExample(d: DocsDetails, o?: MarkdownOptions): string {
  var repo = o?.repo || "repo";
  var name = o?.prefix? `${o?.prefix}.${d.name}` : d.name;
  var code = `const {${name}} = require('${repo}');\n\n\n`;
  var text = `// Example for ${d.name}\n`;
  var out  = "// → OUTPUT\n";
  return code + text + out;
}


/**
 * Generate markdown text for wiki.
 * @param d docs details
 * @param o markdown options
 * @returns markdown text
 */
export function wikiMarkdown(d: DocsDetails, o?: MarkdownOptions): string {
  var owner = o?.owner || "owner";
  var repo  = o?.repo  || "repo";
  var name  = o?.prefix? `${o.prefix}.${d.name}` : d.name;
  return `${d.description}\n\n` +
    `> Alternatives: [${name}].<br>\n` +
    `> Similar: [${name}].\n\n` +
    `<br>\n\n` +
    "```javascript\n" +
    wikiCodeReference(d, o) +
    "```\n\n<br>\n\n" +
    "```javascript\n" +
    wikiCodeExample(d, o) +
    "```\n\n" +
    "<br>\n" +
    "<br>\n\n\n" +
    `## References\n\n` +
    `- [Example](https://www.example.com/)\n\n\n` +
    `[${name}]: https://github.com/${owner}/${repo}/wiki/${name}\n`;
}


function linkReferenceDocs(d: DocsDetails, o?: MarkdownOptions): string {
  var owner = o?.owner || "owner";
  var repo  = o?.repo  || "repo";
  var root  = `https://${owner}.github.io/${repo}`;
  var pred  = o?.prefix? `${o.prefix}.` : "";
  var prem  = o?.prefix? `modules/${o.prefix}.html` : "modules.html";
  switch (d.kind) {
    case "Interface": return `[${d.name}]: ${root}/interfaces/${pred}${d.name}.html`;
    case "Class":     return `[${d.name}]: ${root}/classes/${pred}${d.name}.html`;
    default:          return `[${d.name}]: ${root}/${prem}#${d.name}`;
  }
}

function linkReferenceWiki(d: DocsDetails, o?: MarkdownOptions): string {
  var owner = o?.owner || "owner";
  var repo  = o?.repo  || "repo";
  var name  = o?.prefix? `${o.prefix}.${d.name}` : d.name;
  return `[${d.name}]: https://github.com/${owner}/${repo}/wiki/${name}`;
}

function linkReference(d: DocsDetails, o?: MarkdownOptions): string {
  if (o?.useWiki) return linkReferenceWiki(d, o);
  return linkReferenceDocs(d, o);
}


/**
 * Perform operation on docs details.
 * @param d docs details
 * @returns resulting value
 */
export type OnDocsDetails<T> = (d: DocsDetails) => T;


/**
 * Update the "Index" (property, description) table in markdown text.
 * @param txt markdown text
 * @param dm docs details map
 * @returns updated markdown text
 */
export function wikiUpdateIndex(txt: string, dm: Map<string, DocsDetails>, fn?: OnDocsDetails<string>): string {
  return markdown.replaceTables(txt, (full, rows) => {
    if (rows.length < 1 || rows[0].length < 2) return full;
    rows = rows.map(r => [r[0].trim(), r[1].trim()]);
    if (!/property/i.test(rows[0][0]))    return full;
    if (!/description/i.test(rows[0][1])) return full;
    var rmap = new Map(rows.map((r, i) => [r[0], i]));
    for (var d of dm.values()) {
      var dsc = fn? fn(d) : d.description || " ";
      if (!dsc) continue;
      var key = `[${d.name}]`;
      var val = wikiText(dsc, true).trim();
      if (!rmap.has(key)) rows.push([key, val]);
      else rows[rmap.get(key)][1] = val;
    }
    var top = "| " + rows[0].join(" | ") + " |\n";
    var mid = "| " + rows[0].map(_ => ` ---- `).join(" | ") + " |\n";
    var bot =  rows.slice(1).map(r => "| "  + r.join(" | ") + " |\n").join("");
    return top + mid + bot;
  });
}


/**
 * Update link references in markdown text.
 * @param txt markdown text
 * @param dm docs details map
 * @param o markdown options
 * @returns updated markdown text
 */
export function wikiUpdateLinkReferences(txt: string, dm: Map<string, DocsDetails>, o?: MarkdownOptions): string {
  txt = markdown.replaceLinkReferences(txt, (full, name) => {
    if (!dm.has(name)) return full;
    return linkReference(dm.get(name), o);
  });
  var lset = new Set(markdown.links(txt).filter(x => !x.url).map(x => x.reference || x.name));
  var rset = new Set(markdown.linkReferences(txt).map(x => x.name));
  for (var l of lset) {
    if (rset.has(l)) continue;
    if (!dm.has(l)) continue;
    txt += linkReference(dm.get(l), o) + "\n";
  }
  return txt;
}


/**
 * Update description in markdown text.
 * @param txt markdown text
 * @param d docs details
 * @returns updated markdown text
 */
export function wikiUpdateDescription(txt: string, d: DocsDetails): string {
  return txt.replace(/[\s\S]+?\n\n/, `${d.description}\n\n`);
}


/**
 * Update code reference in markdown text.
 * @param txt markdown text
 * @param d docs details
 * @param o markdown options
 * @returns updated markdown text
 */
export function wikiUpdateCodeReference(txt: string, d: DocsDetails, o?: MarkdownOptions): string {
  return txt.replace(/(```javascript\n)[\s\S]+?(```\n\n)/, `$1${wikiCodeReference(d, o)}$2`);
}
