import {ExecSyncOptions} from "child_process";
import {URL} from "url";
import * as util from "util";
import * as path from "path";
import * as cp   from "child_process";
import * as os   from "os";
import * as fs   from "fs";
import * as semver from "semver";
import kleur     from "kleur";
import {Octokit} from "@octokit/rest";




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
  console.log(kleur.grey(fixup(x)));
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
  if (!o.commandHide) console.info(`$ ${cmd}`);
  var a = cp.execSync(cmd, o);
  if (!o.commandHide) console.info();
  return a;
}


/**
 * Execute command and get its output as string.
 * @param cmd command to execute
 * @param options exec options
 * @returns command output
 */
export function execStr(cmd: string, options?: ExecOptions): string {
  console.info(`$ ${cmd}`);
  var o = Object.assign({encoding: "utf8"}, options);
  var a = cp.execSync(cmd, o).toString().trim();
  console.info();
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
  console.log(`Creating ${branch} branch ...`);
  exec(`git checkout --orphan ${branch}`, o);
  exec(`git rm -rf .`, o);
  exec(`git clean -fxd`, o);
  exec(`touch ${o.file || "index.html"}`, o);
  var co = Object.assign({push: ` --set-upstream origin ${branch}`}, options);
  gitCommitPush("initial commit", co);
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
  var topics = (o.topics || m.keywords).map(keywordname).slice(0, 20);
  var octokit = new Octokit({auth: o.auth || E.GITHUB_TOKEN});
  console.info("Updating GitHub details:\n");
  console.info(`Description: ${description}`);
  console.info(`Website: ${homepage}`);
  console.info(`Topics: ${(topics || []).join(", ")}`);
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
