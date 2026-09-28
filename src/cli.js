/* Run a loans script from the command line:
 *
 *   node src/cli.js test/fixtures/weekend.txt
 *
 * Node only: process.argv, process.exitCode and the node:fs calls are the
 * host's, not the language's. This file is written for you and has no tests.
 * It is the program's top boundary — read what it catches, and what it lets
 * through, before you answer question 2.
 */
import { openSync, writeSync, closeSync } from "node:fs";
import { loadScript } from "./load.js";
import { runScript } from "./run.js";

// The locker's contents when the program starts: item → holder, or null.
const loans = new Map([
  ["tent", null],
  ["stove", null],
  ["lantern", "Priya"],
  ["kayak", null],
]);

// A journal that appends to journal.txt. A file descriptor is a real
// resource: one left open for every run is a leak.
function fileJournal(path) {
  let fd;
  return {
    open() { fd = openSync(path, "a"); },
    write(line) { writeSync(fd, line + "\n"); },
    close() { closeSync(fd); },
  };
}

const path = process.argv[2];
if (path === undefined) {
  console.error("usage: node src/cli.js <script file>");
  process.exitCode = 2;
} else {
  let text;
  try {
    text = loadScript(path);
  } catch (e) {
    // Only loadScript is inside this try.
    console.error(e.message);
    if (e.cause) console.error(`  because: ${e.cause.message}`);
    process.exitCode = 1;
  }

  if (text !== undefined) {
    // No try here.
    const { done, problems } = runScript(text, loans, fileJournal("journal.txt"));
    for (const line of done) console.log(line);
    for (const p of problems) console.log(`line ${p.line}: ${p.message}`);
    console.log(`${done.length} done, ${problems.length} problem(s)`);
  }
}
