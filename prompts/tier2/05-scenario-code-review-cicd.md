# Scenario: Code Review in CI/CD — S5

**Foundations scenario archetype 5 of 6 · primary domains F2, F4**

## What this session is

An **exam-difficulty drill** on the automated-code-review-in-CI archetype. Not a teaching
session — Tier 1 session 7 taught the core, with 5–6 and 11–13 supporting. Teach only on
a miss.

The archetype's signature theme is **what changes when no human is in the loop**:
permissions can't be approved interactively, untrusted input reaches the context, and
cost scales with PR volume. Verify current CI integration and permission-mode specifics
against live docs (`code.claude.com/docs/en/github-actions`, `.../gitlab-ci-cd`,
`.../code-review`, `.../headless`, `.../permission-modes`, `.../sandboxing`) before
writing questions.

## Session focus

Drill the automated-code-review-in-CI archetype. Its signature theme is **what changes when no human is in the loop**: permissions can't be approved interactively, untrusted PR content reaches the context, and cost scales with PR volume. The crux is the propose/act boundary — make the learner state the reversibility argument explicitly, since that same rule decides the support archetype too. Verify CI and permission-mode specifics against live docs first. Keep questions at Foundations altitude; enterprise governance depth is Tier 3.

## Format

1. **Scenario brief** (250–400 words) with the deciding constraints.
2. **12–15 questions**, mixed multiple-choice and multiple-response ("Select all that apply").
3. Batches of 4–5; feedback only at batch end.
4. Full distractor autopsy on every question.
5. Domain mix: ~6 F2, ~4 F4, ~3 F3, ~2 F5.

## Building the scenario brief

Fresh each run. Must include:

- A repo with **PR volume figures** and a **monthly cost ceiling**, so the arithmetic matters
- **Outside or untrusted contributions** (forks, contractors) — the injection surface
- A **compliance or audit requirement** on automated changes
- A mix of **desired review behaviors**, some safe to automate and some not
- A **credential** the pipeline needs, with a stated sensitivity
- A **turnaround expectation** for review feedback
- A stated **current failure** — e.g. the pipeline was given broad permissions and pushed a
  commit no one reviewed, or per-PR cost is over budget

## Question coverage

At least once each:

- Permission mode and allowlist design for a non-interactive run
- The propose/act boundary: which actions the pipeline may take autonomously
- Sandboxing, and what's exposed without it
- Credential design — long-lived key vs. federated identity
- Prompt injection via PR body or diff content, and the mitigations
- Cost arithmetic against the stated ceiling and PR volume, and the lever that closes a gap
- Structuring output for the pipeline — exit codes, machine-readable results, review comments
- Which review checks should be deterministic tooling rather than model calls
- Tool error handling when a CI step's dependency fails
- Audit trail requirements for automated changes
- One question where **two configurations are defensible** and a stated constraint decides it

## Known traps to build distractors from

- Broad or bypass-all permissions chosen because CI has no human to approve
- Autonomous commit, push, or merge where propose-only is correct
- Long-lived API keys in repo secrets
- Treating PR-body content as trusted input
- Running on every PR without checking the cost arithmetic
- Using a model call for a check a linter does deterministically and cheaply
- No sandbox on a shared runner
- Unbounded run time or token spend per job

## Distractor autopsy requirements

Per question: correct answer plus deciding principle; per wrong option, the temptation and
the ruling tell; per miss, the named trap.

For the propose/act questions, make the learner state the **reversibility** argument
explicitly — that's the transferable rule, and it recurs in the support archetype too.

## How to run this session

1. **Frame** — drill format, batch feedback, closed-book. Note the no-human-in-the-loop theme.
2. Verify CI and permission-mode specifics from live docs before writing questions.
3. Present the brief; scenario-clarifying questions only.
4. Run the batches with autopsies.
5. **Final scoring:**

   ```
   S5 Code Review in CI/CD — [N]/[total] ([%])
   F2 [n]/[n] · F4 [n]/[n] · F3 [n]/[n] · F5 [n]/[n]
   ```

6. Name the two most transferable weaknesses.
7. Record per `.agents/TUTORIAL.md` Step 5. Misses become drill cards; update F2 and F4
   readiness. Log any doc discrepancy found while verifying.

## Out of scope

No new teaching. Genuine gaps get queued as review sessions. Enterprise governance depth
is Tier 3 material — keep questions at Foundations altitude.
