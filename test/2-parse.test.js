// Task 2 — a failure returned as a value.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCommand } from "../src/parse.js";

test("a lend line parses to verb, item and member", () => {
  assert.deepEqual(parseCommand("lend tent Sam"),
    { ok: true, value: { verb: "lend", item: "tent", member: "Sam" } },
    "Read the contract in parse.js for the exact shape of a successful result.");
});

test("return and status lines parse to verb and item only", () => {
  assert.deepEqual(parseCommand("return tent"), { ok: true, value: { verb: "return", item: "tent" } },
    "A return command has no member. Check the shape in the contract — no extra properties.");
  assert.deepEqual(parseCommand("status kayak"), { ok: true, value: { verb: "status", item: "kayak" } });
});

test("extra spaces and tabs between words do not matter", () => {
  assert.deepEqual(parseCommand("  lend \t tent   Sam  "),
    { ok: true, value: { verb: "lend", item: "tent", member: "Sam" } },
    "Words are separated by any amount of whitespace. Splitting on a single space leaves empty words behind.");
});

test("an unknown verb is returned as a failure that names the verb", () => {
  const r = parseCommand("borrow kayak Ana");
  assert.equal(r.ok, false, `Got ${JSON.stringify(r)}. "borrow" is not one of the three commands.`);
  assert.ok(typeof r.error === "string" && r.error.includes("borrow"),
    `The error was ${JSON.stringify(r.error)}. Whoever reads the problem list needs to see which word was wrong.`);
});

test("the wrong number of words is returned as a failure that quotes the line", () => {
  for (const line of ["lend tent", "return", "status tent now", "lend tent Sam Ana"]) {
    const r = parseCommand(line);
    assert.equal(r.ok, false, `parseCommand(${JSON.stringify(line)}) gave ${JSON.stringify(r)}; each command takes an exact number of words.`);
    assert.ok(typeof r.error === "string" && r.error.includes(line),
      `parseCommand(${JSON.stringify(line)}) gave the error ${JSON.stringify(r.error)}. Quote the line, so a person can find it.`);
  }
});

test("a bad line never throws — whatever it is", () => {
  for (const input of ["", "   ", "\t", "lend", "LEND tent Sam", undefined, null, 42, {}]) {
    let r;
    assert.doesNotThrow(() => { r = parseCommand(input); },
      `parseCommand(${JSON.stringify(input) ?? "undefined"}) threw. A function that returns its failures must never throw for bad input, including input you did not think of. See: Returning a failure instead of throwing.`);
    assert.equal(r?.ok, false, `parseCommand(${JSON.stringify(input) ?? "undefined"}) gave ${JSON.stringify(r)}; expected a failure result.`);
    assert.equal(typeof r.error, "string", `parseCommand(${JSON.stringify(input) ?? "undefined"}) failed without a reason. A result object carries why.`);
  }
});
