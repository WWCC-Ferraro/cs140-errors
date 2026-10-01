# Gear locker

## What you are building

An outdoor club keeps its gear in a locker: a tent, a stove, a lantern, a kayak.
A volunteer types the day's loans into a small script, one command per line:

```text
lend tent Sam
status lantern
return tent
```

You are building the program that runs those scripts. Most of it is about what
happens when a line cannot be done. People mistype. They lend a lantern someone
already has. They name a canoe the club does not own. Now and then the program
itself is wrong.

Each of those failures needs a different answer. Some are returned, some are
thrown. Some are recorded and the run carries on, and some should stop it
loudly. The journal file has to be closed whichever way the run ends. Getting
that right needs all of this module together: what kind of failure it is, where
it travels, where it is handled, whether it is thrown or returned, and what runs
on the way out.

The program is five small modules in `src/`:

| File | What it does | Task |
|---|---|---|
| `errors.js` | the error types this program throws | 1 |
| `parse.js` | turns one typed line into a command, or a reason it is not one | 2 |
| `loans.js` | applies one command to the locker | 3 |
| `run.js` | runs a whole script and reports on it | 4, 5 |
| `load.js` | reads a script from a file (Node only) | 6 |

`src/cli.js` is written for you. It is the program's top level, and it runs in
Node only.

## Getting started

1. Open **your repository**. It is made for you: private, and named for this
   homework, the term and your username — `<term>-cs140-errors-<you>`. On
   [this homework's page](https://wwcc.dev/#/lesson/errors-assignment), type your GitHub
   username and click **Open my Codespace**. On your own computer, clone it
   with GitHub Desktop (**Code**, then **Open with GitHub Desktop**) and check
   that `node --version` prints 22 or later. The lesson *How a homework works*
   walks through both.
2. Run the tests:

   ```text
   npm test
   ```

   Almost all of them fail. That is the starting point. There is nothing to
   install.

The tests run again on every push, and the result shows on your repository's
**Actions** tab. The tests are part of the spec. Each file in `test/` is named
for its task. When one fails, read its message: it says what was expected, what
came back, and which lesson to look at.

Once Task 4 passes, you can run a real script:

```text
node src/cli.js test/fixtures/weekend.txt
```

## Using an AI assistant

`AGENTS.md` in this repository tells AI coding assistants how this course wants
them to help: as a tutor who explains errors, asks questions and gives hints,
not by writing your answers. Most assistants read it automatically. It is in
the open, so read it too. It says what good AI help looks like.

## The tasks

Do them in order. Each builds on the one before. The contract for every function
is in the comment above it in `src/` — read that before you start a task.

### 1. Errors a caller can act on

In `src/errors.js`, write the three constructors: `UnknownItem`, `LoanConflict`
and `ScriptError`.

Each one needs a message that says what failed, with the value. Each needs a
`name` a caller can check. `ScriptError` also keeps the error that caused it.

Tests: `test/1-errors.test.js`.

### 2. A failure returned as a value

In `src/parse.js`, write `parseCommand(text)`. It turns one line into a
command, or into a reason it is not one:

```js
parseCommand("lend tent Sam")    // { ok: true, value: { verb: "lend", item: "tent", member: "Sam" } }
parseCommand("borrow kayak Ana") // { ok: false, error: 'unknown command "borrow"' }
```

It **returns** its failures. It never throws, whatever it is given. Your
wording for `error` can differ from the one above, as long as it does what the
contract says.

Tests: `test/2-parse.test.js`.

### 3. Throwing what a caller can tell apart

In `src/loans.js`, write `applyCommand(loans, command)`. The locker is a `Map`
from item to holder, with `null` for an item on the shelf.

This one **throws**: `UnknownItem` for an item the club does not have, and
`LoanConflict` for a lend or a return that cannot happen. A command that throws
must leave the locker as it was.

Tests: `test/3-loans.test.js`.

### 4. Handling it where you can act

In `src/run.js`, finish `runScript(text, loans, journal)`. The loop and the
skipping of blank lines and comments are written. You write what happens to
each line.

A line that does not parse, an unknown item, and a loan conflict are all **bad
lines**. `runScript` records each one in `problems`, with its line number, and
carries on. It is the first level that knows it is running a whole script.

Anything else is not a bad line. It means the program is wrong. `runScript` has
no plan for it, so it must not file it under `problems`. It adds the one thing
it knows — the line number — as a `ScriptError`, keeps the original as the
cause, and lets it go on up.

Tests: `test/4-run.test.js`.

### 5. Closing the journal on every way out

Still in `runScript`: open the journal once, before the first line. Close it
exactly once, after the last write, however `runScript` ends — by returning or
by throwing.

If `journal.open()` itself throws, there is nothing to close. That error goes to
the caller as it is.

Tests: `test/5-journal.test.js`.

### 6. Adding context on the way past

In `src/load.js`, finish `loadScript(path, read)`. It already reads a file.
Make it fail well. When the read throws, throw a new error that names the path
and keeps the reader's error as its cause.

`loadScript` uses Node's `readFileSync`, so it runs in Node only. The tests hand
it their own `read` function, or read a file inside this repository.

Then open `src/cli.js` and find where a failed load is caught. You need it for
question 2.

Tests: `test/6-load.test.js`.

### 7. Your answers

Answer the four questions in **Your answers**, at the end of this file. A few
sentences each. These are read by a person, not by the tests.

## The review

`review/import-members.js` was written by an AI assistant, from the request
quoted at the top of the file. It runs, and it looks careful. It has more than
one defect.

Review it in `REVIEW.md`. For each defect you find, write:

- **Where** — the line numbers.
- **What goes wrong** — what the code does, and why that is a problem.
- **An input that shows it** — a concrete file, roster or audit log, and what
  happens with it.
- **The fix** — the change you would make, as code or in a sentence.

Write it as a review a teammate could act on. Most of the defects are about this
module. One is from earlier in the course.

The tests do not check `REVIEW.md`. A person reads it.

## What done means

- `npm test` passes: every test, locally and on your latest push.
- `REVIEW.md` has a review of each defect you found.
- Every question in **Your answers** has an answer.

## Your answers

### 1. Throw or return

`parseCommand` returns its failures. `applyCommand` throws them. Say why each
choice fits that function. Use how often each one fails, and what happens when a
caller forgets to check.

*Your answer:*

### 2. Where each failure is handled

Follow a `LoanConflict` from the line that throws it to the line that deals with
it. Why is `runScript` the right level to decide what it means, and not
`applyCommand`? Then do the same for a missing script file, which `cli.js`
catches. Finally, say why `cli.js` does **not** catch a `ScriptError`. Is that
failure recoverable or unrecoverable? Defend it.

*Your answer:*

### 3. Cleanup

Say which ways out of `runScript` your `finally` covers, and what would go wrong
in `cli.js` if one of them skipped `journal.close()`. Then name the construct
your language offers for scoped disposal. Say whether you would use it for the
journal in code a team maintains today, and why.

*Your answer:*

### 4. A log line that decides

A volunteer runs a script. At the end, `status tent` prints
`tent is on the shelf`. But the script has `lend tent Sam` on line 4, and the
report lists no problem on line 4. There are two explanations:

- **A** — line 4 ran, and a later line in the script returned the tent.
- **B** — line 4 never reached `applyCommand`. `runScript` skipped it.

First, write one log line that **cannot** tell A from B, and say why. Then write
one log line that **can**. Say where in `run.js` it goes, and what it prints
under A and under B.

*Your answer:*
