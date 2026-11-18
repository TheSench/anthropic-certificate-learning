# Lifecycle: Migration, Deprecation, Handoff — P4 Evaluation, Testing, and Optimization

**Exam weight: 17%**

*Owns CCAR-P v1.1 § 5 task statements:*

- P4.7 — Model Version Migration: Evaluating migration readiness from a model deprecation
  timeline and regression results for a candidate version, and selecting the response
  (pin, re-tune prompts, re-baseline evaluations, or defer) that manages behavioral drift
  within the timeline.
- P6.3 — Operational Handoff Completeness: Identifying the missing assumption, dependency,
  or runbook element in a handoff package that would block the team receiving a Claude
  system entering operation, and specifying the documentation that closes the gap.

*P6.3 is credited to P6 (Stakeholder Communication and Lifecycle Management, 7%) in
readiness; the session is labelled P4 because migration is its larger half.*

## What this session assumes

Sessions 31, 34, and 39 (model selection; evals; decision records). Evals are the
precondition for everything here.

## Why this domain is worth 17% of your score

v1.1 moved model migration into P4: it is an evaluation decision, not a communication one.
A Claude system's model moves underneath it — versions are released and deprecated, and a
newer model behaves differently on the same prompt. The scored skill is reading a
deprecation timeline next to regression results and choosing the response that manages that
behavioral drift before the date. The second half, operational handoff, asks the same
question from the receiving team's side: what is missing from the package that would stop
them operating — or migrating — the system they've been given.

## Session focus

This session covers owning a system as its model moves, and handing it to the team that will. Verify the current deprecation schedule before teaching any date. The crux is **the timeline and the regression results together pick the response**: pin when the current version is supported long enough and the candidate regresses on a criterion that matters; re-tune prompts when the regression is a portability effect the prompt can fix within the time left; re-baseline the evaluations when the "regression" is the suite measuring conformance to the old model rather than the business criterion; defer only when retirement is far enough off to build the evidence first — never when the date falls before the work can finish. Spend the most time on that four-way choice under a stated deadline, including the realistic case of inheriting a system with a fixed retirement date and no suite. Land that a stronger model can score *worse* on your suite, because prompts aren't perfectly portable. Then teach handoff completeness as artifact review: find the missing assumption, dependency, or runbook element that would block the receiving team, and name the document that closes it.

## Authoritative sources

Verify the current deprecation schedule and migration guidance — dates and supported
models change, and a stale date is a wrong answer.

**Model lifecycle**
- <https://platform.claude.com/docs/en/about-claude/model-deprecations>
- <https://platform.claude.com/docs/en/about-claude/models/migration-guide>
- <https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions>
- <https://platform.claude.com/docs/en/models/overview>

**Model-specific migration notes** — each current model has its own migration guide;
find the one for the target model from the models overview rather than a hard-coded link
- <https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions> — what a model ID pins

**Prompt portability across models**
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

**Regression evidence and monitoring**
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://platform.claude.com/docs/en/manage-claude/analytics-api>
- <https://platform.claude.com/docs/en/manage-claude/usage-cost-api>

**SDK and platform version changes**
- <https://code.claude.com/docs/en/agent-sdk/migration-guide>
- <https://code.claude.com/docs/en/changelog>

## Teaching objectives

By the end, the learner can:

**Model version migration (P4.7)**

- Read a **deprecation timeline** — notice, deprecation, retirement — and compute the
  working time left against the effort the migration needs (eval runs, prompt work, canary)
- **Pin** by staying on a specific model ID until you choose to move. Know what an ID
  guarantees, from the model IDs page: a model ID maps to one fixed snapshot, and for
  current models the dateless ID is itself that pinned snapshot, not an evergreen
  pointer. Only some earlier models had convenience aliases that moved, and an alias
  update was behavioral drift arriving without a change on your side. So the current-model
  risk is not a silent alias change; it is the **retirement date**. Pinning buys
  reproducibility; it does not stop retirement
- Read **regression results** for a candidate version: which criteria moved, by how much
  against run-to-run variance (session 34), and whether the moved criteria are ones the
  business outcome depends on
- **Select the response** and justify it against the timeline:
  - **Pin** (stay on the current version) — the candidate regresses on a criterion that
    matters and the current version is supported long enough to fix it
  - **Re-tune prompts** — the regression is a portability effect (format, verbosity,
    instruction-following differences) the prompt can address, and there is time to re-run
    the suite after the change
  - **Re-baseline evaluations** — the suite's references, golden outputs, or judge encode
    the old model's style, so a correct but different answer scores as a failure. Re-baseline
    against the business criterion — and know the trap: re-baselining to make a real
    regression disappear
  - **Defer** — retirement is far enough off that building missing evidence first is
    cheaper than migrating blind; invalid when the date falls before the work can finish
- Explain why **prompts are not perfectly portable**, so a stronger model can score worse on
  your suite and still be the right target after re-tuning
- Run a migration as a managed process — eval on the candidate, compare to baseline,
  triage regressions, adjust, canary with a stated abort signal, roll out, with rollback at
  every stage
- Sequence the **inherited-no-evals** case: a fixed retirement date and no suite. Build the
  smallest suite that covers the criteria the business depends on first, baseline the
  current model before it retires, then migrate — and say why migrating without that
  baseline is the wrong answer

**Operational handoff completeness (P6.3)**

- Review a **handoff package** and classify what it should contain:
  - **Assumptions** — expected volume and input distribution, quality floor, cost envelope,
    human-review capacity, retention configuration, the pinned model and its retirement date
  - **Dependencies** — model version and surface, workspace and credential ownership and
    rotation, third-party MCP servers and Skills, the retrieval index and its rebuild
    pipeline, the eval suite and any judge model, spend limits and rate-limit tier
  - **Runbook elements** — known failure modes and what each looks like in the logs, the
    escalation path, rollback, the kill switch, how to re-run the evals, and the migration
    procedure for the next deprecation date
  - The **decision record** (session 39) and a **named owner** on the receiving side
- Identify the gap that would **block** operation rather than one that is merely nice to
  have, using the test: what could the receiving team not do on day one, at the first
  incident, or at the deprecation date?
- Specify the **document that closes it** — a runbook entry, an assumptions register, a
  dependency inventory with owners and dates, the eval suite and baseline — and hold to
  artifacts rather than activities: "a walkthrough session" is not documentation
- Explain why a handoff **without the eval suite and baseline** is the commonest blocking
  gap: the receiving team cannot safely change a prompt or migrate the model, so the system
  freezes until the retirement date forces an unvalidated change
- Distinguish this **operational handoff** (transferring a system to an owning team) from
  the **escalation handoff** taught in Tier 1 (passing one case to a human
  mid-conversation). Same word, different scope

## Decisions the exam actually tests

| Decision | The tell that decides it |
|---|---|
| Stay on the current ID vs. move now | Is the retirement date far enough out to migrate deliberately, and does the candidate pass the suite? |
| Pin vs. re-tune vs. re-baseline vs. defer | What regressed, why, and how much time is left before retirement? |
| Re-tune the prompt vs. accept the regression | Is the regression in a criterion the business outcome depends on? |
| Re-baseline vs. treat as a real regression | Does the eval penalize a correct answer for differing from the old model's style? |
| Defer vs. migrate now | Can the evidence be built before the retirement date? |
| Build evals first vs. migrate under deadline | Is there a baseline of the current model yet? |
| Canary vs. full cutover | Is the failure detectable quickly and reversible? |
| Which handoff gap blocks | What could the receiving team not do at day one, first incident, or deprecation? |
| Hand off now vs. keep operating | Does the receiving team have the eval suite, runbook, and dependency owners? |

## How to run this session

1. **Frame** — ownership over time, now scored under P4. The recurring right answer is
   still the eval suite.
2. **Verify the deprecation schedule and current model set** from live docs before teaching
   any date or model name.
3. **Teach the timeline and pinning.** Have the learner compute working time left for a
   stated retirement date and migration effort; ask what pinning does and doesn't buy.
4. **Teach reading regression results.** Give a per-criterion table for a candidate with
   one real regression, one within noise, and one that is a judge preferring the old
   model's style. Have them sort the three.
5. **Run the four-way choice — the block to spend time on.** Present the same regression
   results under three timelines (twelve months, ten weeks, three weeks to retirement) and
   have them choose pin, re-tune, re-baseline, or defer for each and justify it. The answer
   must change with the timeline.
6. **Teach prompt non-portability.** Ask whether a stronger model can score worse on their
   suite. It can — and understanding why is the point.
7. **Teach the inherited-no-evals situation** and have them sequence it under the deadline.
8. **Teach canary design** briefly, with the abort signal.
9. **Teach handoff completeness as artifact review.** Give a handoff package with one
   blocking gap (no retirement date recorded for the pinned model, or no rollback step, or
   an MCP server with no named owner) and two cosmetic ones. Have them find the blocking one
   using the day-one / first-incident / deprecation test, and name the closing document.
   Make sure the eval suite comes up; ask what the receiving team can do without it. Note
   the vocabulary collision with Tier 1's escalation handoff.
10. **Decision table** — walk all nine rows.
11. **Scenario drill — 6 questions**, standalone Professional format, each with a timeline
    or package excerpt. Include a pin-vs-re-tune question, a re-baseline question where the
    regression is an eval artifact, a defer question where the date makes deferral invalid,
    an inherited-no-evals sequencing question, a handoff item where a missing dependency or
    runbook element is the blocking gap, and one multiple-response on what a handoff package
    must contain for a system with an announced deprecation.
12. **Distractor autopsy** — expect migration without eval evidence, stronger-model upgrades
    assumed safe, re-baselining used to hide a real regression, deferral chosen when the
    retirement date falls inside the work, and handoffs treated as a meeting or a
    walkthrough rather than documentation that closes a gap.
13. Record per `.agents/TUTORIAL.md` Step 5.

## Out of scope

- Eval construction, judge bias, and trials per case → session 34
- Model selection criteria → session 31
- Deployment surface parity timing → session 29
- Writing decision records and unsupportable SLA commitments → session 39
- Team enablement → session 43
