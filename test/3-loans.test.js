// Task 3 — throwing what a caller can tell apart.
import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCommand } from "../src/loans.js";
import { UnknownItem, LoanConflict } from "../src/errors.js";

const locker = () => new Map([["tent", null], ["lantern", "Priya"]]);

test("lend, return and status do what they say and describe it", () => {
  const loans = locker();
  assert.equal(applyCommand(loans, { verb: "lend", item: "tent", member: "Sam" }), "lent tent to Sam");
  assert.equal(loans.get("tent"), "Sam", "After lending, the Map should hold the member's name for that item.");
  assert.equal(applyCommand(loans, { verb: "status", item: "tent" }), "tent is lent to Sam");
  assert.equal(applyCommand(loans, { verb: "return", item: "tent" }), "tent returned");
  assert.equal(loans.get("tent"), null, "After a return the item is on the shelf: null.");
  assert.equal(applyCommand(loans, { verb: "status", item: "tent" }), "tent is on the shelf");
});

test("an item the locker does not hold throws UnknownItem", () => {
  for (const verb of ["lend", "return", "status"]) {
    assert.throws(() => applyCommand(locker(), { verb, item: "canoe", member: "Jo" }),
      e => e instanceof UnknownItem && e.item === "canoe",
      `${verb} on "canoe" should throw an UnknownItem for "canoe". A caller that handles unknown items has to be able to recognise this one.`);
  }
});

test("lending an item that is out throws LoanConflict naming who has it", () => {
  assert.throws(() => applyCommand(locker(), { verb: "lend", item: "lantern", member: "Ana" }),
    e => e instanceof LoanConflict && e.message.includes("lantern") && e.message.includes("Priya"),
    "Lending the lantern, which Priya has, should throw a LoanConflict whose message names the lantern and Priya — the facts a person needs to sort it out.");
});

test("returning an item on the shelf throws LoanConflict", () => {
  assert.throws(() => applyCommand(locker(), { verb: "return", item: "tent" }),
    e => e instanceof LoanConflict && e.message.includes("tent"),
    "Returning the tent, which nobody has, should throw a LoanConflict that names the tent.");
});

test("a command that fails changes nothing", () => {
  const loans = locker();
  try { applyCommand(loans, { verb: "lend", item: "lantern", member: "Ana" }); } catch { /* expected */ }
  try { applyCommand(loans, { verb: "return", item: "tent" }); } catch { /* expected */ }
  assert.deepEqual([...loans], [["tent", null], ["lantern", "Priya"]],
    "A command that threw still changed the locker. Check every condition before the line that sets anything.");
});

test("a verb parseCommand never produces is a bug: TypeError, not a loan problem", () => {
  assert.throws(() => applyCommand(locker(), { verb: "borrow", item: "tent" }),
    e => e instanceof TypeError,
    "An unknown verb here means the calling code is wrong — throw a TypeError. If it were an UnknownItem or a LoanConflict, the runner would file a bug under 'bad line'. See: Recoverable and unrecoverable failure.");
});
