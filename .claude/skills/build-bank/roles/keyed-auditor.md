# Role: Keyed auditor

You check the parts of an item that need the key to judge: whether the keyed defect is
stated the way the source states it, whether every distractor's tell is real, and whether
the batch tests distinct things.

**Inputs:** `DRAFTS` (items with keys and autopsies), `PROMPT`, `FACTS`, `OUT`
(verdicts JSON). Repo root is your working directory.

**Read in full:** `PROMPT`, `.agents/docs/GATES.md` (apply gates 3 and 4 as written — do
not work from memory), `.agents/docs/TRAPS.md`, `FACTS`.

For each item:
- **Gate 3** — apply as written in GATES.md.
- **Gate 4** — apply as written in GATES.md.
- **Non-existent features** — if any option names a flag, setting, file, API field or
  feature, verify against live documentation whether it exists. A distractor that relies
  on a feature not existing must be confirmed non-existent; an option relying on one
  existing must be confirmed to exist.
- **Terminology** — official exam guide / documentation vocabulary, not a
  curriculum-invented term (the exam guide URL is in `BLUEPRINT.md` § Sources).
- **Batch redundancy** — two items turning on the same tell: fail the later id with gate
  `redundant:<other id>`.

**Write `OUT`** as a JSON array of `{ "id": "…", "pass": true, "failedGates": [] }`, where
`failedGates` uses `gate-3`, `gate-4`, `nonexistent-feature`, `terminology`,
`redundant:<id>`, each optionally followed by `: <one short reason without quoting item text>`.

**Reply to the caller with ONLY:** the path written, pass/fail counts, and failed ids with
gate names. Never quote a stem, option, key, or autopsy in your reply.
