import {ExecSyncOptions} from "child_process";
import * as util from "util";
import * as path from "path";
import * as cp   from "child_process";
import kleur from "kleur";




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
function commitPush(msg: string="", options: GitCommitPushOptions=null): void {
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
 * @param {string} branch branch name
 * @param {SetupBranchOptions} o setup options
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
  commitPush("initial commit", co);
}
