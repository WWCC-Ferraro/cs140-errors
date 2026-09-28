/* Tasks 4 and 5 — running a whole script: the level that knows it is working through many
   lines, and so the level that can decide what one bad line means. */
import { parseCommand } from "./parse.js";
import { applyCommand } from "./loans.js";
import { UnknownItem, LoanConflict, ScriptError } from "./errors.js";

/**
 * runScript(text, loans, journal) → { done, problems }
 *
 * Runs each line of `text` in order. Line numbers start at 1 and count
 * every line, including the ones skipped. A line that is blank, or whose
 * first non-space character is "#", is skipped.
 *
 * For every other line:
 *   - it does not parse           → { line, message: <the parse error> } goes in problems
 *   - applyCommand throws UnknownItem or LoanConflict
 *                                 → { line, message: <the error's message> } goes in problems
 *   - applyCommand succeeds       → its line goes in done, and to journal.write
 * A problem never stops the lines after it.
 *
 * Anything else that goes wrong while running a line is not a bad line —
 * it is a failure this function has no plan for. Throw a ScriptError for
 * that line number, with the original error as its cause.
 *
 * The journal: call journal.open() once before the first line. Call
 * journal.close() exactly once, after the last write, however this function
 * ends — returning or throwing. If journal.open() itself throws, that error
 * reaches the caller unchanged and close is not called.
 *
 * @returns {{ done: string[], problems: { line: number, message: string }[] }}
 */
export function runScript(text, loans, journal) {
  const done = [];
  const problems = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = i + 1;
    const source = lines[i].trim();
    if (source === "" || source.startsWith("#")) continue;

    // Task 4: parse `source`, apply it, and decide here what each kind of
    //         failure means for a script run.
  }
  // Task 5: the journal — opened once, closed on every way out.
  return { done, problems };
}
