/* Task 6 — reading a script from a file. readFileSync is Node's, not the language's:
   this module runs in Node only. The reader is a parameter so the tests can
   hand in their own. */
import { readFileSync } from "node:fs";

const readText = path => readFileSync(path, "utf8");

/**
 * loadScript(path, read = readText) → the file's text.
 *
 * If `read` throws, loadScript throws an Error whose message names the path
 * it was trying to read, with the reader's error kept as its cause.
 * It does not decide what a missing file means — that is its caller's call.
 */
export function loadScript(path, read = readText) {
  // Works when the read works. Task 6 is what happens when it does not.
  return read(path);
}
