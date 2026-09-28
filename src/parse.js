/* Task 2 — turning one line a person typed into a command. People mistype, so a
   line that does not make sense is an ordinary result here, not an
   exception: parseCommand RETURNS its failures. */

/**
 * parseCommand(text) → a result object. It never throws, whatever it is given.
 *
 * The three commands, words separated by any amount of whitespace:
 *
 *   lend <item> <member>   → { ok: true, value: { verb: "lend", item, member } }
 *   return <item>          → { ok: true, value: { verb: "return", item } }
 *   status <item>          → { ok: true, value: { verb: "status", item } }
 *
 * Anything else → { ok: false, error: <a message a person can act on> }.
 * The message quotes what was wrong: an unknown verb names that verb; a
 * command with the wrong number of words quotes the line.
 *
 * @param {unknown} text
 * @returns {{ ok: true, value: object } | { ok: false, error: string }}
 */
export function parseCommand(text) {
  throw new Error("not implemented");
}
