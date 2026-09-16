# Migrating learner state across curriculum restructures

**Read this if a session-start sync reported that `prompts/` or `.agents/` changed and the
session sequence no longer matches what your `learner/` files describe.**

A sync merge can succeed with zero conflicts and still leave your progress wrong. The
harness splits ownership — you own `learner/**` and `drills/deck.md`, upstream owns
`prompts/**` and `.agents/**` (see [`AGENTS.md`](AGENTS.md) § File ownership) — so git
never sees two edits to one file and never raises a conflict. That split is what keeps
ordinary updates painless. It is also why a *restructure* slips through silently: your
files still say "session 7 is next" after session 7 became something else.

**Symptoms.** Any one of these means you are in scope:

- A session number in `learner/progress.md` or `learner/readiness.md` has no matching row
  in [`.agents/SEQUENCE.md`](.agents/SEQUENCE.md).
- A `prompts/tier1/NN-*.md` filename cited in your learner files no longer exists.
- Your session-log titles don't match the titles in `SEQUENCE.md` at those numbers.
- The Tier 1 session count in `learner/profile.md` § Progress disagrees with `SEQUENCE.md`.

**What this is not.** Ordinary content updates — a sharpened prompt, a re-verified doc URL,
a new trap — need nothing from you. Prompt files cite live docs rather than restating
product facts, so product drift is absorbed at session time. Only structural changes to the
sequence, the numbering, or the scoring unit need a migration.

---

## Run it

Paste this to your tutor agent in this repo:

```
Read MIGRATION.md and migrate my learner files to the current curriculum structure.
```

The agent does the work, commits it, and stops — migrating is a session of its own, not a
preamble to teaching. Read the commit, then send `Continue` to study.

The rest of this file is the procedure it follows — read on if you want to check it, or if
you are doing it by hand.

**Before starting:** commit or stash anything uncommitted in `learner/` and `drills/`, and
tag your current state so the migration is reversible.

```bash
git tag pre-migration-$(date +%Y%m%d)
```

---

## Procedure

### 1. Build the session map

Do this before editing anything; every later step depends on it.

For each session recorded in `learner/profile.md` § Session log, match it to the current
sequence **by title and content, never by number**. Numbers are the thing that moved.

```bash
grep -n "^### .* — .* · 20" learner/profile.md     # your completed sessions
grep -n "^| " .agents/SEQUENCE.md                  # the current sequence
```

Write the result as a table — old number, title, new number, new file, and the task
statements that session now owns per [`BLUEPRINT.md`](BLUEPRINT.md) § Task statements.
Three cases need care:

| Case | How to tell | What it means |
|---|---|---|
| **Renumbered** | Same title, different number | Bookkeeping only. Update references. |
| **Split** | One old session's topics now span two rows | Coverage is partial. Only the statements actually taught count. |
| **Dropped** | No current row carries the topic | Mastery stays, coverage does not. See below. |

Also check for **backfill gaps**: a current session, numbered *below* ones you have
completed, that you never took. Resequencing by dependency moves material earlier, so a gap
can open behind you. These are the highest priority — later sessions were sequenced assuming
that material is in place.

### 2. Recompute readiness — the step that actually matters

Everything else is bookkeeping. This one changes what you should study next.

If coverage was previously counted in **sessions** and is now counted in **task
statements**, every domain confidence in `learner/readiness.md` is wrong, and wrong in the
optimistic direction. Per [`.agents/TUTORIAL.md`](.agents/TUTORIAL.md) § Readiness scoring:

> mean drill accuracy on the domain's *own* task statements × (task statements covered ÷
> task statements in domain)

A domain reports itself closed at `4 of 4 sessions` while three of its seven task statements
have never been drilled. Recompute per domain:

```
confidence = mean_drill_accuracy × (statements_covered / statements_in_domain)
projected  = 100 + 9 × Σ(domain_weight × domain_confidence)
```

Count a statement covered only if it was **taught and drilled**. A statement taught inside a
session belonging to another domain still counts for the domain that owns it in
`BLUEPRINT.md` — credit content where the blueprint assigns it, not where it happened to be
taught.

Then rewrite the prose. Recomputing the table and leaving the narrative alone is the most
common way this migration half-lands: sections titled "F5 is closed and clean" or "no
further session should be spent here" become false the moment the denominator changes, and
they are what a future session actually reads to decide what to teach. Re-derive the
leverage ordering (`weight × shortfall`) too — which domain is the biggest risk, and which
session it starts at, both change.

### 3. Update the learner files

Four files, in this order. Steps 3a and 3b share arithmetic — commit them together so the
projection is never inconsistent between two files.

**3a. `learner/readiness.md`** — new confidences, new projection, `Basis` rewritten to cite
task statements rather than session counts, and the next-study prose rebuilt from step 2.

**3b. `learner/progress.md`** — header counts, both mermaid charts (domain confidence and
projected score), and the tier graphs. Rebuild the graphs from `SEQUENCE.md` rather than
patching nodes: node count, numbering, and drill placement all move, and a patched graph
tends to keep a stale edge. Mark completed sessions `done`, the true next session `next`.

**3c. `learner/profile.md`** — § Progress tier counts; append the new number and filename to
each § Session log header.

**Do not rewrite session-log bodies.** They record what happened on a date, under the
curriculum that existed then. Rewriting them to match a structure that did not exist yet
falsifies the record — and the logs are evidence for the mastery scores. Add a pointer,
keep the history.

Mark dropped-topic logs as such so a later reader does not go hunting for a prompt file that
was deleted. Then check § Review queue: items are due "at session N" under the old
numbering, and N now points somewhere else. Re-target by topic — find the session that
*owns* that item's task statement now.

**3d. `drills/deck.md`** — usually the least affected, because cards are keyed by concept.
Keep the cards; their content is still true. Two edits:

- Tag each card with its owning task-statement ID. This is what makes step 2's arithmetic
  auditable next time, and it is the difference between a deck that survives the next
  restructure and one that needs this whole procedure again.
- Cards from dropped sessions: tag as unattributed rather than deleting. They still drill
  real distinctions; they just no longer credit a domain's coverage.

Fix any in-card prose citing a session number.

### 4. Verify

```bash
# Stale session numbers in the files that route future sessions
rg -n "session [0-9]+" learner/progress.md learner/readiness.md

# Dead prompt-file references
rg -o "prompts/tier[0-9]/[0-9a-z-]+\.md" learner/ drills/ | sort -u | \
  cut -d: -f2 | while read f; do [ -f "$f" ] || echo "MISSING: $f"; done
```

Scoped to those two files deliberately: `profile.md` session logs and `deck.md` card prose
cite session numbers *historically* ("caught by the learner in session 5"), and step 3c says
to leave those alone. Sweeping all of `learner/` here would flag every one of them and train
you to ignore the check. Numbers that route future work live in `progress.md` and
`readiness.md`; those are the ones that must resolve.

Then confirm by hand: the projection arithmetic reproduces from the table above it, the
tier graphs' node counts match `SEQUENCE.md`, and the session marked `next` is genuinely
the lowest-numbered one you have not completed.

Commit:

```bash
git add learner/ drills/ && git commit -m "Migrate learner state to restructured curriculum"
```

### 5. Stop — the migration is the whole session

Do not go on to teach. Report what changed — the session map, the corrected projection, any
backfill gaps — and end, so the learner sends `Continue` for a fresh session.

The migration rewrote their record, and some of it was judgment: which sessions paired to
which rows, whether a partially-covered statement counts. That deserves a commit they can
read and object to, not a decision buried under a drill block they are already answering.
Routing is cleaner too — the next session is chosen from numbers this migration just
changed, so Step 2 should re-run against the migrated files rather than around them.

---

## Dropped topics

When a restructure deletes a topic you had already mastered, the default is **do not
re-teach it**. Exam items are written against the current § 6 task statements; a topic with
no owning statement earns no points. If its substance was folded into a statement you have
already covered, re-teaching spends a session to move the projection by zero.

Keep the mastery rows — they are true, and they are evidence about the learner. Just stop
counting them toward coverage, and note in the row where the material went.

Re-teach only if the topic is a genuine prerequisite for something still ahead of you, and
the new sequence assumes it without teaching it. That is rare and worth confirming against
the relevant prompt file's "What this session assumes" section before spending a session
on it.

---

## If the sync itself conflicted

This guide assumes the merge succeeded. If `git merge upstream/main` reported conflicts, a
harness file was edited locally — that is a different problem, and the fix is to restore
upstream's version of the file you do not own:

```bash
git checkout upstream/main -- <path>
```

Then re-run the sync and come back here. See [`AGENTS.md`](AGENTS.md) § File ownership for
who owns what.
