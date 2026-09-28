// Task 6 — adding context on the way past. Node only: load.js uses node:fs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { loadScript } from "../src/load.js";

const fixture = fileURLToPath(new URL("./fixtures/weekend.txt", import.meta.url));

test("loadScript reads a file with Node's reader by default", () => {
  const text = loadScript(fixture);
  assert.ok(text.startsWith("# Saturday at the gear locker"), "loadScript(path) should return the file's text.");
});

test("loadScript uses the reader it is given", () => {
  assert.equal(loadScript("any/path.txt", p => `read ${p}`), "read any/path.txt");
});

test("a failed read throws an error that names the path and keeps the cause", () => {
  const original = Object.assign(new Error("ENOENT: no such file or directory"), { code: "ENOENT" });
  const reader = () => { throw original; };
  let thrown;
  try { loadScript("scripts/sunday.txt", reader); } catch (e) { thrown = e; }
  assert.ok(thrown, "loadScript returned normally even though the reader threw.");
  assert.ok(String(thrown.message).includes("scripts/sunday.txt"),
    `The message was ${JSON.stringify(thrown.message)}. The reader's error does not say what was being attempted; this level can — name the path.`);
  assert.ok(thrown !== original, "loadScript let the reader's error through untouched. Add what this level knows, in a new error.");
  assert.ok(thrown.cause === original, "The new error's cause is not the reader's error. Keep it with { cause: e }.");
});
