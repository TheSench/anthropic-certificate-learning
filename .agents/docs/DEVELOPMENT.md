# DEVELOPMENT.md — Change-Type Playbooks

## Add or edit a session prompt

1. Locate `prompts/tier<N>/<NN>-<slug>.md`
2. Edit, keeping the section structure in [`GUIDELINES.md`](GUIDELINES.md) § Prompt file structure
3. Verify every URL under `## Authoritative sources` still resolves — run
   `.agents/check-sources.sh` (checks all ~210 URLs in ~20s, exits non-zero on any
   failure and prints the source file:line). Worth running monthly even when no prompt
   file changed: the nine version-pinned model URLs it flags at the end expire on their
   own when the model line advances.
4. New session: add it to the session sequence table in `.agents/TUTORIAL.md`, and
   renumber later rows in that tier
5. Human review before committing

## Promote a trap into the inventory

Sessions log the wrong answers that tempted the learner under `**Distractor patterns:**`.
Agents don't edit `TRAPS.md`; a human promotes the durable ones.

1. Read the `Distractor patterns` lines across recent session logs. A pattern that appears
   in two or more sessions, or in a domain the learner is weak in, is worth promoting
2. Decide whether it's an instance of an existing **bias family** — add it as a row there
   if so, and only open a new family if it genuinely doesn't fit one of the seven
3. Write the **tell**, not just the trap. An entry without a tell fails gate 4 for every
   item built from it, which defeats the purpose
4. Keep it at the level of the reasoning error. Traps naming a flag, limit, price, or
   model ID rot with the product — those belong in the prompt file's cited docs
5. Commit: `Traps: [what was added]`

Deletions matter too: a distractor that's no longer tempting because the product changed
is a throwaway option, and leaving it listed degrades every item that draws on it.

## Refresh the exam blueprint

Do this before any exam booking, and whenever Anthropic announces certification changes.

1. Re-check the official program page and any published exam guide for domain weights,
   item counts, duration, passing score, and format
2. Update `BLUEPRINT.md` — including the verification-note date
3. If weights moved materially, re-check that session counts per domain are still
   roughly proportional; add or drop sessions as needed
4. If a domain was added or removed, update: the session sequence in `.agents/TUTORIAL.md`,
   the relevance and readiness templates, and the domain codes in `GUIDELINES.md`

## Refresh the documentation map

Product docs move. When a cited URL 404s or redirects:

1. Pull the current index: `curl -sSL https://code.claude.com/docs/llms.txt` and
   `curl -sSL https://platform.claude.com/llms.txt`
2. Find the new path, update `BLUEPRINT.md` § Documentation map and any prompt files citing it
3. Note in the commit which docs moved, so future sessions aren't surprised

## Fix a doc discrepancy logged by a session

Sessions log contradictions between prompt files and live docs under
`**Doc discrepancies:**`.

1. Read the session log entry
2. Verify against the live doc yourself
3. Correct the prompt file; if the concept shifted rather than a detail, revisit the
   session's teaching objectives too
4. Commit: `Fix: [prompt file] — [what was stale]`

## Edit learner state by hand

1. Read the current file
2. Make the targeted edit
3. Commit: `Manual correction: [brief description]`

Recompute `learner/readiness.md`'s projected score if you change any confidence value.

## Add a scenario archetype

Only if the exam's scenario pool changes.

1. Add it to `BLUEPRINT.md` § Scenario archetypes and `.agents/TUTORIAL.md` § Scenario archetypes
2. Add a Tier 2 prompt file for it, and renumber later Tier 2 rows
3. Update the mock-exam draw count in `.agents/TUTORIAL.md` if the pool size changed

## Validation

No test runner. Verify manually:

- Send `Start` in a clean checkout → confirm the initialization flow runs and creates all
  four learner files
- Send `Continue` → confirm the agent picks the right next session per the Step 2 priority order
- Send `drill` with cards due → confirm no answers are revealed before the learner responds
- Send `mock` → confirm the rules statement, no mid-exam feedback, and a per-domain breakdown
- After any session → confirm the log, mastery score, readiness recompute, drill cards,
  glossary rows, regenerated charts, and commit all landed
- Confirm `learner/progress.md` mermaid blocks render
