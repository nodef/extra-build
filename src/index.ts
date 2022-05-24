import {ExecSyncOptions} from "child_process";
import {URL} from "url";
import * as util from "util";
import * as path from "path";
import * as cp   from "child_process";
import * as os   from "os";
import * as fs   from "fs";
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
function symbolname(pth: string): string {
  return filename(pth).replace(/[^\w$]+/g, "_");
}


/**
 * Get keyword name for file.
 * @param pth file path
 * @returns keyword name
 */
function keywordname(pth: string): string {
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
interface GitCommitPushOptions extends ExecOptions {
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
function gitCommitPush(msg: string="", options: GitCommitPushOptions=null): void {
  var o = Object.assign({commit: "", push: ""}, options);
  if (msg) o.commit += ` -m "${msg}"`;
  else o.commit += ` --amend --no-edit`;
  if (!msg) o.push += ` -f`;
  exec(`git add .`, o);
  exec(`git commit${o.commit}`, o);
  exec(`git push${o.push}`, o);
}


/** Git setup branch options. */
interface GitSetupBranchOptions extends ExecOptions {
  /** First file [index.html]. */
  file?: string,
}


/**
 * Setup new branch and push to remote.
 * @param branch branch name
 * @param options setup options
 *
 */
function gitSetupBranch(branch: string, options: GitSetupBranchOptions=null): void {
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
interface GithubUrlDetails {
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
function parseGithubUrl(url: string): GithubUrlDetails {
  var p = new URL(url).pathname;
  p = p.replace(/^\/|^.*?:/, "");
  p = p.replace(/\.git$/, "");
  var [owner, repo] = p.split("/");
  return {owner, repo};
}


/** GitHub Repository details. */
interface GithubRepoDetails {
  /** Authorization token [$GITHUB_TOKEN]. */
  auth?: string,
  /** Repository description. */
  description: string,
  /** Respoitory homepage URL. */
  homepage: string,
  /** Repository topics. */
  topics: string[],
}


/**
 * Update GitHub repository details.
 * @param owner owner name
 * @param repo repository name
 * @param options repository details
 */
async function updateGithubRepoDetails(owner: string, repo: string, options: GithubRepoDetails=null): Promise<void> {
  var E = process.env;
  var {description, homepage, topics} = Object.assign({}, options);
  var topics = topics.map(keywordname).slice(0, 20);
  var octokit = new Octokit({auth: options.auth || E.GITHUB_TOKEN});
  console.info("Updating GitHub details:\n");
  console.info(`Description: ${description || ""}`);
  console.info(`Website: ${homepage || ""}`);
  await octokit.repos.update({owner, repo, description, homepage});
  console.info(`Topics: ${(topics || []).join(", ")}`);
  await octokit.repos.replaceAllTopics({owner, repo, names: topics});
}
