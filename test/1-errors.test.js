// Task 1 — errors a caller can act on.
import { test } from "node:test";
import assert from "node:assert/strict";
import { UnknownItem, LoanConflict, ScriptError } from "../src/errors.js";

test("UnknownItem is an Error a caller can tell apart", () => {
  const e = new UnknownItem("canoe");
  assert.ok(e instanceof Error,
    "new UnknownItem(...) is not an Error. It needs `extends Error`, and its constructor must call super(...) first. See: Recoverable and unrecoverable failure.");
  assert.ok(e instanceof UnknownItem, "new UnknownItem(...) is not an instance of UnknownItem.");
  assert.equal(e.name, "UnknownItem",
    `e.name is ${JSON.stringify(e.name)}. The class name does not set name: every subclass says "Error" until its constructor sets this.name.`);
});

test("UnknownItem says which item, and keeps it as .item", () => {
  const e = new UnknownItem("canoe");
  assert.ok(String(e.message).includes("canoe"),
    `The message was ${JSON.stringify(e.message)}. A caller reading it cannot tell which item was missing — put the value that failed into the message.`);
  assert.equal(e.item, "canoe", `e.item is ${JSON.stringify(e.item)}; the spec keeps the item as a property, so code can use it without reading the message.`);
});

test("LoanConflict is its own type, with the item and the detail in its message", () => {
  const e = new LoanConflict("tent", "already lent to Sam");
  assert.ok(e instanceof Error, "new LoanConflict(...) is not an Error. Check `extends Error` and super(...).");
  assert.equal(e.name, "LoanConflict", `e.name is ${JSON.stringify(e.name)}; set this.name in the constructor, after super(...).`);
  assert.ok(!(e instanceof UnknownItem), "A LoanConflict must not also be an UnknownItem — a caller has to be able to tell the two apart.");
  assert.ok(String(e.message).includes("tent") && String(e.message).includes("already lent to Sam"),
    `The message was ${JSON.stringify(e.message)}. It should name the item and carry the detail it was given.`);
  assert.equal(e.item, "tent", `e.item is ${JSON.stringify(e.item)}, expected "tent".`);
});

test("ScriptError says which line, and keeps .line", () => {
  const e = new ScriptError(7, new TypeError("x is undefined"));
  assert.ok(e instanceof Error, "new ScriptError(...) is not an Error.");
  assert.equal(e.name, "ScriptError", `e.name is ${JSON.stringify(e.name)}; set this.name.`);
  assert.equal(e.line, 7, `e.line is ${JSON.stringify(e.line)}, expected 7.`);
  assert.match(String(e.message), /\b7\b/, `The message was ${JSON.stringify(e.message)}. Adding context means the message says what this level knows — which line.`);
});

test("ScriptError keeps the original error as its cause — the same object", () => {
  const original = new TypeError("x is undefined");
  const e = new ScriptError(3, original);
  assert.ok(e.cause === original,
    "e.cause is not the error that was passed in. Hand it to super(...) in the options object: { cause }. Without it, the trace no longer shows what actually broke. See: Recoverable and unrecoverable failure, 'The original cause, kept'.");
});
