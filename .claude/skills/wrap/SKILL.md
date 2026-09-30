---
name: wrap
description: Record and commit a finished tutorial session — session log, mastery, review queue, readiness, drill cards, glossary, progress chart, then verify every file actually changed before committing. Use at the end of any teaching, drill, or mock session in this repo, or when the learner says "wrap", "save", or "we're done".
allowed-tools: Bash, Read, Edit, Write, Agent
---

# Wrap a session

This is Step 5 of `.agents/TUTORIAL.md`, run as a skill so the full checklist arrives
fresh at the end of a long session instead of being recalled from 40K characters back.

**Why this exists:** a completed 43,000-character session once wrote `profile.md` and
`readiness.md`, then stopped — no drill cards, no glossary, no progress chart, no
commit. The teaching happened and the durable output was lost. Everything the learner
missed that day never became a drill card.

So: **work in three checkpoints, and verify before claiming success.** Do not ask
permission at any point — write the files.

Create a todo per checkpoint below, and one per file in checkpoint 2.

---

## Checkpoint 1 — Learner state (`learner/profile.md`, `learner/readiness.md`)

Follow `.agents/TUTORIAL.md` §5a–5d for exact formats. In brief:

1. **Session log** — append under `## Session log` (or `learner/sessions/<tier>-<NN>-<slug>.md`
   once that folder has files). Fill every field in the 5a template. `Distractor patterns`
   is the highest-signal field in the system — be specific about *which* wrong answers
   tempted the learner and why.
2. **Mastery** — set or update the topic's row in `## Topic mastery` (1–4). Score on drill
   performance and follow-ups, never on completion alone. Score 4 requires reasoning
   correctly about why distractors were wrong.
3. **Review queue** — any topic scoring 1 or 2 gets a row, `Due at session` = current + 3.
4. **Readiness** — update `learner/readiness.md`, recompute
   `projected = 100 + 9 × Σ(weight × confidence)`, and name the domain with the largest
   weight × shortfall.
5. **Instructor corrections** — if you voided a drill item, retracted a claim, or
   withdrew a graded miss this session, update `## Instructor corrections` in
   `learner/profile.md` (above `## Session log`, so Step 1's loader reads it back).

   **Fold the new instance into an existing rule wherever one covers it** — sharpen the
   rule or extend its evidence line. Add a bullet only for a genuinely new failure mode.
   This section is read at the start of every session, so it is bounded by design; the
   full history belongs in the commit message and the session log, not here.

**Gate — run this exact command and paste its output into your reply before continuing.**
Saying "checkpoint 1 verified" without the output below it does not count; a previous run
asserted both checkpoints without running either.

```bash
for f in learner/profile.md learner/readiness.md; do
  git diff --quiet "$f" && echo "NOT WRITTEN: $f" || echo "ok: $f"
done

# Corrections section, compared against HEAD. profile.md changes every session,
# so whole-file diff cannot see this section. Folding a new instance into an
# existing rule counts as updated — that is the intended shape, not appending.
sec() { sed -n '/^## Instructor corrections$/,/^## Session log$/p' "$1"; }
if diff <(git show HEAD:learner/profile.md | sec /dev/stdin) <(sec learner/profile.md) >/dev/null; then
  echo "corrections: UNCHANGED (ok only if nothing was voided or retracted)"
else
  echo "corrections: updated"
fi
```

Any `NOT WRITTEN` line means that file was never touched — go back and write it, then
re-run the gate. Two `ok:` lines is the only result that lets you move on.

For the corrections line, the question is not whether the section changed — it is whether
anything happened this session that *should* have changed it. Did you void a drill item,
retract a claim, or withdraw a graded miss?

- **No** — `corrections: UNCHANGED` is the correct result. Move on; most sessions are this.
- **Yes**, and `corrections: updated` — good. Folding the instance into an existing rule
  satisfies this; do not add a bullet to clear the gate.
- **Yes**, but `corrections: UNCHANGED` — stop. Answer in writing why that did not produce
  an update. A voided item with no corrections update is the same class of bug as a missed
  question with no drill card.

## Checkpoint 2 — Study materials (`drills/deck.md`, `learner/glossary.md`)

This is the checkpoint that gets dropped. It is also the one the learner's next session
depends on.

1. **Drill cards** — one for **every missed question**, plus anything self-flagged as
   shaky. Format and spacing schedule in §5e.
   - Next ID: `rg -o '^### \[D-[0-9]+\]' drills/deck.md | tail -1`
   - Check for a near-duplicate (`rg -i "keyword" drills/deck.md`) before adding. If one
     exists, reset its streak to 0 rather than adding a second card.
   - **A session where the learner missed something and no card was added is a bug.**
2. **Stand-alone check, by a reader who has only the cards.** You cannot run this check
   yourself. The scenario a card came from is still in your context, and it fills in
   whatever the stem dropped, so a card the learner cannot decide reads as decidable to
   you. Checking more carefully does not help: this defect was logged three times with that
   remedy, and a fresh-context reviewer then found 14 defective cards in one pass.

   List every card whose text changed this session: new cards, rewritten vignettes and
   edited tells. Streak, due and seen updates are excluded:

   ```bash
   cards() { awk '/^### \[D-[0-9]+\]/{id=$2} id && NF && !/^\*\*Domain:\*\*/ && !/^-+$/{print id "\t" $0}'; }
   diff <(git show HEAD:drills/deck.md | cards) <(cards < drills/deck.md) | awk '/^[<>]/{print $2}' | sort -u
   ```

   If it prints nothing, go on to the glossary. Otherwise dispatch one subagent with the
   prompt below, filling in the IDs. Tell it nothing about the session. It is useful
   because it knows only what the learner will see.

   > Read-only review; do not edit files. In `drills/deck.md`, read only cards [IDs]. Each
   > has a **Q** (stem and options), **A** (key), **Why** and **Distractor tell**, and the
   > learner sees only the Q. For each card, check:
   > (1) Is every fact the Why and the tell use to justify the key or kill an option
   > stated in the Q? Quote the phrase and say whether the Q carries it.
   > (2) Does the key depend on a quantity the Q omits?
   > (3) Does the Q state a constraint that decides nothing?
   > (4) Does the tell give every wrong option a kill?
   > A fact plainly implied by the Q is not a defect. Report only defective cards: the ID,
   > the check number, the quoted phrase, what the Q lacks, and a minimal repair. Repair
   > the Q when the key depends on the missing fact; repair the tell when the tell
   > over-claims.

   Check each finding against the card before applying it. The reviewer can be wrong, and
   it can report a problem as tell wording when the key itself depends on the missing fact.
   Apply what holds, and name what you rejected in the Report. If no subagent tool is
   available, say in the Report that the cards went unchecked. Do not substitute your own
   read.
3. **Glossary** — every term, acronym, config key, API parameter, and product name the
   session introduced or leaned on. Check each with `rg -i "term" learner/glossary.md`
   first. Full rules in §5f, including when a term earns a paragraph over a one-liner.
   Update the session range in the intro line.

**Gate — run this exact command and paste its output into your reply before continuing.**

```bash
for f in drills/deck.md learner/glossary.md; do
  git diff --quiet "$f" && echo "NOT WRITTEN: $f" || echo "ok: $f"
done
echo "--- cards now: $(rg -c '^### \[D-' drills/deck.md) ---"
```

A `NOT WRITTEN` line here is the exact failure this skill exists to catch. Before you
accept one, answer in writing: did the learner really miss nothing, and did the session
really introduce no new term? If either answer is no, go back and write the file, then
re-run the gate.

If the learner missed something, the card count must be higher than it was at the start
of the session **or** you must name the existing card whose streak you reset instead.

## Checkpoint 3 — Progress chart and commit

1. **Progress chart** — regenerate `learner/progress.md` per §5g: header line, readiness
   `xychart-beta`, domain readiness chart, and the current-tier `graph LR` chain with
   `done` / `next` / `pending` / `gate` classes.
2. **Verify everything before committing:**

   ```bash
   git status --short learner/ drills/
   ```

   Expect modifications to `profile.md`, `readiness.md`, `progress.md`, and — unless the
   session was flawless and introduced no terms — `deck.md` and `glossary.md`.

   **If a file you expected is missing from that list, go back and write it. Do not
   commit a partial session and do not report success.**

3. **Commit:**

   ```bash
   git add learner/ drills/
   git commit -m "Session log: [Session title] — [Domain] (YYYY-MM-DD)"
   ```

   For mocks: `git commit -m "Mock exam: [Foundations|Professional] — [scaled score] (YYYY-MM-DD)"`

   Only stage modified files. Don't ask — just commit.

   **Branch.** This commits to whatever branch is checked out — normally the learner's
   `learning` branch, created at Step 0.5 / Initialization. Being on `main` is not an
   error and never blocks the commit: record the session first, then mention once that
   moving to a learning branch (`git checkout -b learning`) makes harness updates merge
   cleanly. Never switch branches yourself mid-wrap — an uncommitted session is exactly
   what must not be moved. Do not `git push`; publishing is the learner's call.

4. **Confirm the commit landed:**

   ```bash
   git log --oneline -1 && git status --short learner/ drills/
   ```

   The log line should be this session's. The status should now be clean for those paths.

---

## Report

State plainly what was recorded — which files changed, how many drill cards were added,
how many glossary terms, and what the stand-alone check flagged, applied, and rejected. If anything was skipped, say which and why. Never report a
session as saved without having seen the commit in `git log`.

Then display the Step 6 closing message from `.agents/TUTORIAL.md` exactly as written
there, and nothing after it.
