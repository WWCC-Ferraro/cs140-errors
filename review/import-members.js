// Written by an AI assistant. The club asked it for this:
//
//   "Add new members from the sign-up sheet export. Each line is
//    name,email. Return the updated roster and leave the one passed in
//    alone. Record every member added in the audit log, and make sure the
//    audit log is always closed."
//
// It is illustrative — not a real transcript. readFileSync is Node's.
// Nothing runs this file; it is here to be reviewed.

import { readFileSync } from "node:fs";

export function importMembers(path, roster, audit) {
  audit.open();

  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch (e) {
    throw new Error("import failed");
  }

  const updated = roster;
  const rows = text.split("\n");
  for (let i = 0; i < rows.length; i++) {
    try {
      const [name, email] = rows[i].split(",");
      if (!email.includes("@")) {
        throw new RangeError(`line ${i + 1}: not an email address: ${email}`);
      }
      updated.push({ name: name.trim(), email: email.trim() });
      audit.write(`added ${name.trim()}`);
    } catch (e) {
      console.log("skipping bad line", i + 1);
    }
  }

  audit.close();
  return updated;
}
