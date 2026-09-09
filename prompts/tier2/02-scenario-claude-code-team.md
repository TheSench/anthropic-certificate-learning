# Scenario: Claude Code Team Config — S2

**Foundations scenario archetype 2 of 6 · primary domain F2**

## What this session is

An **exam-difficulty drill** on the Claude Code team-configuration archetype. Not a
teaching session — Tier 1 sessions 5–7 taught this material. Teach only in response to a
miss.

This archetype is the most *precision-dependent* of the six: precedence and placement
questions have exactly one right answer. Before drilling, verify the current hierarchy and
precedence order against live docs (`code.claude.com/docs/en/memory`,
`.../settings`, `.../settings-reference`, `.../hooks`, `.../skills`) so no question is
built on a stale detail.

## Session focus

Drill the Claude Code team-configuration archetype. This is the most **precision-dependent** of the six — precedence and placement questions have exactly one right answer — so verify the current hierarchy against live docs before writing anything. The crux is guidance-vs-enforcement: the archetype's signature question is a rule sitting in CLAUDE.md that developers' agents keep ignoring. On precedence items, make the learner state the *rule* they applied, not just the answer; a right answer from a wrong rule fails on the next variation.

## Format

1. Present a **scenario brief** (250–400 words) with the deciding constraints.
2. **12–15 questions**, mixed multiple-choice and multiple-response ("Select all that apply").
3. Batches of 4–5; no feedback until the batch is complete.
4. Full distractor autopsy on every question after each batch, including correct answers.
5. Domain mix: ~9 F2, ~2 F4, ~2 F1, ~1 F5.

## Building the scenario brief

Fresh each run. Must include:

- An **organization shape** — headcount, number of teams, monorepo or polyrepo
- A **per-team difference** in tooling, language, or convention
- One requirement that **must not be overridable** by any developer
- One requirement that is a **preference**, not a mandate
- A **repeated multi-step procedure** the team performs manually today
- A **CI/CD requirement**
- A **security or compliance constraint** (secrets, protected paths, audit)
- A stated **current failure** — e.g. "the rule is in CLAUDE.md and developers' agents keep
  ignoring it"

That last item is the archetype's signature question: guidance where enforcement was
needed.

## Question coverage

At least once each:

- Which configuration layer a given rule belongs in, with a stated override requirement
- Predicting the **effective value** when three layers set the same key differently
- Root CLAUDE.md vs. path-scoped file in a monorepo
- Hook vs. CLAUDE.md instruction, where the requirement is mandatory
- Skill vs. slash command, on the model-invoked/user-invoked distinction
- Skill vs. subagent
- Permission mode and allowlist design for CI
- Plugin vs. per-repo duplication for distributing config
- Diagnosing why a configured rule isn't taking effect
- One question where **two placements are defensible** and a stated constraint decides it

## Known traps to build distractors from

- CLAUDE.md chosen for an enforceable constraint (the archetype's central trap)
- User-level scope where a managed/enterprise mandate is required
- Committed project settings where a personal preference belongs
- An over-broad skill description that would fire when it shouldn't
- Broad CI permissions chosen for convenience
- Autonomous commit/merge in CI where propose-only is correct
- A hook doing model-judgment work, or a skill doing enforcement work

## Distractor autopsy requirements

Per question: the correct answer plus the deciding rule; for each wrong option what makes
it tempting and the tell that rules it out; and for any miss, the named trap it maps to.

For precedence questions specifically, make the learner **state the rule** they applied,
not just the answer — a right answer from a wrong rule will fail on the next variation.

## How to run this session

1. **Frame** — drill format, batch feedback, closed-book. Note this archetype rewards
   precision over judgment, which makes it the most recoverable domain if they drill it.
2. Verify the config hierarchy from live docs before writing questions.
3. Present the brief; allow scenario-clarifying questions only.
4. Run the batches with autopsies.
5. **Final scoring:**

   ```
   S2 Claude Code Team Config — [N]/[total] ([%])
   F2 [n]/[n] · F4 [n]/[n] · F1 [n]/[n] · F5 [n]/[n]
   ```

6. Name the two most transferable weaknesses. If precedence rules were the problem, say so
   directly — that's memorizable, and worth a targeted drill before the mock.
7. Record per `.agents/TUTORIAL.md` Step 5. Every miss becomes a drill card; update F2
   readiness from measured accuracy. Log any doc discrepancy found while verifying.

## Out of scope

No broad re-teaching — this is a drill, not a Tier 1 re-run. The one exception is a
**knowledge hole**: if the learner can't explain a concept when asked (as opposed to
misreading a question), stop, re-teach that single concept in 5 minutes, re-drill it, then
resume. See `.agents/TUTORIAL.md` § Teaching inside a drill for the distinction and the
two-per-session cap. Queue the review either way — the inline fix doesn't replace it.

**This session normally runs interleaved inside Tier 1, at session 11** (see
`.agents/TUTORIAL.md` § Interleaved drills). At that point F1, F5 and F2 are taught but F3
and F4 are not — run the full set, converting its F4 questions to F2 or F1 ones, and note
the substitution in the log.
