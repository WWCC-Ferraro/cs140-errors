/* Task 3 — the locker itself. `loans` is a Map from item name to who has it:
   a member's name, or null when the item is on the shelf. */
import { UnknownItem, LoanConflict } from "./errors.js";

/**
 * applyCommand(loans, command) → a line describing what happened.
 *
 * command is a value parseCommand produced:
 *
 *   lend    → sets the holder,  returns "lent tent to Sam"
 *   return  → clears it,        returns "tent returned"
 *   status  → changes nothing,  returns "tent is on the shelf"
 *                                    or "tent is lent to Sam"
 *
 * Throws, and changes nothing, when the command cannot be done:
 *   - the item is not in `loans`             → UnknownItem
 *   - lending an item that is already lent   → LoanConflict, detail names the holder
 *   - returning an item that is on the shelf → LoanConflict
 * A verb parseCommand never produces is a bug in the caller: throw a
 * TypeError naming it — never an UnknownItem or a LoanConflict.
 *
 * Uses only loans.has, loans.get and loans.set.
 */
export function applyCommand(loans, command) {
  throw new Error("not implemented");
}
