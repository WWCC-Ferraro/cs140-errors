// Task 4 — handling each failure at the level that can act on it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runScript } from "../src/run.js";
import { ScriptError } from "../src/errors.js";

const quietJournal = () => ({ open() {}, write() {}, close() {} });
const locker = () => new Map([["tent", null], ["stove", null], ["lantern", "Priya"], ["kayak", null]]);
const weekend = readFileSync(new URL("./fixtures/weekend.txt", import.meta.url), "utf8");

test("good lines are applied, in order, and listed in done", () => {
  const loans = locker();
  const { done } = runScript("lend tent Sam\nstatus tent\nreturn tent", loans, quietJournal());
  assert.deepEqual(done, ["lent tent to Sam", "tent is lent to Sam", "tent returned"],
    "done should hold what applyCommand returned for each line that worked, in script order.");
  assert.equal(loans.get("tent"), null);
});

test("a line that does not parse becomes a problem with its line number, and the run carries on", () => {
  const { done, problems } = runScript("lend tent Sam\nborrow kayak Ana\nlend stove Sam", locker(), quietJournal());
  assert.equal(problems.length, 1, `Expected one problem, got ${JSON.stringify(problems)}.`);
  assert.equal(problems[0].line, 2, `The bad line is line 2; the problem says line ${problems[0].line}.`);
  assert.ok(problems[0].message.includes("borrow"), `The problem's message was ${JSON.stringify(problems[0].message)} — pass on parseCommand's error.`);
  assert.deepEqual(done, ["lent tent to Sam", "lent stove to Sam"],
    "A bad line must not stop the lines after it. parseCommand returns its failure; look at the result before using .value.");
});

test("UnknownItem and LoanConflict become problems, and the run carries on", () => {
  const { done, problems } = runScript("lend canoe Jo\nlend lantern Ana\nreturn kayak\nlend kayak Ana", locker(), quietJournal());
  assert.deepEqual(problems.map(p => p.line), [1, 2, 3],
    `Expected problems on lines 1, 2 and 3, got ${JSON.stringify(problems)}. A failure the runner has a plan for — a bad line — is recorded where the runner can see all the lines.`);
  assert.ok(problems[0].message.includes("canoe") && problems[1].message.includes("Priya"),
    `The messages were ${JSON.stringify(problems.map(p => p.message))}. Use the caught error's own message.`);
  assert.deepEqual(done, ["lent kayak to Ana"], "The last line is fine and should still run.");
});

test("line numbers count blank lines and comments, which are skipped", () => {
  const { done, problems } = runScript(weekend, locker(), quietJournal());
  assert.deepEqual(done, ["lent tent to Sam", "lent stove to Sam", "lantern is lent to Priya", "tent returned"],
    "Run test/fixtures/weekend.txt through `node src/cli.js` and compare with the list of lines that should work.");
  assert.deepEqual(problems.map(p => p.line), [5, 6, 9, 10],
    `weekend.txt has problems on lines 5, 6, 9 and 10; got ${JSON.stringify(problems.map(p => p.line))}. Line numbers count every line of the file.`);
});

test("a failure with no plan is not a bad line: it is thrown as a ScriptError", () => {
  const bug = new TypeError("Cannot read properties of undefined");
  const broken = new Map([["tent", null]]);
  broken.get = () => { throw bug; };
  let thrown;
  try {
    const report = runScript("# one comment\nstatus tent", broken, quietJournal());
    assert.fail(`runScript returned ${JSON.stringify(report)}. The TypeError is a bug, not a bad line: filing it under problems hides it. See: Where an error should be handled — a catch that handles one failure must send the rest on.`);
  } catch (e) {
    if (e instanceof assert.AssertionError) throw e;
    thrown = e;
  }
  assert.ok(thrown instanceof ScriptError,
    `runScript threw ${thrown?.name}, not a ScriptError. On its way up, this level adds the one thing it knows — the line — as a ScriptError.`);
  assert.equal(thrown.line, 2, `The failure happened on line 2; the ScriptError says ${thrown.line}.`);
  assert.ok(thrown.cause === bug, "The ScriptError's cause is not the original TypeError. Keep it — { cause: e } — or the trace loses what actually broke.");
});
