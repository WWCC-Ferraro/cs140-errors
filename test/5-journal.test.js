// Task 5 — cleanup that runs on every way out.
import { test } from "node:test";
import assert from "node:assert/strict";
import { runScript } from "../src/run.js";

// A journal that records every call made to it, in order.
function recordingJournal({ failOpen = false, failWrite = false } = {}) {
  const calls = [];
  return {
    calls,
    open() { calls.push("open"); if (failOpen) throw new Error("journal is locked"); },
    write(line) { calls.push(`write ${line}`); if (failWrite) throw new Error("disk full"); },
    close() { calls.push("close"); },
  };
}
const locker = () => new Map([["tent", null], ["stove", null]]);

test("the journal is opened once, written for each line that worked, then closed once", () => {
  const j = recordingJournal();
  runScript("lend tent Sam\nlend canoe Jo\nlend stove Sam", locker(), j);
  assert.deepEqual(j.calls, ["open", "write lent tent to Sam", "write lent stove to Sam", "close"],
    `The journal saw ${JSON.stringify(j.calls)}. Open before the first line, write only lines that worked, close after the last write.`);
});

test("an empty script still opens and closes the journal", () => {
  const j = recordingJournal();
  runScript("", locker(), j);
  assert.deepEqual(j.calls, ["open", "close"], `The journal saw ${JSON.stringify(j.calls)}.`);
});

test("the journal is closed when a failure with no plan leaves runScript", () => {
  const j = recordingJournal();
  const broken = new Map([["tent", null]]);
  broken.get = () => { throw new TypeError("boom"); };
  assert.throws(() => runScript("status tent", broken, j), "runScript should have thrown — see Task 4.");
  assert.deepEqual(j.calls.filter(c => c === "close"), ["close"],
    `The journal saw ${JSON.stringify(j.calls)}. A throw leaves runScript without running the lines after it — cleanup written after the loop never runs. Which construct runs on every way out? See: Cleanup on every way out.`);
});

test("the journal is closed when writing to it fails, and the failure still reaches the caller", () => {
  const j = recordingJournal({ failWrite: true });
  assert.throws(() => runScript("lend tent Sam", locker(), j),
    e => e.message.includes("disk full") || e.cause?.message === "disk full",
    "A journal that cannot be written to is not a bad line. The failure should reach the caller (wrapped with the line number or not).");
  assert.equal(j.calls.at(-1), "close", `The journal saw ${JSON.stringify(j.calls)}; the last call should be close.`);
});

test("if the journal cannot be opened, its error reaches the caller unchanged and close is not called", () => {
  const j = recordingJournal({ failOpen: true });
  assert.throws(() => runScript("lend tent Sam", locker(), j),
    e => e.message === "journal is locked",
    "The error from open() should reach the caller as it is. runScript has no plan for it, and nothing to add.");
  assert.deepEqual(j.calls, ["open"],
    `The journal saw ${JSON.stringify(j.calls)}. Closing something that never opened is a new bug: acquire before the try, not inside it. See: Cleanup on every way out.`);
});
