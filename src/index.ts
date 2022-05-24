import * as util from "util";
import kleur from "kleur";




// CONSOLE
// =======

/**
 * Get formatted data for display to console.
 * @param x data
 * @returns formatted data
 */
function fixup(x: any): string {
  x = x || "";
  x = typeof x !== "string"? util.inspect(x) : x;
  return x.replace(/^\w+:/, (m: string) => kleur.bold(m));
}


/**
 * Print error message to stderr with newline.
 * @param x data
 */
export function error(x: any): void {
  console.error(kleur.red(fixup(x)));
}


/**
 * Print warning message to stderr with newline.
 * @param x data
 */
export function warn(x: any): void {
  console.warn(kleur.yellow(fixup(x)));
}


/**
 * Print log message to stdout with newline.
 * @param x data
 */
export function log(x: any): void {
  console.log(kleur.cyan(fixup(x)));
}


/**
 * Print info message to stdout with newline.
 * @param x data
 */
export function info(x: any): void {
  console.log(kleur.grey(fixup(x)));
}
