# Scenario: Code Review in CI/CD — S5

**Foundations scenario archetype 5 of 6 · primary domains F2, F3**

## What this session is

An **exam-difficulty drill** on the automated-code-review-in-CI archetype. Not a teaching
session — Claude Code & CI/CD taught the core, with the other F2 sessions and all F4
sessions supporting. Teach only on
a miss.

The archetype has two themes, and the **prompt-design** one carries more items than its
infrastructure sibling. The exam frames this scenario as designing review prompts that
give *actionable feedback and minimize false positives*; the pipeline mechanics
(permissions, injection surface, cost) are the setting that constrains those choices.
Verify current CI integration and permission-mode specifics against live docs
(`code.claude.com/docs/en/github-actions`, `.../gitlab-ci-cd`, `.../code-review`,
`.../headless`, `.../permission-modes`, `.../sandboxing`) before writing questions.

## Session focus

Drill the automated-code-review-in-CI archetype, weighted toward **prompt design**. The crux is **false positives as a trust problem**: a review bot that cries wolf in one category gets ignored in every category, so the fix is specific categorical criteria — not "be conservative", not a confidence threshold. Spend the most time there and on the severity-criteria and independent-review items. The secondary theme is what changes when no human is in the loop — permissions can't be approved interactively, untrusted PR content reaches the context, cost scales with PR volume — where the crux is the propose/act boundary; make the learner state the reversibility argument explicitly, since that rule decides the support archetype too. Verify CI and permission-mode specifics against live docs first. Keep questions at Foundations altitude; enterprise governance depth is Tier 3.

## Format

1. **Scenario brief** (250–400 words) with the deciding constraints.
2. **12–15 questions**, mixed multiple-choice and multiple-response ("Select all that apply").
3. Batches of 4–5; feedback only at batch end.
4. Full distractor autopsy on every question.
5. Domain mix: ~6 F2, ~5 F3, ~2 F4, ~2 F5.

## Building the scenario brief

Fresh each run. Must include:

- A repo with **PR volume figures** and a **monthly cost ceiling**, so the arithmetic matters
- **Outside or untrusted contributions** (forks, contractors) — the injection surface
- A **compliance or audit requirement** on automated changes
- A mix of **desired review behaviors**, some safe to automate and some not
- A **per-category false-positive breakdown** — one category (say, comment accuracy or
  naming) firing noisy findings developers routinely dismiss, while others are trusted —
  plus a stated dismissal rate, so the trust argument has numbers behind it
- **Inconsistent severity labels** across runs on comparable issues
- A **large multi-file PR** in the mix, so single-pass review is visibly the wrong shape
- A **credential** the pipeline needs, with a stated sensitivity
- A **turnaround expectation** for review feedback
- A stated **current failure** — e.g. the pipeline was given broad permissions and pushed a
  commit no one reviewed, or per-PR cost is over budget

## Question coverage

At least once each:

- **False positives and developer trust**: why a noisy category poisons confidence in the
  accurate ones, and why "be conservative" or "only report high-confidence findings"
  doesn't fix it — specific categorical criteria (what to report, what to skip) does
- **Temporarily disabling** a high-false-positive category to restore trust while its
  prompt is fixed, rather than leaving it noisy
- **Explicit severity criteria with concrete code examples** per level, as the fix for
  inconsistent severity labels
- **Few-shot examples** that distinguish acceptable patterns from genuine issues, and why
  they generalize where an enumerated rule list doesn't
- **Independent review instance vs. the generating session**, and why more thinking budget
  or a "review carefully" instruction is not the same fix
- **Per-file passes plus a cross-file integration pass** for a large PR, and what a single
  pass loses
- **Structured output for the pipeline** — `--output-format json` with `--json-schema` so
  findings post as inline comments, and what breaks without a schema
- **Re-running review after new commits**: including prior findings in context so it
  reports only new or still-unaddressed issues instead of duplicate comments
- **Test generation quality** — existing test files in context to avoid duplicate
  scenarios, and testing standards/fixtures documented in CLAUDE.md
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

- "Be conservative" / "only report high-confidence findings" / a confidence threshold
  chosen where specific categorical criteria are the fix
- Leaving a noisy category enabled while "improving the prompt", instead of disabling it
  until it's fixed
- Asking the generating session to review its own output more carefully, or raising its
  thinking budget, instead of using an independent instance
- Reviewing a 40-file PR in one pass
- Parsing review findings out of prose instead of enforcing a schema
- Re-posting the same findings on every push because prior findings aren't in context
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

For the false-positive questions, make them state the **trust** argument explicitly: the
cost isn't the wasted review, it's that developers start ignoring the accurate categories
too. And make them name *what* replaces the vague instruction — specific criteria for what
to report and what to skip — since "write a better prompt" is not an answer the exam
accepts. This generalizes to the extraction archetype, where the same move fixes
hallucinated fields.

## How to run this session

1. **Frame** — drill format, batch feedback, closed-book. Note both themes and their
   weighting: prompt design for actionable, low-false-positive feedback carries the most
   items; no-human-in-the-loop mechanics constrain it.
2. Verify CI and permission-mode specifics from live docs before writing questions.
3. Present the brief; scenario-clarifying questions only.
4. Run the batches with autopsies.
5. **Final scoring:**

   ```
   S5 Code Review in CI/CD — [N]/[total] ([%])
   F2 [n]/[n] · F3 [n]/[n] · F4 [n]/[n] · F5 [n]/[n]
   ```

6. Name the two most transferable weaknesses.
7. Record per `.agents/TUTORIAL.md` Step 5. Misses become drill cards; update F2 and F3
   readiness. Log any doc discrepancy found while verifying.

## Out of scope

No broad re-teaching — this is a drill, not a Tier 1 re-run. The one exception is a
**knowledge hole**: if the learner can't explain a concept when asked (as opposed to
misreading a question), stop, re-teach that single concept in 5 minutes, re-drill it, then
resume. See `.agents/TUTORIAL.md` § Teaching inside a drill for the distinction and the
two-per-session cap. Queue the review either way — the inline fix doesn't replace it.

Enterprise governance depth is Tier 3 material — keep questions at Foundations altitude.
