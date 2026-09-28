/* Task 1 — the failures this program can report, each one built for
   whoever receives it. Replace each constructor body. */

/**
 * The script names an item the locker does not hold.
 *
 *   new UnknownItem("canoe")
 *     name     "UnknownItem"
 *     message  names the item, e.g. 'no item called "canoe"'
 *     item     "canoe"
 */
export class UnknownItem extends Error {
  constructor(item) {
    super();
    throw new Error("not implemented");
  }
}

/**
 * The command cannot be done to this item as things stand — lending
 * something already lent, returning something that is on the shelf.
 *
 *   new LoanConflict("tent", "already lent to Sam")
 *     name     "LoanConflict"
 *     message  the item, then the detail: "tent: already lent to Sam"
 *     item     "tent"
 */
export class LoanConflict extends Error {
  constructor(item, detail) {
    super();
    throw new Error("not implemented");
  }
}

/**
 * Something the script runner has no plan for went wrong while running
 * one line. It adds the one fact the runner knows — which line — and keeps
 * the original error as its cause.
 *
 *   new ScriptError(7, original)
 *     name     "ScriptError"
 *     message  says which line, e.g. "line 7: <original message>"
 *     line     7
 *     cause    original — the same object, not a copy
 */
export class ScriptError extends Error {
  constructor(line, cause) {
    super();
    throw new Error("not implemented");
  }
}
